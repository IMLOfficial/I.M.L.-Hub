(() => {
  const bg = document.getElementById("bg");
  if (!bg) return;

  const ctx = bg.getContext("2d", { alpha: true });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const palettes = [
    ["#25d9ff", "#725dff", "#ff4fd8"],
    ["#44fff0", "#2a7cff", "#071d3a"],
    ["#ff7adf", "#6d8cff", "#1a1140"],
    ["#78e8ff", "#1749ff", "#070a18"]
  ];

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let lastFrame = 0;
  let moodIndex = 0;
  let moodPulse = 0;
  let boostEnergy = 0;
  let videoPlaying = false;
  let videoLevel = 0;
  let particles = [];
  let beams = [];
  let sparks = [];
  let ripples = [];
  let trails = [];
  const pointer = { x: 0, y: 0, active: false, lastTrail: 0 };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function countParticles() {
    if (reducedMotion.matches) return coarsePointer ? 34 : 48;
    const base = Math.floor((w * h) / (coarsePointer ? 17500 : 12000));
    return clamp(base, coarsePointer ? 70 : 105, coarsePointer ? 130 : 190);
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, coarsePointer ? 1.35 : 1.75);
    w = innerWidth;
    h = innerHeight;
    pointer.x = pointer.x || w / 2;
    pointer.y = pointer.y || h / 2;
    bg.width = Math.floor(w * dpr);
    bg.height = Math.floor(h * dpr);
    bg.style.width = `${w}px`;
    bg.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: countParticles() }, makeParticle);
    beams = Array.from({ length: coarsePointer ? 5 : 8 }, makeBeam);
  }

  function makeParticle() {
    const speed = Math.random() * 0.52 + 0.08;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 2.4 + 0.7,
      hue: 186 + moodIndex * 24 + Math.random() * 80,
      spin: Math.random() * Math.PI * 2
    };
  }

  function makeBeam() {
    return {
      x: Math.random() * w,
      y: h * (0.14 + Math.random() * 0.68),
      width: 170 + Math.random() * 260,
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.22),
      tilt: -0.22 + Math.random() * 0.44,
      phase: Math.random() * Math.PI * 2,
      palette: palettes[Math.floor(Math.random() * palettes.length)]
    };
  }

  function makeSpark(x = Math.random() * w, y = Math.random() * h) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.4 + Math.random() * 5.4;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: 184 + moodIndex * 26 + Math.random() * 80
    };
  }

  function burst(x = pointer.x || w / 2, y = pointer.y || h * 0.32, count = coarsePointer ? 16 : 24) {
    for (let i = 0; i < count; i++) sparks.push(makeSpark(x, y));
    ripples.push({ x, y, radius: 0, life: 1, hue: 188 + moodIndex * 24 });
    if (sparks.length > 100) sparks.splice(0, sparks.length - 100);
  }

  function addInteractiveControls() {
    const controls = document.getElementById("moodControls");
    if (!controls) return;

    if (!document.getElementById("imlExtraControlStyles")) {
      const style = document.createElement("style");
      style.id = "imlExtraControlStyles";
      style.textContent = ".mood-controls button.utility{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.18)}.mood-controls button.utility.flash{box-shadow:0 0 28px rgba(255,79,216,.62);transform:translateY(-1px)}.energy-meter{display:grid;grid-template-columns:repeat(14,1fr);align-items:end;gap:4px;width:min(100%,340px);height:46px;margin:18px auto 0}.energy-meter span{display:block;min-height:8px;border-radius:999px;background:linear-gradient(180deg,#79efff,#725dff 55%,rgba(255,79,216,.2));box-shadow:0 0 16px rgba(77,184,255,.32);animation:meterPulse 1.4s ease-in-out infinite;animation-delay:calc(var(--i)*-.075s)}.energy-meter.boost span{animation-duration:.52s;box-shadow:0 0 22px rgba(255,79,216,.52)}@keyframes meterPulse{0%,100%{height:24%;opacity:.48}50%{height:100%;opacity:1}}@media (max-width:640px){.energy-meter{height:38px}}@media (prefers-reduced-motion:reduce){.energy-meter span{animation:none}}";
      document.head.appendChild(style);
    }

    let boostButton = document.getElementById("boostButton");
    if (!boostButton) {
      boostButton = document.createElement("button");
      boostButton.type = "button";
      boostButton.id = "boostButton";
      boostButton.className = "utility";
      boostButton.textContent = "Boost";
      controls.appendChild(boostButton);
    }

    let randomButton = document.getElementById("randomMoodButton");
    if (!randomButton) {
      randomButton = document.createElement("button");
      randomButton.type = "button";
      randomButton.id = "randomMoodButton";
      randomButton.className = "utility";
      randomButton.textContent = "Surprise";
      controls.appendChild(randomButton);
    }

    let meter = document.getElementById("energyMeter");
    if (!meter) {
      meter = document.createElement("div");
      meter.id = "energyMeter";
      meter.className = "energy-meter";
      meter.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 14; i++) {
        const bar = document.createElement("span");
        bar.style.setProperty("--i", i);
        meter.appendChild(bar);
      }
      controls.insertAdjacentElement("afterend", meter);
    }

    function triggerBoost() {
      boostButton.classList.add("flash");
      meter.classList.add("boost");
      boostEnergy = 1;
      moodPulse = 1;
      burst(w / 2, Math.min(h * 0.38, 320), coarsePointer ? 22 : 34);
      setTimeout(() => {
        boostButton.classList.remove("flash");
        meter.classList.remove("boost");
      }, 700);
    }

    boostButton.addEventListener("click", triggerBoost);
    randomButton.addEventListener("click", () => {
      const moodButtons = [...controls.querySelectorAll("[data-mood]")];
      if (moodButtons.length) {
        const active = moodButtons.findIndex(button => button.classList.contains("active"));
        const next = moodButtons[(active + 1 + Math.floor(Math.random() * Math.max(1, moodButtons.length - 1))) % moodButtons.length];
        next.click();
      }
      triggerBoost();
    });
  }

  addEventListener("iml:mood", event => {
    moodIndex = clamp(Number(event.detail?.mood || 0), 0, palettes.length - 1);
    moodPulse = 1;
    beams = Array.from({ length: coarsePointer ? 5 : 8 }, makeBeam);
    burst(pointer.x || w / 2, pointer.y || h * 0.3, coarsePointer ? 12 : 18);
  });

  addEventListener("iml:boost", event => {
    const detail = event.detail || {};
    boostEnergy = 1;
    moodPulse = 1;
    burst(detail.x || pointer.x || w / 2, detail.y || pointer.y || h * 0.35, coarsePointer ? 22 : 34);
  });

  addEventListener("iml:video-state", event => {
    videoPlaying = Boolean(event.detail?.playing);
    if (videoPlaying) {
      boostEnergy = 0.8;
      burst(w / 2, Math.min(280, h * 0.32), coarsePointer ? 18 : 28);
    }
  });

  function movePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    const now = performance.now();
    if (now - pointer.lastTrail > (coarsePointer ? 48 : 28)) {
      pointer.lastTrail = now;
      trails.push({ x: pointer.x, y: pointer.y, life: 1, hue: 185 + moodIndex * 24 + Math.random() * 60 });
      if (trails.length > 20) trails.shift();
    }
  }

  addEventListener("pointermove", movePointer, { passive: true });
  addEventListener("pointerdown", event => {
    movePointer(event);
    boostEnergy = Math.max(boostEnergy, 0.58);
    burst(pointer.x, pointer.y, coarsePointer ? 10 : 16);
  }, { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });

  let resizeRaf = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  }, { passive: true });

  function drawBackground(time) {
    const palette = palettes[moodIndex];
    const cx = w * (0.5 + Math.sin(time * 0.00018) * 0.18);
    const cy = h * (0.22 + Math.cos(time * 0.00022) * 0.14);
    const radius = Math.max(w, h) * (0.86 + videoLevel * 0.08 + boostEnergy * 0.1);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    glow.addColorStop(0, `${palette[0]}66`);
    glow.addColorStop(0.36, `${palette[1]}32`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const sweep = ctx.createLinearGradient(0, h * 0.08, w, h * 0.9);
    sweep.addColorStop(0, `${palette[0]}1f`);
    sweep.addColorStop(0.5, `${palette[1]}24`);
    sweep.addColorStop(1, `${palette[2]}22`);
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, w, h);
  }

  function drawBeams(time) {
    const power = 1 + videoLevel * 1.6 + boostEnergy * 1.4;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (const beam of beams) {
      beam.x += beam.speed * power;
      if (beam.speed > 0 && beam.x > w + beam.width) beam.x = -beam.width;
      if (beam.speed < 0 && beam.x < -beam.width) beam.x = w + beam.width;
      const y = beam.y + Math.sin(time * 0.001 + beam.phase) * (24 + videoLevel * 18);
      const grad = ctx.createLinearGradient(beam.x, y, beam.x + beam.width, y + beam.width * beam.tilt);
      grad.addColorStop(0, `${beam.palette[0]}00`);
      grad.addColorStop(0.5, `${beam.palette[1]}74`);
      grad.addColorStop(1, `${beam.palette[2]}00`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 34 + boostEnergy * 22 + videoLevel * 16;
      ctx.shadowColor = `${beam.palette[0]}bb`;
      ctx.shadowBlur = 20 + boostEnergy * 22;
      ctx.beginPath();
      ctx.moveTo(beam.x, y);
      ctx.lineTo(beam.x + beam.width, y + beam.width * beam.tilt);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRibbons(time) {
    const palette = palettes[moodIndex];
    const lines = coarsePointer ? 2 : 3;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let row = 0; row < lines; row++) {
      const baseY = h * (0.28 + row * 0.18);
      ctx.beginPath();
      for (let x = -40; x <= w + 40; x += 18) {
        const wave = Math.sin(x * 0.009 + time * (0.0012 + row * 0.0002)) * (38 + videoLevel * 34 + boostEnergy * 24);
        const fine = Math.sin(x * 0.028 - time * 0.0011) * 18;
        if (x === -40) ctx.moveTo(x, baseY + wave + fine);
        else ctx.lineTo(x, baseY + wave + fine);
      }
      ctx.strokeStyle = `${palette[row]}88`;
      ctx.lineWidth = 4 + row * 1.5 + videoLevel * 2 + boostEnergy * 2;
      ctx.shadowColor = `${palette[row]}cc`;
      ctx.shadowBlur = 18 + videoLevel * 24 + boostEnergy * 26;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEqualizer(time) {
    const palette = palettes[moodIndex];
    const bars = coarsePointer ? 48 : 76;
    const width = w / bars;
    const base = h - 8;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < bars; i++) {
      const beat = (Math.sin(time * (0.004 + videoLevel * 0.004) + i * 0.58) + 1) * 0.5;
      const height = 18 + beat * (44 + videoLevel * 76 + boostEnergy * 48);
      const grad = ctx.createLinearGradient(0, base - height, 0, base);
      grad.addColorStop(0, `${palette[0]}dd`);
      grad.addColorStop(0.55, `${palette[1]}77`);
      grad.addColorStop(1, `${palette[2]}00`);
      ctx.fillStyle = grad;
      ctx.fillRect(i * width + width * 0.28, base - height, Math.max(2, width * 0.42), height);
    }
    ctx.restore();
  }

  function drawLogoHalo(time) {
    const cx = w / 2;
    const cy = Math.min(250, Math.max(160, h * 0.24));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < (coarsePointer ? 5 : 7); i++) {
      const radius = 102 + i * 30 + Math.sin(time * 0.0013 + i) * (7 + videoLevel * 15 + boostEnergy * 12);
      const start = time * (0.00055 + videoLevel * 0.0003) + i * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, start, start + Math.PI * (0.72 + i * 0.05));
      ctx.strokeStyle = `rgba(${76 + i * 18},${220 - i * 4},255,${0.25 - i * 0.018 + videoLevel * 0.08 + boostEnergy * 0.08})`;
      ctx.lineWidth = 2 + videoLevel + boostEnergy;
      ctx.shadowColor = "rgba(89,217,255,.75)";
      ctx.shadowBlur = 12 + videoLevel * 24 + boostEnergy * 20;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPointerGlow() {
    if (!pointer.active && boostEnergy < 0.03 && trails.length === 0) return;
    const radius = 190 + boostEnergy * 190 + videoLevel * 80;
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    glow.addColorStop(0, "rgba(126,235,255,.4)");
    glow.addColorStop(0.34, "rgba(128,80,255,.22)");
    glow.addColorStop(1, "rgba(40,128,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    trails = trails.filter(trail => (trail.life *= 0.88) > 0.035);
    for (const trail of trails) {
      ctx.fillStyle = `hsla(${trail.hue},100%,72%,${trail.life * 0.55})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 8 + trail.life * 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSparks() {
    if ((videoLevel > 0.15 || boostEnergy > 0.2) && Math.random() < 0.03 && sparks.length < 80) {
      sparks.push(makeSpark(Math.random() * w, Math.random() * h * 0.78));
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    sparks = sparks.filter(spark => (spark.life *= 0.93) > 0.04);
    for (const spark of sparks) {
      spark.x += spark.vx * (1 + videoLevel * 0.35);
      spark.y += spark.vy * (1 + videoLevel * 0.25);
      spark.vx *= 0.98;
      spark.vy *= 0.98;
      ctx.strokeStyle = `hsla(${spark.hue},100%,72%,${spark.life})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = `hsla(${spark.hue},100%,72%,${spark.life})`;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * 7, spark.y - spark.vy * 7);
      ctx.stroke();
    }
    for (const ripple of ripples) {
      ripple.radius += 8 + boostEnergy * 6 + videoLevel * 4;
      ripple.life *= 0.92;
      ctx.strokeStyle = `hsla(${ripple.hue},100%,72%,${ripple.life * 0.7})`;
      ctx.lineWidth = 2 + ripple.life * 4;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ripples = ripples.filter(ripple => ripple.life > 0.04);
    ctx.restore();
  }

  function updateParticles() {
    for (const particle of particles) {
      particle.spin += 0.01 + videoLevel * 0.01;
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 210 && pointer.active) {
        const push = (210 - distance) / 210;
        particle.vx += (dx / distance) * push * (0.05 + boostEnergy * 0.04);
        particle.vy += (dy / distance) * push * (0.05 + boostEnergy * 0.04);
      }
      particle.vx += Math.cos(particle.spin) * (0.002 + videoLevel * 0.0015);
      particle.vy += Math.sin(particle.spin) * (0.002 + videoLevel * 0.0015);
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = w + 20;
      if (particle.x > w + 20) particle.x = -20;
      if (particle.y < -20) particle.y = h + 20;
      if (particle.y > h + 20) particle.y = -20;
    }
  }

  function drawParticles() {
    const limit = coarsePointer ? 90 : 120;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const maxJ = Math.min(particles.length, i + (coarsePointer ? 15 : 24));
      for (let j = i + 1; j < maxJ; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < limit) {
          ctx.strokeStyle = `rgba(103,226,255,${(1 - distance / limit) * (0.16 + videoLevel * 0.12 + boostEnergy * 0.18)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const pointerBoost = pointer.active ? Math.max(0, 1 - Math.hypot(a.x - pointer.x, a.y - pointer.y) / 190) : 0;
      ctx.fillStyle = `hsla(${a.hue},100%,${72 + pointerBoost * 20}%,${0.58 + pointerBoost * 0.28 + videoLevel * 0.08})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + pointerBoost * 3 + videoLevel * 0.8 + boostEnergy * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function animate(time = 0) {
    raf = requestAnimationFrame(animate);
    if (document.hidden) return;
    if (reducedMotion.matches && time - lastFrame < 80) return;
    lastFrame = time;
    videoLevel += ((videoPlaying ? 1 : 0) - videoLevel) * 0.045;
    ctx.clearRect(0, 0, w, h);
    drawBackground(time);
    drawBeams(time);
    drawRibbons(time);
    drawLogoHalo(time);
    drawEqualizer(time);
    drawPointerGlow();
    drawSparks();
    updateParticles();
    drawParticles();
    moodPulse *= 0.94;
    boostEnergy *= 0.92;
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !raf) raf = requestAnimationFrame(animate);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addInteractiveControls, { once: true });
  } else {
    setTimeout(addInteractiveControls, 0);
  }

  resize();
  raf = requestAnimationFrame(animate);
})();
