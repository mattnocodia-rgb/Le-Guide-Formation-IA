import { readToken } from "./airtable.server";

export type PurchaseCheck =
  | { ok: true; email: string | null }
  | { ok: false; reason: "config" | "invalid" | "unpaid" | "other-product" | "error" };

type StripeObject = {
  payment_status?: string;
  payment_link?: string | null;
  url?: string;
  customer_details?: { email?: string | null } | null;
};

async function stripeGet(path: string, key: string): Promise<StripeObject | null> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    if (res.status !== 404) console.error(`Stripe ${path} [${res.status}]: ${await res.text()}`);
    return null;
  }
  return (await res.json()) as StripeObject;
}

/**
 * Checks that a Checkout Session was paid through the expected Payment Link.
 * Needs STRIPE_SECRET_KEY (a restricted key: Checkout Sessions read + Payment Links read).
 */
export async function checkPurchase(
  sessionId: string,
  expectedLinkUrl: string | null,
): Promise<PurchaseCheck> {
  const key = readToken("STRIPE_SECRET_KEY");
  if (!key || !expectedLinkUrl) return { ok: false, reason: "config" };
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return { ok: false, reason: "invalid" };
  }
  try {
    const session = await stripeGet(`checkout/sessions/${sessionId}`, key);
    if (!session) return { ok: false, reason: "invalid" };
    if (session.payment_status !== "paid") return { ok: false, reason: "unpaid" };
    const linkId = typeof session.payment_link === "string" ? session.payment_link : null;
    if (!linkId) return { ok: false, reason: "other-product" };
    const link = await stripeGet(`payment_links/${linkId}`, key);
    if (!link || link.url !== expectedLinkUrl) return { ok: false, reason: "other-product" };
    return { ok: true, email: session.customer_details?.email ?? null };
  } catch (e) {
    console.error("Stripe check failed", e);
    return { ok: false, reason: "error" };
  }
}
