# Jornada Mente de Aprovado

Landing page da Preparamente, em português, com Vite, TypeScript e CSS. Sem framework de interface ou backend. Fontes e imagens são servidas localmente. Oferta e checkout ficam centralizados em `src/offer.ts`.

## Usar no widget HTML do WordPress / Elementor

Não é necessário instalar plugin nem acessar o hPanel. A versão para widget inclui CSS, JavaScript, fotografias e fontes no próprio `distribution/jornada-widget.html` (cerca de 759 KiB). O pequeno código de incorporação carrega esse arquivo de uma revisão fixa do repositório e o apresenta em um iframe, isolando o visual do tema.

1. Crie uma página em rascunho no WordPress e abra no Elementor.
2. Selecione o layout **Elementor Canvas**, use uma seção com largura total e padding/margens zero.
3. Adicione o widget **HTML** e cole o código de `distribution/colar-no-widget.html`.
4. Clique em **Pré-visualizar alterações** para abrir a versão navegável em outra aba. Scripts do widget podem não executar dentro do editor.
5. Revise a página antes de publicar. O endereço pode ser `/jornada-mente-de-aprovado/` no domínio já existente; não é necessário subdomínio ou nova hospedagem.

O iframe mantém a navegação interna, os accordions, a barra mobile e a preferência de privacidade. Os CTAs abrem a Hotmart na janela principal, e os parâmetros UTM/sck são encaminhados da página WordPress. Não há envio de dados do WordPress para o repositório; o carregamento inicial faz uma requisição pública ao GitHub/CDN. Scripts já configurados no tema ou em outros plugins continuam sob responsabilidade do site WordPress.

Esta é uma prévia `noindex`. Configure também o rascunho/noindex na página pai do WordPress. O título, a descrição, o canonical e o Open Graph da **página WordPress** devem ser configurados no seu plugin de SEO antes da publicação comercial, pois metadados internos do iframe não substituem os da página pai.

Para atualizar a versão incorporada: edite a oferta, execute `npm run package:widget` e `npm test`, revise e salve/envie o novo HTML ao GitHub. Depois execute `npm run widget:embed -- <SHA-completo-do-commit>` para atualizar a revisão fixa e o hash de integridade, rode `npm run test:widget` e salve/envie o código de incorporação atualizado. Substitua o bloco antigo no Elementor, pois a versão é intencionalmente fixa. O teste de widget usa exatamente esse bloco, com a entrega externa interceptada e verificação de integridade ativa no navegador. Nunca troque o arquivo silenciosamente por scripts desconhecidos.

## Alternativa: arquivos estáticos na Hostinger

Se futuramente houver acesso ao Gerenciador de Arquivos do hPanel, `npm run package:hostinger` gera `artifacts/jornada-hostinger-previa.zip`. Extraia o **conteúdo** em uma pasta nova na raiz do domínio, por exemplo `public_html/jornada-mente-de-aprovado/`, mantendo `index.html`, `assets/`, `images/` e `.htaccess` juntos. Não substitua o `.htaccess` ou outros arquivos da raiz do WordPress.

O build usa caminhos relativos e funciona tanto em pasta quanto no domínio raiz. Teste o ZIP extraído em uma subpasta com `npm run test:hostinger`. Esse teste verifica frontend e arquivos, sem simular todas as configurações Apache/LiteSpeed da Hostinger; valide os cabeçalhos e a URL no servidor após o upload real.

`npm run package:hostinger:release` só gera o pacote comercial depois de passar pela verificação das condições em `build:release`.

## Rodar

Requer Node.js 22.12+ (validado com Node 24.19.0) e npm.

```sh
cd /workspace/Jornada-Mente-de-Aprovado
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173 --strictPort
```

Use o checkout somente para navegação. Os testes interceptam o destino e não fazem compras. Não é necessário adicionar credenciais ou segredos para desenvolver esta página.

```sh
npm run build        # TypeScript + build de revisão, noindex
npm run preview -- --port 4173 --strictPort
npm test            # Playwright + axe, Chromium do ambiente
```

`CHROMIUM_PATH` permite indicar outro executável local para os testes. Fora deste ambiente, instale Chromium ou execute `npx playwright install chromium` e ajuste `playwright.config.ts` para usar o navegador gerenciado pelo Playwright. Cada tarefa cloud já é isolada; utilize este checkout, sem criar worktrees, exceto se solicitado.

## Editar a oferta

Em `src/offer.ts`: produto, preço, `HOTMART_CHECKOUT_URL`, prazo de acesso, garantia, pagamentos, módulos, materiais confirmados, biografia, retrato, depoimentos autorizados, empresa, links legais e URL pública.

O link direto fornecido é `https://pay.hotmart.com/G108112534E`. Todos os seis CTAs usam a mesma configuração. `VITE_HOTMART_CHECKOUT_URL` pode sobrescrevê-la no build. Apenas URLs HTTPS da Hotmart são aceitas. O clique é uma navegação real para a Hotmart. Nenhuma compra foi realizada ou confirmada durante a validação.

As informações pendentes aparecem de forma transparente na revisão. Políticas e suporte abrem painéis informativos enquanto não houver links aprovados. Ao preencher os links, os botões navegam para os destinos oficiais. A versão de revisão usa `noindex,nofollow` e `robots.txt` com bloqueio de indexação; isso não substitui controle de acesso se você hospedar uma prévia.

## Antes de publicar

1. Confirme prazo de acesso, garantia e formas de pagamento desta oferta.
2. Confirme empresa e CNPJ responsáveis pela Jornada. A empresa citada na referência antiga **não** foi automaticamente atribuída à nova oferta.
3. Informe URLs oficiais de Privacidade, Termos e Suporte, e `siteUrl` com domínio HTTPS definitivo.
4. Revise módulos, EAFV, materiais e apresentação profissional de Mateus. O workbook, ebooks e diário estão desativados até confirmação. Os cinco depoimentos fornecidos pelo Preparamente estão identificados pela origem informada e se referem à mentoria ou ao trabalho profissional, sem atribuir experiências a compradores da Jornada. Não foram inventados links de avaliações.
5. O retrato oficial enviado já está integrado, com proporções e traços preservados. A biografia usa as informações fornecidas pelo Preparamente; não adiciona registro profissional, tempo de atuação ou títulos de instituições não confirmados.
6. Depois da revisão real, marque `publication.contentApproved` e `publication.instructorProfileApproved` como `true`.
7. Execute `npm run build:release` e publique `dist/` em um host estático HTTPS.

`build:release` falha explicitamente enquanto houver pendências. Quando aprovado, gera metadados indexáveis, canonical e Open Graph absoluto. O build comum permanece disponível para revisão. Não altere o comando de produção para contornar as pendências.

### Netlify

O arquivo `netlify.toml` já define Node 24, `npm run build:release` e publicação de `dist/`. Conecte este repositório no painel da Netlify depois de salvar o código no GitHub. Não há token de hospedagem neste projeto. Alternativamente, execute o build aprovado e envie `dist/` pelo painel do provedor. Cabeçalhos em `public/_headers` são reconhecidos pela Netlify; em outro servidor, configure os equivalentes.

Não há deploy automático nem publicação externa realizada por este projeto. Domínio, conta de hospedagem e condições comerciais precisam estar confirmados antes de ativar a versão pública.

## Campanhas, privacidade e conversões

Copie `.env.example` para um arquivo local de ambiente apenas se precisar sobrescrever parâmetros. Todas as variáveis `VITE_*` são públicas; nunca coloque segredos nelas.

- UTM source, medium, campaign, content e term são repassados à Hotmart a partir da URL da visita; `sck` também é preservado. Os parâmetros comerciais do checkout permanecem. Dados arbitrários, como email, não são copiados. A atribuição não é armazenada entre visitas.
- O código não depende de construir um `sck` fictício. Confirme a atribuição real no painel da Hotmart com uma campanha de teste e mantenha o esquema adotado por sua operação. Não foi possível consultar a documentação da Hotmart neste ambiente.
- GA4 (`VITE_GA4_ID`), Meta Pixel (`VITE_META_PIXEL_ID`) e GTM (`VITE_GTM_ID`) são opcionais. Nenhum está ativado nesta entrega. Scripts de fornecedores só carregam depois de consentimento explícito; é possível retirar a permissão pelo rodapé. A preferência local continua funcionando mesmo sem os fornecedores.
- Prefira GA4 direto **ou** GTM. Se GTM estiver configurado, eventos de análise vão para `dataLayer`; configure as tags e o consentimento no contêiner. Não duplique o Meta Pixel via GTM e configuração direta.
- Eventos: `page_view`, `view_content`, `cta_click` e `checkout_redirect`. Os eventos de clique incluem a posição do CTA. Não contêm email, dados de saúde nem informações de pagamento. Sem consentimento, não são enviados.
- **Purchase não é disparado pela landing page.** Para acompanhar compra efetiva, configure a integração de conversões da Hotmart ou um webhook em backend separado, verificando autenticidade e status de pagamento aprovado, moeda/valor, consentimento aplicável e deduplicação por transação/event ID. Credenciais de webhook e tokens de APIs jamais pertencem ao frontend. Valide no ambiente de testes da plataforma antes de considerar a integração pronta.
- Revise a política de privacidade, domínios de rede e a CSP antes de habilitar fornecedores. Tags adicionais de GTM exigem domínios próprios na CSP. Não desative as verificações de segurança para fazer uma tag carregar.

## Direção visual e fontes

A paleta oficial foi adaptada para azul/creme como base, verde em transições, amarelo nos CTAs e rosa em detalhes. Logos e fotos oficiais foram fornecidos nos arquivos Logos.zip e Mateus.zip. O retrato foi apenas redimensionado/otimizado, sem retoque facial ou reconstrução. O enquadramento visual termina aproximadamente na linha do relógio, por uma janela CSS que preserva o arquivo original.

O vídeo `sIXC3d7DKdg` aparece junto à apresentação do especialista, rotulado como institucional. O player usa youtube-nocookie.com e só é carregado por clique explícito. Os testes interceptam o player e verificam URL/integração; não afirmam reprodução real nos servidores do YouTube.

O carrossel duplica visualmente o mesmo grupo de cinco relatos para permitir loop contínuo; a cópia é `aria-hidden` e `inert`, sem sugerir avaliações adicionais. Há pausa por hover, foco e botão; com movimento reduzido, a lista original fica estática e pode ser rolada horizontalmente.

Fotografia da hero com dois jovens: composição ilustrativa gerada a partir da fotografia de referência enviada pelo PreparaMente, mantendo a referência visual das pessoas. Não é um depoimento ou resultado de alunos. Mockups são conceitos visuais, identificados como tal. Nenhum depoimento, registro profissional, prazo comercial ou resultado foi inventado.

Space Grotesk Variable, Inter Variable e Caveat Variable: pacotes Fontsource, licença OFL, incluída nas dependências. A página usa apenas os arquivos latinos WOFF2. Fotos WebP de 640 e 960px, lazy loading abaixo da dobra, hero priorizada. A seção sobre a preparação usa um caminho vetorial e grade discreta nas cores da marca, sem download de imagem adicional. A assinatura tipográfica da Jornada, inspirada na referência Hotmart enviada, aparece na hero, na oferta e nos mockups.

O site de referência e a Hotmart retornaram bloqueio do proxy do ambiente na consulta de rede. O conteúdo editorial foi implementado a partir do briefing fornecido. Não foi feita validação independente de credenciais ou extração de imagens/depoimentos do site original.

## Estrutura

```text
src/offer.ts        Dados editáveis e aprovações
src/main.ts         Seções e interações acessíveis
src/style.css       Direção visual e breakpoints
src/checkout.ts     Checkout e atribuição permitida
src/analytics.ts    Consentimento e eventos opcionais
scripts/check-release.ts  Verificação das condições para publicação
tests/landing.spec.ts     Navegação, mobile, privacidade e WCAG
public/images/      Imagens locais e Open Graph
```

A condição solicitada é **12x de R$ 6,93**, total parcelado de **R$ 83,16**, com **R$ 67,00 à vista**. A oferta e o FAQ distinguem os dois valores, sem alegar parcelamento sem juros. Os dados ficam centralizados em `src/offer.ts`.

Na hero mobile, a foto ocupa a largura disponível com altura automática e proporção original 3:4, inclusive ao redimensionar a janela. No desktop, o enquadramento continua usando `object-fit: cover`.

A hero usa fluxo de blocos no mobile: foto, rodapé da hero e esteira ocupam espaços consecutivos. Os testes conferem a separação durante carregamento lento e após redimensionamento. A execução direta do WebKit ficou indisponível neste ambiente por bloqueio do download do navegador.
