// Client-safe product catalogue for the /boutique page.
// Add a product here to list it in the shop; set `status: "bientot"` while it is being built.

import { type ContactNeedId, SKILL_NAME } from "@/lib/site";

export type ProductStatus = "disponible" | "bientot";

/** « service » = done with or for the client (audit, accompaniment); « diy » = skill + tutorial bought directly. */
export type ProductKind = "service" | "diy";

/** Internal pages a card can link to. Add each new sales page route to this union. */
export type ShopPath =
  "/skill-seo-aeo-geo" | "/audit-seo" | "/tuto-shorts" | "/simulateur-roi" | "/realisations";

export type Product = {
  id: string;
  /** Short label shown above the title (handwritten style). */
  kicker: string;
  title: string;
  /** One-sentence promise. */
  promise: string;
  /** What the buyer gets, kept short. */
  includes: string[];
  status: ProductStatus;
  kind: ProductKind;
  /** Internal sales page, for available products. */
  path?: ShopPath;
  /** For services without a sales page: the button opens the contact form with this need. */
  contactNeed?: ContactNeedId;
  /** Extra links under the card (case studies, free tool…). */
  links?: { label: string; to: ShopPath; hash?: string }[];
  /** Price shown when it is not loaded from Airtable. */
  price?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "audit-seo",
    kind: "service",
    kicker: "fait pour vous",
    title:
      "Audit de votre site web pour être mieux référencé par Google et les intelligences artificielles",
    promise:
      "Gagnez des positions sur Google et dans les IA : je repère ce qui vous fait perdre des places, et je vous donne un plan d'action priorisé, expliqué en visio.",
    includes: [
      "Une note sur 100 et 7 domaines contrôlés",
      "Problèmes classés par gravité",
      "Plan d'action en 4 étapes",
      "Visio de restitution de 45 min",
    ],
    status: "disponible",
    path: "/audit-seo",
  },
  {
    id: "skill-seo-aeo-geo",
    kind: "diy",
    kicker: "à faire vous-même, dans Claude",
    title: SKILL_NAME,
    promise:
      "Claude écrit vos articles de blog pour qu'ils soient trouvés sur Google et cités par ChatGPT, et vérifie ceux déjà en ligne.",
    includes: [
      "Articles prêts à coller dans votre site",
      "Écrits avec votre voix, sans rien inventer",
      "Vérification de vos articles existants",
      "Guide PDF de 12 pages, sans abonnement",
    ],
    status: "disponible",
    path: "/skill-seo-aeo-geo",
  },
  {
    id: "tuto-shorts",
    kind: "diy",
    kicker: "skill Claude + tuto",
    title: "Un short vidéo par article, en 2 minutes",
    promise:
      "Donnez le sujet de votre article : Claude écrit le script, la voix off et l'animation d'une vidéo verticale, sans tournage ni montage.",
    includes: [
      "Skill prêt à installer",
      "Tuto pas à pas pour débutant",
      "Pour YouTube Shorts, Reels et TikTok",
    ],
    status: "disponible",
    path: "/tuto-shorts",
    price: "29 €",
  },
  {
    id: "accompagnement-automatisation",
    kind: "service",
    kicker: "accompagnement",
    title: "Automatiser une tâche de votre activité",
    promise:
      "On repère ensemble la tâche qui vous fait perdre le plus de temps, et je construis l'automatisation qui la fait à votre place.",
    includes: [
      "Saisies, relances, e-mails, tableaux de bord",
      "Avec les outils que vous utilisez déjà",
      "Sur devis, après un premier échange",
    ],
    status: "disponible",
    contactNeed: "automatisation",
    links: [
      { label: "Ce que j'ai automatisé en entreprise", to: "/realisations", hash: "en-entreprise" },
      { label: "Combien vous coûte cette tâche ? (gratuit)", to: "/simulateur-roi" },
    ],
  },
  {
    id: "accompagnement-site",
    kind: "service",
    kicker: "accompagnement",
    title: "Créer votre site web",
    promise:
      "Un site construit pour être trouvé sur Google et cité par ChatGPT dès le départ, que vous mettez à jour sans toucher au code.",
    includes: [
      "Site sur mesure, rapide sur mobile",
      "Contenu mis à jour depuis une base simple",
      "Sur devis, après un premier échange",
    ],
    status: "disponible",
    contactNeed: "site",
    links: [
      {
        label: "Le site que vous lisez, construit ainsi",
        to: "/realisations",
        hash: "projets-personnels",
      },
    ],
  },
];
