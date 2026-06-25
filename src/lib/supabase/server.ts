import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** ¿Hay credenciales de Supabase configuradas? */
export const supabaseEnabled = Boolean(url && key);

/**
 * Cliente para Server Components (lectura del catálogo).
 * Lee con la anon key respetando las políticas RLS de solo-lectura pública.
 * Devuelve null si aún no hay credenciales: en ese caso las queries
 * caen a los datos de ejemplo (seed-data).
 */
export function getServerClient() {
  if (!supabaseEnabled) return null;
  return createClient(url!, key!, { auth: { persistSession: false } });
}
