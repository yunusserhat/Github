/* Home page: one fixed 3D map, a scroll story on top.
   Each <section class="step"> carries data-cam='{"center":[lon,lat],"zoom":..,"pitch":..,"bearing":..}'
   and data-show="layerA,layerB". When a step comes into view the camera flies there in an arc and the
   listed story layers fade in; between steps the camera turns slowly. A dot navigator sits on the right. */
"use strict";

(async () => {
  const stats = await GI.json("data/site_stats.json");
  document.querySelectorAll("[data-stat]").forEach(el => {
    const v = el.dataset.stat.split(".").reduce((o, k) => (o ? o[k] : undefined), stats);
    el.textContent = (el.dataset.fmt === "pct" ? GI.pct(v, Number(el.dataset.dec || 0)) : GI.fmt(v)) + (el.dataset.suffix || "");
  });

  const steps = [...document.querySelectorAll(".step")];
  const first = JSON.parse(steps[0].dataset.cam);
  const map = GI.map("map", { ...first, interactive: false });
  window.giMap = map;

  const STORY = {};   // id -> list of map layer ids belonging to that story layer
  let orbitOn = true, current = -1, flying = false;

  map.on("load", async () => {
    const LAZY = {};
    const add = (id, src, layers) => { LAZY[id] = src._url; delete src._url; map.addSource(id, src); layers.forEach(l => map.addLayer(l)); STORY[id] = layers.map(l => l.id); hide(id); };
    window.giLazy = LAZY;
    const gj = url => ({ type: "geojson", data: { type: "FeatureCollection", features: [] }, _url: url });
    add("area", gj("data/study_area.geojson"), [
      { id: "area-fill", type: "fill", source: "area", paint: { "fill-color": GI.C.area, "fill-opacity": 0.06 } },
      { id: "area-line", type: "line", source: "area", paint: { "line-color": GI.C.area, "line-width": 2, "line-dasharray": [2, 1.5] } }]);
    add("panos", gj("data/panos.geojson"), [
      { id: "panos-dot", type: "circle", source: "panos",
        paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 1.2, 15, 3.2, 18, 7],
                 "circle-color": ["match", ["get", "q"], "2025-Q4", "#7cc6ff", "2026-Q1", "#4fd1c5", "2026-Q2", "#a7e26b", "2026-Q3", "#f2b35b", "#cfd8d6"],
                 "circle-opacity": 0.9, "circle-stroke-width": 0 } }]);
    add("items", gj("data/panos.geojson"), [
      { id: "items-dot", type: "circle", source: "items",
        paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 1.6, 16, 4.5, 18, 8],
                 "circle-color": "#4fd1c5", "circle-opacity": 0.95 } }]);
    add("showcase", gj("data/showcase.geojson"), [
      { id: "showcase-ring", type: "circle", source: "showcase",
        paint: { "circle-radius": 16, "circle-color": "rgba(0,0,0,0)", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2.5 } },
      { id: "showcase-dot", type: "circle", source: "showcase", paint: { "circle-radius": 5, "circle-color": "#ffffff" } }]);
    add("spot", { type: "geojson", data: { type: "FeatureCollection", features: [] } }, [
      { id: "spot-glow", type: "circle", source: "spot", paint: { "circle-radius": 26, "circle-color": "#f2b35b", "circle-opacity": 0.18, "circle-blur": 0.6 } },
      { id: "spot-ring", type: "circle", source: "spot",
        paint: { "circle-radius": 13, "circle-color": "rgba(0,0,0,0)", "circle-stroke-color": "#f2b35b", "circle-stroke-width": 3 } },
      { id: "spot-dot", type: "circle", source: "spot", paint: { "circle-radius": 4.5, "circle-color": "#ffffff" } }]);
    add("istanbul", gj("data/istanbul_districts.geojson"), [
      { id: "ist-line", type: "line", source: "istanbul", paint: { "line-color": "#cfd8d6", "line-width": 0.8, "line-opacity": 0.5 } }]);
    observe();
    turn();
  });

  function hide(id) { (STORY[id] || []).forEach(l => map.getLayer(l) && map.setLayoutProperty(l, "visibility", "none")); }
  const loaded = new Set();
  function show(id) {
    const lazy = window.giLazy || {};
    if (lazy[id] && !loaded.has(id)) { loaded.add(id); map.getSource(id).setData(lazy[id]); }
    (STORY[id] || []).forEach(l => map.getLayer(l) && map.setLayoutProperty(l, "visibility", "visible"));
  }

  function go(i) {
    if (i === current) return;
    current = i;
    const s = steps[i];
    const want = new Set((s.dataset.show || "").split(",").filter(Boolean));
    Object.keys(STORY).forEach(id => (want.has(id) ? show(id) : hide(id)));
    if (s.dataset.item) setItem(s.dataset.item);
    if (s.dataset.spot && map.getSource("spot")) {
      const p = JSON.parse(s.dataset.spot);
      map.getSource("spot").setData({ type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: p } }] });
    }
    const cam = s.dataset.cam ? JSON.parse(s.dataset.cam) : null;
    if (cam) {
      flying = true;
      map.flyTo({ ...cam, speed: 0.55, curve: 1.6, essential: true });
      map.once("moveend", () => { flying = false; });
    }
    nav.querySelectorAll("button").forEach((b, k) => b.classList.toggle("on", k === i));
    history.replaceState(null, "", "#" + (s.id || ""));
  }

  // slow turn while the reader rests on a step
  function turn() {
    if (orbitOn && !flying && !matchMedia("(prefers-reduced-motion: reduce)").matches) map.setBearing(map.getBearing() + 0.035);
    requestAnimationFrame(turn);
  }

  function observe() {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) go(steps.indexOf(e.target)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(s => io.observe(s));
    const hash = location.hash.slice(1);
    const at = steps.findIndex(s => s.id === hash);
    if (at > 0) steps[at].scrollIntoView({ behavior: "instant" });
  }

  // item colouring for the "AI reads the street" step: present = teal, absent = coral, otherwise grey
  function setItem(code) {
    document.querySelectorAll("[data-item-btn]").forEach(b => b.classList.toggle("on", b.dataset.itemBtn === code));
    if (!map.getLayer("items-dot")) return;
    map.setPaintProperty("items-dot", "circle-color",
      ["match", ["get", code], -1, "#3b4a4f", 0, "#ff7a59", 1, "#9fe3db", 2, "#6fd9ce", "#4fd1c5"]);
  }
  document.querySelectorAll("[data-item-btn]").forEach(b => b.addEventListener("click", () => setItem(b.dataset.itemBtn)));

  // dot navigator
  const nav = document.querySelector(".stepnav");
  steps.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.title = s.dataset.title || ""; b.setAttribute("aria-label", s.dataset.title || `Bölüm ${i + 1}`);
    b.addEventListener("click", () => s.scrollIntoView({ behavior: "smooth" }));
    nav.appendChild(b);
  });
})();
