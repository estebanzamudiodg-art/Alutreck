-- ============================================================
--  ALUTRECK SAS · Esquema Supabase
--  3 modelos con galería e imágenes 360 (spin real). Cotización por
--  solicitud (sin precios) con las características que elige el cliente.
--  Ejecuta todo en el SQL Editor.
-- ============================================================
create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ---------- MODELOS ----------
create table modelos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  slug        text not null unique,
  resumen     text,
  descripcion text,
  -- specs: forma de silueta, tono, usos. Ej:
  -- {"forma":"v","hex":"#8A9499","usos":["Pesca","Recreación"]}
  specs       jsonb not null default '{}'::jsonb,
  orden       int  not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_modelos_activo on modelos(activo);
create trigger trg_modelos_updated before update on modelos
  for each row execute function set_updated_at();

-- ---------- GALERÍA DE IMÁGENES ----------
create table modelo_imagenes (
  id         uuid primary key default gen_random_uuid(),
  modelo_id  uuid not null references modelos(id) on delete cascade,
  url        text not null,
  alt        text,
  orden      int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_modelo_imagenes on modelo_imagenes(modelo_id);

-- ---------- FRAMES DEL 360 (spin real) ----------
create table modelo_360_frames (
  id          uuid primary key default gen_random_uuid(),
  modelo_id   uuid not null references modelos(id) on delete cascade,
  url         text not null,
  frame_order int  not null,
  created_at  timestamptz not null default now(),
  unique (modelo_id, frame_order)
);
create index idx_modelo_360 on modelo_360_frames(modelo_id);

-- ---------- SOLICITUDES (a revisión, sin precio) ----------
create table solicitudes (
  id              uuid primary key default gen_random_uuid(),
  modelo          text,
  cliente_nombre  text not null,
  cliente_tel     text not null,
  cliente_email   text,
  cliente_ciudad  text,
  -- características que define el cliente
  eslora          text,
  altura_espejo   text,
  altura_banda    text,
  ancho_piso      text,
  capacidad_carga text,
  cantidad_bancas text,
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
--  RLS
--  Público: lee modelos/imágenes/frames activos y crea solicitudes.
--  Equipo (usuarios autenticados): gestiona todo y lee solicitudes.
--  Las cuentas del equipo se crean en Supabase → Authentication → Users
--  (no hay registro público).
-- ============================================================
alter table modelos           enable row level security;
alter table modelo_imagenes   enable row level security;
alter table modelo_360_frames enable row level security;
alter table solicitudes       enable row level security;

create policy "lectura publica modelos" on modelos
  for select using (activo = true);
create policy "equipo gestiona modelos" on modelos
  for all to authenticated using (true) with check (true);

create policy "lectura publica imagenes" on modelo_imagenes
  for select using (true);
create policy "equipo gestiona imagenes" on modelo_imagenes
  for all to authenticated using (true) with check (true);

create policy "lectura publica frames" on modelo_360_frames
  for select using (true);
create policy "equipo gestiona frames" on modelo_360_frames
  for all to authenticated using (true) with check (true);

create policy "publico crea solicitudes" on solicitudes
  for insert to anon with check (true);
create policy "equipo gestiona solicitudes" on solicitudes
  for all to authenticated using (true) with check (true);
