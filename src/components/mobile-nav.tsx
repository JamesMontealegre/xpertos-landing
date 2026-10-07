"use client";

import { useId, useState } from "react";
import { NAV_LINKS, USERS_APP_URL } from "@/lib/site";
import { ButtonLink } from "@/components/ui";
import { CloseIcon, MenuIcon } from "@/components/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-16 border-b border-line bg-white px-4 pb-6 pt-2 shadow-lg"
        >
          <nav aria-label="Principal (móvil)">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink href={USERS_APP_URL} className="mt-3 w-full">
            Solicitar un servicio
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
