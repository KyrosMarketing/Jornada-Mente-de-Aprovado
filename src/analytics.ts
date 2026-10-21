type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & {
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
    callMethod?: (...args: unknown[]) => void;
    push?: unknown;
  };
  _fbq?: unknown;
};
const w = window as AnalyticsWindow;
const consentKey = "preparamente:analytics-consent:v1";
let enabled = false;
let loaded = false;
export const trackingConfigured = Boolean(
  import.meta.env.VITE_GA4_ID ||
  import.meta.env.VITE_META_PIXEL_ID ||
  import.meta.env.VITE_GTM_ID,
);
export function consentStatus(): string | null {
  try {
    return localStorage.getItem(consentKey);
  } catch {
    return null;
  }
}
export function setConsent(accepted: boolean) {
  enabled = accepted;
  try {
    localStorage.setItem(consentKey, accepted ? "accepted" : "essential");
  } catch {
    /* Storage is optional. */
  }
  if (accepted) loadAnalytics();
  else {
    w.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    w.fbq?.("consent", "revoke");
    // Reload after withdrawing previously granted permission so loaded vendor scripts stop running.
    if (loaded) window.location.reload();
  }
}
function script(src: string) {
  const el = document.createElement("script");
  el.src = src;
  el.async = true;
  document.head.append(el);
}
function loadAnalytics() {
  if (loaded || !trackingConfigured) return;
  loaded = true;
  const ga = import.meta.env.VITE_GA4_ID;
  const gtm = import.meta.env.VITE_GTM_ID;
  const meta = import.meta.env.VITE_META_PIXEL_ID;
  w.dataLayer ||= [];
  w.gtag = function (..._args: unknown[]) {
    w.dataLayer!.push(arguments);
  };
  w.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (gtm && /^GTM-[A-Z0-9]+$/.test(gtm)) {
    w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    script(`https://www.googletagmanager.com/gtm.js?id=${gtm}`);
  } else if (ga && /^G-[A-Z0-9]+$/.test(ga)) {
    script(`https://www.googletagmanager.com/gtag/js?id=${ga}`);
    w.gtag("js", new Date());
    w.gtag("config", ga, { send_page_view: false });
  }
  if (meta && /^\d+$/.test(meta)) {
    const fbq = function (...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod(...args) : fbq.queue!.push(args);
    } as NonNullable<AnalyticsWindow["fbq"]>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    script("https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", meta);
    fbq("consent", "grant");
  }
  track("page_view");
  track("view_content");
}
export function track(
  event: "page_view" | "view_content" | "cta_click" | "checkout_redirect",
  properties: Record<string, unknown> = {},
) {
  if (!enabled || !trackingConfigured) return;
  if (import.meta.env.VITE_GTM_ID) w.dataLayer?.push({ event, ...properties });
  else w.gtag?.("event", event, properties);
  if (event === "page_view") w.fbq?.("track", "PageView");
  else if (event === "view_content")
    w.fbq?.("track", "ViewContent", properties);
  else w.fbq?.("trackCustom", event, properties);
}
export function initializeAnalytics() {
  if (consentStatus() === "accepted") {
    enabled = true;
    loadAnalytics();
  }
}
