const bg = document.getElementById("bg");
const ctx = bg.getContext("2d");
let w = innerWidth;
let h = innerHeight;
let dpr = 1;
let particles = [];
let panels = [];
let streaks = [];
let moodIndex = 0;
let moodPulse = 0;
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
  for (let i = 0; i < 8; i++) streaks.push(makeStreak());
  panels = Array.from({ length: 7 }, (_, i) => makePanel(i));
});

function resizeBackground() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  w = innerWidth;
  h = innerHeight;
  bg.width = Math.floor(w * dpr);
  bg.height = Math.floor(h * dpr);
  bg.style.width = w + "px";
  bg.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(220, Math.max(110, Math.floor((w * h) / 9500))) }, makeParticle);
  panels = Array.from({ length: 7 }, (_, i) => makePanel(i));
}

function makeParticle() {
  const speed = Math.random() * 0.55 + 0.12;
  return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed, r: Math.random() * 2.9 + 0.8, hue: 185 + moodIndex * 18 + Math.random() * 85, drift: Math.random() * Math.PI * 2 };
}

function makePanel(i) {
  const side = i % 2 === 0 ? -1 : 1;
  return { x: Math.random() * w, y: 120 + Math.random() * h * 0.68, width: 180 + Math.random() * 160, height: 90 + Math.random() * 90, vx: side * (0.12 + Math.random() * 0.22), vy: (Math.random() - 0.5) * 0.12, phase: Math.random() * Math.PI * 2, palette: palettes[(i + moodIndex) % palettes.length] };
}

function makeStreak() {
  return { x: Math.random() * w, y: 70 + Math.random() * h * 0.62, vx: 7 + Math.random() * 6, vy: 2 + Math.random() * 2.4, life: 0, max: 45 + Math.random() * 42, hue: 185 + moodIndex * 24 + Math.random() * 80 };
}

function pointerMove(event) { mouse.x = event.clientX; mouse.y = event.clientY; mouse.active = true; mouse.pulse = 1; }
addEventListener("resize", resizeBackground);
addEventListener("pointermove", pointerMove);
addEventListener("pointerdown", pointerMove);
addEventListener("pointerleave", () => { mouse.active = false; });
resizeBackground();

function drawBackdrop(time) {
  const p = palettes[moodIndex];
  const sweepX = (Math.sin(time * 0.0002) + 1) * w * 0.5;
  const sweepY = (Math.cos(time * 0.00015) + 1) * h * 0.5;
  const glow = ctx.createRadialGradient(sweepX, sweepY, 0, sweepX, sweepY, Math.max(w, h) * (0.85 + moodPulse * 0.08));
  glow.addColorStop(0, `${p[0]}48`);
  glow.addColorStop(0.34, `${p[1]}2e`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  const horizon = ctx.createLinearGradient(0, h * 0.12, w, h * 0.78);
  horizon.addColorStop(0, `${p[0]}22`);
  horizon.addColorStop(0.45, `${p[1]}18`);
  horizon.addColorStop(1, `${p[2]}20`);
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 0, w, h);
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath(); ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.quadraticCurveTo(x + width, y, x + width, y + radius); ctx.lineTo(x + width, y + height - radius); ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); ctx.lineTo(x + radius, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - radius); ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath();
}

function drawPanels(time) {
  ctx.save(); ctx.globalCompositeOperation = "screen";
  for (const p of panels) {
    p.x += p.vx; p.y += Math.sin(time * 0.0008 + p.phase) * 0.08 + p.vy;
    if (p.vx > 0 && p.x > w + 80) p.x = -p.width - 80;
    if (p.vx < 0 && p.x < -p.width - 80) p.x = w + 80;
    const lift = Math.sin(time * 0.001 + p.phase) * 16;
    const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y + p.height);
    grad.addColorStop(0, p.palette[0] + "66"); grad.addColorStop(0.52, p.palette[1] + "34"); grad.addColorStop(1, p.palette[2] + "40");
    ctx.shadowColor = p.palette[0] + "aa"; ctx.shadowBlur = 26 + moodPulse * 16; ctx.fillStyle = grad;
    roundRect(p.x, p.y + lift, p.width, p.height, 14); ctx.fill();
    ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(122,222,255,.26)"; ctx.lineWidth = 1; roundRect(p.x, p.y + lift, p.width, p.height, 14); ctx.stroke();
    for (let i = 0; i < 5; i++) { const lineY = p.y + lift + 18 + i * (p.height - 36) / 4; ctx.strokeStyle = i % 2 ? "rgba(255,90,220,.24)" : "rgba(90,224,255,.3)"; ctx.beginPath(); ctx.moveTo(p.x + 18, lineY); ctx.lineTo(p.x + p.width - 18, lineY + Math.sin(time * 0.002 + i + p.phase) * 10); ctx.stroke(); }
  }
  ctx.restore();
}

function drawWaveRibbons(time) {
  const p = palettes[moodIndex];
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  const ribbons = [{ y: 0.28, amp: 54, width: 6, color: p[0] + "88", speed: 0.0012 }, { y: 0.44, amp: 62, width: 7, color: p[1] + "66", speed: 0.001 }, { y: 0.63, amp: 44, width: 5, color: p[2] + "55", speed: 0.0014 }];
  for (const r of ribbons) { ctx.beginPath(); for (let x = -60; x <= w + 60; x += 18) { const y = h * r.y + Math.sin(x * 0.008 + time * r.speed) * r.amp + Math.sin(x * 0.024 - time * 0.0009) * r.amp * 0.38; if (x === -60) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.strokeStyle = r.color; ctx.lineWidth = r.width + moodPulse * 2; ctx.shadowColor = r.color; ctx.shadowBlur = 28 + moodPulse * 18; ctx.stroke(); }
  ctx.restore();
}

function drawEqualizer(time) {
  const bars = 78, base = h - 12, barW = w / bars, p = palettes[moodIndex];
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < bars; i++) { const beat = (Math.sin(time * 0.0045 + i * 0.63) + 1) * 0.5; const wobble = (Math.sin(time * 0.0014 + i * 0.21) + 1) * 0.5; const height = (22 + beat * 72 + wobble * 52 + moodPulse * 35) * (i % 6 === 0 ? 1.36 : 1); const x = i * barW + barW * 0.25; const grad = ctx.createLinearGradient(0, base - height, 0, base); grad.addColorStop(0, p[0] + "dd"); grad.addColorStop(0.45, p[1] + "77"); grad.addColorStop(1, p[2] + "00"); ctx.fillStyle = grad; ctx.fillRect(x, base - height, barW * 0.46, height); }
  ctx.restore();
}

function drawStreaks() {
  if (Math.random() < 0.026 && streaks.length < 8) streaks.push(makeStreak());
  ctx.save(); ctx.globalCompositeOperation = "lighter"; streaks = streaks.filter(s => s.life < s.max);
  for (const s of streaks) { s.life++; s.x += s.vx; s.y += s.vy; const alpha = 1 - s.life / s.max; const tail = 120; const grad = ctx.createLinearGradient(s.x, s.y, s.x - tail, s.y - tail * 0.35); grad.addColorStop(0, `hsla(${s.hue},100%,74%,${alpha})`); grad.addColorStop(1, `hsla(${s.hue},100%,74%,0)`); ctx.strokeStyle = grad; ctx.lineWidth = 2.4; ctx.shadowColor = `hsla(${s.hue},100%,74%,${alpha})`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - tail, s.y - tail * 0.35); ctx.stroke(); }
  ctx.restore();
}

function drawLogoEnergy(time) {
  const cx = w / 2, cy = Math.min(250, Math.max(170, h * 0.24));
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 8; i++) { const radius = 112 + i * 32 + Math.sin(time * 0.0014 + i) * (9 + moodPulse * 10); const start = time * 0.00055 + i * 0.72; ctx.beginPath(); ctx.arc(cx, cy, radius, start, start + Math.PI * (0.78 + i * 0.055)); ctx.strokeStyle = `rgba(${80 + i * 13},${224 - i * 5},255,${0.28 - i * 0.024 + moodPulse * 0.08})`; ctx.lineWidth = 2 + moodPulse; ctx.shadowColor = "rgba(89,217,255,.64)"; ctx.shadowBlur = 14 + moodPulse * 18; ctx.stroke(); }
  ctx.restore();
}

function drawMouseGlow() {
  if (!mouse.active && mouse.pulse < 0.02 && moodPulse < 0.02) return;
  const r = 210 + mouse.pulse * 170 + moodPulse * 120;
  const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
  glow.addColorStop(0, "rgba(126,235,255,.38)"); glow.addColorStop(0.33, "rgba(128,80,255,.2)"); glow.addColorStop(1, "rgba(40,128,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
}

function animateBackground(time = 0) {
  ctx.clearRect(0, 0, w, h); drawBackdrop(time); drawPanels(time); drawWaveRibbons(time); drawLogoEnergy(time); drawEqualizer(time); drawStreaks(); drawMouseGlow();
  for (const p of particles) { p.drift += 0.012; const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy) || 1; if (dist < 190) { const push = (190 - dist) / 190; p.vx += (dx / dist) * push * 0.07; p.vy += (dy / dist) * push * 0.07; } p.vx += Math.cos(p.drift) * 0.0025; p.vy += Math.sin(p.drift) * 0.0025; p.vx *= 0.984; p.vy *= 0.984; p.x += p.vx; p.y += p.vy; if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20; }
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < particles.length; i++) { const a = particles[i]; for (let j = i + 1; j < particles.length; j++) { const b = particles[j]; const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy); if (dist < 118) { const nearMouse = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) / 260); ctx.strokeStyle = `rgba(103,226,255,${(1 - dist / 118) * (0.11 + nearMouse * 0.4)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } } }
  for (const p of particles) { const boost = Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / 205); ctx.fillStyle = `hsla(${p.hue},100%,${72 + boost * 18}%,${0.68 + boost * 0.32})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + boost * 3.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore(); mouse.pulse *= 0.94; moodPulse *= 0.94; requestAnimationFrame(animateBackground);
}
requestAnimationFrame(animateBackground);
