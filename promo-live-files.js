(() => {
  const MISSING_AUDIO_TITLES = [
    "Analog Hearts - I.M.L.",
    "Anker und Licht - I.M.L.",
    "Beautiful Madness - I.M.L.",
    "Burnt Rubber & Chrome Dreams - I.M.L.",
    "Das Buch Unserer Zeit (2026)"
  ];

  function isMobileView() {
    return matchMedia("(max-width:899px), (pointer:coarse)").matches;
  }

  function removeVibeChooser() {
    document.getElementById("moodControls")?.closest(".hub-panel")?.remove();
  }

  function tidyAudioRows() {
    const grid = document.getElementById("audioTrackGrid");
    if (!grid) return;

    grid.querySelectorAll(".audio-track").forEach(card => {
      const title = card.querySelector(".playlist-copy strong")?.textContent.trim();
      if (MISSING_AUDIO_TITLES.includes(title)) card.remove();
    });

    const tracks = [...grid.querySelectorAll(".audio-track")];
    tracks.forEach((card, index) => {
      const number = card.querySelector(".track-number");
      if (number) number.textContent = String(index + 1);
    });

    document.querySelectorAll("#audioLibrary .playlist-count").forEach(count => {
      count.textContent = `${tracks.length} songs`;
    });

    const status = document.getElementById("audioStatus");
    if (status && MISSING_AUDIO_TITLES.some(title => status.textContent.includes(title))) {
      status.textContent = "Choose a song to start audio-only playback.";
    }
  }

  function tidyMobileActions() {
    if (!isMobileView()) return;
    document.querySelectorAll("#audioLibrary .ytm-row-action,#audioLibrary .track-action").forEach(node => node.remove());
  }

  function runCleanup() {
    removeVibeChooser();
    tidyAudioRows();
    tidyMobileActions();
  }

  function boot() {
    runCleanup();
    const observer = new MutationObserver(runCleanup);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 18000);
    addEventListener("resize", runCleanup, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
