"use server";

import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

export type ApplyFormValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  categories: string[];
  experienceYears: string;
  bio: string;
  acceptTerms: boolean;
};

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
  | { status: "success"; email: string; fullName: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Escribe tu nombre completo")
    .max(120, "Máximo 120 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Correo demasiado largo")
    .pipe(z.email("Escribe un correo válido")),
  phone: z
    .string()
    .trim()
    .min(7, "Escribe un teléfono válido")
    .max(20, "Teléfono demasiado largo")
    .regex(/^\+?[0-9\s().-]{7,20}$/, "Usa solo números, espacios o +"),
  city: z
    .string()
    .trim()
    .min(2, "Escribe tu ciudad")
    .max(80, "Máximo 80 caracteres"),
  categories: z
    .array(z.string().trim().min(1).max(80))
    .min(1, "Elige al menos una categoría")
    .max(8, "Elige máximo 8 categorías"),
  experienceYears: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce
      .number({ error: "Indica tus años de experiencia" })
      .int("Debe ser un número entero")
      .min(0, "No puede ser negativo")
      .max(60, "Máximo 60 años"),
  ),
  bio: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más (mínimo 20 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
  acceptTerms: z.literal(true, {
    error: "Debes aceptar los términos y el tratamiento de datos",
  }),
});

const GENERIC_ERROR =
  "No pudimos guardar tu postulación. Inténtalo de nuevo en unos minutos o escríbenos a hola@xpertos.co.";

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
    return { status: "success", email: values.email, fullName: values.fullName };
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
          "Ya tenemos tu postulación; regístrate en la app con este mismo correo para subir tus documentos.",
      };
    }

    const insert = await supabase.from("expert_applications").insert({
      user_id: null,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      category_ids: categoryIds,
      experience_years: data.experienceYears,
      bio: data.bio,
      status: "pending",
    });
    if (insert.error) throw insert.error;

    return { status: "success", email: data.email, fullName: data.fullName };
  } catch (err) {
    console.error("[apply] error guardando postulación:", err);
    return { status: "error", message: GENERIC_ERROR, values };
  }
}
