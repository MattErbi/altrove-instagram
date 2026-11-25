import React from 'react';
import { C } from '../brand';

export const Coin = ({ s = 100, txt = '€' }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill={C.tqd} /><circle cx="50" cy="46" r="45" fill={C.tq} /><circle cx="50" cy="46" r="35" fill="none" stroke={C.tql} strokeWidth="3" opacity=".55" /><text x="50" y="47" textAnchor="middle" dominantBaseline="central" fontFamily="Unbounded" fontWeight="800" fontSize="46" fill={C.cream}>{txt}</text></svg>
);
export const Person = ({ s }) => (<svg width={s} height={s} viewBox="0 0 100 100"><circle cx="50" cy="34" r="17" fill={C.cream} /><path d="M20 84c0-17 13-28 30-28s30 11 30 28z" fill={C.cream} /></svg>);
export const Shop = ({ s }) => (<svg width={s} height={s} viewBox="0 0 100 100"><rect x="16" y="40" width="68" height="44" rx="5" fill={C.ink} /><path d="M10 40l10-20h60l10 20z" fill={C.sun} /><path d="M10 40h80" stroke={C.ink} strokeWidth="3" /><rect x="42" y="56" width="16" height="28" rx="3" fill={C.cream} /><rect x="24" y="52" width="12" height="12" rx="2" fill={C.cream} /><rect x="64" y="52" width="12" height="12" rx="2" fill={C.cream} /></svg>);
export const Plane = ({ s, c = C.ink }) => (<svg width={s} height={s} viewBox="0 0 100 100"><path d="M88 46c4 0 6 2 6 4s-2 4-6 4H62L44 84h-9l9-30H26l-7 9h-8l5-13-5-13h8l7 9h18L35 16h9l18 30z" fill={c} /></svg>);
export const Bed = ({ s, c = C.ink }) => (<svg width={s} height={s} viewBox="0 0 100 100"><rect x="8" y="26" width="9" height="56" rx="3" fill={c} /><rect x="8" y="58" width="84" height="12" rx="3" fill={c} /><rect x="83" y="58" width="9" height="24" rx="3" fill={c} /><rect x="22" y="44" width="20" height="12" rx="5" fill={c} /><path d="M46 56V46c0-4 3-6 7-6h30c5 0 9 4 9 9v7z" fill={c} /></svg>);
export const Ticket = ({ s, c = C.ink }) => (<svg width={s} height={s} viewBox="0 0 100 100"><path d="M12 28h76v14a8 8 0 0 0 0 16v14H12V58a8 8 0 0 0 0-16z" fill={c} /><path d="M50 37l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill={C.cream} /></svg>);
export const Check = ({ s, bg = C.tq }) => (<svg width={s} height={s} viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill={bg} /><path d="M29 52l14 14 29-31" fill="none" stroke={C.cream} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /></svg>);
export const Clock = ({ s, t = 0 }) => (<svg width={s} height={s} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill={C.white} stroke={C.ink} strokeWidth="7" /><path d="M50 50V27" stroke={C.ink} strokeWidth="7" strokeLinecap="round" transform={`rotate(${t * 75} 50 50)`} /><path d="M50 50V18" stroke={C.tq} strokeWidth="5" strokeLinecap="round" transform={`rotate(${t * 900} 50 50)`} /><circle cx="50" cy="50" r="5" fill={C.ink} /></svg>);
// logo monogram: morph 0 = "al", 1 = "ai"
export const Mono = ({ s, ink = C.cream, morph = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><circle cx="38" cy="62" r="18" fill="none" stroke={ink} strokeWidth="11" /><path d="M56 44 V80" stroke={ink} strokeWidth="11" strokeLinecap="round" /><path d="M80 46 V80" stroke={ink} strokeWidth="11" strokeLinecap="round" /><path d="M80 20 V50" stroke={C.sun} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${30 - 29.99 * morph} 200`} /></svg>
);
export const Bokeh = ({ items }) => (<>{items.map(([x, y, r, c, o], i) => <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: c, opacity: o ?? 0.7, filter: 'blur(50px)' }} />)}</>);
