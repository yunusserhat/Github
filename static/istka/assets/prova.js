/* Prova: one real street, several looks made with open models, and a short clip. */
"use strict";

(async () => {
  const $ = s => document.querySelector(s);
  let data;
  try { data = await GI.json("data/prova.json"); } catch (e) { $("[data-media]").innerHTML = `<p class="status">Prova görselleri henüz hazır değil.</p>`; return; }
  $("[data-models]").textContent = `Görseller ${data.model_edit} ile, klipler ${data.model_video} ile üretildi. İkisi de ticari kullanıma izin veren açık modeller.`;
  $("[data-licence]").textContent = data.source;
  const items = data.items.filter(i => i.looks.length);
  const params = new URLSearchParams(location.hash.slice(1));
  let cur = Math.max(0, items.findIndex(i => i.slug === params.get("s")));
  let look = params.get("l") || items[cur].looks[0].look;

  $("[data-src]").innerHTML = items.map((it, k) => `<button type="button" data-k="${k}">${it.title}</button>`).join("");
  function draw() {
    const it = items[cur];
    if (look !== "video" && !it.looks.some(l => l.look === look)) look = it.looks[0].look;
    const vid = it.looks.find(l => l.video);
    if (look === "video" && !vid) look = it.looks[0].look;
    $("[data-src]").querySelectorAll("button").forEach(b => b.classList.toggle("on", Number(b.dataset.k) === cur));
    $("[data-looks]").innerHTML = it.looks.map(l => `<button type="button" data-l="${l.look}"${l.look === look ? ' class="on"' : ""}>${l.look_tr}</button>`).join("")
      + (vid ? `<button type="button" data-l="video"${look === "video" ? ' class="on"' : ""}>Klip · ${vid.look_tr}</button>` : "");
    const m = $("[data-media]");
    if (look === "video") {
      m.innerHTML = `<div class="media"><video src="${vid.video.mp4}" poster="${vid.video.poster}" autoplay muted loop playsinline controls></video></div>`;
      $("[data-cap]").textContent = `${vid.look_tr} görselinden üretilen klip, yaklaşık 5 saniye`;
      $("[data-check]").textContent = "";
    } else {
      const l = it.looks.find(x => x.look === look);
      m.innerHTML = GI.compare(it.src, l.img, { right: l.look_tr, wide: true });
      GI.bindCompare(m);
      $("[data-cap]").textContent = "Kaydırıcıyı sürükle: solda gerçek sokak, sağda üretilen görünüm";
      $("[data-check]").textContent = l.verified === null ? "" : (l.verified ? "✓ Denetim modeli değişikliği görüyor" : "✕ Denetim modeli değişikliği göremedi");
    }
    $("[data-meta]").innerHTML = `${it.neighborhood}, ${it.district} · <a href="${it.mapillary_url}" target="_blank" rel="noopener">Kaynak görüntü (Mapillary)</a> · <a href="atlas.html">Benzer sokakları ara</a>`;
    history.replaceState(null, "", `#s=${it.slug}&l=${look}`);
  }
  $("[data-src]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { cur = Number(b.dataset.k); draw(); } });
  $("[data-looks]").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { look = b.dataset.l; draw(); } });
  draw();
})();
