import { getServerClient } from './supabase/server';
import { CATEGORIES, categoryBySlug } from './seed-data';
import type { ProductCategory } from './types';

// Lectura de categorías. Con Supabase configurado lee de la tabla `categories`;
// si no, devuelve el contenido real de respaldo (seed-data).

export async function getCategories(): Promise<ProductCategory[]> {
  const supabase = getServerClient();
  if (!supabase) return CATEGORIES;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, nombre, descripcion, resumen, specs')
      .eq('activo', true)
      .order('orden', { ascending: true });
    if (error || !data || data.length === 0) return CATEGORIES;
    return data.map(mapRow);
  } catch {
    return CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | undefined> {
  const supabase = getServerClient();
  if (!supabase) return categoryBySlug(slug);
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, nombre, descripcion, resumen, specs')
      .eq('slug', slug)
      .eq('activo', true)
      .single();
    if (error || !data) return categoryBySlug(slug);
    return mapRow(data);
  } catch {
    return categoryBySlug(slug);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(c: any): ProductCategory {
  const specs = c.specs ?? {};
  return {
    id: c.id,
    slug: c.slug,
    nombre: c.nombre,
    resumen: c.resumen ?? '',
    descripcion: c.descripcion ?? '',
    forma: specs.forma === 'pontoon' ? 'pontoon' : 'v',
    hex: specs.hex ?? '#8A9499',
    usos: specs.usos ?? [],
  };
}
