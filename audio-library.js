(() => {
  const section = document.getElementById("audioLibrary");
  if (!section) return;

  const tracks = [
    { title: "Analog Hearts - I.M.L.", file: "Analog Hearts - I.M.L..wav" },
    { title: "Anker und Licht - I.M.L.", file: "Anker und Licht - I.M.L..wav" },
    { title: "Beautiful Madness - I.M.L.", file: "Beautiful Madness - I.M.L..wav" },
    { title: "Burnt Rubber & Chrome Dreams - I.M.L.", file: "Burnt Rubber & Chrome Dreams - I.M.L..wav" },
    { title: "Das Buch Unserer Zeit (2026)", file: "Das Buch Unserer Zeit (2026).mp3" },
    { title: "Everything is Borrowed - I.M.L.", file: "Everything is Borrowed - I.M.L..wav" },
    { title: "F.O.C.U.S. - I.M.L.", file: "F.O.C.U.S..wav" },
    { title: "Flüssige Vernunft - I.M.L.", file: "Flüssige Vernunft - I.M.L..wav" },
    { title: "Grass Stains and Golden Hours - I.M.L.", file: "Grass Stains and Golden Hours - I.M.L..wav" },
    { title: "Ibiza-Träume - I.M.L.", file: "Ibiza-Träume.wav" },
    { title: "Ink and Echoes - I.M.L.", file: "Ink and Echoes - I.M.L..wav" },
    { title: "Iron Will - I.M.L.", file: "Iron Will - I.M.L..wav" },
    { title: "L’Éclat et le Chaos - I.M.L.", file: "L’Éclat et le Chaos - I.M.L..wav" },
    { title: "Lotus of the Void - I.M.L.", file: "Lotus of the Void - I.M.L..wav" },
    { title: "Mir geht es gut - I.M.L.", file: "Mir geht es gut.wav" },
    { title: "Monotone - I.M.L.", file: "Monotone - I.M.L..wav" },
    { title: "My Favorite Person - I.M.L.", file: "My Favorite Person - I.M.L..wav" },
    { title: "Neon Line - I.M.L.", file: "Neon Line - I.M.L..wav" },
    { title: "No Filter Needed - I.M.L.", file: "No Filter Needed - I.M.L..wav" },
    { title: "Parallel Lines (Never Apart) - I.M.L.", file: "Parallel Lines (Never Apart) - I.M.L..wav" },
    { title: "Shadow to Sunlight - I.M.L.", file: "Shadow to Sunlight - I.M.L..wav" },
    { title: "Tensiune și Ceață - I.M.L.", file: "Tensiune și Ceață - I.M.L..wav" },
    { title: "The Clockwork Ghost - I.M.L.", file: "The Clockwork Ghost - I.M.L..wav" },
    { title: "The Control Room - I.M.L.", file: "The Control Room - I.M.L..wav" },
    { title: "The Full Spectrum - I.M.L.", file: "The Full Spectrum - I.M.L..wav" },
    { title: "The Golden Thread - I.M.L.", file: "The Golden Thread - I.M.L..wav" },
    { title: "The Quiet Kind - I.M.L.", file: "The Quiet Kind - I.M.L..wav" },
    { title: "The Secret Sauce - I.M.L.", file: "The Secret Sauce - I.M.L..wav" },
    { title: "The View From Here - I.M.L.", file: "The View From Here - I.M.L..wav" },
    { title: "Unica mea iubire - I.M.L.", file: "Unica mea iubire - I.M.L..wav" },
    { title: "We Drive - I.M.L.", file: "We Drive - I.M.L..wav" },
    { title: "You Are Amazing - I.M.L.", file: "You Are Amazing - I.M.L..wav" }
  ];

  const shell = section.querySelector(".library-shell") || section;

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function audioSrc(file) {
    return `./audio/${encodeURIComponent(file)}`;
  }

  function audioType(file) {
    return file.toLowerCase().endsWith(".mp3") ? "MP3 audio" : "WAV audio";
  }

  shell.innerHTML = `
    <h2>Audio Playlist</h2>
    <p class="section-note">Audio-only listening for the I.M.L. catalog. The playlist now uses your provided WAV and MP3 song files from the audio folder.</p>
    <audio id="audioPlayer" class="audio-player" controls preload="none"></audio>
    <p id="audioStatus">Choose a track to start audio-only playback.</p>
    <div class="playlist-grid" id="audioTrackGrid" aria-label="I.M.L. audio playlist">
      ${tracks.map((track, index) => `
        <button type="button" class="playlist-card audio-track" data-audio-index="${index}">
          <span class="playlist-thumb audio-thumb"></span>
          <span class="playlist-copy"><strong>${escapeHtml(track.title)}</strong><small>${audioType(track.file)}</small></span>
        </button>
      `).join("")}
    </div>
  `;

  const audio = shell.querySelector("#audioPlayer");
  const status = shell.querySelector("#audioStatus");
  const grid = shell.querySelector("#audioTrackGrid");
  let currentTrack = null;

  function setEnergy(playing) {
    document.body.classList.toggle("video-active", playing);
    dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing } }));
  }

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-audio-index]");
    if (!button) return;
    const track = tracks[Number(button.dataset.audioIndex)];
    currentTrack = track;
    grid.querySelectorAll(".audio-track").forEach(item => item.classList.toggle("active", item === button));
    audio.src = audioSrc(track.file);
    status.textContent = `Loading: ${track.title}`;
    audio.play().then(() => {
      status.textContent = `Now playing: ${track.title}`;
    }).catch(() => {
      status.textContent = `Tap play to start: ${track.title}`;
    });
    dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.5, 420) } }));
  });

  audio.addEventListener("play", () => setEnergy(true));
  audio.addEventListener("pause", () => setEnergy(false));
  audio.addEventListener("ended", () => setEnergy(false));
  audio.addEventListener("error", () => {
    setEnergy(false);
    if (currentTrack) {
      status.textContent = `${currentTrack.title} is in the playlist, but the audio file still needs to be uploaded to the site's audio folder.`;
    }
  });
})();
