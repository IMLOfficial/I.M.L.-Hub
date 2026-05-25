(() => {
  const settingsKey = "song2videoAudioSpectrum";
  const defaults = { enabled: true, style: "bars", position: "bottom", intensity: 82, color: "neon" };
  const palettes = {
    neon: ["#ff1f5a", "#8c6dff", "#4fd6ff"],
    blue: ["#4fd6ff", "#73f7ff", "#8c6dff"],
    fire: ["#ffcf6d", "#ff5a3d", "#ff1f5a"],
    ice: ["#ffffff", "#8ef7ff", "#4fd6ff"]
  };

  let settings = { ...defaults };
  let audioContext = null;
  let analyser = null;
  let source = null;
  let frequencyData = null;
  let waveformData = null;
  let fallbackPhase = 0;
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

  function injectStyles() {
    if ($("#audioSpectrumStyles")) return;
    const style = document.createElement("style");
    style.id = "audioSpectrumStyles";
    style.textContent = `
      .spectrum-card{border:1px solid rgba(255,255,255,.13);border-radius:18px;background:linear-gradient(135deg,rgba(79,214,255,.1),rgba(140,109,255,.08),rgba(255,255,255,.035));padding:14px;display:grid;gap:12px;box-shadow:inset 0 0 30px rgba(79,214,255,.05)}
      .spectrum-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.spectrum-head strong{color:#fff;font-size:1rem}.spectrum-toggle{display:inline-flex;align-items:center;gap:7px;color:#b9bbc9;font-size:.82rem;font-weight:850}.spectrum-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.spectrum-grid label{display:grid;gap:6px;color:#b9bbc9;font-size:.78rem;font-weight:850}.spectrum-grid select,.spectrum-grid input{width:100%}.spectrum-note{font-size:.78rem;color:#b9bbc9;line-height:1.35}@media(max-width:680px){.spectrum-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function createControls() {
    if ($("#audioSpectrumCard")) return;
    const agent = $("#agent") || $(".agent-card");
    if (!agent) return;

    const card = document.createElement("section");
    card.id = "audioSpectrumCard";
    card.className = "spectrum-card";
    card.innerHTML = `
      <div class="spectrum-head">
        <strong>Audio spectrum</strong>
        <label class="spectrum-toggle"><input id="spectrumEnabled" type="checkbox"> Show</label>
      </div>
      <div class="spectrum-grid">
        <label>Style
          <select id="spectrumStyle">
            <option value="bars">Bars</option>
            <option value="wave">Wave</option>
            <option value="ring">Ring</option>
          </select>
        </label>
        <label>Position
          <select id="spectrumPosition">
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
            <option value="center">Center</option>
          </select>
        </label>
        <label>Color
          <select id="spectrumColor">
            <option value="neon">Neon</option>
            <option value="blue">Blue</option>
            <option value="fire">Fire</option>
            <option value="ice">Ice</option>
          </select>
        </label>
        <label>Strength
          <input id="spectrumIntensity" type="range" min="20" max="140" value="82">
        </label>
      </div>
      <div class="spectrum-note">The spectrum is drawn onto the video canvas, so it appears in preview and WebM export.</div>
    `;

    const steps = $("#agentSteps", agent);
    if (steps) agent.insertBefore(card, steps);
    else agent.appendChild(card);

    const enabled = $("#spectrumEnabled", card);
    const style = $("#spectrumStyle", card);
    const position = $("#spectrumPosition", card);
    const color = $("#spectrumColor", card);
    const intensity = $("#spectrumIntensity", card);

    enabled.checked = Boolean(settings.enabled);
    style.value = settings.style;
    position.value = settings.position;
    color.value = settings.color;
    intensity.value = settings.intensity;

    enabled.addEventListener("change", () => { settings.enabled = enabled.checked; saveSettings(); });
    style.addEventListener("change", () => { settings.style = style.value; saveSettings(); });
    position.addEventListener("change", () => { settings.position = position.value; saveSettings(); });
    color.addEventListener("change", () => { settings.color = color.value; saveSettings(); });
    intensity.addEventListener("input", () => { settings.intensity = Number(intensity.value); saveSettings(); });
  }

  async function ensureAnalyser() {
    if (analyser) return analyser;
    const audio = $("#audio");
    if (!audio) return null;
    const capture = audio.captureStream || audio.mozCaptureStream;
    if (!capture) return null;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    audioContext = audioContext || new AudioCtx();
    if (audioContext.state === "suspended") {
      await audioContext.resume().catch(() => undefined);
    }

    try {
      const stream = capture.call(audio);
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.76;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      waveformData = new Uint8Array(analyser.fftSize);
      source.connect(analyser);
      return analyser;
    } catch {
      analyser = null;
      return null;
    }
  }

  function updateData(time) {
    if (analyser && frequencyData && waveformData) {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(waveformData);
      return;
    }

    fallbackPhase += 0.05;
    if (!frequencyData) frequencyData = new Uint8Array(512);
    if (!waveformData) waveformData = new Uint8Array(1024);
    for (let i = 0; i < frequencyData.length; i += 1) {
      const pulse = Math.sin(i * 0.13 + fallbackPhase) * 0.5 + 0.5;
      const sweep = Math.sin(time * 0.0015 + i * 0.035) * 0.5 + 0.5;
      frequencyData[i] = 18 + Math.round((pulse * 80 + sweep * 60) * (i < 90 ? 1 : 0.55));
    }
    for (let i = 0; i < waveformData.length; i += 1) {
      waveformData[i] = 128 + Math.round(Math.sin(i * 0.04 + fallbackPhase * 2) * 42);
    }
  }

  function alpha(hex, amount) {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${amount})`;
  }

  function getCanvasSize(canvas) {
    const rect = canvas.getBoundingClientRect();
    return { width: rect.width, height: rect.width * 9 / 16 };
  }

  function avgEnergy() {
    if (!frequencyData) return 0;
    let sum = 0;
    const count = Math.min(120, frequencyData.length);
    for (let i = 0; i < count; i += 1) sum += frequencyData[i];
    return sum / Math.max(1, count) / 255;
  }

  function drawBars(ctx, width, height, colors, power) {
    const bars = 64;
    const gap = Math.max(2, width * 0.0025);
    const usable = width * 0.82;
    const barWidth = (usable - gap * (bars - 1)) / bars;
    const startX = (width - usable) / 2;
    const baseY = settings.position === "top" ? height * 0.17 : settings.position === "center" ? height * 0.55 : height * 0.87;
    const direction = settings.position === "top" ? 1 : -1;
    const maxHeight = height * 0.22 * power;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < bars; i += 1) {
      const index = Math.floor(i / bars * (frequencyData.length * 0.72));
      const value = (frequencyData[index] || 0) / 255;
      const shaped = Math.pow(value, 1.35) * maxHeight + 4;
      const x = startX + i * (barWidth + gap);
      const y = direction > 0 ? baseY : baseY - shaped;
      const gradient = ctx.createLinearGradient(0, y, 0, y + shaped * direction);
      gradient.addColorStop(0, alpha(colors[0], 0.9));
      gradient.addColorStop(0.55, alpha(colors[1], 0.72));
      gradient.addColorStop(1, alpha(colors[2], 0.35));
      ctx.fillStyle = gradient;
      ctx.shadowColor = colors[i % colors.length];
      ctx.shadowBlur = 14 + value * 18;
      roundRect(ctx, x, y, Math.max(2, barWidth), shaped, Math.min(8, barWidth));
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWave(ctx, width, height, colors, power) {
    const y = settings.position === "top" ? height * 0.2 : settings.position === "center" ? height * 0.52 : height * 0.82;
    const amp = height * 0.12 * power;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = Math.max(2, width * 0.004);
    ctx.strokeStyle = alpha(colors[1], 0.88);
    ctx.shadowColor = colors[2];
    ctx.shadowBlur = 22;
    ctx.beginPath();
    for (let i = 0; i < waveformData.length; i += 5) {
      const x = i / (waveformData.length - 1) * width;
      const value = (waveformData[i] - 128) / 128;
      const curve = Math.sin(i * 0.02 + pointer.x * 2) * amp * 0.12;
      const py = y + value * amp + curve;
      if (i === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();
    ctx.lineWidth *= 0.45;
    ctx.strokeStyle = alpha(colors[0], 0.55);
    ctx.stroke();
    ctx.restore();
  }

  function drawRing(ctx, width, height, colors, power) {
    const energy = avgEnergy();
    const cx = width * (0.5 + (pointer.x - 0.5) * 0.035);
    const cy = height * (settings.position === "top" ? 0.27 : settings.position === "bottom" ? 0.68 : 0.5);
    const radius = Math.min(width, height) * (0.15 + energy * 0.04);
    const points = 96;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = colors[2];
    ctx.shadowBlur = 18;
    for (let layer = 0; layer < 3; layer += 1) {
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const dataIndex = Math.floor(i / points * frequencyData.length * 0.65);
        const value = (frequencyData[dataIndex] || 0) / 255;
        const wobble = Math.sin(angle * 6 + performance.now() * 0.002 + layer) * 6;
        const r = radius + layer * 15 + value * 54 * power + wobble;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = alpha(colors[layer], 0.8 - layer * 0.18);
      ctx.stroke();
    }
    ctx.restore();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  async function drawSpectrum(time) {
    if (!settings.enabled) return;
    const canvas = $("#videoStage");
    if (!canvas) return;
    await ensureAnalyser();
    updateData(time || 0);

    const ctx = canvas.getContext("2d");
    const { width, height } = getCanvasSize(canvas);
    if (!width || !height) return;
    const colors = palettes[settings.color] || palettes.neon;
    const power = Math.max(0.2, settings.intensity / 82);

    if (settings.style === "wave") drawWave(ctx, width, height, colors, power);
    else if (settings.style === "ring") drawRing(ctx, width, height, colors, power);
    else drawBars(ctx, width, height, colors, power);
  }

  function loop(time) {
    drawSpectrum(time || 0);
    requestAnimationFrame(loop);
  }

  function init() {
    loadSettings();
    injectStyles();
    createControls();
    const audio = $("#audio");
    if (audio) {
      audio.addEventListener("play", () => ensureAnalyser(), { passive: true });
    }
    const canvas = $("#videoStage");
    if (canvas) {
      canvas.addEventListener("pointermove", event => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = (event.clientX - rect.left) / rect.width;
        pointer.y = (event.clientY - rect.top) / rect.height;
      }, { passive: true });
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
