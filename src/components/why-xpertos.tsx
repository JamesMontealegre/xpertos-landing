import { Container, SectionHeading } from "@/components/ui";
import { BackgroundVideo } from "@/components/background-video";
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
      "Pagas a Xpertos, nunca directamente al experto: de contado o con un plan de pagos durante la obra. Al experto le pagamos según el avance verificado, y respondemos por el trabajo.",
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
    <section id="por-que-xpertos" className="relative overflow-hidden py-16 sm:py-24">
      {/* Video del equipo revisando una obra, bajo un velo claro que se funde con las secciones vecinas. */}
      <BackgroundVideo src="/videos/equipo.mp4" poster="/videos/equipo.jpg" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-slate-300/55" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-surface to-transparent"
      />
      <Container className="relative">
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
