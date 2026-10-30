/**
 * Validaciones del formulario "Trabaja con nosotros". Son las mismas reglas del registro de la app
 * (xpertos-users/src/lib/validation.ts) y se usan en el navegador (errores en vivo) y en el servidor.
 * Cada función devuelve el mensaje de error o null.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Letras (con tildes y ñ), apóstrofo, punto y guion.
const NAME_PART = /^[\p{L}][\p{L}'.-]*$/u;

export function fullNameError(value: string): string | null {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Escribe tu nombre completo.";
  if (value.trim().length > 120) return "Máximo 120 caracteres.";
  if (!parts.every((p) => NAME_PART.test(p))) return "El nombre solo puede tener letras.";
  if (parts.length < 2 || parts.some((p) => p.length < 2)) return "Escribe tu nombre y tu apellido.";
  return null;
}

export function emailError(value: string): string | null {
  const email = value.trim();
  if (!email) return "Escribe tu correo electrónico.";
  if (email.length > 254 || !EMAIL.test(email)) return "El correo no es válido. Ejemplo: nombre@correo.com";
  return null;
}

/**
 * Teléfono colombiano de 10 dígitos: celular (empieza por 3) o fijo (empieza por 60). Acepta el
 * indicativo +57 y espacios o guiones, que se quitan al guardar.
 */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("57") ? digits.slice(2) : digits;
}

export function phoneError(value: string): string | null {
  if (!value.trim()) return "Escribe tu número de celular.";
  const phone = normalizePhone(value);
  if (phone.length !== 10) return "El número debe tener 10 dígitos. Ejemplo: 300 123 4567";
  if (!/^(3|60)/.test(phone)) return "Escribe un celular (empieza por 3) o un fijo (empieza por 60).";
  return null;
}

/** Solo deja los caracteres que puede tener un teléfono mientras se escribe. */
export function cleanPhoneInput(value: string): string {
  return value.replace(/[^\d\s+-]/g, "");
}

/** Departamento y municipio: códigos DIVIPOLA del DANE (2 y 5 dígitos; el municipio empieza por su departamento). */
export function departmentError(value: string): string | null {
  return /^\d{2}$/.test(value) ? null : "Elige tu departamento.";
}

export function municipalityError(value: string, department: string): string | null {
  if (!department) return "Primero elige tu departamento.";
  if (!/^\d{5}$/.test(value) || !value.startsWith(department)) return "Elige tu municipio.";
  return null;
}

/** Una o varias ocupaciones (códigos del catálogo). */
export function occupationError(value: string[]): string | null {
  if (value.length === 0) return "Elige al menos una ocupación.";
  if (value.length > 15 || !value.every((code) => /^[a-z0-9-]{2,40}$/.test(code))) return "Elige tus ocupaciones de la lista.";
  return null;
}

export function acceptTermsError(value: boolean): string | null {
  return value ? null : "Debes aceptar los términos y el tratamiento de datos.";
}

export type ApplyValues = {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  /** Códigos de las ocupaciones elegidas (una o varias). */
  occupation: string[];
  acceptTerms: boolean;
};

export type ApplyField = keyof ApplyValues;

/** Error de un campo del formulario (o null si está bien). */
export function applyFieldError(field: ApplyField, values: ApplyValues): string | null {
  switch (field) {
    case "fullName":
      return fullNameError(values.fullName);
    case "email":
      return emailError(values.email);
    case "phone":
      return phoneError(values.phone);
    case "department":
      return departmentError(values.department);
    case "municipality":
      return municipalityError(values.municipality, values.department);
    case "occupation":
      return occupationError(values.occupation);
    case "acceptTerms":
      return acceptTermsError(values.acceptTerms);
  }
}

export const APPLY_FIELDS: ApplyField[] = ["fullName", "phone", "email", "department", "municipality", "occupation", "acceptTerms"];
