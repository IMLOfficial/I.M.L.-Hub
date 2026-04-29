(() => {
  const canvas = document.getElementById("bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  const palettes = [
    ["#28d9ff", "#7864ff", "#ff3fb3"],
    ["#58fff0", "#2f8dff", "#0a2b61"],
    ["#ff72d7", "#87a6ff", "#4e2494"],
    ["#a9f4ff", "#315cff", "#070912"]
  ];

  let w = innerWidth;
  let h = innerHeight;
  let dpr = 1;
  let lite = false;
  let lowPower = localStorage.getItem("imlLowPower") === "true" || reduced.matches || navigator.connection?.saveData;
  let mood = 0;
  let boost = 0;
  let videoEnergy = 0;
  let videoPlaying = false;
  let last = 0;
  let lastStrike = 0;
  let raf = 0;
  let particles = [];
  let bolts = [];
  let sparks = [];
  let rings = [];
  let waves = [];
  const pointer = { x: innerWidth / 2, y: innerHeight * 0.34, active: false, last: 0 };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  function isLite() {
    return lowPower || coarse.matches || innerWidth < 760 || (navigator.hardwareConcurrency || 8) < 5;
  }

  function resize() {
    lite = isLite();
    w = innerWidth;
    h = innerHeight;
    dpr = lite ? 1 : Math.min(devicePixelRatio || 1, 1.3);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = clamp(Math.floor((w * h) / (lite ? 36000 : 17500)), lite ? 24 : 68, lite ? 62 : 150);
    particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-0.16, 0.16),
      vy: rand(-0.16, 0.16),
      r: rand(0.7, lite ? 1.6 : 2.35),
      phase: rand(0, Math.PI * 2),
      depth: rand(0.35, 1.35),
      hue: rand(184, 232),
      pull: Math.random() > 0.68 ? -1 : 1
    }));

    waves = Array.from({ length: lite ? 3 : 7 }, (_, index) => ({
      offset: index / (lite ? 3 : 7),
      speed: rand(0.00022, 0.00048),
      bend: rand(0.08, 0.25),
      hue: rand(185, 315),
      width: rand(lite ? 1.2 : 2.0, lite ? 3.0 : 5.8)
    }));
  }

  function edgePoint(side = Math.floor(rand(0, 4)), margin = lite ? 42 : 105) {
    if (side === 0) return { x: rand(-margin, w + margin), y: -margin, side };
    if (side === 1) return { x: w + margin, y: rand(-margin, h + margin), side };
    if (side === 2) return { x: rand(-margin, w + margin), y: h + margin, side };
    return { x: -margin, y: rand(-margin, h + margin), side: 3 };
  }

  function makeBolt(x1, y1, x2, y2, power = 1, branch = false) {
    const steps = lite ? (branch ? 6 : 10) : (branch ? 9 : 18);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const wobble = (lite ? 24 : 66) * power * (branch ? 0.5 : 1);
    const bow = (lite ? 40 : 145) * power * rand(-1, 1) * (branch ? 0.35 : 1);
    const waveA = rand(1.4, 3.7);
    const waveB = rand(4.0, 8.6);
    const phaseA = rand(0, Math.PI * 2);
    const phaseB = rand(0, Math.PI * 2);
    let offset = 0;
    const points = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ease = Math.sin(Math.PI * t);
      const curve = Math.sin((t - 0.5) * Math.PI) * bow * ease;
      const noise = (Math.random() - 0.5) * wobble * ease;
      const ripple = (Math.sin(t * Math.PI * waveA + phaseA) * 0.65 + Math.sin(t * Math.PI * waveB + phaseB) * 0.3) * wobble * ease;
      const along = (Math.random() - 0.5) * (branch ? 14 : 36) * power * ease;
      offset = offset * 0.42 + curve + noise + ripple;
      points.push({
        x: x1 + dx * t + nx * offset + (dx / length) * along,
        y: y1 + dy * t + ny * offset + (dy / length) * along
      });
    }

    const colors = palettes[mood];
    return {
      points,
      branch,
      life: 1,
      age: 0,
      drift: rand(-0.75, 0.75),
      tremble: rand(0.7, 1.55),
      flicker: rand(0.7, 1.25),
      width: (branch ? 0.85 : 2.0) + power * (branch ? 1.1 : 2.45),
      color: colors[Math.floor(rand(0, 2))],
      glow: colors[2]
    };
  }

  function strike(x = rand(w * 0.12, w * 0.88), y = rand(h * 0.08, h * 0.74), power = 1) {
    if (reduced.matches && power < 1.2) return;

    const target = {
      x: clamp(x + rand(-w * 0.08, w * 0.08), 0, w),
      y: clamp(y + rand(-h * 0.08, h * 0.08), 0, h)
    };
    const start = edgePoint();
    const crossScreen = !lite && Math.random() < 0.34;
    const end = crossScreen ? edgePoint((start.side + 1 + Math.floor(rand(0, 3))) % 4) : target;
    const main = makeBolt(start.x, start.y, end.x, end.y, power);
    bolts.push(main);

    const branchCount = lite ? 1 : 4;
    if (!lite || power > 1.12) {
      for (let i = 0; i < branchCount; i++) {
        const index = Math.floor(rand(2, main.points.length - 2));
        const point = main.points[index];
        const next = main.points[Math.min(main.points.length - 1, index + 1)] || point;
        const angle = Math.atan2(next.y - point.y, next.x - point.x) + rand(-1.45, 1.45);
        const distance = rand(lite ? 55 : 90, lite ? 140 : 270) * power;
        const endPoint = !lite && Math.random() < 0.24 ? edgePoint() : {
          x: point.x + Math.cos(angle) * distance + rand(-72, 72),
          y: point.y + Math.sin(angle) * distance + rand(-72, 72)
        };
        bolts.push(makeBolt(point.x, point.y, endPoint.x, endPoint.y, power * rand(0.42, 0.72), true));
      }
    }

    rings.push({ x: target.x, y: target.y, radius: 0, life: 1, power, hue: 196 + mood * 18 });
    bolts = bolts.slice(lite ? -10 : -28);
    rings = rings.slice(lite ? -8 : -16);
  }

  function addSparks(x, y, count, power = 1) {
    const amount = lite ? Math.ceil(count * 0.44) : count;
    for (let i = 0; i < amount; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1.5, lite ? 5 : 8.2) * power;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(1, lite ? 2.2 : 3.4),
        life: 1,
        hue: 190 + mood * 18 + rand(-20, 38)
      });
    }
    sparks = sparks.slice(lite ? -55 : -140);
  }

  function pointFrom(source, fallbackX = w / 2, fallbackY = h * 0.32) {
    const rect = source?.getBoundingClientRect?.();
    return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: fallbackX, y: fallbackY };
  }

  function hitButton(button, effectClass) {
    if (!button || !effectClass) return;
    button.classList.remove("pulse-hit", "drive-hit", "dream-hit", "night-hit", "boost-hit", "surprise-hit", "saver-hit");
    button.offsetWidth;
    button.classList.add(effectClass);
    setTimeout(() => button.classList.remove(effectClass), 900);
  }

  function setMood(index = 0, source = null, react = true) {
    mood = clamp(Number(index || 0), 0, palettes.length - 1);
    const colors = palettes[mood];
    document.querySelectorAll("#moodControls [data-mood]").forEach(button => {
      const active = Number(button.dataset.mood) === mood;
      button.classList.toggle("active", active);
      button.style.setProperty("--vibe-a", colors[0]);
      button.style.setProperty("--vibe-b", colors[1]);
      button.style.setProperty("--vibe-c", colors[2]);
    });
    const panel = document.getElementById("moodControls")?.closest(".hub-panel");
    if (panel) {
      panel.style.setProperty("--vibe-a", colors[0]);
      panel.style.setProperty("--vibe-b", colors[1]);
      panel.style.setProperty("--vibe-c", colors[2]);
    }
    if (!react) return;

    const point = pointFrom(source);
    pointer.x = point.x;
    pointer.y = point.y;
    pointer.active = true;
    boost = Math.max(boost, 0.76);
    hitButton(source, ["pulse-hit", "drive-hit", "dream-hit", "night-hit"][mood]);
    strike(point.x, point.y, 0.9);
    addSparks(point.x, point.y, mood === 2 ? 42 : 26, mood === 1 ? 1.05 : 0.86);
    if (mood === 3) strike(rand(w * 0.18, w * 0.82), rand(h * 0.12, h * 0.58), 1.02);
  }

  function boostAt(x = pointer.x, y = pointer.y, power = 1.1) {
    pointer.x = clamp(x || w / 2, 0, w);
    pointer.y = clamp(y || h * 0.34, 0, h);
    pointer.active = true;
    boost = Math.max(boost, power);
    strike(pointer.x, pointer.y, power);
    addSparks(pointer.x, pointer.y, lite ? 12 : 28, power);
    document.body.classList.add("iml-boosting");
    document.getElementById("energyMeter")?.classList.add("boost");
    document.getElementById("boostButton")?.classList.add("flash");
    setTimeout(() => {
      document.body.classList.remove("iml-boosting");
      document.getElementById("energyMeter")?.classList.remove("boost");
      document.getElementById("boostButton")?.classList.remove("flash");
      if (lite) pointer.active = false;
    }, 650);
  }

  function ensureControls() {
    const controls = document.getElementById("moodControls");
    if (!controls || controls.dataset.naturalLightningReady === "true") return;
    controls.dataset.naturalLightningReady = "true";
    controls.classList.add("vibe-deck");

    if (!document.getElementById("naturalLightningStyles")) {
      const style = document.createElement("style");
      style.id = "naturalLightningStyles";
      style.textContent = `
        .hub-panel{--vibe-a:#28d9ff;--vibe-b:#7864ff;--vibe-c:#ff3fb3;position:relative;overflow:hidden}
        .hub-panel::before{content:"";position:absolute;inset:-1px;z-index:-1;background:radial-gradient(circle at 50% 0%,rgba(40,217,255,.18),transparent 44%),linear-gradient(120deg,transparent,rgba(255,63,179,.12),transparent);opacity:.86}
        .vibe-deck button{position:relative;isolation:isolate;overflow:hidden;gap:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);box-shadow:none;transition:transform .16s ease,border-color .16s ease,background .16s ease,box-shadow .16s ease}
        .vibe-deck button::before{content:"";position:absolute;inset:-70%;z-index:-1;background:radial-gradient(circle at 28% 38%,var(--vibe-a),transparent 26%),linear-gradient(115deg,transparent 35%,rgba(255,255,255,.22),transparent 62%);opacity:.32;transform:translateX(-28%) rotate(12deg);transition:transform .32s ease,opacity .18s ease}
        .vibe-deck button:hover,.vibe-deck button:focus-visible,.vibe-deck button.active{transform:translateY(-2px);border-color:rgba(255,255,255,.34)}
        .vibe-deck button:hover::before,.vibe-deck button:focus-visible::before,.vibe-deck button.active::before{opacity:.8;transform:translateX(6%) rotate(12deg)}
        .vibe-deck button.active{background:linear-gradient(135deg,var(--vibe-a),var(--vibe-b))}
        .vibe-deck button.utility{--vibe-a:#fff;--vibe-b:#ff335d;--vibe-c:#84f0ff}
        .vibe-dot{width:10px;height:10px;border-radius:50%;background:var(--vibe-a);box-shadow:0 0 0 4px rgba(80,220,255,.16),0 0 13px var(--vibe-a);flex:0 0 auto}
        .vibe-bolt{position:absolute;right:10px;top:7px;width:8px;height:14px;transform:skew(-18deg);background:linear-gradient(180deg,#fff,var(--vibe-c));box-shadow:0 0 12px var(--vibe-c);clip-path:polygon(40% 0,100% 0,62% 46%,100% 46%,25% 100%,45% 56%,0 56%)}
        .energy-meter{display:grid;grid-template-columns:repeat(14,1fr);align-items:end;gap:4px;width:min(100%,380px);height:34px;margin:16px auto 0;padding:0 6px}
        .energy-meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(180deg,#fff,#54d9ff 44%,rgba(255,0,51,.25));transform:scaleY(.25);transform-origin:bottom;animation:meterPulse 1.5s ease-in-out infinite;animation-delay:calc(var(--i)*-.06s)}
        .energy-meter.boost span{animation-duration:.38s}
        #boostButton.flash,.vibe-deck button.boost-hit{box-shadow:0 0 30px rgba(255,255,255,.22),0 0 44px rgba(255,0,51,.5),0 0 70px rgba(83,234,255,.34);animation:boostButtonPop .7s ease-out}
        #lowPowerButton[aria-pressed="true"]{background:#fff;color:#050505}
        .vibe-deck button.pulse-hit{animation:pulseHit .82s ease-out}.vibe-deck button.drive-hit{animation:driveHit .74s ease-out}.vibe-deck button.dream-hit{animation:dreamHit .9s ease-out}.vibe-deck button.night-hit{animation:nightHit .82s ease-out}.vibe-deck button.surprise-hit{animation:surpriseHit .92s ease-out}.vibe-deck button.saver-hit{animation:saverHit .66s ease-out}
        @keyframes meterPulse{0%,100%{transform:scaleY(.25);opacity:.48}48%{transform:scaleY(calc(.36 + var(--level)*.58));opacity:.96}70%{transform:scaleY(calc(.24 + var(--level)*.78));opacity:1}}
        @keyframes boostButtonPop{0%{transform:scale(.95)}40%{transform:scale(1.1)}100%{transform:scale(1)}}@keyframes pulseHit{0%{transform:scale(.96)}38%{transform:scale(1.08);box-shadow:0 0 0 10px rgba(255,63,179,.18),0 0 34px var(--vibe-c)}100%{transform:scale(1);box-shadow:none}}@keyframes driveHit{0%{transform:translateX(-4px)}34%{transform:translateX(9px);box-shadow:22px 0 28px rgba(40,217,255,.24)}68%{transform:translateX(-2px)}100%{transform:translateX(0)}}@keyframes dreamHit{0%{filter:saturate(1);transform:scale(.98)}45%{filter:saturate(1.45) brightness(1.18);transform:scale(1.07) rotate(-1deg);box-shadow:0 0 28px rgba(255,114,215,.42)}100%{filter:saturate(1);transform:scale(1) rotate(0)}}@keyframes nightHit{0%,100%{filter:brightness(1);transform:scale(1)}22%{filter:brightness(1.6);transform:translateY(-3px)}35%{filter:brightness(.7)}54%{filter:brightness(1.35);box-shadow:0 0 30px rgba(40,217,255,.34)}}@keyframes surpriseHit{0%{transform:scale(.92) rotate(-3deg)}30%{transform:scale(1.1) rotate(3deg);box-shadow:0 0 36px #ff72d7}58%{transform:scale(1.02) rotate(-2deg);box-shadow:0 0 36px #54eaff}100%{transform:scale(1) rotate(0)}}@keyframes saverHit{0%{transform:scale(.98)}50%{transform:scale(1.04);filter:brightness(1.25)}100%{transform:scale(1);filter:brightness(1)}}
        @media (max-width:640px){.vibe-deck button{flex:1 1 128px}.energy-meter{height:26px;gap:3px}.energy-meter span{animation-duration:2.2s}}
        @media (prefers-reduced-motion:reduce){.vibe-deck button,.energy-meter span{animation:none;transition:none}.energy-meter span{transform:scaleY(.42)}}
      `;
      document.head.appendChild(style);
    }

    controls.querySelectorAll("[data-mood]").forEach((button, index) => {
      const label = button.textContent.trim();
      const colors = palettes[index % palettes.length];
      button.style.setProperty("--vibe-a", colors[0]);
      button.style.setProperty("--vibe-b", colors[1]);
      button.style.setProperty("--vibe-c", colors[2]);
      if (!button.dataset.decorated) {
        button.dataset.decorated = "true";
        button.innerHTML = `<span class="vibe-dot" aria-hidden="true"></span><span>${label}</span><span class="vibe-bolt" aria-hidden="true"></span>`;
      }
    });

    const addButton = (id, label) => {
      let button = document.getElementById(id);
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.id = id;
        button.className = "utility";
        controls.appendChild(button);
      }
      if (!button.dataset.decorated) {
        button.dataset.decorated = "true";
        button.innerHTML = `<span class="vibe-dot" aria-hidden="true"></span><span>${label}</span><span class="vibe-bolt" aria-hidden="true"></span>`;
      }
      return button;
    };

    const boostButton = addButton("boostButton", "Boost");
    const surpriseButton = addButton("randomMoodButton", "Surprise");
    const saverButton = addButton("lowPowerButton", "Saver");
    saverButton.setAttribute("aria-pressed", String(lowPower));

    if (!document.getElementById("energyMeter")) {
      const meter = document.createElement("div");
      meter.id = "energyMeter";
      meter.className = "energy-meter";
      meter.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 14; i++) {
        const bar = document.createElement("span");
        bar.style.setProperty("--i", i);
        bar.style.setProperty("--level", rand(0.2, 1).toFixed(2));
        meter.appendChild(bar);
      }
      controls.insertAdjacentElement("afterend", meter);
    }

    controls.addEventListener("click", event => {
      const moodButton = event.target.closest("[data-mood]");
      if (moodButton) setMood(moodButton.dataset.mood, moodButton);
    });
    boostButton.addEventListener("click", event => {
      hitButton(boostButton, "boost-hit");
      boostAt(event.clientX || w / 2, event.clientY || h * 0.35, 1.48);
    });
    surpriseButton.addEventListener("click", () => {
      const buttons = [...controls.querySelectorAll("[data-mood]")];
      const current = Number(controls.querySelector("[data-mood].active")?.dataset.mood || mood);
      const next = buttons.filter(button => Number(button.dataset.mood) !== current)[Math.floor(rand(0, Math.max(1, buttons.length - 1)))] || buttons[0];
      if (next) setMood(next.dataset.mood, next);
      hitButton(surpriseButton, "surprise-hit");
      boostAt(rand(w * 0.15, w * 0.85), rand(h * 0.12, h * 0.62), 1.08);
    });
    saverButton.addEventListener("click", () => {
      lowPower = !lowPower;
      localStorage.setItem("imlLowPower", String(lowPower));
      saverButton.setAttribute("aria-pressed", String(lowPower));
      resize();
      hitButton(saverButton, "saver-hit");
      boostAt(w / 2, h * 0.3, 0.72);
    });

    setMood(controls.querySelector("[data-mood].active")?.dataset.mood || 0, null, false);
  }

  function drawBackground(time) {
    const colors = palettes[mood];
    const centerX = w * (0.5 + Math.sin(time * 0.00016) * 0.12);
    const centerY = h * (0.18 + videoEnergy * 0.12);
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.92);
    glow.addColorStop(0, `${colors[0]}44`);
    glow.addColorStop(0.34, `${colors[1]}24`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  function drawWaves(time) {
    if (lowPower) return;
    const colors = palettes[mood];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    waves.forEach((line, index) => {
      const drift = time * line.speed + line.offset * Math.PI * 2;
      const anchorY = h * (0.16 + line.offset * 0.7);
      const pullX = pointer.active ? (pointer.x - w / 2) * (lite ? 0.035 : 0.07) : 0;
      const pullY = pointer.active ? (pointer.y - h / 2) * (lite ? 0.018 : 0.035) : 0;
      const y1 = anchorY + Math.sin(drift) * h * line.bend + pullY;
      const y2 = anchorY + Math.cos(drift * 1.18 + index) * h * line.bend * 1.35 - pullY * 0.45;
      const midX = w * (0.42 + Math.sin(drift * 0.7) * 0.2) + pullX;
      const midY = anchorY + Math.sin(drift * 1.45 + index) * h * line.bend * 1.7 + pullY;
      const grad = ctx.createLinearGradient(-w * 0.12, y1, w * 1.12, y2);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.24, `${colors[0]}20`);
      grad.addColorStop(0.52, `hsla(${line.hue + mood * 12},100%,70%,${0.16 + videoEnergy * 0.11 + boost * 0.08})`);
      grad.addColorStop(0.78, `${colors[2]}1d`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = line.width + boost * 1.8 + videoEnergy * 1.5;
      ctx.shadowColor = colors[index % colors.length];
      ctx.shadowBlur = lite ? 8 : 20;
      ctx.beginPath();
      ctx.moveTo(-w * 0.12, y1);
      ctx.bezierCurveTo(w * 0.18, y1 - h * 0.12, midX, midY, w * 1.12, y2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawParticles(time) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    if (!lite) {
      let links = 0;
      ctx.lineWidth = 0.75;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length && links < 500; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 112) {
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2 + mood * 14},100%,72%,${(1 - dist / 112) * (0.1 + videoEnergy * 0.08 + boost * 0.05)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            links++;
          }
        }
      }
    }

    particles.forEach(particle => {
      const wave = time * 0.0005 + particle.phase;
      particle.vx += Math.sin(wave) * 0.0026 * particle.depth;
      particle.vy += Math.cos(wave * 1.25) * 0.0022 * particle.depth;
      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        const range = lite ? 145 : 285;
        if (dist < range) {
          const pull = (range - dist) / range;
          particle.vx += (-dy / dist) * pull * particle.pull * (lite ? 0.006 : 0.014);
          particle.vy += (dx / dist) * pull * particle.pull * (lite ? 0.006 : 0.014);
        }
      }
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.988;
      particle.vy *= 0.988;
      if (particle.x < -10) particle.x = w + 10;
      if (particle.x > w + 10) particle.x = -10;
      if (particle.y < -10) particle.y = h + 10;
      if (particle.y > h + 10) particle.y = -10;

      const pulse = clamp(0.52 + Math.sin(time * 0.003 + particle.phase) * 0.23 + videoEnergy * 0.25 + boost * 0.18, 0.16, 0.96);
      ctx.fillStyle = `hsla(${particle.hue + mood * 16},100%,74%,${pulse})`;
      ctx.shadowColor = `hsla(${particle.hue + mood * 16},100%,72%,${pulse})`;
      ctx.shadowBlur = lite ? 3 : 8 + particle.depth * 5 + boost * 6;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r + boost * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawBolts(time) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    bolts = bolts.filter(bolt => (bolt.life *= lite ? 0.74 : 0.82) > 0.04);
    bolts.forEach(bolt => {
      bolt.age += lite ? 0.16 : 0.24;
      const flicker = clamp((0.72 + Math.sin(time * 0.035 + bolt.flicker * 7) * 0.22) * (0.9 + Math.random() * 0.18), 0.35, 1.2);
      const animated = bolt.points.map((point, index) => {
        if (index === 0 || index === bolt.points.length - 1) return point;
        const prev = bolt.points[index - 1] || point;
        const next = bolt.points[index + 1] || point;
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const length = Math.hypot(dx, dy) || 1;
        const nx = -dy / length;
        const ny = dx / length;
        const jitter = (lite ? 2.0 : 5.6) * (bolt.branch ? 0.56 : 1) * Math.sin(time * 0.018 * bolt.tremble + index * 1.7 + bolt.flicker * 5);
        return {
          x: point.x + nx * jitter + bolt.drift * bolt.age,
          y: point.y + ny * jitter + Math.cos(time * 0.014 + index) * jitter * 0.22
        };
      });
      const path = () => {
        ctx.beginPath();
        animated.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.stroke();
      };
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = bolt.glow;
      ctx.shadowBlur = lite ? 10 : 25;
      ctx.strokeStyle = bolt.glow;
      ctx.globalAlpha = bolt.life * 0.42 * flicker;
      ctx.lineWidth = bolt.width * (lite ? 2.4 : 3.6);
      path();
      ctx.strokeStyle = bolt.color;
      ctx.globalAlpha = bolt.life * 0.84 * flicker;
      ctx.lineWidth = bolt.width * 1.08;
      path();
      ctx.strokeStyle = "#fff";
      ctx.globalAlpha = bolt.life * flicker;
      ctx.lineWidth = Math.max(0.8, bolt.width * 0.34);
      path();
    });
    ctx.restore();
  }

  function drawReactions() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    rings = rings.filter(ring => (ring.life *= lite ? 0.82 : 0.88) > 0.035);
    rings.forEach(ring => {
      ring.radius += (lite ? 8 : 13) * ring.power + boost * 7;
      ctx.strokeStyle = `hsla(${ring.hue},100%,72%,${ring.life * 0.72})`;
      ctx.lineWidth = (lite ? 1.6 : 2.4) + ring.life * 4;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    sparks = sparks.filter(spark => (spark.life *= lite ? 0.84 : 0.9) > 0.035);
    sparks.forEach(spark => {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.965;
      spark.vy *= 0.965;
      ctx.fillStyle = `hsla(${spark.hue},100%,73%,${spark.life})`;
      ctx.shadowColor = `hsla(${spark.hue},100%,73%,${spark.life})`;
      ctx.shadowBlur = lite ? 5 : 13;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size + spark.life * (lite ? 1.2 : 2.3), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function animate(time = 0) {
    if (document.hidden) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);
    const gap = reduced.matches ? 220 : lite ? 64 : 34;
    if (time - last < gap) return;
    last = time;
    videoEnergy += ((videoPlaying ? 1 : 0) - videoEnergy) * 0.075;
    ctx.clearRect(0, 0, w, h);
    drawBackground(time);
    drawWaves(time);
    drawReactions();
    drawBolts(time);
    drawParticles(time);

    const interval = (lite ? 3900 : 2200) - videoEnergy * 650 - boost * 520;
    if (time - lastStrike > Math.max(840, interval)) {
      lastStrike = time;
      strike(rand(w * 0.1, w * 0.9), rand(h * 0.08, h * 0.74), 0.75 + videoEnergy * 0.38);
    }
    boost *= lite ? 0.86 : 0.9;
  }

  function movePointer(event) {
    const lastX = pointer.x;
    const lastY = pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    const now = performance.now();
    const distance = Math.hypot(pointer.x - lastX, pointer.y - lastY);
    if (!lite && distance > 46 && now - pointer.last > 150) {
      pointer.last = now;
      bolts.push(makeBolt(lastX, lastY, pointer.x, pointer.y, 0.35 + Math.min(distance / 420, 0.34), true));
      bolts = bolts.slice(-28);
      boost = Math.max(boost, 0.2);
    } else if (!lite && now - pointer.last > 950) {
      pointer.last = now;
      strike(pointer.x, pointer.y, 0.58);
    }
  }

  addEventListener("iml:mood", event => setMood(event.detail?.mood || 0));
  addEventListener("iml:boost", event => {
    const detail = event.detail || {};
    boostAt(detail.x || pointer.x || w / 2, detail.y || pointer.y || h * 0.35, detail.power || 1.05);
  });
  addEventListener("iml:video-state", event => {
    videoPlaying = Boolean(event.detail?.playing);
    if (videoPlaying) boostAt(w / 2, Math.min(300, h * 0.32), 1);
  });
  if (!coarse.matches) addEventListener("pointermove", movePointer, { passive: true });
  addEventListener("pointerdown", event => {
    if (event.target?.closest?.("#moodControls")) return;
    boostAt(event.clientX, event.clientY, 1.18);
  }, { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(resize), { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !raf) raf = requestAnimationFrame(animate);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureControls, { once: true });
  else setTimeout(ensureControls, 0);
  resize();
  raf = requestAnimationFrame(animate);
})();
