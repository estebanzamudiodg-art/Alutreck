import type { BoatModel, Faq } from './types';

// 3 modelos de Alutreck. Las descripciones son un punto de partida editable
// desde el panel admin (ajústalas con el texto definitivo de cada bote).

export const MODELS: BoatModel[] = [
  {
    id: '1', slug: 'arawana', nombre: 'Arawana', forma: 'v', hex: '#8A9499',
    resumen: 'Ágil y estable, pensada para pesca y recreación en río.',
    descripcion:
      'La Arawana es una embarcación en aluminio naval ágil y estable, ideal para pesca y recreación en ríos, lagunas y embalses. Casco diseñado para buena maniobrabilidad y un andar seguro. (Descripción de referencia: ajústala en el panel admin con el texto definitivo.)',
    usos: ['Pesca', 'Recreación', 'Navegación en río'],
    imagenes: [], frames360: [],
  },
  {
    id: '2', slug: 'semichata', nombre: 'Semichata', forma: 'v', hex: '#7A858B',
    resumen: 'Equilibrio entre capacidad de carga y navegabilidad.',
    descripcion:
      'La Semichata combina capacidad de carga con buena navegabilidad: una opción intermedia para trabajo y transporte donde se necesita mover carga sin sacrificar el desempeño. (Descripción de referencia: ajústala en el panel admin.)',
    usos: ['Trabajo', 'Transporte', 'Carga media'],
    imagenes: [], frames360: [],
  },
  {
    id: '3', slug: 'chata', nombre: 'Chata', forma: 'pontoon', hex: '#6F7B82',
    resumen: 'Fondo plano, máxima capacidad de carga y estabilidad.',
    descripcion:
      'La Chata es una embarcación de fondo plano construida para máxima capacidad de carga y estabilidad. Pensada para transporte fluvial y trabajo pesado en aguas tranquilas. (Descripción de referencia: ajústala en el panel admin.)',
    usos: ['Transporte fluvial', 'Carga pesada', 'Trabajo'],
    imagenes: [], frames360: [],
  },
];

export const DIFERENCIALES: string[] = [
  'Fabricación en aluminio naval de alta calidad',
  'Diseños robustos y funcionales',
  'Modelos estándar y personalizados',
  'Excelente resistencia a la corrosión',
  'Envíos a toda Colombia',
  'Asesoría especializada antes y después de la compra',
];

export const BENEFICIOS_ALUMINIO: string[] = [
  'Alta resistencia a la corrosión',
  'Excelente comportamiento en ambientes húmedos y salinos',
  'Menor peso que otros materiales',
  'Gran resistencia estructural',
  'Bajo mantenimiento',
  'Mayor vida útil de la embarcación',
];

export const FAQS: Faq[] = [
  { pregunta: '¿Qué es el aluminio naval?', respuesta: 'Es una aleación desarrollada para aplicaciones marítimas, caracterizada por su alta resistencia a la corrosión, durabilidad y excelente desempeño estructural.' },
  { pregunta: '¿Fabrican embarcaciones personalizadas?', respuesta: 'Sí. Podemos adaptar dimensiones, distribución, capacidad y equipamiento según las necesidades del cliente.' },
  { pregunta: '¿Realizan envíos a todo Colombia?', respuesta: 'Sí. Coordinamos el transporte de nuestras embarcaciones a cualquier región del país.' },
  { pregunta: '¿Qué capacidad de pasajeros tienen?', respuesta: 'Depende del modelo y las especificaciones de la embarcación. Nuestro equipo te asesora para elegir la opción adecuada según tus necesidades.' },
  { pregunta: '¿Puedo instalar el motor de mi preferencia?', respuesta: 'Sí. Nuestras embarcaciones pueden adaptarse para diferentes marcas y potencias de motores, según las especificaciones técnicas de cada modelo.' },
  { pregunta: '¿Qué ventajas tiene una embarcación en aluminio naval?', respuesta: 'Mayor durabilidad, menor mantenimiento, excelente resistencia a impactos y una larga vida útil.' },
  { pregunta: '¿Cómo solicito una cotización?', respuesta: 'Elige tu modelo, define las características y envía tu solicitud desde el sitio. También puedes escribirnos por WhatsApp o correo. Nuestro equipo te brindará asesoría personalizada.' },
  { pregunta: '¿Cuánto tarda la fabricación?', respuesta: 'Varía según el modelo y las especificaciones solicitadas. Cada cotización incluye un tiempo estimado de entrega.' },
];

export const CONTACTO = {
  ciudad: 'Villavicencio, Meta – Colombia',
  whatsapp: '314 578 8437',
  whatsappLink: 'https://wa.me/573145788437',
  email: 'alutreck@gmail.com',
};

export function modelBySlug(slug: string): BoatModel | undefined {
  return MODELS.find((m) => m.slug === slug);
}

// Unidades de ejemplo para "Entrega inmediata".
// En producción las gestionas desde el panel admin (tabla `unidades`).
export const UNIDADES: import('./types').UnidadDisponible[] = [
  {
    id: 'u1', modelo: 'Arawana', modeloSlug: 'arawana', titulo: 'Arawana equipada para pesca',
    estado: 'disponible', forma: 'v', hex: '#8A9499', imagenes: [],
    eslora: '7.00 m', altura_espejo: '50 cm', altura_banda: '60 cm',
    ancho_piso: '1.20 m', capacidad_carga: '6 personas', cantidad_bancas: '3',
    equipamiento: 'Lista para motor fuera de borda. Incluye bancas y casco terminado.',
  },
  {
    id: 'u2', modelo: 'Chata', modeloSlug: 'chata', titulo: 'Chata de carga 8 m',
    estado: 'disponible', forma: 'pontoon', hex: '#6F7B82', imagenes: [],
    eslora: '8.00 m', altura_espejo: '55 cm', altura_banda: '70 cm',
    ancho_piso: '2.00 m', capacidad_carga: '1.500 kg', cantidad_bancas: '2',
    equipamiento: 'Fondo plano reforzado para transporte de carga.',
  },
];

export function unidadesDisponibles(): import('./types').UnidadDisponible[] {
  return UNIDADES.filter((u) => u.estado !== 'vendida');
}
