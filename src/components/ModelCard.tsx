import Link from 'next/link';
import { HullArt } from './HullArt';
import type { BoatModel } from '@/lib/types';

export function ModelCard({ m }: { m: BoatModel }) {
  const cover = m.imagenes[0];
  return (
    <article className="card">
      <div className="ph">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ph-img" src={cover} alt={m.nombre} width="1600" height="1000" loading="lazy" decoding="async" />
        ) : (
          <HullArt forma={m.forma} hex={m.hex} />
        )}
      </div>
      <div className="card-b">
        <h3>{m.nombre}</h3>
        <p className="mdesc">{m.resumen}</p>
        <ul className="usos">
          {m.usos.map((u) => <li key={u}>{u}</li>)}
        </ul>
        <div className="actions">
          <Link className="a-prim" href={`/productos/${m.slug}`}>Ver y cotizar <span className="arr">→</span></Link>
        </div>
      </div>
    </article>
  );
}
