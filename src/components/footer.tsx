import Link from "next/link";
import { cacheLife } from "next/cache";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { Container } from "@/components/ui";

/** El año se cachea por días para que el footer forme parte del shell estático. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-white py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-primary">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-slate-600">
            Expertos verificados para tu hogar y tu obra.
          </p>
        </div>
        <nav aria-label="Legal" className="text-sm">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/terminos" className="text-slate-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="text-slate-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                Política de privacidad
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
      <Container className="mt-6">
        <p className="text-xs text-slate-500">
          © <CopyrightYear /> {SITE_NAME}. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
