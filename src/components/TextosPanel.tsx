'use client';

import { useEffect, useState } from 'react';

const FIELDS: { key: string; label: string; type: 'input' | 'textarea' }[] = [
  { key: 'hero_eyebrow', label: 'Hero · línea superior', type: 'input' },
  { key: 'hero_title', label: 'Hero · título principal', type: 'input' },
  { key: 'hero_subtitle', label: 'Hero · subtítulo', type: 'input' },
  { key: 'hero_desc', label: 'Hero · descripción', type: 'textarea' },
  { key: 'nosotros_title', label: 'Nosotros · título', type: 'input' },
  { key: 'nosotros_p1', label: 'Nosotros · párrafo 1', type: 'textarea' },
  { key: 'nosotros_p2', label: 'Nosotros · párrafo 2', type: 'textarea' },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export function TextosPanel({ supabase }: { supabase: any }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');

  useEffect(() => {
    async function go() {
      const keys = FIELDS.map((f) => f.key);
      const { data } = await supabase.from('config').select('key, value').in('key', keys);
      const m: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { m[r.key] = r.value ?? ''; });
      setVals(m);
    }
    go();
  }, [supabase]);

  const set = (k: string, v: string) => setVals((s) => ({ ...s, [k]: v }));

  async function guardar() {
    setBusy('Guardando…');
    const rows = FIELDS.map((f) => ({ key: f.key, value: (vals[f.key] ?? '').trim() }))
      .filter((r) => r.value !== '');
    const empties = FIELDS.map((f) => f.key).filter((k) => !((vals[k] ?? '').trim()));
    try {
      if (rows.length) await supabase.from('config').upsert(rows);
      if (empties.length) await supabase.from('config').delete().in('key', empties);
      setBusy('Guardado ✓');
    } catch (e: any) { setBusy('Error: ' + (e?.message ?? 'desconocido')); }
  }

  return (
    <>
      <h2>Textos de la página</h2>
      <p className="hint-pick">Edita los textos principales de la página de inicio. Si dejas un campo vacío, se usa el texto por defecto.</p>
      {busy && <div className="busy">{busy}</div>}
      <div className="form-card">
        {FIELDS.map((f) => (
          <div className="field" key={f.key}>
            <label>{f.label}</label>
            {f.type === 'textarea'
              ? <textarea rows={3} value={vals[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
              : <input value={vals[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />}
          </div>
        ))}
        <div className="dc-actions">
          <button className="send" style={{ width: 'auto' }} onClick={guardar}>Guardar textos</button>
        </div>
      </div>
    </>
  );
}
