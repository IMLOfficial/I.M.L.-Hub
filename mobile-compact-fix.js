(() => {
  const STYLE_ID = "imlStableSafetyStyles";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html,body{overflow-x:hidden}
      html{scrollbar-width:thin;scrollbar-color:rgba(255,23,76,.88) rgba(5,5,7,.9)}
      body,*{scrollbar-width:thin;scrollbar-color:rgba(77,184,255,.78) rgba(5,5,7,.74)}
      ::-webkit-scrollbar{width:13px;height:13px}
      ::-webkit-scrollbar-track{background:linear-gradient(180deg,#050507,#0b1020);border-left:1px solid rgba(255,255,255,.08);box-shadow:inset 0 0 18px rgba(77,184,255,.08)}
      ::-webkit-scrollbar-thumb{border:3px solid #050507;border-radius:999px;background:linear-gradient(180deg,#ff174c 0%,#a44dff 48%,#4db8ff 100%);box-shadow:0 0 14px rgba(255,23,76,.34),0 0 18px rgba(77,184,255,.2)}
      ::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#ff5f82 0%,#b971ff 46%,#77d6ff 100%);box-shadow:0 0 18px rgba(255,23,76,.5),0 0 22px rgba(77,184,255,.34)}
      ::-webkit-scrollbar-corner{background:#050507}
      ::-webkit-scrollbar-button{display:none;width:0;height:0}
      .audio-list::-webkit-scrollbar,.playlist-grid::-webkit-scrollbar{width:10px;height:10px}
      .audio-list::-webkit-scrollbar-track,.playlist-grid::-webkit-scrollbar-track{border-radius:999px;background:rgba(255,255,255,.06);border:0;box-shadow:inset 0 0 12px rgba(0,0,0,.45)}
      .audio-list::-webkit-scrollbar-thumb,.playlist-grid::-webkit-scrollbar-thumb{border:2px solid rgba(8,8,12,.95);border-radius:999px;background:linear-gradient(180deg,#ff174c,#4db8ff)}
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
