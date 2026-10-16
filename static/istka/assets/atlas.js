/* Sokak Atlası: scene filters as button groups, optional scene description, results on a grid and a map,
   a shortlist kept in this browser only. */
"use strict";

(() => {
  const $ = s => document.querySelector(s);
  const FILTERS = [
    ["setting", "Mekân", ["coastal_promenade", "coastal_road", "main_avenue", "local_street", "alley_or_stairs", "square_or_plaza", "park_or_green_space", "highway_or_overpass"]],
    ["building_fabric", "Yapı", ["low_rise_houses", "mid_rise_apartments", "high_rise_towers", "mixed", "historic_or_traditional", "industrial_or_warehouse"]],
    ["slope", "Eğim", ["flat", "gentle", "steep"]],
    ["street_width", "Genişlik", ["narrow", "medium", "wide"]],
    ["light", "Işık", ["sunny", "overcast", "low_sun"]],
    ["people", "İnsan", ["none", "few", "many"]],
    ["vehicle_traffic", "Trafik", ["none", "light", "heavy"]],
  ];
  const sel = {}, status = $("[data-status]"), grid = $("[data-results]"), more = $("[data-more]"), form = $("[data-form]");
  let page = 0, sea = false, last = [], markers = [];
  const map = GI.map("map", { center: [29.19, 40.892], zoom: 12.6, pitch: 45, bearing: 20 });

  $("[data-filters]").className = "filters";
  $("[data-filters]").innerHTML = FILTERS.map(([f, name, vals]) => `<div>
    <div class="seg-label">${name}</div>
    <div class="seg" role="group" aria-label="${name}">${vals.map(v => `<button type="button" data-f="${f}" data-v="${v}">${GI.label(f, v)}</button>`).join("")}</div></div>`).join("")
    + `<div><div class="seg-label">Deniz</div><div class="seg"><button type="button" data-sea>Deniz görünsün</button></div></div>`;

  $("[data-filters]").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-sea")) { sea = !sea; b.classList.toggle("on", sea); }
    else { const set = sel[b.dataset.f] ||= new Set(); set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v); b.classList.toggle("on"); }
    page = 0; run();
  });

  const params = () => {
    const p = new URLSearchParams();
    Object.entries(sel).forEach(([f, set]) => set.size && p.set(f, [...set].join(",")));
    if (sea) p.set("sea", "1");
    return p;
  };

  async function run(append = false) {
    const q = form.q.value.trim();
    const p = params();
    status.textContent = "Aranıyor…";
    try {
      let res, total = null;
      if (q.length >= 2) { p.set("q", q); p.set("k", "36"); res = await GI.api("/api/search?" + p); more.hidden = true; }
      else { p.set("k", "36"); p.set("page", page); res = await GI.api("/api/atlas?" + p); total = res.total_panoramas; more.hidden = (page + 1) * 36 >= total; }
      last = append ? last.concat(res.results) : res.results;
      draw();
      status.textContent = total !== null ? `${GI.fmt(total)} panorama bu süzgeçlere uyuyor.` : `“${q}” için ${last.length} sahne.`;
    } catch (e) { status.textContent = "Atlas sunucusuna ulaşılamadı."; }
  }

  function tile(r, i, removable) {
    return `<div class="tile" data-i="${i}"><img src="${GI.img(r.view_id)}" alt="" loading="lazy">
      <span class="cap">${GI.label("setting", r.scene_setting)} · ${r.neighborhood || r.district || ""}</span>
      <button type="button" class="pill" data-star style="position:absolute;top:6px;right:6px;padding:4px 9px;font-size:12px">${removable ? "Çıkar" : "＋ Liste"}</button></div>`;
  }

  function draw() {
    grid.innerHTML = last.map((r, i) => tile(r, i, false)).join("");
    grid.querySelectorAll(".tile").forEach(t => {
      const r = last[Number(t.dataset.i)];
      t.addEventListener("click", e => { if (e.target.hasAttribute("data-star")) { add(r); e.stopPropagation(); } else GI.dossier.open(r.image_id, r.view_id); });
    });
    markers.forEach(m => m.remove()); markers = [];
    last.forEach(r => {
      const el = document.createElement("div");
      el.style.cssText = "width:10px;height:10px;border-radius:50%;background:#f2b35b;border:2px solid #0b1418;cursor:pointer";
      el.addEventListener("click", () => GI.dossier.open(r.image_id, r.view_id));
      markers.push(new maplibregl.Marker({ element: el }).setLngLat([r.lon, r.lat]).addTo(map));
    });
  }

  // shortlist in this browser only
  const KEY = "gi-shortlist";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } };
  const save = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { /* storage off */ } };
  let short = load();
  function add(r) { if (!short.some(s => s.view_id === r.view_id)) { short.push(r); save(short); drawShort(); } }
  function drawShort() {
    $("[data-short-count]").textContent = short.length ? `(${short.length})` : "";
    const box = $("[data-shortlist]");
    box.innerHTML = short.map((r, i) => tile(r, i, true)).join("") || `<p class="note">Henüz boş. Sonuçlarda “＋ Liste”ye bas.</p>`;
    box.querySelectorAll(".tile").forEach(t => {
      const r = short[Number(t.dataset.i)];
      t.addEventListener("click", e => {
        if (e.target.hasAttribute("data-star")) { short = short.filter(s => s.view_id !== r.view_id); save(short); drawShort(); e.stopPropagation(); }
        else GI.dossier.open(r.image_id, r.view_id);
      });
    });
  }

  form.addEventListener("submit", e => { e.preventDefault(); page = 0; run(); });
  more.addEventListener("click", () => { page += 1; run(true); });
  const m = location.hash.match(/q=([^&]+)/);
  if (m) form.q.value = decodeURIComponent(m[1]);
  drawShort();
  run();
})();
