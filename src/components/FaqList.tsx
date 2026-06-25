'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/types';

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {faqs.map((q, i) => {
        const on = open === i;
        return (
          <div className={`faq-item ${on ? 'on' : ''}`} key={i}>
            <button className="faq-q" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
              <span>{q.pregunta}</span>
              <span className="faq-ic">{on ? '–' : '+'}</span>
            </button>
            {on && <div className="faq-a">{q.respuesta}</div>}
          </div>
        );
      })}
    </div>
  );
}
