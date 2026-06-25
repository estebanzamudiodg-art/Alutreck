import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

// Tipografía principal de marca: Montserrat. Para cambiarla, reemplázala aquí.
// Colores en globals.css (bloque :root).
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alutreck SAS · Embarcaciones en aluminio naval',
  description:
    'Diseñamos y fabricamos embarcaciones en aluminio naval en Villavicencio, Meta. Botes para pesca, recreación, trabajo y transporte fluvial, estándar y personalizados. Envíos a toda Colombia.',
  openGraph: {
    title: 'Alutreck SAS · Embarcaciones en aluminio naval',
    description: 'Diseñadas para navegar, construidas para durar.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
