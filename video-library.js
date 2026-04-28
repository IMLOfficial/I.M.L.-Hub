(() => {
  const youtubeVideosUrl = "https://www.youtube.com/@I.M.L._Official/videos";
  const uploadsPlaylistId = "UUes-oJI1M7Rr6oWIofhK6fg";
  document.querySelectorAll('a[href="#videoLibrary"]').forEach(link => {
    link.href = youtubeVideosUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open YouTube";
    link.setAttribute("aria-label", "Open I.M.L. videos on YouTube");
  });

  const section = document.getElementById("videoLibrary");
  if (!section || section.dataset.ready === "true") return;
  section.dataset.ready = "true";

  const videos = [
    { id: "ljvJ4dupAaY", title: "Everything is Borrowed - I.M.L.", label: "Latest video" },
    { id: "T3W9tOxUOEo", title: "F.O.C.U.S. - I.M.L.", label: "Music video" },
    { id: "f_OG5cwJmJs", title: "Mir geht es gut - I.M.L.", label: "Music video" },
    { id: "4yl1QbrUr4Y", title: "Anker und Licht - I.M.L.", label: "Music video" },
    { id: "ZWuzotzt__0", title: "Ibiza-Träume - I.M.L.", label: "Music video" },
    { id: "g8blxSr3WiE", title: "Shadow to Sunlight - I.M.L.", label: "Music video" },
    { id: "q0LXKDD5g60", title: "Tensiune și Ceață - I.M.L.", label: "Music video" },
    { id: "4wUSFnuqLlo", title: "Unica mea iubire - I.M.L.", label: "Music video" },
    { id: "QiHRONSHdiA", title: "My Favorite Person - I.M.L.", label: "Music video" },
    { id: "kZ-qNPaL0pY", title: "The Quiet Kind - I.M.L.", label: "Music video" },
    { id: "q5s0nIBq7LM", title: "The Secret Sauce - I.M.L.", label: "Music video" },
    { id: "kD6qHpeUomw", title: "You Are Amazing - I.M.L.", label: "Music video" },
    { id: "ZSYhsA1_yL8", title: "No Filter Needed - I.M.L.", label: "Music video" },
    { id: "irbqdvb9rLY", title: "The View From Here - I.M.L.", label: "Music video" },
    { id: "8YkRKiAjGO8", title: "L’Éclat et le Chaos - I.M.L.", label: "Music video" },
    { id: "GHqZDmxT8Vg", title: "Flüssige Vernunft - I.M.L.", label: "Music video" },
    { id: "SunvIaJZrUw", title: "The Control Room - I.M.L.", label: "Music video" },
    { id: "8hm2k3WB_bU", title: "We Drive - I.M.L.", label: "Music video" },
    { id: "CjhDeku4u_c", title: "Parallel Lines (Never Apart) - I.M.L.", label: "Music video" },
    { id: "yCHU04TI-D4", title: "The Full Spectrum - I.M.L.", label: "Music video" },
    { id: "_y8V849OuR0", title: "Lotus of the Void - I.M.L.", label: "Music video" },
    { id: "oxW329BYhL4", title: "Iron Will - I.M.L.", label: "Music video" },
    { id: "knrct1LA46I", title: "Grass Stains and Golden Hours - I.M.L.", label: "Music video" },
    { id: "9iYujYr-jFQ", title: "Burnt Rubber & Chrome Dreams - I.M.L.", label: "Music video" },
    { id: "4mjqXZcKOo0", title: "Monotone - I.M.L.", label: "Music video" },
    { id: "XhfLkydAhPk", title: "The Clockwork Ghost - I.M.L.", label: "Music video" },
    { id: "1hSNHGJl1OU", title: "Ink and Echoes - I.M.L.", label: "Music video" },
    { id: "5JUOMGdwXY0", title: "The Golden Thread - I.M.L.", label: "Music video" },
    { id: "B7p5bCas5Ak", title: "Beautiful Madness - I.M.L.", label: "Music video" },
    { id: "Mohh-wCra3o", title: "Analog Hearts - I.M.L.", label: "Music video" },
    { id: "psk0zzAD_TY", title: "Neon Line - I.M.L.", label: "Music video" }
  ];

  const shell = section.querySelector(".library-shell") || section;
  const latest = videos[0];

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function thumb(id, quality = "hqdefault") {
    return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
  }

  function videoSrc(index = 0, autoplay = false) {
    const video = videos[index] || videos[0];
    const params = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      origin: location.origin
    });
    if (autoplay) params.set("autoplay", "1");
    return `https://www.youtube.com/embed/${video.id}?${params.toString()}`;
  }

  function playlistSrc(autoplay = false) {
    const params = new URLSearchParams({
      list: uploadsPlaylistId,
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      origin: location.origin
    });
    if (autoplay) params.set("autoplay", "1");
    return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
  }

  shell.innerHTML = `
    <h2>All Videos</h2>
    <p class="section-note">Play the public I.M.L. YouTube videos directly here. Tap any video below to load that exact video in the player.</p>
    <button type="button" class="latest-video-card active" data-video-index="0" aria-label="Play latest video: ${escapeHtml(latest.title)}">
      <span class="latest-video-art" style="background-image:url('${thumb(latest.id, "maxresdefault")}'),url('${thumb(latest.id)}')">
        <span>Latest Video</span>
      </span>
      <span class="latest-video-copy">
        <strong>${escapeHtml(latest.title)}</strong>
        <small>Newest upload | YouTube playlist updates automatically</small>
      </span>
    </button>
    <iframe id="latestVideos" title="I.M.L. YouTube video player" src="${playlistSrc()}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen webkitallowfullscreen mozallowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    <div class="playlist-grid" aria-label="I.M.L. video playlist">
      ${videos.map((video, index) => `
        <button type="button" class="playlist-card${index === 0 ? " active" : ""}" data-video-index="${index}">
          <span class="playlist-thumb" style="background-image:url('${thumb(video.id)}')"></span>
          <span class="playlist-copy"><strong>${escapeHtml(video.title)}</strong><small>${video.label}</small></span>
        </button>
      `).join("")}
      <div class="playlist-card is-disabled" aria-label="Future videos">
        <span class="playlist-thumb future-thumb"></span>
        <span class="playlist-copy"><strong>Future videos</strong><small>The embedded YouTube uploads playlist updates when new public videos go live.</small></span>
      </div>
    </div>
  `;

  const iframe = shell.querySelector("#latestVideos");
  const buttons = [...shell.querySelectorAll("[data-video-index]")];

  function setActive(index) {
    buttons.forEach(item => item.classList.toggle("active", Number(item.dataset.videoIndex) === index));
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.videoIndex);
      setActive(index);
      iframe.src = videoSrc(index, true);
      document.body.classList.add("video-active");
      dispatchEvent(new CustomEvent("iml:video-state", { detail: { playing: true } }));
      dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.42, 360) } }));
    });
  });
})();
