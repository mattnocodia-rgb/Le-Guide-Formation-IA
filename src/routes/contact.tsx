import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { z } from "zod";

import { PageFrame } from "@/components/site/SiteChrome";
import { sendContact } from "@/lib/content.functions";
import { type ContactErrors, validateContact } from "@/lib/contact-validation";
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

/** « … pour parler {ABOUT[need]} » in the confirmation message. */
const ABOUT: Record<ContactNeedId, string> = {
  audit: "de l'audit de votre site",
  redaction: "de vos articles",
  automatisation: "de votre automatisation",
  site: "de votre site web",
  autre: "de votre projet",
};

/** What to read while waiting, depending on the need chosen in the form. */
const WHILE_WAITING: Record<
  ContactNeedId,
  {
    text: string;
    to: "/audit-seo" | "/skill-seo-aeo-geo" | "/simulateur-roi" | "/realisations" | "/";
  }
> = {
  audit: { text: "Voir ce que contient l'audit, avec l'exemple réel de ce site", to: "/audit-seo" },
  redaction: {
    text: "Voir comment le skill rédige les articles de ce guide",
    to: "/skill-seo-aeo-geo",
  },
  automatisation: {
    text: "Calculer ce que la tâche vous coûte aujourd'hui (simulateur gratuit)",
    to: "/simulateur-roi",
  },
  site: { text: "Voir ce que j'ai déjà construit", to: "/realisations" },
  autre: { text: "Parcourir les guides du site", to: "/" },
};

function ContactPage() {
  const { besoin } = Route.useSearch();
  const [state, setState] = useState<State>("idle");
  const [sent, setSent] = useState<{ prenom: string; besoin: ContactNeedId } | null>(null);
  const [errors, setErrors] = useState<ContactErrors>({});

  const err = (k: keyof ContactErrors) =>
    errors[k] ? (
      <p
        id={`${k}-error`}
        role="alert"
        className="m-0 mt-1 text-[14px] font-semibold text-accent-ink"
      >
        {errors[k]}
      </p>
    ) : null;
  const invalid = (k: keyof ContactErrors) =>
    errors[k]
      ? {
          "aria-invalid": true,
          "aria-describedby": `${k}-error`,
          className: `${field} border-accent`,
        }
      : { className: field };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    const found = validateContact({
      prenom: get("prenom"),
      nom: get("nom"),
      email: get("email"),
      telephone: get("telephone"),
      besoin: get("besoin"),
      rgpd: f.get("rgpd") === "on",
    });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setState("idle");
      return;
    }
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
      if (res.ok) setSent({ prenom: get("prenom").trim(), besoin: get("besoin") as ContactNeedId });
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
            <p className="note m-0 -rotate-1 text-[26px]">c'est bien reçu !</p>
            <h2 className="m-0 mt-1 text-[clamp(26px,2.8vw,34px)] leading-tight">
              Merci{sent?.prenom ? ` ${sent.prenom}` : ""}, votre message est arrivé
            </h2>
            <p className="m-0 mt-3 text-[17px] leading-relaxed">
              Je lis chaque demande moi-même, et je reviens vers vous par e-mail ou par téléphone
              pour parler {sent ? ABOUT[sent.besoin] : "de votre projet"}. Pas de robot, pas de
              relance automatique.
            </p>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink-soft">
              Ma réponse viendra de {CONTACT_EMAIL} : si vous ne la voyez pas, pensez à jeter un œil
              dans vos courriers indésirables.
            </p>
            {sent ? (
              <p className="m-0 mt-6 text-[16px]">
                <span className="font-semibold">En attendant :</span>{" "}
                <Link to={WHILE_WAITING[sent.besoin].to} className="font-semibold">
                  {WHILE_WAITING[sent.besoin].text} →
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <form
            noValidate
            onSubmit={onSubmit}
            className="sheet mt-10 flex flex-col gap-5 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="prenom" className={label}>
                  Prénom<span className="text-accent-ink" aria-hidden="true"> *</span>
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  required
                  maxLength={80}
                  autoComplete="given-name"
                  {...invalid("prenom")}
                />
                {err("prenom")}
              </div>
              <div>
                <label htmlFor="nom" className={label}>
                  Nom<span className="text-accent-ink" aria-hidden="true"> *</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  required
                  maxLength={80}
                  autoComplete="family-name"
                  {...invalid("nom")}
                />
                {err("nom")}
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  E-mail<span className="text-accent-ink" aria-hidden="true"> *</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  {...invalid("email")}
                />
                {err("email")}
              </div>
              <div>
                <label htmlFor="telephone" className={label}>
                  Téléphone<span className="text-accent-ink" aria-hidden="true"> *</span>
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  maxLength={25}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  {...invalid("telephone")}
                />
                {err("telephone")}
              </div>
            </div>

            <div>
              <label htmlFor="besoin" className={label}>
                Votre besoin<span className="text-accent-ink" aria-hidden="true"> *</span>
              </label>
              <select
                id="besoin"
                name="besoin"
                required
                defaultValue={besoin ?? ""}
                {...invalid("besoin")}
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
              {err("besoin")}
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

            <p className="text-[13px] text-ink-soft"><span className="text-accent-ink">*</span> Champs obligatoires</p>
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
            {err("rgpd")}

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
