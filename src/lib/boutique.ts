// Client-safe product catalogue for the /boutique page.
// Add a product here to list it in the shop; set `status: "bientot"` while it is being built.

export type ProductStatus = "disponible" | "bientot";

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
  /** Internal sales page, for available products. Add each new sales page route to this union. */
  path?: "/skill-seo-aeo-geo" | "/simulateur-roi";
  /** Price shown when it is not loaded from Airtable. */
  price?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "skill-seo-aeo-geo",
    kicker: "skill Claude",
    title: "Le skill SEO, AEO et GEO",
    promise:
      "Auditer et écrire du contenu pour être trouvé par Google, compris et cité par les IA.",
    includes: [
      "32 contrôles numérotés",
      "Audit du site entier",
      "Mode rédaction",
      "Guide PDF de 12 pages",
    ],
    status: "disponible",
    path: "/skill-seo-aeo-geo",
  },
  {
    id: "simulateur-roi",
    kicker: "outil gratuit",
    title: "Simulateur ROI de l'automatisation",
    promise:
      "Estimez en une minute ce qu'une tâche manuelle vous coûte par an et quand son automatisation devient rentable.",
    includes: ["Coût manuel annuel", "Délai de rentabilité", "Gain sur 5 ans"],
    status: "disponible",
    path: "/simulateur-roi",
    price: "Gratuit",
  },
  {
    id: "tuto-clients-proximite",
    kicker: "tuto Claude + Apify",
    title: "Trouver 50 clients potentiels près de chez vous",
    promise:
      "Une liste d'entreprises qualifiées de votre secteur et de votre ville, sans y passer la journée.",
    includes: ["Skill prêt à installer", "Pas-à-pas avec captures", "Coût réel annoncé"],
    status: "bientot",
  },
  {
    id: "installation-visio",
    kicker: "accompagnement",
    title: "Je l'installe avec vous",
    promise: "Une heure en visio : vous repartez avec vos premières recettes Claude qui tournent.",
    includes: [
      "Choix des recettes selon votre métier",
      "Installation sur votre compte",
      "Sans code",
    ],
    status: "bientot",
  },
];
