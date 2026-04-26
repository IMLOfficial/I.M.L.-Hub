(() => {
  if (document.getElementById("imlLanguageWidget")) return;

  const style = document.createElement("style");
  style.id = "imlLanguageWidgetStyles";
  style.textContent = `
    .iml-language-widget{position:fixed;right:14px;bottom:14px;z-index:6;font-family:system-ui,Arial,sans-serif;color:#eef7ff}
    .iml-language-button{min-height:44px;padding:10px 16px;border:1px solid rgba(126,222,255,.34);border-radius:999px;background:linear-gradient(135deg,rgba(14,44,84,.92),rgba(77,184,255,.82));color:#fff;font-weight:800;box-shadow:0 12px 28px rgba(0,0,0,.26),0 0 22px rgba(77,184,255,.22);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s ease,box-shadow .18s ease}
    .iml-language-button:hover,.iml-language-button:focus-visible{transform:translateY(-2px);box-shadow:0 16px 32px rgba(0,0,0,.28),0 0 30px rgba(77,184,255,.36)}
    .iml-language-button:active{transform:scale(.97)}
    .iml-language-panel{position:absolute;right:0;bottom:56px;width:min(86vw,320px);padding:14px;border:1px solid rgba(126,222,255,.28);border-radius:18px;background:rgba(6,18,34,.92);box-shadow:0 18px 42px rgba(0,0,0,.34),0 0 28px rgba(77,184,255,.16);backdrop-filter:blur(16px)}
    .iml-language-panel[hidden]{display:none}
    .iml-language-title{margin:0 0 8px;font-size:1rem;font-weight:900}
    .iml-language-help{margin:10px 0 0;color:#b9d5e8;font-size:.86rem;line-height:1.35}
    #google_translate_element{min-height:42px}
    #google_translate_element select{width:100%;min-height:42px;border:1px solid rgba(126,222,255,.34);border-radius:12px;background:#0a1a30;color:#eef7ff;font:inherit;padding:8px}
    #google_translate_element select option{color:#102033;background:#fff}
    #google_translate_element .goog-te-gadget{color:#b9d5e8;font-size:.82rem}
    #google_translate_element .goog-te-gadget span{display:none}
    body > .skiptranslate{display:none!important}
    body{top:0!important}
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
      <div id="google_translate_element"></div>
      <p class="iml-language-help">Select your native language. The page text will be translated automatically.</p>
    </div>
  `;
  document.body.appendChild(widget);

  const button = widget.querySelector("button");
  const panel = widget.querySelector("#imlLanguagePanel");
  let translateLoading = false;

  window.googleTranslateElementInit = function googleTranslateElementInit() {
    if (!window.google || !google.translate) return;
    new google.translate.TranslateElement({
      pageLanguage: "en",
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, "google_translate_element");
  };

  function loadTranslator() {
    if (translateLoading || window.google?.translate) return;
    translateLoading = true;
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      translateLoading = false;
      const target = document.getElementById("google_translate_element");
      if (target) target.textContent = "Translation could not load. Try your browser translate option.";
    };
    document.head.appendChild(script);
  }

  button.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    button.setAttribute("aria-expanded", String(!isOpen));
    if (!isOpen) loadTranslator();
    dispatchEvent(new CustomEvent("iml:boost", { detail: { x: innerWidth - 60, y: innerHeight - 60 } }));
  });

  document.addEventListener("click", event => {
    if (panel.hidden || widget.contains(event.target)) return;
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
})();
