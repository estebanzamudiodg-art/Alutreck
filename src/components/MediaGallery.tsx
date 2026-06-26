'use client';

import { useState } from 'react';

export function MediaGallery({
  imagenes, videos, nombre,
}: { imagenes: string[]; videos: string[]; nombre: string }) {
  const [lb, setLb] = useState<number | null>(null);

  const close = () => setLb(null);
  const prev = () => setLb((i) => (i === null ? null : (i - 1 + imagenes.length) % imagenes.length));
  const next = () => setLb((i) => (i === null ? null : (i + 1) % imagenes.length));

  if (imagenes.length === 0 && videos.length === 0) return null;

  return (
    <>
      {imagenes.length > 0 && (
        <div className="media-grid">
          {imagenes.map((src, i) => (
            <button key={i} className="mphoto" onClick={() => setLb(i)} aria-label={`Ampliar foto ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${nombre} ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <div className="video-grid">
          {videos.map((src, i) => (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video key={i} src={src} controls preload="metadata" />
          ))}
        </div>
      )}

      {lb !== null && (
        <div className="lb" onClick={close} role="dialog" aria-modal="true">
          <button className="lb-btn lb-close" onClick={close} aria-label="Cerrar">✕</button>
          {imagenes.length > 1 && (
            <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior">‹</button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lb-img" src={imagenes[lb]} alt={`${nombre} ${lb + 1}`} onClick={(e) => e.stopPropagation()} />
          {imagenes.length > 1 && (
            <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Siguiente">›</button>
          )}
        </div>
      )}
    </>
  );
}
