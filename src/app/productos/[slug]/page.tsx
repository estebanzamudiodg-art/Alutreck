import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { Boat360Viewer } from '@/components/Boat360Viewer';
import { RequestForm } from '@/components/RequestForm';
import { WaveMark } from '@/components/HullArt';
import { getCategories, getCategoryBySlug } from '@/lib/queries';
import { CONTACTO } from '@/lib/seed-data';

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = await getCategoryBySlug(params.slug);
  if (!c) return { title: 'No encontrado · Alutreck' };
  return { title: `${c.nombre} · Alutreck SAS`, description: c.resumen };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const c = await getCategoryBySlug(params.slug);
  if (!c) notFound();

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb"><Link href="/#productos">Productos</Link> / <b>{c.nombre}</b></div>

        <div className="detail">
          <div className="viewer-col">
            <Boat360Viewer frames={c.frames360 ?? []} forma={c.forma} hex={c.hex} />
          </div>

          <div>
            <h1 className="d-title">{c.nombre}</h1>
            <p className="d-long">{c.descripcion}</p>

            {c.usos.length > 0 && (
              <div className="usos-block">
                <span className="eyebrow">Usos típicos</span>
                <ul className="usos">
                  {c.usos.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </div>
            )}

            <div className="detail-cta">
              <p className="dc-note">Esta embarcación se fabrica a pedido. Cuéntanos las características que necesitas y te enviamos una propuesta a revisión.</p>
              <a className="btn btn-line" href={`${CONTACTO.whatsappLink}`}>Escribir por WhatsApp</a>
            </div>
          </div>
        </div>

        {/* SOLICITUD */}
        <section className="request-section" id="solicitar">
          <div className="request-head">
            <span className="eyebrow">Solicitud de cotización</span>
            <h2 className="disp">Arma tu {c.nombre.toLowerCase()}</h2>
            <p>Sin compromiso. Revisamos tu requerimiento y te contactamos con la propuesta.</p>
          </div>
          <RequestForm tipoInicial={c.nombre} />
        </section>
      </div>

      <footer className="site-footer">
        <div className="wrap foot">
          <div><span className="logo" style={{ fontSize: 18 }}><WaveMark /> Alutreck SAS</span></div>
          <div>Embarcaciones en aluminio naval · Villavicencio, Meta</div>
        </div>
      </footer>
    </>
  );
}
