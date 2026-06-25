import Link from 'next/link';
import { HullArt } from './HullArt';
import type { ProductCategory } from '@/lib/types';

export function CategoryCard({ c }: { c: ProductCategory }) {
  return (
    <article className="card">
      <div className="ph">
        <HullArt forma={c.forma} hex={c.hex} />
      </div>
      <div className="card-b">
        <h3>{c.nombre}</h3>
        <p className="mdesc">{c.resumen}</p>
        <ul className="usos">
          {c.usos.map((u) => <li key={u}>{u}</li>)}
        </ul>
        <div className="actions">
          <Link className="a-prim" href={`/productos/${c.slug}`}>Ver y solicitar</Link>
        </div>
      </div>
    </article>
  );
}
