(() => {
  const STYLE_ID = "imlYouTubeMusicRedesignStyles";
  const TOPBAR_ID = "imlYtmTopbar";
  const RAIL_ID = "imlYtmRail";
  const PROFILE_ID = "imlYtmPlaylistProfile";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.ytm-redesign{
        --ytm-bg:#030303;
        --ytm-panel:#0f0f0f;
        --ytm-panel-2:#1f1f1f;
        --ytm-hover:#242424;
        --ytm-line:rgba(255,255,255,.1);
        --ytm-text:#fff;
        --ytm-muted:#aaa;
        --ytm-red:#ff0033;
        --ytm-warm:#5b3418;
        background:
          radial-gradient(ellipse at 34% -12%,rgba(110,61,24,.58),transparent 34rem),
          radial-gradient(ellipse at 88% -6%,rgba(255,0,51,.2),transparent 30rem),
          linear-gradient(180deg,#080504 0%,#030303 38%,#000 100%)!important;
        color:var(--ytm-text);
      }
      body.ytm-redesign::before{
        opacity:.08!important;
        filter:saturate(.75) blur(.2px);
      }
      body.ytm-redesign::after{
        opacity:.08!important;
      }
      body.ytm-redesign canvas#bg{
        opacity:.16;
      }
      .ytm-shell-topbar,
      .ytm-side-rail{
        display:none;
      }
      .sr-only{
        position:absolute;
        width:1px;
        height:1px;
        padding:0;
        margin:-1px;
        overflow:hidden;
        clip:rect(0,0,0,0);
        white-space:nowrap;
        border:0;
      }
      .ytm-shell-topbar{
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:80;
        height:64px;
        align-items:center;
        gap:20px;
        padding:0 26px 0 18px;
        background:linear-gradient(180deg,rgba(3,3,3,.97),rgba(3,3,3,.86));
        border-bottom:1px solid rgba(255,255,255,.06);
        backdrop-filter:blur(18px);
      }
      .ytm-menu-button{
        width:42px;
        height:42px;
        min-height:42px;
        padding:0;
        border-radius:50%;
        border:0;
        background:transparent;
        color:#fff;
      }
      .ytm-menu-button::before{
        content:"";
        width:18px;
        height:2px;
        border-radius:999px;
        background:currentColor;
        box-shadow:0 -6px 0 currentColor,0 6px 0 currentColor;
      }
      .ytm-brand{
        display:inline-flex;
        align-items:center;
        gap:8px;
        min-width:158px;
        color:#fff;
        text-decoration:none;
        font-weight:950;
        letter-spacing:0;
      }
      .ytm-brand-play{
        position:relative;
        width:28px;
        height:28px;
        border-radius:50%;
        background:var(--ytm-red);
        box-shadow:0 0 0 3px rgba(255,0,51,.14),0 0 20px rgba(255,0,51,.42);
      }
      .ytm-brand-play::before{
        content:"";
        position:absolute;
        left:11px;
        top:8px;
        width:0;
        height:0;
        border-top:6px solid transparent;
        border-bottom:6px solid transparent;
        border-left:9px solid #fff;
      }
      .ytm-brand span:last-child{
        font-size:1.08rem;
      }
      .ytm-search{
        position:relative;
        flex:0 1 560px;
      }
      .ytm-search::before{
        content:"";
        position:absolute;
        left:18px;
        top:50%;
        width:14px;
        height:14px;
        border:2px solid #b8b8b8;
        border-radius:50%;
        transform:translateY(-50%);
      }
      .ytm-search::after{
        content:"";
        position:absolute;
        left:31px;
        top:33px;
        width:7px;
        height:2px;
        border-radius:999px;
        background:#b8b8b8;
        transform:rotate(45deg);
      }
      .ytm-search input{
        width:100%;
        min-height:42px;
        padding:0 18px 0 52px;
        border:1px solid rgba(255,255,255,.24);
        border-radius:8px;
        background:rgba(255,255,255,.12);
        color:#fff;
        font:inherit;
        font-weight:750;
        outline:0;
      }
      .ytm-search input::placeholder{
        color:rgba(255,255,255,.54);
      }
      .ytm-search input:focus{
        border-color:rgba(255,255,255,.48);
        background:rgba(255,255,255,.16);
      }
      .ytm-top-actions{
        display:flex;
        align-items:center;
        gap:12px;
        margin-left:auto;
      }
      .ytm-icon-link{
        display:grid;
        place-items:center;
        width:38px;
        height:38px;
        border-radius:50%;
        color:#fff;
        text-decoration:none;
        border:1px solid rgba(255,255,255,.1);
        background:rgba(255,255,255,.06);
      }
      .ytm-cast::before{
        content:"";
        width:18px;
        height:14px;
        border:2px solid currentColor;
        border-radius:2px;
        clip-path:polygon(0 0,100% 0,100% 100%,54% 100%,54% 82%,0 82%);
      }
      .ytm-avatar{
        background:#111 url("./logo.svg") center/80% no-repeat;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);
      }
      .ytm-side-rail{
        position:fixed;
        top:64px;
        left:0;
        bottom:96px;
        z-index:72;
        width:72px;
        padding:8px 0;
        background:rgba(3,3,3,.9);
        border-right:1px solid rgba(255,255,255,.06);
      }
      .ytm-rail-link{
        display:grid;
        place-items:center;
        gap:5px;
        min-height:64px;
        margin:0 8px 6px;
        border-radius:8px;
        color:#c8c8c8;
        text-decoration:none;
        font-size:.68rem;
        font-weight:900;
      }
      .ytm-rail-link:hover,
      .ytm-rail-link.active{
        color:#fff;
        background:rgba(255,255,255,.1);
      }
      .ytm-rail-icon{
        position:relative;
        width:22px;
        height:22px;
      }
      .ytm-rail-icon.home::before{
        content:"";
        position:absolute;
        inset:6px 4px 3px;
        border:2px solid currentColor;
        border-top:0;
        border-radius:2px;
      }
      .ytm-rail-icon.home::after{
        content:"";
        position:absolute;
        left:4px;
        top:3px;
        width:14px;
        height:14px;
        border-left:2px solid currentColor;
        border-top:2px solid currentColor;
        transform:rotate(45deg);
      }
      .ytm-rail-icon.songs::before{
        content:"";
        position:absolute;
        inset:2px 7px 7px 7px;
        border-right:2px solid currentColor;
        border-top:2px solid currentColor;
      }
      .ytm-rail-icon.songs::after{
        content:"";
        position:absolute;
        left:4px;
        bottom:3px;
        width:9px;
        height:9px;
        border:2px solid currentColor;
        border-radius:50%;
      }
      .ytm-rail-icon.videos::before{
        content:"";
        position:absolute;
        inset:4px 2px;
        border:2px solid currentColor;
        border-radius:4px;
      }
      .ytm-rail-icon.videos::after{
        content:"";
        position:absolute;
        left:9px;
        top:7px;
        width:0;
        height:0;
        border-top:5px solid transparent;
        border-bottom:5px solid transparent;
        border-left:8px solid currentColor;
      }
      .ytm-rail-icon.install::before{
        content:"";
        position:absolute;
        inset:3px 6px;
        border:2px solid currentColor;
        border-radius:4px;
      }
      .ytm-rail-icon.install::after{
        content:"";
        position:absolute;
        left:9px;
        bottom:6px;
        width:4px;
        height:4px;
        border-radius:50%;
        background:currentColor;
      }
      .ytm-playlist-profile{
        display:none;
      }
      @media (min-width:900px){
        body.ytm-redesign{
          padding-bottom:106px;
        }
        body.ytm-redesign .ytm-shell-topbar{
          display:flex;
        }
        body.ytm-redesign .ytm-side-rail{
          display:block;
        }
        body.ytm-redesign .site-header,
        body.ytm-redesign .music-top-tabs{
          display:none!important;
        }
        body.ytm-redesign main{
          display:flex;
          flex-direction:column;
          max-width:none;
          margin:0;
          padding:72px 28px 0 72px;
        }
        body.ytm-redesign #hero{
          display:none;
        }
        body.ytm-redesign #audioLibrary{
          order:1;
          padding:34px 42px 26px;
        }
        body.ytm-redesign #videoLibrary{
          order:2;
          padding:18px 42px 28px;
        }
        body.ytm-redesign .ytm-action-section{
          order:3;
          padding:12px 42px 28px;
        }
        body.ytm-redesign #installBox{
          order:4;
          padding:10px 42px 150px;
        }
        body.ytm-redesign .hub-panel,
        body.ytm-redesign .library-shell,
        body.ytm-redesign .action-card{
          border:0;
          box-shadow:none;
          background:transparent;
          backdrop-filter:none;
        }
        body.ytm-redesign #audioLibrary .library-shell{
          display:grid;
          grid-template-columns:minmax(250px,350px) minmax(0,1fr);
          align-items:start;
          gap:44px;
          max-width:1360px;
          margin:0 auto;
          padding:0;
        }
        body.ytm-redesign #audioLibrary .library-shell>h2,
        body.ytm-redesign #audioStatus{
          display:none;
        }
        body.ytm-redesign .ytm-playlist-profile{
          position:sticky;
          top:92px;
          grid-column:1;
          grid-row:1 / span 5;
          display:grid;
          justify-items:center;
          gap:14px;
          text-align:center;
          min-width:0;
        }
        body.ytm-redesign .ytm-cover{
          position:relative;
          width:min(100%,318px);
          aspect-ratio:1.62/1;
          border-radius:10px;
          overflow:hidden;
          background:
            linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.34)),
            url("https://i.ytimg.com/vi/ljvJ4dupAaY/maxresdefault.jpg") center/cover,
            #141414 url("./logo.svg") center/58% no-repeat;
          box-shadow:0 28px 80px rgba(0,0,0,.55);
        }
        body.ytm-redesign .ytm-cover::after{
          content:"";
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 72% 28%,rgba(255,255,255,.2),transparent 28%),linear-gradient(180deg,transparent 35%,rgba(0,0,0,.45));
        }
        body.ytm-redesign .ytm-profile-title{
          margin:8px 0 0;
          font-size:clamp(2rem,3.3vw,3.6rem);
          line-height:.96;
          letter-spacing:0;
        }
        body.ytm-redesign .ytm-profile-sub,
        body.ytm-redesign .ytm-profile-meta,
        body.ytm-redesign .ytm-profile-note{
          margin:0;
          color:var(--ytm-muted);
          font-weight:850;
          line-height:1.35;
        }
        body.ytm-redesign .ytm-profile-sub{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          color:#ddd;
        }
        body.ytm-redesign .ytm-mini-logo{
          width:24px;
          height:24px;
          border-radius:50%;
          background:#111 url("./logo.svg") center/90% no-repeat;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);
        }
        body.ytm-redesign .ytm-profile-actions{
          display:flex;
          justify-content:center;
          flex-wrap:wrap;
          gap:12px;
          margin-top:6px;
        }
        body.ytm-redesign .ytm-profile-button{
          display:inline-grid;
          place-items:center;
          min-width:44px;
          min-height:44px;
          border:0;
          border-radius:999px;
          padding:0 18px;
          background:rgba(255,255,255,.12);
          color:#fff;
          text-decoration:none;
          font:inherit;
          font-weight:950;
          cursor:pointer;
        }
        body.ytm-redesign .ytm-profile-button.primary{
          width:64px;
          height:64px;
          min-height:64px;
          padding:0;
          background:#fff;
          color:#000;
        }
        body.ytm-redesign .ytm-profile-button.primary::before{
          content:"";
          width:0;
          height:0;
          border-top:12px solid transparent;
          border-bottom:12px solid transparent;
          border-left:18px solid currentColor;
          margin-left:5px;
        }
        body.ytm-redesign .ytm-profile-button:hover,
        body.ytm-redesign .ytm-profile-button:focus-visible{
          background:#fff;
          color:#000;
          outline:0;
        }
        body.ytm-redesign #audioLibrary .playlist-control-row,
        body.ytm-redesign #audioLibrary .feature-toolbar,
        body.ytm-redesign #audioLibrary .playlist-grid{
          grid-column:2;
        }
        body.ytm-redesign #audioLibrary .playlist-control-row{
          grid-row:1;
          margin:2px 0 14px;
          justify-content:flex-end;
        }
        body.ytm-redesign #audioLibrary .playlist-toggle{
          min-height:38px;
          padding:7px 14px 7px 9px;
          background:rgba(255,255,255,.1);
          box-shadow:none;
          border-color:rgba(255,255,255,.12);
        }
        body.ytm-redesign #audioLibrary .playlist-toggle:hover{
          background:rgba(255,255,255,.18);
        }
        body.ytm-redesign #audioLibrary .feature-toolbar{
          grid-row:2;
          grid-template-columns:minmax(0,1fr) auto auto;
          margin:0 0 12px;
          padding:0;
          background:transparent;
        }
        body.ytm-redesign .feature-search{
          min-height:38px;
          border-radius:8px;
          background:rgba(255,255,255,.08);
          border-color:rgba(255,255,255,.12);
          font-weight:800;
        }
        body.ytm-redesign .feature-button{
          min-height:38px;
          border-radius:999px;
          background:#fff;
          color:#000;
        }
        body.ytm-redesign #audioLibrary .playlist-grid{
          grid-row:3;
          display:flex;
          flex-direction:column;
          gap:2px;
          counter-reset:audioTrack;
          margin:0;
        }
        body.ytm-redesign #audioLibrary .playlist-grid[hidden]{
          display:none!important;
        }
        body.ytm-redesign #audioLibrary .playlist-card.audio-track{
          counter-increment:audioTrack;
          display:grid;
          grid-template-columns:38px 52px minmax(0,1fr) 58px;
          align-items:center;
          gap:14px;
          min-height:66px;
          padding:8px 12px;
          border:0;
          border-radius:8px;
          background:transparent;
          box-shadow:none;
          color:#fff;
          text-align:left;
        }
        body.ytm-redesign #audioLibrary .playlist-card.audio-track::before{
          content:counter(audioTrack);
          grid-column:1;
          color:#aaa;
          font-size:.86rem;
          font-weight:900;
          text-align:center;
        }
        body.ytm-redesign #audioLibrary .playlist-card.audio-track:hover,
        body.ytm-redesign #audioLibrary .playlist-card.audio-track:focus-visible,
        body.ytm-redesign #audioLibrary .playlist-card.audio-track.active{
          background:rgba(255,255,255,.1);
          transform:none;
          outline:0;
        }
        body.ytm-redesign #audioLibrary .playlist-card.audio-track.active{
          box-shadow:inset 3px 0 0 var(--ytm-red);
        }
        body.ytm-redesign #audioLibrary .playlist-card.audio-track::after{
          display:none;
        }
        body.ytm-redesign #audioLibrary .audio-thumb{
          grid-column:2;
          width:46px;
          height:46px;
          border-radius:6px;
          background:
            linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.2)),
            #5b1230 url("./logo.svg") center/82% no-repeat;
          border:1px solid rgba(255,255,255,.1);
          box-shadow:none;
        }
        body.ytm-redesign #audioLibrary .audio-thumb::after{
          display:none;
        }
        body.ytm-redesign #audioLibrary .playlist-copy{
          grid-column:3;
          min-width:0;
          gap:3px;
        }
        body.ytm-redesign #audioLibrary .playlist-copy strong{
          overflow:hidden;
          display:block;
          white-space:nowrap;
          text-overflow:ellipsis;
          font-size:1rem;
          line-height:1.25;
        }
        body.ytm-redesign #audioLibrary .playlist-copy small{
          color:#aaa;
          font-size:.92rem;
        }
        body.ytm-redesign .ytm-row-action{
          grid-column:4;
          justify-self:end;
          color:#ffb8c8;
          font-size:.74rem;
          font-weight:950;
          letter-spacing:.04em;
        }
        body.ytm-redesign #audioLibrary .iml-audio-deck{
          position:fixed;
          left:72px;
          right:0;
          bottom:0;
          z-index:85;
          grid-template-columns:56px minmax(0,1fr) 44px;
          min-height:88px;
          margin:0;
          padding:12px 22px;
          border-radius:0;
          border:0;
          border-top:1px solid rgba(255,255,255,.14);
          background:#202020;
          box-shadow:0 -14px 44px rgba(0,0,0,.48);
        }
        body.ytm-redesign #audioLibrary .iml-audio-deck::before{
          left:86px;
          right:86px;
          top:14px;
          height:3px;
          background:linear-gradient(90deg,#fff 0 3%,rgba(255,255,255,.35) 3% 100%);
          opacity:.86;
        }
        body.ytm-redesign #audioLibrary .iml-audio-play{
          width:50px;
          height:50px;
          background:#fff;
          color:#000;
          box-shadow:none;
        }
        body.ytm-redesign #audioLibrary .iml-audio-title span:first-child{
          font-size:.98rem;
        }
        body.ytm-redesign #audioLibrary .iml-audio-title span:last-child{
          color:#bdbdbd;
        }
        body.ytm-redesign #audioLibrary .iml-audio-seek{
          accent-color:#fff;
        }
        body.ytm-redesign #audioLibrary .iml-audio-mute{
          background:transparent;
          border:0;
          color:#fff;
        }
        body.ytm-redesign #videoLibrary .library-shell{
          max-width:1360px;
          margin:0 auto;
          padding:24px 0 0;
        }
        body.ytm-redesign #videoLibrary .library-shell>h2{
          font-size:1.6rem;
          margin:0 0 6px;
        }
        body.ytm-redesign #videoLibrary .section-note{
          color:#aaa;
          margin-bottom:16px;
        }
        body.ytm-redesign #videoLibrary .latest-video-card{
          min-height:0;
          padding:12px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.05);
        }
        body.ytm-redesign #videoLibrary iframe{
          border-radius:12px;
          border:1px solid rgba(255,255,255,.08);
          box-shadow:0 22px 70px rgba(0,0,0,.42);
        }
        body.ytm-redesign #videoLibrary .playlist-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:8px;
        }
        body.ytm-redesign #videoLibrary .playlist-grid[hidden]{
          display:none!important;
        }
        body.ytm-redesign #videoLibrary .playlist-card{
          min-height:78px;
          grid-template-columns:92px minmax(0,1fr);
          gap:10px;
          padding:8px;
          border:0;
          border-radius:8px;
          background:transparent;
          box-shadow:none;
        }
        body.ytm-redesign #videoLibrary .playlist-card:hover,
        body.ytm-redesign #videoLibrary .playlist-card.active{
          background:rgba(255,255,255,.09);
          transform:none;
        }
        body.ytm-redesign #videoLibrary .playlist-thumb{
          width:92px;
          border-radius:6px;
        }
        body.ytm-redesign .action-grid{
          max-width:1360px;
          grid-template-columns:repeat(3,minmax(0,1fr));
        }
        body.ytm-redesign .action-card{
          border-radius:12px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.05);
        }
        body.ytm-redesign .action-card .button,
        body.ytm-redesign .action-card button,
        body.ytm-redesign #installButton{
          background:#fff;
          color:#000;
        }
        body.ytm-redesign .promo-rail{
          opacity:.58;
          top:84px;
          bottom:112px;
        }
      }
      @media (min-width:1280px){
        body.ytm-redesign.has-promo-ads main>section>h2,
        body.ytm-redesign.has-promo-ads main>section>p,
        body.ytm-redesign.has-promo-ads .hub-panel,
        body.ytm-redesign.has-promo-ads .library-shell,
        body.ytm-redesign.has-promo-ads .action-grid,
        body.ytm-redesign.has-promo-ads .now-strip{
          max-width:1360px;
        }
      }
      @media (max-width:899px){
        body.ytm-redesign{
          background:
            radial-gradient(circle at 24% -8%,rgba(255,0,51,.26),transparent 18rem),
            radial-gradient(circle at 88% 4%,rgba(110,61,24,.38),transparent 20rem),
            linear-gradient(180deg,#0a0a0a 0%,#030303 48%,#000 100%)!important;
        }
        body.ytm-redesign .ytm-shell-topbar,
        body.ytm-redesign .ytm-side-rail{
          display:none;
        }
        body.ytm-redesign .playlist-copy small{
          color:#aaa;
        }
        body.ytm-redesign .audio-thumb{
          background:#5b1230 url("./logo.svg") center/82% no-repeat!important;
        }
        body.ytm-redesign .audio-thumb::after{
          display:none;
        }
        body.ytm-redesign .ytm-row-action{
          display:none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createShell() {
    if (!document.getElementById(TOPBAR_ID)) {
      const topbar = document.createElement("header");
      topbar.id = TOPBAR_ID;
      topbar.className = "ytm-shell-topbar";
      topbar.innerHTML = `
        <button type="button" class="ytm-menu-button" aria-label="Menu"></button>
        <a class="ytm-brand" href="#audioLibrary" aria-label="I.M.L. Music home">
          <span class="ytm-brand-play" aria-hidden="true"></span>
          <span>I.M.L. Music</span>
        </a>
        <label class="ytm-search">
          <span class="sr-only">Search I.M.L. music</span>
          <input id="ytmGlobalSearch" type="search" placeholder="Search songs, videos, I.M.L." autocomplete="off">
        </label>
        <div class="ytm-top-actions">
          <a class="ytm-icon-link ytm-cast" href="https://youtube.com/@i.m.l._official" target="_blank" rel="noopener" aria-label="Open I.M.L. YouTube"></a>
          <a class="ytm-icon-link ytm-avatar" href="#audioLibrary" aria-label="I.M.L. profile"></a>
        </div>
      `;
      document.body.prepend(topbar);
    }

    if (!document.getElementById(RAIL_ID)) {
      const rail = document.createElement("nav");
      rail.id = RAIL_ID;
      rail.className = "ytm-side-rail";
      rail.setAttribute("aria-label", "YouTube Music style navigation");
      rail.innerHTML = `
        <a class="ytm-rail-link active" href="#audioLibrary" data-ytm-section="audioLibrary"><span class="ytm-rail-icon home" aria-hidden="true"></span><span>Home</span></a>
        <a class="ytm-rail-link" href="#audioLibrary" data-ytm-section="audioLibrary"><span class="ytm-rail-icon songs" aria-hidden="true"></span><span>Songs</span></a>
        <a class="ytm-rail-link" href="#videoLibrary" data-ytm-section="videoLibrary"><span class="ytm-rail-icon videos" aria-hidden="true"></span><span>Videos</span></a>
        <a class="ytm-rail-link" href="#installBox" data-ytm-section="installBox"><span class="ytm-rail-icon install" aria-hidden="true"></span><span>Install</span></a>
      `;
      document.body.appendChild(rail);
    }
  }

  function setRailActive(target) {
    document.querySelectorAll(".ytm-rail-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === target || link.dataset.ytmSection === target.replace("#", ""));
    });
  }

  function wireSearch() {
    const search = document.getElementById("ytmGlobalSearch");
    if (!search || search.dataset.ready === "true") return;
    search.dataset.ready = "true";
    search.addEventListener("input", () => {
      const query = search.value;
      document.querySelectorAll(".feature-search").forEach(input => {
        if (input.value === query) return;
        input.value = query;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      if (query.trim()) document.getElementById("audioLibrary")?.scrollIntoView({ block: "start" });
    });
  }

  function ensurePlaylistProfile() {
    const shell = document.querySelector("#audioLibrary .library-shell");
    const grid = document.getElementById("audioTrackGrid");
    if (!shell || !grid) return false;
    if (!document.getElementById(PROFILE_ID)) {
      const count = grid.querySelectorAll(".audio-track").length || 32;
      const profile = document.createElement("aside");
      profile.id = PROFILE_ID;
      profile.className = "ytm-playlist-profile";
      profile.innerHTML = `
        <div class="ytm-cover" aria-hidden="true"></div>
        <h1 class="ytm-profile-title">I.M.L.</h1>
        <p class="ytm-profile-sub"><span class="ytm-mini-logo" aria-hidden="true"></span><span>I.M.L.</span></p>
        <p class="ytm-profile-meta">Playlist | Public | 2026</p>
        <p class="ytm-profile-note">${count} songs | videos | official hub</p>
        <div class="ytm-profile-actions">
          <button type="button" class="ytm-profile-button primary" id="ytmProfilePlay" aria-label="Play first song"></button>
          <button type="button" class="ytm-profile-button" id="ytmProfileShuffle">Shuffle</button>
          <button type="button" class="ytm-profile-button" id="ytmProfileShare">Share</button>
          <a class="ytm-profile-button" href="https://youtube.com/@i.m.l._official" target="_blank" rel="noopener">YouTube</a>
        </div>
      `;
      shell.insertBefore(profile, shell.firstChild);
    }

    document.querySelectorAll("#audioLibrary .audio-track").forEach(track => {
      const small = track.querySelector(".playlist-copy small");
      if (small) small.textContent = "I.M.L.";
      if (!track.querySelector(".ytm-row-action")) {
        const action = document.createElement("span");
        action.className = "ytm-row-action";
        action.textContent = "PLAY";
        track.appendChild(action);
      }
    });

    document.querySelectorAll("#videoLibrary .playlist-card .playlist-copy small").forEach(small => {
      if (small.textContent.trim() === "Music video") small.textContent = "I.M.L. visual";
    });

    const play = document.getElementById("ytmProfilePlay");
    if (play && play.dataset.ready !== "true") {
      play.dataset.ready = "true";
      play.addEventListener("click", () => {
        document.querySelector("#audioLibrary .audio-track")?.click();
      });
    }

    const shuffle = document.getElementById("ytmProfileShuffle");
    if (shuffle && shuffle.dataset.ready !== "true") {
      shuffle.dataset.ready = "true";
      shuffle.addEventListener("click", () => {
        document.querySelector("#audioLibrary [data-feature-random]")?.click();
      });
    }

    const share = document.getElementById("ytmProfileShare");
    if (share && share.dataset.ready !== "true") {
      share.dataset.ready = "true";
      share.addEventListener("click", async () => {
        const url = `${location.origin}${location.pathname}#audioLibrary`;
        if (navigator.share) {
          await navigator.share({ title: "I.M.L. Music", url }).catch(() => {});
        } else {
          await navigator.clipboard?.writeText(url).catch(() => {});
          const original = share.textContent;
          share.textContent = "Copied";
          setTimeout(() => { share.textContent = original; }, 1400);
        }
      });
    }

    return true;
  }

  function decorateSections() {
    document.querySelector(".action-grid")?.closest("section")?.classList.add("ytm-action-section");
  }

  function boot() {
    ensureStyles();
    document.body.classList.add("ytm-redesign");
    setTimeout(() => {
      const style = document.getElementById(STYLE_ID);
      if (style) document.head.appendChild(style);
    }, 1200);
    createShell();
    decorateSections();
    wireSearch();

    document.querySelectorAll(".ytm-rail-link").forEach(link => {
      link.addEventListener("click", () => setRailActive(link.getAttribute("href")));
    });

    if (ensurePlaylistProfile()) return;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        decorateSections();
        wireSearch();
        if (ensurePlaylistProfile()) observer.disconnect();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
