/* Görüntülere Sor: live text and photo search against the API on worf; results on a grid and a map. */
"use strict";

(() => {
  const $ = s => document.querySelector(s);
  const status = $("[data-status]"), grid = $("[data-results]"), form = $("[data-form]");
  const map = GI.map("map", { center: [29.19, 40.892], zoom: 12.6, pitch: 45, bearing: 20, style: { labels: true } });
  let markers = [];

  GI.api("/api/health").catch(() => {
    status.textContent = "Arama sunucusuna ulaşılamadı.";
  });

  function show(results, label) {
    markers.forEach(m => m.remove()); markers = [];
    if (!results.length) { grid.innerHTML = ""; status.textContent = "Sonuç yok."; return; }
    status.textContent = `${label}: ${results.length} sahne, her panoramadan bir görünüm.`;
    grid.innerHTML = results.map((r, i) => `
      <button class="tile" type="button" data-i="${i}" aria-label="${i + 1}. sonuç, ${r.neighborhood || r.district}">
        <img src="${GI.img(r.view_id)}" alt="" loading="lazy"><span class="cap">${i + 1} · ${r.neighborhood || r.district || ""}</span>
      </button>`).join("");
    const bounds = new maplibregl.LngLatBounds();
    results.forEach((r, i) => {
      const el = document.createElement("button");
      el.type = "button"; el.className = "pin"; el.textContent = i + 1;
      el.style.cssText = "width:24px;height:24px;border-radius:50%;border:2px solid #0b1418;background:#4fd1c5;color:#0b1418;font:700 11px Inter,system-ui;cursor:pointer";
      el.addEventListener("click", () => GI.dossier.open(r.image_id, r.view_id));
      markers.push(new maplibregl.Marker({ element: el }).setLngLat([r.lon, r.lat]).addTo(map));
      bounds.extend([r.lon, r.lat]);
    });
    map.fitBounds(bounds, { padding: 60, maxZoom: 15.5, duration: 1200 });
    grid.querySelectorAll(".tile").forEach(t => {
      const r = results[Number(t.dataset.i)];
      t.addEventListener("click", () => GI.dossier.open(r.image_id, r.view_id));
      t.addEventListener("mouseenter", () => map.easeTo({ center: [r.lon, r.lat], duration: 500 }));
    });
  }

  async function search(q) {
    status.textContent = "Aranıyor…"; grid.innerHTML = "";
    try {
      const res = await GI.api(`/api/search?q=${encodeURIComponent(q)}&k=24`);
      show(res.results, `“${q}”`);
      history.replaceState(null, "", "#q=" + encodeURIComponent(q));
    } catch (e) { status.textContent = "Arama yapılamadı. Sunucu uyanıyor olabilir, biraz sonra tekrar dene."; }
  }

  form.addEventListener("submit", e => { e.preventDefault(); const q = form.q.value.trim(); if (q.length >= 2) search(q); });
  $("[data-chips]").addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") { form.q.value = e.target.textContent; search(e.target.textContent); }
  });
  $("[data-upload]").addEventListener("change", async e => {
    const f = e.target.files[0];
    if (!f) return;
    status.textContent = "Fotoğrafa benzeyen sahneler aranıyor…"; grid.innerHTML = "";
    const body = new FormData(); body.append("file", f);
    try { const res = await GI.api("/api/similar?k=24", { method: "POST", body }); show(res.results, "Fotoğrafa benzeyenler"); }
    catch (err) { status.textContent = "Fotoğrafla arama yapılamadı."; }
    e.target.value = "";
  });

  const m = location.hash.match(/q=([^&]+)/);
  if (m) { form.q.value = decodeURIComponent(m[1]); search(form.q.value); }
})();
