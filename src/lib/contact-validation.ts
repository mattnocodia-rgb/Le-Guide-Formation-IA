// Contact form rules shared by the browser (instant messages) and the server (final check).

/** French phone: 10 digits starting with 0, or +33 followed by 9 digits. Spaces, dots, dashes allowed. */
export function isValidPhone(raw: string): boolean {
  const s = raw.replace(/[\s.\-()]/g, "");
  return /^0\d{9}$/.test(s) || /^\+33\d{9}$/.test(s);
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(raw.trim());
}

export type ContactErrors = Partial<Record<"prenom" | "nom" | "email" | "telephone" | "besoin" | "rgpd", string>>;

export const CONTACT_MESSAGES = {
  prenom: "Indiquez votre prénom.",
  nom: "Indiquez votre nom.",
  email: "Adresse e-mail invalide (exemple : prenom@domaine.fr).",
  telephone: "Le numéro doit comporter 10 chiffres (exemple : 06 12 34 56 78).",
  besoin: "Choisissez votre besoin.",
  rgpd: "Cochez la case pour accepter l'utilisation de vos informations.",
} as const;

export function validateContact(v: {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  besoin: string;
  rgpd: boolean;
}): ContactErrors {
  const e: ContactErrors = {};
  if (!v.prenom.trim()) e.prenom = CONTACT_MESSAGES.prenom;
  if (!v.nom.trim()) e.nom = CONTACT_MESSAGES.nom;
  if (!isValidEmail(v.email)) e.email = CONTACT_MESSAGES.email;
  if (!isValidPhone(v.telephone)) e.telephone = CONTACT_MESSAGES.telephone;
  if (!v.besoin) e.besoin = CONTACT_MESSAGES.besoin;
  if (!v.rgpd) e.rgpd = CONTACT_MESSAGES.rgpd;
  return e;
}
