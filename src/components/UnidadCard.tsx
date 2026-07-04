import { HullArt } from './HullArt';
import { CONTACTO } from '@/lib/seed-data';
import type { UnidadDisponible } from '@/lib/types';

export function UnidadCard({ u }: { u: UnidadDisponible }) {
  const cover = u.imagenes[0];
  const msg = `Hola, me interesa la ${u.modelo}${u.titulo ? ` (${u.titulo})` : ''} disponible para entrega inmediata.`;
  const wa = `${CONTACTO.whatsappLink}?text=${encodeURIComponent(msg)}`;

  const ficha: [string, string][] = [
    ['Eslora', u.eslora],
    ['Altura espejo', u.altura_espejo],
    ['Altura banda', u.altura_banda],
    ['Ancho de piso', u.ancho_piso],
    ['Capacidad', u.capacidad_carga],
    ['Bancas', u.cantidad_bancas],
  ];

  return (
    <article className="ucard">
      <div className="uph">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ph-img" src={cover} alt={u.modelo} width="1600" height="1000" loading="lazy" decoding="async" />
        ) : (
          <HullArt forma={u.forma} hex={u.hex} />
        )}
        <span className={`ubadge ${u.estado}`}>{u.estado === 'reservada' ? 'Reservada' : 'Disponible'}</span>
      </div>
      <div className="ucard-b">
        <span className="umodelo">{u.modelo}</span>
        <h3>{u.titulo ?? `${u.modelo} · entrega inmediata`}</h3>

        <div className="ficha">
          {ficha.filter(([, v]) => v).map(([k, v]) => (
            <div className="fi" key={k}><span className="fi-k">{k}</span><span className="fi-v">{v}</span></div>
          ))}
        </div>

        {u.equipamiento && <p className="uequip">{u.equipamiento}</p>}

        <a className="a-prim" href={wa}>Me interesa <span className="arr">→</span></a>
      </div>
    </article>
  );
}
