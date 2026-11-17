import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Store the resolved entry, never a promise: on Workers a promise created during one request
// can't settle inside another request.
let serverEntry: ServerEntry | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntry) {
    const m = await import("@tanstack/react-start/server-entry");
    serverEntry = (m.default ?? m) as ServerEntry;
  }
  return serverEntry;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Headers added to every response. No X-Frame-Options: the Lovable editor shows the site in a
 * frame, so framing is limited with CSP frame-ancestors instead (own site + Lovable only).
 */
const SECURITY_HEADERS: Record<string, string> = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "content-security-policy":
    "frame-ancestors 'self' https://lovable.dev https://*.lovable.dev https://*.lovable.app https://*.lovableproject.com; base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
};

/** Pages that are personal or have side effects: never cached at the edge. */
const NO_EDGE_CACHE = /^\/(go\/|mode-test|indexnow|skill-seo-aeo-geo\/(merci|fichier))/;

/** Public HTML pages: 5 min at the edge, then served stale while it refreshes in the background. */
const HTML_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

const NOT_FOUND_TITLE = "Page introuvable — Le Guide Formation IA";
const NOT_FOUND_DESCRIPTION =
  "Cette page n'existe pas ou a changé d'adresse. Retrouvez tous les guides depuis l'accueil.";

/**
 * The router renders 404 pages with the parent route's head (home title). Rewrite the head of
 * every HTML 404 so it gets its own title, description and noindex; the status stays 404.
 */
async function fixNotFoundHead(response: Response): Promise<Response> {
  if (response.status !== 404) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  let html = await response.text();
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${NOT_FOUND_TITLE}</title>`);
  html = html.replace(/<meta name="description"[^>]*>/g, "");
  html = html.replace(/<meta name="robots"[^>]*>/g, "");
  html = html.replace(
    "</title>",
    `</title><meta name="description" content="${NOT_FOUND_DESCRIPTION.replace(/'/g, "&#x27;")}"/><meta name="robots" content="noindex"/>`,
  );
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: 404, statusText: response.statusText, headers });
}

function withHeaders(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  const url = new URL(request.url);
  const current = headers.get("cache-control") ?? "";
  const cacheable =
    request.method === "GET" &&
    response.status === 200 &&
    (headers.get("content-type") ?? "").includes("text/html") &&
    !headers.has("set-cookie") &&
    url.search === "" &&
    !NO_EDGE_CACHE.test(url.pathname) &&
    !/no-store|private/.test(current);
  if (cacheable) {
    headers.set("cache-control", HTML_CACHE);
    headers.set("cdn-cache-control", "max-age=300, stale-while-revalidate=86400");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Trailing slash: permanent redirect to the slash-less URL (the router would answer 307).
    const url = new URL(request.url);
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "") || "/";
      return withHeaders(request, new Response(null, { status: 301, headers: { location: url.pathname + url.search } }));
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withHeaders(request, await fixNotFoundHead(await normalizeCatastrophicSsrResponse(response)));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
