-- ============================================================
--  ALUTRECK · Configuración para el panel admin (galería)
--  Ejecuta esto UNA vez en el SQL Editor, después de schema.sql.
--  Agrega la tabla de videos y los permisos para subir al bucket 'media'.
-- ============================================================

-- ---------- VIDEOS POR MODELO ----------
create table if not exists modelo_videos (
  id         uuid primary key default gen_random_uuid(),
  modelo_id  uuid not null references modelos(id) on delete cascade,
  url        text not null,
  orden      int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_modelo_videos on modelo_videos(modelo_id);

alter table modelo_videos enable row level security;

drop policy if exists "lectura publica videos" on modelo_videos;
create policy "lectura publica videos" on modelo_videos
  for select using (true);

drop policy if exists "equipo gestiona videos" on modelo_videos;
create policy "equipo gestiona videos" on modelo_videos
  for all to authenticated using (true) with check (true);

-- ============================================================
--  PERMISOS DE STORAGE (bucket 'media')
--  Lectura pública; subir/editar/borrar solo para el equipo (autenticado).
--  Asegúrate de haber creado el bucket 'media' como PÚBLICO en Storage.
-- ============================================================
drop policy if exists "media lectura publica" on storage.objects;
create policy "media lectura publica" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media equipo sube" on storage.objects;
create policy "media equipo sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media equipo edita" on storage.objects;
create policy "media equipo edita" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media equipo borra" on storage.objects;
create policy "media equipo borra" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
