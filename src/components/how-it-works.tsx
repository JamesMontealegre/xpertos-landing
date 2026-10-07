import { Container, SectionHeading } from "@/components/ui";

const STEPS = [
  {
    title: "Cuéntanos qué necesitas",
    description:
      "Describe el trabajo, sube fotos y dinos cuándo estás disponible. En minutos, desde la app.",
  },
  {
    title: "Asignamos al experto ideal",
    description:
      "Un operador de Xpertos revisa tu solicitud, elige al experto verificado adecuado y acuerdan contigo el precio por etapas.",
  },
  {
    title: "Pagas por etapas y firmas en línea",
    description:
      "Pagas cada etapa a través de Xpertos y firmas un contrato digital. Al terminar, calificas el servicio.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Cómo funciona"
          title="Tres pasos para resolver tu hogar u obra"
          description="Sin buscar por tu cuenta ni adelantar dinero a desconocidos."
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-xl border border-line bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
