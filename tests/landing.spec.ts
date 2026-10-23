import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { buildCheckoutUrl } from "../src/checkout";

test("encaminha atribuição sem perder parâmetros comerciais nem aceitar destinos falsos", () => {
  const url = new URL(
    buildCheckoutUrl(
      "https://pay.hotmart.com/G108112534E?off=OFICIAL",
      "?utm_source=instagram&utm_campaign=reta-final&sck=campanha&email=privado@example.com",
    )!,
  );
  expect(url.searchParams.get("off")).toBe("OFICIAL");
  expect(url.searchParams.get("utm_source")).toBe("instagram");
  expect(url.searchParams.get("utm_campaign")).toBe("reta-final");
  expect(url.searchParams.get("sck")).toBe("campanha");
  expect(url.searchParams.has("email")).toBe(false);
  expect(buildCheckoutUrl("https://hotmart.com.fake.example/")).toBeNull();
  expect(buildCheckoutUrl("http://pay.hotmart.com/G108112534E")).toBeNull();
  expect(buildCheckoutUrl("javascript:alert(1)")).toBeNull();
});

test("todos os CTAs usam o checkout oficial e a atribuição da visita", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    "/?utm_source=instagram&utm_medium=social&utm_campaign=teste",
  );
  await expect(page.locator("h1")).toHaveAccessibleName(
    "Você estudou para a prova. Mas preparou sua mente?",
  );
  const ctas = page.locator("[data-buy]");
  expect(await ctas.count()).toBe(6);
  for (const link of await ctas.all()) {
    const href = new URL((await link.getAttribute("href"))!);
    expect(href.origin + href.pathname).toBe(
      "https://pay.hotmart.com/G108112534E",
    );
    expect(href.searchParams.get("utm_campaign")).toBe("teste");
  }
  await page.route("https://pay.hotmart.com/**", (route) =>
    route.fulfill({
      body: "<h1>Hotmart: destino de teste</h1>",
      contentType: "text/html",
    }),
  );
  await page.locator('[data-buy="hero"]').click();
  await expect(page).toHaveURL(
    /pay\.hotmart\.com\/G108112534E\?.*utm_source=instagram/,
  );
  expect(errors).toEqual([]);
});

test("módulos e FAQ funcionam pelo teclado e atualizam o painel", async ({
  page,
}) => {
  await page.goto("/");
  const anxiety = page.locator('[data-module="2"]');
  await anxiety.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(anxiety).toHaveAttribute("open", "");
  await expect(page.locator('[data-module="0"]')).not.toHaveAttribute("open");
  await expect(page.locator("#visual-word")).toHaveText("RESPIRE.");
  await expect(anxiety.locator(".module-content")).toContainText(
    "sem finalidade diagnóstica",
  );
  const faq = page.locator(".faq-item").last();
  await faq.locator("summary").focus();
  await page.keyboard.press("Space");
  await expect(faq.locator("p")).toBeVisible();
  await expect(faq.locator("p")).toContainText("não substitui");
});

for (const width of [375, 390, 430, 768, 1440]) {
  test(`layout e navegação em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('[data-buy="hero"]')).toBeInViewport();
    const portraitCrop = await page
      .locator(".portrait-crop")
      .evaluate((el) => ({
        frame: el.clientHeight,
        image: el.querySelector("img")!.clientHeight,
      }));
    expect(portraitCrop.frame).toBeGreaterThan(0);
    expect(
      Math.abs(portraitCrop.image * 0.875 - portraitCrop.frame),
    ).toBeLessThan(2);
    await expect(page.locator(".marquee-divider svg").first()).toBeVisible();
    expect(await page.locator(".marquee-track").textContent()).not.toContain(
      "✳",
    );
    if (width < 700) {
      await expect(page.locator(".mobile-buy")).not.toBeVisible();
      await page.locator("#jornada").scrollIntoViewIfNeeded();
      await expect(page.locator(".mobile-buy")).toBeVisible();
      await page.locator("#inscricao").scrollIntoViewIfNeeded();
      await expect(page.locator(".mobile-buy")).not.toBeVisible();
      await page.locator(".site-footer").scrollIntoViewIfNeeded();
      await expect(page.locator(".mobile-buy")).not.toBeVisible();
    }
    if (width === 390 || width === 1440) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `test-results/landing-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  });
}

test("privacidade exige consentimento e a preferência é persistida", async ({
  page,
}) => {
  const trackers: string[] = [];
  page.on("request", (req) => {
    if (/google-analytics|googletagmanager|facebook\.net/.test(req.url()))
      trackers.push(req.url());
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Preferências de privacidade" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Você escolhe." });
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Somente essenciais" }).click();
  await expect(dialog).not.toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("preparamente:analytics-consent:v1"),
    ),
  ).toBe("essential");
  await page.reload();
  expect(trackers).toEqual([]);
  await page
    .getByRole("button", { name: "Informações comerciais", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("em validação");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Informações comerciais", exact: true }),
  ).toBeFocused();
});

test("sem violações WCAG A/AA detectáveis no desktop, celular e accordions abertos", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator('[data-module="2"] summary').click();
    await page.locator(".faq-item").last().locator("summary").click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("reduced motion, imagens locais e build de revisão sem indexação", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page
      .locator(".hero-photo")
      .evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
  ).toBe(true);
  await expect(
    page.locator('script[src*="facebook"],script[src*="googletagmanager"]'),
  ).toHaveCount(0);
});

test("rastreadores configurados só carregam com consentimento e clique nunca dispara Purchase", async ({
  page,
}) => {
  await page.route(
    /https:\/\/(www\.googletagmanager\.com|connect\.facebook\.net)\//,
    (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: "// Fornecedor interceptado no teste; nenhuma chamada externa.",
      }),
  );
  await page.goto("http://127.0.0.1:4174/");
  await expect(
    page.getByRole("dialog", { name: "Você escolhe." }),
  ).toBeVisible();
  const scripts = page.locator(
    'script[src*="facebook"],script[src*="googletagmanager"]',
  );
  await expect(scripts).toHaveCount(0);
  await page.getByRole("button", { name: "Somente essenciais" }).click();
  await expect(scripts).toHaveCount(0);
  await page
    .getByRole("button", { name: "Preferências de privacidade" })
    .click();
  await page
    .getByRole("button", { name: "Permitir análise e publicidade" })
    .click();
  await expect(scripts).toHaveCount(2);
  await page
    .locator('[data-buy="hero"]')
    .evaluate((el) => el.addEventListener("click", (e) => e.preventDefault()));
  await page.locator('[data-buy="hero"]').click();
  const events = await page.evaluate(() => {
    const w = window as unknown as Window & {
      dataLayer: IArguments[];
      fbq: { queue: unknown[][] };
    };
    return {
      google: w.dataLayer
        .filter((item) => item[0] === "event")
        .map((item) => item[1]),
      meta: w.fbq.queue,
    };
  });
  expect(events.google).toEqual([
    "page_view",
    "view_content",
    "cta_click",
    "checkout_redirect",
  ]);
  expect(JSON.stringify(events.meta)).not.toContain("Purchase");
  await page
    .getByRole("button", { name: "Preferências de privacidade" })
    .click();
  await Promise.all([
    page.waitForEvent("framenavigated"),
    page.getByRole("button", { name: "Somente essenciais" }).click(),
  ]);
  await page.waitForLoadState();
  await expect(scripts).toHaveCount(0);
});

test("materiais oficiais e vídeo institucional sem contato com YouTube antes do play", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (req) => {
    if (/youtube|ytimg/.test(req.url())) videoRequests.push(req.url());
  });
  await page.goto("/");
  const logo = page.locator(".site-header .official-logo");
  await expect(logo).toHaveAttribute("alt", "PreparaMente");
  await expect
    .poll(() =>
      logo.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const portrait = page.locator(".instructor-art img");
  await portrait.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      portrait.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(portrait).toHaveAttribute("src", /mateus-retrato\.webp/);
  await expect(portrait).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".video-copy")).toContainText(
    "não é uma apresentação específica da Jornada",
  );
  await expect(page.locator(".video-privacy")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Assistir no YouTube/ }),
  ).toHaveCount(0);
  expect(videoRequests).toEqual([]);
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Player interceptado para teste; sem reprodução externa.</p>",
    }),
  );
  await page
    .getByRole("button", {
      name: "Reproduzir vídeo institucional de Mateus Tiujo e do Preparamente",
    })
    .click();
  await expect(page.locator(".video-panel iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/sIXC3d7DKdg?autoplay=1&rel=0&playsinline=1",
  );
  await expect(page.locator(".video-panel iframe")).toHaveAttribute(
    "title",
    /institucional/,
  );
  expect(videoRequests.length).toBe(1);
});

test("cinco relatos autênticos, loop sem salto, pausa e modo de movimento reduzido", async ({
  page,
}) => {
  await page.goto("/");
  const group = page.getByRole("list", {
    name: "Cinco relatos fornecidos pelo Preparamente",
  });
  await expect(group.getByRole("listitem")).toHaveCount(5);
  await expect(group.locator("figcaption strong")).toHaveText([
    "Isabela C.",
    "Alex G.",
    "Yan S.",
    "Pedro E.",
    "Vinicius A.",
  ]);
  await expect(page.locator(".testimonials-context")).toContainText(
    "Não são avaliações de compradores da Jornada",
  );
  await expect(group.getByRole("link")).toHaveCount(0);
  await page.getByRole("button", { name: "Pausar depoimentos" }).click();
  await expect(page.locator(".reviews-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.getByRole("button", { name: "Retomar depoimentos" }).click();
  await expect(page.locator(".reviews-track")).toHaveCSS(
    "animation-play-state",
    "running",
  );
  await page.locator(".reviews-viewport").hover();
  await expect(page.locator(".reviews-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  const seam = await page.locator(".reviews-track").evaluate((track) => {
    const groups = track.querySelectorAll<HTMLElement>(".reviews-group");
    const animation = track.getAnimations()[0];
    const duration = Number(animation.effect!.getTiming().duration);
    animation.pause();
    animation.currentTime = duration - 1;
    const last = groups[1].getBoundingClientRect().left;
    animation.currentTime = duration + 1;
    const first = groups[0].getBoundingClientRect().left;
    return {
      difference: Math.abs(last - first),
      matching: groups[0].textContent === groups[1].textContent,
      hidden: groups[1].getAttribute("aria-hidden"),
      inert: groups[1].inert,
    };
  });
  expect(seam.difference).toBeLessThan(1);
  expect(seam.matching && seam.inert).toBe(true);
  expect(seam.hidden).toBe("true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".reviews-track")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(
    page.locator('.reviews-group[aria-hidden="true"]'),
  ).not.toBeVisible();
  await expect(page.locator(".reviews-viewport")).toHaveCSS(
    "overflow-x",
    "auto",
  );
});

test("identidade da Jornada, copy preservada e parcelamento claro", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-promise")).toHaveText(
    "VOCÊ ESTUDOU PARA A PROVA. MAS PREPAROU SUA MENTE?",
  );
  await expect(page.locator(".image-caption p")).toHaveCount(0);
  await expect(page.locator(".image-caption a")).toHaveAttribute(
    "href",
    "#jornada",
  );
  await expect(page.locator(".hero-photo")).toHaveAttribute(
    "src",
    /jornada-produto-960/,
  );
  await expect(page.locator(".marquee")).toHaveAccessibleName(
    /Alta performance, Organização/,
  );
  await expect(page.locator(".offer-identity")).toHaveAccessibleName(
    "Jornada Mente de Aprovado",
  );
  await expect(page.locator(".offer-installment")).toHaveText(
    /12x de R\$\s6,93/,
  );
  await expect(page.locator(".offer-cash")).toHaveText(/ou R\$\s67,00 à vista/);
  await expect(page.locator(".installment-total")).toHaveText(
    /Total parcelado: R\$\s83,16/,
  );
  await expect(page.locator(".journey-path")).toHaveCount(1);
  await expect(page.locator("#cinema-title")).toHaveText(
    "A PROVA É UM DIA.A PREPARAÇÃOÉ UMA JORNADA.",
  );
});

test("hero mobile preserva proporção e separação da esteira ao redimensionar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .locator(".hero-photo")
    .evaluate((img: HTMLImageElement) => img.decode());
  for (const [width, height] of [
    [375, 812],
    [844, 390],
    [390, 650],
    [430, 932],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    if (width > 700) continue;
    const photo = await page
      .locator(".hero-photo")
      .evaluate((img: HTMLImageElement) => {
        const box = img.getBoundingClientRect();
        return {
          ratio: box.width / box.height,
          original: img.naturalWidth / img.naturalHeight,
          height: box.height,
          frameHeight: img.parentElement!.getBoundingClientRect().height,
          photoBottom: box.bottom,
          footer: document
            .querySelector(".hero-bottom")!
            .getBoundingClientRect()
            .toJSON(),
          heroBottom: document.querySelector(".hero")!.getBoundingClientRect()
            .bottom,
          marqueeTop: document
            .querySelector(".marquee")!
            .getBoundingClientRect().top,
        };
      });
    expect(photo.height).toBeGreaterThan(0);
    expect(Math.abs(photo.ratio - photo.original)).toBeLessThan(0.002);
    expect(Math.abs(photo.frameHeight - photo.height)).toBeLessThan(1);
    expect(photo.footer.top).toBeGreaterThanOrEqual(photo.photoBottom - 1);
    expect(photo.marqueeTop).toBeGreaterThanOrEqual(photo.footer.bottom - 1);
    expect(photo.heroBottom).toBeGreaterThanOrEqual(photo.footer.bottom - 1);
    expect(photo.marqueeTop - photo.photoBottom).toBeGreaterThanOrEqual(40);
  }
});

test("hero reserva espaço para a foto e a esteira durante carregamento lento", async ({
  page,
}) => {
  let releaseImage!: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseImage = resolve;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/images/jornada-produto-*.webp", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".hero-photo")).toBeVisible();
    for (const loaded of [false, true]) {
      if (loaded) {
        releaseImage();
        await page
          .locator(".hero-photo")
          .evaluate((img: HTMLImageElement) => img.decode());
      }
      const layout = await page
        .locator(".hero-photo")
        .evaluate((img: HTMLImageElement) => ({
          imageBottom: img.getBoundingClientRect().bottom,
          footerTop: document
            .querySelector(".hero-bottom")!
            .getBoundingClientRect().top,
          footerBottom: document
            .querySelector(".hero-bottom")!
            .getBoundingClientRect().bottom,
          marqueeTop: document
            .querySelector(".marquee")!
            .getBoundingClientRect().top,
        }));
      expect(layout.footerTop).toBeGreaterThanOrEqual(layout.imageBottom - 1);
      expect(layout.marqueeTop).toBeGreaterThanOrEqual(layout.footerBottom - 1);
      expect(layout.marqueeTop - layout.imageBottom).toBeGreaterThanOrEqual(40);
    }
  } finally {
    releaseImage();
  }
});

test("refinamento comercial mantém relato integral, adequação ao curso e condições coerentes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-photo")).toHaveAttribute(
    "alt",
    /Mockup digital da Jornada/,
  );
  await expect(page.locator(".hero-exams")).toHaveText(
    "Para ENEM, Fuvest, Unicamp, UFPR e outros vestibulares.",
  );
  await expect(
    page.locator(".audience-card").first().locator("li"),
  ).toHaveCount(4);
  await expect(page.locator(".audience-card").last().locator("li")).toHaveCount(
    3,
  );
  await expect(page.locator(".audience-limits")).toContainText(
    "acompanhamento psicológico adequado",
  );
  await expect(page.locator(".featured-review blockquote")).toHaveText(
    "Quando conheci o trabalho da equipe pelo Instagram,confesso que bateu aquela dúvida natural por serem de outro estado. Mas fiz minha pesquisa, conversei com o time e decidi confiar. Hoje, após 4 semanas de acompanhamento com a minha filha, só tenho a agradecer! Que entrega incrível! A atenção, a organização e o profissionalismo de vocês têm sido fundamentais para ela construir uma rotina de estudos de verdade e se sentir incentivada todos os dias. Ter a certeza de que ela está em boas mãos, mesmo à distância, traz uma paz enorme. Parabéns pelo trabalho impecável! Obrigada! 🙏 ❤️",
  );
  await expect(page.locator(".featured-review")).toContainText("@rosana_srs");
  await expect(page.locator(".featured-review .review-stars")).toHaveCount(0);
  await expect(page.locator(".product-art > .concept-note")).toHaveCount(0);
  await expect(page.locator(".instructor-name")).toContainText(
    "Especialista em Neuropsicologia",
  );
  await expect(page.locator(".offer-reassurance")).toContainText(
    "7 dias de garantia",
  );
  await expect(page.locator(".offer-reassurance")).toContainText(
    "Acesso imediato pela Hotmart",
  );
  await expect(page.locator(".offer-reassurance")).toContainText(
    "Após a confirmação do pagamento.",
  );
  await expect(page.locator(".faq-item")).toHaveCount(8);
  const minor = page
    .locator(".faq-item")
    .filter({ hasText: "Meu filho tem 16 anos. Ele pode fazer?" });
  await minor.locator("summary").click();
  await expect(minor.locator("p")).toContainText("estudantes de 16 a 26 anos");
  const access = page
    .locator(".faq-item")
    .filter({ hasText: "Quando recebo o acesso e por quanto tempo?" });
  await access.locator("summary").click();
  await expect(access.locator("p")).toContainText(
    "Consulte a duração do acesso",
  );
});

test("hierarquia da hero, confiança, placeholder e FAQ de garantia", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveAccessibleName(
    "Você estudou para a prova. Mas preparou sua mente?",
  );
  await expect(page.locator(".hero-identity")).toHaveCount(0);
  await expect(page.locator(".trust-strip li")).toHaveCount(5);
  await expect(page.locator(".trust-strip")).toContainText(
    "Acesso liberado após a confirmação do pagamento.",
  );
  await expect(page.locator(".preview-stage video")).toHaveCount(0);
  await expect(page.locator(".preview-fallback")).toContainText(
    "Vídeo de apresentação em breve.",
  );
  await expect(page.locator(".module-number")).toHaveText([
    "01",
    "02",
    "03",
    "04",
    "05",
  ]);
  await expect(page.locator(".module summary .expand-icon")).toHaveCount(5);
  const warranty = page
    .locator(".faq-item")
    .filter({ hasText: "Como funciona o acesso e a garantia?" });
  await warranty.locator("summary").click();
  await expect(warranty.locator("p")).toContainText("7 dias de garantia");
  await expect(warranty.locator("p")).toContainText(
    "após a confirmação do pagamento",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#jornada").scrollIntoViewIfNeeded();
  await expect(page.locator(".mobile-buy")).toBeVisible();
  await expect(page.locator(".mobile-buy")).toHaveCSS(
    "background-color",
    "rgb(251, 175, 64)",
  );
});

test("apresentação usa capa, carrega por clique com som e controles e mantém fallback", async ({
  page,
}) => {
  let mediaRequests = 0;
  let failVideo = false;
  const fixture = readFileSync(
    new URL("./fixtures/preview-test.mp4", import.meta.url),
  );
  await page.route("**/src/offer.ts*", async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace(/mp4:\s*null/, 'mp4: "https://media.example.test/preview.mp4"')
      .replace(/poster:\s*null/, 'poster: "images/jornada-produto-640.webp"');
    await route.fulfill({ response, body });
  });
  await page.route("https://media.example.test/preview.mp4", (route) => {
    mediaRequests++;
    return route.fulfill({
      contentType: "video/mp4",
      body: failVideo ? Buffer.from("invalid test video") : fixture,
    });
  });
  await page.goto("/");
  const direction = page.locator(".product-direction");
  await expect(direction).toHaveText("Veja o que você vai trabalhar");
  expect(await direction.evaluate((el) => el.tagName)).toBe("SPAN");
  await expect(direction).not.toHaveAttribute("href");
  await expect(direction).toHaveCSS("border-bottom-width", "0px");
  await expect(direction.locator("svg")).toHaveCount(1);
  const video = page.locator(".product-preview-video");
  await expect(video).toHaveAttribute("preload", "none");
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.reload();
    mediaRequests = 0;
    await page.locator(".preview-stage").scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute("poster", /jornada-produto-640.webp/);
    await expect(page.locator(".preview-fallback")).toBeHidden();
    const play = page.getByRole("button", { name: "Assistir à apresentação" });
    await expect(play).toBeVisible();
    expect(mediaRequests).toBe(0);
    await play.click();
    await expect
      .poll(() =>
        video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2),
      )
      .toBe(true);
    expect(
      await video.evaluate(
        (v: HTMLVideoElement) =>
          !v.muted && !v.loop && !v.autoplay && v.playsInline && v.controls,
      ),
    ).toBe(true);
    await expect(play).toBeHidden();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(true);
    await page.locator(".preview-stage").scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
      .toBe(true);
  }
  failVideo = true;
  await page.reload();
  await page.locator(".preview-stage").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Assistir à apresentação" }).click();
  await expect(page.locator("[data-preview-status]")).toHaveText(
    "Apresentação indisponível no momento.",
  );
  await expect(page.locator(".preview-toggle")).toBeHidden();
});

test("degradê acompanha os limites reais do mockup também no desktop", async ({
  page,
}) => {
  for (const width of [768, 1440, 2048]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.goto("/");
    const geometry = await page
      .locator(".hero-photo")
      .evaluate(async (img: HTMLImageElement) => {
        await img.decode();
        const box = img.getBoundingClientRect();
        return {
          displayed: box.width / box.height,
          original: img.naturalWidth / img.naturalHeight,
        };
      });
    expect(Math.abs(geometry.displayed - geometry.original)).toBeLessThan(
      0.002,
    );
  }
});
