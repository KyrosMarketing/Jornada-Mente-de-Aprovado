import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const root = mkdtempSync(join(tmpdir(), "jornada-hostinger-test-"));
const folder = "jornada-mente-de-aprovado";
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
const server = createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url!, "http://localhost").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root + "/")) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (statSync(file).isDirectory()) file = join(file, "index.html");
    res.setHeader(
      "Content-Type",
      types[extname(file)] || "application/octet-stream",
    );
    res.end(readFileSync(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  mkdirSync(join(root, folder));
  execFileSync("unzip", [
    "-q",
    resolve("artifacts/jornada-hostinger-previa.zip"),
    "-d",
    join(root, folder),
  ]);
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert(address && typeof address === "object");
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors: string[] = [];
  const failures: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  const url = `http://127.0.0.1:${address.port}/${folder}/?utm_source=hostinger-test`;
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal((await page.goto(url))?.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveAccessibleName(
      "Você estudou para a prova. Mas preparou sua mente?",
    );
    assert.equal(await page.locator("[data-module]").count(), 5);
    assert(
      await page
        .locator(".hero-photo")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    );
    assert(
      await page.evaluate(
        () =>
          document.fonts.check('500 16px "Space Grotesk Variable"') &&
          document.fonts.check('400 16px "Inter Variable"'),
      ),
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      "noindex,nofollow",
    );
    assert.equal(
      new URL(
        (await page.locator('[data-buy="hero"]').getAttribute("href"))!,
      ).searchParams.get("utm_source"),
      "hostinger-test",
    );
    await page.locator('[data-module="2"] summary').click();
    await expect(page.locator("#visual-word")).toHaveText("RESPIRE.");
    await page.locator(".cinema").scrollIntoViewIfNeeded();
    await expect(page.locator(".journey-path")).toBeVisible();
    console.log(
      `ZIP extraído em subpasta: layout ${width}px, imagens, fontes, módulos, checkout e noindex aprovados.`,
    );
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  assert(
    readFileSync(join(root, folder, ".htaccess"), "utf8").includes(
      'X-Robots-Tag "noindex, nofollow"',
    ),
  );
  console.log(
    "Sem erros de JavaScript ou arquivos ausentes. Cabeçalhos Apache/Hostinger requerem validação após upload real.",
  );
} finally {
  await browser?.close();
  await new Promise<void>((done) => server.close(() => done()));
  rmSync(root, { recursive: true, force: true });
}
