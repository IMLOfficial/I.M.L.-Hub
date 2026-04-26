(() => {
  document.getElementById("imlLanguageWidget")?.remove();
  document.getElementById("imlLanguageWidgetStyles")?.remove();

  const languages = [
    ["auto", "Use phone/browser language"],
    ["en", "English"], ["de", "Deutsch"], ["ro", "Română"], ["fr", "Français"], ["es", "Español"], ["it", "Italiano"], ["pt", "Português"],
    ["nl", "Nederlands"], ["pl", "Polski"], ["tr", "Türkçe"], ["uk", "Українська"], ["ru", "Русский"], ["hu", "Magyar"], ["cs", "Čeština"],
    ["sk", "Slovenčina"], ["sl", "Slovenščina"], ["hr", "Hrvatski"], ["sr", "Српски"], ["bg", "Български"], ["el", "Ελληνικά"],
    ["da", "Dansk"], ["sv", "Svenska"], ["no", "Norsk"], ["fi", "Suomi"], ["et", "Eesti"], ["lv", "Latviešu"], ["lt", "Lietuvių"],
    ["ar", "العربية"], ["he", "עברית"], ["fa", "فارسی"], ["hi", "हिन्दी"], ["ur", "اردو"], ["bn", "বাংলা"], ["pa", "ਪੰਜਾਬੀ"],
    ["zh-CN", "中文（简体）"], ["zh-TW", "中文（繁體）"], ["ja", "日本語"], ["ko", "한국어"], ["vi", "Tiếng Việt"], ["th", "ไทย"],
    ["id", "Bahasa Indonesia"], ["ms", "Bahasa Melayu"], ["fil", "Filipino"], ["sw", "Kiswahili"], ["af", "Afrikaans"], ["sq", "Shqip"],
    ["az", "Azərbaycanca"], ["eu", "Euskara"], ["ca", "Català"], ["gl", "Galego"], ["ga", "Gaeilge"], ["is", "Íslenska"],
    ["mt", "Malti"], ["mk", "Македонски"], ["bs", "Bosanski"], ["ka", "ქართული"], ["hy", "Հայերեն"], ["kk", "Қазақша"],
    ["uz", "O‘zbek"], ["mn", "Монгол"], ["ne", "नेपाली"], ["si", "සිංහල"], ["ta", "தமிழ்"], ["te", "తెలుగు"], ["ml", "മലയാളം"],
    ["kn", "ಕನ್ನಡ"], ["gu", "ગુજરાતી"], ["mr", "मराठी"], ["am", "አማርኛ"], ["yo", "Yorùbá"], ["zu", "IsiZulu"], ["xh", "IsiXhosa"],
    ["la", "Latina"], ["eo", "Esperanto"]
  ];

  const style = document.createElement("style");
  style.id = "imlLanguageWidgetStyles";
  style.textContent = `
    .iml-language-widget{position:fixed;right:14px;bottom:14px;z-index:6;font-family:system-ui,Arial,sans-serif;color:#eef7ff}
    .iml-language-button{min-height:44px;padding:10px 16px;border:1px solid rgba(126,222,255,.38);border-radius:999px;background:linear-gradient(135deg,rgba(13,42,82,.96),rgba(77,184,255,.9));color:#fff;font-weight:900;box-shadow:0 12px 28px rgba(0,0,0,.28),0 0 22px rgba(77,184,255,.26);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s ease,box-shadow .18s ease}
    .iml-language-button:hover,.iml-language-button:focus-visible{transform:translateY(-2px);box-shadow:0 16px 32px rgba(0,0,0,.3),0 0 30px rgba(77,184,255,.38)}
    .iml-language-button:active{transform:scale(.97)}
    .iml-language-panel{position:absolute;right:0;bottom:56px;width:min(88vw,340px);padding:14px;border:1px solid rgba(126,222,255,.3);border-radius:18px;background:rgba(6,18,34,.94);box-shadow:0 18px 42px rgba(0,0,0,.36),0 0 28px rgba(77,184,255,.18);backdrop-filter:blur(16px)}
    .iml-language-panel[hidden]{display:none}
    .iml-language-title{margin:0 0 8px;font-size:1rem;font-weight:900}
    .iml-language-help{margin:10px 0 0;color:#b9d5e8;font-size:.86rem;line-height:1.35}
    .iml-language-select{width:100%;min-height:44px;border:1px solid rgba(126,222,255,.38);border-radius:12px;background:#0a1a30;color:#eef7ff;font:inherit;font-weight:700;padding:8px 10px}
    .iml-language-select option{color:#102033;background:#fff}
    .iml-language-actions{display:grid;grid-template-columns:1fr;gap:8px;margin-top:10px}
    .iml-language-go{width:100%;min-height:42px;border-radius:12px;background:linear-gradient(135deg,#35d9ff,#7b5dff);font-weight:900}
    .iml-language-note{display:block;margin-top:8px;color:#8fb9d6;font-size:.76rem;line-height:1.3}
    @media (max-width:640px){.iml-language-widget{right:10px;bottom:10px}.iml-language-button{min-height:40px;padding:9px 13px}.iml-language-panel{bottom:52px;border-radius:14px;backdrop-filter:none}}
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "imlLanguageWidget";
  widget.className = "iml-language-widget";
  widget.innerHTML = `
    <button class="iml-language-button" type="button" aria-expanded="false" aria-controls="imlLanguagePanel">Language</button>
    <div class="iml-language-panel" id="imlLanguagePanel" hidden>
      <p class="iml-language-title">Choose Language</p>
      <select class="iml-language-select" id="imlLanguageSelect" aria-label="Choose website language">
        ${languages.map(([code, name]) => `<option value="${code}">${name}</option>`).join("")}
      </select>
      <div class="iml-language-actions">
        <button class="iml-language-go" type="button">Translate Page</button>
      </div>
      <p class="iml-language-help">Select your native language, then tap Translate Page.</p>
      <span class="iml-language-note">This opens the translated version through Google Translate, so it works even when the old embedded translator is blocked.</span>
    </div>
  `;
  document.body.appendChild(widget);

  const button = widget.querySelector(".iml-language-button");
  const panel = widget.querySelector("#imlLanguagePanel");
  const select = widget.querySelector("#imlLanguageSelect");
  const go = widget.querySelector(".iml-language-go");

  function normalizeLanguage(code) {
    const shortCode = (code || "en").toLowerCase().split("-")[0];
    const supported = new Set(languages.map(([value]) => value.toLowerCase()));
    if (supported.has(code)) return code;
    if (supported.has(shortCode)) return shortCode;
    return "en";
  }

  function translatedUrl(targetLanguage) {
    const cleanUrl = location.href.replace(/#.*$/, "");
    const lang = targetLanguage === "auto" ? normalizeLanguage(navigator.language || "en") : targetLanguage;
    return `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(lang)}&u=${encodeURIComponent(cleanUrl)}`;
  }

  function translate() {
    window.location.href = translatedUrl(select.value);
  }

  button.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    button.setAttribute("aria-expanded", String(!isOpen));
    dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth - 60, y: innerHeight - 60 } }));
  });

  go.addEventListener("click", translate);
  select.addEventListener("change", () => {
    if (select.value !== "auto") translate();
  });

  document.addEventListener("click", event => {
    if (panel.hidden || widget.contains(event.target)) return;
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
})();
