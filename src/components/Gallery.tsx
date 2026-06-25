'use client';

import { useState } from 'react';

export function Gallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [active, setActive] = useState(0);
  if (imagenes.length === 0) return null;

  return (
    <div className="gallery">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gallery-main" src={imagenes[active]} alt={`${nombre} ${active + 1}`} />
      {imagenes.length > 1 && (
        <div className="gallery-thumbs">
          {imagenes.map((src, i) => (
            <button
              key={i}
              className={`gthumb ${i === active ? 'on' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
