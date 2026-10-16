/* Görünür İstanbul: shared pieces for every page.
   GI.style()      open map style: OpenFreeMap vector tiles (OSM), Mapzen/AWS terrain, our own colours
   GI.api(path)    same origin API (FastAPI on worf), JSON
   GI.fmt(n)       Turkish number format
   GI.label(...)   Turkish labels for item and scene codes */
"use strict";

const GI = (() => {
  const OFM = "https://tiles.openfreemap.org/planet";
  const DEM = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
  const ATTR = "Görüntüler © Mapillary katkıcıları, CC BY-SA 4.0 · İBB Açık Veri · Mapzen arazi";

  const C = {
    bg: "#0b1418", land: "#16242a", park: "#1f4237", water: "#0c3346", road: "#4a5f65", roadMajor: "#6d8288",
    d100: "#ff7a59", area: "#f2b35b", seen: "#4fd1c5", gap: "#ff5d73", bld0: "#bdb6a8", bld1: "#f1ebdf",
  };

  function style({ terrain = true, buildings = true, labels = true } = {}) {
    const layers = [
      { id: "bg", type: "background", paint: { "background-color": C.land } },
      ...(terrain ? [{ id: "hillshade", type: "hillshade", source: "dem",
        paint: { "hillshade-shadow-color": "#081014", "hillshade-highlight-color": "#33505a", "hillshade-exaggeration": 0.35 } }] : []),
      { id: "landcover", type: "fill", source: "omt", "source-layer": "landcover",
        paint: { "fill-color": "#1d3a33", "fill-opacity": 0.55 } },
      { id: "park", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": C.park, "fill-opacity": 0.75 } },
      { id: "water", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": C.water } },
      { id: "roads-minor", type: "line", source: "omt", "source-layer": "transportation",
        filter: ["!", ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]]],
        paint: { "line-color": C.road, "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.3, 17, 3] } },
      { id: "roads-major", type: "line", source: "omt", "source-layer": "transportation",
        filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
        paint: { "line-color": C.roadMajor, "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 17, 6] } },
    ];
    if (buildings) layers.push({ id: "buildings", type: "fill-extrusion", source: "omt", "source-layer": "building", minzoom: 12.5,
      paint: { "fill-extrusion-color": ["interpolate", ["linear"], ["coalesce", ["get", "render_height"], 6], 0, C.bld0, 40, C.bld1],
               "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
               "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
               "fill-extrusion-opacity": ["interpolate", ["linear"], ["zoom"], 12.5, 0, 13.5, 0.9] } });
    if (labels) layers.push({ id: "place-labels", type: "symbol", source: "omt", "source-layer": "place",
      filter: ["in", ["get", "class"], ["literal", ["suburb", "neighbourhood", "quarter", "town"]]],
      layout: { "text-field": ["coalesce", ["get", "name:tr"], ["get", "name"]], "text-font": ["Noto Sans Regular"],
                "text-size": ["interpolate", ["linear"], ["zoom"], 11, 10, 15, 13], "text-letter-spacing": 0.04 },
      paint: { "text-color": "#cfd8d6", "text-halo-color": "#0b1418", "text-halo-width": 1.4, "text-opacity": 0.85 } });
    const s = {
      version: 8,
      glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
      sources: { omt: { type: "vector", url: OFM } },
      sky: { "sky-color": "#0d1b22", "horizon-color": "#28414b", "fog-color": "#0d1b22",
             "sky-horizon-blend": 0.6, "horizon-fog-blend": 0.7, "fog-ground-blend": 0.35 },
      layers,
    };
    if (terrain) {
      s.sources.dem = { type: "raster-dem", tiles: [DEM], tileSize: 256, encoding: "terrarium", maxzoom: 14 };
      s.terrain = { source: "dem", exaggeration: 1.4 };
    }
    return s;
  }

  function map(container, opts = {}) {
    const m = new maplibregl.Map({
      container, style: style(opts.style), center: opts.center || [29.205, 40.895], zoom: opts.zoom || 12,
      pitch: opts.pitch ?? 60, bearing: opts.bearing ?? 35, maxPitch: 85,
      interactive: opts.interactive ?? true, attributionControl: false, fadeDuration: 0,
    });
    m.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: ATTR }), "bottom-right");
    // start collapsed (the "i" button opens it), so the credits never cover the map on a phone
    m.once("load", () => container && document.querySelectorAll(".maplibregl-ctrl-attrib").forEach(el => el.classList.remove("maplibregl-compact-show")));
    return m;
  }

  const fmt = n => (n === null || n === undefined || Number.isNaN(n)) ? "–" : Number(n).toLocaleString("tr-TR");
  const pct = (n, d = 0) => (n === null || n === undefined) ? "–" : "%" + Number(n).toLocaleString("tr-TR", { maximumFractionDigits: d });

  // the published pages call a Hugging Face Space and load images from a dataset (assets/config.js)
  const CFG = window.GI_CONFIG || {};
  const API_BASE = CFG.api || "";
  const img = viewId => !CFG.img ? `/views/${viewId}.jpg`
    : CFG.imgShard ? `${CFG.img}/${viewId.split("_")[0].slice(-2)}/${viewId}.jpg` : `${CFG.img}/${viewId}.jpg`;
  const viewSrc = src => (src && src.startsWith("/views/")) ? img(src.slice(7, -4)) : src;
  if (API_BASE) fetch(API_BASE + "/api/health", { cache: "no-store" }).catch(() => null);   // wake a sleeping Space early

  async function api(path, init) {
    const r = await fetch(API_BASE + path, init);
    if (!r.ok) throw new Error(`${r.status} ${path}`);
    return r.json();
  }
  const json = path => fetch(path).then(r => { if (!r.ok) throw new Error(path); return r.json(); });

  const ITEM_TR = {
    sidewalk: "Kaldırım", sidewalk_obstruction: "Kaldırım işgali", pedestrian_crossing: "Yaya geçidi", curb_ramp: "Rampa",
    accessibility_barrier: "Erişim engeli", street_trees: "Ağaç", other_greenery: "Yeşillik", shade_on_walkway: "Gölge",
    seating: "Oturma yeri", street_light_pole: "Aydınlatma direği", play_or_exercise_equipment: "Oyun ve spor aleti",
    public_art: "Kamusal sanat", drinking_fountain: "Çeşme", active_frontage: "Dükkân cephesi",
    commercial_outdoor_seating: "Kafe ve çay bahçesi", cycle_infrastructure: "Bisiklet yolu", waterfront: "Deniz ve kıyı",
    litter: "Çöp", view_obstruction: "Görüş engeli",
  };
  const SCENE_TR = {
    setting: { coastal_promenade: "Sahil yürüyüş yolu", coastal_road: "Sahil yolu", main_avenue: "Ana cadde", local_street: "Mahalle sokağı",
      alley_or_stairs: "Ara sokak ve merdiven", square_or_plaza: "Meydan", park_or_green_space: "Park", highway_or_overpass: "Otoyol ve köprü",
      industrial_or_construction: "Sanayi ve şantiye", other: "Diğer" },
    building_fabric: { none_visible: "Yapı yok", low_rise_houses: "Az katlı evler", mid_rise_apartments: "Apartmanlar", high_rise_towers: "Yüksek bloklar",
      mixed: "Karışık", industrial_or_warehouse: "Sanayi yapıları", historic_or_traditional: "Tarihî doku" },
    street_width: { narrow: "Dar", medium: "Orta", wide: "Geniş", not_applicable: "–" },
    slope: { flat: "Düz", gentle: "Hafif eğimli", steep: "Dik", not_visible: "–" },
    vehicle_traffic: { none: "Trafik yok", light: "Az trafik", heavy: "Yoğun trafik" },
    people: { none: "İnsan yok", few: "Birkaç kişi", many: "Kalabalık" },
    signage: { none: "Tabela yok", some: "Biraz tabela", dense: "Yoğun tabela" },
    light: { sunny: "Güneşli", overcast: "Bulutlu", low_sun: "Alçak güneş", night: "Gece", other: "Diğer" },
  };
  const DIR_TR = { front: "Ön", right: "Sağ", back: "Arka", left: "Sol" };
  const label = (group, code) => group === "item" ? (ITEM_TR[code] || code) : ((SCENE_TR[group] || {})[code] || code);

  const PAGES = [["story", "index.html", "Hikâye", "Hikâye"], ["prova", "prova.html", "Prova", "Prova"],
    ["atlas", "atlas.html", "Sokak Atlası", "Atlas"], ["ask", "ask.html", "Görüntülere Sor", "Sor"],
    ["kent", "lab.html", "Kent Atölyesi", "Atölye"], ["data", "veri.html", "Veri", "Veri"]];
  function nav(active) {
    const el = document.querySelector(".topnav");
    if (!el) return;
    el.innerHTML = `<a class="brand" href="index.html"><i></i><span>Görünür İstanbul</span></a>` + PAGES.map(([k, href, long, short]) =>
      `<a data-page="${k}" href="${href}"${k === active ? ' class="on" aria-current="page"' : ""}><span class="long">${long}</span><span class="short">${short}</span></a>`).join("");
  }

  // before / after slider; `after` is drawn over `before` from the slider to the right edge
  function compare(before, after, { left = "Gerçek sokak", right = "Yapay zekâ", wide = false, start = 50 } = {}) {
    return `<div class="compare${wide ? " wide" : ""}"><img src="${before}" alt="${left}"><div class="after-wrap"><img src="${after}" alt="${right}"></div>
      <div class="bar"></div><span class="tag l">${left}</span><span class="tag r">${right}</span>
      <input type="range" min="0" max="100" value="${start}" aria-label="${left} ve ${right} karşılaştırma"></div>`;
  }
  function bindCompare(root) {
    root.querySelectorAll(".compare").forEach(c => {
      const r = c.querySelector("input"), w = c.querySelector(".after-wrap"), b = c.querySelector(".bar");
      const set = () => { w.style.clipPath = `inset(0 0 0 ${r.value}%)`; b.style.left = r.value + "%"; };
      r.addEventListener("input", set); set();
    });
  }

  return { C, style, map, api, json, fmt, pct, label, ITEM_TR, SCENE_TR, DIR_TR, nav, ATTR, compare, bindCompare, img, viewSrc };
})();
