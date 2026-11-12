import { describe, expect, it } from "vitest";

import {
  CONTACT_MESSAGES,
  isValidEmail,
  isValidPhone,
  validateContact,
} from "@/lib/contact-validation";

describe("téléphone : 10 chiffres", () => {
  it("accepte 10 chiffres commençant par 0, avec ou sans espaces", () => {
    expect(isValidPhone("0612345678")).toBe(true);
    expect(isValidPhone("06 12 34 56 78")).toBe(true);
    expect(isValidPhone("+33 6 12 34 56 78")).toBe(true);
  });
  it("refuse 9 ou 11 chiffres", () => {
    expect(isValidPhone("061234567")).toBe(false);
    expect(isValidPhone("06123456789")).toBe(false);
  });
});

describe("e-mail", () => {
  it("refuse une adresse sans domaine", () => {
    expect(isValidEmail("test@test")).toBe(false);
    expect(isValidEmail("prenom@domaine.fr")).toBe(true);
  });
});
const base = {
  prenom: "Jeanne",
  nom: "Martin",
  email: "jeanne@exemple.fr",
  telephone: "06 12 34 56 78",
  rgpd: true,
};

describe("validateContact, message", () => {
  it("requires the message for a website request", () => {
    expect(validateContact({ ...base, besoin: "site", message: "  " }).message).toBe(
      CONTACT_MESSAGES.message,
    );
    expect(validateContact({ ...base, besoin: "site", message: "Plâtrerie X, Rezé" })).toEqual({});
  });
  it("keeps the message optional for the other needs", () => {
    expect(validateContact({ ...base, besoin: "audit", message: "" })).toEqual({});
  });
});
