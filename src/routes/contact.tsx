import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { z } from "zod";

import { PageFrame } from "@/components/site/SiteChrome";
import { sendContact } from "@/lib/content.functions";
import { CONTACT_EMAIL, CONTACT_NEEDS, type ContactNeedId, pageHead } from "@/lib/site";

const PATH = "/contact";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;
const NEED_IDS = CONTACT_NEEDS.map((n) => n.id) as [ContactNeedId, ...ContactNeedId[]];

const field =
  "w-full rounded-md border border-rule bg-paper px-3 py-2 text-[16px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";
const label = "mb-1 block text-[15px] font-semibold";

export const Route = createFileRoute("/contact")({
  // /contact?besoin=audit preselects the need (links from the shop and the sales pages).
  validateSearch: (s: Record<string, unknown>) =>
    z.object({ besoin: z.enum(NEED_IDS).optional().catch(undefined) }).parse(s),
  head: () =>
    pageHead({
      title: "Contact : audit, rédaction, automatisation, site web",
      description:
        "Un audit de votre site, des articles pour Google et les IA, une automatisation ou un site web : décrivez votre besoin, je vous réponds personnellement.",
      path: PATH,
    }),
  component: ContactPage,
});

type State = "idle" | "sending" | "sent" | "error";

function ContactPage() {
  const { besoin } = Route.useSearch();
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setState("sending");
    try {
      const res = await sendContact({
        data: {
          nom: get("nom"),
          prenom: get("prenom"),
          email: get("email"),
          telephone: get("telephone"),
          besoin: get("besoin") as ContactNeedId,
          message: get("message"),
          rgpd: f.get("rgpd") === "on",
          page: document.referrer ? new URL(document.referrer).pathname : PATH,
          website: get("website"),
        },
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <PageFrame>
      <section className="container-wide max-w-[760px] pt-12 pb-20 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">parlons de votre projet</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,56px)] leading-[1.05]">Me contacter</h1>
        <p className="m-0 text-xl leading-relaxed text-ink-soft">
          Un audit de votre site, des articles pour être référencé sur Google et les IA, une
          automatisation ou un site web : décrivez votre besoin en quelques lignes, je vous réponds
          personnellement.
        </p>

        {state === "sent" ? (
          <div className="sheet relative mt-10 p-6 md:p-8" style={r("-0.5deg")}>
            <span aria-hidden="true" className="tape -top-2.5 left-10" style={r("3deg")} />
            <h2 className="m-0 text-[clamp(24px,2.6vw,32px)] leading-tight">Message envoyé</h2>
            <p className="m-0 mt-3 text-[17px] leading-relaxed text-ink-soft">
              Merci, votre demande est bien arrivée. Je vous réponds par e-mail ou par téléphone.
            </p>
            <p className="m-0 mt-4">
              <Link to="/" className="font-semibold">
                Retour à l'accueil →
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="sheet mt-10 flex flex-col gap-5 p-6 md:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="prenom" className={label}>
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  required
                  maxLength={80}
                  autoComplete="given-name"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="nom" className={label}>
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  required
                  maxLength={80}
                  autoComplete="family-name"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="telephone" className={label}>
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  pattern="[+0-9 ().\-]{6,25}"
                  autoComplete="tel"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="besoin" className={label}>
                Votre besoin
              </label>
              <select
                id="besoin"
                name="besoin"
                required
                defaultValue={besoin ?? ""}
                className={field}
              >
                <option value="" disabled>
                  Choisissez…
                </option>
                {CONTACT_NEEDS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className={label}>
                Votre message <span className="font-normal text-ink-soft">(facultatif)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={3000}
                placeholder="Votre site, votre activité, ce que vous aimeriez améliorer…"
                className={field}
              />
            </div>

            {/* Honeypot: hidden from people, filled in by bots. */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="website">Ne pas remplir</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <label className="flex items-start gap-3 text-[14.5px] leading-snug text-ink-soft">
              <input type="checkbox" name="rgpd" required className="mt-1 h-4 w-4 shrink-0" />
              <span>
                J'accepte que mes informations soient utilisées pour répondre à ma demande. Elles ne
                sont ni revendues ni utilisées pour de la prospection, et sont supprimées au plus
                tard trois ans après notre dernier échange. Détails et droits dans les{" "}
                <Link to="/mentions-legales" hash="cookies">
                  mentions légales
                </Link>
                .
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="submit" disabled={state === "sending"} className="btn-ink">
                {state === "sending" ? "Envoi…" : "Envoyer ma demande"}
              </button>
              {state === "error" ? (
                <p role="alert" className="m-0 text-[15px] font-semibold text-accent-ink">
                  L'envoi n'a pas fonctionné. Réessayez, ou écrivez directement à{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              ) : null}
            </div>
          </form>
        )}
      </section>
    </PageFrame>
  );
}
