'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

const LINKS = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#productos', label: 'Embarcaciones' },
  { href: '/#disponibles', label: 'Entrega inmediata' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#preguntas', label: 'Preguntas' },
  { href: '/#contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo-link" aria-label="Alutreck SAS inicio" onClick={() => setOpen(false)}><Logo light /></Link>

        <nav className="menu">
          {LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>

        <Link href="/#contacto" className="btn-cta cta-desktop">Cotiza ahora <span className="arr">&rarr;</span></Link>

        <button
          className={`burger ${open ? 'open' : ''}`}
          aria-label={open ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-nav ${open ? 'show' : ''}`} onClick={() => setOpen(false)}>
        <nav className="mobile-nav-in" onClick={(e) => e.stopPropagation()}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="m-link" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/#contacto" className="btn btn-solid m-cta" onClick={() => setOpen(false)}>
            Cotiza ahora <span className="arr">&rarr;</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
