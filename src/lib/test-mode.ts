/** Name of the cookie that flags the site owner's own devices as "test". */
export const TEST_COOKIE = "gfi_test";

/** True when the request comes from a device marked in test mode. */
export function isTestDevice(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  return cookies.split(";").some((c) => c.trim() === `${TEST_COOKIE}=1`);
}
