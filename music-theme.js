(() => {
  const STYLE_ID = "imlMusicThemeStyles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root{
        --bg:#050505;
        --fg:#fff;
        --muted:#a8a8a8;
        --accent:#ff1744;
        --line:rgba(255,255,255,.11);
        --panel:rgba(18,18,18,.82);
        --music-red:#ff1744;
        --music-pink:#ff5c8a;
        --music-surface:#121212;
        --music-surface-2:#1c1c1c;
      }
      body.music-theme{
        padding-bottom:86px;
        background:
          radial-gradient(circle at 50% 0%,rgba(255,23,68,.22),transparent 25rem),
          radial-gradient(circle at 16% 40%,rgba(77,184,255,.14),transparent 22rem),
          linear-gradient(180deg,#090909 0%,#050505 48%,#000 100%);
      }
      body.music-theme::before{
        background:
          radial-gradient(circle at 50% 18%,rgba(255,23,68,.28),transparent 19rem),
          radial-gradient(circle at 50% 18%,rgba(255,255,255,.08),transparent 12rem),
          url("./logo.svg") center 132px/min(44vw,300px) no-repeat;
        opacity:.28;
      }
      body.music-theme::after{opacity:.28;filter:blur(42px) saturate(1.15)}
      body.music-theme .site-header::before{
        border-color:rgba(255,255,255,.12);
        background:rgba(10,10,10,.78);
        box-shadow:0 12px 34px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.03);
      }
      body.music-theme .brand-chip{
        border-color:rgba(255,255,255,.12);
        background:linear-gradient(135deg,rgba(255,23,68,.22),rgba(18,18,18,.88));
        box-shadow:0 10px 24px rgba(0,0,0,.36),0 0 28px rgba(255,23,68,.14);
      }
      body.music-theme .brand-dot{background:var(--music-red);box-shadow:0 0 0 5px rgba(255,23,68,.14),0 0 18px rgba(255,23,68,.9)}
      body.music-theme .brand-text{text-shadow:0 0 16px rgba(255,23,68,.44)}
      body.music-theme .social-button,
      body.music-theme .button,
      body.music-theme button{
        border-radius:999px;
      }
      body.music-theme .youtube-link,
      body.music-theme .button,
      body.music-theme #installButton,
      body.music-theme #shareButton{
        --brand-a:#ff1744;
        --brand-b:#ff5c8a;
        background:linear-gradient(135deg,#ff1744,#ff5c8a);
      }
      body.music-theme .tiktok-link{--brand-a:#20efd9;--brand-b:#ff1744}
      body.music-theme #hero{padding-top:56px}
      body.music-theme #hero>p{color:#d8d8d8;font-weight:700;letter-spacing:.01em}
      body.music-theme .hub-panel,
      body.music-theme .library-shell,
      body.music-theme .action-card{
        border-radius:16px;
        border-color:rgba(255,255,255,.1);
        background:linear-gradient(180deg,rgba(24,24,24,.88),rgba(12,12,12,.84));
        box-shadow:0 24px 70px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.04);
      }
      body.music-theme .library-shell{max-width:1120px;padding:22px}
      body.music-theme .section-note{color:#b8b8b8}
      body.music-theme .mood-controls button{
        border-color:rgba(255,255,255,.12);
        background:rgba(255,255,255,.08);
      }
      body.music-theme .mood-controls button.active{
        background:linear-gradient(135deg,#ff1744,#8e24aa);
        box-shadow:0 0 26px rgba(255,23,68,.38);
      }
      body.music-theme .action-grid{max-width:1120px}
      body.music-theme .action-card{min-height:168px}
      body.music-theme .now-strip{
        border-color:rgba(255,23,68,.32);
        background:rgba(16,16,16,.82);
        box-shadow:0 0 26px rgba(255,23,68,.12);
      }
      body.music-theme iframe{
        border-radius:12px;
        box-shadow:0 20px 60px rgba(0,0,0,.34);
      }
      body.music-theme .latest-video-card{
        border-radius:14px;
        border-color:rgba(255,255,255,.1);
        background:linear-gradient(135deg,rgba(255,23,68,.2),rgba(18,18,18,.9));
      }
      body.music-theme .latest-video-art{border-radius:10px}
      body.music-theme #audioLibrary .library-shell{
        background:
          radial-gradient(circle at 18% 0%,rgba(255,23,68,.24),transparent 24rem),
          linear-gradient(180deg,rgba(22,22,22,.96),rgba(7,7,7,.92));
      }
      body.music-theme .music-player-hero{
        display:grid;
        grid-template-columns:minmax(160px,230px) minmax(0,1fr);
        gap:22px;
        align-items:center;
        margin:18px 0 18px;
        padding:22px;
        border:1px solid rgba(255,255,255,.1);
        border-radius:16px;
        background:
          radial-gradient(circle at 20% 20%,rgba(255,23,68,.3),transparent 18rem),
          linear-gradient(135deg,rgba(35,35,35,.95),rgba(10,10,10,.94));
        box-shadow:0 22px 60px rgba(0,0,0,.34);
      }
      body.music-theme .music-album-art{
        width:100%;
        max-width:230px;
        aspect-ratio:1;
        border-radius:14px;
        background:
          radial-gradient(circle at 50% 45%,rgba(255,255,255,.2),transparent 40%),
          linear-gradient(135deg,rgba(255,23,68,.7),rgba(16,16,16,.72)),
          url("./logo.svg") center/72% no-repeat;
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 24px 50px rgba(0,0,0,.42),0 0 36px rgba(255,23,68,.22);
      }
      body.music-theme .music-player-copy{display:grid;gap:10px;align-content:center;min-width:0}
      body.music-theme .music-eyebrow{margin:0;color:#ff9caf;font-weight:900;text-transform:uppercase;font-size:.78rem;letter-spacing:.12em}
      body.music-theme .music-now-title{margin:0;font-size:clamp(1.8rem,4.6vw,4.4rem);line-height:.95;font-weight:950;letter-spacing:0;overflow-wrap:anywhere}
      body.music-theme .music-subtitle{margin:0;color:#cfcfcf;font-weight:650}
      body.music-theme .music-player-controls{margin-top:6px}
      body.music-theme .audio-player{width:100%;accent-color:var(--music-red);margin:0;background:#efefef;border-radius:999px}
      body.music-theme #audioStatus{margin:0;color:#b8b8b8;min-height:1.4em}
      body.music-theme #audioLibrary .playlist-grid{
        display:flex;
        flex-direction:column;
        gap:3px;
        margin-top:14px;
      }
      body.music-theme #audioLibrary .playlist-card.audio-track{
        display:grid;
        grid-template-columns:34px 52px minmax(0,1fr) auto;
        align-items:center;
        gap:14px;
        min-height:66px;
        padding:8px 12px;
        border:0;
        border-radius:8px;
        background:transparent;
        box-shadow:none;
        color:#fff;
      }
      body.music-theme #audioLibrary .playlist-card.audio-track::before{display:none}
      body.music-theme #audioLibrary .playlist-card.audio-track:hover,
      body.music-theme #audioLibrary .playlist-card.audio-track:focus-visible,
      body.music-theme #audioLibrary .playlist-card.audio-track.active{
        transform:none;
        background:rgba(255,255,255,.08);
        box-shadow:none;
      }
      body.music-theme #audioLibrary .playlist-card.audio-track.active{
        outline:1px solid rgba(255,23,68,.46);
      }
      body.music-theme .track-number{color:#8f8f8f;text-align:center;font-weight:800;font-size:.92rem}
      body.music-theme .track-action{color:#ff9caf;font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:.08em}
      body.music-theme #audioLibrary .playlist-thumb.audio-thumb{
        width:52px;
        height:52px;
        aspect-ratio:1;
        border-radius:6px;
        background:
          radial-gradient(circle at 50% 45%,rgba(255,255,255,.18),transparent 40%),
          linear-gradient(135deg,rgba(255,23,68,.66),rgba(20,20,20,.8)),
          url("./logo.svg") center/74% no-repeat;
        box-shadow:0 8px 22px rgba(0,0,0,.28);
      }
      body.music-theme #audioLibrary .audio-thumb::after{display:none}
      body.music-theme #audioLibrary .playlist-copy strong{font-size:.98rem;line-height:1.18;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      body.music-theme #audioLibrary .playlist-copy small{color:#aaa}
      body.music-theme #videoLibrary .playlist-grid{
        grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
      }
      body.music-theme #videoLibrary .playlist-card{
        border-radius:12px;
        min-height:96px;
        background:rgba(255,255,255,.045);
        box-shadow:none;
      }
      body.music-theme .music-mini-player{
        position:fixed;
        left:12px;
        right:12px;
        bottom:max(10px,env(safe-area-inset-bottom));
        z-index:8;
        display:grid;
        grid-template-columns:48px minmax(0,1fr) auto auto;
        gap:12px;
        align-items:center;
        padding:10px 12px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:16px;
        background:rgba(12,12,12,.88);
        backdrop-filter:blur(18px);
        box-shadow:0 18px 60px rgba(0,0,0,.48),0 0 28px rgba(255,23,68,.14);
      }
      body.music-theme .music-mini-art{
        width:48px;
        height:48px;
        border-radius:8px;
        background:linear-gradient(135deg,rgba(255,23,68,.65),rgba(16,16,16,.7)),url("./logo.svg") center/74% no-repeat;
      }
      body.music-theme .music-mini-copy{min-width:0;display:grid;gap:2px}
      body.music-theme .music-mini-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:900}
      body.music-theme .music-mini-status{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#aaa;font-size:.83rem}
      body.music-theme .music-mini-link{
        min-height:38px;
        padding:9px 14px;
        border-radius:999px;
        background:rgba(255,255,255,.09);
        color:#fff;
        text-decoration:none;
        font-weight:900;
        border:1px solid rgba(255,255,255,.1);
      }
      body.music-theme .music-mini-link.primary{background:linear-gradient(135deg,#ff1744,#ff5c8a)}
      @media (max-width:720px){
        body.music-theme{padding-bottom:100px}
        body.music-theme::before{background:radial-gradient(circle at 50% 18%,rgba(255,23,68,.2),transparent 16rem),url("./logo.svg") center 120px/min(58vw,230px) no-repeat;opacity:.25}
        body.music-theme .music-player-hero{grid-template-columns:1fr;padding:16px;text-align:left}
        body.music-theme .music-album-art{max-width:168px;margin:auto}
        body.music-theme .music-now-title{font-size:clamp(1.7rem,9vw,2.7rem)}
        body.music-theme #audioLibrary .playlist-card.audio-track{grid-template-columns:26px 46px minmax(0,1fr);gap:10px;min-height:62px;padding:8px}
        body.music-theme #audioLibrary .playlist-thumb.audio-thumb{width:46px;height:46px}
        body.music-theme .track-action{display:none}
        body.music-theme .music-mini-player{grid-template-columns:42px minmax(0,1fr) auto;gap:10px;padding:9px;border-radius:14px}
        body.music-theme .music-mini-art{width:42px;height:42px}
        body.music-theme .music-mini-link{display:none}
        body.music-theme .music-mini-link.primary{display:inline-flex;min-height:36px;padding:8px 12px}
      }
      @media (prefers-reduced-motion:reduce){
        body.music-theme .music-mini-player,body.music-theme .music-player-hero{backdrop-filter:none}
      }
    `;
    document.head.appendChild(style);
  }

  function getSelectedAudioTitle() {
    const selected = document.querySelector("#audioLibrary .audio-track.active .playlist-copy strong");
    return selected?.textContent?.trim() || "Choose a song";
  }

  function getAudioStatus() {
    return document.getElementById("audioStatus")?.textContent?.trim() || "I.M.L. audio playlist";
  }

  function ensureMiniPlayer() {
    let mini = document.getElementById("musicMiniPlayer");
    if (mini) return mini;
    mini = document.createElement("div");
    mini.id = "musicMiniPlayer";
    mini.className = "music-mini-player";
    mini.innerHTML = `
      <span class="music-mini-art" aria-hidden="true"></span>
      <span class="music-mini-copy">
        <strong class="music-mini-title">Choose a song</strong>
        <small class="music-mini-status">I.M.L. audio playlist</small>
      </span>
      <a class="music-mini-link primary" href="#audioLibrary">Audio</a>
      <a class="music-mini-link" href="#videoLibrary">Videos</a>
    `;
    document.body.appendChild(mini);
    return mini;
  }

  function updateMiniPlayer() {
    const mini = ensureMiniPlayer();
    const title = mini.querySelector(".music-mini-title");
    const status = mini.querySelector(".music-mini-status");
    if (title) title.textContent = getSelectedAudioTitle();
    if (status) status.textContent = getAudioStatus();
  }

  function decorateAudio() {
    const shell = document.querySelector("#audioLibrary .library-shell");
    const audio = document.getElementById("audioPlayer");
    const status = document.getElementById("audioStatus");
    const grid = document.getElementById("audioTrackGrid");
    if (!shell || !audio || !status || !grid) return false;

    document.body.classList.add("music-theme");
    shell.classList.add("music-app-shell");

    if (!shell.querySelector(".music-player-hero")) {
      const hero = document.createElement("div");
      hero.className = "music-player-hero";
      hero.innerHTML = `
        <span class="music-album-art" aria-hidden="true"></span>
        <span class="music-player-copy">
          <p class="music-eyebrow">I.M.L. Music</p>
          <h2 class="music-now-title">Choose a song</h2>
          <p class="music-subtitle">Audio-only listening, built for mobile and desktop.</p>
          <span class="music-player-controls"></span>
          <span class="music-player-status"></span>
        </span>
      `;
      shell.insertBefore(hero, grid);
      hero.querySelector(".music-player-controls").appendChild(audio);
      hero.querySelector(".music-player-status").appendChild(status);
    }

    grid.querySelectorAll(".audio-track").forEach((card, index) => {
      if (!card.querySelector(".track-number")) {
        const number = document.createElement("span");
        number.className = "track-number";
        number.textContent = String(index + 1);
        card.insertBefore(number, card.firstChild);
      }
      if (!card.querySelector(".track-action")) {
        const action = document.createElement("span");
        action.className = "track-action";
        action.textContent = "Play";
        card.appendChild(action);
      }
    });

    const heroTitle = shell.querySelector(".music-now-title");
    const refresh = () => {
      if (heroTitle) heroTitle.textContent = getSelectedAudioTitle();
      updateMiniPlayer();
    };

    if (!grid.dataset.musicThemeReady) {
      grid.dataset.musicThemeReady = "true";
      grid.addEventListener("click", () => setTimeout(refresh, 80));
      audio.addEventListener("play", refresh);
      audio.addEventListener("pause", refresh);
      audio.addEventListener("ended", refresh);
      new MutationObserver(refresh).observe(status, { childList: true, characterData: true, subtree: true });
    }

    refresh();
    return true;
  }

  function boot() {
    document.body?.classList.add("music-theme");
    ensureMiniPlayer();
    decorateAudio();
    const observer = new MutationObserver(() => decorateAudio());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
