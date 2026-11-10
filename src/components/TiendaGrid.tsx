'use client';

import { useState } from 'react';
import { HullArt } from './HullArt';
import { CONTACTO } from '@/lib/seed-data';
import type { Articulo } from '@/lib/types';

function precioCOP(n: number | null): string {
  if (n == null) return 'Consultar';
  return '$' + new Intl.NumberFormat('es-CO').format(n);
}

function ArticuloCard({ a }: { a: Articulo }) {
  const [colorSel, setColorSel] = useState<string>(a.colores[0]?.nombre ?? '');
  const cover = a.imagenes[0];

  const partes = [`Hola, me interesa este artículo: ${a.nombre}.`];
  if (a.precio != null) partes.push(`Precio: ${precioCOP(a.precio)}.`);
  if (colorSel) partes.push(`Color: ${colorSel}.`);
  const wa = `${CONTACTO.whatsappLink}?text=${encodeURIComponent(partes.join(' '))}`;

  return (
    <article className="art-card">
      <div className="art-ph">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={a.nombre} width="800" height="800" loading="lazy" decoding="async" />
        ) : (
          <HullArt forma="v" hex="#AEB8C2" />
        )}
      </div>
      <div className="art-b">
        <h3>{a.nombre}</h3>
        {a.descripcion && <p className="art-desc">{a.descripcion}</p>}

        {a.colores.length > 0 && (
          <div className="art-colores">
            <span className="art-colores-lbl">Color: <b>{colorSel}</b></span>
            <div className="swatches">
              {a.colores.map((c) => (
                <button
                  key={c.nombre}
                  className={`swatch ${colorSel === c.nombre ? 'on' : ''}`}
                  style={{ background: c.hex }}
                  title={c.nombre}
                  aria-label={c.nombre}
                  onClick={() => setColorSel(c.nombre)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="art-foot">
          <span className="art-precio">{precioCOP(a.precio)}</span>
          <a className="a-prim" href={wa} target="_blank" rel="noopener noreferrer">
            Comprar <span className="arr">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function TiendaGrid({ articulos }: { articulos: Articulo[] }) {
  return (
    <div className="art-grid">
      {articulos.map((a) => <ArticuloCard key={a.id} a={a} />)}
    </div>
  );
}
