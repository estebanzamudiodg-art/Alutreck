// Íconos de línea para las franjas de características.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconShield = () => (
  <svg viewBox="0 0 24 24" {...P}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const IconCheck = () => (
  <svg viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-5" /></svg>
);
export const IconGear = () => (
  <svg viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>
);
export const IconWrench = () => (
  <svg viewBox="0 0 24 24" {...P}><path d="M14 7a4 4 0 0 0-5 5l-6 6 2 2 6-6a4 4 0 0 0 5-5l-2 2-2-2 2-2z" /></svg>
);
export const IconBoat = () => (
  <svg viewBox="0 0 24 24" {...P}><path d="M3 14l9-2 9 2-2 5H5l-2-5z" /><path d="M12 12V4l5 3-5 1" /></svg>
);
export const IconAnchor = () => (
  <svg viewBox="0 0 24 24" {...P}><circle cx="12" cy="5" r="2" /><path d="M12 7v13M5 14a7 7 0 0 0 14 0M5 14H3M19 14h2" /></svg>
);
export const IconHandshake = () => (
  <svg viewBox="0 0 24 24" {...P}><path d="M8 12l3 3 2-2 3 3M3 10l4-3 5 2 5-2 4 3M3 10v5M21 10v5" /></svg>
);
export const IconLayers = () => (
  <svg viewBox="0 0 24 24" {...P}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></svg>
);
