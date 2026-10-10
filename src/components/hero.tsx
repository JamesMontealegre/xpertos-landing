import { USERS_APP_URL } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

const HIGHLIGHTS = [
  "Expertos verificados por un operador humano",
  "Un solo pago a Xpertos, con tu dinero protegido",
  "Contrato digital con validez legal",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-20 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-3xl"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Piloto en Bogotá y Medellín
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Contrata expertos verificados para tu hogar u obra
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Con pago protegido y contrato digital. Tú cuentas qué necesitas;
            nosotros asignamos al experto ideal y respondemos por el servicio de
            principio a fin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={USERS_APP_URL} className="w-full sm:w-auto">
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
          <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
