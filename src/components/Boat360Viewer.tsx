'use client';

import { useRef, useState } from 'react';
import { HullArt } from './HullArt';

/**
 * Visor 360. Si recibe `frames` (urls de fotos del giro), arrastrar intercambia
 * los frames. Si no, muestra la silueta placeholder con giro de perspectiva.
 */
export function Boat360Viewer({
  frames,
  forma,
  hex,
}: {
  frames: string[];
  forma: 'v' | 'pontoon';
  hex: string;
}) {
  const hasFrames = frames.length > 1;
  const [deg, setDeg] = useState(40);
  const [frame, setFrame] = useState(0);
  const drag = useRef<{ on: boolean; x: number }>({ on: false, x: 0 });

  function move(clientX: number) {
    if (!drag.current.on) return;
    const dx = clientX - drag.current.x;
    drag.current.x = clientX;
    if (hasFrames) {
      const step = dx / 8;
      setFrame((f) => ((Math.round(f + step) % frames.length) + frames.length) % frames.length);
    }
    setDeg((d) => (d + dx * 0.9) % 360);
  }

  const start = (x: number) => (drag.current = { on: true, x });
  const end = () => (drag.current.on = false);
  const yaw = Math.sin((deg * Math.PI) / 180) * 24;
  const norm = ((Math.round(deg) % 360) + 360) % 360;

  return (
    <div>
      <div
        className="viewer"
        onMouseMove={(e) => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
      >
        <div className="gauge"><span className="dot" /> {String(norm).padStart(3, '0')}° · vista 360</div>
        <div
          className="stage"
          onMouseDown={(e) => start(e.clientX)}
          onTouchStart={(e) => start(e.touches[0].clientX)}
        >
          {hasFrames ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={frames[frame]} alt="Vista de la embarcación" draggable={false} />
          ) : (
            <div style={{ width: '86%', transform: `perspective(900px) rotateY(${yaw}deg)` }}>
              <HullArt forma={forma} hex={hex} />
            </div>
          )}
        </div>
        <div className="waterline" />
        <div className="hint">↔ Arrastra para girar</div>
      </div>
      {!hasFrames && (
        <p className="viewer-note">
          Vista de referencia. En producción, cada paso es una fotografía real de la embarcación
          (24–36 tomas sobre fondo limpio).
        </p>
      )}
    </div>
  );
}
