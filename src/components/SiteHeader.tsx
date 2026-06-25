import Link from 'next/link';
import { Logo } from './Logo';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo-link" aria-label="Alutreck SAS inicio"><Logo light /></Link>
        <nav className="menu">
          <Link href="/#inicio">Inicio</Link>
          <Link href="/#productos">Embarcaciones</Link>
          <Link href="/#nosotros">Nosotros</Link>
          <Link href="/#preguntas">Preguntas</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <Link href="/#contacto" className="btn-cta">Cotiza ahora <span className="arr">→</span></Link>
      </div>
    </header>
  );
}
