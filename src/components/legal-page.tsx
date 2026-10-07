import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/ui";

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16 sm:pt-32">
        <Container className="max-w-3xl">
          <p
            role="note"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <strong>Borrador.</strong> Este documento está pendiente de revisión
            legal y puede cambiar antes del lanzamiento.
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Última actualización: {updatedAt}</p>
          <div className="prose-legal mt-8 space-y-6 leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
            {children}
          </div>
          <p className="mt-12">
            <Link href="/" className="font-medium text-primary underline-offset-2 hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
