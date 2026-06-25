// Siluetas placeholder. Se reemplazan por la foto real / visor 360 del modelo.

export function HullArt({ forma, hex }: { forma: 'v' | 'pontoon'; hex: string }) {
  if (forma === 'pontoon') {
    return (
      <svg className="art" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="205" cy="172" rx="150" ry="12" fill="#1C7C6F" opacity=".12" />
        <rect x="60" y="124" width="290" height="24" rx="12" fill={hex} />
        <rect x="60" y="108" width="280" height="20" rx="6" fill="#fff" fillOpacity=".85" />
        <path d="M70 108 v-16 a8 8 0 0 1 8 -8 h244 a8 8 0 0 1 8 8 v16" fill="none" stroke={hex} strokeWidth="3" />
        <path d="M150 86 q60 -34 120 0" fill="none" stroke="#2A3A3C" strokeWidth="3" />
        <rect x="20" y="120" width="20" height="30" rx="4" fill="#2A3A3C" />
      </svg>
    );
  }
  return (
    <svg className="art" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="205" cy="168" rx="150" ry="13" fill="#1C7C6F" opacity=".12" />
      <path d="M40 118 C70 96 150 86 360 92 C372 92 380 96 372 104 L350 142 C300 154 150 154 80 142 Z" fill={hex} />
      <path d="M80 118 C170 104 300 104 360 110" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
      <path d="M150 116 L168 90 L250 92 L262 114 Z" fill="#fff" fillOpacity=".82" />
      <path d="M168 96 L246 98 L243 110 L171 108 Z" fill={hex} fillOpacity=".35" />
      <rect x="20" y="112" width="22" height="34" rx="4" fill="#2A3A3C" />
      <path d="M28 146 l-4 12 8 0 z" fill="#2A3A3C" />
    </svg>
  );
}

export function WaveMark() {
  return (
    <svg className="wv" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 8c2.5-3 5-3 7.5 0S15 11 17.5 8 22 5 22 5M2 14c2.5-3 5-3 7.5 0S15 17 17.5 14 22 11 22 11M2 20c2.5-3 5-3 7.5 0S15 23 17.5 20" />
    </svg>
  );
}

export function Bathy({ className = 'bathy' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#1C7C6F" strokeWidth="1.4">
        <path d="M-50,120 C250,60 500,180 800,110 1100,50 1300,150 1300,150" />
        <path d="M-50,190 C260,140 520,250 820,185 1120,125 1300,210 1300,210" />
        <path d="M-50,270 C260,225 520,330 820,265 1120,205 1300,290 1300,290" />
        <path d="M-50,360 C260,315 520,420 820,355 1120,295 1300,380 1300,380" />
        <path d="M-50,450 C260,405 520,510 820,445 1120,385 1300,470 1300,470" />
      </g>
    </svg>
  );
}
