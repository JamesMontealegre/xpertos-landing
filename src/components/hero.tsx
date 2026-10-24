import { USERS_APP_URL } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { BackgroundVideo } from "@/components/background-video";

const HIGHLIGHTS = [
  "Expertos verificados por un operador humano",
  "Plan de pagos a tu medida, con tu dinero protegido",
  "Contrato digital con validez legal",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950 pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Video de obra de fondo con el degradado de la marca; abajo se funde con el fondo de la página. */}
      <BackgroundVideo src="/videos/obra.mp4" poster="/videos/obra.jpg" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand-950/90 via-brand-900/75 to-brand-600/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-surface"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Una nueva manera de trabajar
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Contrata expertos verificados para tu hogar u obra
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl">
            Xpertos es una red de profesionales verificados en toda Colombia,
            listos para tus obras civiles y trabajos del hogar, a pequeña o gran
            escala. Tú nos cuentas qué necesitas y nosotros nos ocupamos del
            resto: soluciones a tu medida y acompañamiento de principio a fin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={USERS_APP_URL} variant="accent" className="w-full sm:w-auto">
              Solicitar un servicio
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="#trabaja-con-nosotros"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Trabaja con nosotros
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
