(() => {
  const section = document.getElementById("videoLibrary");
  if (!section || section.dataset.ready === "true") return;
  section.dataset.ready = "true";

  const videos = [
    { id: "T3W9tOxUOEo", title: "F.O.C.U.S. - I.M.L.", published: "2026-04-25" },
    { id: "f_OG5cwJmJs", title: "Mir geht es gut - I.M.L.", published: "2026-04-15" },
    { id: "4yl1QbrUr4Y", title: "Anker und Licht - I.M.L.", published: "2026-04-10" },
    { id: "ZWuzotzt__0", title: "Ibiza Träume - I.M.L.", published: "2026-04-09" },
    { id: "g8blxSr3WiE", title: "Shadow to Sunlight - I.M.L.", published: "2026-03-22" },
    { id: "q0LXKDD5g60", title: "Tensiune și Ceață - I.M.L.", published: "2026-02-28" },
    { id: "4wUSFnuqLlo", title: "Unica mea iubire - I.M.L.", published: "2026-02-15" },
    { id: "QiHRONSHdiA", title: "My Favorite Person - I.M.L.", published: "2026-02-14" },
    { id: "kZ-qNPaL0pY", title: "The Quiet Kind - I.M.L.", published: "2026-02-14" },
    { id: "q5s0nIBq7LM", title: "The Secret Sauce - I.M.L.", published: "2026-02-14" },
    { id: "kD6qHpeUomw", title: "You Are Amazing - I.M.L.", published: "2026-02-08" },
    { id: "ZSYhsA1_yL8", title: "No Filter Needed - I.M.L.", published: "2026-01-30" },
    { id: "irbqdvb9rLY", title: "The View From Here - I.M.L.", published: "2026-01-27" },
    { id: "8YkRKiAjGO8", title: "L'Éclat et le Chaos - I.M.L.", published: "2026-01-27" },
    { id: "GHqZDmxT8Vg", title: "Flüssige Vernunft - I.M.L.", published: "2026-01-20" }
  ];

  const shell = section.querySelector(".library-shell") || section;
  const latest = videos[0];

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function thumb(id, quality = "hqdefault") {
    return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
  }

  function playlistIds(startIndex = 0) {
    return videos.slice(startIndex).concat(videos.slice(0, startIndex)).map(video => video.id);
  }

  function videoSrc(index = 0, autoplay = false) {
    const ids = playlistIds(index);
    const params = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      origin: location.origin
    });
    if (ids.length > 1) params.set("playlist", ids.slice(1).join(","));
    if (autoplay) params.set("autoplay", "1");
    return `https://www.youtube.com/embed/${ids[0]}?${params.toString()}`;
  }

  shell.innerHTML = `
    <h2>All Videos</h2>
    <p class="section-note">Play the public I.M.L. YouTube videos directly here. Tap any video below to load it in the player.</p>
    <button type="button" class="latest-video-card" data-video-index="0" aria-label="Play latest video: ${escapeHtml(latest.title)}">
      <span class="latest-video-art" style="background-image:url('${thumb(latest.id, "maxresdefault")}'),url('${thumb(latest.id)}')">
        <span>Latest Video</span>
      </span>
      <span class="latest-video-copy">
        <strong>${escapeHtml(latest.title)}</strong>
        <small>${latest.published} | Tap to play the newest upload</small>
      </span>
    </button>
    <iframe id="latestVideos" title="I.M.L. YouTube video playlist" src="${videoSrc(0)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen webkitallowfullscreen mozallowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    <div class="playlist-grid" aria-label="I.M.L. video playlist">
      ${videos.map((video, index) => `
        <button type="button" class="playlist-card${index === 0 ? " active" : ""}" data-video-index="${index}">
          <span class="playlist-thumb" style="background-image:url('${thumb(video.id)}')"></span>
          <span class="playlist-copy"><strong>${escapeHtml(video.title)}</strong><small>${video.published}</small></span>
        </button>
      `).join("")}
      <div class="playlist-card is-disabled" aria-label="Future videos">
        <span class="playlist-thumb future-thumb"></span>
        <span class="playlist-copy"><strong>Future videos</strong><small>New public uploads can be added to this playlist.</small></span>
      </div>
    </div>
  `;

  const iframe = shell.querySelector("#latestVideos");
  const buttons = [...shell.querySelectorAll("[data-video-index]")];

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.videoIndex);
      buttons.forEach(item => item.classList.toggle("active", item === button));
      iframe.src = videoSrc(index, true);
      document.body.classList.add("video-active");
      dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing: true } }));
      dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.42, 360) } }));
    });
  });
})();
