(() => {
  function cleanupMobileShell() {
    document.body.classList.remove("mobile-ytm", "player-open");
    document.querySelectorAll("#imlYtmMobileHome,#imlYtmMobilePlayer,.ytm-mobile-home,.ytm-mobile-player").forEach(node => node.remove());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanupMobileShell, { once: true });
  } else {
    cleanupMobileShell();
  }

  const observer = new MutationObserver(cleanupMobileShell);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  setTimeout(() => observer.disconnect(), 15000);
})();
