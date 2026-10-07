import { getCategories } from "@/lib/categories";
import { Container } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { ExpertApplicationForm } from "@/components/expert-application-form";

const PERKS = [
  "Tú pones tu horario: sin turnos ni exclusividad.",
  "Recibes trabajos cerca de ti, en tu categoría.",
  "Pagos claros por etapas, verificados por nuestro equipo.",
  "Un operador humano te acompaña en cada servicio.",
];

export async function WorkWithUs() {
  const categories = await getCategories();

  return (
    <section id="trabaja-con-nosotros" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Para expertos
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Trabaja con nosotros
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Si eres maestro de obra, plomero, electricista, carpintero o
              trabajas en cualquiera de nuestras categorías, postúlate. Nosotros
              conseguimos los clientes y protegemos tu pago.
            </p>
            <ul className="mt-6 space-y-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-slate-700">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-500">
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
