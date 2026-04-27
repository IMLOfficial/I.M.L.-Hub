(() => {
  const promos = [
    { title: "I.M.L. Promo 1", src: "./promo/I.M.L.%201.mp4" },
    { title: "I.M.L. Promo 2", src: "./promo/I.M.L.%202.mp4" },
    { title: "I.M.L. Promo 3", src: "./promo/I.M.L.%203.mp4" },
    { title: "I.M.L. Promo 4", src: "./promo/I.M.L.%204.mp4" }
  ];

  const STYLE_ID = "imlPromoAdStyles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .promo-rail{
        position:fixed;
        top:92px;
        bottom:82px;
        z-index:5;
        width:clamp(158px,13vw,238px);
        display:grid;
        align-content:start;
        gap:16px;
        pointer-events:none;
      }
      .promo-rail.left{left:14px}.promo-rail.right{right:14px}
      .promo-ad-card{
        --mx:50%;--my:50%;
        position:relative;
        display:block;
        min-height:clamp(230px,38vh,330px);
        border:1px solid rgba(255,255,255,.14);
        border-radius:18px;
        overflow:hidden;
        color:#fff;
        background:radial-gradient(circle at 50% 20%,rgba(255,0,51,.26),transparent 42%),linear-gradient(180deg,rgba(27,27,27,.94),rgba(5,5,5,.98));
        box-shadow:0 22px 62px rgba(0,0,0,.46),0 0 34px rgba(255,0,51,.18);
        pointer-events:auto;
        transform:translateZ(0);
        isolation:isolate;
      }
      .promo-ad-card::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:2;
        pointer-events:none;
        background:radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.22),transparent 30%),linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.7));
        opacity:.9;
      }
      .promo-ad-card::after{
        content:"GIF Loop";
        position:absolute;
        right:10px;
        top:10px;
        z-index:4;
        padding:6px 8px;
        border-radius:999px;
        background:rgba(0,0,0,.62);
        color:#fff;
        font-size:.65rem;
        font-weight:950;
        letter-spacing:.08em;
        text-transform:uppercase;
        border:1px solid rgba(255,255,255,.14);
      }
      .promo-ad-card video{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:cover;
        opacity:.9;
        background:#070707 url("./logo.svg") center/56% no-repeat;
        transition:transform .42s ease,opacity .22s ease,filter .22s ease;
      }
      .promo-ad-card:hover video,.promo-ad-card:focus-within video{
        transform:scale(1.08);
        opacity:1;
        filter:saturate(1.2) contrast(1.06);
      }
      .promo-ad-copy{
        position:absolute;
        left:12px;
        right:12px;
        bottom:12px;
        z-index:3;
        display:grid;
        gap:8px;
      }
      .promo-ad-copy strong{
        font-size:1.08rem;
        line-height:1.05;
        text-shadow:0 2px 14px rgba(0,0,0,.8);
      }
      .promo-ad-copy small{
        color:#f0f0f0;
        font-size:.78rem;
        line-height:1.25;
        text-shadow:0 2px 10px rgba(0,0,0,.76);
      }
      .promo-ad-pill{
        display:inline-flex;
        width:max-content;
        min-height:30px;
        align-items:center;
        justify-content:center;
        padding:7px 10px;
        border-radius:999px;
        background:linear-gradient(135deg,#ff0033,#ff5c8a);
        color:#fff;
        font-size:.72rem;
        font-weight:950;
        border:0;
      }
      .promo-ad-card.is-missing video{display:none}
      .promo-ad-card.is-missing{
        background:radial-gradient(circle at 50% 30%,rgba(255,0,51,.3),transparent 44%),linear-gradient(180deg,rgba(24,24,24,.96),rgba(4,4,4,.94)),url("./logo.svg") center 28%/72% no-repeat;
      }
      .promo-ad-card.is-missing .promo-ad-copy small::after{content:" Upload the MP4 to the promo folder."}
      .promo-mobile-strip{
        position:relative;
        z-index:2;
        display:none;
        max-width:1120px;
        margin:22px auto 0;
        padding:16px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:20px;
        background:linear-gradient(180deg,rgba(20,20,20,.94),rgba(6,6,6,.88));
        box-shadow:0 20px 52px rgba(0,0,0,.32),0 0 30px rgba(255,0,51,.13);
      }
      .promo-mobile-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 14px}
      .promo-mobile-head strong{font-size:1.1rem}.promo-mobile-head small{color:#aaa;font-weight:900;text-transform:uppercase;letter-spacing:.1em}
      .promo-mobile-grid{
        display:grid;
        grid-template-columns:repeat(4,minmax(220px,1fr));
        gap:12px;
        overflow-x:auto;
        scroll-snap-type:x mandatory;
        padding-bottom:4px;
      }
      .promo-mobile-grid .promo-ad-card{
        min-height:310px;
        scroll-snap-align:start;
      }
      @media (max-width:1199px){
        .promo-rail{display:none}
        .promo-mobile-strip{display:block}
        .promo-mobile-grid{grid-template-columns:repeat(4,minmax(240px,46vw))}
      }
      @media (min-width:1200px){
        body.has-promo-ads main>section>h2,body.has-promo-ads main>section>p,body.has-promo-ads .hub-panel,body.has-promo-ads .library-shell,body.has-promo-ads .action-grid,body.has-promo-ads .now-strip{max-width:min(980px,calc(100vw - 520px))}
      }
      @media (min-width:1560px){
        body.has-promo-ads main>section>h2,body.has-promo-ads main>section>p,body.has-promo-ads .hub-panel,body.has-promo-ads .library-shell,body.has-promo-ads .action-grid,body.has-promo-ads .now-strip{max-width:min(1080px,calc(100vw - 560px))}
      }
      @media (max-width:720px){
        .promo-mobile-strip{margin:16px 12px 0;border-radius:16px;padding:12px}
        .promo-mobile-grid{grid-template-columns:repeat(4,minmax(260px,82vw))}
        .promo-mobile-grid .promo-ad-card{min-height:330px}
        .promo-ad-card::after{font-size:.58rem}
        .promo-ad-copy strong{font-size:1rem}
      }
      @media (prefers-reduced-motion:reduce){
        .promo-ad-card video{transition:none}
        .promo-ad-card:hover video,.promo-ad-card:focus-within video{transform:none}
      }
    `;
    document.head.appendChild(style);
  }

  function cardTemplate(promo, index) {
    return `
      <article class="promo-ad-card" data-promo-index="${index}" tabindex="0">
        <video class="promo-gif-video" muted loop playsinline autoplay preload="metadata" poster="./logo.svg" aria-label="${promo.title} animated promo">
          <source src="${promo.src}" type="video/mp4">
        </video>
        <span class="promo-ad-copy">
          <strong>${promo.title}</strong>
          <small>Silent animated I.M.L. promo</small>
          <span class="promo-ad-pill">Looping</span>
        </span>
      </article>
    `;
  }

  function hydrateCard(card) {
    const video = card.querySelector("video");
    if (!video || card.dataset.ready === "true") return;
    card.dataset.ready = "true";

    let visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const playLoop = () => {
      if (document.hidden || !visible || reduced.matches) return;
      video.muted = true;
      video.play().catch(() => {});
    };
    const pauseLoop = () => video.pause();

    video.controls = false;
    video.disablePictureInPicture = true;
    video.addEventListener("error", () => card.classList.add("is-missing"));

    card.addEventListener("pointermove", event => {
      if (innerWidth <= 760) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }, { passive: true });

    card.addEventListener("pointerdown", event => {
      dispatchEvent(new CustomEvent("iml:boost", {
        detail: { x: event.clientX || innerWidth / 2, y: event.clientY || innerHeight * 0.35, power: 0.75 }
      }));
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          visible = entry.isIntersecting && entry.intersectionRatio > 0.28;
          if (visible) playLoop();
          else pauseLoop();
        });
      }, { rootMargin: "80px 0px", threshold: [0, 0.28, 0.7] });
      observer.observe(card);
    } else {
      visible = true;
      playLoop();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseLoop();
      else playLoop();
    });
  }

  function buildPromos() {
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
    mobile.innerHTML = `
      <div class="promo-mobile-head"><strong>I.M.L. Promos</strong><small>GIF Style</small></div>
      <div class="promo-mobile-grid">${promos.map(cardTemplate).join("")}</div>
    `;

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
