import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { Boat360Viewer } from '@/components/Boat360Viewer';
import { Gallery } from '@/components/Gallery';
import { RequestForm } from '@/components/RequestForm';
import { Logo } from '@/components/Logo';
import { getModels, getModelBySlug } from '@/lib/queries';
import { CONTACTO } from '@/lib/seed-data';

export const revalidate = 60;

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const m = await getModelBySlug(params.slug);
  if (!m) return { title: 'No encontrado · Alutreck' };
  return { title: `${m.nombre} · Alutreck SAS`, description: m.resumen };
}

export default async function ModelPage({ params }: { params: { slug: string } }) {
  const m = await getModelBySlug(params.slug);
  if (!m) notFound();

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb"><Link href="/#productos">Modelos</Link> / <b>{m.nombre}</b></div>

        <div className="detail">
          <div className="viewer-col">
            <Boat360Viewer frames={m.frames360} forma={m.forma} hex={m.hex} />
            <Gallery imagenes={m.imagenes} nombre={m.nombre} />
            {m.videos.length > 0 && (
              <div className="videos">
                {m.videos.map((src, i) => (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video key={i} className="video" src={src} controls preload="metadata" />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="d-title">{m.nombre}</h1>
            <p className="d-long">{m.descripcion}</p>

            {m.usos.length > 0 && (
              <div className="usos-block">
                <span className="eyebrow">Ideal para</span>
                <ul className="usos">{m.usos.map((u) => <li key={u}>{u}</li>)}</ul>
              </div>
            )}

            <div className="detail-cta">
              <p className="dc-note">Esta embarcación se fabrica a pedido. Define las características que necesitas y te enviamos una propuesta a revisión.</p>
              <div className="dc-actions">
                <a className="btn btn-solid" href="#solicitar">Cotizar este modelo</a>
                <a className="btn btn-line" href={CONTACTO.whatsappLink}>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        <section className="request-section" id="solicitar">
          <div className="request-head">
            <span className="eyebrow">Solicitud de cotización</span>
            <h2 className="disp">Cotiza tu {m.nombre}</h2>
            <p>Indícanos las medidas que necesitas. Revisamos tu requerimiento y te contactamos con la propuesta.</p>
          </div>
          <RequestForm modeloInicial={m.nombre} />
        </section>
      </div>

      <footer className="site-footer">
        <div className="wrap foot">
          <Logo light />
          <div className="small">Embarcaciones en aluminio naval · Villavicencio, Meta</div>
        </div>
      </footer>
    </>
  );
}
