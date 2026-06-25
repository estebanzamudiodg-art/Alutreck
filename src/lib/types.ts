// Tipos del sitio Alutreck. 3 modelos. Sin precios: cotización por solicitud.

export interface BoatModel {
  id: string;
  slug: string;
  nombre: string;
  resumen: string;          // descripción corta (card)
  descripcion: string;      // descripción larga (detalle)
  forma: 'v' | 'pontoon';   // silueta placeholder mientras no hay foto
  hex: string;              // tono del render
  usos: string[];
  imagenes: string[];       // urls de la galería (Supabase Storage)
  frames360: string[];      // urls de los frames del giro (spin real)
}

// Características que el cliente define al cotizar.
export interface Caracteristicas {
  eslora: string;           // longitud total
  altura_espejo: string;
  altura_banda: string;
  ancho_piso: string;
  capacidad_carga: string;
  cantidad_bancas: string;
}

export interface Faq {
  pregunta: string;
  respuesta: string;
}

// Unidad ya construida, lista para entrega inmediata. Ficha fija.
export interface UnidadDisponible {
  id: string;
  modelo: string;            // nombre del modelo (Arawana, Semichata, Chata)
  modeloSlug?: string;
  titulo?: string;           // título corto opcional
  estado: 'disponible' | 'reservada' | 'vendida';
  forma: 'v' | 'pontoon';
  hex: string;
  imagenes: string[];
  // ficha técnica fija de esta unidad
  eslora: string;
  altura_espejo: string;
  altura_banda: string;
  ancho_piso: string;
  capacidad_carga: string;
  cantidad_bancas: string;
  equipamiento?: string;     // texto libre opcional
}
