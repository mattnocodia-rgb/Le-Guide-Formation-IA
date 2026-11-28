/** Resolve retired public URLs and trailing slashes before SSR, preserving the query string. */
export function permanentRedirectLocation(url: URL): string | null {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/boutique") return `/realisations${url.search}`;
  return path !== url.pathname ? path + url.search : null;
}
