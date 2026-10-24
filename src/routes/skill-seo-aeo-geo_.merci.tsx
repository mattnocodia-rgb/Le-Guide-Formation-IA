import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PageFrame } from "@/components/site/SiteChrome";
import { checkSkillPurchase } from "@/lib/content.functions";
import { SITE_NAME } from "@/lib/site";

const CONTACT = "contact@optimatt.fr";

export const Route = createFileRoute("/skill-seo-aeo-geo_/merci")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({ session_id: z.string().max(300).optional().catch(undefined) }).parse(s),
  loaderDeps: ({ search }) => ({ sessionId: search.session_id ?? "" }),
  loader: ({ deps }) => checkSkillPurchase({ data: { sessionId: deps.sessionId } }),
  head: () => ({
    meta: [
      { title: `Merci pour votre achat — ${SITE_NAME}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Thanks,
});

function Thanks() {
  const result = Route.useLoaderData();
  const { session_id } = Route.useSearch();
  const fileUrl = `/skill-seo-aeo-geo/fichier?session_id=${encodeURIComponent(session_id ?? "")}`;

  return (
    <PageFrame>
      <section className="container-wide max-w-[720px] py-14 md:py-20">
        {result.ok ? (
          <>
            <p className="note m-0 -rotate-2 text-[28px]">c'est à vous</p>
            <h1 className="mt-3 mb-6 text-[clamp(34px,4.6vw,50px)] leading-[1.05]">
              Merci pour votre achat !
            </h1>
            <p className="m-0 text-lg leading-relaxed text-ink-soft">
              Votre paiement est confirmé. Téléchargez le skill, puis suivez le tutoriel
              d'installation : cinq minutes suffisent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={fileUrl} className="btn-ink" download>
                Télécharger le skill (.zip)
              </a>
              <Link to="/skill-seo-aeo-geo/installation" className="btn-outline">
                Ouvrir le tutoriel
              </Link>
            </div>
            <div className="sheet mt-10 p-5">
              <p className="m-0 text-[15.5px] leading-relaxed">
                <strong>Gardez cette page dans vos favoris :</strong> son adresse vous permet de
                retélécharger le fichier. Le reçu Stripe envoyé par e-mail fait foi de votre achat.
                Un problème ? Écrivez à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-0 mb-6 text-[clamp(30px,4vw,44px)] leading-[1.1]">
              Nous n'avons pas pu vérifier votre achat
            </h1>
            <p className="m-0 text-lg leading-relaxed text-ink-soft">
              {result.reason === "unpaid"
                ? "Le paiement n'est pas encore confirmé. Patientez une minute, puis rechargez cette page."
                : "Le lien de téléchargement est incomplet ou ne correspond pas à un achat du skill."}
            </p>
            <p className="m-0 mt-4 text-lg leading-relaxed text-ink-soft">
              Si vous avez payé, écrivez à <a href={`mailto:${CONTACT}`}>{CONTACT}</a> avec votre
              reçu Stripe : je vous envoie le fichier.
            </p>
            <p className="m-0 mt-8">
              <Link to="/skill-seo-aeo-geo">← Retour à la présentation du skill</Link>
            </p>
          </>
        )}
      </section>
    </PageFrame>
  );
}
