import { Container, SectionHeading } from "@/components/ui";

const STEPS = [
  {
    title: "Cuéntanos qué necesitas",
    description:
      "Describe el trabajo, sube fotos y dinos cuándo estás disponible. En minutos, desde la app.",
  },
  {
    title: "Asignamos al experto y te cotizamos",
    description:
      "Un operador de Xpertos elige al experto verificado adecuado, que revisa el trabajo y cotiza. Tú eliges: solo mano de obra o todo incluido, con los materiales por nuestra cuenta.",
  },
  {
    title: "Pagas una vez y firmas en línea",
    description:
      "Pagas el total a Xpertos, firmas el contrato desde la app o tu correo y la obra inicia en la fecha acordada. Al terminar, verificamos contigo que todo quedó bien.",
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
