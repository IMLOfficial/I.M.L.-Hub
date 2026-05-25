(() => {
  const demoStyles = {
    text: "cinematic",
    image: "liquid",
    elements: "neon",
    audio: "cosmic"
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function injectStyles() {
    if ($("#localAiDemoStyles")) return;
    const style = document.createElement("style");
    style.id = "localAiDemoStyles";
    style.textContent = `
      .local-demo-result{border:1px solid rgba(79,214,255,.22);border-radius:14px;background:rgba(79,214,255,.08);padding:10px;color:#dff8ff;font-size:.82rem;line-height:1.4}.local-demo-result strong{display:block;color:#fff;margin-bottom:4px}.local-demo-pill{display:inline-flex;margin:4px 5px 0 0;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.1);color:#fff;font-weight:850;font-size:.72rem}.oa-action.demo{background:linear-gradient(135deg,#4dffc8,#4fd6ff,#8c6dff);border-color:transparent;color:#041016;box-shadow:0 10px 24px rgba(79,214,255,.2)}
    `;
    document.head.appendChild(style);
  }

  function waitForPanel() {
    return new Promise(resolve => {
      const existing = $("#openArtWorkflowCard");
      if (existing) return resolve(existing);
      const timer = setInterval(() => {
        const panel = $("#openArtWorkflowCard");
        if (panel) {
          clearInterval(timer);
          resolve(panel);
        }
      }, 250);
      setTimeout(() => clearInterval(timer), 12000);
    });
  }

  function getActiveValue(panel, selector, attr) {
    return panel.querySelector(`${selector}.is-active`)?.dataset?.[attr] || "text";
  }

  function getPrompt(panel) {
    return $("#oaPrompt", panel)?.value?.trim() || $("#keywords")?.value?.trim() || "cinematic I.M.L. music video, blue lightning, neon motion";
  }

  function getAudioSeconds() {
    const audio = $("#audio");
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) return Math.min(300, Math.max(5, audio.duration));
    const length = $("#oaLength")?.value || "60";
    if (length === "auto") return 60;
    return Math.min(300, Math.max(5, Number(length) || 60));
  }

  function keywordsFromPrompt(prompt) {
    const cleaned = prompt
      .replace(/negative prompt:.*/i, "")
      .replace(/no captions|no subtitles|no watermark|no random text/gi, "")
      .split(/[,.]/)
      .map(part => part.trim())
      .filter(Boolean)
      .slice(0, 8);
    return cleaned.join(", ") || prompt.slice(0, 180);
  }

  function buildScenes(prompt, seconds, mode) {
    const total = Math.max(1, Math.ceil(seconds / 10));
    const beats = ["Opening hook", "Energy rise", "Main visual", "Motion break", "Final glow"];
    return Array.from({ length: total }, (_, index) => {
      const start = index * 10;
      const end = Math.min(seconds, start + 10);
      const beat = beats[Math.min(beats.length - 1, Math.floor(index / Math.max(1, total / beats.length)))];
      return {
        title: `${index + 1}. ${beat}`,
        time: `${formatDuration(start)}-${formatDuration(end)}`,
        text: `${mode} demo scene with ${prompt.split(/[,.]/)[0].trim() || "I.M.L. energy"}`
      };
    });
  }

  function formatDuration(seconds) {
    const rounded = Math.round(seconds || 0);
    return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
  }

  function fillGenerator(panel) {
    const mode = getActiveValue(panel, ".oa-tab", "mode");
    const prompt = getPrompt(panel);
    const style = demoStyles[mode] || "cinematic";
    const keywords = $("#keywords");
    const styleSelect = $("#styleSelect");
    const songTitle = $("#songTitle");

    if (keywords) keywords.value = keywordsFromPrompt(prompt);
    if (styleSelect) {
      styleSelect.value = style;
      styleSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (songTitle && !songTitle.value.trim()) songTitle.value = "AI Demo Video";

    if (typeof window.generateConcept === "function") {
      window.generateConcept();
    }
  }

  function renderDemoResult(panel, scenes, seconds) {
    let result = $("#localDemoResult", panel);
    if (!result) {
      result = document.createElement("div");
      result.id = "localDemoResult";
      result.className = "local-demo-result";
      const status = $("#oaStatus", panel);
      if (status) status.insertAdjacentElement("beforebegin", result);
      else panel.appendChild(result);
    }
    result.innerHTML = `
      <strong>Local demo render ready</strong>
      The canvas generator is now using a ${formatDuration(seconds)} OpenArt-style scene plan. Upload audio for full-song timing and export.
      <div>${scenes.slice(0, 6).map(scene => `<span class="local-demo-pill">${escapeHtml(scene.title)} ${escapeHtml(scene.time)}</span>`).join("")}</div>
    `;
  }

  function renderScenes(panel, scenes) {
    const container = $("#oaScenes", panel);
    if (!container) return;
    container.innerHTML = scenes.map(scene => `<div class="oa-scene"><strong>${escapeHtml(scene.title)} ${escapeHtml(scene.time)}</strong>${escapeHtml(scene.text)}</div>`).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function kickPreview() {
    const canvas = $("#videoStage");
    if (canvas) {
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (typeof window.startPreview === "function" && $("#audio")?.src) {
      window.startPreview().catch(() => undefined);
    }
  }

  function addDemoButton(panel) {
    if ($("#oaDemoRender", panel)) return;
    const actions = panel.querySelector(".oa-actions");
    if (!actions) return;
    const button = document.createElement("button");
    button.id = "oaDemoRender";
    button.className = "oa-action demo";
    button.type = "button";
    button.textContent = "Try Demo Render";
    actions.insertBefore(button, actions.firstChild);

    button.addEventListener("click", () => {
      const mode = getActiveValue(panel, ".oa-tab", "mode");
      const prompt = getPrompt(panel);
      const seconds = getAudioSeconds();
      const scenes = buildScenes(prompt, seconds, mode);
      fillGenerator(panel);
      renderScenes(panel, scenes);
      renderDemoResult(panel, scenes, seconds);
      const status = $("#oaStatus", panel);
      if (status) {
        status.textContent = "Demo mode is running locally. This does not spend AI credits. For real Kling/OpenAI/OpenArt-style generation, deploy the backend proxy and add its URL.";
      }
      kickPreview();
    });
  }

  async function init() {
    injectStyles();
    const panel = await waitForPanel();
    if (panel) addDemoButton(panel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
