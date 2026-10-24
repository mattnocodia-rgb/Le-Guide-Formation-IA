import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PageFrame } from "@/components/site/SiteChrome";
import { SITE_NAME, SITE_URL, jsonLdScript, pageHead } from "@/lib/site";

const PATH = "/skill-seo-aeo-geo/installation";
const CONTACT = "contact@optimatt.fr";
const ZIP = "seo-aeo-geo-audit.zip";
const SKILL = "seo-aeo-geo-audit";

const TOC = [
  { id: "recuperer", label: "1. Récupérer le skill" },
  { id: "claude", label: "2. L'installer dans Claude" },
  { id: "claude-code", label: "3. L'installer dans Claude Code" },
  { id: "utiliser", label: "4. L'utiliser" },
  { id: "mettre-a-jour", label: "5. Le mettre à jour" },
  { id: "depannage", label: "6. En cas de problème" },
];

const INSTALL_STEPS = [
  "Ouvrez claude.ai (ou l'application Claude sur ordinateur) et connectez-vous. L'offre gratuite suffit.",
  "Activez la création de fichiers : Paramètres → Capacités, puis l'option « Exécution de code et création de fichiers » (« Créer et modifier des fichiers » dans la nouvelle présentation).",
  "Ouvrez Personnaliser → Skills.",
  "Cliquez sur « + », puis sur « Créer un skill », puis sur « Importer un skill ».",
  `Choisissez le fichier ${ZIP}, sans le décompresser.`,
  "Vérifiez que l'interrupteur à côté du skill est bien activé.",
];

const PROMPTS = [
  {
    goal: "Auditer un site entier",
    text: "Audite les articles de https://monsite.fr en SEO, AEO et GEO. Commence par le sitemap.",
  },
  {
    goal: "Vérifier un article avant de le publier",
    text: "Voici mon article [collez le texte]. Passe-le à la grille SEO / AEO / GEO et dis-moi quoi corriger en priorité.",
  },
  {
    goal: "Écrire un nouvel article",
    text: "Écris un article sur [sujet] pour [public], qui coche la grille dès la publication. Mon site parle de [thème].",
  },
  {
    goal: "Chercher les contradictions",
    text: "Compare mes articles entre eux : doublons, chiffres qui se contredisent, vocabulaire qui a changé.",
  },
  {
    goal: "Corriger via Lovable, WordPress ou un autre outil",
    text: "Rédige le prompt à coller dans Lovable pour corriger cet article, sans toucher à son URL.",
  },
];

const HOWTO_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Installer le skill Claude SEO / AEO / GEO",
  url: `${SITE_URL}${PATH}`,
  totalTime: "PT5M",
  tool: [{ "@type": "HowToTool", name: "Un compte Claude (offre gratuite comprise)" }],
  supply: [{ "@type": "HowToSupply", name: ZIP }],
  step: INSTALL_STEPS.map((text, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    text,
  })),
};

export const Route = createFileRoute("/skill-seo-aeo-geo_/installation")({
  head: () => {
    const head = pageHead({
      title: `Installer et utiliser le skill SEO / AEO / GEO dans Claude, pas à pas — ${SITE_NAME}`,
      description:
        "Tutoriel pas à pas : récupérer le fichier du skill, l'installer dans Claude ou Claude Code, puis l'utiliser pour auditer ou écrire des articles. Exemples de demandes et solutions aux problèmes courants.",
      path: PATH,
    });
    return { ...head, scripts: [jsonLdScript(HOWTO_LD)] };
  },
  component: Tutorial,
});

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="pt-14">
      <h2 id={id} className="m-0 scroll-mt-24 text-[clamp(26px,3vw,34px)] leading-[1.15]">
        {title}
      </h2>
      <div className="prose-article mt-5">{children}</div>
    </section>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="postit my-6 p-5 text-[16px] leading-relaxed" style={{ transform: "none" }}>
      {children}
    </div>
  );
}

function Tutorial() {
  return (
    <PageFrame>
      <article className="container-wide max-w-[780px] pt-12 pb-20 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">tutoriel</p>
        <h1 className="mt-3 mb-6 text-[clamp(34px,4.6vw,52px)] leading-[1.05]">
          Installer et utiliser le skill SEO / AEO / GEO, pas à pas
        </h1>
        <p className="m-0 text-xl leading-relaxed text-ink-soft">
          Cinq minutes pour l'installer, aucune ligne de code. Ce tutoriel suit l'ordre réel :
          récupérer le fichier, l'installer dans Claude, puis s'en servir.
        </p>

        <nav aria-label="Sommaire" className="sheet mt-8 p-5">
          <p className="note m-0 text-[22px]">sommaire</p>
          <ol className="m-0 mt-2 flex list-none flex-col gap-1 p-0 text-[16.5px]">
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <Block id="recuperer" title="1. Récupérer le skill">
          <ol>
            <li>
              Sur la <Link to="/skill-seo-aeo-geo">page du skill</Link>, cliquez sur « Acheter le
              skill ». Le paiement se fait sur une page sécurisée Stripe.
            </li>
            <li>
              Cochez la case d'acceptation des conditions de vente, puis payez. Vous êtes renvoyé
              automatiquement sur la page de remerciement du site.
            </li>
            <li>
              Cliquez sur <strong>« Télécharger le skill (.zip) »</strong>. Le fichier{" "}
              <code>{ZIP}</code> arrive dans votre dossier Téléchargements.
            </li>
            <li>
              <strong>Ajoutez la page de remerciement à vos favoris</strong> : son adresse permet de
              retélécharger le fichier, par exemple pour une mise à jour.
            </li>
          </ol>
          <Tip>
            <strong>Ne décompressez pas le fichier</strong> si vous installez le skill dans Claude :
            c'est le .zip tel quel qu'il faut importer. Pas reçu le fichier ? Écrivez à{" "}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a> avec votre reçu Stripe.
          </Tip>
        </Block>

        <Block id="claude" title="2. L'installer dans Claude (navigateur ou application)">
          <ol>
            {INSTALL_STEPS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>
            C'est fini : le skill est rattaché à votre compte, et privé tant que vous ne le partagez
            pas. Les menus de Claude peuvent s'afficher en anglais selon votre réglage de langue :{" "}
            <em>Settings → Capabilities</em>, <em>Customize → Skills</em>, <em>Create skill</em>,{" "}
            <em>Upload a skill</em>.
          </p>
          <Tip>
            <strong>Compte Team ou Enterprise ?</strong> Un administrateur doit d'abord autoriser
            les skills et la création de fichiers dans les paramètres de l'organisation (
            <em>Organization settings → Plugins &amp; skills</em>).
          </Tip>
        </Block>

        <Block id="claude-code" title="3. L'installer dans Claude Code">
          <p>
            <strong>Option automatique.</strong> Si vous avez installé le skill dans Claude à
            l'étape 2, et que Claude Code est connecté avec le même compte, il le récupère tout seul
            (version 2.1.273 ou plus récente). Pour le vérifier, tapez <code>/skills</code> : le
            skill apparaît sous « claude.ai sync ».
          </p>
          <p>
            <strong>Option manuelle.</strong> Décompressez le .zip dans le dossier des skills de
            Claude Code, pour obtenir <code>~/.claude/skills/{SKILL}/SKILL.md</code> :
          </p>
          <pre className="overflow-x-auto rounded-md border border-rule bg-paper-light p-3 text-[14px]">
            <code>{`unzip ${ZIP} -d ~/.claude/skills/`}</code>
          </pre>
          <p>
            Sous Windows, faites un clic droit sur le .zip, « Extraire tout », et choisissez le
            dossier <code>%USERPROFILE%\.claude\skills\</code>. Relancez Claude Code, puis vérifiez
            avec <code>/skills</code>. Pour un seul projet, utilisez plutôt le dossier{" "}
            <code>.claude/skills/</code> du projet.
          </p>
        </Block>

        <Block id="utiliser" title="4. L'utiliser">
          <p>
            <strong>Vous n'avez rien à lancer.</strong> Ouvrez une nouvelle conversation et posez
            votre question en français : Claude reconnaît une demande d'audit ou de rédaction et
            charge le skill de lui-même. Vous le voyez apparaître dans le déroulé de sa réponse.
          </p>
          <p>
            Pour auditer un site en ligne, vérifiez que la <strong>recherche web</strong> est
            activée dans la conversation : Claude doit pouvoir lire votre sitemap et vos pages.
          </p>
          <h3>Exemples de demandes</h3>
          <div className="not-prose flex flex-col gap-3">
            {PROMPTS.map((p) => (
              <div key={p.goal} className="rounded-md border border-rule bg-paper-light px-4 py-3">
                <p className="m-0 text-[14px] font-semibold text-accent-ink">{p.goal}</p>
                <p className="m-0 mt-1 font-mono text-[14.5px] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
          <h3>Ce que vous obtenez</h3>
          <ol>
            <li>
              <strong>Le périmètre</strong> : combien de pages ont été trouvées, combien ont été
              lues en entier.
            </li>
            <li>
              <strong>Les problèmes entre articles</strong> d'abord (doublons, chiffres
              contradictoires), puis les problèmes techniques et article par article.
            </li>
            <li>
              <strong>Les contrôles par leur numéro</strong> : P pour paragraphe, A pour article, S
              pour site. « A10 manquant » signifie : pas d'expérience de première main.
            </li>
            <li>
              <strong>Un plan d'action priorisé</strong>, avec pour chaque action ce qu'elle corrige
              et ce qu'elle ne corrige pas.
            </li>
          </ol>
          <h3>Trois conseils</h3>
          <ul>
            <li>
              <strong>Un site par conversation</strong>, pour que les comparaisons entre articles
              restent justes.
            </li>
            <li>
              <strong>Gros site ?</strong> Demandez l'audit catégorie par catégorie, puis une
              synthèse : vous restez dans les limites d'usage, surtout sur l'offre gratuite.
            </li>
            <li>
              <strong>Enchaînez</strong> : après l'audit, demandez « réécris l'article X » ou «
              donne le prompt pour corriger X ». Le skill garde la grille en tête.
            </li>
          </ul>
        </Block>

        <Block id="mettre-a-jour" title="5. Le mettre à jour">
          <ol>
            <li>Retéléchargez le .zip depuis votre page de remerciement (vos favoris).</li>
            <li>
              Dans Personnaliser → Skills, ouvrez l'ancien skill, désactivez-le, cliquez sur « … »
              puis « Supprimer ».
            </li>
            <li>Importez le nouveau .zip comme à l'étape 2.</li>
          </ol>
        </Block>

        <Block id="depannage" title="6. En cas de problème">
          <h3>L'import du .zip est refusé</h3>
          <p>
            Importez le fichier d'origine, sans l'avoir décompressé, renommé ni recompressé : le nom
            du dossier à l'intérieur doit rester <code>{SKILL}</code> et contenir le fichier{" "}
            <code>SKILL.md</code>. Vérifiez aussi que la création de fichiers est activée.
          </p>
          <h3>Claude n'utilise pas le skill</h3>
          <p>
            Vérifiez que son interrupteur est activé, puis nommez-le dans votre demande : « Utilise
            le skill {SKILL} pour auditer… ».
          </p>
          <h3>Claude n'arrive pas à lire mon site</h3>
          <p>
            Activez la recherche web. Si le site bloque les robots, collez le texte des articles ou
            joignez un export (CSV, Airtable, CMS) : le skill audite aussi ce qu'on lui donne.
          </p>
          <h3>La réponse s'arrête en cours de route</h3>
          <p>
            Vous avez atteint une limite d'usage. Écrivez « continue », ou découpez l'audit par
            catégorie.
          </p>
          <p>
            Toujours bloqué ? Écrivez à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </Block>

        <p className="m-0 mt-12 text-[14px] text-ink-soft">
          Menus et étapes vérifiés en octobre 2026 d'après le centre d'aide Claude (« Use skills »).
          L'interface de Claude évolue : si un libellé a changé, l'étape reste la même.
        </p>
      </article>
    </PageFrame>
  );
}
