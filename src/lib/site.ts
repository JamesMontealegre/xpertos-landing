export const SITE_NAME = "Xpertos";
export const SITE_TITLE =
  "Xpertos — Expertos verificados para tu hogar y tu obra";
export const SITE_DESCRIPTION =
  "Contrata expertos verificados para tu hogar u obra, con pago protegido y contrato digital. Obra civil, aseo, carpintería, plomería, electricidad, pintura y más.";
export const CONTACT_EMAIL = "hola@xpertos.com.co";

export const USERS_APP_URL =
  process.env.NEXT_PUBLIC_USERS_APP_URL ?? "http://localhost:8081";

export const NAV_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#trabaja-con-nosotros", label: "Para expertos" },
  { href: "/#preguntas", label: "Preguntas" },
] as const;
