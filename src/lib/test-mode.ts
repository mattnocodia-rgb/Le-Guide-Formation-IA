/** Name of the cookie that flags the site owner's own devices as "test". */
export const TEST_COOKIE = "gfi_test";

/** Hosts of the Lovable editor and its previews: only the owner browses the site there. */
const PREVIEW_HOST = /(^|\.)(lovable\.dev|lovable\.app|lovableproject\.com)$/i;

function hostOf(url: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

/** True when the request comes from the Lovable editor or one of its preview URLs. */
export function isPreviewRequest(request: Request) {
  return (
    PREVIEW_HOST.test(hostOf(request.url)) ||
    PREVIEW_HOST.test(hostOf(request.headers.get("referer")))
  );
}

/**
 * True when the request comes from a device marked in test mode, or from the Lovable
 * preview (where the test-mode cookie of the real site is not sent).
 */
export function isTestDevice(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  if (cookies.split(";").some((c) => c.trim() === `${TEST_COOKIE}=1`)) return true;
  return isPreviewRequest(request);
}
