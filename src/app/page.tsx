import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { CategoryCard } from '@/components/CategoryCard';
import { RequestForm } from '@/components/RequestForm';
import { FaqList } from '@/components/FaqList';
import { Bathy, HullArt, WaveMark } from '@/components/HullArt';
import { getCategories } from '@/lib/queries';
import { DIFERENCIALES, BENEFICIOS_ALUMINIO, FAQS, CONTACTO } from '@/lib/seed-data';

export const revalidate = 60;

export default async function HomePage() {
  const categorias = await getCategories();

  return (
    <>
      <SiteHeader />

      {/* HERO */}
      <section className="hero">
        <Bathy />
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow">Aluminio naval · Villavicencio, Meta</span>
            <h1 className="disp">Embarcaciones en aluminio naval, <em>fabricadas para durar.</em></h1>
            <p className="lede">
              Diseñamos y fabricamos embarcaciones para quienes buscan seguridad, resistencia y
              desempeño en ríos, lagunas y embalses. Soluciones náuticas a tu medida.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-solid" href="#productos">Ver productos</Link>
              <Link className="btn btn-line" href="#contacto">Solicitar cotización →</Link>
            </div>
          </div>
          <div className="hero-art">
            <HullArt forma="v" hex="#8A9499" />
            <span className="cap">Render — aquí va la foto real de la embarcación</span>
          </div>
        </div>
      </section>

      {/* DIFERENCIALES */}
      <div className="creds">
        <div className="wrap creds-strip">
          {DIFERENCIALES.map((d) => <div className="cred-item" key={d}><span className="tick">✔</span>{d}</div>)}
        </div>
      </div>

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

      {/* POR QUÉ ALUMINIO NAVAL */}
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

      {/* PRODUCTOS */}
      <section className="models" id="productos">
        <div className="wrap">
          <div className="models-head">
            <div>
              <span className="eyebrow">Productos</span>
              <h2 className="disp">Soluciones para cada necesidad de navegación</h2>
            </div>
            <p>Elige el tipo de embarcación y envíanos tu solicitud. Trabajamos modelos estándar y personalizados.</p>
          </div>
          <div className="grid-models">
            {categorias.map((c) => <CategoryCard key={c.id} c={c} />)}
          </div>
          <p className="note">Los renders son ilustraciones de referencia. En el sitio van las fotografías reales y el visor 360° de cada embarcación.</p>
        </div>
      </section>

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
              Alutreck sea sinónimo de excelencia, respaldo y durabilidad, acompañando a familias,
              pescadores, emprendedores y trabajadores en sus mejores historias sobre el agua.
            </p>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="faqs" id="preguntas">
        <div className="wrap faqs-grid">
          <div className="faqs-head">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="disp">Lo que suelen preguntarnos</h2>
          </div>
          <FaqList faqs={FAQS} />
        </div>
      </section>

      {/* CONTACTO + SOLICITUD */}
      <section className="contact" id="contacto">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Contacto</span>
            <h2 className="disp">Hablemos de tu próximo proyecto</h2>
            <p className="contact-lede">
              Estamos listos para asesorarte y ayudarte a encontrar la embarcación ideal para tus
              necesidades. Compártenos las características y te enviamos una propuesta ajustada.
            </p>
            <div className="contact-data">
              <div className="cd"><span className="cd-k">Ubicación</span><span className="cd-v">{CONTACTO.ciudad}</span></div>
              <div className="cd"><span className="cd-k">WhatsApp y llamadas</span><a className="cd-v link" href={CONTACTO.whatsappLink}>{CONTACTO.whatsapp}</a></div>
              <div className="cd"><span className="cd-k">Correo electrónico</span><a className="cd-v link" href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a></div>
            </div>
          </div>
          <div>
            <RequestForm />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap foot">
          <div><span className="logo" style={{ fontSize: 18 }}><WaveMark /> Alutreck SAS</span></div>
          <div>Embarcaciones en aluminio naval · Villavicencio, Meta · Envíos a toda Colombia</div>
        </div>
      </footer>
    </>
  );
}
