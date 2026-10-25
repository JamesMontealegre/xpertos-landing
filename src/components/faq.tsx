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
      "Cuando el experto cotiza, Xpertos te presenta dos opciones: solo mano de obra o todo incluido, con los materiales por nuestra cuenta. Al elegir recibes tu plan de pagos: de contado o, según el valor y la duración de la obra, con un anticipo del 30 % y cuotas durante el trabajo. Pagas a Xpertos por transferencia o en línea desde la app; nunca le adelantas dinero directamente al experto.",
  },
  {
    question: "¿Qué pasa si algo sale mal?",
    answer:
      "Xpertos responde por el servicio de principio a fin: tu contrato es con nosotros. Si hay un problema, lo resolvemos con el experto o reasignamos el servicio. Antes de dar el trabajo por terminado verificamos contigo que todo quedó bien, y respondemos por él durante 30 días. Todo queda respaldado por el contrato digital.",
  },
  {
    question: "¿Los expertos son empleados de Xpertos?",
    answer:
      "No. Los expertos son profesionales independientes de la red de Xpertos. Validamos su identidad y documentos, les asignamos los servicios y tu pago va a Xpertos, que responde por el trabajo.",
  },
  {
    question: "¿En qué ciudades operan?",
    answer:
      "Operamos en toda Colombia. Cuéntanos en tu solicitud dónde es el trabajo y te asignamos un experto verificado de tu zona; si aún no tenemos uno disponible cerca, te avisamos.",
  },
];

export function Faq() {
  return (
    <section id="preguntas" className="bg-white py-16 sm:py-24">
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
