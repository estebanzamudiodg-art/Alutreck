# Alutreck SAS · Sitio web

Sitio institucional + catálogo de Alutreck SAS (embarcaciones en aluminio naval).
Incluye presentación de la empresa, productos por categoría, preguntas frecuentes,
contacto y un formulario de **solicitud de cotización a revisión** (sin precios).
Hecho en **Next.js (App Router) + Supabase**, listo para **Vercel**.

## Arranque rápido (sin Supabase)

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Funciona de inmediato con el contenido real de respaldo
(`src/lib/seed-data.ts`).

## Conectar Supabase

1. Crea un proyecto en supabase.com.
2. En el SQL Editor ejecuta `supabase/schema.sql` y luego `supabase/seed.sql`.
3. En Project Settings → API copia la URL y la `anon public key`.
4. Copia `.env.example` a `.env.local` y pégalas.
5. Reinicia `npm run dev`. El catálogo se lee de la base y las solicitudes se guardan
   en la tabla `solicitudes`.

> Las solicitudes que envían los visitantes quedan en `solicitudes`. Por RLS, el público
> solo puede **crearlas**; leerlas requiere usuario autenticado (el admin, fase 2).


## Tu logo

1. Copia tu archivo a `public/logo.png` (o `.svg`).
2. En `src/components/Logo.tsx` cambia `USAR_IMAGEN = false` a `true`.
Mientras tanto se muestra el wordmark "ALUTRECK SAS" estilizado.

## Marca (colores y tipografía)

- Colores: bloque `:root` en `src/app/globals.css` (azul marino #0F2D52, azul acero #2E5B88, gris aluminio #B8BEC5, etc.).
- Tipografía: Montserrat, en `src/app/layout.tsx`.

## Imágenes y 360

Sube fotos a Supabase Storage. Para el giro 360, inserta frames en `category_360_frames`
(`url`, `frame_order`). Sin frames se muestra la silueta de referencia.

## Desplegar en Vercel

Push a GitHub → importar en Vercel → agregar las 2 variables de entorno → Deploy →
conectar el dominio en Settings → Domains.

## Pendiente (fase 2)

Panel admin (`/admin`) con login para cargar categorías/modelos, fotos y revisar las
solicitudes recibidas.
