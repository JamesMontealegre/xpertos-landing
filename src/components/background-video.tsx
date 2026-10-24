"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video de fondo de una sección: sin audio, en bucle y decorativo. Se descarga cuando la sección se acerca a la
 * pantalla y se pausa al salir de ella. Con "reducir movimiento" o ahorro de datos se queda en la imagen fija.
 */
export function BackgroundVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduceMotion || saveData) return;
    video.muted = true; // requisito de los navegadores para reproducir solo

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setLoad(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Recién cargado el video: si la sección sigue a la vista, arranca.
  useEffect(() => {
    if (load && inView.current) ref.current?.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      src={load ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={load ? "auto" : "none"}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
