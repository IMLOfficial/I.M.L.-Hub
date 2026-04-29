(() => {
  function removeVibeChooser() {
    document.getElementById("moodControls")?.closest(".hub-panel")?.remove();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeVibeChooser, { once: true });
  } else {
    removeVibeChooser();
  }
})();
