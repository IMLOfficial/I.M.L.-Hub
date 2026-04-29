(() => {
  function ensureCleanupStyles() {
    if (document.getElementById("imlPromoCleanupStyles")) return;
    const style = document.createElement("style");
    style.id = "imlPromoCleanupStyles";
    style.textContent = `
      .mobile-music-nav{grid-template-columns:repeat(4,1fr)!important}
    `;
    document.head.appendChild(style);
  }

  function removePromos() {
    document.querySelectorAll("#promoMotionBg,#promoAdLeft,#promoAdRight,#promoAdStrip").forEach(element => element.remove());
    document.querySelectorAll('a[href="#promoAdStrip"],[data-mobile-section="promoAdStrip"]').forEach(element => element.remove());
    document.body.classList.remove("has-promo-ads", "has-motion-promos");
    ensureCleanupStyles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removePromos, { once: true });
  } else {
    removePromos();
  }

  new MutationObserver(removePromos).observe(document.documentElement, { childList: true, subtree: true });
})();
