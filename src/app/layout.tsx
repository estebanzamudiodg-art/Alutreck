import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

// Tipografías: para cambiarlas, reemplaza estas dos. Colores en globals.css.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alutreck SAS · Embarcaciones en aluminio naval',
  description:
    'Diseñamos y fabricamos embarcaciones en aluminio naval en Villavicencio, Meta. Botes para pesca, recreación, trabajo y transporte fluvial, estándar y personalizados. Envíos a toda Colombia.',
  openGraph: {
    title: 'Alutreck SAS · Embarcaciones en aluminio naval',
    description: 'Embarcaciones en aluminio naval fabricadas para durar. Soluciones náuticas a su medida.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
