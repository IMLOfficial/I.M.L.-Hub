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
    { id: "8YkRKiAjGO8", title: "L'Éclat et le Chaos - I.M.L.", label: "Music video" },
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

  function ensurePlaylistToggleStyles() {
    if (document.getElementById("imlPlaylistToggleStyles")) return;
    const style = document.createElement("style");
    style.id = "imlPlaylistToggleStyles";
    style.textContent = `
      .has-playlist-toggle .playlist-control-row{
        position:relative;
        z-index:4;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin:14px 0 12px;
      }
      .playlist-toggle{
        position:relative;
        z-index:5;
        display:inline-flex;
        min-height:42px;
        align-items:center;
        gap:10px;
        border:1px solid rgba(255,255,255,.16);
        border-radius:999px;
        padding:8px 16px 8px 10px;
        color:#fff;
        background:linear-gradient(135deg,rgba(255,0,51,.92),rgba(255,92,138,.72));
        box-shadow:0 12px 34px rgba(255,0,51,.22),inset 0 1px 0 rgba(255,255,255,.18);
        font:inherit;
        font-weight:950;
        cursor:pointer;
        transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease;
      }
      .playlist-toggle:hover,.playlist-toggle:focus-visible{
        transform:translateY(-1px);
        border-color:rgba(255,255,255,.32);
        box-shadow:0 16px 42px rgba(255,0,51,.3),0 0 28px rgba(77,184,255,.16);
        outline:0;
      }
      .playlist-toggle[aria-expanded="false"]{
        background:linear-gradient(135deg,rgba(16,18,24,.95),rgba(34,42,58,.88));
      }
      .playlist-toggle-icon{
        position:relative;
        width:24px;
        height:24px;
        flex:0 0 auto;
        border-radius:50%;
        background:rgba(255,255,255,.16);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);
      }
      .playlist-toggle-icon::before,.playlist-toggle-icon::after{
        content:"";
        position:absolute;
        left:50%;
        top:50%;
        width:12px;
        height:2px;
        border-radius:999px;
        background:#fff;
        transform:translate(-50%,-50%);
        transition:transform .18s ease,opacity .18s ease;
      }
      .playlist-toggle-icon::after{
        transform:translate(-50%,-50%) rotate(90deg);
      }
      .playlist-toggle[aria-expanded="true"] .playlist-toggle-icon::after{
        opacity:0;
        transform:translate(-50%,-50%) rotate(90deg) scaleX(.2);
      }
      .playlist-count{
        color:rgba(255,255,255,.66);
        font-size:.86rem;
        font-weight:900;
        white-space:nowrap;
      }
      .playlist-grid[hidden]{display:none!important}
      .has-playlist-toggle .playlist-grid:not([hidden]){
        animation:playlistReveal .28s ease both;
      }
      @keyframes playlistReveal{
        from{opacity:0;transform:translateY(-8px)}
        to{opacity:1;transform:translateY(0)}
      }
      @media (max-width:640px){
        .has-playlist-toggle .playlist-control-row{
          align-items:stretch;
          flex-direction:column;
        }
        .playlist-toggle{
          width:100%;
          justify-content:center;
        }
        .playlist-count{
          text-align:center;
        }
      }
    `;
    document.head.appendChild(style);
  }

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

  ensurePlaylistToggleStyles();
  shell.classList.add("has-playlist-toggle");

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
    <div class="playlist-control-row">
      <button type="button" class="playlist-toggle" id="videoPlaylistToggle" aria-expanded="true" aria-controls="videoPlaylistGrid">
        <span class="playlist-toggle-icon" aria-hidden="true"></span>
        <span class="playlist-toggle-label">Hide Video Playlist</span>
      </button>
      <span class="playlist-count">${videos.length} videos</span>
    </div>
    <div class="playlist-grid" id="videoPlaylistGrid" aria-label="I.M.L. video playlist">
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
  const playlistToggle = shell.querySelector("#videoPlaylistToggle");
  const playlistGrid = shell.querySelector("#videoPlaylistGrid");
  const playlistStateKey = "iml-video-playlist-open";

  function readPlaylistState() {
    try {
      return localStorage.getItem(playlistStateKey);
    } catch (_) {
      return null;
    }
  }

  function writePlaylistState(value) {
    try {
      localStorage.setItem(playlistStateKey, value);
    } catch (_) {
      // The button still works when the browser blocks storage.
    }
  }

  function setActive(index) {
    buttons.forEach(item => item.classList.toggle("active", Number(item.dataset.videoIndex) === index));
  }

  function setPlaylistOpen(open, remember = true) {
    playlistGrid.hidden = !open;
    playlistGrid.setAttribute("aria-hidden", String(!open));
    playlistToggle.setAttribute("aria-expanded", String(open));
    playlistToggle.querySelector(".playlist-toggle-label").textContent = open ? "Hide Video Playlist" : "Show Video Playlist";
    shell.classList.toggle("is-playlist-collapsed", !open);
    if (remember) writePlaylistState(open ? "open" : "closed");
    dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.42, 360), power: open ? 0.55 : 0.35 } }));
  }

  playlistToggle.addEventListener("click", () => {
    setPlaylistOpen(playlistToggle.getAttribute("aria-expanded") !== "true");
  });

  setPlaylistOpen(readPlaylistState() !== "closed", false);

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
