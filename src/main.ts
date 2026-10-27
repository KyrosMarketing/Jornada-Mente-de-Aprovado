import "./style.css";
import { initializeProductPreview } from "./product-preview";
import {
  modules,
  offer,
  price,
  installmentPrice,
  installmentTotal,
  installmentLabel,
  marqueeWords,
} from "./offer";
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
const check =
  '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" stroke-width="1.5"/></svg>';
const purchaseUrl = checkoutUrl();
const buy = (label: string, location: string, extraClass = "") =>
  purchaseUrl
    ? `<a class="button ${extraClass}" href="${escape(purchaseUrl)}" data-buy="${location}" target="_top" rel="noopener">${label}${arrow}</a>`
    : `<button class="button ${extraClass}" type="button" data-missing-checkout>${label}${arrow}</button>`;
const label = (number: string, text: string) =>
  `<div class="section-label"><span>${number} /</span> ${text}</div>`;
const brandLogo = (dark = false) =>
  `<img class="official-logo" src="${asset(dark ? offer.branding.logoDark : offer.branding.logoLight)}" width="531" height="118" alt="PreparaMente" />`;
const miniBrand = `<span class="mini-brand">${brandLogo(true)}</span>`;
const productIdentity = (tag: "h1" | "h2", extraClass = "", id = "") =>
  `<${tag} ${id ? `id="${id}"` : ""} class="journey-wordmark ${extraClass}" aria-label="${offer.name}"><span class="journey-script">Jornada</span><span class="journey-name">MENTE DE</span><span class="journey-stamp">APROVADO</span></${tag}>`;
const poster = `<div class="course-cover"><span class="cover-brand">${brandLogo(true)}</span><span class="cover-caption">PREPARAÇÃO MENTAL<br>PARA ENEM E VESTIBULARES</span><span class="cover-journey">Jornada</span><strong>MENTE DE<br><i>APROVADO</i></strong><div class="cover-orbit" aria-hidden="true"><span></span><span></span><span></span></div><span class="cover-foot">SUA PRÓXIMA ETAPA COMEÇA AQUI. <b>${arrow}</b></span></div>`;

const faq = [
  [
    "A Jornada é um curso de conteúdo do ENEM?",
    "Não. Ela não ensina matéria. Ela treina a parte mental da preparação — ansiedade, foco, organização e confiança — para você render na prova aquilo que já estuda no cursinho ou sozinho.",
  ],
  [
    "Serve para outros vestibulares?",
    "Sim. Serve para ENEM, Fuvest, Unicamp, UFPR, vestibulares de Medicina e outras provas em que pressão e desempenho emocional fazem diferença. As ferramentas trabalham a forma como você lida com a prova, e não o conteúdo dela.",
  ],
  [
    "Ainda vale a pena começar na reta final?",
    "Sim. É justamente quando a pressão aumenta que essas ferramentas podem ser mais úteis. Os módulos são curtos e os exercícios entram na rotina que você já tem, sem substituir o tempo de estudo.",
  ],
  [
    "Quando recebo o acesso e por quanto tempo?",
    `O acesso é liberado após a confirmação do pagamento pela Hotmart. ${offer.accessPeriod ? `Prazo de acesso: ${offer.accessPeriod}.` : "Consulte a duração do acesso informada na oferta e no checkout antes de concluir a compra."}`,
  ],
  [
    "Como posso pagar?",
    `${price} à vista ou ${installmentLabel} (total parcelado de ${installmentTotal}). As formas de pagamento disponíveis são as exibidas no checkout da Hotmart.`,
  ],
  [
    "Meu filho tem 16 anos. Ele pode fazer?",
    "Sim. A Jornada foi criada para estudantes de 16 a 26 anos. O responsável pode realizar a compra para o filho.",
  ],
  [
    "Como funciona o acesso e a garantia?",
    "O acesso é liberado após a confirmação do pagamento pela Hotmart. A compra possui 7 dias de garantia, conforme as condições da plataforma. Consulte a duração de acesso informada na oferta e no checkout.",
  ],
  [
    "O curso substitui acompanhamento psicológico?",
    "Não. A Jornada é um produto educacional e não substitui avaliação ou acompanhamento psicológico individual quando necessário. Não há promessa de aprovação, eliminação da ansiedade ou prevenção garantida de brancos na prova.",
  ],
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="header-inner container">
      <a class="header-journey" href="#inicio" aria-label="Jornada Mente de Aprovado — início"><span>Jornada</span><strong>MENTE DE APROVADO</strong><small>POR PREPARAMENTE</small></a>
      <a class="brand brand-endorsement" href="#quem-ensina" aria-label="Por PreparaMente"><span>POR</span>${brandLogo()}</a>
      <nav aria-label="Navegação principal"><a href="#jornada">A Jornada</a><a href="#modulos">Os Módulos</a><a href="#quem-ensina">Quem Ensina</a><a href="#duvidas">Dúvidas</a></nav>
      ${buy(`Começar por ${price.replace(",00", "")}`, "header", "button-small")}
    </div>
  </header>
  <main id="conteudo">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="status-dot"></span> PREPARAMENTE APRESENTA <span class="eyebrow-divider">/</span> EDIÇÃO ${offer.edition}</div>
        <h1 class="hero-promise" id="hero-title" aria-label="Você estudou para a prova. Mas preparou sua mente?"><span>VOCÊ ESTUDOU</span> <span>PARA A PROVA.</span> <span>MAS PREPAROU</span> <em>SUA MENTE?</em></h1>
        <p class="hero-description">Treine foco, organização e equilíbrio emocional para colocar em prática o que você já estudou na hora H, com o psicólogo <strong>Mateus Tiujo</strong>.</p>
        <p class="hero-exams">Para ENEM, Fuvest, Unicamp, UFPR e outros vestibulares.</p>
        <div class="hero-purchase"><div class="hero-price"><span>SUA PRÓXIMA ETAPA POR</span><strong>${price}</strong><small>à vista</small><small class="hero-installment">ou ${installmentLabel}</small></div>${buy("Quero preparar minha mente", "hero")}</div>
        <p class="purchase-note"><span aria-hidden="true">⌑</span> Compra pela Hotmart · Acesso após confirmação do pagamento</p>
      </div>
      <div class="hero-art product-hero">
        <img class="hero-photo" src="${asset("images/jornada-produto-960.webp")}" srcset="${asset("images/jornada-produto-640.webp")} 640w, ${asset("images/jornada-produto-960.webp")} 960w" sizes="(max-width: 700px) 100vw, 50vw" width="960" height="1280" alt="Mockup digital da Jornada Mente de Aprovado, com as capas azul e creme, a marca PreparaMente e a ilustração do cérebro com capelo." fetchpriority="high" />
        <div class="photo-top"><span>SEU TREINO MENTAL.<br>NA RETA FINAL.</span><span class="crosshair" aria-hidden="true">+</span></div>
        <div class="hero-vertical" aria-hidden="true">FOCO. EQUILÍBRIO. CONFIANÇA.</div>
        <div class="image-caption"><a href="#jornada" aria-label="Conhecer a jornada">${down}</a></div>
      </div>
      <div class="hero-bottom"><span>PREPARAÇÃO QUE VAI ALÉM DO CONTEÚDO.</span><a href="#jornada">EXPLORE A JORNADA ${down}</a></div>
    </section>
    <div class="trust-strip" aria-label="Segurança e conteúdo da Jornada"><div class="container"><ul><li><strong>7 dias</strong><span>de garantia</span></li><li><strong>Acesso imediato</strong><span>pela Hotmart</span></li><li><strong>Compra segura</strong><span>pela Hotmart</span></li><li><strong>5 módulos</strong><span>de preparação mental</span></li><li><strong>Exercícios práticos</strong><span>para a sua rotina</span></li></ul><p>Acesso liberado após a confirmação do pagamento.</p></div></div>
    <div class="marquee" role="img" aria-label="${marqueeWords.join(", ")}"><div class="marquee-track" aria-hidden="true">${Array.from({ length: 4 }, () => `<span>${marqueeWords.map((word) => `${escape(word.toUpperCase())} <b class="marquee-divider"><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m6 1 5 5-5 5-5-5Z" stroke="currentColor" stroke-width="1.25"/></svg></b>`).join(" ")}</span>`).join("")}</div></div>

    <section class="identification section light" id="jornada">
      <div class="container">${label("01", "NEM TUDO ESTÁ NOS LIVROS")}
        <div class="identification-grid">
          <div class="identification-intro"><h2>VOCÊ ESTUDOU<br>TANTO.<br>POR QUE AINDA<br>SENTE QUE<br><span class="muted">NÃO ESTÁ<br>PRONTO?</span></h2><p>Mais estudo, mais cobrança e a mesma sensação de que, na hora H, a mente não acompanha. O problema não é falta de esforço. <strong>Treinar a mente também faz parte da preparação.</strong></p><a class="text-link" href="#a-jornada">Conhecer a jornada ${down}</a></div>
          <div class="identification-list">${[
            "Você senta para estudar, mas demora para conseguir começar.",
            "A pressão aumenta conforme a prova se aproxima.",
            "O medo de dar branco atrapalha sua confiança.",
            "Você olha o desempenho dos outros e questiona sua própria capacidade.",
            "Alguns dias parecem improdutivos, mesmo com tanto esforço.",
          ]
            .map(
              (text, i) =>
                `<div class="pain-row"><span>0${i + 1}</span><p>${text}</p></div>`,
            )
            .join("")}
          <p class="identification-closing">A preparação não acontece apenas no caderno.<br><strong>Acontece também na maneira como você lida com o processo.</strong></p></div>
        </div>
      </div>
    </section>

    <section class="manifesto section" aria-labelledby="manifesto-title"><div class="container"><div class="manifesto-top"><span class="eyebrow">CONTEÚDO + PREPARAÇÃO MENTAL</span><span aria-hidden="true">${arrow}</span></div><h2 id="manifesto-title">A RETA FINAL<br>TAMBÉM É <em>MENTAL.</em></h2><div class="manifesto-bottom"><span class="orbit-small" aria-hidden="true"></span><p>Você já está trabalhando o conteúdo que vai encontrar na prova. Agora pode dedicar atenção às habilidades que ajudam a sustentar sua preparação: <strong>foco, organização, equilíbrio emocional e confiança.</strong></p></div></div></section>

    <section class="product-section section" id="a-jornada"><div class="container product-grid"><div class="product-art"><div class="product-art-grid" aria-hidden="true"></div><div class="product-poster">${poster}</div><span class="art-index">JMA / 2026</span></div><div class="product-copy">${label("02", "APRESENTANDO SUA NOVA JORNADA")}<h2>MENTE DE<br>APROVADO<br><em>SE PREPARA.</em></h2><p>A ${offer.name} reúne cinco módulos conduzidos pelo psicólogo Mateus Tiujo, com aulas e materiais práticos para trabalhar diferentes aspectos da sua preparação mental.</p><p>Uma preparação complementar aos estudos acadêmicos. Para continuar o caminho que você já começou, com mais consciência.</p><div class="product-facts"><div><strong>05</strong><span>MÓDULOS PARA<br>A SUA PREPARAÇÃO</span></div><div><strong>100<span>%</span></strong><span>ONLINE, NO<br>SEU RITMO</span></div></div><span class="text-link product-direction">Veja o que você vai trabalhar ${down}</span></div></div><div class="container product-preview" aria-labelledby="preview-title"><div class="preview-copy"><span class="eyebrow">A JORNADA POR DENTRO</span><h3 id="preview-title">CONHEÇA A SUA<br>EXPERIÊNCIA DE ESTUDO.</h3><p>Plataforma, aulas, exercícios e materiais em uma apresentação do produto.</p><span class="preview-availability">${offer.productPreview.mp4 || offer.productPreview.webm ? "Uma visão rápida da plataforma." : "Apresentação em breve."}</span></div><div class="preview-stage" data-product-preview><div class="preview-fallback"><span class="preview-frame-icon" aria-hidden="true"><svg viewBox="0 0 48 40" fill="none"><rect x="1" y="1" width="46" height="34" rx="4" stroke="currentColor"/><path d="M16 39h16m-8-4v4m-5-27 13 7-13 7z" stroke="currentColor" stroke-linejoin="round"/></svg></span><strong>Veja como a Jornada funciona.</strong><span data-preview-status>Vídeo de apresentação em breve.</span></div>${offer.productPreview.mp4 || offer.productPreview.webm ? `<video class="product-preview-video" playsinline preload="none" aria-label="Apresentação da Jornada Mente de Aprovado" ${offer.productPreview.mp4 ? `data-mp4="${escape(offer.productPreview.mp4.startsWith("https://") ? offer.productPreview.mp4 : asset(offer.productPreview.mp4))}"` : ""} ${offer.productPreview.webm ? `data-webm="${escape(offer.productPreview.webm.startsWith("https://") ? offer.productPreview.webm : asset(offer.productPreview.webm))}"` : ""} ${offer.productPreview.poster ? `data-poster="${escape(offer.productPreview.poster.startsWith("https://") ? offer.productPreview.poster : asset(offer.productPreview.poster))}"` : ""}></video><button type="button" class="preview-toggle" aria-label="Assistir à apresentação" title="Assistir à apresentação" hidden><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 4.5v15l12-7.5z"/></svg></button>` : ""}</div></div></section>

    <section class="audience-section section" aria-labelledby="audience-title"><div class="container"><div class="section-heading"><h2 id="audience-title">ESSA JORNADA<br>É PARA <em>VOCÊ?</em></h2></div><div class="audience-grid"><div class="audience-card"><h3>A Jornada é para você se:</h3><ul>${["Estuda bastante, mas sente que não rende na prova.", "Fica ansioso, trava ou dá branco em simulados.", "Se compara o tempo todo com colegas e perfis de estudo.", "Quer cuidar da mente sem largar o cursinho."].map((text) => `<li>${check}<span>${text}</span></li>`).join("")}</ul></div><div class="audience-card audience-limits"><h3>Não é para você se:</h3><ul>${["Procura aulas de conteúdo ou matérias do ENEM e vestibulares.", "Busca uma fórmula mágica de aprovação.", "Precisa de tratamento clínico individual. Nesse caso, procure acompanhamento psicológico adequado.", "Não estudou nem construiu uma base técnica mínima ao longo do ano."].map((text) => `<li><svg class="audience-cross" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 6 8 8m0-8-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>${text}</span></li>`).join("")}</ul></div></div></div></section>

    <section class="modules-section section light" id="modulos"><div class="container">${label("03", "UM PASSO DE CADA VEZ")}<div class="section-heading"><h2>CINCO MÓDULOS.<br><span class="muted">UMA MENTE EM<br>PREPARAÇÃO.</span></h2></div><div class="modules-grid"><div class="module-visual" aria-hidden="true"><span class="visual-eyebrow">A JORNADA É SUA.</span><div class="orbital"><span class="orbital-circle circle-one"></span><span class="orbital-circle circle-two"></span><span class="orbital-circle circle-three"></span><div class="orbital-center">M<span>${arrow}</span></div><span class="orbital-dot"></span></div><div class="visual-module"><span id="visual-count">01 / 05</span><strong id="visual-word">ORGANIZE.</strong></div><span class="visual-foot">PREPARAMENTE · MENTE DE APROVADO</span></div><div class="modules-list">${modules.map((m, i) => `<details class="module" name="module" ${i === 0 ? "open" : ""} data-module="${i}"><summary><span class="module-number">${m.id}</span><h3>${m.title}</h3><span class="expand-icon" aria-hidden="true"></span></summary><div class="module-content"><h4>${m.headline}</h4><p>${m.description}</p><ul>${m.benefits.map((b) => `<li>${check}${b}</li>`).join("")}</ul></div></details>`).join("")}</div></div><div class="module-close"><p>Cinco módulos. <strong>Uma preparação mais completa.</strong></p>${buy("Quero começar a jornada", "modules", "button-dark")}</div></div></section>

    <section class="materials-section section"><div class="container materials-grid"><div>${label("04", "APRENDER. EXPERIMENTAR. APLICAR.")}<h2>NÃO É SÓ<br>ASSISTIR.<br><em>É COLOCAR<br>EM PRÁTICA.</em></h2><p>Leve a preparação mental para o seu cotidiano. A jornada combina conteúdos com recursos para você participar ativamente do processo.</p><div class="material-list">${offer.materials
      .filter((m) => m.confirmed)
      .map(
        (m, i) =>
          `<div><span>0${i + 1}</span><div><h3>${m.name}</h3><p>${m.description}</p></div>${arrow}</div>`,
      )
      .join(
        "",
      )}</div></div><div class="materials-art" aria-label="Conceito visual dos materiais de apoio"><div class="paper paper-back"><span>PREPARAMENTE</span><strong>DO APRENDIZADO<br>À PRÁTICA.</strong><div class="paper-lines" aria-hidden="true"></div></div><div class="paper paper-front"><span>MATERIAIS DE APOIO / JMA</span><strong>SUA MENTE.<br>SEU RITMO.<br><em>SUA JORNADA.</em></strong><div class="paper-rings" aria-hidden="true"><i></i><i></i><i></i></div><small>PREPARAÇÃO MENTAL<br>QUE ACOMPANHA VOCÊ.</small></div><span class="concept-note">CONCEITO VISUAL · NÃO REPRESENTA CAPAS OFICIAIS</span></div></div></section>

    <section class="instructor-section section light" id="quem-ensina"><div class="container instructor-grid"><div class="instructor-art has-portrait"><div class="portrait-crop"><img src="${asset(offer.instructor.portrait!)}" alt="Retrato oficial de Mateus Tiujo, psicólogo responsável pelo Preparamente" width="720" height="1280" loading="lazy" /></div><span class="portrait-caption">MATEUS TIUJO <span>PSICÓLOGO / PREPARAMENTE</span></span></div><div class="instructor-copy">${label("05", "QUEM CAMINHA COM VOCÊ")}<h2>QUEM PREPARA<br>A SUA <em>MENTE.</em></h2><div class="instructor-name"><h3>${offer.instructor.name}</h3><p>${offer.instructor.title}</p></div><p>${offer.instructor.bio}</p><p>${offer.instructor.background}</p><ul class="instructor-areas" aria-label="Áreas de formação informadas pelo Preparamente">${offer.instructor.areas.map((area) => `<li>${escape(area)}</li>`).join("")}</ul><span class="instructor-signature">${miniBrand}</span></div></div>
      <div class="container institutional-video"><div class="video-copy"><span class="eyebrow">CONHEÇA O TRABALHO POR TRÁS DA MARCA</span><h3>Antes de seguir,<br><em>conheça o Mateus.</em></h3><p>${offer.presentation.context}</p></div><div class="video-panel"><button type="button" class="video-trigger" aria-label="Reproduzir vídeo institucional de Mateus Tiujo e do Preparamente"><img src="${asset(offer.presentation.poster)}" width="595" height="618" loading="lazy" alt="Mateus Tiujo apresentando uma palestra" /><span class="video-play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7z"/></svg></span><span class="video-caption"><span>APRESENTAÇÃO INSTITUCIONAL</span>Mateus Tiujo · Preparamente</span></button></div></div>
    </section>

    <section class="testimonials section" aria-labelledby="testimonials-title"><div class="container">${label("06", "O TRABALHO ANTES DA JORNADA")}<div class="section-heading"><div><h2 id="testimonials-title">QUEM CONHECE<br><em>O PREPARAMENTE.</em></h2><p class="testimonials-context">Relatos sobre a mentoria Preparamente e o trabalho profissional de Mateus Tiujo. <strong>Não são avaliações de compradores da Jornada Mente de Aprovado.</strong></p></div><button class="reviews-toggle" type="button" aria-pressed="false">Pausar depoimentos</button></div></div><figure class="featured-review container" aria-label="Depoimento integral de Rosana"><figcaption><span class="review-monogram" aria-hidden="true">R</span><span class="eyebrow">RELATO NO INSTAGRAM</span><strong>${escape(offer.featuredTestimonial.attribution)}</strong><span>${escape(offer.featuredTestimonial.handle)}</span><p>${escape(offer.featuredTestimonial.context)}</p></figcaption><blockquote>${escape(offer.featuredTestimonial.quote)}</blockquote></figure><div class="reviews-viewport" tabindex="0" role="region" aria-label="Depoimentos sobre o Preparamente e Mateus Tiujo"><div class="reviews-track">${[
      false,
      true,
    ]
      .map(
        (clone) =>
          `<ul class="reviews-group" ${clone ? 'aria-hidden="true" inert' : 'aria-label="Cinco relatos fornecidos pelo Preparamente"'}>${offer.testimonials
            .filter((t) => t.authorized)
            .map(
              (t) =>
                `<li class="review-card"><figure><div class="review-stars" role="img" aria-label="${t.rating} de 5 estrelas"><span aria-hidden="true">★★★★★</span></div><blockquote>“${escape(t.quote)}”</blockquote><figcaption><strong>${escape(t.attribution)}</strong><span>${escape(t.context)}</span><small>Relato fornecido pelo Preparamente</small>${t.source ? `<a href="${escape(t.source)}" target="_top" rel="noopener">Ver fonte ${arrow}</a>` : ""}</figcaption></figure></li>`,
            )
            .join("")}</ul>`,
      )
      .join(
        "",
      )}</div></div><div class="container"><p class="reviews-note">Avaliações reproduzidas a partir dos materiais oficiais fornecidos pelo Preparamente.</p></div></section>

    <section class="how-section section"><div class="container">${label("07", "DO SEU JEITO. NO SEU RITMO.")}<div class="section-heading"><h2>SUA JORNADA COMEÇA<br><em>EM POUCOS PASSOS.</em></h2><p>Sem recomeçar do zero.<br>Um próximo passo na sua preparação.</p></div><ol class="steps"><li><span>01 <i>${arrow}</i></span><h3>Faça sua inscrição.</h3><p>Adquira a ${offer.name} por ${price} à vista ou ${installmentLabel}, com pagamento pela Hotmart.</p></li><li><span>02 <i>${arrow}</i></span><h3>Receba seu acesso.</h3><p>Após a confirmação do pagamento, siga as orientações da Hotmart para acessar o curso.</p></li><li><span>03 <i>${arrow}</i></span><h3>Assista e pratique.</h3><p>Explore os cinco módulos e os materiais no seu ritmo, dentro do prazo de acesso contratado.</p></li></ol></div></section>

    <section class="offer-section section" id="inscricao"><div class="container offer-grid"><div class="offer-copy">${label("08", "SUA JORNADA COMEÇA AQUI")}${productIdentity("h2", "offer-identity", "offer-product-title")}<p class="offer-slogan">PREPARE A MENTE.<br>CONTINUE SUA JORNADA.</p><ul class="offer-includes">${["Cinco módulos com o psicólogo Mateus Tiujo", "Preparação mental para ENEM e vestibulares", "Exercícios práticos, materiais de apoio e EAFV", "Acesso digital após confirmação do pagamento", "Estudo no seu ritmo, dentro do prazo contratado"].map((t) => `<li>${check}${t}</li>`).join("")}</ul></div><div class="offer-purchase"><div class="offer-mini-poster" aria-hidden="true">${poster}</div><span class="eyebrow">UM PRÓXIMO PASSO NA SUA PREPARAÇÃO</span><p class="offer-installment"><span>${offer.paymentPlan.installments}x de</span> <strong>${installmentPrice}</strong></p><p class="offer-cash">ou <strong>${price}</strong> à vista</p><p class="installment-total">Total parcelado: ${installmentTotal}.</p>${buy("Sim, quero começar minha jornada", "offer")}<div class="offer-reassurance"><div>${check}<span><strong>7 dias de garantia</strong><small>Conforme as condições da Hotmart.</small></span></div><div>${check}<span><strong>Acesso imediato pela Hotmart</strong><small>Após a confirmação do pagamento.</small></span></div></div><p class="purchase-note">Pagamento pela Hotmart · Conteúdo digital</p><p class="offer-conditions">${offer.accessPeriod ? `Acesso: ${escape(offer.accessPeriod)}.` : "Consulte a duração do acesso no checkout."} ${offer.guarantee ? escape(offer.guarantee) : "Consulte as condições de garantia antes de pagar."}</p></div></div></section>

    <section class="cinema journey-cinema" aria-labelledby="cinema-title"><div class="journey-scene" aria-hidden="true"><div class="journey-grid"></div><svg class="journey-path" viewBox="0 0 800 600" fill="none"><path d="M55 560h180c90 0 75-140 175-140h65c115 0 55-185 170-185h90" stroke="#e7e5da" stroke-opacity=".12" stroke-width="64"/><path d="M55 560h180c90 0 75-140 175-140h65c115 0 55-185 170-185h90" stroke="#02aa91" stroke-width="3"/><path d="m706 209 29 26-29 26" stroke="#fbaf40" stroke-width="3"/><circle cx="235" cy="560" r="10" fill="#191f47" stroke="#e7e5da" stroke-width="2"/><circle cx="445" cy="420" r="10" fill="#191f47" stroke="#fbaf40" stroke-width="2"/><circle cx="645" cy="235" r="10" fill="#02aa91"/><circle cx="645" cy="235" r="34" stroke="#02aa91" stroke-opacity=".3"/><path d="M580 90h30m-15-15v30M720 460h22m-11-11v22" stroke="#e7e5da" stroke-opacity=".3" stroke-width="2"/></svg><span class="journey-scene-word">Jornada</span><span class="journey-scene-step">UM PASSO DE CADA VEZ.</span></div><div class="cinema-content container"><span class="eyebrow">PARA O DIA DA PROVA. E PARA O CAMINHO ATÉ LÁ.</span><h2 id="cinema-title">A PROVA É UM DIA.<br>A PREPARAÇÃO<br>É UMA <em>JORNADA.</em></h2><p>Cuide também da mente que acompanha você até lá.</p></div></section>

    <section class="faq-section section light" id="duvidas"><div class="container faq-grid"><div>${label("09", "CLAREZA PARA O PRÓXIMO PASSO")}<h2>AINDA TEM<br><span class="muted">DÚVIDAS?</span></h2><p>Uma decisão consciente<br>começa com informação.</p><span class="faq-symbol" aria-hidden="true">${arrow}</span></div><div class="faq-list">${faq.map(([q, a]) => `<details class="faq-item"><summary>${q}<span class="expand-icon" aria-hidden="true"></span></summary><div><p>${escape(a)}</p></div></details>`).join("")}</div></div></section>

    <section class="final-section section"><div class="container"><span class="eyebrow"><span class="status-dot"></span> O SEU PRÓXIMO PASSO</span><h2>A RETA FINAL<br>COMEÇA <em>NA MENTE.</em></h2><p>Você já percorreu um longo caminho de estudos.<br>Continue sua preparação com a ${offer.name}.</p><div class="final-purchase"><strong>${price}<small>à vista · ou ${installmentLabel}</small></strong>${buy("Quero dar esse próximo passo", "final")}</div><p class="final-assurance">7 dias de garantia · Acesso pela Hotmart após confirmação do pagamento.</p><span class="final-signature">JORNADA MENTE DE APROVADO <span>—</span> POR PREPARAMENTE</span></div></section>
  </main>
  <footer class="site-footer"><div class="container"><div class="footer-top"><a class="brand" href="#inicio">${brandLogo()}</a><p>Conteúdo preparado.<br><span>Mente em preparação.</span></p><a class="back-top" href="#inicio" aria-label="Voltar ao início">${arrow}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Preparamente.<br>Jornada Mente de Aprovado.</span><nav aria-label="Informações legais">${[
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
    )}<button type="button" data-consent-open>Preferências de privacidade</button></nav><p>Produto educacional independente, sem vínculo oficial com os órgãos responsáveis pelo ENEM ou instituições de ensino. Não substitui acompanhamento psicológico.</p></div><div class="footer-credit"><span>Desenvolvido por</span><svg class="footer-developer-logo" viewBox="179 406 897 333" role="img" aria-label="Kyros"><image href="${asset("images/kyros-logo.png")}" width="1254" height="1254" /></svg></div></div></footer>
  <aside class="mobile-buy" aria-label="Inscrição na Jornada"><div><span>JORNADA MENTE DE APROVADO</span><strong>${price.replace(",00", "")}<small>à vista</small></strong></div>${buy("Começar", "mobile", "button-small")}</aside>
  <dialog id="info-dialog" class="info-dialog" aria-labelledby="dialog-title"><button type="button" class="dialog-close" aria-label="Fechar" data-dialog-close>×</button><span class="eyebrow">PREPARAMENTE / INFORMAÇÕES</span><h2 id="dialog-title"></h2><div id="dialog-content"></div><button type="button" class="button button-dark" data-dialog-close>Entendi ${arrow}</button></dialog>
  <dialog id="consent-dialog" class="info-dialog" aria-labelledby="consent-title"><button type="button" class="dialog-close" aria-label="Fechar preferências" data-consent-close>×</button><span class="eyebrow">SUA PRIVACIDADE IMPORTA</span><h2 id="consent-title">Você escolhe.</h2><p>O armazenamento essencial guarda sua preferência. Com sua permissão, ferramentas de análise e publicidade podem medir visitas e interações. A compra acontece na Hotmart, que tem suas próprias políticas. Você pode mudar sua escolha no rodapé.</p><div class="consent-actions"><button type="button" class="button button-dark" data-consent="essential">Somente essenciais</button><button type="button" class="button" data-consent="accepted">Permitir análise e publicidade</button></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>
`;

initializeProductPreview();

document
  .querySelector<HTMLButtonElement>(".video-trigger")!
  .addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${offer.presentation.youtubeId}?autoplay=1&rel=0&playsinline=1`;
    frame.title =
      "Apresentação institucional de Mateus Tiujo e do Preparamente";
    frame.allow =
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    document.querySelector(".video-panel")!.replaceChildren(frame);
    frame.focus();
  });
const reviewSection = document.querySelector(".testimonials")!;
const reviewToggle =
  document.querySelector<HTMLButtonElement>(".reviews-toggle")!;
reviewToggle.addEventListener("click", () => {
  const paused = reviewSection.classList.toggle("is-paused");
  reviewToggle.setAttribute("aria-pressed", String(paused));
  reviewToggle.textContent = paused
    ? "Retomar depoimentos"
    : "Pausar depoimentos";
});

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
    "<p>A Jornada Mente de Aprovado é um curso digital educacional de preparação mental. Não substitui acompanhamento psicológico e não garante aprovação ou resultados individuais.</p><p>A oferta tem 7 dias de garantia, conforme as condições da Hotmart. Consulte o prazo de acesso e as demais condições contratuais no checkout antes de concluir a compra.</p>",
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
