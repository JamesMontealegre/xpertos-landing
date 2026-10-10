import { Container, SectionHeading } from "@/components/ui";
import {
  FileSignatureIcon,
  HeadsetIcon,
  LockIcon,
  ShieldCheckIcon,
} from "@/components/icons";

const BENEFITS = [
  {
    icon: ShieldCheckIcon,
    title: "Expertos verificados por personas",
    description:
      "Un operador humano revisa la cédula, la planilla de seguridad social y ARL, la foto y la carta de recomendación del último trabajo antes de aprobar a cada experto.",
  },
  {
    icon: LockIcon,
    title: "Tu pago, protegido",
    description:
      "Pagas una sola vez a Xpertos, nunca directamente al experto. Al experto le pagamos según el avance verificado, y respondemos por el trabajo.",
  },
  {
    icon: FileSignatureIcon,
    title: "Contrato digital con validez",
    description:
      "Cada servicio queda respaldado por un contrato firmado electrónicamente, con validez según la Ley 527 de 1999.",
  },
  {
    icon: HeadsetIcon,
    title: "Acompañamiento durante el servicio",
    description:
      "Nuestro equipo sigue el avance, resuelve si algo no sale como esperabas y verifica contigo que el trabajo quedó bien antes de cerrarlo.",
  },
];

export function WhyXpertos() {
  return (
    <section id="por-que-xpertos" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Por qué Xpertos"
          title="Confianza de principio a fin"
          description="Hacemos a mano lo que otras plataformas dejan al azar: verificar, asignar y proteger el pago."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <li
              key={benefit.title}
              className="flex gap-4 rounded-xl border border-line bg-white p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <benefit.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
