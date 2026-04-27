(() => {
  const ENHANCEMENT_VERSION = "36";

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
    loadEnhancement("music-theme.js", "imlDirectMusicTheme");
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
    { title: "Analog Hearts - I.M.L.", src: "./Analog Hearts - I.M.L..mp3" },
    { title: "Anker und Licht - I.M.L.", src: "./Anker und Licht - I.M.L..mp3" },
    { title: "Beautiful Madness - I.M.L.", src: "./Beautiful Madness - I.M.L..mp3" },
    { title: "Burnt Rubber & Chrome Dreams - I.M.L.", src: "./Burnt Rubber & Chrome Dreams - I.M.L..mp3" },
    { title: "Das Buch Unserer Zeit (2026)", src: "./Das Buch Unserer Zeit (2026).mp3" },
    { title: "Everything is Borrowed - I.M.L.", src: "./audio/Everything is Borrowed - I.M.L..mp3" },
    { title: "F.O.C.U.S. - I.M.L.", src: "./audio/F.O.C.U.S..mp3" },
    { title: "Flüssige Vernunft - I.M.L.", src: "./audio/Flüssige Vernunft - I.M.L..mp3" },
    { title: "Grass Stains and Golden Hours - I.M.L.", src: "./audio/Grass Stains and Golden Hours - I.M.L..mp3" },
    { title: "Ibiza-Träume - I.M.L.", src: "./audio/Ibiza-Träume.mp3" },
    { title: "Ink and Echoes - I.M.L.", src: "./audio/Ink and Echoes - I.M.L..mp3" },
    { title: "Iron Will - I.M.L.", src: "./audio/Iron Will - I.M.L..mp3" },
    { title: "L'Éclat et le Chaos - I.M.L.", src: "./audio/L’Éclat et le Chaos - I.M.L..mp3" },
    { title: "Lotus of the Void - I.M.L.", src: "./audio/Lotus of the Void - I.M.L..mp3" },
    { title: "Mir geht es gut - I.M.L.", src: "./audio/Mir geht es gut.mp3" },
    { title: "Monotone - I.M.L.", src: "./audio/Monotone - I.M.L..mp3" },
    { title: "My Favorite Person - I.M.L.", src: "./audio/My Favorite Person - I.M.L..mp3" },
    { title: "Neon Line - I.M.L.", src: "./audio/Neon Line - I.M.L..mp3" },
    { title: "No Filter Needed - I.M.L.", src: "./audio/No Filter Needed - I.M.L..mp3" },
    { title: "Parallel Lines (Never Apart) - I.M.L.", src: "./audio/Parallel Lines (Never Apart) - I.M.L..mp3" },
    { title: "Shadow to Sunlight - I.M.L.", src: "./audio/Shadow to Sunlight - I.M.L..mp3" },
    { title: "Tensiune și Ceață - I.M.L.", src: "./audio/Tensiune și Ceață - I.M.L..mp3" },
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

  shell.innerHTML = `
    <h2>Audio Playlist</h2>
    <p class="section-note">Audio-only listening for the I.M.L. catalog. These tracks use the MP3 files published on this website.</p>
    <audio id="audioPlayer" class="audio-player" controls preload="metadata"></audio>
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
  let currentTrack = null;
  let currentIndex = -1;
  let checkId = 0;

  function setEnergy(playing) {
    document.body.classList.toggle("video-active", playing);
    dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing } }));
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

  audio.addEventListener("play", () => {
    setEnergy(true);
    if (currentTrack) status.textContent = `Now playing: ${currentTrack.title}`;
  });
  audio.addEventListener("pause", () => setEnergy(false));
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
})();
