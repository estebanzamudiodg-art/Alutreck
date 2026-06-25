// Tipos del sitio Alutreck. Sin precios: la cotización se resuelve por solicitud.

export interface ProductCategory {
  id: string;
  slug: string;
  nombre: string;
  resumen: string;          // descripción corta (card)
  descripcion: string;      // descripción larga (detalle)
  forma: 'v' | 'pontoon';   // silueta placeholder
  hex: string;              // tono de casco del render
  usos: string[];           // viñetas de uso típico
  frames360?: string[];     // urls de los frames del giro (si existen)
}

export interface Faq {
  pregunta: string;
  respuesta: string;
}
