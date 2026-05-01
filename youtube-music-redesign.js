(() => {
  function cleanupYouTubeShell() {
    document.body.classList.remove("ytm-redesign");
    document.querySelectorAll("#imlYtmTopbar,#imlYtmRail,#imlYtmPlaylistProfile,.ytm-shell-topbar,.ytm-side-rail,.ytm-playlist-profile,.ytm-row-action").forEach(node => node.remove());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanupYouTubeShell, { once: true });
  } else {
    cleanupYouTubeShell();
  }

  const observer = new MutationObserver(cleanupYouTubeShell);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  setTimeout(() => observer.disconnect(), 15000);
})();
