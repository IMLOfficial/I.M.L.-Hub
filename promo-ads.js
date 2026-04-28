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
        width:clamp(188px,15vw,270px);
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
        min-height:clamp(270px,42vh,380px);
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
        background:radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.18),transparent 28%);
        opacity:.72;
      }
      .promo-ad-card::after{
        content:"";
        display:none;
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
      .promo-ad-copy{display:none}
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
      .promo-motion-bg{
        --mx:50%;
        --my:32%;
        --px:0px;
        --py:0px;
        position:fixed;
        inset:0;
        z-index:0;
        pointer-events:none;
        overflow:hidden;
        opacity:.62;
        mix-blend-mode:screen;
        perspective:900px;
      }
      .promo-motion-bg::before{
        content:"";
        position:absolute;
        inset:-16%;
        background:
          radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.2),transparent 16rem),
          radial-gradient(circle at calc(100% - var(--mx)) 72%,rgba(255,0,51,.18),transparent 18rem),
          linear-gradient(115deg,transparent 0 34%,rgba(77,184,255,.12) 45%,transparent 58% 100%);
        filter:saturate(1.25);
        opacity:.9;
      }
      .promo-motion-bg::after{
        content:"";
        position:absolute;
        inset:0;
        background:
          repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 1px,transparent 1px 64px),
          radial-gradient(circle at 50% 50%,transparent 0 45%,rgba(0,0,0,.78) 100%);
        opacity:.46;
      }
      .promo-motion-stage{
        position:absolute;
        inset:0;
        transform:translate3d(calc(var(--px) * -.18),calc(var(--py) * -.14),0) rotateX(calc(var(--py) * -.018deg)) rotateY(calc(var(--px) * .018deg));
        transform-style:preserve-3d;
      }
      .promo-motion-tile{
        --x:0%;
        --y:0%;
        --r:0deg;
        --depth:.1;
        position:absolute;
        left:var(--x);
        top:var(--y);
        width:clamp(280px,32vw,560px);
        aspect-ratio:16/10;
        border-radius:30px;
        overflow:hidden;
        opacity:.28;
        border:1px solid rgba(255,255,255,.12);
        background:#050505 url("./logo.svg") center/46% no-repeat;
        box-shadow:0 26px 90px rgba(0,0,0,.42),0 0 46px rgba(77,184,255,.14);
        transform:translate3d(calc(var(--px) * var(--depth)),calc(var(--py) * var(--depth)),0) rotate(var(--r)) scale(.96);
        transition:opacity .45s ease,filter .45s ease,transform .45s ease,box-shadow .45s ease;
        filter:saturate(.92) contrast(1.08) brightness(.72) blur(.2px);
      }
      .promo-motion-tile:nth-child(1){--x:-7%;--y:10%;--r:-7deg;--depth:-.11}
      .promo-motion-tile:nth-child(2){--x:68%;--y:5%;--r:8deg;--depth:.09}
      .promo-motion-tile:nth-child(3){--x:-5%;--y:62%;--r:7deg;--depth:.13}
      .promo-motion-tile:nth-child(4){--x:64%;--y:58%;--r:-8deg;--depth:-.08}
      .promo-motion-tile video{
        width:100%;
        height:100%;
        object-fit:cover;
        opacity:.9;
        transform:scale(1.12);
        transition:transform 1.8s ease,opacity .35s ease,filter .35s ease;
      }
      .promo-motion-tile::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:1;
        background:
          radial-gradient(circle at var(--mx) var(--my),rgba(255,255,255,.22),transparent 30%),
          linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.68));
        opacity:.72;
      }
      .promo-motion-tile::after{
        content:"";
        position:absolute;
        inset:-40%;
        z-index:2;
        background:conic-gradient(from 120deg,transparent,rgba(77,184,255,.16),transparent,rgba(255,0,51,.14),transparent);
        opacity:.36;
        animation:promoMotionSpin 18s linear infinite;
      }
      .promo-motion-tile.is-active{
        opacity:.58;
        filter:saturate(1.35) contrast(1.12) brightness(.96);
        transform:translate3d(calc(var(--px) * var(--depth)),calc(var(--py) * var(--depth)),0) rotate(var(--r)) scale(1.05);
        box-shadow:0 30px 110px rgba(0,0,0,.48),0 0 70px rgba(77,184,255,.28),0 0 46px rgba(255,0,51,.18);
      }
      .promo-motion-tile.is-active video{
        transform:scale(1.02);
        opacity:1;
      }
      .promo-motion-tile.is-burst{animation:promoMotionBurst .7s ease-out}
      body.video-active .promo-motion-bg,body.iml-boosting .promo-motion-bg{opacity:.78}
      body.video-active .promo-motion-tile.is-active,body.iml-boosting .promo-motion-tile.is-active{filter:saturate(1.65) contrast(1.18) brightness(1.05)}
      @keyframes promoMotionSpin{to{transform:rotate(360deg)}}
      @keyframes promoMotionBurst{
        0%{box-shadow:0 0 0 rgba(255,255,255,0),0 0 0 rgba(255,0,51,0)}
        38%{box-shadow:0 0 0 12px rgba(255,255,255,.1),0 0 90px rgba(255,0,51,.34)}
        100%{box-shadow:0 30px 110px rgba(0,0,0,.48),0 0 70px rgba(77,184,255,.28)}
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
        .promo-mobile-grid .promo-ad-card{min-height:360px}
        .promo-ad-card::after{font-size:.58rem}
        .promo-ad-copy strong{font-size:1rem}
        .promo-motion-bg{opacity:.34}
        .promo-motion-bg::after{background:radial-gradient(circle at 50% 38%,transparent 0 34%,rgba(0,0,0,.82) 100%);opacity:.62}
        .promo-motion-stage{transform:translate3d(calc(var(--px) * -.05),calc(var(--py) * -.04),0)}
        .promo-motion-tile{
          display:none;
          left:-12vw;
          top:86px;
          width:124vw;
          height:42vh;
          aspect-ratio:auto;
          border-radius:0 0 36px 36px;
          opacity:.36;
          filter:saturate(1.1) contrast(1.08) brightness(.82);
          transform:translate3d(calc(var(--px) * -.03),calc(var(--py) * -.02),0) scale(1);
        }
        .promo-motion-tile.is-active{
          display:block;
          opacity:.44;
          transform:translate3d(calc(var(--px) * -.03),calc(var(--py) * -.02),0) scale(1);
        }
        .promo-motion-tile::after{animation-duration:26s;opacity:.2}
      }
      @media (prefers-reduced-motion:reduce){
        .promo-ad-card video{transition:none}
        .promo-ad-card:hover video,.promo-ad-card:focus-within video{transform:none}
        .promo-motion-bg{opacity:.18}
        .promo-motion-tile video{display:none}
        .promo-motion-tile::after{animation:none}
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

  function buildMotionBackground() {
    if (document.getElementById("promoMotionBg")) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");
    const saveData = Boolean(navigator.connection?.saveData);
    let activeIndex = 0;
    let raf = 0;
    let cycleTimer = 0;
    let multiVideo = false;

    const wall = document.createElement("div");
    wall.id = "promoMotionBg";
    wall.className = "promo-motion-bg";
    wall.setAttribute("aria-hidden", "true");
    wall.innerHTML = `
      <div class="promo-motion-stage">
        ${promos.map((promo, index) => `
          <div class="promo-motion-tile${index === 0 ? " is-active" : ""}" data-motion-index="${index}">
            <video muted loop playsinline preload="metadata" src="${promo.src}"></video>
          </div>
        `).join("")}
      </div>
    `;
    document.body.prepend(wall);
    document.body.classList.add("has-motion-promos");

    const shouldPlayMultiple = () => !reduced.matches && !saveData && !coarse.matches && innerWidth >= 860 && (navigator.hardwareConcurrency || 8) >= 5;
    const playVideo = video => {
      if (!video || reduced.matches) return;
      const result = video.play();
      if (result && typeof result.catch === "function") result.catch(() => {});
    };
    const setActive = (index, pulse = false) => {
      activeIndex = (Number(index) + promos.length) % promos.length;
      wall.querySelectorAll(".promo-motion-tile").forEach((tile, tileIndex) => {
        const isActive = tileIndex === activeIndex;
        tile.classList.toggle("is-active", isActive);
        if (pulse && isActive) {
          tile.classList.remove("is-burst");
          tile.offsetWidth;
          tile.classList.add("is-burst");
          setTimeout(() => tile.classList.remove("is-burst"), 720);
        }
        const video = tile.querySelector("video");
        if (multiVideo || isActive) playVideo(video);
        else video?.pause();
      });
    };
    const updateMode = () => {
      multiVideo = shouldPlayMultiple();
      setActive(activeIndex);
      clearInterval(cycleTimer);
      if (coarse.matches || innerWidth <= 760) {
        cycleTimer = setInterval(() => {
          if (!document.hidden) setActive(activeIndex + 1, true);
        }, 9000);
      }
    };
    const renderPointer = (x, y) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        wall.style.setProperty("--mx", `${x}%`);
        wall.style.setProperty("--my", `${y}%`);
        wall.style.setProperty("--px", `${(x - 50) * 1.2}px`);
        wall.style.setProperty("--py", `${(y - 50) * 1.2}px`);
      });
    };

    addEventListener("pointermove", event => {
      const x = Math.max(0, Math.min(100, (event.clientX / innerWidth) * 100));
      const y = Math.max(0, Math.min(100, (event.clientY / innerHeight) * 100));
      renderPointer(x, y);
      if (!coarse.matches) setActive(x < 50 ? (y < 50 ? 0 : 2) : (y < 50 ? 1 : 3));
    }, { passive: true });
    addEventListener("pointerdown", event => {
      renderPointer(Math.max(0, Math.min(100, (event.clientX / innerWidth) * 100)), Math.max(0, Math.min(100, (event.clientY / innerHeight) * 100)));
      setActive(activeIndex + 1, true);
    }, { passive: true });
    addEventListener("iml:mood", event => setActive(event.detail?.mood || 0, true));
    addEventListener("iml:boost", () => setActive(activeIndex + 1, true));
    addEventListener("iml:video-state", event => {
      document.body.classList.toggle("video-active", Boolean(event.detail?.playing));
      if (event.detail?.playing) setActive(activeIndex + 1, true);
    });
    addEventListener("resize", updateMode, { passive: true });
    document.addEventListener("visibilitychange", () => {
      wall.querySelectorAll("video").forEach(video => {
        if (document.hidden) video.pause();
        else if (multiVideo || video.closest(".is-active")) playVideo(video);
      });
    });
    updateMode();
  }

  function buildPromos() {
    buildMotionBackground();
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
