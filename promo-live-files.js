(() => {
  function removePromos() {
    document.querySelectorAll("#promoMotionBg,#promoAdLeft,#promoAdRight,#promoAdStrip").forEach(element => element.remove());
    document.querySelectorAll('a[href="#promoAdStrip"],[data-mobile-section="promoAdStrip"]').forEach(element => element.remove());
    document.body.classList.remove("has-promo-ads", "has-motion-promos");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removePromos, { once: true });
  } else {
    removePromos();
  }
})();
