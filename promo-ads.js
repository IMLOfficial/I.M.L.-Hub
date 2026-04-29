(() => {
  const promos = [
    { title: "I.M.L. Promo 1", src: "./promo/I.M.L.%201.mp4" },
    { title: "I.M.L. Promo 2", src: "./promo/I.M.L.%202.mp4" },
    { title: "I.M.L. Promo 3", src: "./promo/I.M.L.%203.mp4" },
    { title: "I.M.L. Promo 4", src: "./promo/I.M.L.%204.mp4" }
  ];

  const STYLE_ID = "imlPromoAdStyles";

  function removeOldPromos() {
    document.querySelectorAll("#promoMotionBg,#promoGifStrip,#promoAdLeft,#promoAdRight,#promoAdStrip").forEach(element => element.remove());
    document.querySelectorAll('a[href="#promoAdStrip"],[data-mobile-section="promoAdStrip"],a[href="#promoGifStrip"],[data-mobile-section="promoGifStrip"]').forEach(element => element.remove());
    document.body.classList.remove("has-motion-promos", "has-promo-gifs");
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.has-promo-ads{--promo-rail-width:clamp(170px,13vw,235px)}
      .promo-rail{
        position:fixed;
        top:104px;
        bottom:92px;
        z-index:5;
        width:var(--promo-rail-width);
        display:grid;
        align-content:center;
        gap:18px;
        pointer-events:none;
      }
      .promo-rail.left{left:10px}
      .promo-rail.right{right:10px}
      .promo-ad-card{
        --mx:50%;--my:44%;
        position:relative;
        display:block;
        width:100%;
        aspect-ratio:16/10;
        min-height:0;
        padding:0;
        border:1px solid rgba(255,255,255,.14);
        border-radius:10px;
        overflow:hidden;
        background:#050505 url("./logo.svg") center/50% no-repeat;
        box-shadow:0 18px 50px rgba(0,0,0,.36),0 0 28px rgba(77,184,255,.12);
        pointer-events:auto;
        transform:translateZ(0);
        isolation:isolate;
        cursor:pointer;
        clip-path:none;
      }
      .promo-ad-card::after{
        content:"";
        position:absolute;
        inset:0;
        z-index:2;
        pointer-events:none;
        background:
          radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.16),transparent 30%),
          linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.24));
        opacity:.62;
        transition:opacity .18s ease;
      }
      .promo-ad-card video{
        position:absolute;
        inset:0;
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
        opacity:.96;
        transform:scale(1.08);
        transition:transform .36s ease,filter .28s ease,opacity .18s ease;
        pointer-events:none;
      }
      .promo-ad-card:hover video,
      .promo-ad-card:focus-visible video{
        transform:scale(1.16);
        filter:saturate(1.18) contrast(1.08);
      }
      .promo-ad-card:hover::after,
      .promo-ad-card:focus-visible::after{opacity:.86}
      .promo-ad-card.is-missing{display:none}
      .promo-mobile-strip{
        position:relative;
        z-index:2;
        display:none;
        max-width:1120px;
        margin:16px auto 0;
        padding:0 14px;
      }
      .promo-mobile-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(150px,1fr));
        gap:10px;
        overflow-x:auto;
        scroll-snap-type:x mandatory;
        scrollbar-width:none;
        padding:4px 2px 8px;
      }
      .promo-mobile-grid::-webkit-scrollbar{display:none}
      .promo-mobile-grid .promo-ad-card{
        aspect-ratio:16/10;
        min-height:0;
        scroll-snap-align:start;
      }
      @media (max-width:1199px){
        .promo-rail{display:none}
        .promo-mobile-strip{display:block}
        .promo-mobile-grid{grid-template-columns:repeat(4,minmax(230px,1fr))}
      }
      @media (min-width:1200px){
        body.has-promo-ads main>section>h2,
        body.has-promo-ads main>section>p,
        body.has-promo-ads .hub-panel,
        body.has-promo-ads .library-shell,
        body.has-promo-ads .action-grid,
        body.has-promo-ads .now-strip{
          max-width:min(1000px,calc(100vw - 520px));
        }
      }
      @media (min-width:1500px){
        body.has-promo-ads{--promo-rail-width:clamp(210px,14vw,280px)}
        body.has-promo-ads main>section>h2,
        body.has-promo-ads main>section>p,
        body.has-promo-ads .hub-panel,
        body.has-promo-ads .library-shell,
        body.has-promo-ads .action-grid,
        body.has-promo-ads .now-strip{
          max-width:min(1060px,calc(100vw - 620px));
        }
      }
      @media (max-width:720px){
        .promo-mobile-strip{margin:14px 0 0;padding:0 12px}
        .promo-mobile-grid{grid-template-columns:repeat(4,minmax(220px,72vw))}
        .promo-mobile-grid .promo-ad-card{border-radius:10px}
      }
      @media (prefers-reduced-motion:reduce){
        .promo-ad-card video{transition:none}
        .promo-ad-card:hover video,.promo-ad-card:focus-visible video{transform:scale(1.04);filter:none}
      }
    `;
    document.head.appendChild(style);
  }

  function cardTemplate(promo, index) {
    return `
      <button type="button" class="promo-ad-card" data-promo-index="${index}" aria-label="${promo.title}">
        <video muted loop playsinline autoplay preload="metadata" poster="./logo.svg">
          <source src="${promo.src}" type="video/mp4">
        </video>
      </button>
    `;
  }

  function hydrateCard(card) {
    if (card.dataset.ready === "true") return;
    card.dataset.ready = "true";
    const video = card.querySelector("video");
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.addEventListener("error", () => card.classList.add("is-missing"));

    function play() {
      if (!visible || document.hidden || reduced.matches) return;
      video.play().catch(() => {});
    }

    function pause() {
      video.pause();
    }

    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }, { passive: true });

    card.addEventListener("pointerdown", event => {
      dispatchEvent(new CustomEvent("iml:boost", {
        detail: { x: event.clientX || innerWidth / 2, y: event.clientY || innerHeight * 0.35, power: 0.58 }
      }));
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          visible = entry.isIntersecting && entry.intersectionRatio > 0.18;
          if (visible) play();
          else pause();
        });
      }, { rootMargin: "120px 0px", threshold: [0, 0.18, 0.6] });
      observer.observe(card);
    } else {
      visible = true;
      play();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else play();
    });
  }

  function buildPromos() {
    removeOldPromos();
    ensureStyles();
    if (document.getElementById("promoAdLeft")) return;
    document.body.classList.add("has-promo-ads");

    const left = document.createElement("aside");
    left.id = "promoAdLeft";
    left.className = "promo-rail left";
    left.setAttribute("aria-label", "I.M.L. left animated promos");
    left.innerHTML = [promos[0], promos[2]].map((promo, index) => cardTemplate(promo, index === 0 ? 0 : 2)).join("");

    const right = document.createElement("aside");
    right.id = "promoAdRight";
    right.className = "promo-rail right";
    right.setAttribute("aria-label", "I.M.L. right animated promos");
    right.innerHTML = [promos[1], promos[3]].map((promo, index) => cardTemplate(promo, index === 0 ? 1 : 3)).join("");

    document.body.append(left, right);

    const mobile = document.createElement("section");
    mobile.id = "promoAdStrip";
    mobile.className = "promo-mobile-strip";
    mobile.setAttribute("aria-label", "I.M.L. animated promos");
    mobile.innerHTML = `<div class="promo-mobile-grid">${promos.map(cardTemplate).join("")}</div>`;

    const hero = document.getElementById("hero");
    const actionSection = document.querySelector(".action-grid")?.closest("section");
    if (hero) hero.insertAdjacentElement("afterend", mobile);
    else if (actionSection) actionSection.insertAdjacentElement("afterend", mobile);
    else document.querySelector("main")?.appendChild(mobile);

    document.querySelectorAll(".promo-ad-card").forEach(hydrateCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPromos, { once: true });
  } else {
    buildPromos();
  }
})();
