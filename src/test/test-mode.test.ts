import { describe, expect, it } from "vitest";

import { isTestDevice } from "@/lib/test-mode";

const req = (cookie?: string) =>
  new Request("https://example.org/go/x", cookie ? { headers: { cookie } } : undefined);

describe("isTestDevice", () => {
  it("flags a device carrying the test cookie", () => {
    expect(isTestDevice(req("a=b; gfi_test=1; c=d"))).toBe(true);
  });
  it("ignores visitors without it", () => {
    expect(isTestDevice(req())).toBe(false);
    expect(isTestDevice(req("gfi_test=0; other=1"))).toBe(false);
  });
});
