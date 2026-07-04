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

    // portada de cada modelo = su primera imagen
    const ids = data.map((d: any) => d.id);
    const { data: imgs } = await supabase
      .from('modelo_imagenes')
      .select('modelo_id, url, orden')
      .in('modelo_id', ids)
      .order('orden', { ascending: true });
    const cover: Record<string, string> = {};
    (imgs ?? []).forEach((im: any) => { if (cover[im.modelo_id] === undefined) cover[im.modelo_id] = im.url; });

    return data.map((m: any) => mapRow(m, cover[m.id] ? [cover[m.id]] : [], []));
  } catch {
    return MODELS;
  }
}

/** Lee un valor de configuración del sitio (tabla config). */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = getServerClient();
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('config').select('value').eq('key', key).single();
    return data?.value ?? null;
  } catch {
    return null;
  }
}

/** Lee varios valores de config en una sola consulta. */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const supabase = getServerClient();
  if (!supabase) return {};
  try {
    const { data } = await supabase.from('config').select('key, value').in('key', keys);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: any) => { if (r.value) map[r.key] = r.value; });
    return map;
  } catch {
    return {};
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

    const [imgsRes, framesRes, videosRes] = await Promise.all([
      supabase.from('modelo_imagenes').select('url').eq('modelo_id', m.id).order('orden', { ascending: true }),
      supabase.from('modelo_360_frames').select('url').eq('modelo_id', m.id).order('frame_order', { ascending: true }),
      supabase.from('modelo_videos').select('url').eq('modelo_id', m.id).order('orden', { ascending: true }),
    ]);
    const imgs = imgsRes.data, frames = framesRes.data, videos = videosRes.data;

    return mapRow(
      m,
      (imgs ?? []).map((i) => i.url),
      (frames ?? []).map((f) => f.url),
      (videos ?? []).map((v) => v.url),
    );
  } catch {
    return modelBySlug(slug);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(m: any, imagenes: string[], frames360: string[], videos: string[] = []): BoatModel {
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
    videos,
    frames360,
  };
}

import { unidadesDisponibles } from './seed-data';
import type { UnidadDisponible } from './types';

export async function getUnidadesDisponibles(): Promise<UnidadDisponible[]> {
  const supabase = getServerClient();
  if (!supabase) return unidadesDisponibles();
  try {
    const { data, error } = await supabase
      .from('unidades')
      .select('id, modelo, modelo_slug, titulo, estado, specs, eslora, altura_espejo, altura_banda, ancho_piso, capacidad_carga, cantidad_bancas, equipamiento')
      .neq('estado', 'vendida')
      .order('orden', { ascending: true });
    if (error || !data || data.length === 0) return unidadesDisponibles();

    // portada de cada unidad = su primera imagen
    const ids = data.map((u: any) => u.id);
    const { data: imgs } = await supabase
      .from('unidad_imagenes')
      .select('unidad_id, url, orden')
      .in('unidad_id', ids)
      .order('orden', { ascending: true });
    const cover: Record<string, string> = {};
    (imgs ?? []).forEach((im: any) => { if (cover[im.unidad_id] === undefined) cover[im.unidad_id] = im.url; });

    return data.map((u: any) => ({
      id: u.id,
      modelo: u.modelo ?? '',
      modeloSlug: u.modelo_slug ?? undefined,
      titulo: u.titulo ?? undefined,
      estado: u.estado ?? 'disponible',
      forma: (u.specs?.forma === 'pontoon' ? 'pontoon' : 'v'),
      hex: u.specs?.hex ?? '#8A9499',
      imagenes: cover[u.id] ? [cover[u.id]] : [],
      eslora: u.eslora ?? '', altura_espejo: u.altura_espejo ?? '',
      altura_banda: u.altura_banda ?? '', ancho_piso: u.ancho_piso ?? '',
      capacidad_carga: u.capacidad_carga ?? '', cantidad_bancas: u.cantidad_bancas ?? '',
      equipamiento: u.equipamiento ?? undefined,
    }));
  } catch {
    return unidadesDisponibles();
  }
}
