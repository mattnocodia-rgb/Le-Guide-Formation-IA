import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
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
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withHeaders(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
