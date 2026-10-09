"use server";

import { randomInt } from "node:crypto";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import {
  acceptTermsError,
  bioError,
  categoriesError,
  cityError,
  emailError,
  experienceYearsError,
  fullNameError,
  normalizePhone,
  phoneError,
  type ApplyValues,
} from "@/lib/validation";

export type ApplyFormValues = ApplyValues;

export type ApplyFieldErrors = Partial<Record<keyof ApplyFormValues, string[]>>;

export type ApplyState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: ApplyFieldErrors;
      values: ApplyFormValues;
    }
  | { status: "duplicate"; message: string; email: string }
  | { status: "success"; email: string; fullName: string; accountCreated: boolean };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Convierte una validación de src/lib/validation.ts en una regla de zod. */
const checked = (check: (value: string) => string | null) =>
  z.string().superRefine((value, ctx) => {
    const message = check(value);
    if (message) ctx.addIssue({ code: "custom", message });
  });

// Mismas reglas que el formulario en el navegador y que el registro de la app.
const schema = z.object({
  fullName: checked(fullNameError).transform((v) => v.trim().replace(/\s+/g, " ")),
  email: checked(emailError).transform((v) => v.trim().toLowerCase()),
  phone: checked(phoneError).transform(normalizePhone),
  city: checked(cityError).transform((v) => v.trim()),
  categories: z.array(z.string().trim().min(1).max(80)).superRefine((value, ctx) => {
    const message = categoriesError(value);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
  experienceYears: checked(experienceYearsError).transform(Number),
  bio: checked(bioError).transform((v) => v.trim()),
  acceptTerms: z.literal(true, { error: acceptTermsError(false) ?? undefined }),
});

const GENERIC_ERROR =
  "No pudimos guardar tu postulación. Inténtalo de nuevo en unos minutos o escríbenos a hola@xpertos.com.co.";

function readValues(formData: FormData): ApplyFormValues {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    city: str("city"),
    categories: formData
      .getAll("categories")
      .filter((v): v is string => typeof v === "string"),
    experienceYears: str("experienceYears"),
    bio: str("bio"),
    acceptTerms: formData.get("acceptTerms") === "on",
  };
}

// Sin caracteres que se confunden al leerlos (0/O, 1/l/I).
const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

/** Clave temporal para el primer ingreso a la app (luego la app pide crear una propia). */
function temporaryPassword(length = 10) {
  let out = "";
  for (let i = 0; i < length; i++) out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  return out;
}

/** Escapa comodines de ILIKE para comparar el correo literalmente. */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

export async function submitExpertApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const values = readValues(formData);

  // Honeypot: los bots suelen llenar todos los campos. Respondemos como si
  // todo hubiera salido bien, sin guardar nada.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", email: values.email, fullName: values.fullName, accountCreated: true };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: fieldErrors as ApplyFieldErrors,
      values,
    };
  }

  const data = parsed.data;

  try {
    const supabase = createServiceClient();

    // Resolver categorías: normalmente llegan uuids; si la landing usó la
    // lista de respaldo llegan slugs y los convertimos aquí.
    const uuids = data.categories.filter((c) => UUID_RE.test(c));
    const slugs = data.categories.filter((c) => !UUID_RE.test(c));
    const lookup = await supabase
      .from("service_categories")
      .select("id, slug")
      .eq("active", true)
      .or(
        [
          uuids.length ? `id.in.(${uuids.join(",")})` : null,
          slugs.length ? `slug.in.(${slugs.join(",")})` : null,
        ]
          .filter(Boolean)
          .join(","),
      );
    if (lookup.error) throw lookup.error;
    const categoryIds = Array.from(new Set((lookup.data ?? []).map((c) => c.id)));
    if (categoryIds.length === 0) {
      return {
        status: "error",
        message: "Revisa los campos marcados.",
        fieldErrors: {
          categories: ["Las categorías elegidas ya no están disponibles. Recarga la página."],
        },
        values,
      };
    }

    // Duplicados: misma dirección (sin distinguir mayúsculas) y no rechazada.
    const existing = await supabase
      .from("expert_applications")
      .select("id, status")
      .ilike("email", escapeLike(data.email))
      .neq("status", "rejected")
      .limit(1)
      .maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data) {
      return {
        status: "duplicate",
        email: data.email,
        message:
          "Ya tenemos tu postulación con este correo. Entra a la app con el acceso que te enviamos por correo para subir tus documentos.",
      };
    }

    // ¿El correo ya tiene cuenta en Xpertos? Solo una cuenta de cliente sin servicios puede postularse
    // (una cuenta es cliente O experto, nunca ambas).
    const account = await supabase
      .from("profiles")
      .select("id, role")
      .ilike("email", escapeLike(data.email))
      .limit(1)
      .maybeSingle();
    if (account.error) throw account.error;

    let userId: string;
    let tempPassword: string | null = null;
    if (account.data) {
      if (account.data.role !== "client") {
        return {
          status: "duplicate",
          email: data.email,
          message:
            account.data.role === "expert"
              ? "Este correo ya pertenece a un experto de Xpertos. Entra a la app con tu cuenta."
              : "Este correo ya tiene una cuenta en Xpertos que no puede postularse. Usa otro correo.",
        };
      }
      const services = await supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .eq("client_id", account.data.id);
      if (services.error) throw services.error;
      if ((services.count ?? 0) > 0) {
        return {
          status: "duplicate",
          email: data.email,
          message:
            "Este correo ya tiene una cuenta de cliente con servicios en Xpertos. Para postularte como experto usa otro correo.",
        };
      }
      userId = account.data.id;
    } else {
      // Cuenta nueva con clave temporal: llega por correo y la app pide cambiarla al entrar.
      tempPassword = temporaryPassword();
      const created = await supabase.auth.admin.createUser({
        email: data.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName,
          phone: data.phone,
          city: data.city,
          must_change_password: true,
        },
      });
      if (created.error || !created.data.user) throw created.error ?? new Error("No se creó la cuenta");
      userId = created.data.user.id;
    }

    // Guarda la postulación; la base envía el correo (con el acceso si la cuenta es nueva).
    const insert = await supabase.rpc("submit_landing_application", {
      p_user_id: userId,
      p_full_name: data.fullName,
      p_email: data.email,
      p_phone: data.phone,
      p_city: data.city,
      p_category_ids: categoryIds,
      p_experience_years: data.experienceYears,
      p_bio: data.bio,
      p_temp_password: tempPassword ?? undefined,
    });
    if (insert.error) {
      if (tempPassword) await supabase.auth.admin.deleteUser(userId);
      throw insert.error;
    }

    return { status: "success", email: data.email, fullName: data.fullName, accountCreated: tempPassword !== null };
  } catch (err) {
    console.error("[apply] error guardando postulación:", err);
    return { status: "error", message: GENERIC_ERROR, values };
  }
}
