import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { ModelCard } from '@/components/ModelCard';
import { UnidadCard } from '@/components/UnidadCard';
import { RequestForm } from '@/components/RequestForm';
import { FaqList } from '@/components/FaqList';
import { Logo } from '@/components/Logo';
import { HullArt } from '@/components/HullArt';
import { IconShield, IconCheck, IconGear, IconWrench, IconAnchor, IconHandshake, IconLayers } from '@/components/Icons';
import { getModels, getUnidadesDisponibles } from '@/lib/queries';
import { BENEFICIOS_ALUMINIO, FAQS, CONTACTO } from '@/lib/seed-data';

export const revalidate = 60;

export default async function HomePage() {
  const modelos = await getModels();
  const unidades = await getUnidadesDisponibles();

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Aluminio naval · Villavicencio, Meta</span>
            <h1>Embarcaciones en aluminio naval <em>Diseñadas para navegar, construidas para durar.</em></h1>
            <p className="lede">
              Fabricamos embarcaciones de alta calidad en aluminio naval, garantizando seguridad,
              desempeño y resistencia en cada travesía. Soluciones náuticas a tu medida.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-solid" href="#productos">Ver modelos <span className="arr">→</span></Link>
              <Link className="btn btn-line" href="#contacto" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>Cotiza ahora <span className="arr">→</span></Link>
            </div>
          </div>
          <div className="hero-art">
            <HullArt forma="v" hex="#AEB8C2" />
            <span className="cap">Aquí va la foto real de la embarcación</span>
          </div>
        </div>

        {/* franja de features */}
        <div className="features">
          <div className="wrap features-in">
            <div className="feat"><IconShield /><b>Aluminio naval<br />de alta calidad</b></div>
            <div className="feat"><IconCheck /><b>Diseño y fabricación<br />colombiana</b></div>
            <div className="feat"><IconGear /><b>Acabados<br />premium</b></div>
            <div className="feat"><IconWrench /><b>Servicio y soporte<br />garantizado</b></div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="about" id="nosotros">
        <div className="wrap about-grid">
          <div>
            <span className="eyebrow">Nosotros</span>
            <h2 className="disp">Pasión por fabricar embarcaciones confiables</h2>
          </div>
          <div>
            <p>
              En Alutreck SAS creemos que una embarcación es mucho más que un medio de transporte: es
              una herramienta de trabajo, una inversión y una fuente de experiencias. Por eso nos
              especializamos en la fabricación de embarcaciones menores en aluminio naval, con
              materiales de alta calidad y procesos que garantizan resistencia, seguridad y larga vida
              útil.
            </p>
            <p>
              Desde Villavicencio, Meta, atendemos clientes en todo el país, desarrollando
              embarcaciones para pesca, recreación, turismo, transporte y trabajo. Cada bote que sale
              de nuestro taller refleja nuestro compromiso con la calidad y la atención al detalle.
            </p>
          </div>
        </div>
      </section>

      {/* POR QUÉ ALUMINIO */}
      <section className="why">
        <div className="wrap why-grid">
          <div>
            <span className="eyebrow">El material</span>
            <h2 className="disp">¿Por qué aluminio naval?</h2>
            <p className="why-lede">
              Es uno de los materiales más valorados en la industria marítima. Estas son sus ventajas
              frente a otras opciones.
            </p>
          </div>
          <ul className="benefits">
            {BENEFICIOS_ALUMINIO.map((b) => <li key={b}><span className="bdot" />{b}</li>)}
          </ul>
        </div>
      </section>

      {/* MODELOS */}
      <section className="models" id="productos">
        <div className="wrap">
          <div className="models-head">
            <div>
              <span className="eyebrow">Embarcaciones</span>
              <h2 className="disp">Nuestros modelos</h2>
            </div>
            <p>Elige tu modelo, define las características y envíanos tu solicitud. Trabajamos modelos estándar y personalizados.</p>
          </div>
          <div className="grid-models grid-3">
            {modelos.map((m) => <ModelCard key={m.id} m={m} />)}
          </div>
          <p className="note">Los renders son ilustraciones de referencia. Las fotos reales y el visor 360° se cargan desde el panel de administración.</p>
        </div>
      </section>

      {/* ENTREGA INMEDIATA */}
      {unidades.length > 0 && (
        <section className="disponibles" id="disponibles">
          <div className="wrap">
            <div className="models-head">
              <div>
                <span className="eyebrow">Entrega inmediata</span>
                <h2 className="disp">Listas para entregar</h2>
              </div>
              <p>Embarcaciones ya construidas y disponibles. Ficha fija, sin espera de fabricación.</p>
            </div>
            <div className="grid-models grid-3">
              {unidades.map((u) => <UnidadCard key={u.id} u={u} />)}
            </div>
          </div>
        </section>
      )}

      {/* MISIÓN / VISIÓN */}
      <section className="mv">
        <div className="wrap mv-grid">
          <div className="mv-card">
            <span className="eyebrow">Misión</span>
            <p>
              Construimos mucho más que embarcaciones; construimos confianza, oportunidades y
              experiencias que unen a las personas con el agua. Fabricamos en aluminio naval con
              altos estándares de calidad, seguridad y durabilidad, acompañando a nuestros clientes en
              cada proyecto, aventura y jornada de trabajo.
            </p>
          </div>
          <div className="mv-card">
            <span className="eyebrow">Visión</span>
            <p>
              Ser una empresa reconocida en Colombia por transformar el aluminio naval en
              embarcaciones que inspiren confianza, seguridad y orgullo. Queremos que cada embarcación
              Alutreck sea sinónimo de excelencia, respaldo y durabilidad.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faqs" id="preguntas">
        <div className="wrap faqs-grid">
          <div className="faqs-head">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="disp">Lo que suelen preguntarnos</h2>
          </div>
          <FaqList faqs={FAQS} />
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contact" id="contacto">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Contacto</span>
            <h2 className="disp">Hablemos de tu próximo proyecto</h2>
            <p className="contact-lede">
              Estamos listos para asesorarte y ayudarte a encontrar la embarcación ideal. Compártenos
              las características y te enviamos una propuesta ajustada.
            </p>
            <div className="contact-data">
              <div className="cd"><span className="cd-k">Ubicación</span><span className="cd-v">{CONTACTO.ciudad}</span></div>
              <div className="cd"><span className="cd-k">WhatsApp y llamadas</span><a className="cd-v link" href={CONTACTO.whatsappLink}>{CONTACTO.whatsapp}</a></div>
              <div className="cd"><span className="cd-k">Correo electrónico</span><a className="cd-v link" href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a></div>
            </div>
          </div>
          <div><RequestForm /></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="foot-features">
          <div className="wrap foot-features-in">
            <div className="ffeat"><IconShield />Seguridad en cada travesía</div>
            <div className="ffeat"><IconLayers />Aluminio naval de alta calidad</div>
            <div className="ffeat"><IconGear />Ingeniería y tecnología</div>
            <div className="ffeat"><IconAnchor />Acabados premium</div>
            <div className="ffeat"><IconHandshake />Compromiso con clientes</div>
          </div>
        </div>
        <div className="wrap foot">
          <Logo light />
          <div className="small">Embarcaciones en aluminio naval · Villavicencio, Meta · Envíos a toda Colombia</div>
        </div>
      </footer>
    </>
  );
}
