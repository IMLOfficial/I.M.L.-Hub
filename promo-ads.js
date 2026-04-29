(() => {
  const promos = [
    { title: "I.M.L. Promo 1", src: "./promo/I.M.L.%201.mp4" },
    { title: "I.M.L. Promo 2", src: "./promo/I.M.L.%202.mp4" },
    { title: "I.M.L. Promo 3", src: "./promo/I.M.L.%203.mp4" },
    { title: "I.M.L. Promo 4", src: "./promo/I.M.L.%204.mp4" }
  ];
  const SECTION_ID = "promoGifStrip";
  const STYLE_ID = "imlPromoGifStyles";
  let observerStarted = false;
  let scheduled = false;

  function removeOldPromos() {
    document.querySelectorAll("#promoMotionBg,#promoAdLeft,#promoAdRight,#promoAdStrip").forEach(element => element.remove());
    document.querySelectorAll('a[href="#promoAdStrip"],[data-mobile-section="promoAdStrip"]').forEach(element => element.remove());
    document.body.classList.remove("has-promo-ads", "has-motion-promos");
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .promo-gif-strip{
        position:relative;
        z-index:2;
        max-width:1180px;
        margin:6px auto 10px;
        padding:0 20px 10px;
      }
      .promo-gif-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:14px;
      }
      .promo-gif-card{
        position:relative;
        width:100%;
        min-height:0;
        padding:0;
        display:block;
        aspect-ratio:1/1;
        border-radius:18px;
        overflow:hidden;
        border:1px solid rgba(255,255,255,.12);
        background:#050505 url("./logo.svg") center/46% no-repeat;
        box-shadow:0 18px 46px rgba(0,0,0,.32),0 0 24px rgba(77,184,255,.1);
        transform:translateZ(0);
        isolation:isolate;
        cursor:pointer;
      }
      .promo-gif-card::after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          radial-gradient(circle at var(--mx,50%) var(--my,42%),rgba(255,255,255,.14),transparent 28%),
          linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.18));
        opacity:.58;
        transition:opacity .18s ease;
      }
      .promo-gif-card video{
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
        opacity:.96;
        transform:scale(1.02);
        transition:transform .32s ease,filter .32s ease,opacity .18s ease;
        pointer-events:none;
      }
      .promo-gif-card:hover video,
      .promo-gif-card:focus-visible video{
        transform:scale(1.08);
        filter:saturate(1.18) contrast(1.06);
      }
      .promo-gif-card:hover::after,
      .promo-gif-card:focus-visible::after{opacity:.82}
      .promo-gif-card.is-missing{display:none}
      .mobile-music-nav{grid-template-columns:repeat(4,1fr)!important}
      @media (max-width:760px){
        .promo-gif-strip{
          margin:4px 0 8px;
          padding:0 12px 8px;
        }
        .promo-gif-grid{
          display:flex;
          gap:10px;
          overflow-x:auto;
          scroll-snap-type:x mandatory;
          scrollbar-width:none;
          padding:2px 2px 6px;
        }
        .promo-gif-grid::-webkit-scrollbar{display:none}
        .promo-gif-card{
          flex:0 0 min(42vw,176px);
          border-radius:16px;
          scroll-snap-align:start;
          box-shadow:0 14px 34px rgba(0,0,0,.28);
        }
      }
      @media (prefers-reduced-motion:reduce){
        .promo-gif-card video{transition:none}
        .promo-gif-card:hover video,.promo-gif-card:focus-visible video{transform:scale(1.02);filter:none}
      }
    `;
    document.head.appendChild(style);
  }

  function cardTemplate(promo, index) {
    return `
      <button type="button" class="promo-gif-card" data-promo-index="${index}" aria-label="${promo.title}">
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
        detail: { x: event.clientX || innerWidth / 2, y: event.clientY || innerHeight * 0.35, power: 0.55 }
      }));
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      const view = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          visible = entry.isIntersecting && entry.intersectionRatio > 0.18;
          if (visible) play();
          else pause();
        });
      }, { rootMargin: "120px 0px", threshold: [0, 0.18, 0.6] });
      view.observe(card);
    } else {
      visible = true;
      play();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else play();
    });
  }

  function buildGifStrip() {
    removeOldPromos();
    ensureStyles();
    if (document.getElementById(SECTION_ID)) return;
    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "promo-gif-strip";
    section.setAttribute("aria-label", "I.M.L. animated promo GIFs");
    section.innerHTML = `<div class="promo-gif-grid">${promos.map(cardTemplate).join("")}</div>`;

    const hero = document.getElementById("hero");
    const actionSection = document.querySelector(".action-grid")?.closest("section");
    if (hero) hero.insertAdjacentElement("afterend", section);
    else if (actionSection) actionSection.insertAdjacentElement("beforebegin", section);
    else document.querySelector("main")?.prepend(section);

    section.querySelectorAll(".promo-gif-card").forEach(hydrateCard);
  }

  function startObserver() {
    if (observerStarted) return;
    observerStarted = true;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        removeOldPromos();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      buildGifStrip();
      startObserver();
    }, { once: true });
  } else {
    buildGifStrip();
    startObserver();
  }
})();
