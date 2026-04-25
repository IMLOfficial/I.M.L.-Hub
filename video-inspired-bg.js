(() => {
  const bg = document.getElementById("bg");
  if (!bg) return;

  const ctx = bg.getContext("2d", { alpha: true, desynchronized: true });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = matchMedia("(pointer: coarse)");
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
  let isLite = false;
  let particles = [];
  let beams = [];
  let sparks = [];
  let ripples = [];
  let trails = [];
  const pointer = { x: 0, y: 0, active: false, lastTrail: 0 };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateMode() {
    isLite = coarsePointerQuery.matches || innerWidth <= 760 || (navigator.hardwareConcurrency || 8) <= 4;
  }

  function frameGap() {
    if (reducedMotion.matches) return 160;
    if (isLite && videoPlaying) return 95;
    if (isLite) return 48;
    return 18;
  }

  function countParticles() {
    if (reducedMotion.matches) return isLite ? 10 : 34;
    const base = Math.floor((w * h) / (isLite ? 26000 : 12500));
    return clamp(base, isLite ? 22 : 82, isLite ? 42 : 160);
  }

  function resize() {
    updateMode();
    dpr = isLite ? 1 : Math.min(devicePixelRatio || 1, 1.5);
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
    beams = Array.from({ length: isLite ? 2 : 7 }, makeBeam);
  }

  function makeParticle() {
    const speed = Math.random() * (isLite ? 0.28 : 0.5) + 0.06;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * (isLite ? 1.6 : 2.3) + 0.7,
      hue: 186 + moodIndex * 24 + Math.random() * 80,
      spin: Math.random() * Math.PI * 2
    };
  }

  function makeBeam() {
    return {
      x: Math.random() * w,
      y: h * (0.18 + Math.random() * 0.62),
      width: isLite ? 160 + Math.random() * 160 : 170 + Math.random() * 260,
      speed: (Math.random() > 0.5 ? 1 : -1) * (isLite ? 0.08 + Math.random() * 0.08 : 0.12 + Math.random() * 0.22),
      tilt: -0.22 + Math.random() * 0.44,
      phase: Math.random() * Math.PI * 2,
      palette: palettes[Math.floor(Math.random() * palettes.length)]
    };
  }

  function makeSpark(x = Math.random() * w, y = Math.random() * h) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (isLite ? 1.7 : 2.4) + Math.random() * (isLite ? 3 : 5.4);
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: 184 + moodIndex * 26 + Math.random() * 80
    };
  }

  function burst(x = pointer.x || w / 2, y = pointer.y || h * 0.32, count = isLite ? 8 : 24) {
    const maxSparks = isLite ? 36 : 100;
    for (let i = 0; i < count; i++) sparks.push(makeSpark(x, y));
    ripples.push({ x, y, radius: 0, life: 1, hue: 188 + moodIndex * 24 });
    if (sparks.length > maxSparks) sparks.splice(0, sparks.length - maxSparks);
  }

  function addInteractiveControls() {
    const controls = document.getElementById("moodControls");
    if (!controls) return;

    if (!document.getElementById("imlExtraControlStyles")) {
      const style = document.createElement("style");
      style.id = "imlExtraControlStyles";
      style.textContent = ".mood-controls button.utility{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.18)}.mood-controls button.utility.flash{box-shadow:0 0 22px rgba(255,79,216,.48);transform:translateY(-1px)}.energy-meter{display:grid;grid-template-columns:repeat(10,1fr);align-items:end;gap:4px;width:min(100%,320px);height:40px;margin:16px auto 0}.energy-meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(180deg,#79efff,#725dff 55%,rgba(255,79,216,.2));box-shadow:0 0 12px rgba(77,184,255,.26);transform:scaleY(.3);transform-origin:bottom;animation:meterPulse 1.45s ease-in-out infinite;animation-delay:calc(var(--i)*-.08s)}.energy-meter.boost span{animation-duration:.58s;box-shadow:0 0 16px rgba(255,79,216,.42)}@keyframes meterPulse{0%,100%{transform:scaleY(.22);opacity:.48}50%{transform:scaleY(1);opacity:1}}@media (max-width:640px){.energy-meter{height:30px}.energy-meter span{box-shadow:none;animation-duration:2.2s}}@media (prefers-reduced-motion:reduce){.energy-meter span{animation:none;transform:scaleY(.45)}}";
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
      for (let i = 0; i < 10; i++) {
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
      burst(w / 2, Math.min(h * 0.38, 320), isLite ? 10 : 30);
      setTimeout(() => {
        boostButton.classList.remove("flash");
        meter.classList.remove("boost");
      }, 620);
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
    beams = Array.from({ length: isLite ? 2 : 7 }, makeBeam);
    burst(pointer.x || w / 2, pointer.y || h * 0.3, isLite ? 6 : 18);
  });

  addEventListener("iml:boost", event => {
    const detail = event.detail || {};
    boostEnergy = 1;
    moodPulse = 1;
    burst(detail.x || pointer.x || w / 2, detail.y || pointer.y || h * 0.35, isLite ? 10 : 30);
  });

  addEventListener("iml:video-state", event => {
    videoPlaying = Boolean(event.detail?.playing);
    if (videoPlaying) {
      boostEnergy = 0.55;
      burst(w / 2, Math.min(280, h * 0.32), isLite ? 8 : 24);
    }
  });

  function movePointer(event, makeTrail = true) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    if (!makeTrail) return;
    const now = performance.now();
    if (now - pointer.lastTrail > (isLite ? 120 : 30)) {
      pointer.lastTrail = now;
      trails.push({ x: pointer.x, y: pointer.y, life: 1, hue: 185 + moodIndex * 24 + Math.random() * 60 });
      if (trails.length > (isLite ? 6 : 20)) trails.shift();
    }
  }

  if (!coarsePointerQuery.matches) {
    addEventListener("pointermove", movePointer, { passive: true });
  }
  addEventListener("pointerdown", event => {
    movePointer(event, !isLite);
    boostEnergy = Math.max(boostEnergy, isLite ? 0.38 : 0.58);
    burst(pointer.x, pointer.y, isLite ? 6 : 16);
    if (isLite) setTimeout(() => { pointer.active = false; }, 380);
  }, { passive: true });
  addEventListener("pointerup", () => { if (isLite) pointer.active = false; }, { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });

  let resizeRaf = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  }, { passive: true });

  function drawBackground(time) {
    const palette = palettes[moodIndex];
    const cx = w * (0.5 + Math.sin(time * 0.00016) * (isLite ? 0.08 : 0.18));
    const cy = h * (0.22 + Math.cos(time * 0.0002) * (isLite ? 0.06 : 0.14));
    const radius = Math.max(w, h) * (0.8 + videoLevel * 0.06 + boostEnergy * 0.08);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    glow.addColorStop(0, `${palette[0]}${isLite ? "4c" : "66"}`);
    glow.addColorStop(0.4, `${palette[1]}${isLite ? "20" : "32"}`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const sweep = ctx.createLinearGradient(0, h * 0.08, w, h * 0.9);
    sweep.addColorStop(0, `${palette[0]}1b`);
    sweep.addColorStop(0.5, `${palette[1]}20`);
    sweep.addColorStop(1, `${palette[2]}1c`);
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, w, h);
  }

  function drawBeams(time) {
    const power = 1 + videoLevel * (isLite ? 0.6 : 1.6) + boostEnergy * (isLite ? 0.7 : 1.4);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (const beam of beams) {
      beam.x += beam.speed * power;
      if (beam.speed > 0 && beam.x > w + beam.width) beam.x = -beam.width;
      if (beam.speed < 0 && beam.x < -beam.width) beam.x = w + beam.width;
      const y = beam.y + Math.sin(time * 0.001 + beam.phase) * (isLite ? 12 : 24 + videoLevel * 18);
      const grad = ctx.createLinearGradient(beam.x, y, beam.x + beam.width, y + beam.width * beam.tilt);
      grad.addColorStop(0, `${beam.palette[0]}00`);
      grad.addColorStop(0.5, `${beam.palette[1]}${isLite ? "44" : "74"}`);
      grad.addColorStop(1, `${beam.palette[2]}00`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isLite ? 18 + boostEnergy * 10 + videoLevel * 8 : 34 + boostEnergy * 22 + videoLevel * 16;
      if (!isLite) {
        ctx.shadowColor = `${beam.palette[0]}bb`;
        ctx.shadowBlur = 20 + boostEnergy * 22;
      }
      ctx.beginPath();
      ctx.moveTo(beam.x, y);
      ctx.lineTo(beam.x + beam.width, y + beam.width * beam.tilt);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRibbons(time) {
    const palette = palettes[moodIndex];
    const lines = isLite ? 1 : 3;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let row = 0; row < lines; row++) {
      const baseY = h * (isLite ? 0.46 : 0.28 + row * 0.18);
      ctx.beginPath();
      for (let x = -40; x <= w + 40; x += isLite ? 28 : 18) {
        const wave = Math.sin(x * 0.009 + time * (0.001 + row * 0.0002)) * (isLite ? 22 + videoLevel * 18 + boostEnergy * 14 : 38 + videoLevel * 34 + boostEnergy * 24);
        const fine = isLite ? 0 : Math.sin(x * 0.028 - time * 0.0011) * 18;
        if (x === -40) ctx.moveTo(x, baseY + wave + fine);
        else ctx.lineTo(x, baseY + wave + fine);
      }
      ctx.strokeStyle = `${palette[row]}78`;
      ctx.lineWidth = isLite ? 3 : 4 + row * 1.5 + videoLevel * 2 + boostEnergy * 2;
      if (!isLite) {
        ctx.shadowColor = `${palette[row]}cc`;
        ctx.shadowBlur = 18 + videoLevel * 24 + boostEnergy * 26;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEqualizer(time) {
    const palette = palettes[moodIndex];
    const bars = isLite ? 28 : 72;
    const width = w / bars;
    const base = h - 8;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < bars; i++) {
      const beat = (Math.sin(time * (0.004 + videoLevel * 0.003) + i * 0.58) + 1) * 0.5;
      const height = 14 + beat * (isLite ? 28 + videoLevel * 34 + boostEnergy * 20 : 44 + videoLevel * 76 + boostEnergy * 48);
      const grad = ctx.createLinearGradient(0, base - height, 0, base);
      grad.addColorStop(0, `${palette[0]}cc`);
      grad.addColorStop(0.55, `${palette[1]}6a`);
      grad.addColorStop(1, `${palette[2]}00`);
      ctx.fillStyle = grad;
      ctx.fillRect(i * width + width * 0.3, base - height, Math.max(2, width * 0.38), height);
    }
    ctx.restore();
  }

  function drawLogoHalo(time) {
    const cx = w / 2;
    const cy = Math.min(250, Math.max(160, h * 0.24));
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rings = isLite ? 3 : 7;
    for (let i = 0; i < rings; i++) {
      const radius = 104 + i * (isLite ? 38 : 30) + Math.sin(time * 0.0013 + i) * (isLite ? 4 + videoLevel * 6 : 7 + videoLevel * 15 + boostEnergy * 12);
      const start = time * (0.00045 + videoLevel * 0.00018) + i * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, start, start + Math.PI * (0.68 + i * 0.05));
      ctx.strokeStyle = `rgba(${76 + i * 18},${220 - i * 4},255,${0.22 - i * 0.028 + videoLevel * 0.06 + boostEnergy * 0.05})`;
      ctx.lineWidth = isLite ? 1.5 : 2 + videoLevel + boostEnergy;
      if (!isLite) {
        ctx.shadowColor = "rgba(89,217,255,.75)";
        ctx.shadowBlur = 12 + videoLevel * 24 + boostEnergy * 20;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPointerGlow() {
    if (!pointer.active && boostEnergy < 0.04 && trails.length === 0) return;
    const radius = isLite ? 115 + boostEnergy * 80 : 190 + boostEnergy * 190 + videoLevel * 80;
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    glow.addColorStop(0, "rgba(126,235,255,.32)");
    glow.addColorStop(0.34, "rgba(128,80,255,.16)");
    glow.addColorStop(1, "rgba(40,128,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    trails = trails.filter(trail => (trail.life *= isLite ? 0.76 : 0.88) > 0.035);
    for (const trail of trails) {
      ctx.fillStyle = `hsla(${trail.hue},100%,72%,${trail.life * 0.5})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, (isLite ? 5 : 8) + trail.life * (isLite ? 10 : 16), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSparks() {
    const maxSparks = isLite ? 32 : 80;
    if ((videoLevel > 0.15 || boostEnergy > 0.22) && Math.random() < (isLite ? 0.01 : 0.03) && sparks.length < maxSparks) {
      sparks.push(makeSpark(Math.random() * w, Math.random() * h * 0.78));
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    sparks = sparks.filter(spark => (spark.life *= isLite ? 0.88 : 0.93) > 0.04);
    for (const spark of sparks) {
      spark.x += spark.vx * (1 + videoLevel * 0.25);
      spark.y += spark.vy * (1 + videoLevel * 0.18);
      spark.vx *= 0.97;
      spark.vy *= 0.97;
      ctx.strokeStyle = `hsla(${spark.hue},100%,72%,${spark.life})`;
      ctx.lineWidth = isLite ? 1.5 : 2;
      if (!isLite) {
        ctx.shadowColor = `hsla(${spark.hue},100%,72%,${spark.life})`;
        ctx.shadowBlur = 14;
      }
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * (isLite ? 4 : 7), spark.y - spark.vy * (isLite ? 4 : 7));
      ctx.stroke();
    }
    for (const ripple of ripples) {
      ripple.radius += isLite ? 5 + boostEnergy * 3 : 8 + boostEnergy * 6 + videoLevel * 4;
      ripple.life *= isLite ? 0.88 : 0.92;
      ctx.strokeStyle = `hsla(${ripple.hue},100%,72%,${ripple.life * 0.65})`;
      ctx.lineWidth = isLite ? 1.5 + ripple.life * 2 : 2 + ripple.life * 4;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ripples = ripples.filter(ripple => ripple.life > 0.04);
    ctx.restore();
  }

  function updateParticles() {
    for (const particle of particles) {
      particle.spin += isLite ? 0.006 + videoLevel * 0.004 : 0.01 + videoLevel * 0.01;
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSq = dx * dx + dy * dy;
        const range = isLite ? 110 : 210;
        if (distanceSq < range * range) {
          const distance = Math.sqrt(distanceSq) || 1;
          const push = (range - distance) / range;
          particle.vx += (dx / distance) * push * (isLite ? 0.025 : 0.05 + boostEnergy * 0.04);
          particle.vy += (dy / distance) * push * (isLite ? 0.025 : 0.05 + boostEnergy * 0.04);
        }
      }
      particle.vx += Math.cos(particle.spin) * (isLite ? 0.0012 : 0.002 + videoLevel * 0.0015);
      particle.vy += Math.sin(particle.spin) * (isLite ? 0.0012 : 0.002 + videoLevel * 0.0015);
      particle.vx *= isLite ? 0.975 : 0.985;
      particle.vy *= isLite ? 0.975 : 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = w + 20;
      if (particle.x > w + 20) particle.x = -20;
      if (particle.y < -20) particle.y = h + 20;
      if (particle.y > h + 20) particle.y = -20;
    }
  }

  function drawParticles() {
    const limit = isLite ? 0 : 112;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (limit) {
        const maxJ = Math.min(particles.length, i + 20);
        for (let j = i + 1; j < maxJ; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < limit * limit) {
            const distance = Math.sqrt(distanceSq);
            ctx.strokeStyle = `rgba(103,226,255,${(1 - distance / limit) * (0.15 + videoLevel * 0.1 + boostEnergy * 0.14)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      const pointerBoost = pointer.active ? Math.max(0, 1 - Math.hypot(a.x - pointer.x, a.y - pointer.y) / (isLite ? 120 : 190)) : 0;
      ctx.fillStyle = `hsla(${a.hue},100%,${72 + pointerBoost * 18}%,${isLite ? 0.5 + pointerBoost * 0.2 + videoLevel * 0.06 : 0.58 + pointerBoost * 0.28 + videoLevel * 0.08})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + pointerBoost * (isLite ? 1.4 : 3) + videoLevel * (isLite ? 0.35 : 0.8) + boostEnergy * (isLite ? 0.35 : 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function animate(time = 0) {
    if (document.hidden) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);
    if (time - lastFrame < frameGap()) return;
    lastFrame = time;
    videoLevel += ((videoPlaying ? 1 : 0) - videoLevel) * (isLite ? 0.08 : 0.045);
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
    boostEnergy *= isLite ? 0.86 : 0.92;
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
