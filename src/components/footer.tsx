import Link from "next/link";
import { cacheLife } from "next/cache";
import { SITE_NAME } from "@/lib/site";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";

/** El año se cachea por días para que el footer forme parte del shell estático. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const link =
    "rounded-md text-slate-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <footer className="border-t border-line bg-white py-10">
      <Container className="flex flex-col items-center gap-5 text-center">
        <Logo variant="full" height={112} className="h-20 w-auto sm:h-24" />
        <nav aria-label="Legal" className="text-sm">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/terminos" className={link}>
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className={link}>
                Política de privacidad
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-xs text-slate-500">
          © <CopyrightYear /> {SITE_NAME}. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
