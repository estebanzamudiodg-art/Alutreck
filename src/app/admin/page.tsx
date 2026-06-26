'use client';

import { useEffect, useState, useCallback } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';

const BUCKET = 'media';

type Modelo = { id: string; slug: string; nombre: string };
type MediaItem = { id: string; url: string };

export default function AdminPage() {
  const supabase = getBrowserClient();
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // login form
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  // data
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [sel, setSel] = useState<Modelo | null>(null);
  const [fotos, setFotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [frames, setFrames] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState('');

  // ---- sesión ----
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
    setFotos(i.data ?? []);
    setVideos(v.data ?? []);
    setFrames(f.data ?? []);
  }, [supabase]);

  function pick(m: Modelo) { setSel(m); loadMedia(m); }

  async function login() {
    if (!supabase) return;
    setAuthMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setAuthMsg('Correo o contraseña incorrectos.');
  }
  async function logout() { await supabase?.auth.signOut(); setSel(null); }

  // ---- subir archivos ----
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
        const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
        if (up.error) { setBusy('Error al subir: ' + up.error.message); return; }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const url = pub.publicUrl;
        if (kind === 'foto') {
          await supabase.from('modelo_imagenes').insert({ modelo_id: sel.id, url, orden: fotos.length + k });
        } else if (kind === 'video') {
          await supabase.from('modelo_videos').insert({ modelo_id: sel.id, url, orden: videos.length + k });
        } else {
          await supabase.from('modelo_360_frames').insert({ modelo_id: sel.id, url, frame_order: frames.length + k });
        }
      }
      setBusy('');
      loadMedia(sel);
    } catch (e: any) {
      setBusy('Error: ' + (e?.message ?? 'desconocido'));
    }
  }

  async function remove(kind: 'foto' | 'video' | 'frame', item: MediaItem) {
    if (!supabase || !sel) return;
    const table = kind === 'foto' ? 'modelo_imagenes' : kind === 'video' ? 'modelo_videos' : 'modelo_360_frames';
    // borra de la base
    await supabase.from(table).delete().eq('id', item.id);
    // intenta borrar el archivo del storage (path tras /media/)
    const marker = `/${BUCKET}/`;
    const idx = item.url.indexOf(marker);
    if (idx !== -1) {
      const path = item.url.slice(idx + marker.length);
      await supabase.storage.from(BUCKET).remove([path]);
    }
    loadMedia(sel);
  }

  // ---- render ----
  if (!ready) return <div className="admin-wrap"><p>Cargando…</p></div>;

  if (!supabase) {
    return (
      <div className="admin-wrap">
        <div className="admin-card">
          <h1>Panel no disponible</h1>
          <p>Faltan las credenciales de Supabase. Configúralas en Vercel y vuelve a desplegar.</p>
        </div>
      </div>
    );
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
          <div className="side-title">Modelos</div>
          {modelos.map((m) => (
            <button key={m.id} className={`side-item ${sel?.id === m.id ? 'on' : ''}`} onClick={() => pick(m)}>{m.nombre}</button>
          ))}
        </aside>

        <main className="admin-main">
          {!sel ? (
            <p className="hint-pick">Elige un modelo de la izquierda para gestionar su galería.</p>
          ) : (
            <>
              <h2>{sel.nombre}</h2>
              {busy && <div className="busy">{busy}</div>}

              <MediaBlock title="Fotos" kind="foto" accept="image/*" multiple items={fotos}
                onUpload={upload} onRemove={remove} render={(it) => <img src={it.url} alt="" />} />

              <MediaBlock title="Videos (mp4)" kind="video" accept="video/mp4,video/*" multiple items={videos}
                onUpload={upload} onRemove={remove} render={(it) => <video src={it.url} muted />} />

              <MediaBlock title="Frames del 360 (selecciónalos en orden de giro)" kind="frame" accept="image/*" multiple items={frames}
                onUpload={upload} onRemove={remove} render={(it) => <img src={it.url} alt="" />} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function MediaBlock({
  title, kind, accept, multiple, items, onUpload, onRemove, render,
}: {
  title: string;
  kind: 'foto' | 'video' | 'frame';
  accept: string;
  multiple: boolean;
  items: MediaItem[];
  onUpload: (k: 'foto' | 'video' | 'frame', files: FileList | null) => void;
  onRemove: (k: 'foto' | 'video' | 'frame', item: MediaItem) => void;
  render: (it: MediaItem) => React.ReactNode;
}) {
  return (
    <section className="mblock">
      <div className="mblock-h">
        <h3>{title}</h3>
        <label className="upload-btn">
          + Subir
          <input type="file" accept={accept} multiple={multiple} hidden
            onChange={(e) => { onUpload(kind, e.target.files); e.currentTarget.value = ''; }} />
        </label>
      </div>
      {items.length === 0 ? (
        <p className="mempty">Aún no hay archivos.</p>
      ) : (
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
