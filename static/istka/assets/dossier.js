/* The place dossier: one panorama, its four views, the model's description, scene facts and observed items.
   GI.dossier.open(image_id, focusViewId) */
"use strict";

GI.dossier = (() => {
  let el;
  const DIRS = ["front", "right", "back", "left"];
  const SCENE_ORDER = ["setting", "building_fabric", "street_width", "slope", "light", "people", "vehicle_traffic", "signage"];
  const SCENE_NAME = { setting: "Mekân türü", building_fabric: "Yapı dokusu", street_width: "Sokak genişliği", slope: "Eğim",
    light: "Işık", people: "İnsan", vehicle_traffic: "Trafik", signage: "Tabela" };

  function build() {
    el = document.createElement("div");
    el.className = "dossier"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Mekân dosyası");
    el.innerHTML = `<button class="pill close" type="button">Kapat ✕</button><div class="inner"></div>`;
    document.body.appendChild(el);
    el.querySelector(".close").addEventListener("click", close);
    el.addEventListener("click", e => { if (e.target === el) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  function close() { el.classList.remove("open"); document.body.style.overflow = ""; }

  async function open(imageId, focus) {
    if (!el) build();
    const inner = el.querySelector(".inner");
    inner.innerHTML = `<p class="status">Yükleniyor…</p>`;
    el.classList.add("open"); document.body.style.overflow = "hidden";
    const { views } = await GI.api(`/api/pano/${encodeURIComponent(imageId)}`);
    views.sort((a, b) => DIRS.indexOf(a.direction) - DIRS.indexOf(b.direction));
    const main = views.find(v => v.view_id === focus && v.description_ok !== false) || views.find(v => v.description_ok !== false) || views[0];
    const present = Object.keys(GI.ITEM_TR).filter(k => views.some(v => v[`item_${k}_state`] === "present"));
    const absentAll = Object.keys(GI.ITEM_TR).filter(k => !present.includes(k) && views.filter(v => v[`item_${k}_state`] === "absent").length >= 2);
    inner.innerHTML = `
      <div class="kicker" style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)">Mekân dosyası</div>
      <h3>${main.neighborhood || ""}${main.neighborhood ? ", " : ""}${main.district || ""}</h3>
      <div class="meta">${main.captured_local || ""} · ${main.lat.toFixed(5)}, ${main.lon.toFixed(5)} · izin makamı: ${main.district || "–"} Belediyesi</div>
      <div class="views4">${views.map(v => `<figure><img src="${GI.img(v.view_id)}" alt="${GI.DIR_TR[v.direction]} görünüm" loading="lazy"><figcaption>${GI.DIR_TR[v.direction]}</figcaption></figure>`).join("")}</div>
      <p class="desc">${main.description_ok === false ? '<span class="note">Bu görünümün betimlemesi kontrolden geçmedi (yer adı ya da başka bir dil içeriyordu), gösterilmiyor.</span>' : (main.scene_description_tr || "")}</p>
      <div class="facts">${SCENE_ORDER.map(f => `<div>${SCENE_NAME[f]}<b>${GI.label(f, main["scene_" + f])}</b></div>`).join("")}</div>
      <div class="seg-label">Dört görünümde görülenler</div>
      <div class="items">${present.map(k => `<span class="p">${GI.ITEM_TR[k]}</span>`).join("") || "<span>–</span>"}</div>
      <div class="seg-label">Görülmeyenler</div>
      <div class="items">${absentAll.map(k => `<span>${GI.ITEM_TR[k]}</span>`).join("") || "<span>–</span>"}</div>
      <details><summary>Bu dosya nasıl oluştu</summary>
        <p>Görüntüler Mapillary'deki açık bir 360° panoramadan dört yöne bölündü. Betimleme ve öğeler bir görsel dil modelinin (Qwen3.5-4B) gözlemidir, ölçüm değildir. Çekim izni veremeyiz, yalnızca izin makamını gösteririz.</p>
        <p><a href="${main.mapillary_url}" target="_blank" rel="noopener">Görüntünün Mapillary sayfası ve katkıcısı ↗</a> · CC BY-SA 4.0</p>
      </details>`;
  }

  return { open, close };
})();
