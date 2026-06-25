'use client';

import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { CONTACTO } from '@/lib/seed-data';

const TIPOS = [
  'Botes de pesca',
  'Embarcaciones recreativas',
  'Embarcaciones para trabajo',
  'Transporte fluvial',
  'Diseños personalizados',
  'Accesorios y equipamiento',
];

export function RequestForm({ tipoInicial = '' }: { tipoInicial?: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    nombre: '', tel: '', ciudad: '', email: '',
    tipo: tipoInicial || TIPOS[0],
    uso: '', eslora: '', capacidad: '', motor: '', mensaje: '',
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit() {
    if (!f.nombre || !f.tel) return;
    setBusy(true);
    const supabase = getBrowserClient();
    try {
      if (supabase) {
        await supabase.from('solicitudes').insert({
          tipo: f.tipo,
          cliente_nombre: f.nombre,
          cliente_tel: f.tel,
          cliente_email: f.email || null,
          cliente_ciudad: f.ciudad || null,
          uso: f.uso || null,
          eslora_aprox: f.eslora || null,
          capacidad_aprox: f.capacidad || null,
          motor_pref: f.motor || null,
          mensaje: f.mensaje || null,
        });
      }
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="form-card">
        <div className="done">
          <div className="ic">✓</div>
          <h3 className="disp">Solicitud enviada a revisión</h3>
          <p>
            Recibimos tu requerimiento. Nuestro equipo lo revisa y te contacta con una propuesta
            ajustada. También puedes escribirnos directo por WhatsApp al {CONTACTO.whatsapp}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="row2">
        <div className="field"><label>Nombre completo *</label>
          <input value={f.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Tu nombre" /></div>
        <div className="field"><label>WhatsApp / Teléfono *</label>
          <input value={f.tel} onChange={(e) => set('tel', e.target.value)} placeholder="300 000 0000" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Ciudad</label>
          <input value={f.ciudad} onChange={(e) => set('ciudad', e.target.value)} placeholder="Villavicencio" /></div>
        <div className="field"><label>Correo</label>
          <input value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@email.com" /></div>
      </div>
      <div className="field"><label>Tipo de embarcación</label>
        <select value={f.tipo} onChange={(e) => set('tipo', e.target.value)}>
          {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="row2">
        <div className="field"><label>Uso previsto</label>
          <input value={f.uso} onChange={(e) => set('uso', e.target.value)} placeholder="Pesca, turismo, carga…" /></div>
        <div className="field"><label>Motor de preferencia</label>
          <input value={f.motor} onChange={(e) => set('motor', e.target.value)} placeholder="Marca / potencia (opcional)" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Eslora aproximada</label>
          <input value={f.eslora} onChange={(e) => set('eslora', e.target.value)} placeholder="Ej. 6 m (opcional)" /></div>
        <div className="field"><label>Capacidad aproximada</label>
          <input value={f.capacidad} onChange={(e) => set('capacidad', e.target.value)} placeholder="Ej. 8 personas (opcional)" /></div>
      </div>
      <div className="field"><label>Cuéntanos más sobre tu proyecto</label>
        <textarea rows={4} value={f.mensaje} onChange={(e) => set('mensaje', e.target.value)}
          placeholder="Detalles, distribución, equipamiento, zona de navegación…" /></div>
      <button className="send" onClick={submit} disabled={busy || !f.nombre || !f.tel}>
        {busy ? 'Enviando…' : 'Enviar solicitud a revisión'}
      </button>
      <p className="smallprint">
        Compártenos las características de la embarcación que necesitas y nuestro equipo te envía una
        propuesta ajustada a tus requerimientos. Los campos con * son obligatorios.
      </p>
    </div>
  );
}
