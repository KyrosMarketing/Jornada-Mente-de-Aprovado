/** Load a real platform recording only when its presentation enters the viewport. */
export function initializeProductPreview() {
  const stage = document.querySelector<HTMLElement>("[data-product-preview]");
  const video = stage?.querySelector<HTMLVideoElement>("video");
  const toggle = stage?.querySelector<HTMLButtonElement>(".preview-toggle");
  if (!stage || !video || !toggle) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const status = stage.querySelector<HTMLElement>("[data-preview-status]");
  let active = false;
  let loaded = false;
  let userPaused = false;
  video.muted = true;
  video.autoplay = !reduced.matches;
  if (status) status.textContent = "Conheça a plataforma no seu ritmo.";

  function unavailable() {
    stage!.classList.remove("is-ready");
    toggle!.hidden = true;
    if (status) status.textContent = "Prévia indisponível no momento.";
  }
  function load() {
    if (loaded) return;
    loaded = true;
    const formats = (["webm", "mp4"] as const).filter(
      (format) => video!.dataset[format],
    );
    let failures = 0;
    for (const format of formats) {
      const url = video!.dataset[format];
      if (!url) continue;
      const source = document.createElement("source");
      source.src = url;
      source.type = `video/${format}`;
      source.addEventListener("error", () => {
        failures++;
        if (failures === formats.length) unavailable();
      });
      video!.append(source);
    }
    video!.load();
  }
  function play() {
    load();
    void video!.play().catch(() => {
      toggle!.hidden = false;
      toggle!.textContent = "Reproduzir prévia";
    });
  }
  video.addEventListener("loadeddata", () => stage.classList.add("is-ready"));
  video.addEventListener("play", () => {
    toggle.hidden = false;
    toggle.textContent = "Pausar prévia";
  });
  video.addEventListener("pause", () => {
    toggle.textContent = "Reproduzir prévia";
  });
  video.addEventListener("error", unavailable);
  toggle.addEventListener("click", () => {
    if (video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      video.pause();
    }
  });
  reduced.addEventListener("change", () => {
    video.autoplay = !reduced.matches;
    if (reduced.matches) video.pause();
  });
  new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
      if (!active) {
        video.pause();
        return;
      }
      if (video.dataset.poster && !video.poster) {
        video.poster = video.dataset.poster;
        stage.classList.add("has-poster");
      }
      toggle.hidden = false;
      if (!reduced.matches && !userPaused) play();
    },
    { rootMargin: "120px 0px", threshold: 0.2 },
  ).observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else if (active && !reduced.matches && !userPaused) play();
  });
}
