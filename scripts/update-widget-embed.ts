import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const revision =
  process.argv[2] ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (!/^[a-f0-9]{40}$/.test(revision))
  throw new Error("Informe uma revisão Git completa.");
const html = readFileSync("distribution/jornada-widget.html");
const saved = execFileSync(
  "git",
  ["show", `${revision}:distribution/jornada-widget.html`],
  { maxBuffer: 8 * 1024 * 1024 },
);
if (!html.equals(saved))
  throw new Error(
    "O HTML atual difere da revisão. Salve e envie o HTML validado ao GitHub antes de gerar o código de incorporação.",
  );
const integrity = `sha384-${createHash("sha384").update(html).digest("base64")}`;
const source = `https://raw.githubusercontent.com/KyrosMarketing/Jornada-Mente-de-Aprovado/${revision}/distribution/jornada-widget.html`;
writeFileSync(
  "distribution/colar-no-widget.html",
  `<div id="jornada-preview" style="width:100%;background:#10142d;color:#e7e5da">
  <p style="padding:24px;font-family:Arial,sans-serif">Carregando a Jornada…</p>
</div>
<script>
(async function () {
  const area = document.getElementById('jornada-preview');
  try {
    const resposta = await fetch('${source}', {
      credentials: 'omit',
      integrity: '${integrity}'
    });
    if (!resposta.ok) throw new Error('Falha no carregamento');
    const quadro = document.createElement('iframe');
    quadro.title = 'Jornada Mente de Aprovado';
    quadro.style.cssText = 'display:block;width:100%;height:100dvh;min-height:600px;border:0;background:#10142d';
    quadro.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');
    quadro.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    quadro.allowFullscreen = true;
    quadro.dataset.campaignSearch = window.location.search;
    quadro.srcdoc = await resposta.text();
    area.replaceChildren(quadro);
  } catch (erro) {
    area.textContent = 'Não foi possível carregar a página. Atualize e tente novamente.';
  }
})();
</script>
`,
);
console.log(
  `Código do widget atualizado para ${revision}; integridade SHA-384 calculada a partir do HTML verificado.`,
);
