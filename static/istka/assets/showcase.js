/* Home page: the showcase panorama (step 02), the atlas samples (step 04), and the Prova and Kent Atölyesi
   examples (steps 05 and 06) from data/showcase.json, data/prova.json and data/kent.json. */
"use strict";

(async () => {
  const sc = await GI.json("data/showcase.json");
  const step = document.getElementById("bakis");
  step.dataset.cam = JSON.stringify(sc.cam);
  document.querySelector("[data-showcase-title]").textContent = sc.title;
  const pano = document.querySelector("[data-showcase-pano]");
  pano.src = sc.pano_src;
  document.querySelector("[data-showcase-desc]").textContent = sc.description + " Betimleme modelin gözlemidir.";
  document.querySelector("[data-showcase-views]").innerHTML = sc.views.map(v =>
    `<figure><img src="${GI.viewSrc(v.src)}" alt="${GI.DIR_TR[v.direction]} görünüm" loading="lazy"><figcaption>${GI.DIR_TR[v.direction]}</figcaption></figure>`).join("");

  const box = document.querySelector("[data-atlas-samples]");
  if (box && sc.atlas) {
    box.innerHTML = sc.atlas.map(a =>
      `<a class="tile" href="atlas.html#q=${encodeURIComponent(a.query)}"><img src="${GI.viewSrc(a.src)}" alt="${a.query}" loading="lazy"><span class="cap">“${a.query}”</span></a>`).join("");
  }

  // the map flies to the street of the example and looks the way the photograph looks
  const place = (id, it) => {
    const s = document.getElementById(id);
    s.dataset.cam = JSON.stringify({ center: [it.lon, it.lat], zoom: 17.3, pitch: 68, bearing: it.heading ?? 0 });
    s.dataset.spot = JSON.stringify([it.lon, it.lat]);
  };
  const media = (box, src, look) => {
    box.innerHTML = look === "video" ? "" : GI.compare(src.src, look.img, { right: look.look_tr, wide: true });
    if (look === "video") {
      const v = src.looks.find(l => l.video);
      box.innerHTML = `<div class="media"><video src="${v.video.mp4}" poster="${v.video.poster}" autoplay muted loop playsinline controls></video></div>`;
    }
    GI.bindCompare(box);
  };

  try {
    const prova = await GI.json("data/prova.json");
    const it = prova.items.find(i => i.slug === "sahil") || prova.items[0];
    place("prova", it);
    document.querySelector("[data-prova-title]").textContent = it.title;
    const seg = document.querySelector("[data-prova-looks]"), box = document.querySelector("[data-prova-media]");
    const hasVideo = it.looks.some(l => l.video);
    seg.innerHTML = it.looks.map((l, k) => `<button type="button" data-k="${k}"${k === 0 ? ' class="on"' : ""}>${l.look_tr}</button>`).join("")
      + (hasVideo ? `<button type="button" data-k="video">Klip</button>` : "");
    media(box, it, it.looks[0]);
    seg.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      seg.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
      media(box, it, b.dataset.k === "video" ? "video" : it.looks[Number(b.dataset.k)]);
    });
  } catch (e) { document.getElementById("prova").hidden = true; }

  try {
    const kent = await GI.json("data/kent.json");
    const it = kent.items.find(i => i.slug === "kent_kiyi") || kent.items[0];
    place("kentatolyesi", it);
    const box = document.querySelector("[data-kent-media]");
    const look = it.looks.find(l => l.look === "kit_golge") || it.looks[0];
    box.innerHTML = GI.compare(it.src, look.img, { left: "Bugün", right: look.look_tr, wide: true });
    GI.bindCompare(box);
  } catch (e) { document.getElementById("kentatolyesi").hidden = true; }
})();
