(() => {
  const STYLE_ID = "imlMusicPolishStyles";
  const NAV_ID = "imlMusicTabs";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.ytm-polish{
        --ytm-bg:#030303;
        --ytm-elevated:#121212;
        --ytm-elevated-2:#1f1f1f;
        --ytm-line:rgba(255,255,255,.1);
        --ytm-red:#ff0033;
        --ytm-red-soft:#ff4d6d;
        --ytm-text:#fff;
        --ytm-muted:#a7a7a7;
        background:
          radial-gradient(circle at 50% -12%,rgba(255,0,51,.22),transparent 34rem),
          radial-gradient(circle at 12% 28%,rgba(77,184,255,.1),transparent 24rem),
          linear-gradient(180deg,#080808 0%,#030303 52%,#000 100%);
      }
      body.ytm-polish::before{
        opacity:.2;
        filter:saturate(.9);
      }
      body.ytm-polish::after{
        opacity:.18;
      }
      body.ytm-polish canvas#bg{
        opacity:.62;
      }
      body.ytm-polish .site-header{
        padding:calc(10px + env(safe-area-inset-top)) 16px 8px;
        background:linear-gradient(180deg,rgba(3,3,3,.92),rgba(3,3,3,.72),transparent);
      }
      body.ytm-polish .site-header::before{
        inset:6px 12px 4px;
        border-color:transparent;
        background:rgba(15,15,15,.88);
        box-shadow:0 10px 30px rgba(0,0,0,.42);
      }
      body.ytm-polish .brand-chip{
        min-height:40px;
        border-color:rgba(255,255,255,.08);
        background:rgba(255,255,255,.04);
        box-shadow:none;
      }
      body.ytm-polish .brand-dot{
        background:var(--ytm-red);
        box-shadow:0 0 0 5px rgba(255,0,51,.14),0 0 18px rgba(255,0,51,.82);
      }
      body.ytm-polish .social-links{
        gap:8px;
      }
      body.ytm-polish .social-button{
        min-height:38px;
        padding:8px 14px;
        border-color:rgba(255,255,255,.1);
        background:rgba(255,255,255,.08);
        box-shadow:none;
      }
      body.ytm-polish .youtube-link{
        background:linear-gradient(135deg,#ff0033,#ff4d6d);
      }
      body.ytm-polish .tiktok-link{
        background:linear-gradient(135deg,#141414,#2b2b2b);
      }
      .music-top-tabs{
        position:sticky;
        top:74px;
        z-index:5;
        display:flex;
        gap:10px;
        max-width:1180px;
        margin:0 auto;
        padding:8px 18px 14px;
        overflow-x:auto;
        scrollbar-width:none;
      }
      .music-top-tabs::-webkit-scrollbar{display:none}
      .music-top-tabs a{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:38px;
        padding:9px 16px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.09);
        background:rgba(255,255,255,.08);
        color:#fff;
        text-decoration:none;
        font-weight:900;
        white-space:nowrap;
        box-shadow:0 10px 26px rgba(0,0,0,.24);
      }
      .music-top-tabs a.active,
      .music-top-tabs a:hover,
      .music-top-tabs a:focus-visible{
        background:#fff;
        color:#050505;
      }
      body.ytm-polish main{
        max-width:1240px;
        margin:0 auto;
      }
      body.ytm-polish #hero{
        display:grid;
        grid-template-columns:minmax(160px,220px) minmax(0,1fr);
        align-items:center;
        gap:24px;
        max-width:1180px;
        margin:0 auto;
        padding:34px 20px 22px;
        text-align:left;
      }
      body.ytm-polish #hero .logo-wrap{
        width:min(28vw,210px);
        height:min(28vw,210px);
        margin:0;
      }
      body.ytm-polish #hero>p{
        grid-column:2;
        margin:0;
        color:var(--ytm-muted);
        font-weight:850;
      }
      body.ytm-polish #hero .hub-panel{
        grid-column:2;
        width:100%;
        margin:12px 0 0;
      }
      body.ytm-polish #hero .now-strip{
        grid-column:1 / -1;
      }
      body.ytm-polish .hub-panel,
      body.ytm-polish .library-shell,
      body.ytm-polish .action-card{
        border-radius:18px;
        border-color:rgba(255,255,255,.08);
        background:linear-gradient(180deg,rgba(31,31,31,.92),rgba(13,13,13,.92));
        box-shadow:0 22px 70px rgba(0,0,0,.34);
      }
      body.ytm-polish .hub-panel h2,
      body.ytm-polish .library-shell h2{
        font-size:clamp(1.55rem,3vw,2.35rem);
        letter-spacing:0;
      }
      body.ytm-polish .mood-controls button{
        background:rgba(255,255,255,.08);
        border-color:rgba(255,255,255,.1);
        box-shadow:none;
      }
      body.ytm-polish .mood-controls button.active{
        background:linear-gradient(135deg,#ff0033,#8f00ff);
      }
      body.ytm-polish .action-grid{
        max-width:1180px;
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
      body.ytm-polish .action-card{
        min-height:150px;
        transition:transform .18s ease,background .18s ease,border-color .18s ease;
      }
      body.ytm-polish .action-card:hover{
        transform:translateY(-3px);
        border-color:rgba(255,255,255,.18);
        background:linear-gradient(180deg,rgba(42,42,42,.95),rgba(17,17,17,.94));
      }
      body.ytm-polish .action-card .button,
      body.ytm-polish .action-card button{
        min-height:42px;
        background:#fff;
        color:#050505;
      }
      body.ytm-polish .library-shell{
        max-width:1180px;
        padding:24px;
      }
      body.ytm-polish #videoLibrary .library-shell,
      body.ytm-polish #audioLibrary .library-shell{
        background:linear-gradient(180deg,rgba(18,18,18,.95),rgba(8,8,8,.94));
      }
      body.ytm-polish .latest-video-card{
        grid-template-columns:minmax(260px,1.3fr) minmax(220px,.7fr);
        min-height:260px;
        padding:14px;
        border-radius:16px;
        background:linear-gradient(135deg,rgba(255,0,51,.2),rgba(31,31,31,.92));
      }
      body.ytm-polish .latest-video-art{
        min-height:250px;
        border-radius:14px;
      }
      body.ytm-polish iframe{
        border-radius:14px;
        border:1px solid rgba(255,255,255,.08);
        box-shadow:0 22px 70px rgba(0,0,0,.5);
      }
      body.ytm-polish #videoLibrary .playlist-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
        gap:10px;
      }
      body.ytm-polish #videoLibrary .playlist-card{
        min-height:86px;
        grid-template-columns:96px 1fr;
        border:0;
        border-radius:10px;
        background:transparent;
        box-shadow:none;
      }
      body.ytm-polish #videoLibrary .playlist-card:hover,
      body.ytm-polish #videoLibrary .playlist-card.active{
        background:rgba(255,255,255,.08);
        transform:none;
      }
      body.ytm-polish #videoLibrary .playlist-thumb{
        width:96px;
        border-radius:8px;
      }
      body.ytm-polish .music-player-hero{
        grid-template-columns:minmax(170px,260px) minmax(0,1fr);
        border-radius:22px;
        border:0;
        background:
          linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03)),
          radial-gradient(circle at 22% 24%,rgba(255,0,51,.46),transparent 22rem),
          linear-gradient(135deg,#2b0c14,#101010 58%,#050505);
      }
      body.ytm-polish .music-album-art{
        max-width:260px;
        border-radius:18px;
        box-shadow:0 26px 70px rgba(0,0,0,.54),0 0 48px rgba(255,0,51,.24);
      }
      body.ytm-polish .music-now-title{
        font-size:clamp(2rem,5vw,5.4rem);
      }
      body.ytm-polish #audioLibrary .playlist-card.audio-track{
        border-radius:10px;
      }
      body.ytm-polish #audioLibrary .playlist-card.audio-track:hover,
      body.ytm-polish #audioLibrary .playlist-card.audio-track.active{
        background:rgba(255,255,255,.1);
      }
      body.ytm-polish .music-mini-player{
        left:50%;
        right:auto;
        width:min(1120px,calc(100vw - 24px));
        transform:translateX(-50%);
        border-radius:14px;
        background:rgba(18,18,18,.94);
        border-color:rgba(255,255,255,.12);
      }
      body.ytm-polish .music-mini-player::before{
        content:"";
        position:absolute;
        left:12px;
        right:12px;
        top:0;
        height:3px;
        border-radius:999px;
        background:linear-gradient(90deg,#ff0033,#ff7b93 36%,rgba(255,255,255,.14) 36%);
      }
      body.ytm-polish .music-mini-link.primary{
        background:#fff;
        color:#050505;
      }
      @media (max-width:900px){
        body.ytm-polish #hero{
          grid-template-columns:1fr;
          text-align:center;
          padding-top:22px;
        }
        body.ytm-polish #hero .logo-wrap,
        body.ytm-polish #hero>p,
        body.ytm-polish #hero .hub-panel,
        body.ytm-polish #hero .now-strip{
          grid-column:1;
          margin-left:auto;
          margin-right:auto;
        }
        body.ytm-polish .action-grid{
          grid-template-columns:1fr;
        }
        body.ytm-polish .latest-video-card,
        body.ytm-polish .music-player-hero{
          grid-template-columns:1fr;
        }
      }
      @media (max-width:640px){
        body.ytm-polish canvas#bg{opacity:.44}
        .music-top-tabs{
          top:62px;
          padding:7px 12px 10px;
        }
        .music-top-tabs a{
          min-height:34px;
          padding:8px 13px;
          font-size:.9rem;
        }
        body.ytm-polish #hero{
          padding:18px 12px;
        }
        body.ytm-polish #hero .logo-wrap{
          width:min(52vw,170px);
          height:min(52vw,170px);
        }
        body.ytm-polish .library-shell{
          padding:16px;
        }
        body.ytm-polish .latest-video-art{
          min-height:190px;
        }
        body.ytm-polish #videoLibrary .playlist-grid{
          grid-template-columns:1fr;
        }
        body.ytm-polish .music-player-hero{
          padding:16px;
        }
        body.ytm-polish .music-mini-player{
          grid-template-columns:42px minmax(0,1fr) auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureTabs() {
    if (document.getElementById(NAV_ID)) return;
    const tabs = document.createElement("nav");
    tabs.id = NAV_ID;
    tabs.className = "music-top-tabs";
    tabs.setAttribute("aria-label", "I.M.L. music sections");
    tabs.innerHTML = `
      <a class="active" href="#hero">Listen Now</a>
      <a href="#audioLibrary">Songs</a>
      <a href="#videoLibrary">Videos</a>
      <a href="#installBox">Install</a>
    `;
    document.querySelector(".site-header")?.insertAdjacentElement("afterend", tabs);
  }

  function wireTabs() {
    const tabs = document.getElementById(NAV_ID);
    if (!tabs || tabs.dataset.ready === "true") return;
    tabs.dataset.ready = "true";
    const links = [...tabs.querySelectorAll("a")];
    const setActive = target => {
      links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === target));
    };
    links.forEach(link => {
      link.addEventListener("click", () => setActive(link.getAttribute("href")));
    });
  }

  function decorate() {
    document.body.classList.add("ytm-polish");
    ensureTabs();
    wireTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", decorate, { once: true });
  } else {
    decorate();
  }
})();
