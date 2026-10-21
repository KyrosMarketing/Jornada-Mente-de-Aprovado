import "./style.css";
import { modules, offer, price } from "./offer";
import { checkoutUrl } from "./checkout";
import {
  consentStatus,
  initializeAnalytics,
  setConsent,
  track,
  trackingConfigured,
} from "./analytics";

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const inlineAssetsNode = document.querySelector("#jma-inline-assets");
const inlineAssets: Record<string, string> = inlineAssetsNode
  ? JSON.parse(inlineAssetsNode.textContent || "{}")
  : {};
const asset = (path: string) =>
  inlineAssets[path] || `${import.meta.env.BASE_URL}${path}`;
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.6"/></svg>';
const down =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.5"/></svg>';
const mark =
  '<svg class="brand-mark" viewBox="0 0 35 35" fill="none" aria-hidden="true"><path d="M8 27V8h12a7 7 0 0 1 0 14h-6M14 27V14h6a1 1 0 0 1 0 2h-6" stroke="currentColor" stroke-width="2.8"/><circle cx="28" cy="27" r="2" fill="currentColor"/></svg>';
const check =
  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" stroke-width="1.5"/></svg>';
const purchaseUrl = checkoutUrl();
const buy = (label: string, location: string, extraClass = "") =>
  purchaseUrl
    ? `<a class="button ${extraClass}" href="${escape(purchaseUrl)}" data-buy="${location}" target="_top" rel="noopener">${label}${arrow}</a>`
    : `<button class="button ${extraClass}" type="button" data-missing-checkout>${label}${arrow}</button>`;
const label = (number: string, text: string) =>
  `<div class="section-label"><span>${number} /</span> ${text}</div>`;
const miniBrand = `<span class="mini-brand">${mark} PREPARAMENTE</span>`;
const poster = `<div class="course-cover"><span class="cover-brand">PREPARAMENTE</span><span class="cover-caption">PREPARAÇÃO MENTAL<br>PARA ENEM E VESTIBULARES</span><strong>MENTE<br>DE<br><i>APROVADO.</i></strong><div class="cover-orbit" aria-hidden="true"><span></span><span></span><span></span></div><span class="cover-foot">SUA PRÓXIMA ETAPA COMEÇA AQUI. <b>${arrow}</b></span></div>`;

const faq = [
  [
    "A Jornada é um curso de conteúdos do ENEM?",
    "Não. É um curso complementar de preparação mental voltado a organização, foco, disciplina, ansiedade e confiança. Ele acompanha seus estudos de conteúdo.",
  ],
  [
    "Também serve para outros vestibulares?",
    "A proposta também se aplica ao contexto de preparação para vestibulares, respeitando as particularidades de cada estudante.",
  ],
  [
    "Ainda vale a pena começar na reta final?",
    "O curso propõe atividades e ferramentas de preparação mental que podem ser trabalhadas nesse período, no seu ritmo. Não há garantia de resultados específicos em determinado prazo.",
  ],
  [
    "Quem apresenta as aulas e o que está incluído?",
    `O psicólogo ${offer.instructor.name}, responsável pelo Preparamente, conduz os cinco módulos. A jornada inclui conteúdos digitais, exercícios práticos, materiais de apoio e a EAFV, uma autoavaliação educacional que não substitui avaliação psicológica.`,
  ],
  [
    "Quando recebo acesso e por quanto tempo?",
    `O acesso é liberado após a confirmação do pagamento, conforme o processamento e as orientações da Hotmart. ${offer.accessPeriod ? `Prazo de acesso: ${offer.accessPeriod}.` : "O acesso tem prazo determinado. A duração desta oferta ainda está em confirmação; confira a informação antes de concluir a compra."}`,
  ],
  [
    "Como posso pagar? Existe garantia?",
    `${offer.paymentMethods || "As formas de pagamento disponíveis são as exibidas no checkout da Hotmart."} ${offer.guarantee || "A política de garantia desta oferta ainda está em confirmação. Consulte as condições aplicáveis antes de pagar, respeitados os direitos legais do consumidor."}`,
  ],
  [
    "O curso substitui acompanhamento psicológico?",
    "Não. A Jornada é um produto educacional e não substitui avaliação ou acompanhamento psicológico individual quando necessário. Não há promessa de aprovação, eliminação da ansiedade ou prevenção de brancos na prova.",
  ],
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="#inicio" aria-label="Preparamente — início">${mark}<span>preparamente</span></a>
      <span class="header-product">JORNADA MENTE<br>DE APROVADO</span>
      <nav aria-label="Navegação principal"><a href="#jornada">A Jornada</a><a href="#modulos">Os Módulos</a><a href="#quem-ensina">Quem Ensina</a><a href="#duvidas">Dúvidas</a></nav>
      ${buy(`Começar por ${price.replace(",00", "")}`, "header", "button-small")}
    </div>
  </header>
  <main id="conteudo">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="status-dot"></span> PREPARAMENTE APRESENTA <span class="eyebrow-divider">/</span> EDIÇÃO ${offer.edition}</div>
        <p class="hero-product">JORNADA MENTE DE APROVADO</p>
        <h1 id="hero-title">VOCÊ ESTUDOU<br>PARA A PROVA.<br>MAS PREPAROU<br><em>SUA MENTE?</em></h1>
        <p class="hero-description">Uma jornada prática com o psicólogo <strong>Mateus Tiujo</strong> para trabalhar foco, disciplina, manejo da ansiedade e autoconfiança no ENEM e nos vestibulares.</p>
        <p class="hero-specs">5 MÓDULOS <span>·</span> EXERCÍCIOS PRÁTICOS <span>·</span> ACESSO ONLINE</p>
        <div class="hero-purchase"><div class="hero-price"><span>SUA PRÓXIMA ETAPA POR</span><strong>${price}</strong></div>${buy("Quero preparar minha mente", "hero")}</div>
        <p class="purchase-note"><span aria-hidden="true">⌑</span> Compra pela Hotmart · Acesso após confirmação do pagamento</p>
      </div>
      <div class="hero-art">
        <img class="hero-photo" src="${asset("images/student-960.webp")}" srcset="${asset("images/student-640.webp")} 640w, ${asset("images/student-960.webp")} 960w" sizes="(max-width: 700px) 100vw, 50vw" width="960" height="1280" alt="Cena ilustrativa de uma estudante concentrada em suas anotações." fetchpriority="high" />
        <div class="photo-top"><span>CONTEÚDO PREPARADO.<br>MENTE EM PREPARAÇÃO.</span><span class="crosshair" aria-hidden="true">+</span></div>
        <div class="hero-vertical" aria-hidden="true">FOCO. EQUILÍBRIO. CONFIANÇA.</div>
        <div class="image-caption"><span class="caption-line"></span><p>O próximo passo<br><strong>começa em você.</strong></p><a href="#jornada" aria-label="Conhecer a jornada">${down}</a></div>
        <span class="photo-index">01 — A SUA JORNADA</span>
      </div>
      <div class="hero-bottom"><span>PREPARAÇÃO QUE VAI ALÉM DO CONTEÚDO.</span><a href="#jornada">EXPLORE A JORNADA ${down}</a></div>
    </section>
    <div class="marquee" role="img" aria-label="Foco, disciplina, equilíbrio, propósito, confiança"><div class="marquee-track" aria-hidden="true">${Array.from({ length: 4 }, () => "<span>FOCO <b>✳</b> DISCIPLINA <b>✳</b> EQUILÍBRIO <b>✳</b> PROPÓSITO <b>✳</b> CONFIANÇA <b>✳</b></span>").join("")}</div></div>

    <section class="identification section light" id="jornada">
      <div class="container">${label("01", "NEM TUDO ESTÁ NOS LIVROS")}
        <div class="identification-grid">
          <div class="identification-intro"><h2>VOCÊ ESTUDOU<br>TANTO.<br>POR QUE AINDA<br>SENTE QUE<br><span class="muted">NÃO ESTÁ<br>PRONTO?</span></h2><p>Você não precisa recomeçar sua preparação. Pode cuidar também da parte mental dela.</p><a class="text-link" href="#a-jornada">Conhecer a jornada ${down}</a></div>
          <div class="identification-list">${[
            "Você senta para estudar, mas demora para conseguir começar.",
            "A pressão aumenta conforme a prova se aproxima.",
            "O medo de dar branco atrapalha sua confiança.",
            "Você olha o desempenho dos outros e questiona sua própria capacidade.",
            "Alguns dias parecem improdutivos, mesmo com tanto esforço.",
          ]
            .map(
              (text, i) =>
                `<div class="pain-row"><span>0${i + 1}</span><p>${text}</p><span class="pain-plus" aria-hidden="true">+</span></div>`,
            )
            .join("")}
          <p class="identification-closing">A preparação não acontece apenas no caderno.<br><strong>Acontece também na maneira como você lida com o processo.</strong></p></div>
        </div>
      </div>
    </section>

    <section class="manifesto section" aria-labelledby="manifesto-title"><div class="container"><div class="manifesto-top"><span class="eyebrow">CONTEÚDO + PREPARAÇÃO MENTAL</span><span aria-hidden="true">${arrow}</span></div><h2 id="manifesto-title">A RETA FINAL<br>TAMBÉM É <em>MENTAL.</em></h2><div class="manifesto-bottom"><span class="orbit-small" aria-hidden="true"></span><p>Você já está trabalhando o conteúdo que vai encontrar na prova. Agora pode dedicar atenção às habilidades que ajudam a sustentar sua preparação: <strong>foco, organização, equilíbrio emocional e confiança.</strong></p></div></div></section>

    <section class="product-section section" id="a-jornada"><div class="container product-grid"><div class="product-art"><div class="product-art-grid" aria-hidden="true"></div><div class="product-poster">${poster}</div><span class="concept-note">CONCEITO VISUAL DE APRESENTAÇÃO</span><span class="art-index">JMA / 2026</span></div><div class="product-copy">${label("02", "APRESENTANDO SUA NOVA JORNADA")}<h2>MENTE DE<br>APROVADO<br><em>SE PREPARA.</em></h2><p>A ${offer.name} reúne cinco módulos conduzidos pelo psicólogo Mateus Tiujo, com aulas e materiais práticos para trabalhar diferentes aspectos da sua preparação mental.</p><p>Uma preparação complementar aos estudos acadêmicos. Para continuar o caminho que você já começou, com mais consciência.</p><div class="product-facts"><div><strong>05</strong><span>MÓDULOS PARA<br>A SUA PREPARAÇÃO</span></div><div><strong>100<span>%</span></strong><span>ONLINE, NO<br>SEU RITMO</span></div></div><a class="text-link" href="#modulos">Veja o que você vai trabalhar ${down}</a></div></div></section>

    <section class="modules-section section light" id="modulos"><div class="container">${label("03", "UM PASSO DE CADA VEZ")}<div class="section-heading"><h2>CINCO MÓDULOS.<br><span class="muted">UMA MENTE EM<br>PREPARAÇÃO.</span></h2><p>Da organização da rotina à confiança para seguir.<br>Conheça cada etapa da sua jornada.</p></div><div class="modules-grid"><div class="module-visual" aria-hidden="true"><span class="visual-eyebrow">A JORNADA É SUA.</span><div class="orbital"><span class="orbital-circle circle-one"></span><span class="orbital-circle circle-two"></span><span class="orbital-circle circle-three"></span><div class="orbital-center">M<span>${arrow}</span></div><span class="orbital-dot"></span></div><div class="visual-module"><span id="visual-count">01 / 05</span><strong id="visual-word">ORGANIZE.</strong></div><span class="visual-foot">PREPARAMENTE · MENTE DE APROVADO</span></div><div class="modules-list">${modules.map((m, i) => `<details class="module" name="module" ${i === 0 ? "open" : ""} data-module="${i}"><summary><span class="module-number">${m.id}</span><h3>${m.title}</h3><span class="expand-icon" aria-hidden="true"></span></summary><div class="module-content"><h4>${m.headline}</h4><p>${m.description}</p><ul>${m.benefits.map((b) => `<li>${check}${b}</li>`).join("")}</ul></div></details>`).join("")}</div></div><div class="module-close"><p>Cinco módulos. <strong>Uma preparação mais completa.</strong></p>${buy("Quero começar a jornada", "modules", "button-dark")}</div></div></section>

    <section class="materials-section section"><div class="container materials-grid"><div>${label("04", "APRENDER. EXPERIMENTAR. APLICAR.")}<h2>NÃO É SÓ<br>ASSISTIR.<br><em>É COLOCAR<br>EM PRÁTICA.</em></h2><p>Leve a preparação mental para o seu cotidiano. A jornada combina conteúdos com recursos para você participar ativamente do processo.</p><div class="material-list">${offer.materials
      .filter((m) => m.confirmed)
      .map(
        (m, i) =>
          `<div><span>0${i + 1}</span><div><h3>${m.name}</h3><p>${m.description}</p></div>${arrow}</div>`,
      )
      .join(
        "",
      )}</div></div><div class="materials-art" aria-label="Conceito visual dos materiais de apoio"><div class="paper paper-back"><span>PREPARAMENTE</span><strong>DO APRENDIZADO<br>À PRÁTICA.</strong><div class="paper-lines" aria-hidden="true"></div></div><div class="paper paper-front"><span>MATERIAIS DE APOIO / JMA</span><strong>SUA MENTE.<br>SEU RITMO.<br><em>SUA JORNADA.</em></strong><div class="paper-rings" aria-hidden="true"><i></i><i></i><i></i></div><small>PREPARAÇÃO MENTAL<br>QUE ACOMPANHA VOCÊ.</small></div><span class="concept-note">CONCEITO VISUAL · NÃO REPRESENTA CAPAS OFICIAIS</span></div></div></section>

    <section class="instructor-section section light" id="quem-ensina"><div class="container instructor-grid"><div class="instructor-art ${offer.instructor.portrait ? "has-portrait" : ""}">${offer.instructor.portrait ? `<img src="${escape(offer.instructor.portrait)}" alt="${offer.instructor.name}, psicólogo responsável pelo Preparamente" width="600" height="750" loading="lazy" />` : `<span class="eyebrow">A PSICOLOGIA ENCONTRA A PREPARAÇÃO.</span><div class="instructor-monogram" aria-hidden="true">m<span>t.</span></div><div class="instructor-art-name">MATEUS<br>TIUJO<span>PSICÓLOGO / PREPARAMENTE</span></div>`}</div><div class="instructor-copy">${label("05", "QUEM CAMINHA COM VOCÊ")}<h2>PREPARAÇÃO<br>MENTAL COM<br><span class="muted">QUEM ENTENDE<br>DO ASSUNTO.</span></h2><div class="instructor-name"><h3>${offer.instructor.name}</h3><p>${offer.instructor.title}</p></div><p>${offer.instructor.bio}</p><blockquote>Conhecimento da Psicologia.<br>Um olhar para a sua preparação.</blockquote><span class="instructor-signature">${miniBrand}</span></div></div></section>

    ${
      offer.testimonials.filter((t) => t.authorized).length
        ? `<section class="testimonials section"><div class="container">${label("06", "SOBRE O TRABALHO POR TRÁS DA JORNADA")}<h2>QUEM CONHECE<br>O PREPARAMENTE.</h2><p>Relatos sobre o Preparamente e o trabalho de Mateus Tiujo. Não são avaliações de compradores desta Jornada.</p>${offer.testimonials
            .filter((t) => t.authorized)
            .map(
              (t) =>
                `<figure><blockquote>${escape(t.quote)}</blockquote><figcaption>${escape(t.attribution)} · ${escape(t.context)} <a href="${escape(t.source)}" target="_blank" rel="noopener noreferrer">Ver fonte ↗</a></figcaption></figure>`,
            )
            .join("")}</div></section>`
        : ""
    }

    <section class="how-section section"><div class="container">${label("06", "DO SEU JEITO. NO SEU RITMO.")}<div class="section-heading"><h2>SUA JORNADA COMEÇA<br><em>EM POUCOS PASSOS.</em></h2><p>Sem recomeçar do zero.<br>Um próximo passo na sua preparação.</p></div><ol class="steps"><li><span>01 <i>${arrow}</i></span><h3>Faça sua inscrição.</h3><p>Adquira a ${offer.name} por ${price}, com pagamento pela Hotmart.</p></li><li><span>02 <i>${arrow}</i></span><h3>Receba seu acesso.</h3><p>Após a confirmação do pagamento, siga as orientações da Hotmart para acessar o curso.</p></li><li><span>03 <i>${arrow}</i></span><h3>Assista e pratique.</h3><p>Explore os cinco módulos e os materiais no seu ritmo, dentro do prazo de acesso contratado.</p></li></ol></div></section>

    <section class="offer-section section" id="inscricao"><div class="container offer-grid"><div class="offer-copy">${label("07", "SUA JORNADA COMEÇA AQUI")}<h2>PREPARE A MENTE.<br><em>CONTINUE<br>SUA JORNADA.</em></h2><h3>${offer.name}</h3><ul class="offer-includes">${["Cinco módulos com o psicólogo Mateus Tiujo", "Preparação mental para ENEM e vestibulares", "Exercícios práticos, materiais de apoio e EAFV", "Acesso digital após confirmação do pagamento", "Estudo no seu ritmo, dentro do prazo contratado"].map((t) => `<li>${check}${t}</li>`).join("")}</ul></div><div class="offer-purchase"><div class="offer-mini-poster" aria-hidden="true">${poster}</div><span class="eyebrow">UM PRÓXIMO PASSO NA SUA PREPARAÇÃO</span><p class="offer-price"><span>R$</span> ${offer.price}<span>,00</span></p>${buy("Sim, quero começar minha jornada", "offer")}<p class="purchase-note">Pagamento pela Hotmart · Conteúdo digital</p><p class="offer-conditions">${offer.accessPeriod ? `Acesso: ${escape(offer.accessPeriod)}.` : "Acesso por prazo determinado. Duração em confirmação."} ${offer.guarantee ? escape(offer.guarantee) : "Consulte as condições de garantia antes de pagar."}</p></div></div></section>

    <section class="cinema" aria-labelledby="cinema-title"><img src="${asset("images/student-960.webp")}" width="960" height="1280" loading="lazy" alt="Estudante dedicando um momento de atenção aos estudos, em cena ilustrativa."/><div class="cinema-content container"><span class="eyebrow">PARA O DIA DA PROVA. E PARA O CAMINHO ATÉ LÁ.</span><h2 id="cinema-title">A PROVA É UM DIA.<br>A PREPARAÇÃO<br>É UMA <em>JORNADA.</em></h2><p>Cuide também da mente que acompanha você até lá.</p></div><span class="cinema-caption">IMAGEM ILUSTRATIVA</span></section>

    <section class="faq-section section light" id="duvidas"><div class="container faq-grid"><div>${label("08", "CLAREZA PARA O PRÓXIMO PASSO")}<h2>AINDA TEM<br><span class="muted">DÚVIDAS?</span></h2><p>Uma decisão consciente<br>começa com informação.</p><span class="faq-symbol" aria-hidden="true">${arrow}</span></div><div class="faq-list">${faq.map(([q, a]) => `<details class="faq-item"><summary>${q}<span class="expand-icon" aria-hidden="true"></span></summary><div><p>${escape(a)}</p></div></details>`).join("")}</div></div></section>

    <section class="final-section section"><div class="container"><span class="eyebrow"><span class="status-dot"></span> O SEU PRÓXIMO PASSO</span><h2>A RETA FINAL<br>COMEÇA <em>NA MENTE.</em></h2><p>Você já percorreu um longo caminho de estudos.<br>Continue sua preparação com a ${offer.name}.</p><div class="final-purchase"><strong>${price}</strong>${buy("Quero dar esse próximo passo", "final")}</div><span class="final-signature">JORNADA MENTE DE APROVADO <span>—</span> POR PREPARAMENTE</span></div></section>
  </main>
  <footer class="site-footer"><div class="container"><div class="footer-top"><a class="brand" href="#inicio">${mark}<span>preparamente</span></a><p>Conteúdo preparado.<br><span>Mente em preparação.</span></p><a class="back-top" href="#inicio" aria-label="Voltar ao início">${arrow}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Preparamente.<br>Jornada Mente de Aprovado.</span><nav aria-label="Informações legais">${[
    ["privacy", "Política de Privacidade"],
    ["terms", "Termos de Uso"],
    ["support", "Suporte"],
    ["merchant", "Informações comerciais"],
  ]
    .map(
      ([key, text]) =>
        `<button type="button" data-info="${key}">${text}</button>`,
    )
    .join(
      "",
    )}<button type="button" data-consent-open>Preferências de privacidade</button></nav><p>Produto educacional independente, sem vínculo oficial com os órgãos responsáveis pelo ENEM ou instituições de ensino. Não substitui acompanhamento psicológico.</p></div></div></footer>
  <aside class="mobile-buy" aria-label="Inscrição na Jornada"><div><span>JORNADA MENTE DE APROVADO</span><strong>${price.replace(",00", "")}</strong></div>${buy("Começar", "mobile", "button-small")}</aside>
  <dialog id="info-dialog" class="info-dialog" aria-labelledby="dialog-title"><button type="button" class="dialog-close" aria-label="Fechar" data-dialog-close>×</button><span class="eyebrow">PREPARAMENTE / INFORMAÇÕES</span><h2 id="dialog-title"></h2><div id="dialog-content"></div><button type="button" class="button button-dark" data-dialog-close>Entendi ${arrow}</button></dialog>
  <dialog id="consent-dialog" class="info-dialog" aria-labelledby="consent-title"><button type="button" class="dialog-close" aria-label="Fechar preferências" data-consent-close>×</button><span class="eyebrow">SUA PRIVACIDADE IMPORTA</span><h2 id="consent-title">Você escolhe.</h2><p>O armazenamento essencial guarda sua preferência. Com sua permissão, ferramentas de análise e publicidade podem medir visitas e interações. A compra acontece na Hotmart, que tem suas próprias políticas. Você pode mudar sua escolha no rodapé.</p><div class="consent-actions"><button type="button" class="button button-dark" data-consent="essential">Somente essenciais</button><button type="button" class="button" data-consent="accepted">Permitir análise e publicidade</button></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>
`;

const header = document.querySelector(".site-header")!;
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const mobileBar = document.querySelector(".mobile-buy")!;
let heroPassed = false;
let offerVisible = false;
let footerVisible = false;
function updateBar() {
  mobileBar.classList.toggle(
    "is-visible",
    heroPassed && !offerVisible && !footerVisible,
  );
}
new IntersectionObserver(
  ([entry]) => {
    heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    updateBar();
  },
  { threshold: 0 },
).observe(document.querySelector(".hero")!);
new IntersectionObserver(
  ([entry]) => {
    offerVisible = entry.isIntersecting;
    updateBar();
  },
  { threshold: 0.15 },
).observe(document.querySelector(".offer-section")!);
new IntersectionObserver(([entry]) => {
  footerVisible = entry.isIntersecting;
  updateBar();
}).observe(document.querySelector(".site-footer")!);

document
  .querySelectorAll<HTMLDetailsElement>("[data-module]")
  .forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      const selected = modules[Number(detail.dataset.module)];
      document.querySelector("#visual-count")!.textContent =
        `${selected.id} / 05`;
      document.querySelector("#visual-word")!.textContent = selected.word;
      document
        .querySelector(".module-visual")!
        .setAttribute("data-theme", selected.theme);
    });
  });

document.querySelectorAll<HTMLAnchorElement>("[data-buy]").forEach((a) =>
  a.addEventListener("click", () => {
    const properties = {
      placement: a.dataset.buy,
      content_name: offer.name,
      currency: offer.currency,
      value: offer.price,
    };
    track("cta_click", properties);
    track("checkout_redirect", properties);
  }),
);

const dialog = document.querySelector<HTMLDialogElement>("#info-dialog")!;
const dialogTitle = document.querySelector("#dialog-title")!;
const dialogContent = document.querySelector("#dialog-content")!;
function showInfo(title: string, content: string) {
  dialogTitle.textContent = title;
  dialogContent.innerHTML = content;
  dialog.showModal();
}
document
  .querySelectorAll<HTMLElement>("[data-dialog-close]")
  .forEach((b) => b.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (e) => {
  if (
    e.target === dialog &&
    ((e as MouseEvent).offsetX < 0 ||
      (e as MouseEvent).offsetY < 0 ||
      (e as MouseEvent).offsetX > dialog.offsetWidth ||
      (e as MouseEvent).offsetY > dialog.offsetHeight)
  )
    dialog.close();
});
document
  .querySelectorAll<HTMLElement>("[data-missing-checkout]")
  .forEach((b) =>
    b.addEventListener("click", () =>
      showInfo(
        "Inscrições em preparação",
        "<p>O link de compra ainda não foi disponibilizado. Volte em breve para conferir a abertura das inscrições.</p>",
      ),
    ),
  );

const legalContent: Record<string, [string, string]> = {
  privacy: [
    "Política de Privacidade",
    "<p>A política oficial desta oferta está em revisão. Nesta versão, ferramentas de análise e publicidade ficam desativadas até serem configuradas e receberem sua permissão. Sua preferência de privacidade pode ser guardada neste navegador.</p><p>A página não contém formulários de cadastro. Ao seguir para a Hotmart, aplicam-se as políticas da plataforma. Parâmetros de campanha presentes no endereço podem acompanhar o link de compra.</p>",
  ],
  terms: [
    "Termos de Uso",
    "<p>A Jornada Mente de Aprovado é um curso digital educacional de preparação mental. Não substitui acompanhamento psicológico e não garante aprovação ou resultados individuais.</p><p>Prazo de acesso, garantia e condições contratuais desta oferta aguardam confirmação. Consulte as informações completas antes de concluir a compra na Hotmart.</p>",
  ],
  support: [
    "Suporte",
    "<p>O canal direto de suporte desta oferta ainda está em confirmação. Para questões sobre pagamento e acesso, consulte as orientações e os canais de atendimento oficiais da Hotmart.</p><p>Não envie informações de pagamento ou dados de saúde por canais não verificados.</p>",
  ],
  merchant: [
    "Informações comerciais",
    `<p><strong>${offer.name}</strong><br>Marca: ${offer.brand}<br>Preço: ${price}<br>Pagamento e distribuição: Hotmart.</p><p>${offer.merchant.confirmed ? `${escape(offer.merchant.legalName || "")}<br>CNPJ: ${escape(offer.merchant.cnpj || "")}` : "A identificação da empresa responsável por esta nova oferta está em validação. Confira os dados do vendedor e as condições completas no checkout antes de comprar."}</p>`,
  ],
};
document.querySelectorAll<HTMLElement>("[data-info]").forEach((button) =>
  button.addEventListener("click", () => {
    const key = button.dataset.info!;
    const configured =
      key in offer.legal ? offer.legal[key as keyof typeof offer.legal] : null;
    if (configured && /^(https:\/\/|mailto:)/.test(configured)) {
      window.location.assign(configured);
      return;
    }
    showInfo(...legalContent[key]);
  }),
);

const consentDialog =
  document.querySelector<HTMLDialogElement>("#consent-dialog")!;
document
  .querySelector("[data-consent-open]")!
  .addEventListener("click", () => consentDialog.showModal());
document
  .querySelector("[data-consent-close]")!
  .addEventListener("click", () => consentDialog.close());
document.querySelectorAll<HTMLButtonElement>("[data-consent]").forEach((b) =>
  b.addEventListener("click", () => {
    setConsent(b.dataset.consent === "accepted");
    consentDialog.close();
    const toast = document.querySelector<HTMLElement>(".toast")!;
    toast.textContent = "Preferências de privacidade salvas.";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 3500);
  }),
);
initializeAnalytics();
if (trackingConfigured && !consentStatus()) consentDialog.showModal();

if (offer.siteUrl) {
  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = offer.siteUrl;
  document.head.append(canonical);
  const ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  ogUrl.content = offer.siteUrl;
  document.head.append(ogUrl);
  document.querySelector<HTMLMetaElement>(
    'meta[property="og:image"]',
  )!.content = new URL(
    "images/social.jpg",
    `${offer.siteUrl.replace(/\/$/, "")}/`,
  ).toString();
}
