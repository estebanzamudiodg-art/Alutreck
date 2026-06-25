'use client';

import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { CONTACTO, MODELS } from '@/lib/seed-data';

export function RequestForm({ modeloInicial = '' }: { modeloInicial?: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    nombre: '', tel: '', ciudad: '', email: '',
    modelo: modeloInicial || MODELS[0].nombre,
    // características que elige el cliente
    eslora: '', altura_espejo: '', altura_banda: '',
    ancho_piso: '', capacidad_carga: '', cantidad_bancas: '',
    mensaje: '',
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit() {
    if (!f.nombre || !f.tel) return;
    setBusy(true);
    const supabase = getBrowserClient();
    try {
      if (supabase) {
        await supabase.from('solicitudes').insert({
          modelo: f.modelo,
          cliente_nombre: f.nombre,
          cliente_tel: f.tel,
          cliente_email: f.email || null,
          cliente_ciudad: f.ciudad || null,
          eslora: f.eslora || null,
          altura_espejo: f.altura_espejo || null,
          altura_banda: f.altura_banda || null,
          ancho_piso: f.ancho_piso || null,
          capacidad_carga: f.capacidad_carga || null,
          cantidad_bancas: f.cantidad_bancas || null,
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
            Recibimos tu requerimiento de la {f.modelo}. Nuestro equipo lo revisa y te contacta con
            una propuesta ajustada. También puedes escribirnos por WhatsApp al {CONTACTO.whatsapp}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-sec">Tus datos</div>
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
      <div className="field"><label>Modelo</label>
        <select value={f.modelo} onChange={(e) => set('modelo', e.target.value)}>
          {MODELS.map((m) => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
        </select>
      </div>

      <div className="form-sec">Características de tu embarcación</div>
      <div className="row2">
        <div className="field"><label>Eslora (longitud total)</label>
          <input value={f.eslora} onChange={(e) => set('eslora', e.target.value)} placeholder="Ej. 7 m" /></div>
        <div className="field"><label>Altura del espejo</label>
          <input value={f.altura_espejo} onChange={(e) => set('altura_espejo', e.target.value)} placeholder="Ej. 50 cm" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Altura de la banda</label>
          <input value={f.altura_banda} onChange={(e) => set('altura_banda', e.target.value)} placeholder="Ej. 60 cm" /></div>
        <div className="field"><label>Ancho de piso</label>
          <input value={f.ancho_piso} onChange={(e) => set('ancho_piso', e.target.value)} placeholder="Ej. 1.2 m" /></div>
      </div>
      <div className="row2">
        <div className="field"><label>Capacidad de carga</label>
          <input value={f.capacidad_carga} onChange={(e) => set('capacidad_carga', e.target.value)} placeholder="Ej. 800 kg / 6 personas" /></div>
        <div className="field"><label>Cantidad de bancas</label>
          <input value={f.cantidad_bancas} onChange={(e) => set('cantidad_bancas', e.target.value)} placeholder="Ej. 3" /></div>
      </div>

      <div className="field"><label>Comentarios adicionales</label>
        <textarea rows={3} value={f.mensaje} onChange={(e) => set('mensaje', e.target.value)}
          placeholder="Distribución, equipamiento, zona de navegación, motor de preferencia…" /></div>

      <button className="send" onClick={submit} disabled={busy || !f.nombre || !f.tel}>
        {busy ? 'Enviando…' : 'Enviar solicitud a revisión'}
      </button>
      <p className="smallprint">
        Indícanos las medidas que necesitas y revisamos tu requerimiento para enviarte una propuesta.
        Los campos con * son obligatorios.
      </p>
    </div>
  );
}
