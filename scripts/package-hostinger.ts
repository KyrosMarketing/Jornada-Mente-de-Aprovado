import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";

const release = process.argv.includes("--release");
const dist = resolve("dist");
if (!existsSync(join(dist, "index.html")))
  throw new Error("Gere o build antes de empacotar.");
const html = readFileSync(join(dist, "index.html"), "utf8");
if (!release && !html.includes('content="noindex,nofollow"'))
  throw new Error("A prévia precisa conter noindex.");
if (release && !html.includes('content="index,follow"'))
  throw new Error("Use o build de produção aprovado.");
const staging = mkdtempSync(join(tmpdir(), "jornada-hostinger-"));
const output = resolve(
  "artifacts",
  `jornada-hostinger-${release ? "publicacao" : "previa"}.zip`,
);
try {
  cpSync(dist, staging, { recursive: true });
  rmSync(join(staging, "_headers"), { force: true });
  // A robots.txt inside a subfolder does not control crawlers. Keep the WordPress root file intact.
  rmSync(join(staging, "robots.txt"), { force: true });
  let headers = readFileSync(resolve("deployment/hostinger.htaccess"), "utf8");
  if (!release)
    headers +=
      '\n<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n';
  writeFileSync(join(staging, ".htaccess"), headers);
  mkdirSync(resolve("artifacts"), { recursive: true });
  rmSync(output, { force: true });
  execFileSync("zip", ["-X", "-q", "-r", output, "."], { cwd: staging });
  console.log(
    `Pacote Hostinger ${release ? "de publicação" : "de prévia"}: ${output}`,
  );
  console.log(
    "Extraia o conteúdo em uma pasta nova dentro da raiz do domínio. Não substitua arquivos do WordPress.",
  );
} finally {
  rmSync(staging, { recursive: true, force: true });
}
