import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
};

/**
 * Lista estática de respaldo (las 8 categorías del seed). Se usa si la base
 * no responde, para que la landing nunca se rompa. Los `id` son los slugs:
 * la Server Action los resuelve a uuid al recibir el formulario.
 */
export const FALLBACK_CATEGORIES: Category[] = [
  { id: "obra-civil", slug: "obra-civil", name: "Obra civil", description: "Remodelaciones, mampostería, acabados, pisos y enchapes", icon: "hammer" },
  { id: "aseo", slug: "aseo", name: "Aseo", description: "Limpieza general y profunda de hogares y oficinas", icon: "sparkles" },
  { id: "carpinteria", slug: "carpinteria", name: "Carpintería", description: "Muebles a medida, puertas, closets y reparaciones", icon: "ruler" },
  { id: "plomeria", slug: "plomeria", name: "Plomería", description: "Fugas, instalaciones hidráulicas y sanitarias", icon: "droplet" },
  { id: "electricidad", slug: "electricidad", name: "Electricidad", description: "Instalaciones, tableros, iluminación y reparaciones", icon: "zap" },
  { id: "pintura", slug: "pintura", name: "Pintura", description: "Pintura interior y exterior, estuco y acabados", icon: "paintbrush" },
  { id: "jardineria", slug: "jardineria", name: "Jardinería", description: "Mantenimiento de jardines, poda y paisajismo", icon: "leaf" },
  { id: "cerrajeria", slug: "cerrajeria", name: "Cerrajería", description: "Apertura, cambio de guardas y seguridad", icon: "key" },
];

/**
 * Categorías activas ordenadas. Con `cacheComponents` el resultado se cachea
 * ("use cache") y forma parte del shell estático; se revalida por horas.
 * Si la consulta falla, devuelve la lista de respaldo con una vida más corta
 * para reintentar pronto.
 */
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("id, slug, name, description, icon")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Catálogo vacío");
    return data;
  } catch (err) {
    console.error("[categories] usando lista de respaldo:", err);
    cacheLife("minutes");
    return FALLBACK_CATEGORIES;
  }
}
