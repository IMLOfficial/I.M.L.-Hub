(() => {
  const STYLE_ID = "imlStableSafetyStyles";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html,body{overflow-x:hidden}
      body.iml-stable-mode .ytm-shell-topbar,
      body.iml-stable-mode .ytm-side-rail,
      body.iml-stable-mode .ytm-playlist-profile,
      body.iml-stable-mode #imlYtmTopbar,
      body.iml-stable-mode #imlYtmRail,
      body.iml-stable-mode #imlYtmPlaylistProfile,
      body.iml-stable-mode .mobile-music-nav,
      body.iml-stable-mode .music-mini-player,
      body.iml-stable-mode .music-top-tabs{display:none!important}
      body.iml-stable-mode main{width:min(100%,1120px);margin:0 auto}
      body.iml-stable-mode .library-shell{max-width:100%}
      @media (max-width:760px){
        body.iml-stable-mode .site-header{position:sticky;top:0;z-index:20}
        body.iml-stable-mode .social-button{min-height:38px;padding:8px 11px;font-size:.78rem}
        body.iml-stable-mode .brand-chip{min-height:38px;padding:8px 10px}
        body.iml-stable-mode .playlist-grid{grid-template-columns:1fr}
        body.iml-stable-mode iframe{min-height:190px}
      }
    `;
    document.head.appendChild(style);
  }

  function cleanupOnce() {
    document.body.classList.add("iml-stable-mode");
    document.body.classList.remove("ytm-redesign", "mobile-ytm", "player-open", "mobile-music-app", "ytm-polish", "music-theme");
    document.querySelectorAll("#imlYtmTopbar,#imlYtmRail,#imlYtmPlaylistProfile,.ytm-shell-topbar,.ytm-side-rail,.ytm-playlist-profile,.mobile-music-nav,.music-mini-player,.music-top-tabs").forEach(node => node.remove());
  }

  function boot() {
    ensureStyles();
    cleanupOnce();
    setTimeout(cleanupOnce, 500);
    setTimeout(cleanupOnce, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
