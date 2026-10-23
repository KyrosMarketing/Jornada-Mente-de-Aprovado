/** Show the official cover first; load the presentation only after a play click. */
export function initializeProductPreview() {
  const stage = document.querySelector<HTMLElement>("[data-product-preview]");
  const video = stage?.querySelector<HTMLVideoElement>("video");
  const toggle = stage?.querySelector<HTMLButtonElement>(".preview-toggle");
  if (!stage || !video || !toggle) return;

  const status = stage.querySelector<HTMLElement>("[data-preview-status]");
  let loaded = false;
  let unavailable = false;

  function showError() {
    unavailable = true;
    stage!.classList.remove("is-ready", "has-poster");
    video!.controls = false;
    toggle!.hidden = true;
    if (status) status.textContent = "Apresentação indisponível no momento.";
  }
  function showPoster() {
    if (unavailable) return;
    if (video!.dataset.poster && !video!.poster) {
      video!.poster = video!.dataset.poster;
      stage!.classList.add("has-poster");
    }
    toggle!.hidden = false;
  }
  function load() {
    if (loaded) return;
    loaded = true;
    const formats = (["webm", "mp4"] as const).filter(
      (format) => video!.dataset[format],
    );
    let failures = 0;
    for (const format of formats) {
      const source = document.createElement("source");
      source.src = video!.dataset[format]!;
      source.type = `video/${format}`;
      source.addEventListener("error", () => {
        if (++failures === formats.length) showError();
      });
      video!.append(source);
    }
    video!.load();
  }

  if (status) status.textContent = "Assista à apresentação da Jornada.";
  video.addEventListener("loadeddata", () => stage.classList.add("is-ready"));
  video.addEventListener("playing", () => {
    toggle.hidden = true;
  });
  video.addEventListener("error", showError);
  toggle.addEventListener("click", () => {
    showPoster();
    load();
    video.controls = true;
    void video.play().catch(() => {
      if (!unavailable) {
        toggle.hidden = false;
        toggle.textContent = "▶ Reproduzir apresentação";
      }
    });
  });
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) showPoster();
      else video.pause();
    },
    { rootMargin: "120px 0px", threshold: 0.2 },
  ).observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
  });
}
