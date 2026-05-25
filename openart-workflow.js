(() => {
  const settingsKey = "song2videoOpenArtWorkflow";
  const providers = {
    kling: { label: "Kling-style", clip: 10 },
    openai: { label: "OpenAI Sora", clip: 12 },
    seedance: { label: "Seedance-style", clip: 10 },
    veo: { label: "Veo-style", clip: 8 }
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(settingsKey) || "{}");
    } catch {
      return {};
    }
  }

  function saveSettings(next) {
    localStorage.setItem(settingsKey, JSON.stringify(next));
  }

  function formatDuration(seconds) {
    const value = Math.max(0, Math.round(seconds || 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  }

  function detectAudioSeconds() {
    const audio = $("#audio");
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      return Math.min(300, Math.max(5, audio.duration));
    }
    return 60;
  }

  function injectStyles() {
    if ($("#openArtWorkflowStyles")) return;
    const style = document.createElement("style");
    style.id = "openArtWorkflowStyles";
    style.textContent = `
      .oa-card{border:1px solid rgba(255,255,255,.13);border-radius:20px;background:linear-gradient(135deg,rgba(255,31,90,.11),rgba(79,214,255,.08),rgba(255,255,255,.035));padding:15px;display:grid;gap:12px;box-shadow:inset 0 0 30px rgba(255,255,255,.035)}
      .oa-card h3{margin:0;color:#fff;font-size:1.08rem;line-height:1.15}.oa-card p{margin:0;color:#b9bbc9;line-height:1.4;font-size:.88rem}.oa-tabs,.oa-chips,.oa-actions{display:flex;gap:8px;flex-wrap:wrap}.oa-tab,.oa-chip,.oa-action{border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;min-height:34px;padding:7px 11px;font-weight:900;font-size:.78rem;cursor:pointer}.oa-tab.is-active,.oa-chip.is-active,.oa-action.hot{background:linear-gradient(135deg,#ff1f5a,#8c6dff,#4fd6ff);border-color:transparent;box-shadow:0 10px 24px rgba(255,31,90,.18)}.oa-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.oa-field{display:grid;gap:6px;color:#b9bbc9;font-size:.78rem;font-weight:850}.oa-field input,.oa-field select,.oa-field textarea{width:100%;border:1px solid rgba(255,255,255,.14);border-radius:13px;background:rgba(0,0,0,.24);color:#fff;min-height:40px;padding:9px 10px}.oa-field textarea{min-height:116px;resize:vertical;line-height:1.35}.oa-scenes{display:grid;gap:7px;max-height:210px;overflow:auto;padding-right:3px}.oa-scene{border:1px solid rgba(255,255,255,.1);border-radius:13px;background:rgba(0,0,0,.22);padding:9px;color:#cfd0da;font-size:.82rem;line-height:1.35}.oa-scene strong{display:block;color:#fff;margin-bottom:3px}.oa-status{border-radius:13px;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.1);padding:10px;color:#cfefff;font-size:.82rem;white-space:pre-wrap;word-break:break-word}.oa-ref-name{color:#b9bbc9;font-size:.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.oa-small{font-size:.76rem;color:#b9bbc9}.oa-scenes::-webkit-scrollbar{width:8px}.oa-scenes::-webkit-scrollbar-thumb{background:linear-gradient(#ff1f5a,#4fd6ff);border-radius:999px}.oa-scenes::-webkit-scrollbar-track{background:rgba(255,255,255,.05);border-radius:999px}@media(max-width:680px){.oa-grid{grid-template-columns:1fr}.oa-tab,.oa-chip,.oa-action{flex:1 1 auto}}
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    if ($("#openArtWorkflowCard")) return;
    const agent = $("#agent") || $(".agent-card");
    if (!agent) return;
    const saved = readSettings();
    const card = document.createElement("section");
    card.id = "openArtWorkflowCard";
    card.className = "oa-card";
    card.innerHTML = `
      <div>
        <h3>AI Video Workflow</h3>
        <p>OpenArt-style creative flow: mode, model, references, prompt enhancer, scene plan, then backend generation.</p>
      </div>
      <div class="oa-tabs" aria-label="Creation mode">
        <button class="oa-tab is-active" type="button" data-mode="text">Text</button>
        <button class="oa-tab" type="button" data-mode="image">Image</button>
        <button class="oa-tab" type="button" data-mode="elements">Elements</button>
        <button class="oa-tab" type="button" data-mode="audio">Audio</button>
      </div>
      <div class="oa-chips" aria-label="AI model">
        <button class="oa-chip is-active" type="button" data-provider="kling">Kling</button>
        <button class="oa-chip" type="button" data-provider="openai">Sora</button>
        <button class="oa-chip" type="button" data-provider="seedance">Seedance</button>
        <button class="oa-chip" type="button" data-provider="veo">Veo</button>
      </div>
      <div class="oa-grid">
        <label class="oa-field">Backend URL
          <input id="oaBackendUrl" placeholder="https://your-backend.example.com" value="${escapeAttr(saved.backendUrl || "")}">
        </label>
        <label class="oa-field">Length
          <select id="oaLength">
            <option value="auto">Full song auto</option>
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="300">5 minutes</option>
          </select>
        </label>
        <label class="oa-field">Quality
          <select id="oaQuality">
            <option value="std">Standard fast</option>
            <option value="pro">Pro detail</option>
          </select>
        </label>
        <label class="oa-field">Aspect
          <select id="oaAspect">
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
          </select>
        </label>
      </div>
      <label class="oa-field">Reference image or element
        <input id="oaReference" type="file" accept="image/*,video/*">
        <span class="oa-ref-name" id="oaReferenceName">Optional: first frame, character, logo, product, or mood reference.</span>
      </label>
      <label class="oa-field">AI prompt
        <textarea id="oaPrompt">${escapeHtml(saved.prompt || "Cinematic I.M.L. music video, blue lightning, neon particles, emotional movement, premium music-video lighting, no captions, no text overlays.")}</textarea>
      </label>
      <label class="oa-field">Negative prompt
        <textarea id="oaNegative">${escapeHtml(saved.negative || "blurry, low quality, distorted logo, extra text, captions, watermark, broken hands, random faces")}</textarea>
      </label>
      <div class="oa-actions">
        <button class="oa-action hot" id="oaEnhance" type="button">Enhance Prompt</button>
        <button class="oa-action" id="oaStoryboard" type="button">Create Scene Plan</button>
        <button class="oa-action" id="oaSend" type="button">Generate AI Job</button>
        <button class="oa-action" id="oaPoll" type="button" disabled>Poll Status</button>
      </div>
      <div class="oa-scenes" id="oaScenes"></div>
      <div class="oa-status" id="oaStatus">Ready. Add your backend URL when you want real AI generation.</div>
      <div class="oa-small">Your API keys stay on the backend. This public page only sends prompts to your proxy.</div>
    `;

    const steps = $("#agentSteps", agent);
    if (steps) agent.insertBefore(card, steps);
    else agent.appendChild(card);

    wirePanel(card, saved);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  function wirePanel(card, saved) {
    let mode = saved.mode || "text";
    let provider = saved.provider || "kling";
    let currentJobId = saved.jobId || "";
    const backendUrl = $("#oaBackendUrl", card);
    const length = $("#oaLength", card);
    const quality = $("#oaQuality", card);
    const aspect = $("#oaAspect", card);
    const prompt = $("#oaPrompt", card);
    const negative = $("#oaNegative", card);
    const reference = $("#oaReference", card);
    const referenceName = $("#oaReferenceName", card);
    const scenes = $("#oaScenes", card);
    const status = $("#oaStatus", card);
    const poll = $("#oaPoll", card);

    length.value = saved.length || "auto";
    quality.value = saved.quality || "std";
    aspect.value = saved.aspect || "16:9";
    poll.disabled = !currentJobId;

    card.querySelectorAll(".oa-tab").forEach(button => {
      button.classList.toggle("is-active", button.dataset.mode === mode);
      button.addEventListener("click", () => {
        mode = button.dataset.mode;
        card.querySelectorAll(".oa-tab").forEach(item => item.classList.toggle("is-active", item === button));
        persist();
        status.textContent = `${button.textContent} mode selected.`;
      });
    });

    card.querySelectorAll(".oa-chip").forEach(button => {
      button.classList.toggle("is-active", button.dataset.provider === provider);
      button.addEventListener("click", () => {
        provider = button.dataset.provider;
        card.querySelectorAll(".oa-chip").forEach(item => item.classList.toggle("is-active", item === button));
        persist();
        status.textContent = `${button.textContent} selected. This still uses your backend proxy.`;
      });
    });

    [backendUrl, length, quality, aspect, prompt, negative].forEach(input => input.addEventListener("input", persist));
    reference.addEventListener("change", event => {
      const file = event.target.files[0];
      referenceName.textContent = file ? `${file.name} selected for ${mode} reference` : "Optional reference image or element.";
    });

    $("#oaEnhance", card).addEventListener("click", () => {
      prompt.value = buildEnhancedPrompt(mode, provider, quality.value, aspect.value);
      persist();
      status.textContent = "Prompt enhanced with camera motion, scene language, lighting, and generation constraints.";
    });

    $("#oaStoryboard", card).addEventListener("click", () => {
      const plan = buildScenePlan(provider, getTargetSeconds(length.value), prompt.value);
      scenes.innerHTML = plan.map(scene => `<div class="oa-scene"><strong>${escapeHtml(scene.title)}</strong>${escapeHtml(scene.prompt)}</div>`).join("");
      status.textContent = `${plan.length} scenes planned for ${formatDuration(getTargetSeconds(length.value))}.`;
    });

    $("#oaSend", card).addEventListener("click", async () => {
      try {
        const base = getBackendUrl(backendUrl.value);
        persist();
        status.textContent = "Sending AI video job to your backend...";
        const response = await fetch(`${base}/api/ai-video/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: provider === "openai" ? "openai" : "kling",
            prompt: `${prompt.value}\nNegative prompt: ${negative.value}`,
            seconds: getTargetSeconds(length.value),
            aspectRatio: aspect.value,
            style: `${quality.value} ${mode} video workflow`
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || "Backend request failed.");
        currentJobId = data.jobId;
        poll.disabled = !currentJobId;
        persist({ jobId: currentJobId });
        status.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        status.textContent = error.message;
      }
    });

    poll.addEventListener("click", async () => {
      try {
        if (!currentJobId) return;
        const base = getBackendUrl(backendUrl.value);
        status.textContent = "Checking AI video job status...";
        const response = await fetch(`${base}/api/ai-video/status/${encodeURIComponent(currentJobId)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Status request failed.");
        status.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        status.textContent = error.message;
      }
    });

    function persist(extra = {}) {
      saveSettings({
        backendUrl: backendUrl.value.trim(),
        length: length.value,
        quality: quality.value,
        aspect: aspect.value,
        prompt: prompt.value,
        negative: negative.value,
        mode,
        provider,
        jobId: currentJobId,
        ...extra
      });
    }
  }

  function getBackendUrl(value) {
    const url = String(value || "").trim().replace(/\/$/, "");
    if (!url) throw new Error("Add your private backend URL first. API keys cannot be placed in GitHub Pages.");
    return url;
  }

  function getTargetSeconds(value) {
    if (value === "auto") return detectAudioSeconds();
    return Math.max(5, Math.min(300, Number(value) || 60));
  }

  function buildEnhancedPrompt(mode, provider, quality, aspect) {
    const title = $("#songTitle")?.value?.trim() || "I.M.L. music video";
    const userWords = $("#keywords")?.value?.trim() || "blue lightning, emotional atmosphere, neon particles, cinematic sound energy";
    const style = $("#styleSelect")?.value || "cinematic";
    const providerName = providers[provider]?.label || "AI video model";
    const qualityLine = quality === "pro" ? "high detail, premium lighting, smooth camera motion" : "fast generation, clean composition, strong subject clarity";
    const modeLine = {
      text: "Create everything from the written prompt.",
      image: "Use the uploaded image as the first frame and preserve its identity.",
      elements: "Blend the uploaded element into every shot without changing its design.",
      audio: "Follow the song energy and create rhythm-synced motion."
    }[mode] || "Create a music video scene.";

    return `${title}. ${modeLine} ${qualityLine}. ${providerName}, ${aspect} music video. Visual direction: ${userWords}. Camera: slow push-in, parallax depth, tasteful motion, beat-reactive energy, atmospheric particles, natural light changes. Keep the logo clean and readable if present. No captions, no subtitles, no watermark, no random text.`;
  }

  function buildScenePlan(provider, totalSeconds, basePrompt) {
    const clipSeconds = providers[provider]?.clip || 10;
    const count = Math.max(1, Math.ceil(totalSeconds / clipSeconds));
    const phases = ["Opening hook", "Build up", "Main chorus", "Bridge motion", "Final impact"];
    return Array.from({ length: count }, (_, index) => {
      const phase = phases[Math.min(phases.length - 1, Math.floor(index / Math.max(1, count / phases.length)))];
      return {
        title: `${index + 1}. ${phase} (${formatDuration(index * clipSeconds)} - ${formatDuration(Math.min(totalSeconds, (index + 1) * clipSeconds))})`,
        prompt: `${basePrompt} Scene ${index + 1} of ${count}: ${phase}. Smooth continuation from the previous shot, matching color palette and subject identity.`
      };
    });
  }

  function init() {
    injectStyles();
    createPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
