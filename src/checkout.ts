import { offer } from "./offer";

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "sck",
] as const;
export function buildCheckoutUrl(
  destination: string,
  search = "",
): string | null {
  try {
    const url = new URL(destination);
    if (
      url.protocol !== "https:" ||
      !(url.hostname === "hotmart.com" || url.hostname.endsWith(".hotmart.com"))
    )
      return null;
    const params = new URLSearchParams(search);
    for (const key of attributionKeys) {
      const value = params.get(key);
      if (value && value.length <= 256 && !/[\x00-\x1f\x7f]/.test(value))
        url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function checkoutUrl() {
  const destination =
    import.meta.env.VITE_HOTMART_CHECKOUT_URL?.trim() ||
    offer.HOTMART_CHECKOUT_URL;
  return buildCheckoutUrl(
    destination,
    window.frameElement?.getAttribute("data-campaign-search") ||
      window.location.search,
  );
}
