(() => {
  const section = document.getElementById("audioLibrary");
  if (!section) return;

  const tracks = [
    { title: "Analog Hearts - I.M.L.", src: "./audio/analog-hearts-i-m-l.mp3" },
    { title: "Anker und Licht - I.M.L.", src: "./audio/anker-und-licht-i-m-l.mp3" },
    { title: "Beautiful Madness - I.M.L.", src: "./audio/beautiful-madness-i-m-l.mp3" },
    { title: "Burnt Rubber & Chrome Dreams - I.M.L.", src: "./audio/burnt-rubber-and-chrome-dreams-i-m-l.mp3" },
    { title: "Das Buch Unserer Zeit (2026)", src: "./audio/das-buch-unserer-zeit-2026.mp3" },
    { title: "F.O.C.U.S. - I.M.L.", src: "./audio/f-o-c-u-s-i-m-l.mp3" },
    { title: "Flüssige Vernunft - I.M.L.", src: "./audio/flussige-vernunft-i-m-l.mp3" },
    { title: "Grass Stains and Golden Hours - I.M.L.", src: "./audio/grass-stains-and-golden-hours-i-m-l.mp3" },
    { title: "Ibiza-Träume - I.M.L.", src: "./audio/ibiza-traume-i-m-l.mp3" },
    { title: "Ink and Echoes - I.M.L.", src: "./audio/ink-and-echoes-i-m-l.mp3" },
    { title: "Iron Will - I.M.L.", src: "./audio/iron-will-i-m-l.mp3" },
    { title: "L’Éclat et le Chaos - I.M.L.", src: "./audio/leclat-et-le-chaos-i-m-l.mp3" },
    { title: "Lotus of the Void - I.M.L.", src: "./audio/lotus-of-the-void-i-m-l.mp3" },
    { title: "Mir geht es gut - I.M.L.", src: "./audio/mir-geht-es-gut-i-m-l.mp3" },
    { title: "Monotone - I.M.L.", src: "./audio/monotone-i-m-l.mp3" },
    { title: "My Favorite Person - I.M.L.", src: "./audio/my-favorite-person-i-m-l.mp3" },
    { title: "Neon Line - I.M.L.", src: "./audio/neon-line-i-m-l.mp3" },
    { title: "No Filter Needed - I.M.L.", src: "./audio/no-filter-needed-i-m-l.mp3" },
    { title: "Parallel Lines (Never Apart) - I.M.L.", src: "./audio/parallel-lines-never-apart-i-m-l.mp3" },
    { title: "Shadow to Sunlight - I.M.L.", src: "./audio/shadow-to-sunlight-i-m-l.mp3" },
    { title: "Tensiune și Ceață - I.M.L.", src: "./audio/tensiune-si-ceata-i-m-l.mp3" },
    { title: "The Clockwork Ghost - I.M.L.", src: "./audio/the-clockwork-ghost-i-m-l.mp3" },
    { title: "The Control Room - I.M.L.", src: "./audio/the-control-room-i-m-l.mp3" },
    { title: "The Full Spectrum - I.M.L.", src: "./audio/the-full-spectrum-i-m-l.mp3" },
    { title: "The Golden Thread - I.M.L.", src: "./audio/the-golden-thread-i-m-l.mp3" },
    { title: "The Quiet Kind - I.M.L.", src: "./audio/the-quiet-kind-i-m-l.mp3" },
    { title: "The Secret Sauce - I.M.L.", src: "./audio/the-secret-sauce-i-m-l.mp3" },
    { title: "The View From Here - I.M.L.", src: "./audio/the-view-from-here-i-m-l.mp3" },
    { title: "Unica mea iubire - I.M.L.", src: "./audio/unica-mea-iubire-i-m-l.mp3" },
    { title: "We Drive - I.M.L.", src: "./audio/we-drive-i-m-l.mp3" },
    { title: "You Are Amazing - I.M.L.", src: "./audio/you-are-amazing-i-m-l.mp3" }
  ];

  const shell = section.querySelector(".library-shell") || section;
  shell.innerHTML = `
    <h2>Audio Playlist</h2>
    <p class="section-note">Audio-only listening for the I.M.L. catalog. Tap a track to play it directly on the page once the MP3 files are published.</p>
    <audio id="audioPlayer" class="audio-player" controls preload="metadata"></audio>
    <p id="audioStatus">Choose a track to start audio-only playback.</p>
    <div class="playlist-grid" id="audioTrackGrid" aria-label="I.M.L. audio playlist"></div>
  `;

  const audio = shell.querySelector("#audioPlayer");
  const status = shell.querySelector("#audioStatus");
  const grid = shell.querySelector("#audioTrackGrid");
  let currentTrack = null;

  function setEnergy(playing) {
    document.body.classList.toggle("video-active", playing);
    dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing } }));
  }

  function createTrackButton(track, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-card audio-track";
    button.innerHTML = `
      <span class="playlist-thumb audio-thumb"></span>
      <span class="playlist-copy"><strong></strong><small>MP3 audio</small></span>
    `;
    button.querySelector("strong").textContent = track.title;
    button.addEventListener("click", () => {
      currentTrack = track;
      grid.querySelectorAll(".audio-track").forEach(item => item.classList.toggle("active", item === button));
      audio.src = track.src;
      status.textContent = `Loading: ${track.title}`;
      audio.play().then(() => {
        status.textContent = `Now playing: ${track.title}`;
      }).catch(() => {
        status.textContent = `Tap play to start: ${track.title}`;
      });
      dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.5, 420) } }));
    });
    return button;
  }

  tracks.forEach((track, index) => grid.appendChild(createTrackButton(track, index)));

  audio.addEventListener("play", () => setEnergy(true));
  audio.addEventListener("pause", () => setEnergy(false));
  audio.addEventListener("ended", () => setEnergy(false));
  audio.addEventListener("error", () => {
    setEnergy(false);
    if (currentTrack) {
      status.textContent = `${currentTrack.title} is in the playlist, but the MP3 file still needs to be uploaded to the site.`;
    }
  });
})();
