/* SokakPuan: static atlas, with Mapillary's official share viewer on selection and a step-by-step presentation mode. */
"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const fmt = (n, decimals = 0) => n === null || n === undefined || !Number.isFinite(Number(n)) ? "—" : Number(n).toLocaleString("tr-TR", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  const labels = { safer: "Güvenli hissettirme", livelier: "Canlılık", more_beautiful: "Estetik", wealthier: "Varlıklı görünme", more_boring: "Sıkıcılık", more_depressing: "Bunaltıcılık" };
  const adjectives = { safer: "güvenli", livelier: "canlı", more_beautiful: "estetik", wealthier: "varlıklı", more_boring: "sıkıcı", more_depressing: "bunaltıcı" };
  const order = Object.keys(labels);
  const palette = ["#ac5751", "#d0a16b", "#d7cda1", "#8db2a1", "#267669"];
  const palePalette = ["#d2b8ae", "#dbcbb0", "#e0dcc3", "#bbd0c0", "#95b8a7"];
  const bandLong = ["Bölgenin en düşük %20'si", "Ortalamanın altında", "Ortalama civarında", "Ortalamanın üstünde", "Bölgenin en yüksek %20'si"];
  const bandShort = ["En düşük %20", "Ortalamanın altında", "Ortalama civarı", "Ortalamanın üstünde", "En yüksek %20"];
  const colors = { grey: "#c7c9c0", school: "#e7e1d1", muted: "#dfddd4", transform: "#5b4a9e" };
  // The street the municipality plans to transform, and its segment in front of Mehmet Rauf Anadolu Lisesi.
  const transform = { street: "Ziya Gökalp Caddesi", frontEdge: "1514376309--2246424228--way:138143835", frontBin: "1514376309--2246424228--way:138143835:bin:1", frontImage: "2345628942912852", nearMetres: 170 };
  const mobile = matchMedia("(max-width: 900px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0 : 850;
  const emptyCollection = () => ({ type: "FeatureCollection", features: [] });
  const state = { key: "safer", is3d: true, selected: null, school: "all", focus: false, map: null, data: null, dimensions: [], ready: false, imageIds: [], imageIndex: 0, controlsOpen: false, presenting: false, step: 0, sorted: {}, breaks: {}, schoolSlugs: new Map() };
  const statusText = {
    frontage_ambiguous: "Bu bina iki yola yaklaşık eşit uzaklıkta. Sokak eşleşmesi belirsiz olduğu için değerlendirme gösterilmiyor.",
    junction_only: "Bu yolun görüntüleri kavşak ucunda toplandığı için değerlendirme aktarılmadı.",
    no_bin_within_radius: "Bu noktada uygun görüntü eşleşmesi yok. Renkli bir sokak kesimi seçebilirsiniz.",
    road_beyond_radius: "Bu bina için yeterince yakın bir sokak gözlemi yok.",
    road_unobserved: "Bu yol için kullanılabilir görüntü yok.",
    single_panorama: "Sınırlı gözlem: bu kesimin değerlendirmesi tek panoramaya dayanıyor.",
    school: "Okul binalarına renk verilmez. Okulun çevresindeki renkli sokak kesimlerini seçerek görüntüleri inceleyin."
  };
  const heightLabels = { tagged_height: "OSM yükseklik etiketi", overture_height: "Overture metre alanı", levels_x3: "OSM kat sayısı × 3 m", overture_num_floors_x3: "Overture kat sayısı × 3 m", display_default_6m: "6 m gösterim varsayımı" };

  // Turkish suffixes after a spoken number: %83'ü, %72'si, %90'ından.
  function possessive(n) {
    if (n === 100) return "ü";
    const units = { 1: "i", 2: "si", 3: "ü", 4: "ü", 5: "i", 6: "sı", 7: "si", 8: "i", 9: "u" };
    const tens = { 1: "u", 2: "si", 3: "u", 4: "ı", 5: "si", 6: "ı", 7: "i", 8: "i", 9: "ı" };
    return units[n % 10] || tens[Math.floor(n / 10) % 10] || "ı";
  }
  const ablative = n => { const p = possessive(n); return p + (/[eiöü]$/.test(p) ? "nden" : "ndan"); };
  const predicate = key => adjectives[key] + (key === "safer" ? " hissettiriyor" : " görünüyor");

  function percentile(key, value) {
    const sorted = state.sorted[key];
    if (!sorted || value === null || value === undefined) return null;
    let lo = 0, hi = sorted.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < value) lo = mid + 1; else hi = mid; }
    return lo / sorted.length * 100;
  }
  const band = p => Math.min(4, Math.floor(p / 20));
  function groupPercentile(features, key) {
    const values = features.map(f => percentile(key, f.properties[key])).filter(p => p !== null);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }
  function comparison(key, p, subject = ["Bu kesim", "bu kesimden"]) {
    const r = Math.min(99, Math.max(1, Math.round(p)));
    if (p >= 50) return subject[0] + ", bölgedeki sokak kesimlerinin %" + r + "'" + ablative(r) + " daha " + predicate(key) + ".";
    const q = 100 - r;
    return "Bölgedeki sokak kesimlerinin %" + q + "'" + possessive(q) + " " + subject[1] + " daha " + predicate(key) + ".";
  }
  function bandColors(key, pale = false) {
    const list = [...(pale ? palePalette : palette)];
    if (state.dimensions.find(d => d.key === key)?.inverse) list.reverse();
    return list;
  }
  function colorExpression(pale = false) {
    const list = bandColors(state.key, pale), b = state.breaks[state.key];
    return ["step", ["coalesce", ["get", state.key], b[1]], list[0], b[0], list[1], b[1], list[2], b[2], list[3], b[3], list[4]];
  }
  function buildingColor() {
    const expression = ["case", ["==", ["get", "is_school"], true], colors.school];
    if (state.focus) expression.push(["==", ["get", "zone"], 0], colors.muted);
    expression.push(["==", ["get", "score_status"], "unscored"], colors.grey, ["==", ["get", "score_status"], "sparse"], colorExpression(true), colorExpression());
    return expression;
  }
  const binOpacity = () => state.focus ? ["case", ["==", ["get", "zone"], 0], .12, .92] : .88;
  function paintMap() {
    if (!state.ready) return;
    state.map.setPaintProperty("buildings-3d", "fill-extrusion-color", buildingColor());
    state.map.setPaintProperty("buildings-flat", "fill-color", buildingColor());
    state.map.setPaintProperty("observation-bins", "line-color", colorExpression());
    state.map.setPaintProperty("observation-bins", "line-opacity", binOpacity());
  }
  function setFocus(on) { state.focus = on; paintMap(); }
  function setControls(open) {
    state.controlsOpen = open;
    $("map-controls").hidden = mobile.matches && !open;
    $("controls-toggle").setAttribute("aria-expanded", String(!mobile.matches || open));
  }
  function selectDimension(key) {
    if (!order.includes(key)) return;
    state.key = key;
    document.querySelectorAll(".dimension").forEach(button => {
      const active = button.dataset.key === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const d = state.dimensions.find(item => item.key === key);
    $("current-dimension").textContent = labels[key];
    $("legend-title").textContent = labels[key];
    $("legend-min").textContent = "Daha az " + adjectives[key];
    $("legend-max").textContent = "Daha " + adjectives[key];
    $("legend-scale").replaceChildren(...bandColors(key).map(color => { const i = document.createElement("i"); i.style.background = color; return i; }));
    $("legend-description").textContent = d.inverse ? "Yüksek değer daha olumsuz algı ifade eder." : "";
    $("legend-description").hidden = !d.inverse;
    paintMap();
    if (state.selected) renderDetail();
  }
  function renderDimensions() {
    order.forEach(key => {
      const button = document.createElement("button");
      button.className = "dimension"; button.dataset.key = key; button.textContent = labels[key];
      button.addEventListener("click", () => { selectDimension(key); if (mobile.matches) setControls(false); });
      $("dimensions").append(button);
    });
    selectDimension(state.key);
  }

  // Local metre distances are sufficient for nearest-source selection in this small area.
  function distanceSquared(a, b) {
    const x = (a[0] - b[0]) * Math.cos(a[1] * Math.PI / 180), y = a[1] - b[1];
    return (x * x + y * y) * 111320 * 111320;
  }
  function distanceToLine(point, coordinates) {
    if (!coordinates.length) return Infinity;
    const scale = Math.cos(point[1] * Math.PI / 180), px = point[0] * scale, py = point[1];
    let best = Infinity;
    for (let i = 1; i < coordinates.length; i++) {
      const ax = coordinates[i - 1][0] * scale, ay = coordinates[i - 1][1];
      const dx = coordinates[i][0] * scale - ax, dy = coordinates[i][1] - ay;
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
      best = Math.min(best, Math.hypot(px - ax - t * dx, py - ay - t * dy) * 111320);
    }
    return best;
  }
  function outerCoordinates(geometry) {
    if (geometry.type === "LineString") return geometry.coordinates;
    if (geometry.type === "Polygon") return geometry.coordinates[0];
    return geometry.coordinates.flatMap(polygon => polygon[0]);
  }
  function geometryCenter(feature) {
    const coordinates = feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates[0][0] : outerCoordinates(feature.geometry);
    return coordinates.reduce((sum, point) => [sum[0] + point[0] / coordinates.length, sum[1] + point[1] / coordinates.length], [0, 0]);
  }
  function boundsOf(features, metres = 0) {
    const points = features.flatMap(f => outerCoordinates(f.geometry));
    const lat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    const dy = metres / 111320, dx = dy / Math.cos(lat * Math.PI / 180);
    return [Math.min(...points.map(p => p[0])) - dx, Math.min(...points.map(p => p[1])) - dy, Math.max(...points.map(p => p[0])) + dx, Math.max(...points.map(p => p[1])) + dy];
  }
  // Mark school buildings and how close each building and segment is to the street being transformed.
  function prepareFeatures() {
    const data = state.data;
    state.transformRoads = data.roads.features.filter(f => f.properties.street_name === transform.street);
    const lines = state.transformRoads.map(f => f.geometry.coordinates);
    const nearest = coordinates => Math.min(...coordinates.map(point => Math.min(...lines.map(line => distanceToLine(point, line)))));
    data.buildings.features.forEach(f => {
      const p = f.properties;
      p.is_school = Array.isArray(p.school_names) && p.school_names.length > 0;
      p.zone = p.street_name === transform.street ? 2 : nearest(outerCoordinates(f.geometry)) <= transform.nearMetres ? 1 : 0;
    });
    data.bins.features.forEach(f => { f.properties.zone = f.properties.street_name === transform.street ? 2 : nearest(f.geometry.coordinates) <= transform.nearMetres ? 1 : 0; });
    order.forEach(key => {
      const sorted = data.bins.features.map(f => f.properties[key]).filter(Number.isFinite).sort((a, b) => a - b);
      state.sorted[key] = sorted;
      state.breaks[key] = [1, 2, 3, 4].map(i => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * i / 5))]);
    });
  }

  function initLayers() {
    const map = state.map, data = state.data;
    ["roads", "schools", "bins"].forEach(name => map.addSource(name, { type: "geojson", data: data[name] }));
    map.addSource("buildings", { type: "geojson", data: data.buildings, promoteId: "building_id" });
    map.addSource("active-panorama", { type: "geojson", data: emptyCollection() });
    map.addLayer({ id: "school-fill", type: "fill", source: "schools", paint: { "fill-color": "#d0dac3", "fill-opacity": .65 } });
    map.addLayer({ id: "road-casing", type: "line", source: "roads", paint: { "line-color": "#d2d4c8", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 2, 17, 10, 20, 50] } });
    map.addLayer({ id: "road-fill", type: "line", source: "roads", paint: { "line-color": "#faf8f0", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 1, 17, 8, 20, 45] } });
    map.addLayer({ id: "transform-halo", type: "line", source: "roads", filter: ["==", ["get", "street_name"], transform.street], layout: { "line-cap": "round" }, paint: { "line-color": colors.transform, "line-width": ["interpolate", ["linear"], ["zoom"], 13, 5, 16, 13, 18, 32, 20, 90], "line-opacity": .3 } });
    map.addLayer({ id: "transform-front", type: "line", source: "roads", filter: ["==", ["get", "edge_id"], transform.frontEdge], layout: { "line-cap": "round" }, paint: { "line-color": colors.transform, "line-width": ["interpolate", ["linear"], ["zoom"], 13, 6, 16, 17, 18, 42, 20, 115], "line-opacity": .45 } });
    map.addLayer({ id: "school-outline", type: "line", source: "schools", paint: { "line-color": "#6b8877", "line-width": 1.1, "line-dasharray": [3, 3] } });
    map.addLayer({ id: "observation-bins", type: "line", source: "bins", paint: { "line-color": colorExpression(), "line-width": ["interpolate", ["linear"], ["zoom"], 14, 2, 17, 4, 20, 9], "line-opacity": binOpacity() } });
    map.addLayer({ id: "selected-source-road", type: "line", source: "roads", filter: ["==", ["get", "edge_id"], ""], paint: { "line-color": "#466d5f", "line-width": 5 } });
    map.addLayer({ id: "selected-source-bin", type: "line", source: "bins", filter: ["==", ["get", "bin_id"], ""], paint: { "line-color": "#173f32", "line-width": 6, "line-gap-width": 2 } });
    map.addLayer({ id: "road-hit", type: "line", source: "roads", paint: { "line-width": 18, "line-opacity": 0 } });
    map.addLayer({ id: "observation-hit", type: "line", source: "bins", paint: { "line-width": 20, "line-opacity": 0 } });
    map.addLayer({ id: "buildings-flat", type: "fill", source: "buildings", layout: { visibility: "none" }, paint: { "fill-color": buildingColor(), "fill-outline-color": "#a9b3a5", "fill-opacity": .98 } });
    map.addLayer({ id: "buildings-3d", type: "fill-extrusion", source: "buildings", paint: { "fill-extrusion-color": buildingColor(), "fill-extrusion-height": ["get", "height_m"], "fill-extrusion-base": 0, "fill-extrusion-opacity": .97, "fill-extrusion-vertical-gradient": true } });
    map.addLayer({ id: "selected-outline", type: "line", source: "buildings", filter: ["==", ["get", "building_id"], ""], paint: { "line-color": "#103d32", "line-width": 3 } });
    map.addLayer({ id: "panorama-halo", type: "circle", source: "active-panorama", paint: { "circle-color": "#faf8f2", "circle-radius": 9, "circle-opacity": .9 } });
    map.addLayer({ id: "panorama-point", type: "circle", source: "active-panorama", paint: { "circle-color": "#173f32", "circle-radius": 5, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } });
    const hitLayers = ["buildings-3d", "buildings-flat", "observation-hit", "road-hit"];
    map.on("mousemove", event => { map.getCanvas().style.cursor = map.queryRenderedFeatures(event.point, { layers: hitLayers }).length ? "pointer" : ""; });
    map.on("click", event => {
      const hits = map.queryRenderedFeatures(event.point, { layers: hitLayers });
      const building = hits.find(f => f.layer.id.startsWith("buildings-"));
      if (building) return selectBuilding(building.properties.building_id, event.lngLat.toArray());
      const bins = hits.filter(f => f.layer.id === "observation-hit");
      if (bins.length) {
        const nearest = bins.sort((a, b) => distanceToLine(event.lngLat.toArray(), a.geometry.coordinates) - distanceToLine(event.lngLat.toArray(), b.geometry.coordinates))[0];
        return selectBin(nearest.properties.bin_id, event.lngLat.toArray());
      }
      const road = hits.filter(f => f.layer.id === "road-hit").sort((a, b) => distanceToLine(event.lngLat.toArray(), a.geometry.coordinates) - distanceToLine(event.lngLat.toArray(), b.geometry.coordinates))[0];
      if (road) selectRoad(road.properties.edge_id, event.lngLat.toArray());
    });
    const front = state.roadIndex.get(transform.frontEdge);
    if (front) {
      const label = document.createElement("button"); label.className = "transform-label"; label.setAttribute("aria-label", "Dönüşüm alanına odaklan: " + transform.street);
      label.innerHTML = "<strong>Dönüşüm alanı</strong><span>Ziya Gökalp Cd.</span>";
      label.addEventListener("click", event => { event.stopPropagation(); focusArea("donusum"); });
      new maplibregl.Marker({ element: label, anchor: "left", offset: [16, 0] }).setLngLat(geometryCenter(front)).addTo(map);
    }
  }
  function shortSchoolName(name) {
    return name.replace("Esatpaşa Anadolu İmam Hatip Lisesi", "Esatpaşa AİHL").replace("Mehmet Rauf Anadolu Lisesi", "Mehmet Rauf AL").replace("Ali Nihat Tarlan İlkokulu", "Ali Nihat Tarlan İO");
  }
  function renderSchools() {
    const schools = [...state.data.metadata.schools].sort((a, b) => a.center[1] - b.center[1]);
    schools.forEach((school, i) => {
      state.schoolSlugs.set(school.id, "okul-" + (i + 1));
      const button = document.createElement("button"); button.className = "school-button"; button.dataset.school = school.id; button.setAttribute("aria-pressed", "false"); button.title = school.name;
      const number = document.createElement("span"); number.className = "school-number"; number.textContent = i + 1;
      const text = document.createElement("span"); text.textContent = shortSchoolName(school.name); button.append(number, text); $("schools").append(button);
      const marker = document.createElement("button"); marker.className = "school-marker"; marker.title = school.name + " çevresine odaklan"; marker.setAttribute("aria-label", marker.title);
      const dot = document.createElement("span"); dot.className = "school-marker-dot"; dot.textContent = i + 1;
      const label = document.createElement("span"); label.className = "school-marker-label"; label.textContent = shortSchoolName(school.name);
      marker.append(label, dot); marker.addEventListener("click", event => { event.stopPropagation(); focusArea(school.id); });
      new maplibregl.Marker({ element: marker, anchor: "right", offset: [19, 0] }).setLngLat(school.center).addTo(state.map);
    });
    $("schools").addEventListener("click", event => { const button = event.target.closest("[data-school]"); if (button) focusArea(button.dataset.school); });
  }
  function cameraPadding(selection = false) {
    if (state.presenting) {
      const narrow = mobile.matches;
      const panel = $("presenter").getBoundingClientRect();
      if (narrow) return { top: 80, bottom: Math.min(innerHeight - panel.top + 16, innerHeight - 200), left: 20, right: 20 };
      const detail = !$("detail").hidden ? innerWidth - $("detail").getBoundingClientRect().left + 30 : 70;
      return { top: 110, bottom: 70, left: panel.right + 30, right: detail };
    }
    if (mobile.matches) return { top: selection ? 90 : Math.min($("intro").getBoundingClientRect().bottom + 25, innerHeight * .42), bottom: selection ? Math.min(innerHeight - $("detail").getBoundingClientRect().top + 18, innerHeight - 180) : 215, left: 25, right: 25 };
    return { top: 155, bottom: 130, left: innerWidth > 1100 ? 350 : 310, right: selection ? 440 : 80 };
  }
  function frame(bounds, { maxZoom = 17.4, pitch = state.is3d ? 53 : 0, bearing = state.is3d ? -27 : 0 } = {}) {
    // A selection's easeTo leaves its padding on the map, and fitBounds adds its own padding on top of it.
    state.map.setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
    state.map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: cameraPadding(), maxZoom, pitch, bearing, duration });
  }
  const allSchoolBounds = () => { const s = state.data.metadata.schools; return [Math.min(...s.map(x => x.bounds[0])), Math.min(...s.map(x => x.bounds[1])), Math.max(...s.map(x => x.bounds[2])), Math.max(...s.map(x => x.bounds[3]))]; };
  function fitCamera(school = null) {
    frame(school ? school.bounds : allSchoolBounds(), { maxZoom: school ? 17.4 : 16.3 });
  }
  function slugFor(id) { return id === "all" ? "" : id === "donusum" ? "donusum-alani" : state.schoolSlugs.get(id) || ""; }
  function setHash(slug) {
    const url = location.pathname + location.search + (slug ? "#" + slug : "");
    if (location.hash !== (slug ? "#" + slug : "")) history.replaceState(null, "", url);
  }
  function focusArea(id) {
    closeSelection(); state.school = id;
    if (mobile.matches) setControls(false);
    document.querySelectorAll("[data-school]").forEach(button => { const active = button.dataset.school === id; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
    setFocus(id === "donusum");
    if (id === "donusum") frame(boundsOf(state.transformRoads, 40), { maxZoom: 17.4 });
    else fitCamera(id === "all" ? null : state.data.metadata.schools.find(school => school.id === id));
    if (!state.presenting) setHash(slugFor(id));
  }
  function selectionContext() {
    if (!state.selected) return null;
    const s = state.selected;
    const feature = s.type === "building" ? state.buildingIndex.get(s.id) : s.type === "bin" ? state.binIndex.get(s.id) : state.roadIndex.get(s.id);
    if (!feature) return null;
    const p = feature.properties, school = s.type === "building" && p.is_school;
    const mapping = s.type === "building" ? state.data.mappings.buildings[s.id] : s.type === "bin" ? state.data.mappings.bins[s.id] : null;
    const bin = s.type === "bin" ? feature : s.type === "building" && !school ? state.binIndex.get(mapping?.bin_ids[0]) : null;
    const title = school ? p.name || p.school_names[0] : p.street_name || "İsimsiz sokak";
    return { type: s.type, feature, p, bin, school, ids: school ? [] : mapping?.image_ids || [], scored: s.type !== "road" && !school && p.score_status !== "unscored", title };
  }
  function applySelection(type, id, anchor) {
    state.selected = { type, id };
    const context = selectionContext();
    if (!context) { state.selected = null; return; }
    state.map.setFilter("selected-outline", ["==", ["get", "building_id"], type === "building" ? id : ""]);
    state.map.setFilter("selected-source-bin", ["==", ["get", "bin_id"], context.bin?.properties.bin_id || ""]);
    state.map.setFilter("selected-source-road", ["==", ["get", "edge_id"], type === "road" ? id : ""]);
    $("selection-details").open = false; $("all-scores").open = false;
    document.body.classList.add("detail-open");
    $("detail").hidden = false; $("detail").scrollTop = 0;
    if (mobile.matches) setControls(false);
    setupImagery(context.ids, anchor || geometryCenter(context.feature), context.title);
    renderDetail();
    state.map.easeTo({ center: anchor || geometryCenter(context.feature), padding: cameraPadding(true), duration });
  }
  function selectBuilding(id, anchor) { if (state.buildingIndex.has(id)) applySelection("building", id, anchor); }
  function selectBin(id, anchor) { if (state.binIndex.has(id)) applySelection("bin", id, anchor); }
  function selectRoad(id, anchor) {
    const feature = state.roadIndex.get(id); if (!feature) return;
    const point = anchor || geometryCenter(feature);
    const candidates = state.binsByEdge.get(id) || [];
    const nearest = [...candidates].sort((a, b) => distanceToLine(point, a.geometry.coordinates) - distanceToLine(point, b.geometry.coordinates))[0];
    if (nearest && distanceToLine(point, nearest.geometry.coordinates) <= 30) selectBin(nearest.properties.bin_id, point);
    else applySelection("road", id, point);
  }
  function closeSelection() {
    state.selected = null; state.imageIds = []; state.imageIndex = 0;
    $("imagery-host").replaceChildren(); $("detail").hidden = true;
    document.body.classList.remove("detail-open");
    if (!state.ready) return;
    ["selected-outline", "selected-source-bin", "selected-source-road"].forEach((layer, i) => state.map.setFilter(layer, ["==", ["get", ["building_id", "bin_id", "edge_id"][i]], ""]));
    state.map.getSource("active-panorama").setData(emptyCollection());
  }
  function setupImagery(ids, anchor, streetName) {
    state.imageIds = [...ids].filter(id => /^\d+$/.test(id) && state.data.mappings.images[id]).sort((a, b) => state.data.mappings.images[a].captured_at - state.data.mappings.images[b].captured_at || a.localeCompare(b));
    $("imagery").hidden = !state.imageIds.length;
    if (!state.imageIds.length) {
      $("imagery-host").replaceChildren(); state.map.getSource("active-panorama").setData(emptyCollection()); return;
    }
    state.imageIndex = state.imageIds.reduce((best, id, i, all) => {
      const image = state.data.mappings.images[id], current = state.data.mappings.images[all[best]];
      return distanceSquared(anchor, [image.lon, image.lat]) < distanceSquared(anchor, [current.lon, current.lat]) ? i : best;
    }, 0);
    renderPanorama(streetName);
  }
  function renderPanorama(streetName = selectionContext()?.title || "Seçili sokak") {
    const id = state.imageIds[state.imageIndex], image = state.data.mappings.images[id]; if (!image) return;
    const host = $("imagery-host");
    let frameElement = host.querySelector("iframe");
    if (!frameElement) {
      frameElement = document.createElement("iframe"); frameElement.loading = "lazy"; frameElement.allow = "fullscreen"; frameElement.allowFullscreen = true; frameElement.referrerPolicy = "strict-origin-when-cross-origin";
      host.replaceChildren(frameElement);
    }
    frameElement.title = streetName + " — 360° kaynak görüntüsü, Mapillary";
    const url = "https://www.mapillary.com/embed?image_key=" + encodeURIComponent(id) + "&style=photo";
    if (frameElement.getAttribute("src") !== url) frameElement.src = url;
    $("image-counter").textContent = (state.imageIndex + 1) + " / " + state.imageIds.length;
    $("image-prev").disabled = state.imageIndex === 0;
    $("image-next").disabled = state.imageIndex === state.imageIds.length - 1;
    $("mapillary-link").href = "https://www.mapillary.com/app/?pKey=" + encodeURIComponent(id);
    state.map.getSource("active-panorama").setData({ type: "FeatureCollection", features: [{ type: "Feature", properties: { image_id: id }, geometry: { type: "Point", coordinates: [image.lon, image.lat] } }] });
  }
  function bandChip(key, p) { const i = document.createElement("i"); i.className = "score-chip small"; i.style.background = bandColors(key)[band(p)]; return i; }
  function renderDetail() {
    const context = selectionContext(); if (!context) return;
    const { p, bin, scored, type, title, school } = context;
    $("detail-eyebrow").textContent = school ? "OKUL BİNASI" : p.street_name === transform.street ? "DÖNÜŞÜM ALANI · SEÇİLİ SOKAK" : "SEÇİLİ SOKAK";
    $("detail-title").textContent = title;
    $("detail-subtitle").textContent = school ? "Okul binaları renklendirilmez" : type === "building" ? "Seçili binanın yakınındaki sokak kesimi" : type === "bin" ? "Seçili sokak kesiminin kaynak görüntüleri" : "Seçilen yolun bu noktası";
    const pct = scored ? percentile(state.key, p[state.key]) : null;
    $("detail-metric").textContent = labels[state.key];
    $("detail-score").textContent = pct === null ? "—" : bandLong[band(pct)];
    $("score-chip").hidden = pct === null;
    if (pct !== null) $("score-chip").style.background = bandColors(state.key)[band(pct)];
    $("detail-sentence").textContent = pct === null ? "" : comparison(state.key, pct);
    $("detail-sentence").hidden = pct === null;
    const length = bin ? bin.properties.end_m - bin.properties.start_m : null;
    $("score-support").textContent = scored ? "Model tahmini · " + fmt(context.ids.length) + " panorama" + (length !== null ? " · " + fmt(length, 0) + " m kesim" : "") : "Bu nokta için değerlendirme yok";
    const status = school ? "school" : type === "road" ? "no_bin_within_radius" : p.assignment_status || (p.score_status === "sparse" ? "single_panorama" : "assigned");
    $("detail-status").textContent = statusText[status] || "";
    $("detail-status").hidden = !statusText[status];
    $("all-scores").hidden = !scored;
    $("detail-metrics").replaceChildren();
    if (scored) order.forEach(key => {
      const value = percentile(key, p[key]);
      const row = document.createElement("button"); row.className = "metric-row"; row.classList.toggle("active", state.key === key); row.setAttribute("aria-pressed", String(state.key === key));
      const name = document.createElement("span"); name.textContent = labels[key];
      const text = document.createElement("span"); text.className = "metric-band"; text.append(bandChip(key, value), bandShort[band(value)]); row.append(name, text);
      row.addEventListener("click", () => selectDimension(key)); $("detail-metrics").append(row);
    });
    const fields = [];
    if (scored) fields.push(["Ham model puanı (1–9)", fmt(p[state.key], 2) + " · " + labels[state.key]]);
    if (bin) fields.push(["Kaynak sokak kesimi", fmt(bin.properties.start_m, 1) + "–" + fmt(bin.properties.end_m, 1) + " m"], ["Panorama / çekim serisi", fmt(context.ids.length) + " / " + fmt(bin.properties.sequence_count)]);
    if (type === "building") {
      if (p.name && !school) fields.push(["Bina adı", p.name]);
      fields.push(["Bina kaydı", p.building_id]);
      if (!school) fields.push(["Kesime uzaklık", scored ? fmt(p.distance_m, 1) + " m" : "Eşleşmedi"]);
      fields.push(["Çizim yüksekliği", fmt(p.height_m, 1) + " m"], ["Yükseklik kaynağı", heightLabels[p.height_source] || p.height_source]);
      if (state.data.metadata.overture?.enabled) {
        fields.push(["Overture eşleşmesi", p.overture_id ? "%" + fmt(p.overture_match_iou * 100, 1) + " geometrik örtüşme" : "Tekil eşleşme yok"]);
        if (p.overture_num_floors > 0) fields.push(["Overture kat kaydı", fmt(p.overture_num_floors) + " kat"]);
        if (p.overture_height_m > 0) fields.push(["Overture metre kaydı", fmt(p.overture_height_m, 1) + " m"]);
      }
    }
    fields.push(["Çekim tarihi", "24 Ağustos 2026"]);
    $("detail-facts").replaceChildren();
    fields.forEach(([key, value]) => { const dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = key; dd.textContent = value; $("detail-facts").append(dt, dd); });
    const roadWay = p.edge_id?.match(/way:(\d+)/)?.[1];
    const osmPath = type === "building" ? p.building_id : roadWay ? "way/" + roadWay : null;
    $("osm-link").hidden = !osmPath;
    if (osmPath) $("osm-link").href = "https://www.openstreetmap.org/" + osmPath;
    $("osm-link").textContent = (type === "building" ? "Bina" : "Yol") + " kaydı · OpenStreetMap ↗";
  }
  function openFrontage() {
    const image = state.data.mappings.images[transform.frontImage];
    selectBin(transform.frontBin, image ? [image.lon, image.lat] : undefined);
    const center = image ? [image.lon, image.lat] : geometryCenter(state.binIndex.get(transform.frontBin));
    state.map.easeTo({ center, zoom: 17.7, pitch: state.is3d ? 55 : 0, bearing: state.is3d ? -40 : 0, padding: cameraPadding(true), duration });
  }
  function exploreStreet() {
    const school = state.data.metadata.schools.find(s => s.id === state.school);
    if (!school) return openFrontage();
    const candidates = state.data.bins.features.filter(f => f.properties.score_status === "scored" && state.data.mappings.bins[f.properties.bin_id]?.image_ids.length);
    const selected = candidates.sort((a, b) => distanceSquared(geometryCenter(a), school.center) - distanceSquared(geometryCenter(b), school.center))[0];
    if (!selected) return;
    const center = geometryCenter(selected);
    selectBin(selected.properties.bin_id, center);
    state.map.easeTo({ center, zoom: 17.6, pitch: state.is3d ? 53 : 0, bearing: state.is3d ? -27 : 0, padding: cameraPadding(true), duration });
  }

  // Presentation mode: short on-screen captions; the spoken text lives in docs/konusma_metni.md.
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const para = text => el("p", "presenter-text", text);
  function stats(items) { const wrap = el("div", "presenter-stats"); items.forEach(([value, label]) => { const d = el("div"); d.append(el("strong", "", value), el("span", "", label)); wrap.append(d); }); return wrap; }
  function bandRows(items) {
    const list = el("ul", "presenter-rows");
    items.forEach(({ name, key, pct }) => { if (pct === null) return; const li = el("li"); const value = el("span", "metric-band"); value.append(bandChip(key, pct), bandShort[band(pct)]); li.append(el("span", "", name), value); list.append(li); });
    return list;
  }
  function team() { const p = el("p", "presenter-team"); p.append("Yunus Serhat Bıçakçı · Orkut Murat Yılmaz"); return p; }
  const binsWhere = test => state.data.bins.features.filter(f => test(f.properties));
  const frontBins = () => binsWhere(p => p.edge_id === transform.frontEdge);
  const schoolBlock = () => state.data.schools.features.filter(f => f.properties.name !== "Esatpaşa Anadolu İmam Hatip Lisesi");
  const steps = [
    { slug: "giris", eyebrow: "SOKAKPUAN · SOKAKLAR DÖNÜŞÜYOR", title: "Okul yolu nasıl hissettiriyor?", body: () => [para("Ataşehir, Esatpaşa. Ziya Gökalp Caddesi dönüşmeden önceki kayıt."), team()], photo: ["assets/photos/ziya-gokalp-mehmet-rauf-onu.jpg", "Ziya Gökalp Caddesi'nde, solda Mehmet Rauf Anadolu Lisesi'nin duvarı ve kaldırıma park etmiş araçlar", "Ziya Gökalp Caddesi, Mehmet Rauf Anadolu Lisesi önü · 24 Ağustos 2026, 07.01"], camera: () => frame(allSchoolBounds(), { maxZoom: 16.3 }) },
    { slug: "cekim", eyebrow: "NE YAPTIK?", title: "Bir sabah, 40 dakika", body: () => [stats([["2.615", "360° panorama"], ["411", "20 metrelik sokak kesimi"], ["6", "algı boyutu"]]), para("24 Ağustos 2026 · 06.46–07.26 · GoPro MAX 2")], legend: true, camera: () => frame(boundsOf(state.data.bins.features, 40), { maxZoom: 16, pitch: 0, bearing: 0 }) },
    { slug: "donusum", eyebrow: "DÖNÜŞÜM ALANI", title: "Mehmet Rauf Anadolu Lisesi önü", focus: true, body: () => { const pct = groupPercentile(frontBins(), "safer"); return [para("Ziya Gökalp Caddesi'nin okul önündeki kesimi, bölgedeki 411 sokak kesimiyle karşılaştırıldı."), bandRows(["safer", "livelier", "more_boring"].map(key => ({ name: labels[key], key, pct: groupPercentile(frontBins(), key) }))), el("p", "presenter-note", comparison("safer", pct, ["Okul önü", "okul önünden"]))]; }, photo: ["assets/photos/mehmet-rauf-duvar.jpg", "Mehmet Rauf Anadolu Lisesi'nin Ziya Gökalp Caddesi'ne bakan, üstü jiletli telli duvarı ve dar kaldırım", "Okul duvarı, Ziya Gökalp Caddesi · 24 Ağustos 2026, 07.01"], camera: () => frame(boundsOf(state.transformRoads, 90), { maxZoom: 17.4, pitch: 55, bearing: -40 }) },
    { slug: "goruntu", eyebrow: "NASIL ÇALIŞIYOR?", title: "Her kesimin kendi görüntüsü", focus: true, body: () => [para("Haritada bir sokak seçildiğinde, değerlendirmenin dayandığı 360° görüntüler açılır. Renk, kesimin bölgedeki sırasını gösterir.")], after: openFrontage },
    { slug: "cevre", eyebrow: "ÇEVRE SOKAKLAR", title: "Okul adasının çevresi", focus: true, legend: true, body: () => [para("Güvenli hissettirme · bölgedeki 411 sokak kesimiyle karşılaştırma"), bandRows([["Ziya Gökalp Cd. · okul önü", p => p.edge_id === transform.frontEdge], ["Ziya Gökalp Caddesi (tamamı)", p => p.street_name === transform.street], ["Hacı Bekir Caddesi", p => p.street_name === "Hacı Bekir Caddesi" && p.zone > 0], ["Emekliler Sokağı", p => p.street_name === "Emekliler Sokağı"], ["Keskinler Sokağı", p => p.street_name === "Keskinler Sokağı"], ["Zahir Sokağı", p => p.street_name === "Zahir Sokağı"]].map(([name, test]) => ({ name, key: "safer", pct: groupPercentile(binsWhere(test), "safer") })))], camera: () => frame(boundsOf(schoolBlock(), 50), { maxZoom: 17.2, pitch: 50, bearing: -27 }) },
    { slug: "kisitlar", eyebrow: "KISITLARIMIZ", title: "Neyi yapamadık?", focus: true, body: () => { const list = el("ul", "presenter-list"); ["Tek bir sabah çekimi; okullar tatildeydi.", "Model yurt dışı verisiyle eğitildi; Türkiye'ye özgü değil.", "Sokağı kullananların görüşünü alamadık."].forEach(text => list.append(el("li", "", text))); return [list]; }, camera: () => frame(boundsOf(schoolBlock(), 140), { maxZoom: 16.8, pitch: 45, bearing: -27 }) },
    { slug: "teklif", eyebrow: "BİRLİKTE ÖLÇELİM", title: "Dönüşümden sonra aynı sokağı yeniden ölçelim", body: () => { const qr = el("div", "presenter-qr"); const img = el("img"); img.src = "assets/qr-sokakpuan.svg"; img.alt = "yunusserhat.com/sokakpuan adresine giden QR kod"; img.width = 132; img.height = 132; const text = el("div"), address = el("strong"); address.append("yunusserhat.com/", el("wbr"), "sokakpuan"); text.append(address, el("span", "", "yunus.serhat@marmara.edu.tr")); qr.append(img, text); return [para("Bu çalışmayı belediyelere ücretsiz sunuyoruz."), qr, team()]; }, camera: () => frame(allSchoolBounds(), { maxZoom: 16.3 }) }
  ];
  function renderStep(index) {
    const step = steps[index];
    $("presenter-count").textContent = (index + 1) + " / " + steps.length;
    $("presenter-eyebrow").textContent = step.eyebrow;
    $("presenter-title").textContent = step.title;
    $("presenter-body").replaceChildren(...step.body());
    $("presenter-prev").disabled = index === 0;
    $("presenter-next").disabled = index === steps.length - 1;
    document.querySelectorAll(".presenter-dots button").forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
    $("presenter-photo").hidden = !step.photo;
    if (step.photo) { $("presenter-photo-img").src = step.photo[0]; $("presenter-photo-img").alt = step.photo[1]; $("presenter-photo-caption").textContent = step.photo[2]; }
    document.body.classList.toggle("presenter-legend", !!step.legend && !step.photo);
  }
  function goToStep(index) {
    index = Math.max(0, Math.min(steps.length - 1, index));
    state.step = index;
    const step = steps[index];
    closeSelection();
    selectDimension("safer");
    setFocus(!!step.focus);
    renderStep(index);
    if (step.camera) step.camera();
    if (step.after) step.after();
    setHash("sunum-" + (index + 1));
  }
  function startPresentation(index = 0) {
    if (!state.presenting) {
      state.presenting = true; document.body.classList.add("presenting");
      $("presenter").hidden = false; state.map.keyboard.disable();
      if (!state.is3d) $("view-3d").click();
      if ($("method-dialog").open) $("method-dialog").close();
    }
    goToStep(index);
  }
  function exitPresentation() {
    if (!state.presenting) return;
    state.presenting = false; document.body.classList.remove("presenting", "presenter-legend");
    $("presenter").hidden = true; $("presenter-photo").hidden = true; state.map.keyboard.enable();
    focusArea(state.school === "donusum" ? "donusum" : "all");
  }
  function setupPresenter() {
    steps.forEach((step, i) => { const dot = el("button"); dot.setAttribute("aria-label", "Adım " + (i + 1) + ": " + step.title); dot.addEventListener("click", () => goToStep(i)); $("presenter-dots").append(dot); });
    $("present-open").addEventListener("click", event => { event.currentTarget.blur(); startPresentation(0); });
    $("presenter-close").addEventListener("click", exitPresentation);
    $("presenter-prev").addEventListener("click", () => goToStep(state.step - 1));
    $("presenter-next").addEventListener("click", () => goToStep(state.step + 1));
    document.addEventListener("keydown", event => {
      if (!state.presenting || $("method-dialog").open || event.target.closest?.("input, textarea, select")) return;
      const next = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"], prev = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];
      if (event.key === "Enter" && event.target.closest?.("button, a, summary")) return;
      if (next.includes(event.key)) { event.preventDefault(); goToStep(state.step + 1); }
      else if (prev.includes(event.key)) { event.preventDefault(); goToStep(state.step - 1); }
      else if (event.key === "Home") { event.preventDefault(); goToStep(0); }
      else if (event.key === "End") { event.preventDefault(); goToStep(steps.length - 1); }
      else if (event.key === "Escape") { event.preventDefault(); if (state.selected && steps[state.step].after !== openFrontage) closeSelection(); else exitPresentation(); }
    });
  }
  function applyHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const presentation = hash.match(/^sunum(?:-(\d+))?$/);
    if (presentation) return startPresentation(presentation[1] ? Number(presentation[1]) - 1 : 0);
    if (state.presenting) exitPresentation();
    if (hash === "donusum-alani") return focusArea("donusum");
    const school = [...state.schoolSlugs].find(([, slug]) => slug === hash);
    focusArea(school ? school[0] : "all");
  }

  function setupMethod() {
    const c = state.data.metadata.counts;
    const wrap = document.createElement("div"); wrap.className = "method-stats";
    [[c.clean_panoramas, "kullanılan panorama"], [c.clean_bins, "sokak kesimi"]].forEach(([value, label]) => {
      const div = document.createElement("div"), strong = document.createElement("strong"), span = document.createElement("span");
      strong.textContent = fmt(value); span.textContent = label; div.append(strong, span); wrap.append(div);
    });
    $("method-data").replaceChildren(wrap);
    const hs = c.height_sources, parts = [];
    if (hs.tagged_height) parts.push(fmt(hs.tagged_height) + " binada OSM metre kaydı");
    if (hs.overture_height) parts.push(fmt(hs.overture_height) + " binada Overture metre kaydı");
    if (hs.levels_x3) parts.push(fmt(hs.levels_x3) + " binada kat sayısı × 3 m tahmini");
    if (hs.overture_num_floors_x3) parts.push(fmt(hs.overture_num_floors_x3) + " binada Overture kat sayısı × 3 m tahmini");
    if (hs.display_default_6m) parts.push(fmt(hs.display_default_6m) + " binada 6 m gösterim varsayımı");
    $("height-note").textContent = parts.join("; ") + ". Bu çizim, ölçülmüş bir 3B kent modeli değildir. Seçili binanın kaynağı karttaki ayrıntılarda görülebilir.";
    const o = state.data.metadata.overture;
    $("overture-section").hidden = !o?.enabled; $("overture-credit").hidden = !o?.enabled;
    if (o?.enabled) {
      $("overture-note").textContent = "Overture " + o.release + " sürümündeki " + fmt(o.input_count) + " bina kaydından " + fmt(o.matched_buildings) + " tanesi mevcut bina tabanlarıyla eşleşti. Metre yüksekliği " + fmt(o.input_height_count) + ", kat bilgisi " + fmt(o.input_floor_count) + " kayıtta var.";
      const updates = (o.applied_height_count || 0) + (o.applied_floor_count || 0);
      $("overture-result").textContent = updates ? fmt(updates) + " binanın yüksekliği bu kaynakla tamamlandı." : "Kat kayıtları mevcut OSM bilgisiyle aynı olduğundan bu bölgede ek yükseklik kapsamı sağlanmadı.";
    }
    $("coverage").textContent = state.data.metadata.schools.length + " okul · " + fmt(c.clean_panoramas) + " panorama";
    $("legend-note").textContent = "Her renk, bölgedeki " + fmt(c.clean_bins) + " sokak kesiminin beşte biri.";
    $("method-open").addEventListener("click", () => $("method-dialog").showModal());
    $("method-close").addEventListener("click", () => $("method-dialog").close());
    $("method-dialog").addEventListener("click", event => { if (event.target === $("method-dialog")) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
  }
  function setupControls() {
    $("controls-toggle").addEventListener("click", () => setControls(!state.controlsOpen));
    mobile.addEventListener("change", () => setControls(state.controlsOpen)); setControls(false);
    $("detail-close").addEventListener("click", closeSelection);
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !state.presenting && !$("method-dialog").open && state.selected) closeSelection(); });
    $("explore-street").addEventListener("click", exploreStreet);
    $("image-prev").addEventListener("click", () => { if (state.imageIndex > 0) { state.imageIndex--; renderPanorama(); } });
    $("image-next").addEventListener("click", () => { if (state.imageIndex < state.imageIds.length - 1) { state.imageIndex++; renderPanorama(); } });
    $("show-bins").addEventListener("change", event => state.map.setLayoutProperty("observation-bins", "visibility", event.target.checked ? "visible" : "none"));
    $("only-colored").addEventListener("change", event => {
      const filter = event.target.checked ? ["!=", ["get", "score_status"], "unscored"] : null;
      ["buildings-3d", "buildings-flat"].forEach(id => state.map.setFilter(id, filter));
    });
    const setView = is3d => {
      state.is3d = is3d;
      state.map.setLayoutProperty("buildings-3d", "visibility", is3d ? "visible" : "none");
      state.map.setLayoutProperty("buildings-flat", "visibility", is3d ? "none" : "visible");
      ["view-3d", "view-2d"].forEach((id, i) => { const active = i === 0 ? is3d : !is3d; $(id).classList.toggle("active", active); $(id).setAttribute("aria-pressed", String(active)); });
      state.map.easeTo({ pitch: is3d ? 53 : 0, bearing: is3d ? -27 : 0, duration });
    };
    $("view-3d").addEventListener("click", () => setView(true)); $("view-2d").addEventListener("click", () => setView(false));
    $("zoom-in").addEventListener("click", () => state.map.zoomIn({ duration })); $("zoom-out").addEventListener("click", () => state.map.zoomOut({ duration }));
    $("reset-map").addEventListener("click", () => focusArea("all"));
  }
  async function start() {
    $("retry").addEventListener("click", () => location.reload());
    try {
      const names = ["buildings", "bins", "roads", "schools", "mappings", "metadata"];
      const data = await Promise.all(names.map(async name => {
        const response = await fetch("data/" + name + (["mappings", "metadata"].includes(name) ? ".json" : ".geojson"));
        if (!response.ok) throw new Error(name + ": HTTP " + response.status);
        return response.json();
      }));
      state.data = Object.fromEntries(names.map((name, i) => [name, data[i]]));
      state.dimensions = state.data.metadata.dimensions;
      state.buildingIndex = new Map(state.data.buildings.features.map(f => [f.properties.building_id, f]));
      state.binIndex = new Map(state.data.bins.features.map(f => [f.properties.bin_id, f]));
      state.roadIndex = new Map(state.data.roads.features.map(f => [f.properties.edge_id, f]));
      state.binsByEdge = new Map();
      state.data.bins.features.forEach(f => { const id = f.properties.edge_id; if (!state.binsByEdge.has(id)) state.binsByEdge.set(id, []); state.binsByEdge.get(id).push(f); });
      prepareFeatures();
      renderDimensions(); setupMethod();
      state.map = new maplibregl.Map({ container: "map", style: { version: 8, sources: {}, light: { anchor: "viewport", color: "#fffdf3", intensity: .38, position: [1.4, 200, 45] }, layers: [{ id: "background", type: "background", paint: { "background-color": "#e9e7de" } }] }, center: [29.0832, 41.0041], zoom: 16, pitch: 53, bearing: -27, maxPitch: 75, minZoom: 13.5, maxZoom: 20.5, attributionControl: false, fadeDuration: 0, canvasContextAttributes: { preserveDrawingBuffer: true }, maxBounds: [[29.067, 40.989], [29.102, 41.02]] });
      state.map.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: "metric" }), "bottom-left");
      state.map.on("error", event => console.error("Map error:", event.error));
      await new Promise(resolve => state.map.once("load", resolve));
      initLayers(); state.ready = true; setupControls(); renderSchools(); setupPresenter(); paintMap();
      applyHash();
      addEventListener("hashchange", applyHash);
      await new Promise(resolve => state.map.once("idle", resolve));
      $("loading").hidden = true;
      window.SokakPuan = {
        get map() { return state.map; }, get metadata() { return state.data.metadata; }, get buildings() { return state.data.buildings; },
        get selection() { return state.selected; }, get imageId() { return state.imageIds[state.imageIndex] || null; }, get imageIds() { return [...state.imageIds]; },
        get dimension() { return state.key; }, get step() { return state.presenting ? state.step : null; }, get stepCount() { return steps.length; },
        selectBuilding, selectBin, selectRoad, closeSelection, startPresentation, exitPresentation, percentile
      };
    } catch (error) {
      console.error(error); $("loading").hidden = true; $("error").hidden = false;
    }
  }
  start();
})();
