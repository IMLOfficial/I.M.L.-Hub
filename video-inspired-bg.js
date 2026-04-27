(() => {
  const canvas = document.getElementById("bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const coarse = matchMedia("(pointer: coarse)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const palettes = [
    ["#29d9ff", "#7d5dff", "#ff3fb4"],
    ["#55fff1", "#3389ff", "#0c2450"],
    ["#ff76da", "#7ba8ff", "#4a1f93"],
    ["#83eaff", "#2457ff", "#050711"]
  ];

  let w = innerWidth;
  let h = innerHeight;
  let dpr = 1;
  let raf = 0;
  let last = 0;
  let lastStrike = 0;
  let mood = 0;
  let lowPower = localStorage.getItem("imlLowPower") === "true" || navigator.connection?.saveData || reduced.matches;
  let lite = false;
  let boost = 0;
  let videoEnergy = 0;
  let videoPlaying = false;
  let particles = [];
  let bolts = [];
  let flashes = [];
  const pointer = { x: innerWidth / 2, y: innerHeight * 0.32, active: false, last: 0 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);

  function updateMode() {
    lite = lowPower || coarse.matches || innerWidth < 760 || (navigator.hardwareConcurrency || 8) < 5;
  }

  function resize() {
    updateMode();
    w = innerWidth;
    h = innerHeight;
    dpr = lite ? 1 : Math.min(devicePixelRatio || 1, 1.25);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = clamp(Math.floor((w * h) / (lite ? 46000 : 28000)), lite ? 16 : 32, lite ? 34 : 70);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.22, 0.22),
      vy: rand(-0.22, 0.22),
      r: rand(0.8, lite ? 1.7 : 2.2),
      hue: rand(185, 225)
    }));
  }

  function lightning(x1, y1, x2, y2, power = 1, branch = false) {
    const steps = lite ? 8 : 13;
    const points = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const wobble = (lite ? 18 : 34) * power * (branch ? 0.45 : 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const offset = (Math.random() - 0.5) * wobble * Math.sin(Math.PI * t);
      points.push({ x: x1 + dx * t + nx * offset, y: y1 + dy * t + ny * offset });
    }
    const colors = palettes[mood];
    return { points, life: 1, width: (branch ? 1 : 2.1) + power * (branch ? 1.2 : 2.2), color: colors[Math.floor(Math.random() * 2)], glow: colors[2] };
  }

  function strike(x = rand(w * 0.12, w * 0.88), y = rand(h * 0.08, h * 0.55), power = 1) {
    if (reduced.matches && power < 1.2) return;
    const main = lightning(clamp(x + rand(-w * 0.15, w * 0.15), 0, w), rand(-40, 20), x, clamp(y + rand(70, lite ? 170 : 260), 0, h), power);
    bolts.push(main);
    if (!lite || power > 1.15) {
      const branches = lite ? 1 : 3;
      for (let i = 0; i < branches; i++) {
        const p = main.points[Math.floor(rand(2, main.points.length - 2))];
        bolts.push(lightning(p.x, p.y, p.x + rand(-110, 110), p.y + rand(35, 145), power * 0.62, true));
      }
    }
    flashes.push({ x, y, life: 1, power });
    bolts = bolts.slice(lite ? -9 : -20);
    flashes = flashes.slice(-7);
  }

  function boostAt(x = pointer.x, y = pointer.y, power = 1.1) {
    pointer.x = clamp(x, 0, w);
    pointer.y = clamp(y, 0, h);
    pointer.active = true;
    boost = Math.max(boost, power);
    strike(pointer.x, pointer.y, power);
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

  function setMood(index, source) {
    mood = clamp(Number(index || 0), 0, palettes.length - 1);
    const colors = palettes[mood];
    document.querySelectorAll("#moodControls [data-mood]").forEach(button => button.classList.toggle("active", Number(button.dataset.mood) === mood));
    const panel = document.getElementById("moodControls")?.closest(".hub-panel");
    if (panel) {
      panel.style.setProperty("--vibe-a", colors[0]);
      panel.style.setProperty("--vibe-b", colors[1]);
      panel.style.setProperty("--vibe-c", colors[2]);
    }
    const rect = source?.getBoundingClientRect?.();
    boostAt(rect ? rect.left + rect.width / 2 : w / 2, rect ? rect.top + rect.height / 2 : h * 0.3, 0.86);
  }

  function addControls() {
    const controls = document.getElementById("moodControls");
    if (!controls || controls.dataset.lightningReady === "true") return;
    controls.dataset.lightningReady = "true";
    controls.classList.add("vibe-deck");
    if (!document.getElementById("imlLightningControls")) {
      const style = document.createElement("style");
      style.id = "imlLightningControls";
      style.textContent = `
        .hub-panel{position:relative;overflow:hidden;--vibe-a:#29d9ff;--vibe-b:#7d5dff;--vibe-c:#ff3fb4}
        .hub-panel::before{content:"";position:absolute;inset:-1px;z-index:-1;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--vibe-a) 28%,transparent),transparent 44%),linear-gradient(120deg,transparent,color-mix(in srgb,var(--vibe-c) 18%,transparent),transparent);opacity:.86}
        .vibe-deck button{position:relative;isolation:isolate;overflow:hidden;gap:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);box-shadow:none;transition:transform .16s ease,border-color .16s ease,background .16s ease}
        .vibe-deck button:hover,.vibe-deck button:focus-visible,.vibe-deck button.active{filter:none;transform:translateY(-2px);border-color:rgba(255,255,255,.34)}
        .vibe-deck button.active{background:linear-gradient(135deg,var(--vibe-a),var(--vibe-b))}
        .vibe-dot{width:10px;height:10px;border-radius:50%;background:var(--vibe-a);box-shadow:0 0 0 4px color-mix(in srgb,var(--vibe-a) 18%,transparent),0 0 13px var(--vibe-a);flex:0 0 auto}
        .vibe-bolt{position:absolute;right:10px;top:7px;width:8px;height:14px;transform:skew(-18deg);background:linear-gradient(180deg,#fff,var(--vibe-c));box-shadow:0 0 12px var(--vibe-c);clip-path:polygon(40% 0,100% 0,62% 46%,100% 46%,25% 100%,45% 56%,0 56%)}
        .vibe-deck button.utility{--vibe-a:#fff;--vibe-b:#ff0033;--vibe-c:#83eaff}
        #boostButton.flash{animation:boostButtonPop .62s ease-out;box-shadow:0 0 30px rgba(255,255,255,.22),0 0 44px rgba(255,0,51,.5)}
        #lowPowerButton[aria-pressed="true"]{background:#fff;color:#050505}
        .energy-meter{display:grid;grid-template-columns:repeat(14,1fr);align-items:end;gap:4px;width:min(100%,380px);height:34px;margin:16px auto 0;padding:0 6px}
        .energy-meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(180deg,#fff,#54d9ff 44%,rgba(255,0,51,.25));transform:scaleY(.24);transform-origin:bottom;animation:meterPulse 1.6s ease-in-out infinite;animation-delay:calc(var(--i)*-.06s)}
        .energy-meter.boost span{animation-duration:.42s}
        @keyframes meterPulse{0%,100%{transform:scaleY(.24);opacity:.48}45%{transform:scaleY(calc(.36 + var(--level)*.58));opacity:.94}70%{transform:scaleY(calc(.22 + var(--level)*.78));opacity:1}}
        @keyframes boostButtonPop{0%{transform:scale(.95)}40%{transform:scale(1.1)}100%{transform:scale(1)}}
        @media (max-width:640px){.vibe-deck button{flex:1 1 128px}.energy-meter{height:26px;gap:3px}.energy-meter span{animation-duration:2.2s}}
        @media (prefers-reduced-motion:reduce){.vibe-deck button,.energy-meter span{animation:none;transition:none}.energy-meter span{transform:scaleY(.42)}}
      `;
      document.head.appendChild(style);
    }

    controls.querySelectorAll("[data-mood]").forEach((button, index) => {
      const colors = palettes[index % palettes.length];
      const label = button.textContent.trim();
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

    const lightning = addButton("boostButton", "Lightning");
    const surprise = addButton("randomMoodButton", "Surprise");
    const saver = addButton("lowPowerButton", "Saver");
    saver.setAttribute("aria-pressed", String(lowPower));

    if (!document.getElementById("energyMeter")) {
      const meter = document.createElement("div");
      meter.id = "energyMeter";
      meter.className = "energy-meter";
      meter.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 14; i++) {
        const bar = document.createElement("span");
        bar.style.setProperty("--i", i);
        bar.style.setProperty("--level", rand(0.25, 1).toFixed(2));
        meter.appendChild(bar);
      }
      controls.insertAdjacentElement("afterend", meter);
    }

    controls.addEventListener("click", event => {
      const moodButton = event.target.closest("[data-mood]");
      if (moodButton) setMood(moodButton.dataset.mood, moodButton);
    });
    lightning.addEventListener("click", event => boostAt(event.clientX || w / 2, event.clientY || h * 0.34, 1.4));
    surprise.addEventListener("click", () => {
      const buttons = [...controls.querySelectorAll("[data-mood]")];
      const current = Number(controls.querySelector("[data-mood].active")?.dataset.mood || mood);
      const choices = buttons.filter(button => Number(button.dataset.mood) !== current);
      const next = choices[Math.floor(Math.random() * choices.length)] || buttons[0];
      if (next) setMood(next.dataset.mood, next);
    });
    saver.addEventListener("click", () => {
      lowPower = !lowPower;
      localStorage.setItem("imlLowPower", String(lowPower));
      saver.setAttribute("aria-pressed", String(lowPower));
      resize();
      boostAt(w / 2, h * 0.3, 0.7);
    });
    setMood(controls.querySelector("[data-mood].active")?.dataset.mood || 0, controls.querySelector("[data-mood].active"));
  }

  function drawBackground(time) {
    const colors = palettes[mood];
    const cx = w * (0.5 + Math.sin(time * 0.00013) * 0.1);
    const glow = ctx.createRadialGradient(cx, h * 0.18, 0, cx, h * 0.18, Math.max(w, h) * 0.9);
    glow.addColorStop(0, `${colors[0]}44`);
    glow.addColorStop(0.34, `${colors[1]}1f`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  function drawParticles() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    particles.forEach(p => {
      if (pointer.active && !lite) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 190) {
          const push = (190 - dist) / 190;
          p.vx += (dx / dist) * push * 0.018;
          p.vy += (dy / dist) * push * 0.018;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.992;
      p.vy *= 0.992;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      ctx.fillStyle = `hsla(${p.hue + mood * 16},100%,74%,.58)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + boost * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawBolts() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    bolts = bolts.filter(bolt => (bolt.life *= lite ? 0.72 : 0.78) > 0.04);
    bolts.forEach(bolt => {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowColor = bolt.glow;
      ctx.shadowBlur = lite ? 8 : 18;
      ctx.strokeStyle = bolt.color;
      ctx.globalAlpha = bolt.life;
      ctx.lineWidth = bolt.width;
      ctx.beginPath();
      bolt.points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.stroke();
      ctx.globalAlpha = bolt.life * 0.9;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(0.8, bolt.width * 0.34);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawFlashes() {
    flashes = flashes.filter(flash => (flash.life *= lite ? 0.78 : 0.84) > 0.04);
    const colors = palettes[mood];
    flashes.forEach(flash => {
      const radius = (lite ? 120 : 210) * flash.power * flash.life;
      const grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius);
      grad.addColorStop(0, `rgba(255,255,255,${0.18 * flash.life})`);
      grad.addColorStop(0.26, `${colors[0]}55`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
  }

  function drawEqualizer(time) {
    if (lowPower) return;
    const colors = palettes[mood];
    const bars = lite ? 24 : 48;
    const width = w / bars;
    const base = h - 6;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < bars; i++) {
      const beat = (Math.sin(time * (0.0038 + videoEnergy * 0.001) + i * 0.62) + 1) * 0.5;
      const height = 12 + beat * (lite ? 26 : 46) + boost * (lite ? 16 : 36);
      const grad = ctx.createLinearGradient(0, base - height, 0, base);
      grad.addColorStop(0, `${colors[0]}cc`);
      grad.addColorStop(0.55, `${colors[2]}66`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(i * width + width * 0.32, base - height, Math.max(2, width * 0.34), height);
    }
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
    videoEnergy += ((videoPlaying ? 1 : 0) - videoEnergy) * 0.07;
    ctx.clearRect(0, 0, w, h);
    drawBackground(time);
    drawFlashes();
    drawEqualizer(time);
    drawBolts();
    drawParticles();
    const interval = (lite ? 3800 : 2300) - videoEnergy * 650 - boost * 520;
    if (time - lastStrike > Math.max(900, interval)) {
      lastStrike = time;
      strike(rand(w * 0.14, w * 0.86), rand(h * 0.08, h * 0.55), 0.75 + videoEnergy * 0.35);
    }
    boost *= lite ? 0.86 : 0.9;
  }

  function movePointer(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    const now = performance.now();
    if (!lite && now - pointer.last > 850) {
      pointer.last = now;
      strike(pointer.x, pointer.y, 0.62);
    }
  }

  addEventListener("iml:mood", event => setMood(event.detail?.mood || 0));
  addEventListener("iml:boost", event => {
    const detail = event.detail || {};
    boostAt(detail.x || pointer.x || w / 2, detail.y || pointer.y || h * 0.35, detail.power || 1.1);
  });
  addEventListener("iml:video-state", event => {
    videoPlaying = Boolean(event.detail?.playing);
    if (videoPlaying) boostAt(w / 2, Math.min(280, h * 0.3), 1);
  });
  if (!coarse.matches) addEventListener("pointermove", movePointer, { passive: true });
  addEventListener("pointerdown", event => boostAt(event.clientX, event.clientY, 1.18), { passive: true });
  addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(resize), { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !raf) raf = requestAnimationFrame(animate);
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addControls, { once: true });
  else setTimeout(addControls, 0);

  resize();
  raf = requestAnimationFrame(animate);
})();
