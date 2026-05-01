(() => {
  const STYLE_ID = "imlCleanHubRescueStyles";
  const MISSING_AUDIO_TITLES = [
    "Analog Hearts - I.M.L.",
    "Anker und Licht - I.M.L.",
    "Beautiful Madness - I.M.L.",
    "Burnt Rubber & Chrome Dreams - I.M.L.",
    "Das Buch Unserer Zeit (2026)"
  ];

  function isSmallScreen() {
    return matchMedia("(max-width:760px), (pointer:coarse)").matches;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root{--clean-bg:#050506;--clean-panel:#121214;--clean-panel-2:#1b1b1f;--clean-text:#fff;--clean-muted:#b5b5bb;--clean-red:#ff174c;--clean-line:rgba(255,255,255,.11)}
      html,body{overflow-x:hidden!important}
      body.iml-clean-layout{background:radial-gradient(circle at 20% -10%,rgba(255,23,76,.2),transparent 22rem),radial-gradient(circle at 85% 0,rgba(78,190,255,.13),transparent 24rem),linear-gradient(180deg,#0c0c0e 0%,#050506 38%,#000 100%)!important;color:var(--clean-text)!important;padding-bottom:calc(88px + env(safe-area-inset-bottom))!important}
      body.iml-clean-layout::before{opacity:.11!important;filter:saturate(.8)!important}
      body.iml-clean-layout::after{display:none!important}
      body.iml-clean-layout canvas#bg{opacity:.2!important}
      body.iml-clean-layout.ytm-redesign{padding-bottom:calc(88px + env(safe-area-inset-bottom))!important}
      body.iml-clean-layout .ytm-shell-topbar,
      body.iml-clean-layout .ytm-side-rail,
      body.iml-clean-layout .ytm-playlist-profile,
      body.iml-clean-layout #imlYtmTopbar,
      body.iml-clean-layout #imlYtmRail,
      body.iml-clean-layout #imlYtmPlaylistProfile,
      body.iml-clean-layout .promo-rail,
      body.iml-clean-layout .ytm-row-action,
      body.iml-clean-layout .track-action,
      body.iml-clean-layout .music-mini-player,
      body.iml-clean-layout .music-top-tabs{display:none!important}
      body.iml-clean-layout .site-header{display:flex!important;position:sticky!important;top:0!important;z-index:50!important;max-width:1120px!important;margin:0 auto!important;padding:calc(10px + env(safe-area-inset-top)) clamp(10px,2vw,18px) 10px!important;background:linear-gradient(180deg,rgba(5,5,6,.94),rgba(5,5,6,.72))!important;backdrop-filter:blur(14px)!important}
      body.iml-clean-layout .site-header::before{display:none!important}
      body.iml-clean-layout .brand-chip{min-height:40px!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;border:1px solid var(--clean-line)!important;box-shadow:none!important;padding:8px 13px!important}
      body.iml-clean-layout .brand-dot{background:var(--clean-red)!important;box-shadow:0 0 0 5px rgba(255,23,76,.13),0 0 18px rgba(255,23,76,.6)!important}
      body.iml-clean-layout .social-button{min-height:40px!important;border-radius:999px!important;background:#fff!important;color:#000!important;box-shadow:none!important;padding:8px 14px!important}
      body.iml-clean-layout main{display:block!important;max-width:1120px!important;margin:0 auto!important;padding:0 clamp(10px,2vw,18px) 34px!important}
      body.iml-clean-layout #hero{display:block!important;text-align:center!important;padding:20px 0 10px!important}
      body.iml-clean-layout #hero .logo-wrap{width:126px!important;height:126px!important;margin:0 auto 10px!important}
      body.iml-clean-layout #hero p{margin:0!important;color:var(--clean-muted)!important;font-size:.9rem!important}
      body.iml-clean-layout #hero .now-strip{display:none!important}
      body.iml-clean-layout #promoAdStrip{display:block!important;max-width:1120px!important;margin:14px auto 12px!important;padding:0!important}
      body.iml-clean-layout .promo-mobile-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;overflow:visible!important;padding:0!important}
      body.iml-clean-layout .promo-mobile-grid .promo-ad-card{width:100%!important;aspect-ratio:16/9!important;min-height:0!important;border-radius:14px!important;clip-path:none!important;box-shadow:0 16px 40px rgba(0,0,0,.34)!important}
      body.iml-clean-layout .promo-mobile-grid .promo-ad-card video{object-fit:cover!important;border-radius:inherit!important;transform:scale(1.03)!important}
      body.iml-clean-layout #audioLibrary,
      body.iml-clean-layout #videoLibrary,
      body.iml-clean-layout .ytm-action-section,
      body.iml-clean-layout main>section{padding:12px 0!important}
      body.iml-clean-layout #installBox{padding:24px 0 110px!important;text-align:center!important}
      body.iml-clean-layout .library-shell,
      body.iml-clean-layout .hub-panel,
      body.iml-clean-layout .action-card{max-width:100%!important;margin:0 auto!important;border:1px solid var(--clean-line)!important;border-radius:18px!important;background:linear-gradient(180deg,rgba(24,24,27,.94),rgba(12,12,14,.96))!important;box-shadow:0 18px 60px rgba(0,0,0,.3)!important;backdrop-filter:none!important;padding:20px!important}
      body.iml-clean-layout #audioLibrary .library-shell{display:block!important}
      body.iml-clean-layout .library-shell>h2{margin:0 0 8px!important;font-size:1.35rem!important;line-height:1.15!important}
      body.iml-clean-layout .section-note{margin:0 0 12px!important;color:var(--clean-muted)!important;font-size:.92rem!important;line-height:1.45!important}
      body.iml-clean-layout .music-player-hero{display:grid!important;grid-template-columns:160px minmax(0,1fr)!important;align-items:center!important;gap:20px!important;margin:14px 0!important;padding:18px!important;min-height:0!important;border-radius:18px!important;background:linear-gradient(135deg,rgba(255,23,76,.28),rgba(255,255,255,.06) 48%,rgba(0,0,0,.2))!important;border:1px solid rgba(255,255,255,.08)!important;box-shadow:none!important}
      body.iml-clean-layout .music-album-art{width:160px!important;height:160px!important;border-radius:14px!important;margin:0!important;background-size:cover!important}
      body.iml-clean-layout .music-eyebrow{font-size:.72rem!important;letter-spacing:.08em!important;color:#ffb6c7!important;margin:0 0 6px!important}
      body.iml-clean-layout .music-now-title{font-size:clamp(1.4rem,3.2vw,2.4rem)!important;line-height:1.08!important;margin:0!important}
      body.iml-clean-layout .music-subtitle{color:var(--clean-muted)!important;font-size:.9rem!important;line-height:1.4!important;margin-top:8px!important}
      body.iml-clean-layout .iml-audio-deck{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;z-index:3!important;display:grid!important;grid-template-columns:46px minmax(0,1fr) 44px!important;gap:12px!important;align-items:center!important;min-height:68px!important;margin:12px 0!important;padding:10px 12px!important;border-radius:16px!important;border:1px solid var(--clean-line)!important;background:#202024!important;box-shadow:none!important}
      body.iml-clean-layout .iml-audio-deck::before{display:none!important}
      body.iml-clean-layout .iml-audio-play{width:46px!important;height:46px!important;background:#fff!important;color:#000!important;box-shadow:none!important}
      body.iml-clean-layout .iml-audio-main{gap:5px!important;min-width:0!important}
      body.iml-clean-layout .iml-audio-title{gap:10px!important;align-items:center!important;color:#fff!important;font-size:.92rem!important;line-height:1.2!important}
      body.iml-clean-layout .iml-audio-title span:first-child{overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}
      body.iml-clean-layout .iml-audio-title span:last-child{color:#b8b8bd!important;font-size:.72rem!important}
      body.iml-clean-layout .iml-audio-seek{accent-color:var(--clean-red)!important;height:18px!important}
      body.iml-clean-layout .iml-audio-times{font-size:.72rem!important;color:#aaa!important}
      body.iml-clean-layout .iml-audio-mute{width:44px!important;height:38px!important;border-radius:999px!important;background:rgba(255,255,255,.08)!important;color:#fff!important;border:1px solid var(--clean-line)!important;box-shadow:none!important;font-size:.72rem!important}
      body.iml-clean-layout #audioStatus{margin:6px 0 10px!important;color:var(--clean-muted)!important;font-size:.84rem!important;min-height:1.25em!important}
      body.iml-clean-layout .playlist-control-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;margin:12px 0!important}
      body.iml-clean-layout .playlist-toggle,
      body.iml-clean-layout .feature-button,
      body.iml-clean-layout #installButton{min-height:38px!important;border-radius:999px!important;padding:8px 14px!important;background:#fff!important;color:#000!important;border:0!important;box-shadow:none!important;font-weight:900!important}
      body.iml-clean-layout .playlist-toggle[aria-expanded="true"]{background:var(--clean-red)!important;color:#fff!important}
      body.iml-clean-layout .playlist-toggle-icon{display:none!important}
      body.iml-clean-layout .playlist-count{color:#aaa!important;font-size:.8rem!important;font-weight:800!important;white-space:nowrap!important}
      body.iml-clean-layout .feature-toolbar{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;gap:8px!important;margin:10px 0!important;padding:0!important;background:transparent!important;position:relative!important;top:auto!important}
      body.iml-clean-layout .feature-search{min-height:40px!important;border-radius:999px!important;border:1px solid var(--clean-line)!important;background:rgba(255,255,255,.08)!important;color:#fff!important;padding:0 14px!important;font-size:.9rem!important}
      body.iml-clean-layout #audioLibrary .playlist-grid{display:flex!important;flex-direction:column!important;gap:2px!important;max-height:min(55vh,560px)!important;overflow:auto!important;margin:0!important;padding:4px 0!important;border-top:1px solid var(--clean-line)!important;scrollbar-width:thin!important}
      body.iml-clean-layout #audioLibrary .playlist-grid[hidden],
      body.iml-clean-layout #videoLibrary .playlist-grid[hidden]{display:none!important}
      body.iml-clean-layout #audioLibrary .playlist-card.audio-track{display:grid!important;grid-template-columns:32px 48px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;width:100%!important;min-height:58px!important;padding:7px 8px!important;border:0!important;border-radius:9px!important;background:transparent!important;box-shadow:none!important;color:#fff!important;text-align:left!important;overflow:hidden!important;transform:none!important}
      body.iml-clean-layout #audioLibrary .playlist-card.audio-track:hover,
      body.iml-clean-layout #audioLibrary .playlist-card.audio-track.active{background:rgba(255,255,255,.08)!important;box-shadow:inset 3px 0 0 var(--clean-red)!important}
      body.iml-clean-layout #audioLibrary .playlist-card.audio-track::before,
      body.iml-clean-layout #audioLibrary .playlist-card.audio-track::after{display:none!important;content:none!important}
      body.iml-clean-layout #audioLibrary .track-number{display:block!important;color:#9a9aa0!important;font-size:.82rem!important;font-weight:900!important;text-align:center!important;grid-column:1!important}
      body.iml-clean-layout #audioLibrary .audio-thumb{grid-column:2!important;width:48px!important;height:48px!important;border-radius:7px!important;background:#671027 url("./logo.svg") center/82% no-repeat!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:none!important}
      body.iml-clean-layout #audioLibrary .audio-thumb::after{display:none!important}
      body.iml-clean-layout #audioLibrary .playlist-copy{grid-column:3!important;display:block!important;min-width:0!important}
      body.iml-clean-layout #audioLibrary .playlist-copy strong{display:block!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:.92rem!important;line-height:1.2!important}
      body.iml-clean-layout #audioLibrary .playlist-copy small{display:block!important;color:#aaa!important;font-size:.76rem!important;line-height:1.2!important}
      body.iml-clean-layout #videoLibrary iframe{height:min(48vw,420px)!important;min-height:260px!important;border-radius:16px!important;margin:12px 0!important;border:1px solid var(--clean-line)!important;box-shadow:none!important}
      body.iml-clean-layout #videoLibrary .latest-video-card{display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(220px,.8fr)!important;gap:14px!important;margin:12px 0!important;padding:12px!important;border-radius:16px!important;background:rgba(255,255,255,.05)!important;border:1px solid var(--clean-line)!important;box-shadow:none!important}
      body.iml-clean-layout #videoLibrary .latest-video-art{min-height:210px!important;border-radius:12px!important}
      body.iml-clean-layout #videoLibrary .playlist-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))!important;gap:8px!important;max-height:520px!important;overflow:auto!important}
      body.iml-clean-layout #videoLibrary .playlist-card{min-height:72px!important;grid-template-columns:92px minmax(0,1fr)!important;gap:10px!important;padding:8px!important;border-radius:10px!important;border:0!important;background:transparent!important;box-shadow:none!important;transform:none!important}
      body.iml-clean-layout #videoLibrary .playlist-card:hover,
      body.iml-clean-layout #videoLibrary .playlist-card.active{background:rgba(255,255,255,.08)!important}
      body.iml-clean-layout #videoLibrary .playlist-thumb{width:92px!important;border-radius:7px!important}
      body.iml-clean-layout .action-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;max-width:100%!important}
      body.iml-clean-layout .action-card p{min-height:0!important;color:var(--clean-muted)!important}
      body.iml-clean-layout .scroll-top-button{right:18px!important;bottom:calc(24px + env(safe-area-inset-bottom))!important;z-index:60!important}
      body.iml-clean-layout .language-widget,
      body.iml-clean-layout #languageWidget{right:18px!important;bottom:calc(78px + env(safe-area-inset-bottom))!important;z-index:60!important}
      @media (max-width:760px){
        body.iml-clean-layout{padding-bottom:calc(84px + env(safe-area-inset-bottom))!important}
        body.iml-clean-layout .site-header{padding:calc(8px + env(safe-area-inset-top)) 10px 8px!important;gap:8px!important}
        body.iml-clean-layout .brand-chip{min-height:34px!important;padding:6px 9px!important}
        body.iml-clean-layout .brand-text{font-size:.84rem!important}
        body.iml-clean-layout .social-links{gap:6px!important}
        body.iml-clean-layout .social-button{min-height:34px!important;padding:6px 9px!important;font-size:.75rem!important}
        body.iml-clean-layout .social-icon{display:none!important}
        body.iml-clean-layout main{padding:0 10px 28px!important}
        body.iml-clean-layout #hero{padding:12px 0 6px!important}
        body.iml-clean-layout #hero .logo-wrap{width:86px!important;height:86px!important;margin-bottom:4px!important}
        body.iml-clean-layout #hero p{font-size:.68rem!important}
        body.iml-clean-layout .promo-mobile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
        body.iml-clean-layout .promo-mobile-grid .promo-ad-card{border-radius:10px!important}
        body.iml-clean-layout .library-shell,
        body.iml-clean-layout .hub-panel,
        body.iml-clean-layout .action-card{border-radius:14px!important;padding:12px!important;box-shadow:none!important}
        body.iml-clean-layout .library-shell>h2{font-size:1.08rem!important}
        body.iml-clean-layout .music-player-hero{grid-template-columns:86px minmax(0,1fr)!important;gap:10px!important;padding:10px!important;border-radius:12px!important}
        body.iml-clean-layout .music-album-art{width:86px!important;height:86px!important;border-radius:9px!important}
        body.iml-clean-layout .music-eyebrow{font-size:.58rem!important;margin-bottom:3px!important}
        body.iml-clean-layout .music-now-title{font-size:1.12rem!important}
        body.iml-clean-layout .music-subtitle{font-size:.68rem!important;margin-top:4px!important}
        body.iml-clean-layout .iml-audio-deck{grid-template-columns:38px minmax(0,1fr) 34px!important;gap:8px!important;min-height:58px!important;padding:8px!important;border-radius:12px!important}
        body.iml-clean-layout .iml-audio-play{width:38px!important;height:38px!important}
        body.iml-clean-layout .iml-audio-mute{width:34px!important;height:32px!important;font-size:.64rem!important}
        body.iml-clean-layout .iml-audio-title{font-size:.74rem!important}
        body.iml-clean-layout .iml-audio-title span:last-child{display:none!important}
        body.iml-clean-layout .feature-toolbar{grid-template-columns:1fr 1fr!important}
        body.iml-clean-layout .feature-search{grid-column:1 / -1!important;min-height:36px!important;font-size:.78rem!important}
        body.iml-clean-layout .feature-button{min-height:34px!important;font-size:.72rem!important;padding:6px 10px!important}
        body.iml-clean-layout .playlist-control-row{margin:8px 0!important}
        body.iml-clean-layout .playlist-toggle{min-height:32px!important;font-size:.72rem!important;padding:6px 10px!important}
        body.iml-clean-layout #audioLibrary .playlist-grid{max-height:48vh!important}
        body.iml-clean-layout #audioLibrary .playlist-card.audio-track{grid-template-columns:24px 40px minmax(0,1fr)!important;gap:8px!important;min-height:52px!important;padding:6px 4px!important}
        body.iml-clean-layout #audioLibrary .audio-thumb{width:40px!important;height:40px!important}
        body.iml-clean-layout #audioLibrary .playlist-copy strong{font-size:.78rem!important}
        body.iml-clean-layout #audioLibrary .playlist-copy small{font-size:.66rem!important}
        body.iml-clean-layout #videoLibrary iframe{height:min(52vw,230px)!important;min-height:190px!important;border-radius:12px!important}
        body.iml-clean-layout #videoLibrary .latest-video-card{grid-template-columns:1fr!important;gap:8px!important;padding:8px!important;border-radius:12px!important}
        body.iml-clean-layout #videoLibrary .latest-video-art{min-height:150px!important}
        body.iml-clean-layout #videoLibrary .playlist-grid{grid-template-columns:1fr!important;max-height:46vh!important}
        body.iml-clean-layout #videoLibrary .playlist-card{grid-template-columns:82px minmax(0,1fr)!important;min-height:62px!important;padding:6px!important}
        body.iml-clean-layout .action-grid{grid-template-columns:1fr!important}
        body.iml-clean-layout .scroll-top-button{right:10px!important;bottom:calc(16px + env(safe-area-inset-bottom))!important}
        body.iml-clean-layout .language-widget,
        body.iml-clean-layout #languageWidget{right:10px!important;bottom:calc(62px + env(safe-area-inset-bottom))!important}
      }
    `;
    document.head.appendChild(style);
  }

  function removeBrokenShell() {
    document.body.classList.add("iml-clean-layout");
    document.body.classList.remove("ytm-redesign");
    document.querySelectorAll("#imlYtmTopbar,#imlYtmRail,#imlYtmPlaylistProfile,.ytm-shell-topbar,.ytm-side-rail,.ytm-playlist-profile,.ytm-row-action,.track-action,.promo-rail,.music-mini-player").forEach(node => node.remove());
  }

  function cleanupAudio() {
    const grid = document.getElementById("audioTrackGrid");
    if (!grid) return;

    grid.querySelectorAll(".audio-track").forEach(card => {
      const title = card.querySelector(".playlist-copy strong")?.textContent.trim();
      if (MISSING_AUDIO_TITLES.includes(title)) card.remove();
    });

    const tracks = [...grid.querySelectorAll(".audio-track")];
    tracks.forEach((card, index) => {
      let number = card.querySelector(".track-number");
      if (!number) {
        number = document.createElement("span");
        number.className = "track-number";
        card.prepend(number);
      }
      number.textContent = String(index + 1);
    });

    document.querySelectorAll("#audioLibrary .playlist-count").forEach(node => {
      node.textContent = `${tracks.length} songs`;
    });

    const status = document.getElementById("audioStatus");
    if (status && MISSING_AUDIO_TITLES.some(title => status.textContent.includes(title))) {
      status.textContent = "Choose a song to start audio-only playback.";
    }
  }

  function setToggleLabel(toggle, text) {
    const label = toggle?.querySelector(".playlist-toggle-label");
    if (label) label.textContent = text;
    else if (toggle) toggle.textContent = text;
  }

  function collapsePlaylistsOnce() {
    [
      ["audioLibrary", "audioTrackGrid", "audioPlaylistToggle", "Show Songs", "Hide Songs"],
      ["videoLibrary", "videoPlaylistGrid", "videoPlaylistToggle", "Show Videos", "Hide Videos"]
    ].forEach(([sectionId, gridId, toggleId, closedLabel, openLabel]) => {
      const section = document.getElementById(sectionId);
      const grid = document.getElementById(gridId);
      const toggle = document.getElementById(toggleId);
      if (!section || !grid || !toggle) return;
      if (section.dataset.cleanCollapsed !== "true") {
        section.dataset.cleanCollapsed = "true";
        grid.hidden = true;
        grid.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        setToggleLabel(toggle, closedLabel);
      }
      if (toggle.dataset.cleanToggle !== "true") {
        toggle.dataset.cleanToggle = "true";
        toggle.addEventListener("click", () => {
          setTimeout(() => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            setToggleLabel(toggle, open ? openLabel : closedLabel);
          }, 0);
        });
      }
    });
  }

  function repairPromoStrip() {
    document.querySelectorAll("#promoAdLeft,#promoAdRight,.promo-rail").forEach(node => node.remove());
    const strip = document.getElementById("promoAdStrip");
    if (!strip) return;
    const hero = document.getElementById("hero");
    if (hero && strip.previousElementSibling !== hero) hero.insertAdjacentElement("afterend", strip);
    strip.querySelectorAll("video").forEach(video => {
      video.controls = false;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
    });
  }

  function runCleanup() {
    ensureStyles();
    removeBrokenShell();
    cleanupAudio();
    collapsePlaylistsOnce();
    repairPromoStrip();
  }

  function boot() {
    runCleanup();
    const observer = new MutationObserver(runCleanup);
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "aria-expanded"] });
    setTimeout(() => observer.disconnect(), 20000);
    addEventListener("resize", runCleanup, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
