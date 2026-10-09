"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { USERS_APP_URL } from "@/lib/site";

/** Espera antes de mostrarse, para que una navegación instantánea no parpadee. */
const SHOW_DELAY_MS = 80;
/** Si algo sale mal, el loader se oculta solo. */
const MAX_VISIBLE_MS = 15_000;

type Pending = { from: string; shown: boolean };

const locationKey = () => window.location.pathname + window.location.search;

/** Orígenes de Xpertos a los que también se muestra el loader (la app de usuarios). */
function isXpertosOrigin(url: URL) {
  try {
    if (url.origin === new URL(USERS_APP_URL).origin) return true;
  } catch {
    // USERS_APP_URL mal formada: solo se usa el dominio.
  }
  return url.hostname === "xpertos.com.co" || url.hostname.endsWith(".xpertos.com.co");
}

/**
 * Interceptor de navegación (el mismo del panel y de la app): muestra la X de Xpertos al seguir un
 * enlace interno o a la app de Xpertos, hasta que carga la siguiente página. Un enlace puede excluirse
 * con `data-no-loader`.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const current = pathname + (query ? `?${query}` : "");
  const [pending, setPending] = useState<Pending | null>(null);

  useEffect(() => {
    const timers: number[] = [];
    const start = () => {
      const from = locationKey();
      timers.splice(0).forEach((t) => window.clearTimeout(t));
      setPending({ from, shown: false });
      timers.push(
        window.setTimeout(() => setPending((p) => (p && p.from === from ? { ...p, shown: true } : p)), SHOW_DELAY_MS),
        window.setTimeout(() => setPending((p) => (p && p.from === from ? null : p)), MAX_VISIBLE_MS),
      );
    };

    // Fase de captura: corre antes que el onClick de <Link>, que cancela la navegación del navegador.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href || anchor.hasAttribute("download") || "noLoader" in anchor.dataset) return;
      if (anchor.target && anchor.target !== "_self") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return; // mailto:, tel:
      if (url.origin !== window.location.origin) {
        if (isXpertosOrigin(url)) start(); // p. ej. "Solicitar un servicio" → app.xpertos.com.co
        return;
      }
      if (url.pathname + url.search === locationKey()) return; // mismo destino o solo un #ancla
      start();
    };

    // Al volver con "atrás" el navegador puede restaurar la página tal cual: se oculta el loader.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setPending(null);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Visible mientras siga en la página de origen; al llegar a la nueva ruta se oculta solo.
  const visible = pending !== null && pending.shown && pending.from === current;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-surface/60 backdrop-blur-[2px] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
        <div className="relative size-20">
          <span className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary border-r-accent animate-spin motion-reduce:animate-none" />
          <Image
            src="/brand/xpertos-icon.svg"
            alt=""
            width={44}
            height={44}
            unoptimized
            priority
            className="xp-beat absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px]"
          />
        </div>
        <span className="text-sm font-medium text-slate-600">{visible ? "Cargando…" : ""}</span>
      </div>
    </div>
  );
}
