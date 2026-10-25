import { getCategories } from "@/lib/categories";
import { REQUEST_SERVICE_URL } from "@/lib/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { CategoryIcon } from "@/components/icons";
import { BackgroundVideo } from "@/components/background-video";

export async function Services() {
  const categories = await getCategories();

  return (
    <section id="servicios" className="relative overflow-hidden bg-white py-16 sm:py-24">
      {/* Video de planos y casco de fondo bajo un velo blanco que se funde arriba y abajo con las secciones vecinas. */}
      <BackgroundVideo src="/videos/casco.mp4" poster="/videos/casco.jpg" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-slate-200/60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white to-transparent"
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Servicios"
          title="¿Qué necesitas resolver?"
          description="Estas son las categorías en las que trabajamos. Todos los expertos pasan por la misma verificación."
        />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="group rounded-xl border border-line bg-surface p-6 transition-colors hover:border-primary"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                <CategoryIcon icon={category.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{category.name}</h3>
              {category.description ? (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {category.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href={REQUEST_SERVICE_URL}>Solicitar un servicio</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
