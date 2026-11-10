'use client';

import { useEffect, useState, useCallback } from 'react';
import { resizeImage } from '@/lib/resize-image';

const BUCKET = 'media';

type Color = { nombre: string; hex: string };
type Art = {
  id?: string; nombre: string; descripcion: string; precio: string;
  colores: Color[]; activo: boolean; orden: number;
};
const BLANK: Art = { nombre: '', descripcion: '', precio: '', colores: [], activo: true, orden: 0 };

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
export function TiendaPanel({ supabase }: { supabase: any }) {
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel] = useState<Art | null>(null);
  const [fotos, setFotos] = useState<any[]>([]);
  const [busy, setBusy] = useState('');
  const [nuevoColor, setNuevoColor] = useState<Color>({ nombre: '', hex: '#0F2D52' });

  const load = useCallback(async () => {
    const { data } = await supabase.from('articulos').select('*').order('orden');
    setList(data ?? []);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  async function loadFotos(id: string) {
    const { data } = await supabase.from('articulo_imagenes').select('id, url').eq('articulo_id', id).order('orden');
    setFotos(data ?? []);
  }

  function nuevo() { setSel({ ...BLANK }); setFotos([]); }
  function editar(a: any) {
    setSel({
      id: a.id, nombre: a.nombre ?? '', descripcion: a.descripcion ?? '',
      precio: a.precio != null ? String(a.precio) : '',
      colores: Array.isArray(a.colores) ? a.colores : [],
      activo: a.activo !== false, orden: a.orden ?? 0,
    });
    loadFotos(a.id);
  }
  const set = (k: keyof Art, v: any) => setSel((s) => (s ? { ...s, [k]: v } : s));

  function addColor() {
    if (!nuevoColor.nombre.trim()) return;
    setSel((s) => s ? { ...s, colores: [...s.colores, { ...nuevoColor }] } : s);
    setNuevoColor({ nombre: '', hex: '#0F2D52' });
  }
  function delColor(i: number) {
    setSel((s) => s ? { ...s, colores: s.colores.filter((_, k) => k !== i) } : s);
  }

  async function guardar() {
    if (!sel) return;
    if (!sel.nombre.trim()) { setBusy('Ponle un nombre al artículo.'); return; }
    setBusy('Guardando…');
    const precioNum = sel.precio.trim() === '' ? null : Number(sel.precio.replace(/[^\d.]/g, ''));
    const payload: any = {
      nombre: sel.nombre.trim(), descripcion: sel.descripcion || null,
      precio: precioNum, colores: sel.colores, activo: sel.activo, orden: Number(sel.orden) || 0,
    };
    if (sel.id) {
      await supabase.from('articulos').update(payload).eq('id', sel.id);
      setBusy('Guardado ✓'); load();
    } else {
      const { data, error } = await supabase.from('articulos').insert(payload).select('id').single();
      if (error) { setBusy('Error: ' + error.message); return; }
      setSel({ ...sel, id: data.id }); setBusy('Artículo creado. Ya puedes añadir fotos.'); load();
    }
  }

  async function eliminar() {
    if (!sel?.id) { setSel(null); return; }
    if (!confirm('¿Eliminar este artículo y sus fotos?')) return;
    await supabase.from('articulos').delete().eq('id', sel.id);
    setSel(null); load();
  }

  async function subirFotos(files: FileList | null) {
    if (!sel?.id) { setBusy('Primero guarda el artículo, luego añade fotos.'); return; }
    if (!files || files.length === 0) return;
    setBusy('Subiendo…');
    const arr = Array.from(files);
    for (let k = 0; k < arr.length; k++) {
      const file = await resizeImage(arr[k], { maxW: 1200 });
      const ext = file.name.split('.').pop() ?? 'webp';
      const path = `tienda/${sel.id}/${Date.now()}-${k}.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', upsert: true });
      if (up.error) { setBusy('Error: ' + up.error.message); return; }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      await supabase.from('articulo_imagenes').insert({ articulo_id: sel.id, url, orden: fotos.length + k });
    }
    setBusy(''); loadFotos(sel.id);
  }

  async function borrarFoto(it: any) {
    await supabase.from('articulo_imagenes').delete().eq('id', it.id);
    const marker = `/${BUCKET}/`; const i = it.url.indexOf(marker);
    if (i !== -1) await supabase.storage.from(BUCKET).remove([it.url.slice(i + marker.length)]);
    if (sel?.id) loadFotos(sel.id);
  }

  return (
    <>
      <h2>Tienda</h2>
      {busy && <div className="busy">{busy}</div>}

      {!sel ? (
        <>
          <button className="upload-btn" onClick={nuevo}>+ Nuevo artículo</button>
          <div className="ulist">
            {list.length === 0 && <p className="mempty">Aún no hay artículos.</p>}
            {list.map((a) => (
              <div className="urow" key={a.id}>
                <span className={`ubadge ${a.activo !== false ? 'disponible' : 'vendida'}`}>{a.activo !== false ? 'Visible' : 'Oculto'}</span>
                <span className="urow-t">{a.nombre} <small>{a.precio != null ? '$' + new Intl.NumberFormat('es-CO').format(a.precio) : 'Consultar'}</small></span>
                <button className="btn btn-line" onClick={() => editar(a)}>Editar</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="linkbtn" onClick={() => setSel(null)}>← Volver a la lista</button>

          <div className="form-card" style={{ marginTop: 12 }}>
            <div className="field"><label>Nombre del artículo</label>
              <input value={sel.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej. Chaleco salvavidas" /></div>
            <div className="field"><label>Descripción</label>
              <textarea rows={2} value={sel.descripcion} onChange={(e) => set('descripcion', e.target.value)} /></div>
            <div className="row2">
              <div className="field"><label>Precio (en pesos, vacío = "Consultar")</label>
                <input value={sel.precio} onChange={(e) => set('precio', e.target.value)} placeholder="120000" inputMode="numeric" /></div>
              <div className="field"><label>Visibilidad</label>
                <select value={sel.activo ? 'si' : 'no'} onChange={(e) => set('activo', e.target.value === 'si')}>
                  <option value="si">Visible en la tienda</option>
                  <option value="no">Oculto</option>
                </select></div>
            </div>
            <div className="field"><label>Orden (menor aparece primero)</label>
              <input type="number" value={sel.orden} onChange={(e) => set('orden', e.target.value)} /></div>

            <div className="field">
              <label>Colores disponibles</label>
              <div className="color-list">
                {sel.colores.length === 0 && <span className="mempty">Sin colores (opcional).</span>}
                {sel.colores.map((c, i) => (
                  <span className="color-chip" key={i}>
                    <span className="color-dot" style={{ background: c.hex }} />
                    {c.nombre}
                    <button className="color-x" onClick={() => delColor(i)} aria-label="Quitar">✕</button>
                  </span>
                ))}
              </div>
              <div className="color-add">
                <input type="color" value={nuevoColor.hex} onChange={(e) => setNuevoColor((c) => ({ ...c, hex: e.target.value }))} style={{ width: 46, height: 40, padding: 3 }} />
                <input value={nuevoColor.nombre} onChange={(e) => setNuevoColor((c) => ({ ...c, nombre: e.target.value }))}
                  placeholder="Nombre del color (ej. Rojo)" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} />
                <button className="btn btn-line" onClick={addColor} type="button">Añadir</button>
              </div>
            </div>

            <div className="dc-actions">
              <button className="send" style={{ width: 'auto' }} onClick={guardar}>{sel.id ? 'Guardar cambios' : 'Crear artículo'}</button>
              <button className="btn btn-line" onClick={eliminar}>Eliminar</button>
            </div>
          </div>

          <section className="mblock">
            <div className="mblock-h">
              <h3>Fotos (la primera es la portada)</h3>
              <label className="upload-btn">+ Subir
                <input type="file" accept="image/*" multiple hidden
                  onChange={(e) => { subirFotos(e.target.files); e.currentTarget.value = ''; }} /></label>
            </div>
            {!sel.id ? (
              <p className="mempty">Guarda el artículo para poder añadir fotos.</p>
            ) : fotos.length === 0 ? (
              <p className="mempty">Aún no hay fotos.</p>
            ) : (
              <div className="mgrid">
                {fotos.map((it) => (
                  <div className="mitem" key={it.id}>
                    <img src={it.url} alt="" />
                    <button className="mdel" onClick={() => borrarFoto(it)} aria-label="Eliminar">✕</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
