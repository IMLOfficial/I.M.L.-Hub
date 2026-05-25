(() => {
  const storageKey = "song2videoCustomLogo";
  const settingsKey = "song2videoCustomLogoSettings";
  const defaults = { position: "top-right", size: 18, opacity: 88, pulse: true };
  let settings = { ...defaults };
  let logoImage = null;
  let logoReady = false;
  let pointer = { x: 0.5, y: 0.5 };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function loadSettings() {
    try {
      settings = { ...defaults, ...JSON.parse(localStorage.getItem(settingsKey) || "{}") };
    } catch {
      settings = { ...defaults };
    }
  }

  function saveSettings() {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }

  function loadLogo(src) {
    if (!src) {
      logoImage = null;
      logoReady = false;
      return;
    }
    const image = new Image();
    image.onload = () => {
      logoImage = image;
      logoReady = true;
      document.body.classList.add("custom-logo-ready");
      const label = $("#customLogoName");
      if (label) label.textContent = "Logo loaded";
    };
    image.onerror = () => {
      logoImage = null;
      logoReady = false;
      document.body.classList.remove("custom-logo-ready");
    };
    image.src = src;
  }

  function readLogoFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      loadLogo(src);
      if (src.length < 1800000) {
        localStorage.setItem(storageKey, src);
      } else {
        localStorage.removeItem(storageKey);
      }
      const label = $("#customLogoName");
      if (label) label.textContent = file.name;
    };
    reader.readAsDataURL(file);
  }

  function injectStyles() {
    if ($("#customLogoStyles")) return;
    const style = document.createElement("style");
    style.id = "customLogoStyles";
    style.textContent = `
      .custom-logo-card{border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.035));padding:14px;display:grid;gap:12px;box-shadow:inset 0 0 28px rgba(79,214,255,.05)}
      .custom-logo-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .custom-logo-head strong{font-size:1rem;color:#fff}
      .custom-logo-name{color:#b9bbc9;font-size:.82rem;font-weight:850;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px}
      .custom-logo-picker{position:relative;min-height:54px;border:1px dashed rgba(79,214,255,.42);border-radius:16px;background:rgba(79,214,255,.07);display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;font-weight:950;cursor:pointer;overflow:hidden}
      .custom-logo-picker input{position:absolute;inset:0;opacity:0;cursor:pointer}
      .custom-logo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .custom-logo-grid label{font-size:.78rem;color:#b9bbc9;font-weight:850;display:grid;gap:6px}
      .custom-logo-grid select,.custom-logo-grid input[type=range]{width:100%}
      .custom-logo-toggle{display:flex;align-items:center;gap:8px;color:#b9bbc9;font-size:.82rem;font-weight:850}
      .custom-logo-actions{display:flex;gap:8px;flex-wrap:wrap}
      .custom-logo-actions button{min-height:36px;border:0;border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.1);color:#fff;font-weight:900;cursor:pointer}
      .custom-logo-actions button:first-child{background:linear-gradient(135deg,#ff1f5a,#4fd6ff)}
      @media(max-width:680px){.custom-logo-grid{grid-template-columns:1fr}.custom-logo-name{max-width:130px}}
    `;
    document.head.appendChild(style);
  }

  function createControls() {
    if ($("#customLogoCard")) return;
    const agentCard = $("#agent") || $(".agent-card");
    if (!agentCard) return;

    const card = document.createElement("section");
    card.id = "customLogoCard";
    card.className = "custom-logo-card";
    card.innerHTML = `
      <div class="custom-logo-head">
        <strong>Custom logo</strong>
        <span class="custom-logo-name" id="customLogoName">No logo yet</span>
      </div>
      <label class="custom-logo-picker">
        <input id="customLogoInput" type="file" accept="image/*">
        Choose logo image
      </label>
      <div class="custom-logo-grid">
        <label>Position
          <select id="customLogoPosition">
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="center">Center badge</option>
          </select>
        </label>
        <label>Size
          <input id="customLogoSize" type="range" min="8" max="42" value="18">
        </label>
        <label>Opacity
          <input id="customLogoOpacity" type="range" min="20" max="100" value="88">
        </label>
        <label class="custom-logo-toggle">
          <input id="customLogoPulse" type="checkbox" checked>
          Music pulse
        </label>
      </div>
      <div class="custom-logo-actions">
        <button id="customLogoCenter" type="button">Center</button>
        <button id="customLogoClear" type="button">Remove</button>
      </div>
    `;

    const steps = $("#agentSteps", agentCard);
    if (steps) agentCard.insertBefore(card, steps);
    else agentCard.appendChild(card);

    const input = $("#customLogoInput");
    const position = $("#customLogoPosition");
    const size = $("#customLogoSize");
    const opacity = $("#customLogoOpacity");
    const pulse = $("#customLogoPulse");

    position.value = settings.position;
    size.value = settings.size;
    opacity.value = settings.opacity;
    pulse.checked = Boolean(settings.pulse);

    input.addEventListener("change", event => readLogoFile(event.target.files[0]));
    position.addEventListener("change", () => { settings.position = position.value; saveSettings(); });
    size.addEventListener("input", () => { settings.size = Number(size.value); saveSettings(); });
    opacity.addEventListener("input", () => { settings.opacity = Number(opacity.value); saveSettings(); });
    pulse.addEventListener("change", () => { settings.pulse = pulse.checked; saveSettings(); });
    $("#customLogoCenter").addEventListener("click", () => {
      position.value = "center";
      settings.position = "center";
      saveSettings();
    });
    $("#customLogoClear").addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      logoImage = null;
      logoReady = false;
      document.body.classList.remove("custom-logo-ready");
      $("#customLogoName").textContent = "No logo yet";
      input.value = "";
    });
  }

  function getLogoRect(canvas, cssWidth, cssHeight, time) {
    const base = Math.min(cssWidth, cssHeight) * (settings.size / 100);
    const ratio = logoImage && logoImage.naturalHeight ? logoImage.naturalWidth / logoImage.naturalHeight : 1;
    const pulse = settings.pulse ? 1 + Math.sin(time * 0.004) * 0.035 : 1;
    const width = base * pulse;
    const height = width / Math.max(0.2, ratio);
    const pad = Math.max(14, Math.min(cssWidth, cssHeight) * 0.04);
    const parallaxX = (pointer.x - 0.5) * 10;
    const parallaxY = (pointer.y - 0.5) * 10;

    const positions = {
      "top-left": [pad, pad],
      "top-right": [cssWidth - width - pad, pad],
      "bottom-left": [pad, cssHeight - height - pad],
      "bottom-right": [cssWidth - width - pad, cssHeight - height - pad],
      center: [(cssWidth - width) / 2, (cssHeight - height) / 2]
    };
    const [x, y] = positions[settings.position] || positions["top-right"];
    return { x: x + parallaxX, y: y + parallaxY, width, height };
  }

  function drawLogo(time) {
    if (!logoReady || !logoImage) return;
    const canvas = $("#videoStage");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.width * 9 / 16;
    if (!cssWidth || !cssHeight) return;

    const box = getLogoRect(canvas, cssWidth, cssHeight, time);
    ctx.save();
    ctx.globalAlpha = Math.max(0.2, Math.min(1, settings.opacity / 100));
    ctx.shadowColor = "rgba(79,214,255,.75)";
    ctx.shadowBlur = 18;
    ctx.drawImage(logoImage, box.x, box.y, box.width, box.height);
    ctx.restore();
  }

  function overlayLoop(time) {
    drawLogo(time || 0);
    requestAnimationFrame(overlayLoop);
  }

  function init() {
    loadSettings();
    injectStyles();
    createControls();
    const savedLogo = localStorage.getItem(storageKey);
    if (savedLogo) loadLogo(savedLogo);
    const canvas = $("#videoStage");
    if (canvas) {
      canvas.addEventListener("pointermove", event => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = (event.clientX - rect.left) / rect.width;
        pointer.y = (event.clientY - rect.top) / rect.height;
      }, { passive: true });
    }
    requestAnimationFrame(overlayLoop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
