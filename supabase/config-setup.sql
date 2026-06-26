-- ============================================================
--  ALUTRECK · Configuración del sitio (imagen de portada del inicio)
--  Ejecuta una vez en el SQL Editor.
-- ============================================================
create table if not exists config (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table config enable row level security;

drop policy if exists "config lectura publica" on config;
create policy "config lectura publica" on config
  for select using (true);

drop policy if exists "config equipo gestiona" on config;
create policy "config equipo gestiona" on config
  for all to authenticated using (true) with check (true);
