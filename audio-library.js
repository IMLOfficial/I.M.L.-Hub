(() => {
  const section = document.getElementById("audioLibrary");
  if (!section || section.dataset.ready === "true") return;
  section.dataset.ready = "true";

  const tracks = [
    { title: "Everything is Borrowed - I.M.L.", src: "./audio/Everything%20is%20Borrowed%20-%20I.M.L..mp3" },
    { title: "F.O.C.U.S. - I.M.L.", src: "./audio/F.O.C.U.S..mp3" },
    { title: "Analog Hearts - I.M.L.", src: "./audio/Analog%20Hearts%20-%20I.M.L..mp3" },
    { title: "Anker und Licht - I.M.L.", src: "./audio/Anker%20und%20Licht%20-%20I.M.L..mp3" },
    { title: "Beautiful Madness - I.M.L.", src: "./audio/Beautiful%20Madness%20-%20I.M.L..mp3" },
    { title: "Burnt Rubber & Chrome Dreams - I.M.L.", src: "./audio/Burnt%20Rubber%20%26%20Chrome%20Dreams%20-%20I.M.L..mp3" },
    { title: "Das Buch Unserer Zeit (2026)", src: "./audio/Das%20Buch%20Unserer%20Zeit%20%282026%29.mp3" },
    { title: "Flüssige Vernunft - I.M.L.", src: "./audio/Fl%C3%BCssige%20Vernunft%20-%20I.M.L..mp3" },
    { title: "Grass Stains and Golden Hours - I.M.L.", src: "./audio/Grass%20Stains%20and%20Golden%20Hours%20-%20I.M.L..mp3" },
    { title: "Ibiza-Träume - I.M.L.", src: "./audio/Ibiza-Tr%C3%A4ume.mp3" },
    { title: "Ink and Echoes - I.M.L.", src: "./audio/Ink%20and%20Echoes%20-%20I.M.L..mp3" },
    { title: "Iron Will - I.M.L.", src: "./audio/Iron%20Will%20-%20I.M.L..mp3" },
    { title: "L'Éclat et le Chaos - I.M.L.", src: "./audio/L%E2%80%99%C3%89clat%20et%20le%20Chaos%20-%20I.M.L..mp3" },
    { title: "Lotus of the Void - I.M.L.", src: "./audio/Lotus%20of%20the%20Void%20-%20I.M.L..mp3" },
    { title: "Mir geht es gut - I.M.L.", src: "./audio/Mir%20geht%20es%20gut.mp3" },
    { title: "Monotone - I.M.L.", src: "./audio/Monotone%20-%20I.M.L..mp3" },
    { title: "My Favorite Person - I.M.L.", src: "./audio/My%20Favorite%20Person%20-%20I.M.L..mp3" },
    { title: "Neon Line - I.M.L.", src: "./audio/Neon%20Line%20-%20I.M.L..mp3" },
    { title: "No Filter Needed - I.M.L.", src: "./audio/No%20Filter%20Needed%20-%20I.M.L..mp3" },
    { title: "Parallel Lines (Never Apart) - I.M.L.", src: "./audio/Parallel%20Lines%20%28Never%20Apart%29%20-%20I.M.L..mp3" },
    { title: "Shadow to Sunlight - I.M.L.", src: "./audio/Shadow%20to%20Sunlight%20-%20I.M.L..mp3" },
    { title: "Tensiune și Ceață - I.M.L.", src: "./audio/Tensiune%20%C8%99i%20Cea%C8%9B%C4%83%20-%20I.M.L..mp3" },
    { title: "The Clockwork Ghost - I.M.L.", src: "./audio/The%20Clockwork%20Ghost%20-%20I.M.L..mp3" },
    { title: "The Control Room - I.M.L.", src: "./audio/The%20Control%20Room%20-%20I.M.L..mp3" },
    { title: "The Full Spectrum - I.M.L.", src: "./audio/The%20Full%20Spectrum%20-%20I.M.L..mp3" },
    { title: "The Golden Thread - I.M.L.", src: "./audio/The%20Golden%20Thread%20-%20I.M.L..mp3" },
    { title: "The Quiet Kind - I.M.L.", src: "./audio/The%20Quiet%20Kind%20-%20I.M.L..mp3" },
    { title: "The Secret Sauce - I.M.L.", src: "./audio/The%20Secret%20Sauce%20-%20I.M.L..mp3" },
    { title: "The View From Here - I.M.L.", src: "./audio/The%20View%20From%20Here%20-%20I.M.L..mp3" },
    { title: "Unica mea iubire - I.M.L.", src: "./audio/Unica%20mea%20iubire%20-%20I.M.L..mp3" },
    { title: "We Drive - I.M.L.", src: "./audio/We%20Drive%20-%20I.M.L..mp3" },
    { title: "You Are Amazing - I.M.L.", src: "./audio/You%20Are%20Amazing%20-%20I.M.L..mp3" }
  ];

  const shell = section.querySelector(".library-shell") || section;

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function ensureStyles() {
    if (document.getElementById("imlAudioStableStyles")) return;
    const style = document.createElement("style");
    style.id = "imlAudioStableStyles";
    style.textContent = `
      #audioLibrary .library-shell{background:linear-gradient(180deg,rgba(18,18,20,.96),rgba(6,6,8,.96));border-color:rgba(255,255,255,.1)}
      .audio-stage{display:grid;grid-template-columns:minmax(130px,220px) minmax(0,1fr);gap:18px;align-items:center;margin:14px 0;padding:16px;border-radius:18px;background:linear-gradient(135deg,rgba(255,23,76,.28),rgba(255,255,255,.06) 48%,rgba(0,0,0,.18));border:1px solid rgba(255,255,255,.1)}
      .audio-art{width:100%;aspect-ratio:1;border-radius:16px;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.16),transparent 38%),linear-gradient(135deg,#a20f35,#211018),url("./logo.svg") center/76% no-repeat;box-shadow:0 18px 46px rgba(0,0,0,.32)}
      .audio-copy{min-width:0;display:grid;gap:8px}.audio-eyebrow{margin:0;color:#ff9ab2;font-size:.78rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.audio-title{margin:0;font-size:clamp(1.45rem,4vw,3rem);line-height:1.02}.audio-status{margin:0;color:#bfc3cd;line-height:1.35}
      .audio-controls{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;margin-top:4px}.audio-play,.audio-small-button{min-height:42px;border-radius:999px;border:0;font-weight:900}.audio-play{width:48px;height:48px;padding:0;background:#fff;color:#050505}.audio-play::before{content:"";display:block;width:0;height:0;margin:auto;border-top:9px solid transparent;border-bottom:9px solid transparent;border-left:14px solid currentColor;transform:translateX(2px)}.audio-play.is-playing::before{width:14px;height:18px;border:0;transform:none;background:linear-gradient(90deg,currentColor 0 34%,transparent 34% 66%,currentColor 66% 100%)}
      .audio-seek{width:100%;accent-color:#ff174c}.audio-time{color:#c7c7cc;font-size:.82rem;font-weight:800;white-space:nowrap}.audio-native{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
      .audio-toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;margin:12px 0}.audio-search{min-height:40px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;padding:0 14px;font:inherit}.audio-small-button{padding:8px 14px;background:#fff;color:#050505}.playlist-toggle{min-height:38px;border-radius:999px;padding:8px 14px;background:#ff174c;color:#fff;border:0;font-weight:900}.audio-list-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0}.audio-count{color:#aaa;font-size:.85rem;font-weight:800}
      .audio-list{display:flex;flex-direction:column;gap:2px;max-height:min(58vh,620px);overflow:auto;padding:4px 0;border-top:1px solid rgba(255,255,255,.1);scrollbar-width:thin}.audio-list[hidden]{display:none!important}
      .audio-row{display:grid;grid-template-columns:34px 48px minmax(0,1fr) auto;gap:12px;align-items:center;min-height:58px;padding:7px 8px;border:0;border-radius:10px;background:transparent;color:#fff;text-align:left;cursor:pointer}.audio-row:hover,.audio-row:focus-visible,.audio-row.active{background:rgba(255,255,255,.09);outline:0}.audio-row.active{box-shadow:inset 3px 0 0 #ff174c}.audio-number{color:#96969d;text-align:center;font-weight:900;font-size:.82rem}.audio-thumb{width:48px;height:48px;border-radius:8px;background:#7e1130 url("./logo.svg") center/80% no-repeat;border:1px solid rgba(255,255,255,.12)}.audio-row strong{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:.94rem;line-height:1.2}.audio-row small{display:block;color:#aaa;font-size:.76rem}.audio-row-action{color:#ff9ab2;font-size:.76rem;font-weight:900;text-transform:uppercase}
      @media (max-width:720px){.audio-stage{grid-template-columns:88px minmax(0,1fr);gap:12px;padding:11px;border-radius:14px}.audio-art{border-radius:10px}.audio-title{font-size:1.15rem}.audio-eyebrow{font-size:.62rem}.audio-status{font-size:.78rem}.audio-controls{grid-template-columns:42px minmax(0,1fr);gap:8px}.audio-play{width:42px;height:42px}.audio-time{grid-column:1 / -1}.audio-toolbar{grid-template-columns:1fr 1fr}.audio-search{grid-column:1 / -1}.audio-row{grid-template-columns:26px 42px minmax(0,1fr);gap:8px;min-height:52px;padding:6px 4px}.audio-thumb{width:42px;height:42px}.audio-row strong{font-size:.8rem}.audio-row small{font-size:.68rem}.audio-row-action{display:none}.audio-list{max-height:52vh}}
    `;
    document.head.appendChild(style);
  }

  ensureStyles();

  shell.innerHTML = `
    <h2>Audio Playlist</h2>
    <div class="audio-stage">
      <div class="audio-art" aria-hidden="true"></div>
      <div class="audio-copy">
        <p class="audio-eyebrow">I.M.L. Music</p>
        <h3 class="audio-title" id="audioNowTitle">Choose a song</h3>
        <p class="audio-status" id="audioStatus">Tap any song below to play it directly on the page.</p>
        <div class="audio-controls">
          <button type="button" class="audio-play" id="audioPlayButton" aria-label="Play audio"></button>
          <input class="audio-seek" id="audioSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Audio position">
          <span class="audio-time"><span id="audioCurrentTime">0:00</span> / <span id="audioDuration">0:00</span></span>
        </div>
      </div>
    </div>
    <audio id="audioPlayer" class="audio-native" preload="none" playsinline></audio>
    <div class="audio-list-top">
      <button type="button" class="playlist-toggle" id="audioPlaylistToggle" aria-expanded="true" aria-controls="audioTrackGrid">Hide Songs</button>
      <span class="audio-count">${tracks.length} songs</span>
    </div>
    <div class="audio-toolbar">
      <input class="audio-search" id="audioSearch" type="search" placeholder="Search songs" aria-label="Search songs">
      <button type="button" class="audio-small-button" id="audioShuffle">Shuffle</button>
      <button type="button" class="audio-small-button" id="audioShare">Share Songs</button>
    </div>
    <div class="audio-list" id="audioTrackGrid" aria-label="I.M.L. audio playlist">
      ${tracks.map((track, index) => `
        <button type="button" class="audio-row audio-track" data-audio-index="${index}">
          <span class="audio-number">${index + 1}</span>
          <span class="audio-thumb" aria-hidden="true"></span>
          <span><strong>${escapeHtml(track.title)}</strong><small>MP3 audio</small></span>
          <span class="audio-row-action">Play</span>
        </button>
      `).join("")}
    </div>
  `;

  const audio = shell.querySelector("#audioPlayer");
  const playButton = shell.querySelector("#audioPlayButton");
  const seek = shell.querySelector("#audioSeek");
  const nowTitle = shell.querySelector("#audioNowTitle");
  const status = shell.querySelector("#audioStatus");
  const currentTime = shell.querySelector("#audioCurrentTime");
  const durationTime = shell.querySelector("#audioDuration");
  const grid = shell.querySelector("#audioTrackGrid");
  const toggle = shell.querySelector("#audioPlaylistToggle");
  const search = shell.querySelector("#audioSearch");
  let currentIndex = -1;
  let seeking = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  }

  function updateTimes() {
    if (!seeking) {
      const duration = audio.duration || 0;
      seek.value = duration ? Math.round((audio.currentTime / duration) * 1000) : 0;
    }
    currentTime.textContent = formatTime(audio.currentTime);
    durationTime.textContent = formatTime(audio.duration);
  }

  function updateRows() {
    grid.querySelectorAll(".audio-row").forEach(row => {
      row.classList.toggle("active", Number(row.dataset.audioIndex) === currentIndex);
    });
  }

  function setPlayingState(playing) {
    playButton.classList.toggle("is-playing", playing);
    playButton.setAttribute("aria-label", playing ? "Pause audio" : "Play audio");
    document.body.classList.toggle("video-active", playing);
  }

  function chooseTrack(index, shouldPlay = true) {
    const track = tracks[index];
    if (!track) return;
    currentIndex = index;
    nowTitle.textContent = track.title;
    status.textContent = `Loading: ${track.title}`;
    audio.src = new URL(track.src, location.href).href;
    audio.load();
    updateRows();
    updateTimes();
    if (!shouldPlay) return;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        status.textContent = `Tap play to start: ${track.title}`;
      });
    }
  }

  function playCurrent() {
    if (currentIndex < 0) {
      chooseTrack(0, true);
      return;
    }
    audio.play().catch(() => {
      status.textContent = `Tap play to start: ${tracks[currentIndex].title}`;
    });
  }

  grid.addEventListener("click", event => {
    const row = event.target.closest("[data-audio-index]");
    if (!row) return;
    chooseTrack(Number(row.dataset.audioIndex), true);
  });

  playButton.addEventListener("click", () => {
    if (audio.paused) playCurrent();
    else audio.pause();
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
    updateTimes();
  });

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    grid.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Hide Songs" : "Show Songs";
  });

  search.addEventListener("input", () => {
    const query = normalize(search.value.trim());
    grid.querySelectorAll(".audio-row").forEach(row => {
      row.hidden = query && !normalize(row.textContent).includes(query);
    });
  });

  shell.querySelector("#audioShuffle").addEventListener("click", () => {
    const next = Math.floor(Math.random() * tracks.length);
    chooseTrack(next, true);
  });

  shell.querySelector("#audioShare").addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}#audioLibrary`;
    if (navigator.share) await navigator.share({ title: "I.M.L. songs", url }).catch(() => {});
    else {
      await navigator.clipboard?.writeText(url).catch(() => {});
      const button = shell.querySelector("#audioShare");
      const old = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = old; }, 1200);
    }
  });

  audio.addEventListener("play", () => {
    setPlayingState(true);
    if (tracks[currentIndex]) status.textContent = `Now playing: ${tracks[currentIndex].title}`;
  });
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("timeupdate", updateTimes);
  audio.addEventListener("loadedmetadata", updateTimes);
  audio.addEventListener("ended", () => {
    setPlayingState(false);
    chooseTrack((currentIndex + 1) % tracks.length, true);
  });
  audio.addEventListener("error", () => {
    setPlayingState(false);
    const track = tracks[currentIndex];
    status.textContent = track ? `This MP3 is not loading yet: ${track.title}` : "This MP3 is not loading yet.";
  });

  updateTimes();
})();
