/* Kent Atölyesi: the movable city kit on three empty public spaces, the pool of public-space ideas,
   and the public-space layers read from street images. */
"use strict";

(async () => {
  const $ = s => document.querySelector(s);
  const stats = await GI.json("data/site_stats.json");
  const map = GI.map("map", { center: [29.19, 40.892], zoom: 13.4, pitch: 50, bearing: 15 });
  let markers = [];
  const clearMarkers = () => { markers.forEach(m => m.remove()); markers = []; };
  const marker = (lon, lat, color = "#f2b35b") => {
    const el = document.createElement("div");
    el.style.cssText = `width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #0b1418;box-shadow:0 0 0 6px rgba(242,179,91,.25)`;
    markers.push(new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map));
  };

  // ---- Kent Kiti
  let kent = { items: [] }, site = 0, kit = "kit_golge";
  try { kent = await GI.json("data/kent.json"); } catch (e) { /* not produced yet */ }
  const sites = kent.items.filter(i => i.looks.length);
  $("[data-sites]").innerHTML = sites.map((s, k) => `<button type="button" data-k="${k}">${s.title}</button>`).join("");
  function drawKit() {
    if (!sites.length) { $("[data-kit-media]").innerHTML = `<p class="status">Kit görselleri henüz hazır değil.</p>`; return; }
    const s = sites[site];
    if (!s.looks.some(l => l.look === kit)) kit = s.looks[0].look;
    $("[data-sites]").querySelectorAll("button").forEach(b => b.classList.toggle("on", Number(b.dataset.k) === site));
    $("[data-kits]").innerHTML = s.looks.map(l => `<button type="button" data-l="${l.look}"${l.look === kit ? ' class="on"' : ""}>${l.look_tr}</button>`).join("");
    const l = s.looks.find(x => x.look === kit);
    const m = $("[data-kit-media]");
    m.innerHTML = GI.compare(s.src, l.img, { left: "Bugün", right: l.look_tr, wide: true })
      + (l.video ? `<div class="media" style="margin-top:10px"><video src="${l.video.mp4}" poster="${l.video.poster}" muted loop playsinline controls></video></div>` : "");
    GI.bindCompare(m);
    $("[data-kit-meta]").innerHTML = `${s.neighborhood}, ${s.district} · <a href="${s.mapillary_url}" target="_blank" rel="noopener">Kaynak görüntü (Mapillary)</a>`
      + (l.verified === null ? "" : ` · ${l.verified ? "✓ denetim modeli kiti görüyor" : "✕ denetim modeli kiti göremedi"}`);
    clearMarkers();
    sites.forEach((x, k) => marker(x.lon, x.lat, k === site ? "#f2b35b" : "#7f918e"));
    map.flyTo({ center: [s.lon, s.lat], zoom: 17.2, pitch: 66, bearing: s.heading || 0, speed: 0.8 });
  }
  $("[data-sites]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { site = Number(b.dataset.k); drawKit(); } });
  $("[data-kits]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { kit = b.dataset.l; drawKit(); } });

  // ---- street and building design
  let design = null, dsel = 0;
  async function loadDesign() {
    if (!design) {
      try { design = await GI.json("data/tasarim.json"); } catch (e) { design = { items: [] }; }
      $("[data-designs]").innerHTML = design.items.map((d, k) => `<button type="button" data-k="${k}">${d.title}</button>`).join("");
    }
    drawDesign();
  }
  function drawDesign() {
    if (!design.items.length) { $("[data-design-media]").innerHTML = `<p class="status">Senaryolar henüz hazır değil.</p>`; return; }
    const d = design.items[dsel];
    $("[data-designs]").querySelectorAll("button").forEach(b => b.classList.toggle("on", Number(b.dataset.k) === dsel));
    const m = $("[data-design-media]");
    m.innerHTML = GI.compare(d.src, d.img, { left: "Bugün", right: d.title, wide: true, start: 12 })
      + (d.video ? `<div class="media" style="margin-top:10px"><video src="${d.video.mp4}" poster="${d.video.poster}" muted loop playsinline controls></video></div>` : "");
    GI.bindCompare(m);
    $("[data-design-meta]").innerHTML = `<b style="color:var(--ink)">Kimin için:</b> ${d.who} · ${d.place}, ${d.neighborhood}, ${d.district} · <a href="${d.mapillary_url}" target="_blank" rel="noopener">Kaynak görüntü (Mapillary)</a>`
      + (d.verified === null ? "" : ` · ${d.verified ? "✓ denetim modeli değişikliği görüyor" : "✕ denetim modeli değişikliği göremedi"}`);
    clearMarkers();
    marker(d.lon, d.lat);
    map.flyTo({ center: [d.lon, d.lat], zoom: 17.2, pitch: 66, bearing: d.heading || 0, speed: 0.8 });
  }
  $("[data-designs]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { dsel = Number(b.dataset.k); drawDesign(); } });

  // ---- public-space layers
  const GROUPS = [
    ["Yeşil ve gölge", ["street_trees", "other_greenery", "shade_on_walkway"]],
    ["Kamusal donatı", ["seating", "play_or_exercise_equipment", "public_art", "drinking_fountain", "street_light_pole"]],
    ["Yaya ve erişim", ["sidewalk", "sidewalk_obstruction", "pedestrian_crossing", "curb_ramp", "accessibility_barrier"]],
    ["Canlılık", ["active_frontage", "commercial_outdoor_seating", "waterfront"]],
  ];
  let item = "shade_on_walkway";
  $("[data-items]").outerHTML = `<div data-items>${GROUPS.map(([g, ks]) => `<div class="seg-label">${g}</div>
    <div class="seg" role="group" aria-label="${g}">${ks.map(k => `<button type="button" data-k="${k}">${GI.ITEM_TR[k]}</button>`).join("")}</div>`).join("")}</div>`;
  function setItem(k) {
    item = k;
    $("[data-items]").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.k === k));
    if (map.getLayer("panos")) map.setPaintProperty("panos", "circle-color", ["match", ["get", k], -1, "#3b4a4f", 0, "#ff7a59", 1, "#9fe3db", 2, "#6fd9ce", "#4fd1c5"]);
    const iq = (stats.item_quality || {})[k];
    const LV = { high: ["yüksek güven", "#4fd1c5"], medium: ["orta güven", "#f2b35b"], low: ["düşük güven, deneysel", "#ff7a59"] };
    const lv = iq ? LV[iq.level] : null;
    $("[data-trust]").innerHTML = lv ? `<span style="display:inline-block;font-size:11px;padding:3px 8px;border-radius:999px;border:1px solid ${lv[1]};color:${lv[1]}">${GI.ITEM_TR[k]} · ${lv[0]}</span>` : "";
  }
  $("[data-items]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setItem(b.dataset.k); });

  // ---- ideas pool
  let ideas = null, ideaType = "all";
  async function loadIdeas() {
    if (!ideas) {
      try { ideas = await GI.json("data/ideas.json"); } catch (e) { ideas = { items: [] }; }
      const types = [...new Map(ideas.items.map(i => [i.idea, i.idea_tr])).entries()];
      $("[data-idea-types]").innerHTML = `<button type="button" data-t="all" class="on">Hepsi</button>` +
        types.map(([k, n]) => `<button type="button" data-t="${k}">${n}</button>`).join("");
      const v = ideas.verify || {};
      $("[data-ideas-note]").textContent = ideas.items.length
        ? `${GI.fmt(v.edits)} görselin ${GI.fmt(v.added_feature_seen)} tanesinde denetim modeli eklenen öğeyi görüyor. Model: ${ideas.model}.`
        : "Fikir görselleri henüz üretilmedi.";
    }
    drawIdeas();
  }
  function drawIdeas() {
    const list = ideas.items.filter(i => ideaType === "all" || i.idea === ideaType);
    $("[data-ideas]").style.gridTemplateColumns = "1fr";
    $("[data-ideas]").innerHTML = list.map(i => `<div>${GI.compare(i.before, i.after, { left: "Bugün", right: i.idea_tr })}
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink-2);margin:6px 2px 4px">
        <span><b style="color:var(--ink)">${i.idea_tr}</b> · ${i.neighborhood || ""}, ${i.district}</span>
        <span>${i.added_feature_seen ? "✓ model öğeyi görüyor" : "✕ model öğeyi görmüyor"}</span></div></div>`).join("");
    GI.bindCompare($("[data-ideas]"));
    clearMarkers();
    list.forEach(i => marker(i.lon, i.lat));
  }
  $("[data-idea-types]").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    ideaType = b.dataset.t;
    $("[data-idea-types]").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    drawIdeas();
  });

  // ---- modes
  function setMode(m) {
    $("[data-mode]").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.m === m));
    document.querySelectorAll("[data-panel]").forEach(p => { p.hidden = p.dataset.panel !== m; });
    if (map.getLayer("panos")) map.setLayoutProperty("panos", "visibility", m === "items" ? "visible" : "none");
    clearMarkers();
    if (m === "kit") drawKit();
    if (m === "design") loadDesign();
    if (m === "ideas") loadIdeas();
    if (m === "items") map.flyTo({ center: [29.19, 40.892], zoom: 13.4, pitch: 50, bearing: 15 });
    history.replaceState(null, "", "#" + m);
  }
  $("[data-mode]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setMode(b.dataset.m); });

  map.on("load", () => {
    map.addSource("panos", { type: "geojson", data: "data/panos.geojson" });
    map.addLayer({ id: "panos", type: "circle", source: "panos", layout: { visibility: "none" },
      paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 1.8, 16, 5, 18, 9], "circle-color": "#3b4a4f",
               "circle-stroke-color": "#0b1418", "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 14, 0, 16, 1] } });
    map.on("click", "panos", e => GI.dossier.open(e.features[0].properties.image_id));
    map.on("mouseenter", "panos", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "panos", () => { map.getCanvas().style.cursor = ""; });
    setItem(item);
    const start = location.hash.slice(1);
    setMode(["kit", "design", "ideas", "items"].includes(start) ? start : "kit");
  });
})();
