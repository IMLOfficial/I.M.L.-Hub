(() => {
  const promos = [
    { title: "I.M.L. Promo 1", src: "./promo/I.M.L.%201.mp4" },
    { title: "I.M.L. Promo 2", src: "./promo/I.M.L.%202.mp4" },
    { title: "I.M.L. Promo 3", src: "./promo/I.M.L.%203.mp4" },
    { title: "I.M.L. Promo 4", src: "./promo/I.M.L.%204.mp4" }
  ];

  const STYLE_ID = "imlPromoStripStyles";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .promo-rail{display:none!important}
      #promoAdStrip{position:relative;z-index:2;display:block!important;max-width:1100px;margin:18px auto 4px;padding:0 clamp(10px,2vw,18px)}
      .promo-mobile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;overflow:visible;padding:0}
      .promo-ad-card{position:relative;display:block;width:100%;aspect-ratio:16/9;min-height:0;padding:0;border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden;background:#060606 url("./logo.svg") center/48% no-repeat;box-shadow:0 14px 36px rgba(0,0,0,.34);cursor:pointer;clip-path:none!important}
      .promo-ad-card video{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;transform:scale(1.03);pointer-events:none;border-radius:inherit;opacity:.96}
      .promo-ad-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.18));pointer-events:none}
      .promo-ad-card:hover video,.promo-ad-card:focus-visible video{transform:scale(1.08);filter:saturate(1.12) contrast(1.06)}
      .promo-ad-card.is-missing{display:none}
      @media (max-width:760px){#promoAdStrip{margin-top:10px;padding:0 10px}.promo-mobile-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.promo-ad-card{border-radius:10px}}
      @media (prefers-reduced-motion:reduce){.promo-ad-card video{display:none}}
    `;
    document.head.appendChild(style);
  }

  function cardTemplate(promo, index) {
    return `
      <button type="button" class="promo-ad-card" data-promo-index="${index}" aria-label="${promo.title}">
        <video muted loop playsinline preload="none" poster="./logo.svg" data-src="${promo.src}"></video>
      </button>
    `;
  }

  function hydrateCard(card) {
    const video = card.querySelector("video");
    if (!video || card.dataset.ready === "true") return;
    card.dataset.ready = "true";
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.addEventListener("error", () => card.classList.add("is-missing"));

    function ensureSource() {
      if (video.dataset.loaded === "true") return;
      video.dataset.loaded = "true";
      const source = document.createElement("source");
      source.src = video.dataset.src;
      source.type = "video/mp4";
      video.appendChild(source);
      video.load();
    }

    let visible = false;
    const canAnimate = () => !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const play = () => {
      if (!visible || document.hidden || !canAnimate()) return;
      ensureSource();
      video.play().catch(() => {});
    };
    const pause = () => video.pause();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          visible = entry.isIntersecting && entry.intersectionRatio > 0.2;
          visible ? play() : pause();
        });
      }, { rootMargin: "80px 0px", threshold: [0, 0.2, 0.6] });
      observer.observe(card);
    } else {
      visible = true;
      setTimeout(play, 900);
    }

    card.addEventListener("click", () => {
      visible = true;
      play();
    });
    document.addEventListener("visibilitychange", () => document.hidden ? pause() : play());
  }

  function buildPromos() {
    ensureStyles();
    document.querySelectorAll("#promoAdLeft,#promoAdRight,.promo-rail,#promoGifStrip").forEach(node => node.remove());
    document.body.classList.add("has-promo-ads");

    let strip = document.getElementById("promoAdStrip");
    if (!strip) {
      strip = document.createElement("section");
      strip.id = "promoAdStrip";
      strip.className = "promo-mobile-strip";
      strip.setAttribute("aria-label", "I.M.L. animated promos");
      const hero = document.getElementById("hero");
      const main = document.querySelector("main");
      if (hero) hero.insertAdjacentElement("afterend", strip);
      else main?.prepend(strip);
    }

    strip.innerHTML = `<div class="promo-mobile-grid">${promos.map(cardTemplate).join("")}</div>`;
    strip.querySelectorAll(".promo-ad-card").forEach(hydrateCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPromos, { once: true });
  } else {
    buildPromos();
  }
})();
