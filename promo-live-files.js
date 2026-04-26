(() => {
  const livePromos = [
    "./promo/I.M.L.%201.mp4",
    "./promo/I.M.L.%202.mp4",
    "./promo/I.M.L.%203.mp4",
    "./promo/I.M.L.%204.mp4"
  ];

  function applyLivePromoSources() {
    document.querySelectorAll(".promo-ad-card[data-promo-index]").forEach(card => {
      const index = Number(card.dataset.promoIndex);
      const src = livePromos[index];
      const video = card.querySelector("video");
      const source = card.querySelector("source");
      if (!src || !video || !source || source.dataset.liveSource === "true") return;

      source.src = src;
      source.dataset.liveSource = "true";
      card.classList.remove("is-missing");
      video.load();
      video.play().catch(() => {});
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLivePromoSources, { once: true });
  } else {
    applyLivePromoSources();
  }

  new MutationObserver(applyLivePromoSources).observe(document.documentElement, { childList: true, subtree: true });
})();
