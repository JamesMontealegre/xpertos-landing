import Link from "next/link";
import { NAV_LINKS, SITE_NAME, USERS_APP_URL } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`${SITE_NAME}, inicio`}
        >
          <Logo variant="horizontal" height={44} priority className="h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <ButtonLink href={USERS_APP_URL} className="px-4 py-2">
            Solicitar un servicio
          </ButtonLink>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
