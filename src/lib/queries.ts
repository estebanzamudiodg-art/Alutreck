import { getServerClient } from './supabase/server';
import { MODELS, modelBySlug } from './seed-data';
import type { BoatModel } from './types';

// Lectura de modelos. Con Supabase configurado lee de `modelos` (+ imágenes y
// frames); si no, devuelve el contenido de respaldo (seed-data).

export async function getModels(): Promise<BoatModel[]> {
  const supabase = getServerClient();
  if (!supabase) return MODELS;
  try {
    const { data, error } = await supabase
      .from('modelos')
      .select('id, slug, nombre, resumen, descripcion, specs')
      .eq('activo', true)
      .order('orden', { ascending: true });
    if (error || !data || data.length === 0) return MODELS;
    return data.map((m) => mapRow(m, [], []));
  } catch {
    return MODELS;
  }
}

export async function getModelBySlug(slug: string): Promise<BoatModel | undefined> {
  const supabase = getServerClient();
  if (!supabase) return modelBySlug(slug);
  try {
    const { data: m, error } = await supabase
      .from('modelos')
      .select('id, slug, nombre, resumen, descripcion, specs')
      .eq('slug', slug)
      .eq('activo', true)
      .single();
    if (error || !m) return modelBySlug(slug);

    const { data: imgs } = await supabase
      .from('modelo_imagenes')
      .select('url')
      .eq('modelo_id', m.id)
      .order('orden', { ascending: true });

    const { data: frames } = await supabase
      .from('modelo_360_frames')
      .select('url')
      .eq('modelo_id', m.id)
      .order('frame_order', { ascending: true });

    return mapRow(m, (imgs ?? []).map((i) => i.url), (frames ?? []).map((f) => f.url));
  } catch {
    return modelBySlug(slug);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(m: any, imagenes: string[], frames360: string[]): BoatModel {
  const specs = m.specs ?? {};
  return {
    id: m.id,
    slug: m.slug,
    nombre: m.nombre,
    resumen: m.resumen ?? '',
    descripcion: m.descripcion ?? '',
    forma: specs.forma === 'pontoon' ? 'pontoon' : 'v',
    hex: specs.hex ?? '#8A9499',
    usos: specs.usos ?? [],
    imagenes,
    frames360,
  };
}
