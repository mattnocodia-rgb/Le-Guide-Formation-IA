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

describe("isTestDevice — Lovable preview", () => {
  const fromPage = (url: string, referer?: string) =>
    new Request(url, referer ? { headers: { referer } } : undefined);

  it("flags clicks made inside the Lovable editor or its previews", () => {
    expect(
      isTestDevice(
        fromPage(
          "https://formation-ia.optimatt.fr/go/x",
          "https://58c0503f-1806-469c-8eab-ef2cc00bc62a.lovableproject.com/",
        ),
      ),
    ).toBe(true);
    expect(
      isTestDevice(
        fromPage("https://formation-ia.optimatt.fr/go/x", "https://lovable.dev/projects/abc"),
      ),
    ).toBe(true);
    expect(isTestDevice(fromPage("https://id-preview--abc.lovable.app/go/x"))).toBe(true);
  });
  it("keeps real visitors, including those coming from other sites", () => {
    expect(
      isTestDevice(
        fromPage("https://formation-ia.optimatt.fr/go/x", "https://formation-ia.optimatt.fr/"),
      ),
    ).toBe(false);
    expect(
      isTestDevice(fromPage("https://formation-ia.optimatt.fr/go/x", "https://www.google.com/")),
    ).toBe(false);
    expect(
      isTestDevice(
        fromPage("https://formation-ia.optimatt.fr/go/x", "https://notlovable.dev.example.com/"),
      ),
    ).toBe(false);
  });
});
