import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, resolve } from "node:path";

import { offer } from "../src/offer";

// Keep recordings outside the HTML, preserving lazy loading in the WordPress widget.
for (const source of [offer.productPreview.mp4, offer.productPreview.webm]) {
  if (source && !source.startsWith("https://"))
    throw new Error(
      "No widget, configure o vídeo com uma URL HTTPS do WordPress/CDN para preservar o carregamento sob demanda.",
    );
}
const dist = resolve("dist");
let html = readFileSync(join(dist, "index.html"), "utf8");
if (!html.includes('content="noindex,nofollow"'))
  throw new Error("O widget de prévia exige um build noindex.");
const mime: Record<string, string> = {
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
const dataUri = (file: string) =>
  `data:${mime[extname(file)]};base64,${readFileSync(file).toString("base64")}`;
html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, "");
html = html.replace(
  /href="\.\/favicon\.svg"/,
  `href="${dataUri(join(dist, "favicon.svg"))}"`,
);
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
  const href = tag.match(/href="([^\"]+)"/)?.[1];
  if (!href) throw new Error("Stylesheet sem endereço.");
  const file = resolve(dist, href);
  let css = readFileSync(file, "utf8");
  css = css.replace(/url\(([^)]+)\)/g, (_, url: string) => {
    const font = resolve(dist, "assets", url.replace(/["']/g, ""));
    if (!existsSync(font))
      throw new Error(`Fonte local ausente: ${basename(font)}`);
    return `url(${dataUri(font)})`;
  });
  return `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`;
});
const images = Object.fromEntries(
  readdirSync(join(dist, "images"))
    .filter((name) => /\.(webp|svg)$/.test(name))
    .map((name) => [`images/${name}`, dataUri(join(dist, "images", name))]),
);
html = html.replace(
  '<div id="app"></div>',
  `<div id="app"></div><script type="application/json" id="jma-inline-assets">${JSON.stringify(images)}</script>`,
);
html = html.replace(
  /<script\b([^>]*)src="([^\"]+)"([^>]*)><\/script>/g,
  (_, before: string, src: string, after: string) => {
    const js = readFileSync(resolve(dist, src), "utf8");
    return `<script${before}${after}>${js.replace(/<\/script/gi, "<\\/script")}</script>`;
  },
);
mkdirSync(resolve("distribution"), { recursive: true });
html = html.replace(/^[\t ]+$/gm, "");
writeFileSync(resolve("distribution/jornada-widget.html"), html);
console.log(
  `Widget autossuficiente: distribution/jornada-widget.html (${Math.round(Buffer.byteLength(html) / 1024)} KiB).`,
);
console.log(
  "CSS, JavaScript, fontes e fotografias incluídos no próprio HTML. Nenhuma instalação no WordPress é necessária.",
);
