import { getCategories } from "@/lib/categories";
import { USERS_APP_URL } from "@/lib/site";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { CategoryIcon } from "@/components/icons";

export async function Services() {
  const categories = await getCategories();

  return (
    <section id="servicios" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Servicios"
          title="¿Qué necesitas resolver?"
          description="Estas son las categorías disponibles en el piloto. Todos los expertos pasan por la misma verificación."
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
          <ButtonLink href={USERS_APP_URL}>Solicitar un servicio</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
