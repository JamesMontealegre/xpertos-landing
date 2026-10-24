import { getCategories } from "@/lib/categories";
import { Container } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { ExpertApplicationForm } from "@/components/expert-application-form";
import { BackgroundVideo } from "@/components/background-video";

const PERKS = [
  "Tú pones tu horario: sin turnos ni exclusividad.",
  "Recibes trabajos cerca de ti, en tu categoría.",
  "Cobramos al cliente por ti y te pagamos tu cotización, menos una comisión del 5 %.",
  "Un operador humano te acompaña en cada servicio.",
];

export async function WorkWithUs() {
  const categories = await getCategories();

  return (
    <section id="trabaja-con-nosotros" className="relative scroll-mt-20 overflow-hidden bg-brand-950 py-20 sm:py-28">
      {/* Video de un maestro de obra de fondo con el degradado de la marca; se funde con las secciones vecinas. */}
      <BackgroundVideo src="/videos/albanil.mp4" poster="/videos/albanil.jpg" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-950/95 via-brand-900/80 to-brand-700/55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Para expertos
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trabaja con nosotros
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">
              Si eres maestro de obra, plomero, electricista, carpintero o
              trabajas en cualquiera de nuestras categorías, postúlate. Nosotros
              conseguimos los clientes y protegemos tu pago.
            </p>
            <ul className="mt-6 space-y-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-white/90">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/65">
              Los expertos de Xpertos son independientes. Después de postularte,
              te pediremos tus documentos en la app para verificarte.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <ExpertApplicationForm categories={categories} />
          </div>
        </div>
      </Container>
    </section>
  );
}
