import type { ProductCategory, Faq } from './types';

// Contenido real de Alutreck SAS (del documento de la empresa).
// Sirve de respaldo cuando aún no hay Supabase conectado.

export const CATEGORIES: ProductCategory[] = [
  {
    id: '1', slug: 'botes-de-pesca', nombre: 'Botes de pesca', forma: 'v', hex: '#8A9499',
    resumen: 'Estabilidad, comodidad y seguridad para largas jornadas de pesca recreativa o deportiva.',
    descripcion:
      'Embarcaciones en aluminio naval diseñadas para la pesca recreativa y deportiva. Buscan estabilidad en el agua, espacio de trabajo a bordo y una navegación segura durante jornadas extensas en ríos, lagunas y embalses.',
    usos: ['Pesca recreativa', 'Pesca deportiva', 'Salidas de jornada completa'],
  },
  {
    id: '2', slug: 'embarcaciones-recreativas', nombre: 'Embarcaciones recreativas', forma: 'v', hex: '#7E8A90',
    resumen: 'Ideales para paseos familiares, turismo y actividades de entretenimiento en el agua.',
    descripcion:
      'Pensadas para el disfrute: paseos en familia, turismo y actividades de entretenimiento. Combinan la durabilidad del aluminio naval con una distribución cómoda para acompañantes.',
    usos: ['Paseos familiares', 'Turismo', 'Recreación'],
  },
  {
    id: '3', slug: 'embarcaciones-de-trabajo', nombre: 'Embarcaciones para trabajo', forma: 'v', hex: '#6F7B82',
    resumen: 'Modelos robustos, reforzados y funcionales para operaciones comerciales e institucionales.',
    descripcion:
      'Construcción reforzada para operación comercial, institucional y de transporte. Priorizan resistencia estructural, bajo mantenimiento y funcionalidad en condiciones de uso exigente.',
    usos: ['Operación comercial', 'Uso institucional', 'Transporte de carga'],
  },
  {
    id: '4', slug: 'transporte-fluvial', nombre: 'Transporte fluvial', forma: 'pontoon', hex: '#7A858B',
    resumen: 'Diseñadas para movilizar personas y carga con seguridad y eficiencia.',
    descripcion:
      'Embarcaciones orientadas a movilizar pasajeros y carga por vías fluviales, con foco en seguridad, capacidad y eficiencia en el desplazamiento.',
    usos: ['Transporte de pasajeros', 'Movilización de carga', 'Conexión fluvial'],
  },
  {
    id: '5', slug: 'disenos-personalizados', nombre: 'Diseños personalizados', forma: 'v', hex: '#8A9499',
    resumen: 'Proyectos especiales adaptados a los requerimientos específicos de cada cliente.',
    descripcion:
      'Desarrollamos proyectos a la medida: adaptamos dimensiones, distribución, capacidad y equipamiento según lo que necesitas. Cuéntanos el uso previsto y nuestro equipo propone la embarcación adecuada.',
    usos: ['Dimensiones a medida', 'Distribución personalizada', 'Equipamiento específico'],
  },
  {
    id: '6', slug: 'accesorios-equipamiento', nombre: 'Accesorios y equipamiento', forma: 'v', hex: '#94A0A6',
    resumen: 'Opciones de personalización y equipamiento para mejorar funcionalidad y comodidad.',
    descripcion:
      'Complementos y equipamiento para tu embarcación: opciones de personalización que mejoran la funcionalidad, la comodidad y el rendimiento de cada bote.',
    usos: ['Personalización', 'Equipamiento a bordo', 'Mejoras de comodidad'],
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
  { pregunta: '¿Cómo solicito una cotización?', respuesta: 'Puedes contactarnos por WhatsApp, llamada telefónica o correo electrónico, o enviar tu solicitud desde este sitio. Nuestro equipo te brindará asesoría personalizada.' },
  { pregunta: '¿Cuánto tarda la fabricación?', respuesta: 'Varía según el modelo y las especificaciones solicitadas. Cada cotización incluye un tiempo estimado de entrega.' },
];

export const CONTACTO = {
  ciudad: 'Villavicencio, Meta – Colombia',
  whatsapp: '314 578 8437',
  whatsappLink: 'https://wa.me/573145788437',
  email: 'alutreck@gmail.com',
};

export function categoryBySlug(slug: string): ProductCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
