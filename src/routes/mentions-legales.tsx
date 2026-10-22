import { createFileRoute } from "@tanstack/react-router";

import { PageFrame } from "@/components/site/SiteChrome";
import { SITE_NAME, SITE_URL, pageHead } from "@/lib/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () => {
    const head = pageHead({
      title: `Mentions légales — ${SITE_NAME}`,
      description: "Éditeur, hébergeur, liens partenaires et cookies.",
      path: "/mentions-legales",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex, follow" }] };
  },
  component: Legal,
});

function Legal() {
  return (
    <PageFrame>
      <article className="container-wide max-w-[780px] py-12 md:py-16">
        <h1 className="mb-8 text-[clamp(34px,4.6vw,48px)] leading-[1.05]">Mentions légales</h1>
        <div className="prose-article prose-compact">
          <h2 id="editeur">Éditeur du site</h2>
          <p>
            Site : {SITE_URL}
            <br />
            Éditeur : M. Audineau, entrepreneur individuel
            <br />
            Activité : Product Builder No-Code &amp; IA
            <br />
            SIRET : 852 848 415 00034
            <br />
            Adresse : Nantes, France
            <br />
            Contact : <a href="mailto:contact@optimatt.fr">contact@optimatt.fr</a>
            <br />
            Directeur de la publication : M. Audineau
          </p>
          <h2 id="hebergeur">Hébergeur</h2>
          <p>
            Lovable Labs Sweden AB
            <br />
            Regeringsgatan 25, 111 53 Stockholm, Suède
            <br />
            Contact : <a href="mailto:privacy@lovable.dev">privacy@lovable.dev</a>
          </p>
          <h2 id="liens-partenaires">Liens partenaires</h2>
          <p>
            Ce site contient des liens partenaires vers l'École Cube. Lorsqu'une inscription est
            réalisée via l'un de ces liens, l'éditeur du site peut percevoir une commission, sans
            surcoût pour la personne qui s'inscrit. Ces liens sont signalés dans chaque article.
          </p>
          <h2 id="cookies">Cookies et données personnelles</h2>
          <p>
            Ce site n'utilise aucun cookie de suivi ni outil de mesure d'audience tiers, et ne
            collecte aucune donnée personnelle via un formulaire. Les polices de caractères sont
            chargées depuis Google Fonts.
          </p>
          <h2 id="propriete">Propriété intellectuelle</h2>
          <p>
            Les textes de ce site sont la propriété de leur auteur. Toute reproduction intégrale
            sans autorisation est interdite.
          </p>
        </div>
      </article>
    </PageFrame>
  );
}
