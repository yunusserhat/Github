/* SokakPuan: static atlas, with Mapillary's official share viewer on selection. */
"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const fmt = (n, decimals = 0) => n === null || n === undefined || !Number.isFinite(Number(n)) ? "—" : Number(n).toLocaleString("tr-TR", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
  const labels = { safer: "Güvenli hissettirme", livelier: "Canlılık", more_beautiful: "Estetik", wealthier: "Varlıklı görünme", more_boring: "Sıkıcılık", more_depressing: "Bunaltıcılık" };
  const order = Object.keys(labels);
  const palette = ["#ac5751", "#d0a16b", "#d7cda1", "#8db2a1", "#267669"];
  const palePalette = ["#d2b8ae", "#dbcbb0", "#e0dcc3", "#bbd0c0", "#95b8a7"];
  const mobile = matchMedia("(max-width: 900px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0 : 850;
  const emptyCollection = () => ({ type: "FeatureCollection", features: [] });
  const state = { key: "safer", is3d: true, selected: null, school: "all", map: null, data: null, dimensions: [], ready: false, imageIds: [], imageIndex: 0, controlsOpen: false };
  const statusText = {
    frontage_ambiguous: "Bu bina iki yola yaklaşık eşit uzaklıkta. Sokak eşleşmesi belirsiz olduğu için puan gösterilmiyor.",
    junction_only: "Bu yolun görüntüleri kavşak ucunda toplandığı için puan aktarılmadı.",
    no_bin_within_radius: "Bu noktada uygun görüntü eşleşmesi yok. Renkli bir sokak kesimi seçebilirsiniz.",
    road_beyond_radius: "Bu bina için yeterince yakın bir sokak gözlemi yok.",
    road_unobserved: "Bu yol için kullanılabilir görüntü yok.",
    single_panorama: "Sınırlı gözlem: bu kesimin puanı tek panoramaya dayanıyor."
  };
  const heightLabels = { tagged_height: "OSM yükseklik etiketi", overture_height: "Overture metre alanı", levels_x3: "OSM kat sayısı × 3 m", overture_num_floors_x3: "Overture kat sayısı × 3 m", display_default_6m: "6 m gösterim varsayımı" };

  function dimension() { return state.dimensions.find(d => d.key === state.key); }
  function colorExpression(pale = false) {
    const d = dimension(), colors = [...(pale ? palePalette : palette)];
    if (d.inverse) colors.reverse();
    const lo = d.p05, hi = d.p95 > lo ? d.p95 : lo + 1;
    const expression = ["interpolate", ["linear"], ["coalesce", ["get", state.key], lo]];
    colors.forEach((color, i) => expression.push(lo + (hi - lo) * i / 4, color));
    return expression;
  }
  function buildingColor() {
    return ["case", ["==", ["get", "score_status"], "unscored"], "#c7c9c0", ["==", ["get", "score_status"], "sparse"], colorExpression(true), colorExpression()];
  }
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
    const d = dimension(), colors = [...palette];
    if (d.inverse) colors.reverse();
    $("current-dimension").textContent = labels[key];
    $("legend-title").textContent = labels[key];
    $("legend-min").textContent = fmt(d.p05, 2) + " · düşük";
    $("legend-max").textContent = fmt(d.p95, 2) + " · yüksek";
    $("legend-gradient").style.background = "linear-gradient(90deg," + colors.join(",") + ")";
    $("legend-description").textContent = d.inverse ? "Yüksek puan daha olumsuz algı ifade eder." : "";
    $("legend-description").hidden = !d.inverse;
    if (state.ready) {
      state.map.setPaintProperty("buildings-3d", "fill-extrusion-color", buildingColor());
      state.map.setPaintProperty("buildings-flat", "fill-color", buildingColor());
      state.map.setPaintProperty("observation-bins", "line-color", colorExpression());
    }
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
  function initLayers() {
    const map = state.map, data = state.data;
    ["roads", "schools", "bins"].forEach(name => map.addSource(name, { type: "geojson", data: data[name] }));
    map.addSource("buildings", { type: "geojson", data: data.buildings, promoteId: "building_id" });
    map.addSource("active-panorama", { type: "geojson", data: emptyCollection() });
    map.addLayer({ id: "school-fill", type: "fill", source: "schools", paint: { "fill-color": "#d0dac3", "fill-opacity": .65 } });
    map.addLayer({ id: "road-casing", type: "line", source: "roads", paint: { "line-color": "#d2d4c8", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 2, 17, 10, 20, 50] } });
    map.addLayer({ id: "road-fill", type: "line", source: "roads", paint: { "line-color": "#faf8f0", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 1, 17, 8, 20, 45] } });
    map.addLayer({ id: "school-outline", type: "line", source: "schools", paint: { "line-color": "#6b8877", "line-width": 1.1, "line-dasharray": [3, 3] } });
    map.addLayer({ id: "observation-bins", type: "line", source: "bins", paint: { "line-color": colorExpression(), "line-width": ["interpolate", ["linear"], ["zoom"], 14, 2, 17, 4, 20, 9], "line-opacity": .88 } });
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
  function geometryCenter(feature) {
    const geometry = feature.geometry;
    const coordinates = geometry.type === "LineString" ? geometry.coordinates : geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates[0][0];
    return coordinates.reduce((sum, point) => [sum[0] + point[0] / coordinates.length, sum[1] + point[1] / coordinates.length], [0, 0]);
  }
  function shortSchoolName(name) {
    return name.replace("Esatpaşa Anadolu İmam Hatip Lisesi", "Esatpaşa AİHL").replace("Mehmet Rauf Anadolu Lisesi", "Mehmet Rauf AL").replace("Ali Nihat Tarlan İlkokulu", "Ali Nihat Tarlan İO");
  }
  function renderSchools() {
    const schools = [...state.data.metadata.schools].sort((a, b) => a.center[1] - b.center[1]);
    schools.forEach((school, i) => {
      const button = document.createElement("button"); button.className = "school-button"; button.dataset.school = school.id; button.setAttribute("aria-pressed", "false"); button.title = school.name;
      const number = document.createElement("span"); number.className = "school-number"; number.textContent = i + 1;
      const text = document.createElement("span"); text.textContent = shortSchoolName(school.name); button.append(number, text); $("schools").append(button);
      const marker = document.createElement("button"); marker.className = "school-marker"; marker.title = school.name + " çevresine odaklan"; marker.setAttribute("aria-label", marker.title);
      const dot = document.createElement("span"); dot.className = "school-marker-dot"; dot.textContent = i + 1;
      const label = document.createElement("span"); label.className = "school-marker-label"; label.textContent = shortSchoolName(school.name);
      marker.append(dot, label); marker.addEventListener("click", event => { event.stopPropagation(); focusSchool(school.id); });
      new maplibregl.Marker({ element: marker, anchor: "bottom" }).setLngLat(school.center).addTo(state.map);
    });
    $("schools").addEventListener("click", event => { const button = event.target.closest("[data-school]"); if (button) focusSchool(button.dataset.school); });
  }
  function cameraPadding(selection = false) {
    if (mobile.matches) return { top: selection ? 90 : Math.min($("intro").getBoundingClientRect().bottom + 25, innerHeight * .42), bottom: selection ? Math.min(innerHeight - $("detail").getBoundingClientRect().top + 18, innerHeight - 180) : 215, left: 25, right: 25 };
    return { top: 155, bottom: 130, left: innerWidth > 1100 ? 350 : 310, right: selection ? 440 : 80 };
  }
  function fitCamera(school = null) {
    const schools = state.data.metadata.schools;
    const bounds = school ? school.bounds : [Math.min(...schools.map(s => s.bounds[0])), Math.min(...schools.map(s => s.bounds[1])), Math.max(...schools.map(s => s.bounds[2])), Math.max(...schools.map(s => s.bounds[3]))];
    state.map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: cameraPadding(), maxZoom: school ? 17.4 : 16.3, pitch: state.is3d ? 53 : 0, bearing: state.is3d ? -27 : 0, duration });
  }
  function focusSchool(id) {
    closeSelection(); state.school = id;
    if (mobile.matches) setControls(false);
    document.querySelectorAll("[data-school]").forEach(button => { const active = button.dataset.school === id; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
    fitCamera(id === "all" ? null : state.data.metadata.schools.find(school => school.id === id));
  }
  function selectionContext() {
    if (!state.selected) return null;
    const s = state.selected;
    const feature = s.type === "building" ? state.buildingIndex.get(s.id) : s.type === "bin" ? state.binIndex.get(s.id) : state.roadIndex.get(s.id);
    if (!feature) return null;
    const p = feature.properties;
    const mapping = s.type === "building" ? state.data.mappings.buildings[s.id] : s.type === "bin" ? state.data.mappings.bins[s.id] : null;
    const bin = s.type === "bin" ? feature : s.type === "building" ? state.binIndex.get(mapping?.bin_ids[0]) : null;
    return { type: s.type, feature, p, bin, ids: mapping?.image_ids || [], scored: s.type !== "road" && p.score_status !== "unscored", title: p.street_name || "İsimsiz sokak" };
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
    let frame = host.querySelector("iframe");
    if (!frame) {
      frame = document.createElement("iframe"); frame.loading = "lazy"; frame.allow = "fullscreen"; frame.allowFullscreen = true; frame.referrerPolicy = "strict-origin-when-cross-origin";
      host.replaceChildren(frame);
    }
    frame.title = streetName + " — 360° kaynak görüntüsü, Mapillary";
    const url = "https://www.mapillary.com/embed?image_key=" + encodeURIComponent(id) + "&style=photo";
    if (frame.getAttribute("src") !== url) frame.src = url;
    $("image-counter").textContent = (state.imageIndex + 1) + " / " + state.imageIds.length;
    $("image-prev").disabled = state.imageIndex === 0;
    $("image-next").disabled = state.imageIndex === state.imageIds.length - 1;
    $("mapillary-link").href = "https://www.mapillary.com/app/?pKey=" + encodeURIComponent(id);
    state.map.getSource("active-panorama").setData({ type: "FeatureCollection", features: [{ type: "Feature", properties: { image_id: id }, geometry: { type: "Point", coordinates: [image.lon, image.lat] } }] });
  }
  function renderDetail() {
    const context = selectionContext(); if (!context) return;
    const { p, bin, scored, type, title } = context;
    $("detail-title").textContent = title;
    $("detail-subtitle").textContent = type === "building" ? "Seçili binanın yakınındaki sokak kesimi" : type === "bin" ? "Seçili sokak kesiminin kaynak görüntüleri" : "Seçilen yolun bu noktası";
    $("detail-score").textContent = scored ? fmt(p[state.key], 2) : "—";
    $("detail-metric").textContent = labels[state.key];
    const length = bin ? bin.properties.end_m - bin.properties.start_m : null;
    $("score-support").textContent = scored ? "Ham model puanı · " + fmt(context.ids.length) + " panorama" + (length !== null ? " · " + fmt(length, 1) + " m kesim" : "") : "Bu nokta için puan yok";
    const status = type === "road" ? "no_bin_within_radius" : p.assignment_status || (p.score_status === "sparse" ? "single_panorama" : "assigned");
    $("detail-status").textContent = statusText[status] || "";
    $("detail-status").hidden = !statusText[status];
    $("all-scores").hidden = !scored;
    $("detail-metrics").replaceChildren();
    if (scored) order.forEach(key => {
      const row = document.createElement("button"); row.className = "metric-row"; row.classList.toggle("active", state.key === key); row.setAttribute("aria-pressed", String(state.key === key));
      const name = document.createElement("span"); name.textContent = labels[key];
      const value = document.createElement("span"); value.textContent = fmt(p[key], 2); row.append(name, value);
      row.addEventListener("click", () => selectDimension(key)); $("detail-metrics").append(row);
    });
    const fields = [];
    if (bin) fields.push(["Kaynak sokak kesimi", fmt(bin.properties.start_m, 1) + "–" + fmt(bin.properties.end_m, 1) + " m"], ["Panorama / çekim serisi", fmt(context.ids.length) + " / " + fmt(bin.properties.sequence_count)]);
    if (type === "building") {
      if (p.name) fields.push(["Bina adı", p.name]);
      fields.push(["Bina kaydı", p.building_id], ["Kesime uzaklık", scored ? fmt(p.distance_m, 1) + " m" : "Eşleşmedi"], ["Çizim yüksekliği", fmt(p.height_m, 1) + " m"], ["Yükseklik kaynağı", heightLabels[p.height_source] || p.height_source]);
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
  function exploreStreet() {
    const school = state.data.metadata.schools.find(s => s.id === state.school) || [...state.data.metadata.schools].sort((a, b) => a.center[1] - b.center[1])[0];
    const candidates = state.data.bins.features.filter(f => f.properties.score_status === "scored" && state.data.mappings.bins[f.properties.bin_id]?.image_ids.length);
    const selected = candidates.sort((a, b) => distanceSquared(geometryCenter(a), school.center) - distanceSquared(geometryCenter(b), school.center))[0];
    if (!selected) return;
    const center = geometryCenter(selected);
    selectBin(selected.properties.bin_id, center);
    state.map.easeTo({ center, zoom: 17.6, pitch: state.is3d ? 53 : 0, bearing: state.is3d ? -27 : 0, padding: cameraPadding(true), duration });
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
    $("method-open").addEventListener("click", () => $("method-dialog").showModal());
    $("method-close").addEventListener("click", () => $("method-dialog").close());
    $("method-dialog").addEventListener("click", event => { if (event.target === $("method-dialog")) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
  }
  function setupControls() {
    $("controls-toggle").addEventListener("click", () => setControls(!state.controlsOpen));
    mobile.addEventListener("change", () => setControls(state.controlsOpen)); setControls(false);
    $("detail-close").addEventListener("click", closeSelection);
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("method-dialog").open && state.selected) closeSelection(); });
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
    $("reset-map").addEventListener("click", () => focusSchool("all"));
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
      renderDimensions(); setupMethod();
      state.map = new maplibregl.Map({ container: "map", style: { version: 8, sources: {}, light: { anchor: "viewport", color: "#fffdf3", intensity: .38, position: [1.4, 200, 45] }, layers: [{ id: "background", type: "background", paint: { "background-color": "#e9e7de" } }] }, center: [29.0832, 41.0041], zoom: 16, pitch: 53, bearing: -27, maxPitch: 75, minZoom: 13.5, maxZoom: 20.5, attributionControl: false, fadeDuration: 0, canvasContextAttributes: { preserveDrawingBuffer: true }, maxBounds: [[29.067, 40.989], [29.102, 41.02]] });
      state.map.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: "metric" }), "bottom-left");
      state.map.on("error", event => console.error("Map error:", event.error));
      await new Promise(resolve => state.map.once("load", resolve));
      initLayers(); state.ready = true; setupControls(); renderSchools(); fitCamera();
      await new Promise(resolve => state.map.once("idle", resolve));
      $("loading").hidden = true;
      window.SokakPuan = {
        get map() { return state.map; }, get metadata() { return state.data.metadata; }, get buildings() { return state.data.buildings; },
        get selection() { return state.selected; }, get imageId() { return state.imageIds[state.imageIndex] || null; }, get imageIds() { return [...state.imageIds]; },
        get dimension() { return state.key; }, selectBuilding, selectBin, selectRoad, closeSelection
      };
    } catch (error) {
      console.error(error); $("loading").hidden = true; $("error").hidden = false;
    }
  }
  start();
})();
