(() => {
  const STYLE_ID = "imlSiteFeatureStyles";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .feature-toolbar{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto auto;
        gap:10px;
        align-items:center;
        margin:16px 0;
      }
      .feature-search{
        min-height:44px;
        width:100%;
        border:1px solid rgba(255,255,255,.12);
        border-radius:999px;
        background:rgba(255,255,255,.08);
        color:#fff;
        padding:11px 16px;
        font:inherit;
        font-weight:750;
        outline:none;
      }
      .feature-search::placeholder{color:rgba(255,255,255,.58)}
      .feature-search:focus{border-color:rgba(255,255,255,.34);box-shadow:0 0 0 4px rgba(255,255,255,.08)}
      .feature-button{
        min-height:44px;
        padding:10px 16px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.12);
        background:#fff;
        color:#050505;
        font-weight:950;
        white-space:nowrap;
      }
      .feature-empty{
        display:none;
        padding:16px;
        margin:10px 0 0;
        border-radius:14px;
        background:rgba(255,255,255,.07);
        color:#cfcfcf;
        font-weight:800;
        text-align:center;
      }
      .feature-empty.visible{display:block}
      .feature-hidden{display:none!important}
      .scroll-top-button{
        position:fixed;
        right:16px;
        bottom:94px;
        z-index:7;
        min-width:46px;
        min-height:46px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(20,20,20,.9);
        color:#fff;
        font-weight:950;
        box-shadow:0 16px 42px rgba(0,0,0,.36);
        opacity:0;
        pointer-events:none;
        transform:translateY(10px);
        transition:opacity .18s ease,transform .18s ease;
      }
      .scroll-top-button.visible{
        opacity:1;
        pointer-events:auto;
        transform:translateY(0);
      }
      @media (max-width:720px){
        .feature-toolbar{grid-template-columns:1fr 1fr}
        .feature-search{grid-column:1 / -1}
        .feature-button{width:100%;padding:10px 12px}
        .scroll-top-button{right:12px;bottom:104px}
      }
    `;
    document.head.appendChild(style);
  }

  function normalize(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function removeAudioCaptions() {
    const exactText = new Set([
      "Audio-only listening, built for mobile and desktop.",
      "These tracks use the MP3 files published on this website.",
      "Audio-only listening for the I.M.L. catalog. These tracks use the MP3 files published on this website."
    ]);

    document.querySelectorAll("#audioLibrary .section-note, #audioLibrary .music-subtitle").forEach(element => {
      const text = element.textContent.trim();
      if (exactText.has(text) || text.includes("These tracks use the MP3 files published on this website.")) {
        element.remove();
      }
    });
  }

  function removeVibeChooser() {
    document.getElementById("moodControls")?.closest(".hub-panel")?.remove();
  }

  function ensureToolbar(sectionId, config) {
    const section = document.getElementById(sectionId);
    const shell = section?.querySelector(".library-shell");
    const grid = shell?.querySelector(".playlist-grid");
    if (!section || !shell || !grid || shell.dataset.featuresReady === "true") return false;
    shell.dataset.featuresReady = "true";

    const toolbar = document.createElement("div");
    toolbar.className = "feature-toolbar";
    toolbar.innerHTML = `
      <input class="feature-search" type="search" placeholder="${config.placeholder}" aria-label="${config.placeholder}">
      <button class="feature-button" type="button" data-feature-random>${config.randomLabel}</button>
      <button class="feature-button" type="button" data-feature-share>${config.shareLabel}</button>
    `;
    grid.insertAdjacentElement("beforebegin", toolbar);

    const empty = document.createElement("div");
    empty.className = "feature-empty";
    empty.textContent = config.emptyText;
    grid.insertAdjacentElement("afterend", empty);

    const search = toolbar.querySelector(".feature-search");
    const random = toolbar.querySelector("[data-feature-random]");
    const share = toolbar.querySelector("[data-feature-share]");

    function items() {
      return [...grid.querySelectorAll(config.itemSelector)];
    }

    function visibleItems() {
      return items().filter(item => !item.classList.contains("feature-hidden"));
    }

    function applyFilter() {
      const query = normalize(search.value.trim());
      let shown = 0;
      items().forEach(item => {
        const match = !query || normalize(item.textContent).includes(query);
        item.classList.toggle("feature-hidden", !match);
        if (match) shown++;
      });
      empty.classList.toggle("visible", shown === 0);
    }

    search.addEventListener("input", applyFilter);
    random.addEventListener("click", () => {
      const pool = visibleItems();
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick) return;
      pick.scrollIntoView({ behavior: "smooth", block: "center" });
      pick.click();
      dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth / 2, y: innerHeight * 0.32, power: 1.05 } }));
    });
    share.addEventListener("click", async () => {
      const url = `${location.origin}${location.pathname}#${sectionId}`;
      if (navigator.share) {
        await navigator.share({ title: config.shareTitle, url }).catch(() => {});
      } else {
        await navigator.clipboard?.writeText(url).catch(() => {});
        const original = share.textContent;
        share.textContent = "Copied";
        setTimeout(() => { share.textContent = original; }, 1400);
      }
    });

    return true;
  }

  function ensureScrollTop() {
    if (document.getElementById("scrollTopButton")) return;
    const button = document.createElement("button");
    button.id = "scrollTopButton";
    button.className = "scroll-top-button";
    button.type = "button";
    button.textContent = "Top";
    button.setAttribute("aria-label", "Back to top");
    document.body.appendChild(button);
    button.addEventListener("click", () => {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    addEventListener("scroll", () => {
      button.classList.toggle("visible", scrollY > innerHeight * 0.8);
    }, { passive: true });
  }

  function boot() {
    ensureScrollTop();
    removeVibeChooser();
    removeAudioCaptions();
    const tryDecorate = () => {
      removeVibeChooser();
      removeAudioCaptions();
      const audioReady = ensureToolbar("audioLibrary", {
        placeholder: "Search songs",
        randomLabel: "Shuffle",
        shareLabel: "Share Songs",
        emptyText: "No songs found.",
        itemSelector: ".audio-track",
        shareTitle: "I.M.L. songs"
      });
      const videoReady = ensureToolbar("videoLibrary", {
        placeholder: "Search videos",
        randomLabel: "Random Video",
        shareLabel: "Share Videos",
        emptyText: "No videos found.",
        itemSelector: "[data-video-index]",
        shareTitle: "I.M.L. videos"
      });
      return audioReady && videoReady;
    };

    if (tryDecorate()) return;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        removeVibeChooser();
        removeAudioCaptions();
        if (tryDecorate()) observer.disconnect();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 9000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
