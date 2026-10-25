import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export type Occupation = { code: string; name: string };

/** Lista de respaldo (las ocupaciones de la migración) por si la base no responde. */
export const FALLBACK_OCCUPATIONS: Occupation[] = [
  { code: "maestro-obra", name: "Maestro de obra" },
  { code: "albanil", name: "Albañil" },
  { code: "enchapador", name: "Enchapador" },
  { code: "todero", name: "Todero (mantenimiento general)" },
  { code: "soldador", name: "Soldador u ornamentador" },
  { code: "plomero", name: "Plomero" },
  { code: "electricista", name: "Electricista" },
  { code: "pintor", name: "Pintor" },
  { code: "estucador", name: "Estucador o drywall" },
  { code: "carpintero", name: "Carpintero" },
  { code: "ebanista", name: "Ebanista" },
  { code: "cerrajero", name: "Cerrajero" },
  { code: "jardinero", name: "Jardinero" },
  { code: "aseo", name: "Servicios de aseo y limpieza" },
];

/** Ocupaciones activas ordenadas (se cachean por horas; si la base falla, la lista de respaldo). */
export async function getOccupations(): Promise<Occupation[]> {
  "use cache";
  cacheLife("hours");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("occupations")
      .select("code, name")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Catálogo vacío");
    return data;
  } catch (err) {
    console.error("[occupations] usando lista de respaldo:", err);
    cacheLife("minutes");
    return FALLBACK_OCCUPATIONS;
  }
}
