(() => {
  const ENHANCEMENT_VERSION = "41";

  function scriptAlreadyPresent(fileName) {
    return [...document.scripts].some(script => script.src.includes(fileName));
  }

  function loadEnhancement(fileName, id, onReady) {
    if (document.getElementById(id) || scriptAlreadyPresent(fileName)) {
      if (onReady) onReady();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = `./${fileName}?v=${ENHANCEMENT_VERSION}`;
    script.async = false;
    if (onReady) script.addEventListener("load", onReady, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }

  function ensureSiteEnhancements() {
    loadEnhancement("music-theme.js", "imlDirectMusicTheme", () => {
      loadEnhancement("music-polish.js", "imlDirectMusicPolish", () => {
        loadEnhancement("site-features.js", "imlDirectSiteFeatures");
      });
    });
    loadEnhancement("promo-ads.js", "imlDirectPromoAds", () => {
      loadEnhancement("promo-live-files.js", "imlDirectPromoLive");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureSiteEnhancements, { once: true });
  } else {
    ensureSiteEnhancements();
  }

  const section = document.getElementById("audioLibrary");
  if (!section || section.dataset.ready === "true") return;
  section.dataset.ready = "true";

  const tracks = [
    { title: "Everything is Borrowed - I.M.L.", src: "./audio/Everything is Borrowed - I.M.L..mp3" },
    { title: "F.O.C.U.S. - I.M.L.", src: "./audio/F.O.C.U.S..mp3" },
    { title: "Fl\u00fcssige Vernunft - I.M.L.", src: "./audio/Fl\u00fcssige Vernunft - I.M.L..mp3" },
    { title: "Grass Stains and Golden Hours - I.M.L.", src: "./audio/Grass Stains and Golden Hours - I.M.L..mp3" },
    { title: "Ibiza-Tr\u00e4ume - I.M.L.", src: "./audio/Ibiza-Tr\u00e4ume.mp3" },
    { title: "Ink and Echoes - I.M.L.", src: "./audio/Ink and Echoes - I.M.L..mp3" },
    { title: "Iron Will - I.M.L.", src: "./audio/Iron Will - I.M.L..mp3" },
    { title: "L'\u00c9clat et le Chaos - I.M.L.", src: "./audio/L\u2019\u00c9clat et le Chaos - I.M.L..mp3" },
    { title: "Lotus of the Void - I.M.L.", src: "./audio/Lotus of the Void - I.M.L..mp3" },
    { title: "Mir geht es gut - I.M.L.", src: "./audio/Mir geht es gut.mp3" },
    { title: "Monotone - I.M.L.", src: "./audio/Monotone - I.M.L..mp3" },
    { title: "My Favorite Person - I.M.L.", src: "./audio/My Favorite Person - I.M.L..mp3" },
    { title: "Neon Line - I.M.L.", src: "./audio/Neon Line - I.M.L..mp3" },
    { title: "No Filter Needed - I.M.L.", src: "./audio/No Filter Needed - I.M.L..mp3" },
    { title: "Parallel Lines (Never Apart) - I.M.L.", src: "./audio/Parallel Lines (Never Apart) - I.M.L..mp3" },
    { title: "Shadow to Sunlight - I.M.L.", src: "./audio/Shadow to Sunlight - I.M.L..mp3" },
    { title: "Tensiune \u0219i Cea\u021b\u0103 - I.M.L.", src: "./audio/Tensiune \u0219i Cea\u021b\u0103 - I.M.L..mp3" },
    { title: "The Clockwork Ghost - I.M.L.", src: "./audio/The Clockwork Ghost - I.M.L..mp3" },
    { title: "The Control Room - I.M.L.", src: "./audio/The Control Room - I.M.L..mp3" },
    { title: "The Full Spectrum - I.M.L.", src: "./audio/The Full Spectrum - I.M.L..mp3" },
    { title: "The Golden Thread - I.M.L.", src: "./audio/The Golden Thread - I.M.L..mp3" },
    { title: "The Quiet Kind - I.M.L.", src: "./audio/The Quiet Kind - I.M.L..mp3" },
    { title: "The Secret Sauce - I.M.L.", src: "./audio/The Secret Sauce - I.M.L..mp3" },
    { title: "The View From Here - I.M.L.", src: "./audio/The View From Here - I.M.L..mp3" },
    { title: "Unica mea iubire - I.M.L.", src: "./audio/Unica mea iubire - I.M.L..mp3" },
    { title: "We Drive - I.M.L.", src: "./audio/We Drive - I.M.L..mp3" },
    { title: "You Are Amazing - I.M.L.", src: "./audio/You Are Amazing - I.M.L..mp3" }
  ];

  const shell = section.querySelector(".library-shell") || section;

  function escapeHtml(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" };
    return value.replace(/[&<>"]/g, char => entities[char]);
  }

  if (!document.getElementById("imlAudioDeckStyles")) {
    const style = document.createElement("style");
    style.id = "imlAudioDeckStyles";
    style.textContent = `
      .iml-audio-deck{
        position:relative;
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        gap:14px;
        align-items:center;
        margin:16px 0 12px;
        padding:12px 14px;
        border-radius:18px;
        background:linear-gradient(135deg,rgba(12,12,14,.96),rgba(36,12,18,.94));
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 16px 42px rgba(0,0,0,.32),0 0 34px rgba(255,0,51,.16);
      }
      .iml-audio-deck::before{
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        pointer-events:none;
        background:linear-gradient(90deg,rgba(255,0,51,.18),transparent 36%,rgba(255,255,255,.08));
        opacity:.75;
      }
      .iml-audio-play,.iml-audio-mute{
        position:relative;
        z-index:1;
        display:grid;
        place-items:center;
        width:44px;
        height:44px;
        border:0;
        border-radius:50%;
        color:#fff;
        background:linear-gradient(135deg,#ff0033,#ff5c8a);
        box-shadow:0 10px 24px rgba(255,0,51,.28);
        cursor:pointer;
      }
      .iml-audio-mute{
        width:38px;
        height:38px;
        background:rgba(255,255,255,.1);
        box-shadow:none;
        border:1px solid rgba(255,255,255,.12);
      }
      .iml-audio-play::before{
        content:"";
        width:0;
        height:0;
        border-top:9px solid transparent;
        border-bottom:9px solid transparent;
        border-left:14px solid currentColor;
        margin-left:3px;
      }
      .iml-audio-deck.is-playing .iml-audio-play::before{
        width:14px;
        height:18px;
        border:0;
        margin:0;
        background:linear-gradient(90deg,currentColor 0 34%,transparent 34% 66%,currentColor 66% 100%);
      }
      .iml-audio-main{
        position:relative;
        z-index:1;
        display:grid;
        gap:7px;
        min-width:0;
      }
      .iml-audio-title{
        display:flex;
        justify-content:space-between;
        gap:12px;
        color:#fff;
        font-weight:950;
        line-height:1.15;
      }
      .iml-audio-title span:first-child{
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .iml-audio-title span:last-child{
        color:#ffb8c8;
        font-size:.78rem;
        flex:0 0 auto;
      }
      .iml-audio-seek{
        width:100%;
        accent-color:#ff0033;
        cursor:pointer;
      }
      .iml-audio-times{
        display:flex;
        justify-content:space-between;
        color:#bdbdc7;
        font-size:.78rem;
        font-weight:800;
      }
      .audio-player{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
      @media (max-width:640px){
        .iml-audio-deck{grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px}
        .iml-audio-mute{grid-column:1 / -1;width:100%;height:34px;border-radius:999px}
        .iml-audio-title{display:grid;gap:3px}
      }
    `;
    document.head.appendChild(style);
  }

  shell.innerHTML = `
    <h2>Audio Playlist</h2>
    <div class="iml-audio-deck" id="audioDeck">
      <button type="button" class="iml-audio-play" id="audioPlayButton" aria-label="Play audio"></button>
      <div class="iml-audio-main">
        <div class="iml-audio-title"><span id="audioNowTitle">Choose a track</span><span>I.M.L. Music</span></div>
        <input class="iml-audio-seek" id="audioSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Audio position">
        <div class="iml-audio-times"><span id="audioCurrentTime">0:00</span><span id="audioDuration">0:00</span></div>
      </div>
      <button type="button" class="iml-audio-mute" id="audioMuteButton" aria-label="Mute audio">Vol</button>
    </div>
    <audio id="audioPlayer" class="audio-player" preload="metadata"></audio>
    <p id="audioStatus">Checking the published audio files...</p>
    <div class="playlist-grid" id="audioTrackGrid" aria-label="I.M.L. audio playlist">
      ${tracks.map((track, index) => `
        <button type="button" class="playlist-card audio-track" data-audio-index="${index}">
          <span class="playlist-thumb audio-thumb"></span>
          <span class="playlist-copy"><strong>${escapeHtml(track.title)}</strong><small>MP3 audio</small></span>
        </button>
      `).join("")}
    </div>
  `;

  const audio = shell.querySelector("#audioPlayer");
  const status = shell.querySelector("#audioStatus");
  const grid = shell.querySelector("#audioTrackGrid");
  const deck = shell.querySelector("#audioDeck");
  const playButton = shell.querySelector("#audioPlayButton");
  const muteButton = shell.querySelector("#audioMuteButton");
  const seek = shell.querySelector("#audioSeek");
  const nowTitle = shell.querySelector("#audioNowTitle");
  const currentTime = shell.querySelector("#audioCurrentTime");
  const durationTime = shell.querySelector("#audioDuration");
  let currentTrack = null;
  let currentIndex = -1;
  let checkId = 0;
  let seeking = false;

  function setEnergy(playing) {
    deck.classList.toggle("is-playing", playing);
    playButton.setAttribute("aria-label", playing ? "Pause audio" : "Play audio");
    document.body.classList.toggle("video-active", playing);
    dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing } }));
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${rest}`;
  }

  function updateSeek() {
    if (!seeking) {
      const duration = audio.duration || 0;
      seek.value = duration ? Math.round((audio.currentTime / duration) * 1000) : 0;
    }
    currentTime.textContent = formatTime(audio.currentTime);
    durationTime.textContent = formatTime(audio.duration);
  }

  function updateMute() {
    muteButton.textContent = audio.muted ? "Muted" : "Vol";
    muteButton.setAttribute("aria-label", audio.muted ? "Unmute audio" : "Mute audio");
  }

  function stopMissingTrack(track) {
    if (currentTrack === track) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setEnergy(false);
    status.textContent = `${track.title} cannot play yet because its MP3 file is not published at the expected website path.`;
  }

  async function sourceExists(track, id) {
    try {
      const response = await fetch(track.src, { method: "HEAD", cache: "no-store" });
      if (id !== checkId) return false;
      if (!response.ok) {
        stopMissingTrack(track);
        return false;
      }
      return true;
    } catch (_) {
      if (id === checkId) status.textContent = `Tap play to start: ${track.title}`;
      return true;
    }
  }

  function selectTrack(index, autoPlay = true) {
    const track = tracks[index];
    if (!track) return;
    currentTrack = track;
    currentIndex = index;
    const id = ++checkId;

    grid.querySelectorAll(".audio-track").forEach(item => {
      item.classList.toggle("active", Number(item.dataset.audioIndex) === index);
    });

    audio.src = track.src;
    audio.load();
    nowTitle.textContent = track.title;
    updateSeek();
    status.textContent = `Loading: ${track.title}`;

    sourceExists(track, id).then(exists => {
      if (!exists || id !== checkId) return;
      status.textContent = `Tap play to start: ${track.title}`;
    });

    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => {
          if (currentTrack === track) status.textContent = `Now playing: ${track.title}`;
        }).catch(() => {
          if (currentTrack === track) status.textContent = `Tap play to start: ${track.title}`;
        });
      }
    }

    dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.5, 420) } }));
  }

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-audio-index]");
    if (!button) return;
    selectTrack(Number(button.dataset.audioIndex));
  });

  playButton.addEventListener("click", () => {
    if (!currentTrack) {
      selectTrack(0, true);
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {
        status.textContent = `Tap play to start: ${currentTrack.title}`;
      });
    } else {
      audio.pause();
    }
  });

  muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;
    updateMute();
  });

  seek.addEventListener("input", () => {
    seeking = true;
    const duration = audio.duration || 0;
    if (duration) currentTime.textContent = formatTime((Number(seek.value) / 1000) * duration);
  });

  seek.addEventListener("change", () => {
    const duration = audio.duration || 0;
    if (duration) audio.currentTime = (Number(seek.value) / 1000) * duration;
    seeking = false;
    updateSeek();
  });

  audio.addEventListener("play", () => {
    setEnergy(true);
    if (currentTrack) status.textContent = `Now playing: ${currentTrack.title}`;
  });
  audio.addEventListener("pause", () => setEnergy(false));
  audio.addEventListener("timeupdate", updateSeek);
  audio.addEventListener("loadedmetadata", updateSeek);
  audio.addEventListener("volumechange", updateMute);
  audio.addEventListener("ended", () => {
    setEnergy(false);
    const next = currentIndex + 1;
    if (tracks[next]) selectTrack(next);
  });
  audio.addEventListener("error", () => {
    if (currentTrack) stopMissingTrack(currentTrack);
  });

  sourceExists(tracks[0], ++checkId).then(exists => {
    if (exists && !currentTrack) status.textContent = "Choose a track to start audio-only playback.";
  });
  updateMute();
  updateSeek();
})();
