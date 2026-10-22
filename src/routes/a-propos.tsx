import { createFileRoute } from "@tanstack/react-router";

import { LinkedInIcon } from "@/components/site/Cards";
import { PageFrame } from "@/components/site/SiteChrome";
import { LINKEDIN_URL, SITE_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/a-propos")({
  head: () =>
    pageHead({
      title: `À propos — ${SITE_NAME}`,
      description:
        "Qui écrit ce guide, comment les articles sont rédigés, et comment fonctionnent les liens partenaires vers l'École Cube.",
      path: "/a-propos",
    }),
  component: About,
});

function About() {
  return (
    <PageFrame>
      <article className="container-wide max-w-[780px] py-12 md:py-16">
        <p className="note m-0 -rotate-2 text-[28px]">à propos</p>
        <h1 className="mt-3 mb-8 text-[clamp(36px,5vw,56px)] leading-[1.05]">
          Un guide écrit depuis le terrain
        </h1>
        <div className="prose-article">
          <p>
            Je suis ingénieur BTP de formation. Après plusieurs années côté terrain puis côté
            commercial, je me suis reconverti dans la conception d'outils numériques. Je suis
            aujourd'hui certifié <strong>Product Builder No-Code &amp; IA</strong> par l'École Cube
            (titre RNCP niveau 6).
          </p>
          <p>
            Je crée des sites web, des applications et des outils internes, et j'améliore les
            process des entreprises. Ce guide rassemble ce que j'aurais aimé lire avant de me lancer
            : les métiers, les outils, le financement.
          </p>
          <h2 id="ligne-editoriale">Ma ligne éditoriale</h2>
          <ul>
            <li>Des guides pratiques, écrits pour des personnes qui ne sont pas développeuses.</li>
            <li>Chaque chiffre est sourcé, et chaque article affiche sa date de mise à jour.</li>
            <li>
              Quand je parle de mon expérience, ce sont mes vrais chiffres, jamais des témoignages
              inventés.
            </li>
          </ul>
          <h2 id="independance">Un site indépendant</h2>
          <p>
            J'ai créé ce site de ma propre initiative. Il est totalement indépendant de l'École Cube
            : ce n'est pas un site officiel de l'école, qui n'intervient ni dans le choix des sujets
            ni dans la rédaction des articles. Les avis exprimés ici sont les miens.
          </p>
          <h2 id="liens-partenaires">Les liens partenaires</h2>
          <p>
            Je suis ambassadeur de l'École Cube. Certains liens de ce site sont des liens
            partenaires : si vous vous inscrivez à une formation via l'un d'eux, je perçois une
            commission, sans surcoût pour vous. Ils sont signalés comme tels dans chaque article. Je
            ne vends pas de formation moi-même.
          </p>
        </div>
        <a
          href={LINKEDIN_URL}
          rel="noopener me"
          target="_blank"
          className="btn-outline mt-10 text-[15px]"
        >
          <LinkedInIcon />
          Mon profil LinkedIn
        </a>
      </article>
    </PageFrame>
  );
}
