import { loadEnv } from "vite";
import { offer } from "../src/offer";
import { buildCheckoutUrl } from "../src/checkout";

const env = loadEnv("production-ready", process.cwd(), "VITE_");
const missing: string[] = [];
if (
  !buildCheckoutUrl(env.VITE_HOTMART_CHECKOUT_URL || offer.HOTMART_CHECKOUT_URL)
)
  missing.push("Link HTTPS oficial da Hotmart");
if (!offer.accessPeriod) missing.push("Prazo de acesso confirmado");
if (!offer.guarantee) missing.push("Política de garantia confirmada");
if (!offer.paymentMethods) missing.push("Formas de pagamento confirmadas");
if (
  !offer.merchant.confirmed ||
  !offer.merchant.legalName ||
  !offer.merchant.cnpj
)
  missing.push("Empresa responsável e CNPJ confirmados para esta oferta");
for (const [key, name] of Object.entries({
  privacy: "Política de Privacidade",
  terms: "Termos de Uso",
  support: "Canal de suporte",
})) {
  const value = offer.legal[key as keyof typeof offer.legal];
  if (
    !value ||
    !(
      key === "support" ? /^(https:\/\/|mailto:)[^\s]+$/ : /^https:\/\/[^\s]+$/
    ).test(value)
  )
    missing.push(name);
}
if (!offer.siteUrl || !/^https:\/\//.test(offer.siteUrl))
  missing.push("URL pública HTTPS para canonical e Open Graph");
if (!offer.publication.contentApproved)
  missing.push("Revisão editorial da oferta, módulos e materiais");
if (!offer.publication.instructorProfileApproved)
  missing.push("Validação da apresentação profissional de Mateus Tiujo");
if (offer.instructor.portrait && !offer.publication.instructorProfileApproved)
  missing.push("Autorização de uso do retrato oficial");
if (missing.length) {
  console.error(
    "Publicação comercial bloqueada. Confirme em src/offer.ts:\n" +
      missing.map((item) => `  - ${item}`).join("\n"),
  );
  console.error("\nPara revisar o layout sem indexação, use npm run build.");
  process.exitCode = 1;
} else console.log("Oferta validada para geração do build público.");
