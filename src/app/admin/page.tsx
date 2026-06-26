'use client';

import { useEffect, useState, useCallback } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { UnidadesPanel } from '@/components/UnidadesPanel';

const BUCKET = 'media';

type Modelo = { id: string; slug: string; nombre: string };
type MediaItem = { id: string; url: string };
type Mode = 'none' | 'inicio' | 'modelo' | 'unidades';

export default function AdminPage() {
  const supabase = getBrowserClient();
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [mode, setMode] = useState<Mode>('none');
  const [sel, setSel] = useState<Modelo | null>(null);
  const [fotos, setFotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [frames, setFrames] = useState<MediaItem[]>([]);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState('');

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const loadModelos = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from('modelos').select('id, slug, nombre').order('orden');
    setModelos(data ?? []);
  }, [supabase]);

  useEffect(() => { if (userEmail) loadModelos(); }, [userEmail, loadModelos]);

  const loadMedia = useCallback(async (m: Modelo) => {
    if (!supabase) return;
    const [i, v, f] = await Promise.all([
      supabase.from('modelo_imagenes').select('id, url').eq('modelo_id', m.id).order('orden'),
      supabase.from('modelo_videos').select('id, url').eq('modelo_id', m.id).order('orden'),
      supabase.from('modelo_360_frames').select('id, url').eq('modelo_id', m.id).order('frame_order'),
    ]);
    setFotos(i.data ?? []); setVideos(v.data ?? []); setFrames(f.data ?? []);
  }, [supabase]);

  const loadHero = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.from('config').select('value').eq('key', 'hero_image').single();
    setHeroUrl(data?.value ?? null);
  }, [supabase]);

  function pickModelo(m: Modelo) { setMode('modelo'); setSel(m); loadMedia(m); }
  function pickInicio() { setMode('inicio'); setSel(null); loadHero(); }

  async function login() {
    if (!supabase) return;
    setAuthMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setAuthMsg('Correo o contraseña incorrectos.');
  }
  async function logout() { await supabase?.auth.signOut(); setMode('none'); setSel(null); }

  function storagePath(url: string): string | null {
    const marker = `/${BUCKET}/`;
    const idx = url.indexOf(marker);
    return idx === -1 ? null : url.slice(idx + marker.length);
  }

  async function upload(kind: 'foto' | 'video' | 'frame', files: FileList | null) {
    if (!supabase || !sel || !files || files.length === 0) return;
    const carpeta = kind === 'foto' ? 'fotos' : kind === 'video' ? 'videos' : 'frames360';
    setBusy(`Subiendo ${files.length} archivo(s)…`);
    try {
      const list = Array.from(files);
      for (let k = 0; k < list.length; k++) {
        const file = list[k];
        const ext = file.name.split('.').pop() ?? 'bin';
        const path = `${sel.slug}/${carpeta}/${Date.now()}-${k}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file);
        if (up.error) { setBusy('Error al subir: ' + up.error.message); return; }
        const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        if (kind === 'foto') await supabase.from('modelo_imagenes').insert({ modelo_id: sel.id, url, orden: fotos.length + k });
        else if (kind === 'video') await supabase.from('modelo_videos').insert({ modelo_id: sel.id, url, orden: videos.length + k });
        else await supabase.from('modelo_360_frames').insert({ modelo_id: sel.id, url, frame_order: frames.length + k });
      }
      setBusy(''); loadMedia(sel);
    } catch (e: any) { setBusy('Error: ' + (e?.message ?? 'desconocido')); }
  }

  async function remove(kind: 'foto' | 'video' | 'frame', item: MediaItem) {
    if (!supabase || !sel) return;
    const table = kind === 'foto' ? 'modelo_imagenes' : kind === 'video' ? 'modelo_videos' : 'modelo_360_frames';
    await supabase.from(table).delete().eq('id', item.id);
    const path = storagePath(item.url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    loadMedia(sel);
  }

  async function uploadHero(files: FileList | null) {
    if (!supabase || !files || files.length === 0) return;
    setBusy('Subiendo portada…');
    try {
      const file = files[0];
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `inicio/hero-${Date.now()}.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file);
      if (up.error) { setBusy('Error al subir: ' + up.error.message); return; }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      await supabase.from('config').upsert({ key: 'hero_image', value: url });
      setBusy(''); setHeroUrl(url);
    } catch (e: any) { setBusy('Error: ' + (e?.message ?? 'desconocido')); }
  }

  async function removeHero() {
    if (!supabase) return;
    if (heroUrl) { const p = storagePath(heroUrl); if (p) await supabase.storage.from(BUCKET).remove([p]); }
    await supabase.from('config').delete().eq('key', 'hero_image');
    setHeroUrl(null);
  }

  if (!ready) return <div className="admin-wrap"><p>Cargando…</p></div>;

  if (!supabase) {
    return <div className="admin-wrap"><div className="admin-card"><h1>Panel no disponible</h1>
      <p>Faltan las credenciales de Supabase. Configúralas en Vercel y vuelve a desplegar.</p></div></div>;
  }

  if (!userEmail) {
    return (
      <div className="admin-wrap">
        <div className="admin-card login">
          <h1>Panel Alutreck</h1>
          <p className="sub">Ingresa con tu cuenta del equipo.</p>
          <div className="field"><label>Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@email.com" /></div>
          <div className="field"><label>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') login(); }} placeholder="••••••••" /></div>
          {authMsg && <p className="auth-msg">{authMsg}</p>}
          <button className="send" onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap admin-app">
      <div className="admin-top">
        <strong>Panel Alutreck</strong>
        <span className="who">{userEmail} · <button className="linkbtn" onClick={logout}>Salir</button></span>
      </div>

      <div className="admin-grid">
        <aside className="admin-side">
          <div className="side-title">Página de inicio</div>
          <button className={`side-item ${mode === 'inicio' ? 'on' : ''}`} onClick={pickInicio}>🏠 Portada de inicio</button>
          <button className={`side-item ${mode === 'unidades' ? 'on' : ''}`} onClick={() => { setMode('unidades'); setSel(null); }}>🚤 Entrega inmediata</button>
          <div className="side-title">Modelos</div>
          {modelos.map((m) => (
            <button key={m.id} className={`side-item ${mode === 'modelo' && sel?.id === m.id ? 'on' : ''}`} onClick={() => pickModelo(m)}>{m.nombre}</button>
          ))}
        </aside>

        <main className="admin-main">
          {busy && <div className="busy">{busy}</div>}

          {mode === 'none' && <p className="hint-pick">Elige una opción de la izquierda.</p>}

          {mode === 'unidades' && <UnidadesPanel supabase={supabase} />}

          {mode === 'inicio' && (
            <>
              <h2>Portada de inicio</h2>
              <p className="hint-pick">Esta imagen aparece grande en la parte superior de la página principal.</p>
              {heroUrl ? (
                <>
                  <div className="hero-current">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={heroUrl} alt="Portada actual" /></div>
                  <div className="dc-actions">
                    <label className="upload-btn">Cambiar imagen
                      <input type="file" accept="image/*" hidden onChange={(e) => { uploadHero(e.target.files); e.currentTarget.value = ''; }} /></label>
                    <button className="btn btn-line" onClick={removeHero}>Quitar</button>
                  </div>
                </>
              ) : (
                <label className="upload-btn">+ Subir portada
                  <input type="file" accept="image/*" hidden onChange={(e) => { uploadHero(e.target.files); e.currentTarget.value = ''; }} /></label>
              )}
            </>
          )}

          {mode === 'modelo' && sel && (
            <>
              <h2>{sel.nombre}</h2>
              <MediaBlock title="Fotos (la primera es la portada del modelo)" kind="foto" accept="image/*" items={fotos}
                onUpload={upload} onRemove={remove} render={(it) => <img src={it.url} alt="" />} />
              <MediaBlock title="Videos (mp4)" kind="video" accept="video/mp4,video/*" items={videos}
                onUpload={upload} onRemove={remove} render={(it) => <video src={it.url} muted />} />
              <MediaBlock title="Frames del 360 (selecciónalos en orden de giro)" kind="frame" accept="image/*" items={frames}
                onUpload={upload} onRemove={remove} render={(it) => <img src={it.url} alt="" />} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function MediaBlock({
  title, kind, accept, items, onUpload, onRemove, render,
}: {
  title: string; kind: 'foto' | 'video' | 'frame'; accept: string; items: MediaItem[];
  onUpload: (k: 'foto' | 'video' | 'frame', files: FileList | null) => void;
  onRemove: (k: 'foto' | 'video' | 'frame', item: MediaItem) => void;
  render: (it: MediaItem) => React.ReactNode;
}) {
  return (
    <section className="mblock">
      <div className="mblock-h">
        <h3>{title}</h3>
        <label className="upload-btn">+ Subir
          <input type="file" accept={accept} multiple hidden
            onChange={(e) => { onUpload(kind, e.target.files); e.currentTarget.value = ''; }} /></label>
      </div>
      {items.length === 0 ? <p className="mempty">Aún no hay archivos.</p> : (
        <div className="mgrid">
          {items.map((it) => (
            <div className="mitem" key={it.id}>
              {render(it)}
              <button className="mdel" onClick={() => onRemove(kind, it)} aria-label="Eliminar">✕</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
