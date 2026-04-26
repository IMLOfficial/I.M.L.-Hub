(() => {
  const bg = document.getElementById("bg");
  if (!bg) return;

  const ctx = bg.getContext("2d", { alpha: true, desynchronized: true });
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = matchMedia("(pointer: coarse)");
  const palettes = [
    { name: "Neon Pulse", colors: ["#25d9ff", "#725dff", "#ff4fd8"] },
    { name: "Blue Drive", colors: ["#44fff0", "#2a7cff", "#0a2248"] },
    { name: "Dream Flash", colors: ["#ff7adf", "#78a7ff", "#30156f"] },
    { name: "Night Ride", colors: ["#78e8ff", "#1749ff", "#070a18"] }
  ];

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let lastFrame = 0;
  let moodIndex = 0;
  let boostEnergy = 0;
  let videoEnergy = 0;
  let videoPlaying = false;
  let isLite = false;
  let particles = [];
  let beams = [];
  let sparks = [];
  let ripples = [];
  let trails = [];
  let lastBoost = 0;
  const pointer = { x: innerWidth / 2, y: innerHeight * 0.35, active: false, lastTrail: 0 };
  const boostPoint = { x: innerWidth / 2, y: innerHeight * 0.35 };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateMode() {
    isLite = coarsePointerQuery.matches || innerWidth <= 760 || (navigator.hardwareConcurrency || 8) <= 4;
  }

  function frameGap() {
    if (reducedMotion.matches) return 120;
    if (isLite && videoPlaying) return 70;
    if (isLite) return 42;
    return 16;
  }

  function resize() {
    updateMode();
    dpr = isLite ? 1 : Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth;
    h = innerHeight;
    bg.width = Math.floor(w * dpr);
    bg.height = Math.floor(h * dpr);
    bg.style.width = `${w}px`;
    bg.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount() }, makeParticle);
    beams = Array.from({ length: isLite ? 4 : 9 }, makeBeam);
  }

  function particleCount() {
    const base = Math.floor((w * h) / (isLite ? 24500 : 11500));
    return clamp(base, isLite ? 28 : 88, isLite ? 54 : 170);
  }

  function makeParticle() {
    const speed = Math.random() * (isLite ? 0.32 : 0.58) + 0.06;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * (isLite ? 1.7 : 2.5) + 0.65,
      hue: 186 + moodIndex * 26 + Math.random() * 84,
      spin: Math.random() * Math.PI * 2
    };
  }

  function makeBeam() {
    const palette = palettes[Math.floor(Math.random() * palettes.length)].colors;
    return {
      x: Math.random() * w,
      y: h * (0.15 + Math.random() * 0.68),
      width: isLite ? 170 + Math.random() * 170 : 190 + Math.random() * 320,
      speed: (Math.random() > 0.5 ? 1 : -1) * (isLite ? 0.11 + Math.random() * 0.1 : 0.16 + Math.random() * 0.26),
      tilt: -0.24 + Math.random() * 0.48,
      phase: Math.random() * Math.PI * 2,
      palette
    };
  }

  function makeSpark(x, y, power = 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (isLite ? 1.8 : 2.8) + Math.random() * (isLite ? 4.8 : 7.8) * power;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: 184 + moodIndex * 28 + Math.random() * 92
    };
  }

  function burst(x, y, count = isLite ? 14 : 36, power = 1) {
    const maxSparks = isLite ? 70 : 180;
    for (let i = 0; i < count; i++) sparks.push(makeSpark(x, y, power));
    ripples.push({ x, y, radius: 0, life: 1, hue: 188 + moodIndex * 26, power });
    if (sparks.length > maxSparks) sparks.splice(0, sparks.length - maxSparks);
  }

  function igniteBoost(x = w / 2, y = Math.min(h * 0.38, 340), power = 1.25) {
    const now = performance.now();
    if (now - lastBoost < 90) return;
    lastBoost = now;
    boostPoint.x = clamp(x, 0, w);
    boostPoint.y = clamp(y, 0, h);
    boostEnergy = Math.max(boostEnergy, power);
    pointer.x = boostPoint.x;
    pointer.y = boostPoint.y;
    pointer.active = true;
    burst(boostPoint.x, boostPoint.y, isLite ? 28 : 76, power);
    beams = Array.from({ length: isLite ? 5 : 11 }, makeBeam);

    const controls = document.getElementById("moodControls");
    const meter = document.getElementById("energyMeter");
    const boostButton = document.getElementById("boostButton");
    document.body.classList.add("iml-boosting");
    controls?.classList.add("is-boosting");
    meter?.classList.add("boost");
    boostButton?.classList.add("flash");
    setTimeout(() => {
      document.body.classList.remove("iml-boosting");
      controls?.classList.remove("is-boosting");
      meter?.classList.remove("boost");
      boostButton?.classList.remove("flash");
      if (isLite) pointer.active = false;
    }, 900);
  }

  function setMood(index, sourceButton) {
    moodIndex = clamp(Number(index || 0), 0, palettes.length - 1);
    const palette = palettes[moodIndex].colors;
    document.querySelectorAll("#moodControls [data-mood]").forEach(button => {
      button.classList.toggle("active", Number(button.dataset.mood) === moodIndex);
    });
    const panel = document.getElementById("moodControls")?.closest(".hub-panel");
    if (panel) {
      panel.style.setProperty("--vibe-a", palette[0]);
      panel.style.setProperty("--vibe-b", palette[1]);
      panel.style.setProperty("--vibe-c", palette[2]);
    }
    beams = Array.from({ length: isLite ? 4 : 9 }, makeBeam);
    const rect = sourceButton?.getBoundingClientRect?.();
    igniteBoost(rect ? rect.left + rect.width / 2 : w / 2, rect ? rect.top + rect.height / 2 : h * 0.35, 0.72);
  }

  function addInteractiveControls() {
    const controls = document.getElementById("moodControls");
    if (!controls || controls.dataset.vibeReady === "true") return;
    controls.dataset.vibeReady = "true";
    controls.classList.add("vibe-deck");

    if (!document.getElementById("imlExtraControlStyles")) {
      const style = document.createElement("style");
      style.id = "imlExtraControlStyles";
      style.textContent = `
        .hub-panel{position:relative;overflow:hidden;--vibe-a:#25d9ff;--vibe-b:#725dff;--vibe-c:#ff4fd8}
        .hub-panel::before{content:"";position:absolute;inset:-2px;z-index:-1;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--vibe-a) 34%,transparent),transparent 42%),linear-gradient(120deg,transparent,color-mix(in srgb,var(--vibe-b) 20%,transparent),transparent);opacity:.75;transition:opacity .25s ease,transform .35s ease}
        body.iml-boosting .hub-panel::before{opacity:1;transform:scale(1.05);animation:panelFlash .7s ease-out}
        .vibe-deck button{position:relative;isolation:isolate;overflow:hidden;gap:8px;border:1px solid color-mix(in srgb,var(--vibe-a,#4db8ff) 42%,rgba(255,255,255,.18));background:linear-gradient(135deg,rgba(9,27,54,.78),rgba(27,61,104,.62));box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),0 8px 18px rgba(0,0,0,.18),0 0 16px color-mix(in srgb,var(--vibe-a,#4db8ff) 24%,transparent);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease}
        .vibe-deck button::before{content:"";position:absolute;inset:-70%;z-index:-1;background:radial-gradient(circle at 30% 35%,color-mix(in srgb,var(--vibe-a,#4db8ff) 48%,transparent),transparent 28%),linear-gradient(110deg,transparent 35%,rgba(255,255,255,.22),transparent 62%);opacity:.45;transform:translateX(-30%) rotate(12deg);transition:transform .38s ease,opacity .2s ease}
        .vibe-deck button:hover,.vibe-deck button:focus-visible,.vibe-deck button.active{filter:none;transform:translateY(-2px);border-color:color-mix(in srgb,var(--vibe-a,#4db8ff) 72%,white);box-shadow:0 12px 26px rgba(0,0,0,.22),0 0 26px color-mix(in srgb,var(--vibe-a,#4db8ff) 42%,transparent)}
        .vibe-deck button:hover::before,.vibe-deck button:focus-visible::before,.vibe-deck button.active::before{opacity:.95;transform:translateX(8%) rotate(12deg)}
        .vibe-deck button:active{transform:scale(.96)}
        .vibe-deck button.active{background:linear-gradient(135deg,var(--vibe-a,#35d9ff),var(--vibe-b,#7b5dff));color:#fff}
        .vibe-dot{width:10px;height:10px;border-radius:50%;background:var(--vibe-a,#7ff0ff);box-shadow:0 0 0 4px color-mix(in srgb,var(--vibe-a,#7ff0ff) 18%,transparent),0 0 13px var(--vibe-a,#7ff0ff);flex:0 0 auto}
        .vibe-spark{position:absolute;right:9px;top:7px;width:5px;height:5px;border-radius:50%;background:var(--vibe-c,#ff4fd8);box-shadow:0 0 10px var(--vibe-c,#ff4fd8);opacity:.72}
        .vibe-deck button.utility{--vibe-a:#fff;--vibe-b:#53c9ff;--vibe-c:#ff4fd8;background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(77,184,255,.18))}
        #boostButton.flash,.vibe-deck.is-boosting #boostButton{animation:boostButtonPop .82s ease-out;box-shadow:0 0 0 6px rgba(255,255,255,.1),0 0 32px rgba(255,79,216,.72),0 0 55px rgba(77,184,255,.5)}
        #randomMoodButton{--vibe-a:#ff7adf;--vibe-b:#54eaff;--vibe-c:#ffe66d}
        .energy-meter{display:grid;grid-template-columns:repeat(16,1fr);align-items:end;gap:4px;width:min(100%,420px);height:42px;margin:18px auto 0;padding:0 6px}
        .energy-meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(180deg,#a9fbff 0%,#45c9ff 34%,#7667ff 68%,rgba(255,79,216,.24));box-shadow:0 0 12px rgba(77,184,255,.28);transform:scaleY(.22);transform-origin:bottom;animation:meterPulse 1.35s ease-in-out infinite;animation-delay:calc(var(--i)*-.055s)}
        .energy-meter.boost span{animation-duration:.38s;box-shadow:0 0 18px rgba(255,79,216,.56),0 0 28px rgba(77,184,255,.34)}
        @keyframes meterPulse{0%,100%{transform:scaleY(.22);opacity:.46}38%{transform:scaleY(calc(.36 + var(--level)*.55));opacity:.9}68%{transform:scaleY(calc(.22 + var(--level)*.78));opacity:1}}
        @keyframes boostButtonPop{0%{transform:scale(.94)}35%{transform:scale(1.13)}100%{transform:scale(1)}}
        @keyframes panelFlash{0%{filter:brightness(1)}35%{filter:brightness(1.35)}100%{filter:brightness(1)}}
        @media (max-width:640px){.vibe-deck{gap:8px}.vibe-deck button{flex:1 1 132px}.energy-meter{height:30px;gap:3px}.energy-meter span{box-shadow:none;animation-duration:1.9s}}
        @media (prefers-reduced-motion:reduce){.vibe-deck button,.vibe-deck button::before,.energy-meter span{animation:none;transition:none}.energy-meter span{transform:scaleY(.45)}}
      `;
      document.head.appendChild(style);
    }

    controls.querySelectorAll("[data-mood]").forEach((button, index) => {
      const palette = palettes[index % palettes.length].colors;
      const label = button.textContent.trim();
      button.style.setProperty("--vibe-a", palette[0]);
      button.style.setProperty("--vibe-b", palette[1]);
      button.style.setProperty("--vibe-c", palette[2]);
      if (!button.dataset.decorated) {
        button.dataset.decorated = "true";
        button.innerHTML = `<span class="vibe-dot" aria-hidden="true"></span><span>${label}</span><span class="vibe-spark" aria-hidden="true"></span>`;
      }
    });

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

    [boostButton, randomButton].forEach(button => {
      const label = button.textContent.trim();
      if (!button.dataset.decorated) {
        button.dataset.decorated = "true";
        button.innerHTML = `<span class="vibe-dot" aria-hidden="true"></span><span>${label}</span><span class="vibe-spark" aria-hidden="true"></span>`;
      }
    });

    let meter = document.getElementById("energyMeter");
    if (!meter) {
      meter = document.createElement("div");
      meter.id = "energyMeter";
      meter.className = "energy-meter";
      meter.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 16; i++) {
        const bar = document.createElement("span");
        bar.style.setProperty("--i", i);
        bar.style.setProperty("--level", (0.25 + Math.random() * 0.75).toFixed(2));
        meter.appendChild(bar);
      }
      controls.insertAdjacentElement("afterend", meter);
    }

    controls.addEventListener("click", event => {
      const moodButton = event.target.closest("[data-mood]");
      if (moodButton) setMood(moodButton.dataset.mood, moodButton);
    });

    const runBoost = event => {
      const rect = boostButton.getBoundingClientRect();
      igniteBoost(event?.clientX || rect.left + rect.width / 2, event?.clientY || rect.top + rect.height / 2, 1.45);
    };
    boostButton.addEventListener("pointerdown", runBoost, { passive: true });
    boostButton.addEventListener("click", runBoost);

    randomButton.addEventListener("click", event => {
      const moodButtons = [...controls.querySelectorAll("[data-mood]")];
      const current = Number(controls.querySelector("[data-mood].active")?.dataset.mood || moodIndex);
      const choices = moodButtons.filter(button => Number(button.dataset.mood) !== current);
      const next = choices[Math.floor(Math.random() * choices.length)] || moodButtons[0];
      if (next) {
        next.click();
        setMood(next.dataset.mood, next);
      }
      const rect = randomButton.getBoundingClientRect();
      igniteBoost(event?.clientX || rect.left + rect.width / 2, event?.clientY || rect.top + rect.height / 2, 1.1);
    });

    setMood(controls.querySelector("[data-mood].active")?.dataset.mood || 0, controls.querySelector("[data-mood].active"));
  }

  addEventListener("iml:mood", event => setMood(event.detail?.mood || 0));
  addEventListener("iml:boost", event => {
    const detail = event.detail || {};
    igniteBoost(detail.x || pointer.x || w / 2, detail.y || pointer.y || h * 0.35, detail.power || 1.1);
  });
  addEventListener("iml:video-state", event => {
    videoPlaying = Boolean(event.detail?.playing);
    if (videoPlaying) igniteBoost(w / 2, Math.min(280, h * 0.32), 0.9);
  });

  function movePointer(event, makeTrail = true) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    if (!makeTrail) return;
    const now = performance.now();
    if (now - pointer.lastTrail > (isLite ? 110 : 28)) {
      pointer.lastTrail = now;
      trails.push({ x: pointer.x, y: pointer.y, life: 1, hue: 185 + moodIndex * 24 + Math.random() * 70 });
      if (trails.length > (isLite ? 8 : 26)) trails.shift();
    }
  }

  if (!coarsePointerQuery.matches) addEventListener("pointermove", movePointer, { passive: true });
  addEventListener("pointerdown", event => {
    movePointer(event, !isLite);
    boostEnergy = Math.max(boostEnergy, isLite ? 0.32 : 0.5);
    burst(pointer.x, pointer.y, isLite ? 8 : 18, 0.75);
    if (isLite) setTimeout(() => { pointer.active = false; }, 380);
  }, { passive: true });
  addEventListener("pointerup", () => { if (isLite) pointer.active = false; }, { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(resize), { passive: true });

  function drawBackground(time) {
    const palette = palettes[moodIndex].colors;
    const cx = w * (0.5 + Math.sin(time * 0.00016) * (isLite ? 0.08 : 0.18));
    const cy = h * (0.22 + Math.cos(time * 0.0002) * (isLite ? 0.06 : 0.14));
    const radius = Math.max(w, h) * (0.82 + videoEnergy * 0.08 + boostEnergy * 0.13);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    glow.addColorStop(0, `${palette[0]}7a`);
    glow.addColorStop(0.38, `${palette[1]}33`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const sweep = ctx.createLinearGradient(0, h * 0.08, w, h * 0.9);
    sweep.addColorStop(0, `${palette[0]}20`);
    sweep.addColorStop(0.5, `${palette[1]}28`);
    sweep.addColorStop(1, `${palette[2]}20`);
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, w, h);
  }

  function drawBeams(time) {
    const power = 1 + videoEnergy * (isLite ? 0.8 : 1.8) + boostEnergy * (isLite ? 1.2 : 2.2);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (const beam of beams) {
      beam.x += beam.speed * power;
      if (beam.speed > 0 && beam.x > w + beam.width) beam.x = -beam.width;
      if (beam.speed < 0 && beam.x < -beam.width) beam.x = w + beam.width;
      const y = beam.y + Math.sin(time * 0.001 + beam.phase) * (isLite ? 14 : 28 + boostEnergy * 22);
      const grad = ctx.createLinearGradient(beam.x, y, beam.x + beam.width, y + beam.width * beam.tilt);
      grad.addColorStop(0, `${beam.palette[0]}00`);
      grad.addColorStop(0.5, `${beam.palette[1]}88`);
      grad.addColorStop(1, `${beam.palette[2]}00`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isLite ? 20 + boostEnergy * 14 : 36 + boostEnergy * 30;
      if (!isLite) {
        ctx.shadowColor = `${beam.palette[0]}cc`;
        ctx.shadowBlur = 24 + boostEnergy * 34;
      }
      ctx.beginPath();
      ctx.moveTo(beam.x, y);
      ctx.lineTo(beam.x + beam.width, y + beam.width * beam.tilt);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRibbons(time) {
    const palette = palettes[moodIndex].colors;
    const lines = isLite ? 2 : 4;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let row = 0; row < lines; row++) {
      const baseY = h * (isLite ? 0.34 + row * 0.25 : 0.24 + row * 0.15);
      ctx.beginPath();
      for (let x = -40; x <= w + 40; x += isLite ? 26 : 16) {
        const amp = isLite ? 24 + boostEnergy * 26 : 40 + boostEnergy * 42 + videoEnergy * 30;
        const wave = Math.sin(x * 0.009 + time * (0.001 + row * 0.00024)) * amp;
        const fine = isLite ? 0 : Math.sin(x * 0.028 - time * 0.0011) * 18;
        if (x === -40) ctx.moveTo(x, baseY + wave + fine);
        else ctx.lineTo(x, baseY + wave + fine);
      }
      ctx.strokeStyle = `${palette[row % 3]}8a`;
      ctx.lineWidth = isLite ? 3 : 4 + row * 1.3 + boostEnergy * 2.5;
      if (!isLite) {
        ctx.shadowColor = `${palette[row % 3]}cc`;
        ctx.shadowBlur = 18 + boostEnergy * 30;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEqualizer(time) {
    const palette = palettes[moodIndex].colors;
    const bars = isLite ? 34 : 82;
    const width = w / bars;
    const base = h - 8;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < bars; i++) {
      const beat = (Math.sin(time * (0.0045 + boostEnergy * 0.003) + i * 0.56) + 1) * 0.5;
      const height = 16 + beat * (isLite ? 38 + boostEnergy * 46 : 54 + boostEnergy * 96 + videoEnergy * 58);
      const grad = ctx.createLinearGradient(0, base - height, 0, base);
      grad.addColorStop(0, `${palette[0]}dd`);
      grad.addColorStop(0.55, `${palette[1]}78`);
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
    const rings = isLite ? 3 : 8;
    for (let i = 0; i < rings; i++) {
      const radius = 104 + i * (isLite ? 36 : 30) + Math.sin(time * 0.0013 + i) * (isLite ? 6 + boostEnergy * 10 : 8 + boostEnergy * 20);
      const start = time * (0.00045 + boostEnergy * 0.00035) + i * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, start, start + Math.PI * (0.68 + i * 0.05));
      ctx.strokeStyle = `rgba(${80 + i * 18},${220 - i * 4},255,${0.22 - i * 0.024 + boostEnergy * 0.08})`;
      ctx.lineWidth = isLite ? 1.5 : 2 + boostEnergy * 1.6;
      if (!isLite) {
        ctx.shadowColor = "rgba(89,217,255,.8)";
        ctx.shadowBlur = 12 + boostEnergy * 30;
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBoostFlash() {
    if (boostEnergy < 0.035) return;
    const palette = palettes[moodIndex].colors;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const radius = Math.max(w, h) * (0.18 + boostEnergy * 0.62);
    const flash = ctx.createRadialGradient(boostPoint.x, boostPoint.y, 0, boostPoint.x, boostPoint.y, radius);
    flash.addColorStop(0, `${palette[2]}88`);
    flash.addColorStop(0.22, `${palette[0]}66`);
    flash.addColorStop(0.62, `${palette[1]}22`);
    flash.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flash;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < (isLite ? 2 : 4); i++) {
      ctx.strokeStyle = `${palette[i % 3]}${isLite ? "88" : "aa"}`;
      ctx.lineWidth = (isLite ? 2 : 3) + boostEnergy * 2;
      ctx.beginPath();
      ctx.arc(boostPoint.x, boostPoint.y, (1.2 - boostEnergy) * -80 + 48 + i * 46 + boostEnergy * 120, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPointerGlow() {
    if (!pointer.active && boostEnergy < 0.04 && trails.length === 0) return;
    const radius = isLite ? 130 + boostEnergy * 120 : 210 + boostEnergy * 250;
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    glow.addColorStop(0, "rgba(126,235,255,.36)");
    glow.addColorStop(0.34, "rgba(128,80,255,.18)");
    glow.addColorStop(1, "rgba(40,128,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    trails = trails.filter(trail => (trail.life *= isLite ? 0.76 : 0.88) > 0.035);
    for (const trail of trails) {
      ctx.fillStyle = `hsla(${trail.hue},100%,72%,${trail.life * 0.54})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, (isLite ? 5 : 8) + trail.life * (isLite ? 12 : 18), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSparks() {
    const maxSparks = isLite ? 64 : 150;
    if (boostEnergy > 0.18 && Math.random() < (isLite ? 0.04 : 0.08) && sparks.length < maxSparks) {
      sparks.push(makeSpark(Math.random() * w, Math.random() * h * 0.78, boostEnergy));
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    sparks = sparks.filter(spark => (spark.life *= isLite ? 0.87 : 0.93) > 0.04);
    for (const spark of sparks) {
      spark.x += spark.vx * (1 + boostEnergy * 0.16);
      spark.y += spark.vy * (1 + boostEnergy * 0.12);
      spark.vx *= 0.965;
      spark.vy *= 0.965;
      ctx.strokeStyle = `hsla(${spark.hue},100%,72%,${spark.life})`;
      ctx.lineWidth = isLite ? 1.6 : 2.2;
      if (!isLite) {
        ctx.shadowColor = `hsla(${spark.hue},100%,72%,${spark.life})`;
        ctx.shadowBlur = 15;
      }
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * (isLite ? 4 : 7), spark.y - spark.vy * (isLite ? 4 : 7));
      ctx.stroke();
    }
    for (const ripple of ripples) {
      ripple.radius += (isLite ? 7 : 10) + boostEnergy * 8 + ripple.power * 4;
      ripple.life *= isLite ? 0.88 : 0.92;
      ctx.strokeStyle = `hsla(${ripple.hue},100%,72%,${ripple.life * 0.72})`;
      ctx.lineWidth = isLite ? 1.8 + ripple.life * 2.5 : 2.4 + ripple.life * 5;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ripples = ripples.filter(ripple => ripple.life > 0.04);
    ctx.restore();
  }

  function updateParticles() {
    for (const particle of particles) {
      particle.spin += isLite ? 0.008 + boostEnergy * 0.006 : 0.012 + boostEnergy * 0.012;
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSq = dx * dx + dy * dy;
        const range = isLite ? 130 + boostEnergy * 50 : 230 + boostEnergy * 100;
        if (distanceSq < range * range) {
          const distance = Math.sqrt(distanceSq) || 1;
          const push = (range - distance) / range;
          particle.vx += (dx / distance) * push * (isLite ? 0.032 : 0.065 + boostEnergy * 0.055);
          particle.vy += (dy / distance) * push * (isLite ? 0.032 : 0.065 + boostEnergy * 0.055);
        }
      }
      particle.vx += Math.cos(particle.spin) * (isLite ? 0.0015 : 0.0025 + boostEnergy * 0.003);
      particle.vy += Math.sin(particle.spin) * (isLite ? 0.0015 : 0.0025 + boostEnergy * 0.003);
      particle.vx *= isLite ? 0.972 : 0.982;
      particle.vy *= isLite ? 0.972 : 0.982;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = w + 20;
      if (particle.x > w + 20) particle.x = -20;
      if (particle.y < -20) particle.y = h + 20;
      if (particle.y > h + 20) particle.y = -20;
    }
  }

  function drawParticles() {
    const limit = isLite ? 0 : 120;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (limit) {
        const maxJ = Math.min(particles.length, i + 22);
        for (let j = i + 1; j < maxJ; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < limit * limit) {
            const distance = Math.sqrt(distanceSq);
            ctx.strokeStyle = `rgba(103,226,255,${(1 - distance / limit) * (0.16 + boostEnergy * 0.2)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      const pointerBoost = pointer.active ? Math.max(0, 1 - Math.hypot(a.x - pointer.x, a.y - pointer.y) / (isLite ? 140 : 210)) : 0;
      ctx.fillStyle = `hsla(${a.hue},100%,${72 + pointerBoost * 18}%,${isLite ? 0.52 + pointerBoost * 0.22 + boostEnergy * 0.1 : 0.6 + pointerBoost * 0.3 + boostEnergy * 0.14})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + pointerBoost * (isLite ? 1.7 : 3.4) + boostEnergy * (isLite ? 0.7 : 1.3), 0, Math.PI * 2);
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
    videoEnergy += ((videoPlaying ? 1 : 0) - videoEnergy) * (isLite ? 0.08 : 0.045);
    ctx.clearRect(0, 0, w, h);
    drawBackground(time);
    drawBeams(time);
    drawRibbons(time);
    drawLogoHalo(time);
    drawEqualizer(time);
    drawBoostFlash();
    drawPointerGlow();
    drawSparks();
    updateParticles();
    drawParticles();
    boostEnergy *= isLite ? 0.88 : 0.925;
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
