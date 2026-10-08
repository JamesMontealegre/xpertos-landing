import { Container, SectionHeading } from "@/components/ui";

const FAQS = [
  {
    question: "¿Cómo se verifica a los expertos?",
    answer:
      "Cada aspirante llena una postulación y sube su cédula por ambos lados, planilla de seguridad social y ARL, una foto 3x4 con fondo blanco y una carta de recomendación de su último trabajo. Un operador de Xpertos revisa los documentos antes de aprobarlo. Solo los expertos aprobados reciben servicios.",
  },
  {
    question: "¿Cómo pago?",
    answer:
      "El precio se acuerda por etapas (por ejemplo, un anticipo y una entrega). Pagas cada etapa a través de Xpertos y subes tu comprobante; nuestro equipo lo verifica antes de que la etapa quede como pagada. Nunca tienes que adelantar dinero directamente al experto.",
  },
  {
    question: "¿Qué pasa si algo sale mal?",
    answer:
      "Xpertos acompaña el servicio de principio a fin. Si hay un problema, media entre las partes, puede reasignar el servicio y el pago por etapas evita que pierdas el dinero de trabajo no realizado. Todo queda respaldado por el contrato digital.",
  },
  {
    question: "¿Los expertos son empleados de Xpertos?",
    answer:
      "No. Los expertos son profesionales independientes. Xpertos intermedia entre tú y el experto, valida su identidad y documentos, y protege el pago por etapas.",
  },
  {
    question: "¿En qué ciudades operan?",
    answer:
      "Estamos en piloto en Bogotá y Medellín. Si estás en otra ciudad, déjanos tu solicitud y te avisaremos cuando lleguemos.",
  },
];

export function Faq() {
  return (
    <section id="preguntas" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Resolvemos tus dudas"
        />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line rounded-xl border border-line bg-surface">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-white text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
