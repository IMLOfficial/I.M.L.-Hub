(() => {
  const STYLE = "imlYtmMobileStyle";
  const HOME = "imlYtmMobileHome";
  const PLAYER = "imlYtmMobilePlayer";
  const MOBILE = "(max-width:899px)";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const text = el => el?.querySelector(".playlist-copy strong")?.textContent.trim() || "I.M.L.";
  const html = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
  const attr = s => html(s).replace(/'/g, "&#39;");
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

  function artFor(title) {
    const key = norm(title.replace(/\bi\.m\.l\./gi, ""));
    for (const card of $$("#videoPlaylistGrid [data-video-index],.latest-video-card")) {
      const name = norm(text(card).replace(/\bi\.m\.l\./gi, ""));
      if (!name || (!key.includes(name) && !name.includes(key))) continue;
      const art = card.querySelector(".playlist-thumb,.latest-video-art")?.style.backgroundImage;
      if (art) return art;
    }
    return "url('./logo.svg')";
  }

  function css() {
    if (document.getElementById(STYLE)) return;
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      .ytm-mobile-home,.ytm-mobile-player{display:none}
      @media(max-width:899px){
        body.mobile-ytm{background:radial-gradient(circle at 12% 0,rgba(137,87,38,.46),transparent 15rem),radial-gradient(circle at 90% 0,rgba(170,0,45,.28),transparent 16rem),linear-gradient(180deg,#15100a 0%,#050505 36%,#000 100%)!important;color:#fff;padding-bottom:calc(164px + env(safe-area-inset-bottom))}
        body.mobile-ytm::before{opacity:.06!important}body.mobile-ytm canvas#bg{opacity:.12!important}
        body.mobile-ytm .site-header,body.mobile-ytm #hero,body.mobile-ytm .action-grid,body.mobile-ytm .music-top-tabs{display:none!important}
        body.mobile-ytm main{padding-top:0}.ytm-mobile-home{display:block;position:relative;z-index:20;padding:calc(12px + env(safe-area-inset-top)) 14px 4px}
        .ytm-appbar{display:flex;align-items:center;gap:12px;min-height:48px}.ytm-brand{display:flex;align-items:center;gap:7px;margin-right:auto;font-size:1.22rem;font-weight:950}.ytm-playmark{position:relative;width:28px;height:28px;border-radius:50%;background:#ff0033;box-shadow:0 0 0 3px rgba(255,0,51,.14)}.ytm-playmark:after{content:"";position:absolute;left:11px;top:8px;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:9px solid #fff}
        .ytm-icon{position:relative;display:grid;place-items:center;width:38px;height:38px;min-height:38px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff}.ytm-icon.logo{background:#111 url("./logo.svg") center/86% no-repeat}.ytm-icon.search:before{content:"";width:15px;height:15px;border:2px solid currentColor;border-radius:50%}.ytm-icon.search:after{content:"";position:absolute;right:10px;bottom:10px;width:8px;height:2px;background:currentColor;transform:rotate(45deg)}.ytm-icon.bell:before{content:"";width:16px;height:18px;border:2px solid currentColor;border-bottom:0;border-radius:9px 9px 4px 4px}.ytm-icon.bell:after{content:"7";position:absolute;right:3px;top:3px;display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#ff0033;font-size:.62rem;font-weight:950}
        .ytm-chips{display:flex;gap:9px;overflow-x:auto;padding:12px 0 16px;scrollbar-width:none}.ytm-chips::-webkit-scrollbar{display:none}.ytm-chip{flex:0 0 auto;min-height:36px;padding:8px 14px;border:0;border-radius:9px;background:rgba(255,255,255,.13);color:#fff;font-size:.86rem;font-weight:900}
        .ytm-section-title{display:grid;gap:3px;margin:4px 0 12px}.ytm-section-title small{display:flex;align-items:center;gap:7px;color:#cfcfcf;font-weight:850}.ytm-section-title small:before{content:"";width:28px;height:28px;border-radius:50%;background:#111 url("./logo.svg") center/90% no-repeat}.ytm-section-title h2{margin:0;font-size:1.42rem;line-height:1.1;letter-spacing:0}
        .ytm-speed{display:grid;grid-template-columns:repeat(3,minmax(102px,1fr));gap:8px}.ytm-speed-card{position:relative;aspect-ratio:1/1;padding:0;border:0;border-radius:8px;overflow:hidden;background:#171717 center/cover no-repeat;color:#fff;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,.3)}.ytm-speed-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 42%,rgba(0,0,0,.82))}.ytm-speed-card strong{position:absolute;left:8px;right:8px;bottom:8px;z-index:1;font-size:.76rem;line-height:1.08;font-weight:950;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.ytm-dots{display:flex;justify-content:center;gap:5px;margin:10px 0 22px}.ytm-dots span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.35)}.ytm-dots span:first-child{background:#fff}
        .ytm-list-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.ytm-list-head h2{margin:0;font-size:1.24rem;letter-spacing:0}.ytm-play-all{min-height:32px;padding:6px 12px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:transparent;color:#fff;font-size:.78rem;font-weight:950}.ytm-list{display:grid;gap:4px;margin-bottom:16px}.ytm-row{display:grid;grid-template-columns:56px minmax(0,1fr) 28px;align-items:center;gap:12px;min-height:64px;padding:5px;border:0;border-radius:10px;background:transparent;color:#fff;text-align:left}.ytm-row:active,.ytm-row:hover{background:rgba(255,255,255,.08)}.ytm-art{width:54px;height:54px;border-radius:4px;background:#181818 center/cover no-repeat}.ytm-row strong,.ytm-row small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ytm-row strong{font-size:.9rem;line-height:1.18}.ytm-row small{color:#aaa;font-size:.8rem}.ytm-more{font-size:1.2rem;font-weight:950;color:#ddd;text-align:center}
        body.mobile-ytm #audioLibrary,body.mobile-ytm #videoLibrary{padding:14px 10px}body.mobile-ytm #audioLibrary .library-shell,body.mobile-ytm #videoLibrary .library-shell{background:#050505!important;border-color:rgba(255,255,255,.1)!important;border-radius:18px!important;box-shadow:none!important}body.mobile-ytm .feature-toolbar{position:relative!important;top:0!important;background:rgba(255,255,255,.07)!important;border-radius:14px!important}
        body.mobile-ytm .iml-audio-deck{left:10px!important;right:10px!important;bottom:calc(72px + env(safe-area-inset-bottom))!important;z-index:88!important;min-height:64px!important;grid-template-columns:46px minmax(0,1fr) 38px!important;padding:8px 10px!important;border-radius:0!important;background:rgba(28,28,28,.96)!important;box-shadow:0 -12px 44px rgba(0,0,0,.5)!important;cursor:pointer}body.mobile-ytm .iml-audio-deck:before{left:10px!important;right:10px!important;top:0!important;height:2px!important;background:linear-gradient(90deg,#ff0033 0 34%,rgba(255,255,255,.22) 34% 100%)!important}body.mobile-ytm .iml-audio-play{width:42px!important;height:42px!important;background:#fff!important;color:#000!important;box-shadow:none!important}body.mobile-ytm .iml-audio-title span:first-child{font-size:.84rem!important}body.mobile-ytm .iml-audio-title span:last-child{color:#aaa!important;font-size:.74rem!important}body.mobile-ytm .iml-audio-times,body.mobile-ytm .iml-audio-mute{display:none!important}
        .ytm-mobile-player{position:fixed;inset:0;z-index:120;display:none;overflow:auto;padding:calc(12px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));color:#fff;background:linear-gradient(180deg,#050505 0%,#000 58%,#050505 100%)}.ytm-mobile-player.open{display:block}body.player-open{overflow:hidden}.ytm-player-top{display:grid;grid-template-columns:42px 1fr 42px 42px;align-items:center;gap:8px;margin-bottom:26px}.ytm-btn{display:grid;place-items:center;width:42px;height:42px;border:0;border-radius:50%;background:transparent;color:#fff;font-size:1.2rem;font-weight:950}.ytm-close:before{content:"";width:13px;height:13px;border-left:3px solid currentColor;border-bottom:3px solid currentColor;transform:rotate(-45deg)}.ytm-cast:before{content:"";width:18px;height:14px;border:2px solid currentColor;border-radius:2px;clip-path:polygon(0 0,100% 0,100% 100%,58% 100%,58% 82%,0 82%)}
        .ytm-toggle{justify-self:center;display:inline-flex;padding:5px;border-radius:999px;background:rgba(255,255,255,.13)}.ytm-toggle span{min-width:70px;padding:8px 14px;border-radius:999px;color:#cfcfcf;text-align:center;font-size:.82rem;font-weight:950}.ytm-toggle .on{background:rgba(255,255,255,.15);color:#fff}.ytm-player-art{width:min(100%,360px);aspect-ratio:1/1;margin:0 auto 28px;border-radius:16px;background:#090909 center/cover no-repeat;box-shadow:0 28px 90px rgba(0,0,0,.6)}.ytm-player-meta{max-width:360px;margin:0 auto}.ytm-player-title{margin:0;font-size:1.34rem;line-height:1.13;letter-spacing:0}.ytm-player-artist{margin:7px 0 20px;color:#aaa;font-weight:850}.ytm-actions{display:flex;gap:10px;overflow-x:auto;margin:0 -2px 24px;scrollbar-width:none}.ytm-pill{flex:0 0 auto;min-height:40px;padding:8px 14px;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:.88rem;font-weight:900}.ytm-seek{width:100%;accent-color:#fff}.ytm-times{display:flex;justify-content:space-between;color:#aaa;font-size:.84rem;font-weight:800;margin:4px 0 18px}.ytm-controls{display:grid;grid-template-columns:44px 54px 78px 54px 44px;align-items:center;justify-content:center;gap:12px;margin:8px 0 24px}.ytm-control{display:grid;place-items:center;min-height:44px;border:0;border-radius:50%;background:transparent;color:#fff;font-size:1.12rem;font-weight:950}.ytm-control.play{width:74px;height:74px;background:#fff;color:#000}.ytm-control.play:before{content:"";width:0;height:0;border-top:15px solid transparent;border-bottom:15px solid transparent;border-left:22px solid currentColor;margin-left:6px}.ytm-control.play.playing:before{width:20px;height:26px;border:0;margin:0;background:linear-gradient(90deg,currentColor 0 35%,transparent 35% 65%,currentColor 65% 100%)}.ytm-control.prev:before,.ytm-control.next:before{content:"";width:20px;height:24px;background:currentColor;clip-path:polygon(0 50%,70% 0,70% 38%,100% 38%,100% 62%,70% 62%,70% 100%)}.ytm-control.next:before{transform:scaleX(-1)}.ytm-tabs{display:grid;grid-template-columns:repeat(3,1fr);color:#888;font-size:.78rem;font-weight:950;text-align:center}.ytm-tabs span:first-child{color:#fff}
      }
      @media(max-width:370px){.ytm-speed{grid-template-columns:repeat(2,minmax(118px,1fr))}.ytm-controls{gap:6px;grid-template-columns:40px 46px 70px 46px 40px}.ytm-control.play{width:68px;height:68px}}
    `;
    document.head.appendChild(style);
  }

  function home() {
    if (document.getElementById(HOME)) return;
    const node = document.createElement("section");
    node.id = HOME;
    node.className = "ytm-mobile-home";
    node.innerHTML = `
      <div class="ytm-appbar">
        <div class="ytm-brand"><span class="ytm-playmark"></span><span>Music</span></div>
        <button class="ytm-icon bell" type="button" aria-label="Notifications"></button>
        <button class="ytm-icon search" type="button" aria-label="Search"></button>
        <a class="ytm-icon logo" href="#audioLibrary" aria-label="I.M.L. profile"></a>
      </div>
      <div class="ytm-chips">${["Podcasts","Energize","Feel good","Relax","Workout","Party"].map(x => `<button class="ytm-chip" type="button">${x}</button>`).join("")}</div>
      <div class="ytm-section-title"><small>I.M.L.</small><h2>Speed dial</h2></div>
      <div class="ytm-speed" id="ytmSpeed"></div>
      <div class="ytm-dots"><span></span><span></span><span></span></div>
      <div class="ytm-list-head"><h2>Trending songs for you</h2><button class="ytm-play-all" type="button">Play all</button></div>
      <div class="ytm-list" id="ytmTrend"></div>`;
    document.body.insertBefore(node, $("main"));
    node.querySelector(".search")?.addEventListener("click", () => {
      $("#audioLibrary .feature-search")?.focus();
      $("#audioLibrary")?.scrollIntoView({ block: "start" });
    });
    node.querySelector(".ytm-play-all")?.addEventListener("click", () => $$("#audioLibrary .audio-track")[0]?.click());
  }

  function fillHome() {
    const speed = $("#ytmSpeed");
    const trend = $("#ytmTrend");
    const videos = $$("#videoPlaylistGrid [data-video-index]");
    const audio = $$("#audioLibrary .audio-track");
    if (!speed || !trend || !audio.length || speed.dataset.ready) return !!audio.length;
    speed.dataset.ready = "1";
    speed.innerHTML = videos.slice(0, 9).map(card => {
      const title = text(card);
      const img = card.querySelector(".playlist-thumb")?.style.backgroundImage || artFor(title);
      return `<button class="ytm-speed-card" type="button" data-video-index="${card.dataset.videoIndex}" style="background-image:${attr(img)}"><strong>${html(title)}</strong></button>`;
    }).join("");
    trend.innerHTML = [20, 6, 5, 2, 14, 24, 29, 30].map(i => audio[i]).filter(Boolean).map(button => {
      const title = text(button);
      return `<button class="ytm-row" type="button" data-audio-index="${button.dataset.audioIndex}"><span class="ytm-art" style="background-image:${attr(artFor(title))}"></span><span><strong>${html(title)}</strong><small>I.M.L.</small></span><span class="ytm-more">...</span></button>`;
    }).join("");
    $$(".ytm-speed-card").forEach(card => card.addEventListener("click", () => {
      $(`#videoPlaylistGrid [data-video-index="${card.dataset.videoIndex}"]`)?.click();
      $("#videoLibrary")?.scrollIntoView({ block: "start" });
    }));
    $$(".ytm-row").forEach(row => row.addEventListener("click", () => $(`#audioLibrary .audio-track[data-audio-index="${row.dataset.audioIndex}"]`)?.click()));
    return true;
  }

  function player() {
    if (document.getElementById(PLAYER)) return;
    const node = document.createElement("section");
    node.id = PLAYER;
    node.className = "ytm-mobile-player";
    node.setAttribute("aria-hidden", "true");
    node.innerHTML = `
      <div class="ytm-player-top"><button class="ytm-btn ytm-close" id="ytmClose" type="button" aria-label="Close player"></button><div class="ytm-toggle"><span class="on">Song</span><span>Video</span></div><button class="ytm-btn ytm-cast" type="button" aria-label="Cast"></button><button class="ytm-btn" type="button" aria-label="More options">...</button></div>
      <div class="ytm-player-art" id="ytmArt"></div>
      <div class="ytm-player-meta"><h2 class="ytm-player-title" id="ytmTitle">I.M.L.</h2><p class="ytm-player-artist">I.M.L.</p><div class="ytm-actions"><button class="ytm-pill" type="button">Like 2</button><button class="ytm-pill" type="button">Comment</button><button class="ytm-pill" type="button">Save</button><button class="ytm-pill" type="button">Share 2</button><button class="ytm-pill" type="button">Download</button></div><input class="ytm-seek" id="ytmSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Player position"><div class="ytm-times"><span id="ytmNow">0:00</span><span id="ytmTotal">0:00</span></div><div class="ytm-controls"><button class="ytm-control" type="button">Mix</button><button class="ytm-control prev" type="button" aria-label="Previous"></button><button class="ytm-control play" id="ytmPlay" type="button" aria-label="Play or pause"></button><button class="ytm-control next" type="button" aria-label="Next"></button><button class="ytm-control" type="button">Loop</button></div><div class="ytm-tabs"><span>UP NEXT</span><span>LYRICS</span><span>RELATED</span></div></div>`;
    document.body.appendChild(node);
    $("#ytmClose")?.addEventListener("click", closePlayer);
    $("#ytmPlay")?.addEventListener("click", e => {
      e.stopPropagation();
      $("#audioPlayButton")?.click();
    });
  }

  function format(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
  }

  function currentTitle() {
    return $("#audioNowTitle")?.textContent.trim() || text($("#audioLibrary .audio-track.active")) || "I.M.L.";
  }

  function sync() {
    const audio = $("#audioPlayer");
    const title = currentTitle();
    if ($("#ytmTitle")) $("#ytmTitle").textContent = title;
    if ($("#ytmArt")) $("#ytmArt").style.backgroundImage = artFor(title);
    if (!audio || !$("#ytmSeek")) return;
    const total = audio.duration || 0;
    $("#ytmSeek").value = total ? Math.round((audio.currentTime / total) * 1000) : 0;
    $("#ytmNow").textContent = format(audio.currentTime);
    $("#ytmTotal").textContent = format(total);
    $("#ytmPlay")?.classList.toggle("playing", !audio.paused);
  }

  function openPlayer() {
    if (!matchMedia(MOBILE).matches) return;
    sync();
    document.getElementById(PLAYER)?.classList.add("open");
    document.getElementById(PLAYER)?.setAttribute("aria-hidden", "false");
    document.body.classList.add("player-open");
  }

  function closePlayer() {
    document.getElementById(PLAYER)?.classList.remove("open");
    document.getElementById(PLAYER)?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("player-open");
  }

  function wire() {
    const audio = $("#audioPlayer");
    const deck = $("#audioDeck");
    if (!audio || !deck || deck.dataset.ytmReady) return false;
    deck.dataset.ytmReady = "1";
    deck.addEventListener("click", event => {
      if (event.target.closest("button,input")) return;
      openPlayer();
    });
    ["play", "pause", "timeupdate", "loadedmetadata"].forEach(type => audio.addEventListener(type, sync));
    $("#ytmSeek")?.addEventListener("input", () => {
      const total = audio.duration || 0;
      if (total) audio.currentTime = (Number($("#ytmSeek").value) / 1000) * total;
    });
    $$("#audioLibrary .audio-track").forEach(button => button.addEventListener("click", () => setTimeout(sync, 80)));
    sync();
    return true;
  }

  function boot() {
    css();
    document.body.classList.add("mobile-ytm");
    home();
    player();
    if (fillHome() && wire()) return;
    let busy = false;
    const observer = new MutationObserver(() => {
      if (busy) return;
      busy = true;
      requestAnimationFrame(() => {
        busy = false;
        fillHome();
        if (wire()) observer.disconnect();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
