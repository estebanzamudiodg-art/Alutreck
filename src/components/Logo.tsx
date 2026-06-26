// Logo de Alutreck.
//
// PARA USAR TU LOGO REAL:
// 1. Copia tu archivo a la carpeta `public/` del proyecto con el nombre logo.png
//    (o logo.svg). Quedará accesible como "/logo.png".
// 2. Cambia USAR_IMAGEN a true.
//
// Mientras tanto se muestra el wordmark estilizado, fiel a la guía de marca.

const USAR_IMAGEN = false;
const RUTA_LOGO = '/logo.png';

export function Logo({ light = false }: { light?: boolean }) {
  if (USAR_IMAGEN) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="logo-img" src={RUTA_LOGO} alt="Alutreck SAS" />;
  }
  return (
    <span className={`wordmark ${light ? 'on-dark' : ''}`}>
      <span className="wm-main">ALUTRE<span className="wm-accent">CK</span></span>
      <span className="wm-sub">S A S</span>
    </span>
  );
}
