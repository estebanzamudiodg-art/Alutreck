import { HullArt } from './HullArt';

export function SectionImage({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="sec-img" src={src} alt={alt} width="1200" height="900" loading="lazy" decoding="async" />;
  }
  return (
    <div className="sec-ph">
      <HullArt forma="v" hex="#AEB8C2" />
      <span className="cap">Espacio para imagen</span>
    </div>
  );
}
