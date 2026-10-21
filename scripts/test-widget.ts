import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";

const html = readFileSync(resolve("distribution/jornada-widget.html"), "utf8");
const server = createServer((req, res) => {
  if (req.url?.startsWith("/widget.html")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  } else {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      '<!doctype html><html lang="pt-BR"><head><title>WordPress fixture</title></head><body style="margin:0;background:#fafafa"><h1 id="theme-marker" style="display:none">Tema WordPress preservado</h1><iframe title="Jornada Mente de Aprovado" sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation" style="width:100%;height:100dvh;border:0;display:block"></iframe><script>fetch("/widget.html").then(r=>r.text()).then(html=>{const frame=document.querySelector("iframe");frame.dataset.campaignSearch=location.search;frame.srcdoc=html;});</script></body></html>',
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
  const unexpected: string[] = [];
  const errors: string[] = [];
  page.on("request", (req) => {
    if (
      !req.url().startsWith(`http://127.0.0.1:${address.port}/`) &&
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
    await expect(frame.locator("h1")).toContainText("SUA MENTE?");
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
