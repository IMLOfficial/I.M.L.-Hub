(() => {
  const promos = [
    { title: "I.M.L. Promo 1", src: "./promo/iml-promo-1.mp4" },
    { title: "I.M.L. Promo 2", src: "./promo/iml-promo-2.mp4" },
    { title: "I.M.L. Promo 3", src: "./promo/iml-promo-3.mp4" },
    { title: "I.M.L. Promo 4", src: "./promo/iml-promo-4.mp4" }
  ];

  const STYLE_ID = "imlPromoAdStyles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .promo-rail{
        position:fixed;
        top:118px;
        bottom:104px;
        z-index:2;
        width:clamp(130px,10vw,170px);
        display:grid;
        align-content:start;
        gap:14px;
        pointer-events:none;
      }
      .promo-rail.left{left:14px}.promo-rail.right{right:14px}
      .promo-ad-card{
        --mx:50%;--my:50%;
        position:relative;
        display:block;
        min-height:216px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:16px;
        overflow:hidden;
        color:#fff;
        text-decoration:none;
        background:linear-gradient(180deg,rgba(28,28,28,.92),rgba(8,8,8,.94));
        box-shadow:0 18px 52px rgba(0,0,0,.38),0 0 28px rgba(255,23,68,.16);
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
        background:radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.18),transparent 32%),linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.7));
        opacity:.88;
      }
      .promo-ad-card::after{
        content:"Sponsored";
        position:absolute;
        right:8px;
        top:8px;
        z-index:4;
        padding:5px 7px;
        border-radius:999px;
        background:rgba(0,0,0,.56);
        color:#dcdcdc;
        font-size:.62rem;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        border:1px solid rgba(255,255,255,.1);
      }
      .promo-ad-card video{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:cover;
        opacity:.78;
        background:#070707;
        transition:transform .35s ease,opacity .22s ease,filter .22s ease;
      }
      .promo-ad-card:hover video,.promo-ad-card:focus-within video{transform:scale(1.06);opacity:.95;filter:saturate(1.14)}
      .promo-ad-copy{
        position:absolute;
        left:10px;
        right:10px;
        bottom:10px;
        z-index:3;
        display:grid;
        gap:6px;
      }
      .promo-ad-copy strong{font-size:.96rem;line-height:1.05;text-shadow:0 2px 12px rgba(0,0,0,.7)}
      .promo-ad-copy small{color:#eee;font-size:.72rem;line-height:1.25}
      .promo-ad-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
      .promo-ad-pill{
        display:inline-flex;
        min-height:28px;
        align-items:center;
        justify-content:center;
        padding:6px 9px;
        border-radius:999px;
        background:linear-gradient(135deg,#ff1744,#ff5c8a);
        color:#fff;
        font-size:.72rem;
        font-weight:950;
        border:0;
      }
      .promo-sound-button{
        min-height:28px;
        padding:6px 9px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(0,0,0,.42);
        color:#fff;
        font-size:.72rem;
        font-weight:900;
        cursor:pointer;
      }
      .promo-ad-card.is-missing video{display:none}
      .promo-ad-card.is-missing{
        background:radial-gradient(circle at 50% 30%,rgba(255,23,68,.28),transparent 44%),linear-gradient(180deg,rgba(24,24,24,.96),rgba(4,4,4,.94)),url("./logo.svg") center 28%/72% no-repeat;
      }
      .promo-ad-card.is-missing .promo-ad-copy small::after{content:" Upload the MP4 to the promo folder."}
      .promo-mobile-strip{
        position:relative;
        z-index:1;
        display:none;
        max-width:1120px;
        margin:18px auto 0;
        padding:14px;
        border:1px solid rgba(255,255,255,.1);
        border-radius:18px;
        background:linear-gradient(180deg,rgba(22,22,22,.86),rgba(8,8,8,.82));
        box-shadow:0 18px 48px rgba(0,0,0,.24);
      }
      .promo-mobile-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px}
      .promo-mobile-head strong{font-size:1.05rem}.promo-mobile-head small{color:#aaa;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
      .promo-mobile-grid{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px}
      .promo-mobile-grid .promo-ad-card{min-height:220px;scroll-snap-align:start}
      @media (max-width:1499px){.promo-rail{display:none}.promo-mobile-strip{display:block}.promo-mobile-grid{grid-template-columns:repeat(4,minmax(170px,1fr))}}
      @media (min-width:1500px){body.has-promo-ads main>section>h2,body.has-promo-ads main>section>p,body.has-promo-ads .hub-panel,body.has-promo-ads .library-shell,body.has-promo-ads .action-grid,body.has-promo-ads .now-strip{max-width:min(960px,calc(100vw - 420px))}}
      @media (max-width:720px){.promo-mobile-strip{margin:14px 12px 0;border-radius:14px;padding:12px}.promo-mobile-grid{grid-template-columns:repeat(4,minmax(145px,72vw))}.promo-mobile-grid .promo-ad-card{min-height:210px}.promo-ad-card::after{font-size:.58rem}.promo-ad-copy strong{font-size:.9rem}}
      @media (prefers-reduced-motion:reduce){.promo-ad-card video{transition:none}.promo-ad-card:hover video,.promo-ad-card:focus-within video{transform:none}}
    `;
    document.head.appendChild(style);
  }

  function cardTemplate(promo, index) {
    return `
      <article class="promo-ad-card" data-promo-index="${index}">
        <video muted loop playsinline preload="metadata" poster="./logo.svg" aria-label="${promo.title}">
          <source src="${promo.src}" type="video/mp4">
        </video>
        <span class="promo-ad-copy">
          <strong>${promo.title}</strong>
          <small>New I.M.L. visual drop</small>
          <span class="promo-ad-actions">
            <span class="promo-ad-pill">Watch</span>
            <button class="promo-sound-button" type="button">Sound</button>
          </span>
        </span>
      </article>
    `;
  }

  function hydrateCard(card) {
    const video = card.querySelector("video");
    const sound = card.querySelector(".promo-sound-button");
    if (!video || !sound || card.dataset.ready === "true") return;
    card.dataset.ready = "true";

    const tryPlay = () => video.play().catch(() => {});
    video.addEventListener("canplay", tryPlay, { once: true });
    video.addEventListener("error", () => card.classList.add("is-missing"));
    card.addEventListener("pointermove", event => {
      if (innerWidth <= 760) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }, { passive: true });
    card.addEventListener("pointerenter", tryPlay, { passive: true });
    sound.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll(".promo-ad-card video").forEach(item => {
        if (item !== video) item.muted = true;
      });
      video.muted = !video.muted;
      sound.textContent = video.muted ? "Sound" : "Mute";
      tryPlay();
      dispatchEvent(new CustomEvent("iml:boost", { detail: { x: event.clientX || innerWidth / 2, y: event.clientY || innerHeight * 0.35, power: 0.85 } }));
    });
    tryPlay();
  }

  function buildPromos() {
    if (document.getElementById("promoAdLeft")) return;
    document.body.classList.add("has-promo-ads");

    const left = document.createElement("aside");
    left.id = "promoAdLeft";
    left.className = "promo-rail left";
    left.setAttribute("aria-label", "I.M.L. left promo videos");
    left.innerHTML = [promos[0], promos[2]].map((promo, index) => cardTemplate(promo, index === 0 ? 0 : 2)).join("");

    const right = document.createElement("aside");
    right.id = "promoAdRight";
    right.className = "promo-rail right";
    right.setAttribute("aria-label", "I.M.L. right promo videos");
    right.innerHTML = [promos[1], promos[3]].map((promo, index) => cardTemplate(promo, index === 0 ? 1 : 3)).join("");

    document.body.append(left, right);

    const mobile = document.createElement("section");
    mobile.id = "promoAdStrip";
    mobile.className = "promo-mobile-strip";
    mobile.setAttribute("aria-label", "I.M.L. promo videos");
    mobile.innerHTML = `
      <div class="promo-mobile-head"><strong>I.M.L. Promos</strong><small>Spotlight</small></div>
      <div class="promo-mobile-grid">${promos.map(cardTemplate).join("")}</div>
    `;

    const actionSection = document.querySelector(".action-grid")?.closest("section");
    if (actionSection) actionSection.insertAdjacentElement("afterend", mobile);
    else document.querySelector("main")?.appendChild(mobile);

    document.querySelectorAll(".promo-ad-card").forEach(hydrateCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPromos, { once: true });
  } else {
    buildPromos();
  }
})();
