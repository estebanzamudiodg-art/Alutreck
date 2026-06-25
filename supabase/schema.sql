-- ============================================================
--  ALUTRECK SAS · Esquema Supabase
--  Modelo sin precios: categorías de producto + solicitudes de cotización
--  que se envían a revisión. Pega todo en el SQL Editor y ejecútalo.
-- ============================================================
create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- CATEGORÍAS DE PRODUCTO ----------
create table categories (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  slug        text not null unique,
  resumen     text,                         -- descripción corta (tarjeta)
  descripcion text,                          -- descripción larga (detalle)
  imagen_url  text,
  -- specs: forma de silueta, tono, usos típicos
  -- ej: {"forma":"v","hex":"#8A9499","usos":["Pesca recreativa","Pesca deportiva"]}
  specs       jsonb not null default '{}'::jsonb,
  orden       int  not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_categories_activo on categories(activo);
create trigger trg_categories_updated before update on categories
  for each row execute function set_updated_at();

-- ---------- FRAMES DEL VISOR 360 (opcional, por categoría/modelo) ----------
create table category_360_frames (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  url         text not null,
  frame_order int  not null,
  created_at  timestamptz not null default now(),
  unique (category_id, frame_order)
);
create index idx_360_category on category_360_frames(category_id);

-- ---------- SOLICITUDES DE COTIZACIÓN (a revisión, sin precio) ----------
create table solicitudes (
  id              uuid primary key default gen_random_uuid(),
  tipo            text,                      -- tipo de embarcación de interés
  cliente_nombre  text not null,
  cliente_tel     text not null,
  cliente_email   text,
  cliente_ciudad  text,
  uso             text,                      -- uso previsto
  eslora_aprox    text,
  capacidad_aprox text,
  motor_pref      text,
  mensaje         text,
  estado          text not null default 'nueva'
                  check (estado in ('nueva','en_revision','cotizada','cerrada','descartada')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_solicitudes_estado  on solicitudes(estado);
create index idx_solicitudes_created on solicitudes(created_at desc);
create trigger trg_solicitudes_updated before update on solicitudes
  for each row execute function set_updated_at();

-- ============================================================
--  RLS: el público lee categorías activas y crea solicitudes.
--  Solo un usuario autenticado (el admin) lee/gestiona solicitudes.
-- ============================================================
alter table categories         enable row level security;
alter table category_360_frames enable row level security;
alter table solicitudes        enable row level security;

create policy "lectura publica categorias" on categories
  for select using (activo = true);
create policy "admin gestiona categorias" on categories
  for all to authenticated using (true) with check (true);

create policy "lectura publica frames" on category_360_frames
  for select using (true);
create policy "admin gestiona frames" on category_360_frames
  for all to authenticated using (true) with check (true);

create policy "publico crea solicitudes" on solicitudes
  for insert to anon with check (true);
create policy "admin gestiona solicitudes" on solicitudes
  for all to authenticated using (true) with check (true);

-- Sugerido: bucket de Storage 'productos' (público lectura) para fotos y frames.
