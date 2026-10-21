import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";

const html = readFileSync(resolve("distribution/jornada-widget.html"), "utf8");
const snippet = readFileSync(
  resolve("distribution/colar-no-widget.html"),
  "utf8",
);
const server = createServer((req, res) => {
  if (req.url?.startsWith("/widget.html")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  } else {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      '<!doctype html><html lang="pt-BR"><head><title>WordPress fixture</title></head><body style="margin:0;background:#fafafa"><h1 id="theme-marker" style="display:none">Tema WordPress preservado</h1>' +
        snippet +
        "</body></html>",
    );
  }
});
await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
const address = server.address();
assert(address && typeof address === "object");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Intercept only the public HTML delivery; the browser still verifies CORS and SRI.
  await page.route(
    "https://raw.githubusercontent.com/KyrosMarketing/Jornada-Mente-de-Aprovado/**/distribution/jornada-widget.html",
    (route) =>
      route.fulfill({
        contentType: "text/plain; charset=utf-8",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: html,
      }),
  );
  const unexpected: string[] = [];
  const errors: string[] = [];
  page.on("request", (req) => {
    if (
      !req.url().startsWith(`http://127.0.0.1:${address.port}/`) &&
      !req
        .url()
        .startsWith(
          "https://raw.githubusercontent.com/KyrosMarketing/Jornada-Mente-de-Aprovado/",
        ) &&
      !req.url().startsWith("data:") &&
      !req.url().startsWith("about:")
    )
      unexpected.push(req.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      `http://127.0.0.1:${address.port}/pagina-wordpress/?utm_source=instagram&utm_campaign=widget`,
    );
    const frame = page.frameLocator("iframe");
    await expect(page.locator("iframe")).toHaveAttribute("allow", /fullscreen/);
    await expect(frame.locator("h1")).toHaveAccessibleName(
      "Jornada Mente de Aprovado",
    );
    await expect(frame.locator(".offer-installment")).toHaveText(
      /12x de R\$\s6,93/,
    );
    assert(
      await frame
        .locator(".hero-photo")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    );
    assert(
      (await frame.locator(".hero-photo").getAttribute("src"))!.startsWith(
        "data:image/webp;base64,",
      ),
    );
    assert(
      await frame.locator("body").evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('500 16px "Space Grotesk Variable"');
      }),
    );
    await frame.locator('[data-module="2"] summary').click();
    await expect(frame.locator("#visual-word")).toHaveText("RESPIRE.");
    await frame
      .getByRole("button", { name: "Preferências de privacidade" })
      .click();
    await frame.getByRole("button", { name: "Somente essenciais" }).click();
    assert.equal(
      await frame
        .locator("body")
        .evaluate(() =>
          localStorage.getItem("preparamente:analytics-consent:v1"),
        ),
      "essential",
    );
    const checkout = new URL(
      (await frame.locator('[data-buy="hero"]').getAttribute("href"))!,
    );
    assert.equal(checkout.searchParams.get("utm_source"), "instagram");
    assert.equal(checkout.searchParams.get("utm_campaign"), "widget");
    assert(
      await page
        .locator("body")
        .evaluate(
          () =>
            getComputedStyle(document.body).backgroundColor ===
            "rgb(250, 250, 250)",
        ),
    );
    console.log(
      `Widget HTML ${width}px aprovado: imagem/fontes incorporadas, módulos, privacidade, UTM e isolamento do tema.`,
    );
  }
  assert.deepEqual(unexpected, []);
  assert.deepEqual(errors, []);
  const embedded = page.frameLocator("iframe");
  await expect(embedded.locator(".video-privacy")).toHaveCount(0);
  await expect(
    embedded.getByRole("link", { name: /Assistir no YouTube/ }),
  ).toHaveCount(0);
  await expect(embedded.locator(".instructor-art img")).toHaveAttribute(
    "src",
    /^data:image\/webp;base64,/,
  );
  await embedded.getByRole("button", { name: "Pausar depoimentos" }).click();
  await expect(embedded.locator(".reviews-track")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Vídeo de teste interceptado</p>",
    }),
  );
  await embedded
    .getByRole("button", {
      name: "Reproduzir vídeo institucional de Mateus Tiujo e do Preparamente",
    })
    .click();
  await expect(embedded.locator(".video-panel iframe")).toHaveAttribute(
    "src",
    /sIXC3d7DKdg/,
  );
  console.log(
    "Widget atualizado: retrato oficial incorporado, pausa dos relatos e player institucional responsivo aprovados.",
  );

  await page.route("https://pay.hotmart.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>Checkout de teste</h1>",
    }),
  );
  await page.frameLocator("iframe").locator('[data-buy="hero"]').click();
  await expect(page).toHaveURL(/pay\.hotmart\.com\/G108112534E/);
  console.log(
    "Compra abre na janela principal, sem checkout preso no iframe. Nenhuma compra efetuada.",
  );
} finally {
  await browser.close();
  await new Promise<void>((done) => server.close(() => done()));
}
