'use client';

import { useEffect, useState } from 'react';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type Form = {
  nombre: string; slug: string; resumen: string; descripcion: string;
  forma: string; hex: string; usos: string; orden: number; activo: boolean;
};
const BLANK: Form = { nombre: '', slug: '', resumen: '', descripcion: '', forma: 'v', hex: '#8A9499', usos: '', orden: 0, activo: true };

/* eslint-disable @typescript-eslint/no-explicit-any */
export function ModeloEditor({
  supabase, modeloId, onSaved, onDeleted,
}: {
  supabase: any; modeloId: string | null;
  onSaved?: (m: { id: string; slug: string; nombre: string }) => void;
  onDeleted?: () => void;
}) {
  const [f, setF] = useState<Form>(BLANK);
  const [busy, setBusy] = useState('');
  const isNew = !modeloId;

  useEffect(() => {
    let cancel = false;
    async function go() {
      if (!modeloId) { setF(BLANK); return; }
      const { data } = await supabase.from('modelos').select('*').eq('id', modeloId).single();
      if (cancel || !data) return;
      const specs = data.specs ?? {};
      setF({
        nombre: data.nombre ?? '', slug: data.slug ?? '', resumen: data.resumen ?? '',
        descripcion: data.descripcion ?? '', forma: specs.forma === 'pontoon' ? 'pontoon' : 'v',
        hex: specs.hex ?? '#8A9499', usos: (specs.usos ?? []).join(', '),
        orden: data.orden ?? 0, activo: data.activo !== false,
      });
    }
    go();
    return () => { cancel = true; };
  }, [modeloId, supabase]);

  const set = (k: keyof Form, v: any) => setF((s) => ({ ...s, [k]: v }));

  async function guardar() {
    if (!f.nombre.trim()) { setBusy('Ponle un nombre al modelo.'); return; }
    setBusy('Guardando…');
    const specs = { forma: f.forma, hex: f.hex, usos: f.usos.split(',').map((x) => x.trim()).filter(Boolean) };
    const payload: any = {
      nombre: f.nombre.trim(), resumen: f.resumen || null, descripcion: f.descripcion || null,
      specs, orden: Number(f.orden) || 0, activo: f.activo,
    };
    if (isNew) {
      const slug = slugify(f.nombre) || `modelo-${Date.now()}`;
      const { data, error } = await supabase.from('modelos').insert({ ...payload, slug }).select('id, slug, nombre').single();
      if (error) {
        setBusy('Error: ' + (error.message.includes('duplicate') ? 'ya existe un modelo con ese nombre' : error.message));
        return;
      }
      setBusy(''); onSaved?.(data);
    } else {
      const { error } = await supabase.from('modelos').update(payload).eq('id', modeloId);
      if (error) { setBusy('Error: ' + error.message); return; }
      setBusy('Guardado ✓'); onSaved?.({ id: modeloId as string, slug: f.slug, nombre: payload.nombre });
    }
  }

  async function eliminar() {
    if (!modeloId) return;
    if (!confirm('¿Eliminar este modelo y todas sus fotos, videos y frames? No se puede deshacer.')) return;
    const { error } = await supabase.from('modelos').delete().eq('id', modeloId);
    if (error) { setBusy('Error: ' + error.message); return; }
    onDeleted?.();
  }

  return (
    <section className="form-card modelo-editor">
      <h3 className="me-title">{isNew ? 'Nuevo modelo' : 'Datos del modelo'}</h3>
      {busy && <div className="busy">{busy}</div>}

      <div className="field"><label>Nombre</label>
        <input value={f.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej. Arawana" /></div>
      <div className="field"><label>Resumen corto (para la tarjeta)</label>
        <input value={f.resumen} onChange={(e) => set('resumen', e.target.value)} placeholder="Frase breve y vendedora" /></div>
      <div className="field"><label>Descripción</label>
        <textarea rows={3} value={f.descripcion} onChange={(e) => set('descripcion', e.target.value)} /></div>

      <div className="row2">
        <div className="field"><label>Forma del casco</label>
          <select value={f.forma} onChange={(e) => set('forma', e.target.value)}>
            <option value="v">V (quilla en V)</option>
            <option value="pontoon">Chata / fondo plano</option>
          </select></div>
        <div className="field"><label>Color de acento</label>
          <input type="color" value={f.hex} onChange={(e) => set('hex', e.target.value)} style={{ height: 44, padding: 4 }} /></div>
      </div>

      <div className="field"><label>Usos (separados por coma)</label>
        <input value={f.usos} onChange={(e) => set('usos', e.target.value)} placeholder="Pesca, Recreación, Transporte" /></div>

      <div className="row2">
        <div className="field"><label>Orden (menor aparece primero)</label>
          <input type="number" value={f.orden} onChange={(e) => set('orden', e.target.value)} /></div>
        <div className="field"><label>Visibilidad</label>
          <select value={f.activo ? 'si' : 'no'} onChange={(e) => set('activo', e.target.value === 'si')}>
            <option value="si">Visible en la web</option>
            <option value="no">Oculto</option>
          </select></div>
      </div>

      <div className="dc-actions">
        <button className="send" style={{ width: 'auto' }} onClick={guardar}>{isNew ? 'Crear modelo' : 'Guardar cambios'}</button>
        {!isNew && <button className="btn btn-line" onClick={eliminar}>Eliminar modelo</button>}
      </div>
    </section>
  );
}
