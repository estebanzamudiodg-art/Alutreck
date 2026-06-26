'use client';

import { useEffect, useState, useCallback } from 'react';

const BUCKET = 'media';
const MODELOS = ['Arawana', 'Semichata', 'Chata'];
const FORMA: Record<string, { forma: string; hex: string }> = {
  Arawana: { forma: 'v', hex: '#8A9499' },
  Semichata: { forma: 'v', hex: '#7A858B' },
  Chata: { forma: 'pontoon', hex: '#6F7B82' },
};
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

type Unidad = {
  id?: string; modelo: string; titulo: string;
  eslora: string; altura_espejo: string; altura_banda: string;
  ancho_piso: string; capacidad_carga: string; cantidad_bancas: string;
  equipamiento: string; estado: string;
};
const BLANK: Unidad = {
  modelo: 'Arawana', titulo: '', eslora: '', altura_espejo: '', altura_banda: '',
  ancho_piso: '', capacidad_carga: '', cantidad_bancas: '', equipamiento: '', estado: 'disponible',
};
const ESTADOS = [
  { v: 'disponible', t: 'Disponible' },
  { v: 'reservada', t: 'Reservada' },
  { v: 'vendida', t: 'Vendida' },
];

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
export function UnidadesPanel({ supabase }: { supabase: any }) {
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel] = useState<Unidad | null>(null);
  const [fotos, setFotos] = useState<any[]>([]);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('unidades').select('*').order('orden');
    setList(data ?? []);
  }, [supabase]);
  useEffect(() => { load(); }, [load]);

  async function loadFotos(id: string) {
    const { data } = await supabase.from('unidad_imagenes').select('id, url').eq('unidad_id', id).order('orden');
    setFotos(data ?? []);
  }

  function nueva() { setSel({ ...BLANK }); setFotos([]); }
  function editar(u: any) {
    setSel({
      id: u.id, modelo: u.modelo ?? 'Arawana', titulo: u.titulo ?? '',
      eslora: u.eslora ?? '', altura_espejo: u.altura_espejo ?? '', altura_banda: u.altura_banda ?? '',
      ancho_piso: u.ancho_piso ?? '', capacidad_carga: u.capacidad_carga ?? '',
      cantidad_bancas: u.cantidad_bancas ?? '', equipamiento: u.equipamiento ?? '', estado: u.estado ?? 'disponible',
    });
    loadFotos(u.id);
  }
  const set = (k: string, v: string) => setSel((s) => (s ? { ...s, [k]: v } : s));

  async function guardar() {
    if (!sel) return;
    setBusy('Guardando…');
    const f = FORMA[sel.modelo] ?? { forma: 'v', hex: '#8A9499' };
    const payload: any = {
      modelo: sel.modelo, modelo_slug: slugify(sel.modelo), titulo: sel.titulo || null, specs: f,
      eslora: sel.eslora || null, altura_espejo: sel.altura_espejo || null, altura_banda: sel.altura_banda || null,
      ancho_piso: sel.ancho_piso || null, capacidad_carga: sel.capacidad_carga || null,
      cantidad_bancas: sel.cantidad_bancas || null, equipamiento: sel.equipamiento || null, estado: sel.estado,
    };
    if (sel.id) {
      await supabase.from('unidades').update(payload).eq('id', sel.id);
      setBusy(''); load();
    } else {
      const { data, error } = await supabase.from('unidades').insert(payload).select('id').single();
      if (error) { setBusy('Error: ' + error.message); return; }
      setSel({ ...sel, id: data.id }); setBusy('Unidad creada. Ya puedes añadir fotos.'); load();
    }
  }

  async function eliminar() {
    if (!sel?.id) { setSel(null); return; }
    if (!confirm('¿Eliminar esta unidad?')) return;
    await supabase.from('unidades').delete().eq('id', sel.id);
    setSel(null); load();
  }

  async function subirFotos(files: FileList | null) {
    if (!sel?.id) { setBusy('Primero guarda la unidad, luego añade fotos.'); return; }
    if (!files || files.length === 0) return;
    setBusy('Subiendo…');
    const arr = Array.from(files);
    for (let k = 0; k < arr.length; k++) {
      const file = arr[k]; const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `unidades/${sel.id}/${Date.now()}-${k}.${ext}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file);
      if (up.error) { setBusy('Error: ' + up.error.message); return; }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      await supabase.from('unidad_imagenes').insert({ unidad_id: sel.id, url, orden: fotos.length + k });
    }
    setBusy(''); loadFotos(sel.id);
  }

  async function borrarFoto(it: any) {
    await supabase.from('unidad_imagenes').delete().eq('id', it.id);
    const marker = `/${BUCKET}/`; const i = it.url.indexOf(marker);
    if (i !== -1) await supabase.storage.from(BUCKET).remove([it.url.slice(i + marker.length)]);
    if (sel?.id) loadFotos(sel.id);
  }

  return (
    <>
      <h2>Entrega inmediata</h2>
      {busy && <div className="busy">{busy}</div>}

      {!sel ? (
        <>
          <button className="upload-btn" onClick={nueva}>+ Nueva unidad</button>
          <div className="ulist">
            {list.length === 0 && <p className="mempty">Aún no hay unidades.</p>}
            {list.map((u) => (
              <div className="urow" key={u.id}>
                <span className={`ubadge ${u.estado}`}>{ESTADOS.find((e) => e.v === u.estado)?.t ?? u.estado}</span>
                <span className="urow-t">{u.titulo || u.modelo} <small>{u.modelo}</small></span>
                <button className="btn btn-line" onClick={() => editar(u)}>Editar</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="linkbtn" onClick={() => setSel(null)}>← Volver a la lista</button>

          <div className="form-card" style={{ marginTop: 12 }}>
            <div className="row2">
              <div className="field"><label>Modelo</label>
                <select value={sel.modelo} onChange={(e) => set('modelo', e.target.value)}>
                  {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select></div>
              <div className="field"><label>Estado</label>
                <select value={sel.estado} onChange={(e) => set('estado', e.target.value)}>
                  {ESTADOS.map((e) => <option key={e.v} value={e.v}>{e.t}</option>)}
                </select></div>
            </div>
            <div className="field"><label>Título</label>
              <input value={sel.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ej. Arawana equipada para pesca" /></div>
            <div className="row2">
              <div className="field"><label>Eslora</label><input value={sel.eslora} onChange={(e) => set('eslora', e.target.value)} placeholder="7.00 m" /></div>
              <div className="field"><label>Altura del espejo</label><input value={sel.altura_espejo} onChange={(e) => set('altura_espejo', e.target.value)} placeholder="50 cm" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Altura de la banda</label><input value={sel.altura_banda} onChange={(e) => set('altura_banda', e.target.value)} placeholder="60 cm" /></div>
              <div className="field"><label>Ancho de piso</label><input value={sel.ancho_piso} onChange={(e) => set('ancho_piso', e.target.value)} placeholder="1.20 m" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Capacidad de carga</label><input value={sel.capacidad_carga} onChange={(e) => set('capacidad_carga', e.target.value)} placeholder="6 personas / 800 kg" /></div>
              <div className="field"><label>Cantidad de bancas</label><input value={sel.cantidad_bancas} onChange={(e) => set('cantidad_bancas', e.target.value)} placeholder="3" /></div>
            </div>
            <div className="field"><label>Equipamiento / nota</label>
              <textarea rows={2} value={sel.equipamiento} onChange={(e) => set('equipamiento', e.target.value)} placeholder="Lista para motor fuera de borda…" /></div>
            <div className="dc-actions">
              <button className="send" style={{ width: 'auto' }} onClick={guardar}>{sel.id ? 'Guardar cambios' : 'Crear unidad'}</button>
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
              <p className="mempty">Guarda la unidad para poder añadir fotos.</p>
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
