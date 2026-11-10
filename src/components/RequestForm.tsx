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
  const [waLink, setWaLink] = useState('');
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  function construirMensajeWA(): string {
    const L: string[] = [];
    L.push('Hola Alutreck, quiero cotizar una embarcación.');
    L.push('');
    L.push(`*Modelo:* ${f.modelo}`);
    L.push(`*Nombre:* ${f.nombre}`);
    L.push(`*WhatsApp:* ${f.tel}`);
    if (f.ciudad) L.push(`*Ciudad:* ${f.ciudad}`);
    if (f.email) L.push(`*Correo:* ${f.email}`);
    const car: string[] = [];
    if (f.eslora) car.push(`- Eslora: ${f.eslora}`);
    if (f.altura_espejo) car.push(`- Altura espejo: ${f.altura_espejo}`);
    if (f.altura_banda) car.push(`- Altura banda: ${f.altura_banda}`);
    if (f.ancho_piso) car.push(`- Ancho de piso: ${f.ancho_piso}`);
    if (f.capacidad_carga) car.push(`- Capacidad: ${f.capacidad_carga}`);
    if (f.cantidad_bancas) car.push(`- Bancas: ${f.cantidad_bancas}`);
    if (car.length) { L.push(''); L.push('*Características:*'); L.push(...car); }
    if (f.mensaje) { L.push(''); L.push(`*Comentarios:* ${f.mensaje}`); }
    return `${CONTACTO.whatsappLink}?text=${encodeURIComponent(L.join('\n'))}`;
  }

  function submit() {
    if (!f.nombre || !f.tel) return;
    const wa = construirMensajeWA();
    setWaLink(wa);

    // Abrir WhatsApp en el mismo gesto del clic (evita el bloqueo de ventanas emergentes)
    window.open(wa, '_blank');

    // Guardar también en la base como respaldo (en segundo plano, no bloquea)
    const supabase = getBrowserClient();
    if (supabase) {
      supabase.from('solicitudes').insert({
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
      }).then(() => {}, () => {});
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-card">
        <div className="done">
          <div className="ic">✓</div>
          <h3 className="disp">Último paso: envía tu solicitud</h3>
          <p>
            Se abrió WhatsApp con tu solicitud de la {f.modelo} ya escrita. <strong>Solo toca
            “enviar”</strong> en WhatsApp para que nos llegue y te contactemos con una propuesta.
          </p>
          <a className="send wa-btn" href={waLink} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp y enviar
          </a>
          <p className="smallprint">
            ¿No se abrió WhatsApp? Toca el botón de arriba. O escríbenos al {CONTACTO.whatsapp}.
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

      <button className="send wa-btn" onClick={submit} disabled={busy || !f.nombre || !f.tel}>
        Enviar solicitud por WhatsApp
      </button>
      <p className="smallprint">
        Al enviar, se abre WhatsApp con tus datos ya escritos para que toques “enviar”.
        Los campos con * son obligatorios.
      </p>
    </div>
  );
}
