import Link from 'next/link';
import { WaveMark } from './HullArt';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo"><WaveMark /> Alutreck</Link>
        <nav className="menu">
          <Link href="/#nosotros">Nosotros</Link>
          <Link href="/#productos">Productos</Link>
          <Link href="/#preguntas">Preguntas</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <Link href="/#contacto" className="btn-ghost">Solicitar cotización</Link>
      </div>
    </header>
  );
}
