(() => {
  const STYLE_ID = "imlPlaylistToggleStyles";
  let observer = null;
  let stopTimer = 0;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .has-playlist-toggle .playlist-control-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin:14px 0 12px;
      }
      .playlist-toggle{
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

  function readSaved(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function writeSaved(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      // The toggle still works when private browsing blocks storage.
    }
  }

  function addToggle({ sectionId, gridSelector, storageKey, openText, closedText, countLabel }) {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    const shell = section.querySelector(".library-shell") || section;
    const grid = shell.querySelector(gridSelector);
    if (!grid) return false;

    if (!grid.id) grid.id = `${sectionId}PlaylistGrid`;
    if (shell.querySelector(`.playlist-toggle[aria-controls="${grid.id}"]`)) return true;

    ensureStyles();
    shell.classList.add("has-playlist-toggle");

    const row = document.createElement("div");
    row.className = "playlist-control-row";
    const count = grid.querySelectorAll(".playlist-card:not(.is-disabled)").length;
    row.innerHTML = `
      <button type="button" class="playlist-toggle" aria-expanded="true" aria-controls="${grid.id}">
        <span class="playlist-toggle-icon" aria-hidden="true"></span>
        <span class="playlist-toggle-label">${openText}</span>
      </button>
      <span class="playlist-count">${count} ${countLabel}</span>
    `;
    grid.insertAdjacentElement("beforebegin", row);

    const button = row.querySelector(".playlist-toggle");
    const label = row.querySelector(".playlist-toggle-label");

    function setOpen(open, remember = true) {
      grid.hidden = !open;
      grid.setAttribute("aria-hidden", String(!open));
      button.setAttribute("aria-expanded", String(open));
      label.textContent = open ? openText : closedText;
      shell.classList.toggle("is-playlist-collapsed", !open);
      if (remember) writeSaved(storageKey, open ? "open" : "closed");
      dispatchEvent(new CustomEvent("iml:boost", {
        detail: { x: innerWidth / 2, y: Math.min(innerHeight * 0.48, 420), power: open ? 0.55 : 0.35 }
      }));
    }

    button.addEventListener("click", () => {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });

    setOpen(readSaved(storageKey) !== "closed", false);
    return true;
  }

  function init() {
    const videoReady = addToggle({
      sectionId: "videoLibrary",
      gridSelector: "#videoPlaylistGrid, .playlist-grid",
      storageKey: "iml-video-playlist-open",
      openText: "Hide Video Playlist",
      closedText: "Show Video Playlist",
      countLabel: "videos"
    });
    const audioReady = addToggle({
      sectionId: "audioLibrary",
      gridSelector: "#audioTrackGrid, .playlist-grid",
      storageKey: "iml-audio-playlist-open",
      openText: "Hide Audio Playlist",
      closedText: "Show Audio Playlist",
      countLabel: "songs"
    });

    if (videoReady && audioReady && observer) {
      observer.disconnect();
      observer = null;
      clearTimeout(stopTimer);
    }
  }

  function start() {
    init();
    observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
    stopTimer = setTimeout(() => {
      if (observer) observer.disconnect();
      observer = null;
    }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
