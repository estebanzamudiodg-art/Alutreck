'use client';

import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** ¿Hay credenciales de Supabase configuradas? */
export const supabaseEnabled = Boolean(url && key);

/**
 * Cliente para componentes de cliente (formulario de cotización, etc.).
 * Devuelve null si aún no has configurado las variables de entorno.
 */
export function getBrowserClient() {
  if (!supabaseEnabled) return null;
  return createBrowserClient(url!, key!);
}
