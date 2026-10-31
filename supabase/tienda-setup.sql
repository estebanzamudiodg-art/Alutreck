-- ============================================================
--  ALUTRECK · Tienda (artículos con precio y compra por WhatsApp)
--  Ejecuta una vez en el SQL Editor, después de schema.sql.
-- ============================================================

create table if not exists articulos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text,
  precio      numeric(14,2),              -- en pesos; null = "consultar"
  -- colores: lista de variantes, ej [{"nombre":"Rojo","hex":"#C0392B"}]
  colores     jsonb not null default '[]'::jsonb,
  activo      boolean not null default true,
  orden       int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_articulos_activo on articulos(activo);
create trigger trg_articulos_updated before update on articulos
  for each row execute function set_updated_at();

create table if not exists articulo_imagenes (
  id          uuid primary key default gen_random_uuid(),
  articulo_id uuid not null references articulos(id) on delete cascade,
  url         text not null,
  orden       int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_articulo_imagenes on articulo_imagenes(articulo_id);

alter table articulos        enable row level security;
alter table articulo_imagenes enable row level security;

drop policy if exists "lectura publica articulos" on articulos;
create policy "lectura publica articulos" on articulos
  for select using (activo = true);
drop policy if exists "equipo gestiona articulos" on articulos;
create policy "equipo gestiona articulos" on articulos
  for all to authenticated using (true) with check (true);

drop policy if exists "lectura publica articulo imagenes" on articulo_imagenes;
create policy "lectura publica articulo imagenes" on articulo_imagenes
  for select using (true);
drop policy if exists "equipo gestiona articulo imagenes" on articulo_imagenes;
create policy "equipo gestiona articulo imagenes" on articulo_imagenes
  for all to authenticated using (true) with check (true);
