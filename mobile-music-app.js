(() => {
  const STYLE_ID = "imlMobileMusicAppStyles";
  const NAV_ID = "imlMobileMusicNav";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .mobile-music-nav{display:none}
      @media (max-width:760px){
        html{scroll-padding-top:118px}
        body.mobile-music-app{
          --mobile-shell:#050505;
          --mobile-panel:#121212;
          --mobile-soft:#1d1d1d;
          --mobile-line:rgba(255,255,255,.1);
          --mobile-red:#ff0033;
          --mobile-green:#1ed760;
          background:
            radial-gradient(circle at 16% -8%,rgba(255,0,51,.26),transparent 18rem),
            radial-gradient(circle at 90% 8%,rgba(30,215,96,.16),transparent 18rem),
            linear-gradient(180deg,#111 0%,#050505 42%,#000 100%);
          padding-bottom:calc(156px + env(safe-area-inset-bottom));
        }
        body.mobile-music-app::before{
          background:
            radial-gradient(circle at 50% 12%,rgba(255,255,255,.08),transparent 18rem),
            radial-gradient(circle at 18% 38%,rgba(255,0,51,.18),transparent 16rem),
            radial-gradient(circle at 88% 62%,rgba(30,215,96,.1),transparent 18rem),
            url("./logo.svg") center 118px/min(52vw,230px) no-repeat;
          opacity:.42;
        }
        body.mobile-music-app canvas#bg{opacity:.34}
        body.mobile-music-app .site-header{
          position:sticky;
          top:0;
          z-index:32;
          padding:calc(8px + env(safe-area-inset-top)) 12px 8px;
          background:linear-gradient(180deg,rgba(0,0,0,.92),rgba(0,0,0,.72));
          backdrop-filter:blur(18px);
        }
        body.mobile-music-app .site-header::before{
          inset:6px 8px;
          border-radius:22px;
          border-color:rgba(255,255,255,.08);
          background:rgba(18,18,18,.86);
          box-shadow:0 12px 28px rgba(0,0,0,.36);
        }
        body.mobile-music-app .brand-chip{
          min-height:42px;
          border-radius:999px;
          padding:8px 12px;
          background:rgba(255,255,255,.06);
          border-color:rgba(255,255,255,.1);
          box-shadow:none;
        }
        body.mobile-music-app .brand-dot{
          background:var(--mobile-red);
          box-shadow:0 0 0 5px rgba(255,0,51,.13),0 0 18px rgba(255,0,51,.8);
        }
        body.mobile-music-app .brand-text{
          font-size:1rem;
          letter-spacing:0;
        }
        body.mobile-music-app .social-links{gap:8px}
        body.mobile-music-app .social-button{
          width:42px;
          min-width:42px;
          height:42px;
          min-height:42px;
          padding:0;
          border-radius:50%;
          border-color:rgba(255,255,255,.1);
          background:rgba(255,255,255,.08);
          box-shadow:none;
        }
        body.mobile-music-app .youtube-link{background:linear-gradient(135deg,#ff0033,#ff5c7a)}
        body.mobile-music-app .tiktok-link{background:linear-gradient(135deg,#101010,#303030)}
        body.mobile-music-app .social-button span:last-child{display:none}
        body.mobile-music-app .social-icon{
          width:24px;
          height:24px;
          background:transparent;
          box-shadow:none;
        }
        body.mobile-music-app .music-top-tabs{
          top:64px;
          z-index:28;
          padding:8px 12px 12px;
          background:linear-gradient(180deg,rgba(0,0,0,.76),rgba(0,0,0,0));
        }
        body.mobile-music-app .music-top-tabs a{
          min-height:34px;
          padding:8px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.08);
          color:#fff;
          border-color:rgba(255,255,255,.08);
          font-size:.88rem;
          box-shadow:none;
        }
        body.mobile-music-app .music-top-tabs a.active{
          background:#fff;
          color:#050505;
        }
        body.mobile-music-app main{
          width:100%;
          overflow:hidden;
        }
        body.mobile-music-app #hero{
          display:block;
          padding:18px 14px 10px;
          text-align:left;
        }
        body.mobile-music-app #hero .logo-wrap{
          width:min(58vw,220px);
          height:min(58vw,220px);
          margin:6px auto 18px;
          border-radius:30px;
          overflow:hidden;
          background:
            radial-gradient(circle at 50% 36%,rgba(255,255,255,.14),transparent 42%),
            linear-gradient(145deg,#202020,#050505);
          box-shadow:0 24px 60px rgba(0,0,0,.46),0 0 44px rgba(255,0,51,.18);
        }
        body.mobile-music-app #hero .logo-wrap img{
          padding:18px;
        }
        body.mobile-music-app #hero>p{
          max-width:330px;
          margin:0 auto 14px;
          color:#d8d8d8;
          text-align:center;
          font-weight:800;
        }
        body.mobile-music-app .hub-panel,
        body.mobile-music-app .library-shell,
        body.mobile-music-app .action-card{
          border-radius:24px;
          border-color:var(--mobile-line);
          background:linear-gradient(180deg,rgba(29,29,29,.94),rgba(12,12,12,.94));
          box-shadow:0 20px 52px rgba(0,0,0,.34);
        }
        body.mobile-music-app .hub-panel{
          margin:0;
          padding:16px;
        }
        body.mobile-music-app .hub-panel h2,
        body.mobile-music-app .library-shell h2{
          font-size:1.35rem;
          line-height:1.12;
          margin-bottom:6px;
        }
        body.mobile-music-app .hub-panel p,
        body.mobile-music-app .section-note{
          color:#bdbdbd;
          font-size:.92rem;
        }
        body.mobile-music-app .mood-controls{
          display:flex;
          flex-wrap:nowrap;
          justify-content:flex-start;
          gap:8px;
          margin:14px -4px 0;
          padding:0 4px 2px;
          overflow-x:auto;
          scrollbar-width:none;
        }
        body.mobile-music-app .mood-controls::-webkit-scrollbar{display:none}
        body.mobile-music-app .mood-controls button{
          flex:0 0 auto;
          min-height:38px;
          padding:8px 14px;
          border-radius:999px;
          background:rgba(255,255,255,.08);
          border-color:rgba(255,255,255,.1);
          box-shadow:none;
          white-space:nowrap;
        }
        body.mobile-music-app .mood-controls button.active{
          background:linear-gradient(135deg,var(--mobile-red),#8f00ff);
          box-shadow:0 8px 22px rgba(255,0,51,.26);
        }
        body.mobile-music-app .now-strip{
          border:0;
          border-radius:16px;
          background:rgba(255,255,255,.06);
        }
        body.mobile-music-app section{
          padding:18px 12px;
        }
        body.mobile-music-app .action-grid{
          display:flex;
          max-width:none;
          margin:0 -12px;
          padding:0 12px 4px;
          gap:12px;
          overflow-x:auto;
          scroll-snap-type:x mandatory;
          scrollbar-width:none;
        }
        body.mobile-music-app .action-grid::-webkit-scrollbar{display:none}
        body.mobile-music-app .action-card{
          flex:0 0 min(78vw,310px);
          min-height:154px;
          scroll-snap-align:start;
          padding:16px;
        }
        body.mobile-music-app .action-card p{
          min-height:54px;
          color:#c9c9c9;
        }
        body.mobile-music-app .action-card .button,
        body.mobile-music-app .action-card button{
          min-height:42px;
          border-radius:999px;
          background:#fff;
          color:#050505;
        }
        body.mobile-music-app .library-shell{
          width:auto;
          max-width:none;
          margin:0;
          padding:16px;
        }
        body.mobile-music-app #videoLibrary .library-shell{
          background:linear-gradient(180deg,rgba(32,16,20,.96),rgba(10,10,10,.95));
        }
        body.mobile-music-app #audioLibrary .library-shell{
          background:linear-gradient(180deg,rgba(18,18,18,.96),rgba(4,4,4,.96));
        }
        body.mobile-music-app iframe{
          height:min(56vw,260px);
          border-radius:18px;
          box-shadow:0 18px 42px rgba(0,0,0,.44);
        }
        body.mobile-music-app .latest-video-card{
          display:block;
          border-radius:22px;
          padding:10px;
          background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));
          border-color:rgba(255,255,255,.1);
        }
        body.mobile-music-app .latest-video-art{
          min-height:clamp(178px,54vw,240px);
          border-radius:18px;
        }
        body.mobile-music-app .latest-video-copy{
          padding:12px 2px 2px;
        }
        body.mobile-music-app .playlist-grid{
          display:flex;
          flex-direction:column;
          gap:4px;
          margin-top:12px;
        }
        body.mobile-music-app .playlist-card{
          grid-template-columns:58px minmax(0,1fr);
          min-height:66px;
          padding:7px 8px;
          border:0;
          border-radius:13px;
          background:transparent;
          box-shadow:none;
        }
        body.mobile-music-app #videoLibrary .playlist-card{
          grid-template-columns:82px minmax(0,1fr);
        }
        body.mobile-music-app .playlist-card::before{display:none}
        body.mobile-music-app .playlist-card:hover,
        body.mobile-music-app .playlist-card:focus-visible,
        body.mobile-music-app .playlist-card.active,
        body.mobile-music-app .playlist-card.is-pressed{
          transform:none;
          background:rgba(255,255,255,.09);
          box-shadow:none;
        }
        body.mobile-music-app .playlist-thumb{
          width:54px;
          border-radius:12px;
          border:0;
          box-shadow:none;
        }
        body.mobile-music-app #videoLibrary .playlist-thumb{
          width:82px;
          border-radius:10px;
        }
        body.mobile-music-app .audio-thumb{
          border-radius:12px;
          background:
            radial-gradient(circle at 50% 50%,rgba(255,255,255,.12),transparent 34%),
            linear-gradient(135deg,#252525,#090909);
        }
        body.mobile-music-app .audio-thumb::after{
          width:28px;
          height:28px;
          box-shadow:0 0 18px rgba(255,0,51,.3);
        }
        body.mobile-music-app .playlist-copy{
          gap:3px;
          min-width:0;
        }
        body.mobile-music-app .playlist-copy strong{
          font-size:.95rem;
          line-height:1.15;
          overflow:hidden;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        }
        body.mobile-music-app .playlist-copy small{
          color:#aaa;
          font-size:.78rem;
        }
        body.mobile-music-app .feature-toolbar{
          position:sticky;
          top:108px;
          z-index:18;
          grid-template-columns:1fr auto;
          margin:12px -4px 10px;
          padding:8px;
          border-radius:18px;
          background:rgba(18,18,18,.92);
          backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,.08);
        }
        body.mobile-music-app .feature-search{
          grid-column:1 / -1;
          min-height:40px;
          border-radius:13px;
          background:rgba(255,255,255,.08);
        }
        body.mobile-music-app .feature-button{
          min-height:38px;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(255,255,255,.12);
          color:#fff;
        }
        body.mobile-music-app .iml-audio-deck{
          position:fixed;
          left:10px;
          right:10px;
          bottom:calc(74px + env(safe-area-inset-bottom));
          z-index:34;
          grid-template-columns:46px minmax(0,1fr) 38px;
          gap:10px;
          margin:0;
          padding:10px;
          border-radius:18px;
          background:rgba(18,18,18,.96);
          border-color:rgba(255,255,255,.14);
          box-shadow:0 18px 54px rgba(0,0,0,.48),0 0 0 1px rgba(255,255,255,.03);
          backdrop-filter:blur(20px);
        }
        body.mobile-music-app .iml-audio-deck::before{
          background:linear-gradient(90deg,var(--mobile-red),#ff6a86 26%,rgba(255,255,255,.1) 26%);
          height:3px;
          inset:0 12px auto;
          border-radius:999px;
          opacity:.9;
        }
        body.mobile-music-app .iml-audio-play{
          width:46px;
          height:46px;
          background:#fff;
          color:#050505;
          box-shadow:none;
        }
        body.mobile-music-app .iml-audio-mute{
          grid-column:auto;
          width:38px;
          height:38px;
          border-radius:50%;
          font-size:0;
        }
        body.mobile-music-app .iml-audio-mute::before{
          content:"";
          width:16px;
          height:16px;
          background:linear-gradient(90deg,#fff 0 30%,transparent 30%);
          clip-path:polygon(0 32%,36% 32%,76% 8%,76% 92%,36% 68%,0 68%);
        }
        body.mobile-music-app .iml-audio-title{
          display:block;
        }
        body.mobile-music-app .iml-audio-title span:first-child{
          display:block;
          font-size:.92rem;
        }
        body.mobile-music-app .iml-audio-title span:last-child{
          display:block;
          margin-top:2px;
          color:#aaa;
          font-size:.74rem;
        }
        body.mobile-music-app .iml-audio-seek{
          height:4px;
          accent-color:var(--mobile-red);
        }
        body.mobile-music-app .iml-audio-times{
          font-size:.7rem;
          color:#aaa;
        }
        body.mobile-music-app #audioStatus{
          color:#a8a8a8;
          font-size:.86rem;
        }
        body.mobile-music-app .promo-mobile-strip{
          margin:12px 12px 0;
          border-radius:24px;
          background:linear-gradient(180deg,rgba(29,29,29,.94),rgba(10,10,10,.95));
          border-color:rgba(255,255,255,.1);
        }
        body.mobile-music-app .promo-mobile-grid{
          grid-template-columns:repeat(4,minmax(250px,76vw));
        }
        body.mobile-music-app .promo-mobile-grid .promo-ad-card{
          min-height:330px;
          border-radius:22px;
        }
        .mobile-music-nav{
          position:fixed;
          left:0;
          right:0;
          bottom:0;
          z-index:36;
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:2px;
          padding:8px max(8px,env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-right));
          border-top:1px solid rgba(255,255,255,.1);
          background:rgba(0,0,0,.9);
          backdrop-filter:blur(22px);
          box-shadow:0 -18px 42px rgba(0,0,0,.38);
        }
        .mobile-music-nav a{
          min-width:0;
          min-height:50px;
          display:grid;
          place-items:center;
          align-content:center;
          gap:4px;
          color:#aaa;
          text-decoration:none;
          font-size:.72rem;
          font-weight:850;
          border-radius:44px;
          -webkit-tap-highlight-color:transparent;
        }
        .mobile-music-nav a.active{
          color:#fff;
          background:rgba(255,255,255,.08);
        }
        .mobile-nav-icon{
          position:relative;
          width:22px;
          height:22px;
          display:block;
        }
        .mobile-nav-icon::before,
        .mobile-nav-icon::after{
          content:"";
          position:absolute;
          inset:4px;
          border:2px solid currentColor;
          border-radius:6px;
        }
        .mobile-nav-icon.songs::before{
          width:12px;
          height:16px;
          inset:2px 5px auto auto;
          border-left:0;
          border-bottom:0;
          border-radius:0 4px 0 0;
        }
        .mobile-nav-icon.songs::after{
          inset:auto 3px 2px 2px;
          width:8px;
          height:8px;
          border-radius:50%;
          border:2px solid currentColor;
        }
        .mobile-nav-icon.videos::before{
          inset:4px 2px;
          border-radius:5px;
        }
        .mobile-nav-icon.videos::after{
          inset:7px 0 auto 9px;
          width:0;
          height:0;
          border-top:5px solid transparent;
          border-bottom:5px solid transparent;
          border-left:8px solid currentColor;
          border-right:0;
          border-radius:0;
        }
        .mobile-nav-icon.clips::before{
          inset:3px 5px;
          transform:rotate(-8deg);
          border-radius:6px;
        }
        .mobile-nav-icon.clips::after{
          width:7px;
          height:7px;
          left:10px;
          top:5px;
          right:auto;
          bottom:auto;
          border-radius:50%;
          background:currentColor;
          border:0;
        }
        .mobile-nav-icon.install::before{
          inset:3px 6px;
          border-radius:5px;
        }
        .mobile-nav-icon.install::after{
          inset:auto 9px 5px;
          width:4px;
          height:4px;
          border-radius:50%;
          background:currentColor;
          border:0;
        }
        body.mobile-music-app .scroll-top-button{
          bottom:calc(150px + env(safe-area-inset-bottom));
        }
      }
      @media (prefers-reduced-motion:reduce){
        body.mobile-music-app .action-grid{scroll-behavior:auto}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureNav() {
    if (document.getElementById(NAV_ID)) return;
    const nav = document.createElement("nav");
    nav.id = NAV_ID;
    nav.className = "mobile-music-nav";
    nav.setAttribute("aria-label", "Mobile music navigation");
    nav.innerHTML = `
      <a class="active" href="#hero" data-mobile-section="hero"><span class="mobile-nav-icon home" aria-hidden="true"></span><span>Home</span></a>
      <a href="#audioLibrary" data-mobile-section="audioLibrary"><span class="mobile-nav-icon songs" aria-hidden="true"></span><span>Songs</span></a>
      <a href="#videoLibrary" data-mobile-section="videoLibrary"><span class="mobile-nav-icon videos" aria-hidden="true"></span><span>Videos</span></a>
      <a href="#promoAdStrip" data-mobile-section="promoAdStrip"><span class="mobile-nav-icon clips" aria-hidden="true"></span><span>Clips</span></a>
      <a href="#installBox" data-mobile-section="installBox"><span class="mobile-nav-icon install" aria-hidden="true"></span><span>Install</span></a>
    `;
    document.body.appendChild(nav);
  }

  function wireNav() {
    const nav = document.getElementById(NAV_ID);
    if (!nav || nav.dataset.ready === "true") return;
    nav.dataset.ready = "true";
    const links = [...nav.querySelectorAll("a")];

    function setActive(id) {
      links.forEach(link => link.classList.toggle("active", link.dataset.mobileSection === id));
    }

    links.forEach(link => {
      link.addEventListener("click", () => setActive(link.dataset.mobileSection));
    });

    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const candidates = ["installBox", "audioLibrary", "videoLibrary", "promoAdStrip", "hero"]
          .map(id => document.getElementById(id))
          .filter(Boolean);
        const active = candidates.find(section => {
          const rect = section.getBoundingClientRect();
          return rect.top < innerHeight * 0.38 && rect.bottom > innerHeight * 0.22;
        });
        if (active) setActive(active.id);
      });
    }, { passive: true });
  }

  function wirePressEffects() {
    if (document.body.dataset.mobilePressReady === "true") return;
    document.body.dataset.mobilePressReady = "true";
    document.addEventListener("pointerdown", event => {
      const card = event.target.closest(".playlist-card,.action-card,.promo-ad-card");
      if (!card) return;
      card.classList.add("is-pressed");
      setTimeout(() => card.classList.remove("is-pressed"), 220);
    }, { passive: true });
  }

  function boot() {
    document.body.classList.add("mobile-music-app");
    ensureNav();
    wireNav();
    wirePressEffects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
