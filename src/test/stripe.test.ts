import { afterEach, describe, expect, it, vi } from "vitest";

import { checkPurchase } from "@/lib/stripe.server";

const LINK = "https://buy.stripe.com/test_abc123";
const SESSION = "cs_test_a1B2c3D4e5F6g7H8";

function mockStripe(session: object | null, link: object | null) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const body = url.includes("checkout/sessions") ? session : link;
      return body
        ? new Response(JSON.stringify(body), { status: 200 })
        : new Response("{}", { status: 404 });
    }),
  );
}

describe("checkPurchase", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("refuses when Stripe is not configured", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect(await checkPurchase(SESSION, LINK)).toEqual({ ok: false, reason: "config" });
  });

  it("refuses a malformed session id without calling Stripe", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "rk_test_x");
    mockStripe(null, null);
    expect(await checkPurchase("../../etc", LINK)).toEqual({ ok: false, reason: "invalid" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts a paid session from the skill's payment link", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "rk_test_x");
    mockStripe(
      { payment_status: "paid", payment_link: "plink_1", customer_details: { email: "a@b.fr" } },
      { url: LINK },
    );
    expect(await checkPurchase(SESSION, LINK)).toEqual({ ok: true, email: "a@b.fr" });
  });

  it("refuses an unpaid session or another product", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "rk_test_x");
    mockStripe({ payment_status: "unpaid", payment_link: "plink_1" }, { url: LINK });
    expect(await checkPurchase(SESSION, LINK)).toEqual({ ok: false, reason: "unpaid" });
    mockStripe(
      { payment_status: "paid", payment_link: "plink_2" },
      { url: "https://buy.stripe.com/other" },
    );
    expect(await checkPurchase(SESSION, LINK)).toEqual({ ok: false, reason: "other-product" });
  });
});
