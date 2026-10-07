# Xpertos — Landing

Landing pública de **Xpertos**, el marketplace para contratar servicios del hogar y obra con expertos verificados, pagos por etapas y contrato digital. Construida con Next.js 16 (App Router, Cache Components), TypeScript y Tailwind CSS 4.

## Qué incluye

- `/` — landing en español con navegación por anclas: hero, cómo funciona, servicios (categorías leídas desde Supabase), por qué Xpertos, **Trabaja con nosotros** (formulario de postulación de expertos), preguntas frecuentes y footer.
- `/terminos` y `/privacidad` — textos legales en borrador, pendientes de revisión.

El formulario de postulación se envía mediante una Server Action (`src/app/actions/apply.ts`) que valida con `zod` y escribe en `expert_applications` usando la clave *service role* de Supabase, que nunca llega al navegador. Si ya existe una postulación no rechazada con el mismo correo, no se duplica y se invita al aspirante a registrarse en la app.

Las categorías (`service_categories`) se leen con la clave anónima y se cachean con `"use cache"` (`cacheLife("hours")`). Si la base no responde, se usa una lista estática de respaldo para que la landing nunca se rompa.

## Requisitos

- Node.js 24 (`nvm use 24`).
- Backend de Xpertos corriendo en local (`xpertos-backend`, Supabase CLI) o un proyecto de Supabase con el mismo esquema.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de la API de Supabase (local: `http://127.0.0.1:55321`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima; solo se usa para leer categorías activas (RLS). |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave *service role*. **Solo servidor**: la usa la Server Action para insertar postulaciones. |
| `NEXT_PUBLIC_USERS_APP_URL` | URL de la app Users (web), destino de los CTA "Solicitar un servicio" y del flujo de postulación. |

## Cómo correr

```bash
source ~/.nvm/nvm.sh && nvm use 24
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npx tsc --noEmit   # typecheck
npm run lint       # eslint
npm run build      # build de producción
npm start          # servir el build
```

## Estructura

```
src/
  app/
    layout.tsx            # metadata SEO, fuentes, lang="es"
    page.tsx              # landing
    terminos/page.tsx
    privacidad/page.tsx
    actions/apply.ts      # Server Action: postulación de expertos
  components/             # secciones y componentes propios (Tailwind)
  lib/
    categories.ts         # lectura cacheada de categorías + lista de respaldo
    site.ts               # constantes del sitio (nombre, links, email)
    database.types.ts     # tipos generados del esquema de Supabase
    supabase/public.ts    # cliente anónimo (lecturas)
    supabase/server.ts    # cliente service role (solo servidor)
```
