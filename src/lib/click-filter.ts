// Decides whether a request to /go/<id> is a real visitor's click, worth counting.

const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|headless|lighthouse|pagespeed|gtmetrix|checker|monitor|scan/i;

/** Page of origin, taken from the Referer when it comes from this site. */
export function originPage(request: Request) {
  const ref = request.headers.get("referer");
  if (!ref) return "(inconnue)";
  try {
    const from = new URL(ref);
    const self = new URL(request.url);
    return from.host === self.host ? from.pathname : `(externe) ${from.host}`;
  } catch {
    return "(inconnue)";
  }
}

/**
 * A visitor clicking a link on the site always sends a Referer from this site (the site's
 * policy is strict-origin-when-cross-origin, so same-site navigations keep the full URL).
 * Crawlers, link checkers and audit tools follow the same links without one: in November
 * 2026 they produced bursts of dozens of "clicks" in a few minutes, with no page of origin.
 *
 * Browsers that send Fetch Metadata headers must also report a same-origin navigation
 * triggered by the user. Those headers are optional, so their absence is not held against
 * the request.
 */
export function isRealClick(request: Request) {
  const h = request.headers;
  if (BOT_UA.test(h.get("user-agent") ?? "")) return false;
  const purpose = h.get("sec-purpose") ?? h.get("purpose") ?? "";
  if (/prefetch|prerender/i.test(purpose)) return false;
  if (!originPage(request).startsWith("/")) return false;
  const site = h.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const mode = h.get("sec-fetch-mode");
  if (mode && mode !== "navigate") return false;
  const user = h.get("sec-fetch-user");
  if (mode === "navigate" && site && user !== "?1") return false;
  return true;
}
