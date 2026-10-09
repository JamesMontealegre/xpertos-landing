import type { Metadata } from "next";
import { Geist_Mono, Mulish } from "next/font/google";
import { Suspense } from "react";
import { NavigationLoader } from "@/components/navigation-loader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/site";
import "./globals.css";

// Mulish como fuente variable (pesos 400–900 en un solo archivo).
const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: "variable",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "expertos",
    "servicios para el hogar",
    "obra civil",
    "plomería",
    "electricidad",
    "aseo",
    "Bogotá",
    "Medellín",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${mulish.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        {/* Loader entre páginas: la X de Xpertos mientras carga la siguiente vista. */}
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
      </body>
    </html>
  );
}
