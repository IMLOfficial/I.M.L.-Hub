const bg = document.getElementById("bg");
const ctx = bg.getContext("2d");
let w = innerWidth, h = innerHeight, dpr = 1;
let particles = [], panels = [], streaks = [], trails = [];
let moodIndex = 0, moodPulse = 0, videoEnergy = 0;
const mouse = { x: w / 2, y: h / 2, active: false, pulse: 0 };
const palettes = [
  ["#25d9ff", "#725dff", "#ff4fd8"],
  ["#44fff0", "#2a7cff", "#071d3a"],
  ["#ff7adf", "#6d8cff", "#1a1140"],
  ["#78e8ff", "#1749ff", "#070a18"]
];

addEventListener("iml:mood", event => {
  moodIndex = Math.max(0, Math.min(palettes.length - 1, Number(event.detail?.mood || 0)));
  moodPulse = 1;
  burst(10);
  panels = Array.from({ length: 8 }, (_, i) => makePanel(i));
});

addEventListener("iml:video-state", event => {
  const playing = Boolean(event.detail?.playing);
  videoEnergy = playing ? 1 : 0.18;
  if (playing) burst(14);
});

function burst(count) {
  for (let i = 0; i < count; i++) streaks.push(makeStreak());
}

function resizeBackground() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  w = innerWidth;
  h = innerHeight;
  bg.width = Math.floor(w * dpr);
  bg.height = Math.floor(h * dpr);
  bg.style.width = w + "px";
  bg.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(240, Math.max(120, Math.floor((w * h) / 9000))) }, makeParticle);
  panels = Array.from({ length: 8 }, (_, i) => makePanel(i));
}

function makeParticle() {
  const speed = Math.random() * 0.7 + 0.14;
  return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed, r: Math.random() * 3 + 0.8, hue: 185 + moodIndex * 18 + Math.random() * 90, drift: Math.random() * Math.PI * 2 };
}

function makePanel(i) {
  const side = i % 2 === 0 ? -1 : 1;
  return { x: Math.random() * w, y: 90 + Math.random() * h * 0.72, width: 190 + Math.random() * 180, height: 90 + Math.random() * 110, vx: side * (0.16 + Math.random() * 0.28), vy: (Math.random() - 0.5) * 0.14, phase: Math.random() * Math.PI * 2, palette: palettes[(i + moodIndex) % palettes.length] };
}

function makeStreak() {
  return { x: Math.random() * w, y: 60 + Math.random() * h * 0.68, vx: 8 + Math.random() * 8, vy: 2 + Math.random() * 3, life: 0, max: 42 + Math.random() * 48, hue: 185 + moodIndex * 24 + Math.random() * 90 };
}

function pointerMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
  mouse.pulse = 1;
  trails.push({ x: mouse.x, y: mouse.y, life: 1, hue: 185 + moodIndex * 24 + Math.random() * 70 });
  if (trails.length > 26) trails.shift();
}
addEventListener("resize", resizeBackground);
addEventListener("pointermove", pointerMove);
addEventListener("pointerdown", pointerMove);
addEventListener("pointerleave", () => { mouse.active = false; });
resizeBackground();

function roundRect(x, y, width, height, radius) {
  ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.quadraticCurveTo(x + width, y, x + width, y + radius); ctx.lineTo(x + width, y + height - radius); ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); ctx.lineTo(x + radius, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - radius); ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath();
}

function drawBackdrop(time) {
  const p = palettes[moodIndex];
  const beat = 1 + videoEnergy * (0.18 + Math.sin(time * 0.006) * 0.08);
  const sweepX = (Math.sin(time * 0.00024) + 1) * w * 0.5;
  const sweepY = (Math.cos(time * 0.00018) + 1) * h * 0.5;
  const glow = ctx.createRadialGradient(sweepX, sweepY, 0, sweepX, sweepY, Math.max(w, h) * (0.85 + moodPulse * 0.08 + videoEnergy * 0.08));
  glow.addColorStop(0, p[0] + Math.floor(76 * beat).toString(16).padStart(2, "0"));
  glow.addColorStop(0.34, p[1] + "34");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  const horizon = ctx.createLinearGradient(0, h * 0.08, w, h * 0.86);
  horizon.addColorStop(0, p[0] + "28"); horizon.addColorStop(0.45, p[1] + "22"); horizon.addColorStop(1, p[2] + "28");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, w, h);
}

function drawPanels(time) {
  ctx.save(); ctx.globalCompositeOperation = "screen";
  for (const p of panels) {
    p.x += p.vx * (1 + videoEnergy * 1.8); p.y += Math.sin(time * 0.0008 + p.phase) * 0.1 + p.vy;
    if (p.vx > 0 && p.x > w + 100) p.x = -p.width - 100;
    if (p.vx < 0 && p.x < -p.width - 100) p.x = w + 100;
    const lift = Math.sin(time * 0.001 + p.phase) * (16 + videoEnergy * 14);
    const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y + p.height);
    grad.addColorStop(0, p.palette[0] + "77"); grad.addColorStop(0.52, p.palette[1] + "44"); grad.addColorStop(1, p.palette[2] + "48");
    ctx.shadowColor = p.palette[0] + "cc"; ctx.shadowBlur = 26 + moodPulse * 16 + videoEnergy * 22; ctx.fillStyle = grad;
    roundRect(p.x, p.y + lift, p.width, p.height, 14); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(122,222,255,.3)"; ctx.lineWidth = 1; roundRect(p.x, p.y + lift, p.width, p.height, 14); ctx.stroke();
  }
  ctx.restore();
}

function drawWaveRibbons(time) {
  const p = palettes[moodIndex];
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  const ribbons = [{ y: 0.26, amp: 58, width: 6, color: p[0] + "aa", speed: 0.0014 }, { y: 0.44, amp: 68, width: 8, color: p[1] + "88", speed: 0.0011 }, { y: 0.64, amp: 48, width: 5, color: p[2] + "66", speed: 0.0017 }];
  for (const r of ribbons) {
    ctx.beginPath();
    for (let x = -60; x <= w + 60; x += 16) {
      const y = h * r.y + Math.sin(x * 0.008 + time * r.speed) * (r.amp + videoEnergy * 28) + Math.sin(x * 0.024 - time * 0.0011) * r.amp * 0.42;
      if (x === -60) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = r.color; ctx.lineWidth = r.width + moodPulse * 2 + videoEnergy * 2; ctx.shadowColor = r.color; ctx.shadowBlur = 30 + moodPulse * 18 + videoEnergy * 24; ctx.stroke();
  }
  ctx.restore();
}

function drawEqualizer(time) {
  const bars = 84, base = h - 12, barW = w / bars, p = palettes[moodIndex];
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < bars; i++) {
    const beat = (Math.sin(time * (0.0045 + videoEnergy * 0.004) + i * 0.63) + 1) * 0.5;
    const wobble = (Math.sin(time * 0.0014 + i * 0.21) + 1) * 0.5;
    const height = (22 + beat * (72 + videoEnergy * 72) + wobble * 52 + moodPulse * 35) * (i % 6 === 0 ? 1.36 : 1);
    const x = i * barW + barW * 0.25;
    const grad = ctx.createLinearGradient(0, base - height, 0, base);
    grad.addColorStop(0, p[0] + "ee"); grad.addColorStop(0.45, p[1] + "88"); grad.addColorStop(1, p[2] + "00"); ctx.fillStyle = grad; ctx.fillRect(x, base - height, barW * 0.46, height);
  }
  ctx.restore();
}

function drawStreaks() {
  if (Math.random() < 0.026 + videoEnergy * 0.04 && streaks.length < 12) streaks.push(makeStreak());
  ctx.save(); ctx.globalCompositeOperation = "lighter"; streaks = streaks.filter(s => s.life < s.max);
  for (const s of streaks) { s.life++; s.x += s.vx * (1 + videoEnergy * 0.7); s.y += s.vy; const alpha = 1 - s.life / s.max; const tail = 120 + videoEnergy * 80; const grad = ctx.createLinearGradient(s.x, s.y, s.x - tail, s.y - tail * 0.35); grad.addColorStop(0, `hsla(${s.hue},100%,74%,${alpha})`); grad.addColorStop(1, `hsla(${s.hue},100%,74%,0)`); ctx.strokeStyle = grad; ctx.lineWidth = 2.4 + videoEnergy; ctx.shadowColor = `hsla(${s.hue},100%,74%,${alpha})`; ctx.shadowBlur = 18 + videoEnergy * 18; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - tail, s.y - tail * 0.35); ctx.stroke(); }
  ctx.restore();
}

function drawLogoEnergy(time) {
  const cx = w / 2, cy = Math.min(250, Math.max(170, h * 0.24));
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 8; i++) { const radius = 112 + i * 32 + Math.sin(time * (0.0014 + videoEnergy * 0.001) + i) * (9 + moodPulse * 10 + videoEnergy * 16); const start = time * (0.00055 + videoEnergy * 0.0004) + i * 0.72; ctx.beginPath(); ctx.arc(cx, cy, radius, start, start + Math.PI * (0.78 + i * 0.055)); ctx.strokeStyle = `rgba(${80 + i * 13},${224 - i * 5},255,${0.28 - i * 0.024 + moodPulse * 0.08 + videoEnergy * 0.08})`; ctx.lineWidth = 2 + moodPulse + videoEnergy; ctx.shadowColor = "rgba(89,217,255,.74)"; ctx.shadowBlur = 14 + moodPulse * 18 + videoEnergy * 22; ctx.stroke(); }
  ctx.restore();
}

function drawMouseGlow() {
  if (!mouse.active && mouse.pulse < 0.02 && moodPulse < 0.02 && videoEnergy < 0.02) return;
  const r = 220 + mouse.pulse * 220 + moodPulse * 120 + videoEnergy * 100;
  const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
  glow.addColorStop(0, "rgba(126,235,255,.46)"); glow.addColorStop(0.28, "rgba(128,80,255,.24)"); glow.addColorStop(1, "rgba(40,128,255,0)"); ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  trails = trails.filter(t => (t.life *= 0.88) > 0.04);
  for (const t of trails) { ctx.fillStyle = `hsla(${t.hue},100%,72%,${t.life * 0.55})`; ctx.beginPath(); ctx.arc(t.x, t.y, 10 + t.life * 18, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

function animateBackground(time = 0) {
  ctx.clearRect(0, 0, w, h); drawBackdrop(time); drawPanels(time); drawWaveRibbons(time); drawLogoEnergy(time); drawEqualizer(time); drawStreaks(); drawMouseGlow();
  for (const p of particles) { p.drift += 0.012 + videoEnergy * 0.01; const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy) || 1; if (dist < 230) { const push = (230 - dist) / 230; p.vx += (dx / dist) * push * (0.08 + videoEnergy * 0.06); p.vy += (dy / dist) * push * (0.08 + videoEnergy * 0.06); } p.vx += Math.cos(p.drift) * (0.0025 + videoEnergy * 0.002); p.vy += Math.sin(p.drift) * (0.0025 + videoEnergy * 0.002); p.vx *= 0.982; p.vy *= 0.982; p.x += p.vx; p.y += p.vy; if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20; }
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < particles.length; i++) { const a = particles[i]; for (let j = i + 1; j < particles.length; j++) { const b = particles[j]; const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy); if (dist < 125) { const nearMouse = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) / 290); ctx.strokeStyle = `rgba(103,226,255,${(1 - dist / 125) * (0.12 + nearMouse * 0.5 + videoEnergy * 0.12)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } } }
  for (const p of particles) { const boost = Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 230); ctx.fillStyle = `hsla(${p.hue},100%,${72 + boost * 20}%,${0.68 + boost * 0.32 + videoEnergy * 0.08})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + boost * 4 + videoEnergy * 0.8, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore(); mouse.pulse *= 0.94; moodPulse *= 0.94; videoEnergy *= 0.985; requestAnimationFrame(animateBackground);
}
requestAnimationFrame(animateBackground);
