// ============================================================
//  ALUTRECK · Migración de Supabase (proyecto viejo → proyecto nuevo)
//
//  Copia los archivos de Storage y todas las tablas, reescribiendo las
//  URLs de imágenes/videos para que apunten al proyecto nuevo.
//  Es re-ejecutable: usa upsert por id, no duplica filas ni archivos.
//
//  Uso:
//    node scripts/migrar-supabase.mjs --dry   (solo revisa y cuenta)
//    node scripts/migrar-supabase.mjs         (migra)
//
//  Credenciales en .env.migracion (ver .env.migracion.example).
// ============================================================
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const DRY = process.argv.includes('--dry');

// ---------- credenciales ----------
const ENV_FILE = '.env.migracion';
if (!existsSync(ENV_FILE)) {
  console.error(`Falta ${ENV_FILE}. Copia .env.migracion.example y complétalo.`);
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(ENV_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const need = ['OLD_SUPABASE_URL', 'OLD_SERVICE_ROLE_KEY', 'NEW_SUPABASE_URL', 'NEW_SERVICE_ROLE_KEY'];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Faltan en ${ENV_FILE}: ${missing.join(', ')}`);
  process.exit(1);
}
const OLD_URL = env.OLD_SUPABASE_URL.replace(/\/+$/, '');
const NEW_URL = env.NEW_SUPABASE_URL.replace(/\/+$/, '');
if (OLD_URL === NEW_URL) {
  console.error('OLD_SUPABASE_URL y NEW_SUPABASE_URL son iguales.');
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const oldDb = createClient(OLD_URL, env.OLD_SERVICE_ROLE_KEY, opts);
const newDb = createClient(NEW_URL, env.NEW_SERVICE_ROLE_KEY, opts);

// Orden respetando llaves foráneas.
const TABLES = [
  { name: 'modelos', key: 'id' },
  { name: 'modelo_imagenes', key: 'id' },
  { name: 'modelo_360_frames', key: 'id' },
  { name: 'modelo_videos', key: 'id' },
  { name: 'unidades', key: 'id' },
  { name: 'unidad_imagenes', key: 'id' },
  { name: 'solicitudes', key: 'id' },
  { name: 'config', key: 'key' },
];

// ---------- utilidades ----------
/** Reemplaza la URL del proyecto viejo por la nueva en cualquier string (también dentro de jsonb). */
function rewrite(value) {
  if (typeof value === 'string') return value.split(OLD_URL).join(NEW_URL);
  if (Array.isArray(value)) return value.map(rewrite);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewrite(v)]));
  }
  return value;
}

async function readAll(db, table, key) {
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from(table).select('*').order(key).range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

async function tableExists(db, table) {
  const { error } = await db.from(table).select('*', { head: true, count: 'exact' });
  return !error;
}

/** Lista recursivamente todos los archivos de un bucket. */
async function listFiles(db, bucket, prefix = '') {
  const files = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await db.storage.from(bucket).list(prefix, { limit: PAGE, offset });
    if (error) throw new Error(`storage ${bucket}/${prefix}: ${error.message}`);
    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) files.push(...(await listFiles(db, bucket, path))); // carpeta
      else files.push({ path, mimetype: item.metadata?.mimetype, size: item.metadata?.size ?? 0 });
    }
    if (data.length < PAGE) break;
  }
  return files;
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

// ---------- 1. verificación ----------
console.log(`\nViejo: ${OLD_URL}\nNuevo: ${NEW_URL}\n${DRY ? '(modo revisión, no se escribe nada)\n' : ''}`);

const faltantes = [];
for (const t of TABLES) {
  if (!(await tableExists(oldDb, t.name))) console.log(`  · ${t.name}: no existe en el viejo, se omite`);
  if (!(await tableExists(newDb, t.name))) faltantes.push(t.name);
}
if (faltantes.length) {
  console.error(
    `\nEn el proyecto NUEVO faltan tablas: ${faltantes.join(', ')}\n` +
      'Ejecuta en su SQL Editor: supabase/schema.sql, supabase/admin-setup.sql y supabase/config-setup.sql\n' +
      '(NO ejecutes seed.sql: los datos se copian desde el viejo).',
  );
  process.exit(1);
}

// ---------- 2. storage ----------
const { data: oldBuckets, error: bErr } = await oldDb.storage.listBuckets();
if (bErr) throw new Error(`listBuckets viejo: ${bErr.message}`);
const { data: newBuckets, error: nbErr } = await newDb.storage.listBuckets();
if (nbErr) throw new Error(`listBuckets nuevo: ${nbErr.message}`);

for (const bucket of oldBuckets) {
  const files = await listFiles(oldDb, bucket.name);
  const total = files.reduce((s, f) => s + f.size, 0);
  console.log(`\nStorage "${bucket.name}" (${bucket.public ? 'público' : 'privado'}): ${files.length} archivos, ${mb(total)}`);
  if (DRY) continue;

  if (!newBuckets.some((b) => b.name === bucket.name)) {
    const { error } = await newDb.storage.createBucket(bucket.name, { public: bucket.public });
    if (error) throw new Error(`createBucket ${bucket.name}: ${error.message}`);
    console.log(`  bucket creado en el nuevo`);
  }

  let ok = 0;
  const fallidos = [];
  for (const f of files) {
    const { data: blob, error: dErr } = await oldDb.storage.from(bucket.name).download(f.path);
    if (dErr) { fallidos.push(`${f.path} (descarga: ${dErr.message})`); continue; }
    const { error: uErr } = await newDb.storage.from(bucket.name).upload(f.path, blob, {
      upsert: true,
      contentType: f.mimetype || blob.type || undefined,
      cacheControl: '31536000',
    });
    if (uErr) { fallidos.push(`${f.path} (subida: ${uErr.message})`); continue; }
    ok++;
    process.stdout.write(`\r  copiados ${ok}/${files.length}`);
  }
  console.log('');
  if (fallidos.length) console.log(`  ✗ fallaron ${fallidos.length}:\n    ${fallidos.join('\n    ')}`);
}

// ---------- 3. tablas ----------
console.log('');
for (const t of TABLES) {
  if (!(await tableExists(oldDb, t.name))) continue;
  const rows = (await readAll(oldDb, t.name, t.key)).map(rewrite);
  console.log(`Tabla ${t.name}: ${rows.length} filas`);
  if (DRY || rows.length === 0) continue;
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await newDb.from(t.name).upsert(rows.slice(i, i + 500), { onConflict: t.key });
    if (error) {
      console.error(`  ✗ ${t.name}: ${error.message}`);
      console.error('    Si menciona una columna, el proyecto viejo tiene columnas que no están en los .sql; agrégalas en el nuevo y vuelve a ejecutar.');
      process.exit(1);
    }
  }
  console.log(`  ✓ copiada`);
}

// ---------- 4. usuarios del panel ----------
const { data: users, error: usrErr } = await oldDb.auth.admin.listUsers({ perPage: 1000 });
if (!usrErr) {
  console.log(`\nUsuarios del panel admin en el viejo: ${users.users.map((u) => u.email).join(', ') || '(ninguno)'}`);
  console.log('Las contraseñas no se pueden copiar: créalos en el nuevo en Authentication → Users → Add user.');
}

console.log(DRY ? '\nRevisión terminada. Ejecuta sin --dry para migrar.' : '\n✓ Migración terminada.');
