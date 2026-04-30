(() => {
  const STYLE_ID = "imlMobileCompactFixStyles";
  const MOBILE = "(max-width:899px), (pointer:coarse)";

  function isMobile() {
    return matchMedia(MOBILE).matches;
  }

  function removeDesktopMusicShell() {
    if (!isMobile()) return;
    document.body.classList.remove("ytm-redesign");
    document.querySelectorAll("#imlYtmTopbar,#imlYtmRail,#imlYtmPlaylistProfile").forEach(node => node.remove());
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @media (max-width:899px),(pointer:coarse){
        body.mobile-ytm{
          background:radial-gradient(circle at 12% 0,rgba(137,87,38,.32),transparent 12rem),radial-gradient(circle at 90% 0,rgba(170,0,45,.18),transparent 13rem),linear-gradient(180deg,#100d09 0%,#050505 34%,#000 100%)!important;
          padding-bottom:calc(136px + env(safe-area-inset-bottom))!important;
        }
        body.mobile-ytm .site-header,
        body.mobile-ytm #hero,
        body.mobile-ytm .action-grid,
        body.mobile-ytm .music-top-tabs,
        body.mobile-ytm .ytm-shell-topbar,
        body.mobile-ytm .ytm-side-rail,
        body.mobile-ytm .ytm-playlist-profile,
        body.mobile-ytm #imlYtmTopbar,
        body.mobile-ytm #imlYtmRail,
        body.mobile-ytm #imlYtmPlaylistProfile{
          display:none!important;
        }
        body.mobile-ytm main{
          display:block!important;
          max-width:100%!important;
          margin:0!important;
          padding:0!important;
        }
        .ytm-mobile-home{
          padding:calc(7px + env(safe-area-inset-top)) 10px 0!important;
        }
        .ytm-appbar{
          min-height:38px!important;
          gap:8px!important;
        }
        .ytm-brand{
          font-size:.98rem!important;
          gap:6px!important;
        }
        .ytm-playmark{
          width:22px!important;
          height:22px!important;
          box-shadow:none!important;
        }
        .ytm-playmark::after{
          left:9px!important;
          top:6px!important;
          border-top-width:5px!important;
          border-bottom-width:5px!important;
          border-left-width:7px!important;
        }
        .ytm-icon{
          width:32px!important;
          height:32px!important;
          min-height:32px!important;
        }
        .ytm-chips{
          gap:7px!important;
          padding:8px 0 10px!important;
        }
        .ytm-chip{
          min-height:30px!important;
          padding:6px 11px!important;
          border-radius:8px!important;
          font-size:.75rem!important;
        }
        .ytm-section-title{
          margin:0 0 7px!important;
        }
        .ytm-section-title small,
        .ytm-dots,
        .ytm-list-head,
        .ytm-list{
          display:none!important;
        }
        .ytm-section-title h2{
          font-size:1rem!important;
        }
        .ytm-speed{
          display:flex!important;
          gap:8px!important;
          overflow-x:auto!important;
          padding-bottom:4px!important;
          scrollbar-width:none;
        }
        .ytm-speed::-webkit-scrollbar{display:none}
        .ytm-speed-card{
          flex:0 0 118px!important;
          aspect-ratio:16/10!important;
          border-radius:8px!important;
          box-shadow:0 8px 22px rgba(0,0,0,.28)!important;
        }
        .ytm-speed-card:nth-child(n+7){display:none!important}
        .ytm-speed-card strong{
          font-size:.64rem!important;
          bottom:6px!important;
          left:7px!important;
          right:7px!important;
        }
        body.mobile-ytm #audioLibrary,
        body.mobile-ytm #videoLibrary{
          padding:10px 8px!important;
        }
        body.mobile-ytm #audioLibrary .library-shell,
        body.mobile-ytm #videoLibrary .library-shell{
          max-width:100%!important;
          padding:12px!important;
          border-radius:14px!important;
          background:#050505!important;
          box-shadow:none!important;
        }
        body.mobile-ytm .feature-toolbar{
          position:relative!important;
          top:0!important;
          margin:8px 0!important;
          padding:4px!important;
          border-radius:10px!important;
          background:rgba(255,255,255,.07)!important;
        }
        body.mobile-ytm .feature-search{
          min-height:34px!important;
        }
        body.mobile-ytm .feature-button{
          min-height:34px!important;
          padding:6px 10px!important;
          font-size:.74rem!important;
        }
        body.mobile-ytm .playlist-control-row{
          flex-direction:row!important;
          align-items:center!important;
          margin:8px 0!important;
        }
        body.mobile-ytm .playlist-toggle{
          width:auto!important;
          min-height:30px!important;
          padding:5px 10px!important;
          font-size:.7rem!important;
        }
        body.mobile-ytm .playlist-count{
          font-size:.7rem!important;
        }
        body.mobile-ytm #audioLibrary .playlist-grid{
          display:flex!important;
          flex-direction:column!important;
          gap:2px!important;
        }
        body.mobile-ytm #audioLibrary .playlist-card.audio-track{
          display:grid!important;
          grid-template-columns:34px minmax(0,1fr) 42px!important;
          gap:9px!important;
          min-height:48px!important;
          padding:6px 8px!important;
          border:0!important;
          border-radius:7px!important;
          background:transparent!important;
          box-shadow:none!important;
        }
        body.mobile-ytm #audioLibrary .audio-thumb{
          width:34px!important;
          height:34px!important;
          border-radius:5px!important;
        }
        body.mobile-ytm #audioLibrary .playlist-copy strong{
          overflow:hidden!important;
          white-space:nowrap!important;
          text-overflow:ellipsis!important;
          font-size:.82rem!important;
        }
        body.mobile-ytm #audioLibrary .playlist-copy small{
          color:#aaa!important;
          font-size:.68rem!important;
        }
        body.mobile-ytm #videoLibrary iframe{
          height:min(48vw,220px)!important;
          border-radius:12px!important;
        }
        body.mobile-ytm #videoLibrary .latest-video-card{
          grid-template-columns:1fr!important;
          gap:8px!important;
          padding:8px!important;
          margin:8px 0!important;
        }
        body.mobile-ytm #videoLibrary .latest-video-art{
          min-height:145px!important;
        }
        body.mobile-ytm #videoLibrary .playlist-grid{
          grid-template-columns:1fr!important;
          gap:6px!important;
        }
        body.mobile-ytm #videoLibrary .playlist-card{
          min-height:62px!important;
          grid-template-columns:84px minmax(0,1fr)!important;
          padding:7px!important;
          border-radius:8px!important;
        }
        body.mobile-ytm .iml-audio-deck{
          left:8px!important;
          right:8px!important;
          bottom:calc(58px + env(safe-area-inset-bottom))!important;
          min-height:54px!important;
          grid-template-columns:38px minmax(0,1fr) 32px!important;
          padding:7px 8px!important;
          box-shadow:0 -10px 32px rgba(0,0,0,.46)!important;
        }
        body.mobile-ytm .iml-audio-play{
          width:36px!important;
          height:36px!important;
        }
        body.mobile-ytm .iml-audio-title span:first-child{
          font-size:.76rem!important;
        }
        body.mobile-ytm .iml-audio-title span:last-child{
          font-size:.66rem!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function boot() {
    ensureStyles();
    removeDesktopMusicShell();
    const observer = new MutationObserver(removeDesktopMusicShell);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 12000);
    addEventListener("resize", removeDesktopMusicShell, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
