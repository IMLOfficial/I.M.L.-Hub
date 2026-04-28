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
  let rings = [];
  let sparks = [];
  let streaks = [];
  let filaments = [];
  const pointer = { x: innerWidth / 2, y: innerHeight * 0.32, active: false, last: 0 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const rand = (min, max) => min + Math.random() * (max - min);
  const moodEffects = ["pulse-hit", "drive-hit", "dream-hit", "night-hit"];

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
    const count = clamp(Math.floor((w * h) / (lite ? 33000 : 16500)), lite ? 28 : 72, lite ? 68 : 150);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.16, 0.16),
      vy: rand(-0.16, 0.16),
      r: rand(0.55, lite ? 1.55 : 2.25),
      depth: rand(0.35, 1.35),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.7, 1.65),
      hue: rand(182, 232),
      magnet: Math.random() > 0.72
    }));
    filaments = Array.from({ length: lite ? 3 : 7 }, (_, index) => ({
      offset: index / (lite ? 3 : 7),
      speed: rand(0.00022, 0.00048),
      bend: rand(0.08, 0.28),
      hue: rand(184, 316),
      width: rand(lite ? 1.4 : 2.1, lite ? 3.2 : 6.2)
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
    return {
      points,
      life: 1,
      age: 0,
      flicker: rand(0.72, 1.16),
      drift: rand(-0.55, 0.55),
      branch,
      width: (branch ? 1 : 2.1) + power * (branch ? 1.2 : 2.2),
      color: colors[Math.floor(Math.random() * 2)],
      glow: colors[2]
    };
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

  function pointFrom(source, fallbackX = w / 2, fallbackY = h * 0.32) {
    const rect = source?.getBoundingClientRect?.();
    return {
      x: rect ? rect.left + rect.width / 2 : fallbackX,
      y: rect ? rect.top + rect.height / 2 : fallbackY
    };
  }

  function hitButton(button, effectClass) {
    if (!button || !effectClass) return;
    button.classList.remove("pulse-hit", "drive-hit", "dream-hit", "night-hit", "boost-hit", "surprise-hit", "saver-hit");
    button.offsetWidth;
    button.classList.add(effectClass);
    setTimeout(() => button.classList.remove(effectClass), 900);
  }

  function addRings(x, y, count, power = 1, hue = 190) {
    const amount = lite ? Math.max(1, Math.ceil(count * 0.55)) : count;
    for (let i = 0; i < amount; i++) rings.push({ x, y, radius: i * (lite ? 16 : 24), life: 1 - i * 0.08, power, hue: hue + i * 18 });
    rings = rings.slice(lite ? -10 : -22);
  }

  function addSparks(x, y, count, power = 1, hue = 190) {
    const amount = lite ? Math.max(6, Math.ceil(count * 0.45)) : count;
    for (let i = 0; i < amount; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(lite ? 1.5 : 2.4, lite ? 5.2 : 8.5) * power;
      sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: rand(1, lite ? 2.2 : 3.6), hue: hue + rand(-18, 42) });
    }
    sparks = sparks.slice(lite ? -58 : -140);
  }

  function addStreaks(kind, count, power = 1, hue = 195) {
    const amount = lite ? Math.max(5, Math.ceil(count * 0.45)) : count;
    for (let i = 0; i < amount; i++) {
      const isNight = kind === "night";
      const fromLeft = Math.random() > 0.5;
      streaks.push({
        x: isNight ? rand(w * 0.08, w * 0.92) : (fromLeft ? rand(-w * 0.18, w * 0.35) : rand(w * 0.65, w * 1.18)),
        y: isNight ? rand(-40, h * 0.45) : rand(h * 0.18, h * 0.82),
        vx: isNight ? rand(-1.2, 1.2) : (fromLeft ? rand(7, 16) : -rand(7, 16)) * power,
        vy: isNight ? rand(7, 15) * power : rand(-0.9, 0.9),
        length: rand(lite ? 48 : 80, lite ? 120 : 230) * power,
        life: 1,
        width: rand(1.2, lite ? 2.2 : 3.4),
        hue: hue + rand(-18, 34)
      });
    }
    streaks = streaks.slice(lite ? -36 : -92);
  }

  function moodReaction(index, source) {
    const point = pointFrom(source);
    pointer.x = point.x;
    pointer.y = point.y;
    pointer.active = true;
    hitButton(source, moodEffects[index]);
    flashes.push({ x: point.x, y: point.y, life: 1, power: 0.6 + index * 0.08 });

    if (index === 0) {
      boost = Math.max(boost, 0.8);
      addRings(point.x, point.y, 4, 1.08, 192);
      addSparks(point.x, point.y, 28, 0.86, 192);
    } else if (index === 1) {
      boost = Math.max(boost, 0.62);
      addStreaks("drive", 28, 1.05, 198);
      flashes.push({ x: w * 0.18, y: point.y, life: 0.9, power: 0.55 });
    } else if (index === 2) {
      boost = Math.max(boost, 0.74);
      addSparks(point.x, point.y, 46, 1.04, 304);
      addRings(w / 2, h * 0.24, 3, 0.92, 292);
    } else {
      boost = Math.max(boost, 0.92);
      addStreaks("night", 22, 1.08, 205);
      addSparks(point.x, point.y, 22, 0.78, 218);
      strike(point.x, point.y, 1.04);
    }

    if (lite) setTimeout(() => { pointer.active = false; }, 700);
  }

  function lightningReaction(source, event) {
    const point = event?.clientX ? { x: event.clientX, y: event.clientY } : pointFrom(source);
    hitButton(source, "boost-hit");
    boostAt(point.x, point.y, 1.5);
    addRings(point.x, point.y, 5, 1.35, 208);
    addSparks(point.x, point.y, 42, 1.18, 208);
    const extra = lite ? 1 : 4;
    for (let i = 0; i < extra; i++) strike(rand(w * 0.12, w * 0.88), rand(h * 0.08, h * 0.5), 0.82 + i * 0.12);
  }

  function surpriseReaction(source) {
    const point = pointFrom(source);
    hitButton(source, "surprise-hit");
    addRings(point.x, point.y, 4, 1.1, 286);
    addSparks(point.x, point.y, 36, 1.04, 286);
    addStreaks("drive", 18, 0.82, 186);
    if (!lite) strike(rand(w * 0.2, w * 0.8), rand(h * 0.1, h * 0.44), 0.86);
    boost = Math.max(boost, 1.05);
  }

  function boostAt(x = pointer.x, y = pointer.y, power = 1.1) {
    pointer.x = clamp(x, 0, w);
    pointer.y = clamp(y, 0, h);
    pointer.active = true;
    boost = Math.max(boost, power);
    strike(pointer.x, pointer.y, power);
    if (!reduced.matches) {
      addSparks(pointer.x, pointer.y, lite ? 10 : 24, Math.max(0.72, power * 0.75), 196 + mood * 18);
      if (power > 0.82) addRings(pointer.x, pointer.y, lite ? 1 : 2, power * 0.72, 198 + mood * 18);
    }
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

  function setMood(index, source, react = true) {
    mood = clamp(Number(index || 0), 0, palettes.length - 1);
    const colors = palettes[mood];
    document.querySelectorAll("#moodControls [data-mood]").forEach(button => button.classList.toggle("active", Number(button.dataset.mood) === mood));
    const panel = document.getElementById("moodControls")?.closest(".hub-panel");
    if (panel) {
      panel.style.setProperty("--vibe-a", colors[0]);
      panel.style.setProperty("--vibe-b", colors[1]);
      panel.style.setProperty("--vibe-c", colors[2]);
    }
    if (react) moodReaction(mood, source);
    else boost = Math.max(boost, 0.22);
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
        .vibe-deck button{position:relative;isolation:isolate;overflow:hidden;gap:8px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);box-shadow:none;transition:transform .16s ease,border-color .16s ease,background .16s ease,box-shadow .16s ease}
        .vibe-deck button::before{content:"";position:absolute;inset:-60%;z-index:-1;background:radial-gradient(circle at 32% 36%,color-mix(in srgb,var(--vibe-a) 42%,transparent),transparent 28%),linear-gradient(115deg,transparent 35%,rgba(255,255,255,.22),transparent 62%);opacity:.34;transform:translateX(-28%) rotate(12deg);transition:transform .36s ease,opacity .2s ease}
        .vibe-deck button:hover,.vibe-deck button:focus-visible,.vibe-deck button.active{filter:none;transform:translateY(-2px);border-color:rgba(255,255,255,.34)}
        .vibe-deck button:hover::before,.vibe-deck button:focus-visible::before,.vibe-deck button.active::before{opacity:.92;transform:translateX(7%) rotate(12deg)}
        .vibe-deck button.active{background:linear-gradient(135deg,var(--vibe-a),var(--vibe-b))}
        .vibe-dot{width:10px;height:10px;border-radius:50%;background:var(--vibe-a);box-shadow:0 0 0 4px color-mix(in srgb,var(--vibe-a) 18%,transparent),0 0 13px var(--vibe-a);flex:0 0 auto}
        .vibe-bolt{position:absolute;right:10px;top:7px;width:8px;height:14px;transform:skew(-18deg);background:linear-gradient(180deg,#fff,var(--vibe-c));box-shadow:0 0 12px var(--vibe-c);clip-path:polygon(40% 0,100% 0,62% 46%,100% 46%,25% 100%,45% 56%,0 56%)}
        .vibe-deck button.utility{--vibe-a:#fff;--vibe-b:#ff0033;--vibe-c:#83eaff}
        .vibe-deck button.pulse-hit{animation:pulseHit .82s ease-out}
        .vibe-deck button.drive-hit{animation:driveHit .74s ease-out}
        .vibe-deck button.dream-hit{animation:dreamHit .9s ease-out}
        .vibe-deck button.night-hit{animation:nightHit .82s ease-out}
        .vibe-deck button.boost-hit,#boostButton.flash{animation:boostButtonPop .72s ease-out;box-shadow:0 0 30px rgba(255,255,255,.22),0 0 44px rgba(255,0,51,.5),0 0 70px rgba(83,234,255,.34)}
        .vibe-deck button.surprise-hit{animation:surpriseHit .92s ease-out}
        .vibe-deck button.saver-hit{animation:saverHit .66s ease-out}
        #lowPowerButton[aria-pressed="true"]{background:#fff;color:#050505}
        .energy-meter{display:grid;grid-template-columns:repeat(14,1fr);align-items:end;gap:4px;width:min(100%,380px);height:34px;margin:16px auto 0;padding:0 6px}
        .energy-meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(180deg,#fff,#54d9ff 44%,rgba(255,0,51,.25));transform:scaleY(.24);transform-origin:bottom;animation:meterPulse 1.6s ease-in-out infinite;animation-delay:calc(var(--i)*-.06s)}
        .energy-meter.boost span{animation-duration:.42s}
        @keyframes meterPulse{0%,100%{transform:scaleY(.24);opacity:.48}45%{transform:scaleY(calc(.36 + var(--level)*.58));opacity:.94}70%{transform:scaleY(calc(.22 + var(--level)*.78));opacity:1}}
        @keyframes boostButtonPop{0%{transform:scale(.95)}40%{transform:scale(1.1)}100%{transform:scale(1)}}
        @keyframes pulseHit{0%{transform:scale(.96);box-shadow:0 0 0 0 color-mix(in srgb,var(--vibe-c) 70%,transparent)}38%{transform:scale(1.08);box-shadow:0 0 0 10px color-mix(in srgb,var(--vibe-c) 22%,transparent),0 0 34px var(--vibe-c)}100%{transform:scale(1);box-shadow:none}}
        @keyframes driveHit{0%{transform:translateX(-4px)}34%{transform:translateX(9px);box-shadow:22px 0 28px color-mix(in srgb,var(--vibe-a) 36%,transparent)}68%{transform:translateX(-2px)}100%{transform:translateX(0)}}
        @keyframes dreamHit{0%{filter:saturate(1);transform:scale(.98)}45%{filter:saturate(1.45) brightness(1.18);transform:scale(1.07) rotate(-1deg);box-shadow:0 0 28px color-mix(in srgb,var(--vibe-c) 58%,transparent)}100%{filter:saturate(1);transform:scale(1) rotate(0)}}
        @keyframes nightHit{0%,100%{filter:brightness(1);transform:scale(1)}22%{filter:brightness(1.6);transform:translateY(-3px)}35%{filter:brightness(.7)}54%{filter:brightness(1.35);box-shadow:0 0 30px color-mix(in srgb,var(--vibe-a) 55%,transparent)}}
        @keyframes surpriseHit{0%{transform:scale(.92) rotate(-3deg)}30%{transform:scale(1.1) rotate(3deg);box-shadow:0 0 36px #ff7adf}58%{transform:scale(1.02) rotate(-2deg);box-shadow:0 0 36px #54eaff}100%{transform:scale(1) rotate(0)}}
        @keyframes saverHit{0%{transform:scale(.98)}50%{transform:scale(1.04);filter:brightness(1.25)}100%{transform:scale(1);filter:brightness(1)}}
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

    const lightning = addButton("boostButton", "Boost");
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
    lightning.addEventListener("click", event => lightningReaction(lightning, event));
    surprise.addEventListener("click", () => {
      const buttons = [...controls.querySelectorAll("[data-mood]")];
      const current = Number(controls.querySelector("[data-mood].active")?.dataset.mood || mood);
      const choices = buttons.filter(button => Number(button.dataset.mood) !== current);
      const next = choices[Math.floor(Math.random() * choices.length)] || buttons[0];
      if (next) setMood(next.dataset.mood, next);
      surpriseReaction(surprise);
    });
    saver.addEventListener("click", () => {
      lowPower = !lowPower;
      localStorage.setItem("imlLowPower", String(lowPower));
      saver.setAttribute("aria-pressed", String(lowPower));
      resize();
      hitButton(saver, "saver-hit");
      boostAt(w / 2, h * 0.3, 0.7);
    });
    setMood(controls.querySelector("[data-mood].active")?.dataset.mood || 0, controls.querySelector("[data-mood].active"), false);
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

  function drawFilaments(time) {
    if (lowPower) return;
    const colors = palettes[mood];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    filaments.forEach((line, index) => {
      const drift = time * line.speed + line.offset * Math.PI * 2;
      const anchorY = h * (0.18 + line.offset * 0.68);
      const pullX = pointer.active ? (pointer.x - w / 2) * (lite ? 0.035 : 0.07) : 0;
      const pullY = pointer.active ? (pointer.y - h / 2) * (lite ? 0.018 : 0.035) : 0;
      const startX = -w * 0.12;
      const endX = w * 1.12;
      const y1 = anchorY + Math.sin(drift) * h * line.bend + pullY;
      const y2 = anchorY + Math.cos(drift * 1.18 + index) * h * line.bend * 1.35 - pullY * 0.45;
      const midX = w * (0.42 + Math.sin(drift * 0.7) * 0.2) + pullX;
      const midY = anchorY + Math.sin(drift * 1.45 + index) * h * line.bend * 1.7 + pullY;
      const grad = ctx.createLinearGradient(startX, y1, endX, y2);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.24, `${colors[0]}24`);
      grad.addColorStop(0.52, `hsla(${line.hue + mood * 12},100%,70%,${0.18 + videoEnergy * 0.12 + boost * 0.09})`);
      grad.addColorStop(0.78, `${colors[2]}20`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = line.width + boost * 2.2 + videoEnergy * 1.7;
      ctx.shadowColor = colors[index % colors.length];
      ctx.shadowBlur = lite ? 10 : 24;
      ctx.beginPath();
      ctx.moveTo(startX, y1);
      ctx.bezierCurveTo(w * 0.18, y1 - h * 0.12, midX, midY, endX, y2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawParticles(time = 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    let links = 0;
    if (!lite) {
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length && links < 520; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 112) {
            const alpha = (1 - dist / 112) * (0.12 + boost * 0.04 + videoEnergy * 0.08);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2 + mood * 14},100%,72%,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            links++;
          }
        }
      }
    }
    particles.forEach(p => {
      const wave = time * 0.00045 * p.twinkle + p.phase;
      p.vx += Math.sin(wave) * 0.0028 * p.depth;
      p.vy += Math.cos(wave * 1.23) * 0.0022 * p.depth;
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        const range = lite ? 145 : 270;
        if (dist < range) {
          const push = (range - dist) / range;
          const swirl = (p.magnet ? -1 : 1) * push * (lite ? 0.006 : 0.014);
          p.vx += (-dy / dist) * swirl + (dx / dist) * push * (p.magnet ? -0.004 : 0.007);
          p.vy += (dx / dist) * swirl + (dy / dist) * push * (p.magnet ? -0.004 : 0.007);
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.988;
      p.vy *= 0.988;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      const pulse = 0.56 + Math.sin(time * 0.003 * p.twinkle + p.phase) * 0.24 + videoEnergy * 0.22 + boost * 0.16;
      ctx.fillStyle = `hsla(${p.hue + mood * 16},100%,74%,${clamp(pulse, 0.18, 0.95)})`;
      ctx.shadowColor = `hsla(${p.hue + mood * 16},100%,72%,${clamp(pulse, 0.12, 0.82)})`;
      ctx.shadowBlur = lite ? 3 : 8 + p.depth * 6 + boost * 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + boost * 0.45 + videoEnergy * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawBolts(time = 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    bolts = bolts.filter(bolt => (bolt.life *= lite ? 0.74 : 0.82) > 0.04);
    bolts.forEach(bolt => {
      bolt.age += lite ? 0.16 : 0.24;
      const flicker = clamp((0.72 + Math.sin(time * 0.035 + bolt.flicker * 7) * 0.22) * (0.9 + Math.random() * 0.18), 0.35, 1.2);
      const animated = bolt.points.map((point, index) => {
        if (index === 0 || index === bolt.points.length - 1) return point;
        const wave = Math.sin(time * 0.016 + index * 1.7 + bolt.flicker * 5);
        const jitter = (lite ? 1.4 : 3.4) * (bolt.branch ? 0.55 : 1) * wave;
        return {
          x: point.x + jitter + bolt.drift * bolt.age,
          y: point.y + Math.cos(time * 0.014 + index) * jitter * 0.35
        };
      });
      const drawPath = () => {
        ctx.beginPath();
        animated.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.stroke();
      };
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowColor = bolt.glow;
      ctx.shadowBlur = lite ? 10 : 24;
      ctx.strokeStyle = bolt.glow;
      ctx.globalAlpha = bolt.life * 0.42 * flicker;
      ctx.lineWidth = bolt.width * (lite ? 2.4 : 3.4);
      drawPath();
      ctx.strokeStyle = bolt.color;
      ctx.globalAlpha = bolt.life * 0.82 * flicker;
      ctx.lineWidth = bolt.width * 1.06;
      drawPath();
      ctx.globalAlpha = bolt.life * flicker;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(0.8, bolt.width * 0.34);
      drawPath();
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

  function drawReactions() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    rings = rings.filter(ring => (ring.life *= lite ? 0.82 : 0.88) > 0.035);
    rings.forEach(ring => {
      ring.radius += (lite ? 8 : 13) * ring.power + boost * 7;
      ctx.strokeStyle = `hsla(${ring.hue},100%,72%,${ring.life * 0.7})`;
      ctx.lineWidth = (lite ? 1.6 : 2.4) + ring.life * 4;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    streaks = streaks.filter(streak => (streak.life *= lite ? 0.82 : 0.88) > 0.04);
    streaks.forEach(streak => {
      streak.x += streak.vx;
      streak.y += streak.vy;
      ctx.strokeStyle = `hsla(${streak.hue},100%,70%,${streak.life * 0.78})`;
      ctx.lineWidth = streak.width;
      ctx.shadowColor = `hsla(${streak.hue},100%,70%,${streak.life})`;
      ctx.shadowBlur = lite ? 6 : 16;
      ctx.beginPath();
      ctx.moveTo(streak.x, streak.y);
      ctx.lineTo(streak.x - Math.sign(streak.vx || 1) * streak.length, streak.y - streak.vy * 7);
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
    drawFilaments(time);
    drawFlashes();
    drawReactions();
    drawEqualizer(time);
    drawBolts(time);
    drawParticles(time);
    const interval = (lite ? 3800 : 2300) - videoEnergy * 650 - boost * 520;
    if (time - lastStrike > Math.max(900, interval)) {
      lastStrike = time;
      strike(rand(w * 0.14, w * 0.86), rand(h * 0.08, h * 0.55), 0.75 + videoEnergy * 0.35);
    }
    boost *= lite ? 0.86 : 0.9;
  }

  function movePointer(event) {
    const previousX = pointer.x;
    const previousY = pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    const now = performance.now();
    const distance = Math.hypot(pointer.x - previousX, pointer.y - previousY);
    if (!lite && distance > 42 && now - pointer.last > 150) {
      pointer.last = now;
      bolts.push(lightning(previousX, previousY, pointer.x, pointer.y, 0.36 + Math.min(distance / 420, 0.32), true));
      bolts = bolts.slice(-22);
      boost = Math.max(boost, 0.22);
    } else if (!lite && now - pointer.last > 950) {
      pointer.last = now;
      strike(pointer.x, pointer.y, 0.58);
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
  addEventListener("pointerdown", event => {
    if (event.target?.closest?.("#moodControls")) return;
    boostAt(event.clientX, event.clientY, 1.18);
  }, { passive: true });
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
