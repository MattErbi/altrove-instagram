// Travel-themed building blocks: night sky, split-flap departure board, dot map of Europe, flying plane, clouds.
import React from 'react';
import { C, F } from '../brand';
import { sp, clamp, rnd } from '../lib';
import MAP from '../data/europe.json';

export { MAP };

// twinkling stars, deterministic; `maxY` keeps them in the upper sky
export const Stars = ({ t, n = 70, maxY = 1920, seed = 1, o = 1 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const x = rnd(i * 3 + seed) * 1080, y = rnd(i * 7 + seed + 1) * maxY, r = 1.5 + 2.8 * rnd(i + seed + 9);
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1.2 + 2 * rnd(i + 4)) + i));
      return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: C.cream, opacity: tw * o * (0.4 + 0.6 * (1 - y / maxY)), boxShadow: r > 3.4 ? `0 0 ${6 * r}px rgba(251,248,243,.7)` : 'none' }} />;
    })}
  </>
);

// one split-flap cell. f = progress of the current flip (0..1): the top half of `prev` folds down, then the bottom half of `ch` unfolds.
const Flap = ({ w, h, fs, ch, prev, f, fg, bg }) => {
  const r = Math.round(w * 0.09);
  const face = (c) => <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.brand, fontWeight: 800, fontSize: fs, color: fg, lineHeight: 1 }}>{c}</div>;
  const half = (c, top, extra) => (
    <div style={{ position: 'absolute', left: 0, top: top ? 0 : h / 2, width: w, height: h / 2, overflow: 'hidden', background: top ? bg[0] : bg[1], borderRadius: top ? `${r}px ${r}px 0 0` : `0 0 ${r}px ${r}px`, ...extra }}>
      <div style={{ position: 'absolute', left: 0, top: top ? 0 : -h / 2 }}>{face(c)}</div>
    </div>
  );
  return (
    <div style={{ position: 'relative', width: w, height: h, flex: 'none', boxShadow: '0 6px 14px rgba(0,0,0,.45)', borderRadius: r }}>
      {half(ch, true)}{half(f >= 1 ? ch : prev, false)}
      {f < 1 && (f < 0.5
        ? half(prev, true, { transform: `scaleY(${1 - 2 * f})`, transformOrigin: '50% 100%', filter: `brightness(${1 - 0.6 * f})` })
        : half(ch, false, { transform: `scaleY(${2 * f - 1})`, transformOrigin: '50% 0%', filter: `brightness(${0.7 + 0.3 * f})` }))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: h / 2 - 1.5, height: 3, background: 'rgba(0,0,0,.6)' }} />
    </div>
  );
};

const CH = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789€';
const pick = (k, i) => CH[(k * 7 + i * 13) % CH.length];
// a row of flaps that rattle from `start` and land one by one between `settle` and `settle + spread`
export const FlapRow = ({ text, t, start, settle, spread = 0, w, h, gap = 10, fs, fg = C.cream, bg = ['#1F3B37', '#183330'], step = 0.09 }) => {
  const cells = [...text];
  return (
    <div style={{ display: 'flex', gap }}>
      {cells.map((ch, i) => {
        const si = settle + (cells.length > 1 ? (spread * i) / (cells.length - 1) : 0);
        let cur = ' ', prev = ' ', f = 1;
        if (ch !== ' ' && t >= start) {
          if (t < si) { const u = (t - start) / step, k = Math.floor(u); f = u - k; cur = pick(k, i); prev = k ? pick(k - 1, i) : ' '; }
          else { const k = Math.floor((si - start) / step); prev = pick(k, i); cur = ch; f = clamp((t - si) / step); }
        }
        return <Flap key={i} w={w} h={h} fs={fs} ch={cur} prev={prev} f={f} fg={fg} bg={bg} />;
      })}
    </div>
  );
};

// dot map of Europe (Natural Earth outlines). Dots ripple in from Italy at `appear`; Italy lights up at `lit`.
export const IT = [530, 600]; // Italy, in map coordinates
export const DotMap = ({ t, appear = -9, lit = 99, base = 'rgba(220,239,236,.26)', r = 5.2, children }) => {
  const dots = MAP.dots.map(([x, y, it], i) => {
    const d = Math.hypot(x - IT[0], y - IT[1]); const s = clamp(sp(t, appear + d / 2200, 3.4, 0.5), 0, 1.3);
    const L = it ? clamp(sp(t, lit + d / 2500, 3, 0.4), 0, 1.4) : 0;
    const rr = r * s * (1 + L * (0.3 + 0.12 * Math.sin(t * 6 - d * 0.04)));
    return { x, y, it, rr, L };
  });
  return (
    <svg width={MAP.W} height={MAP.H} viewBox={`0 0 ${MAP.W} ${MAP.H}`} style={{ overflow: 'visible' }}>
      {dots.filter((d) => !(d.it && d.L > 0.05)).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={Math.max(0, d.rr)} fill={base} />)}
      <g style={{ filter: 'drop-shadow(0 0 10px rgba(255,201,77,.85))' }}>
        {dots.filter((d) => d.it && d.L > 0.05).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={Math.max(0, d.rr)} fill={C.sun} />)}
      </g>
      {children}
    </svg>
  );
};

// side-view airliner silhouette pointing right
export const Jet = ({ s = 120, c = C.cream }) => (
  <svg width={s} height={s * 0.42} viewBox="0 0 120 50"><path d="M4 26c0-3 3-5 8-5h28L62 3h9L60 21h34l10-11h7l-5 15 5 15h-7L94 29H60l11 18h-9L40 31H12c-5 0-8-2-8-5z" fill={c} /></svg>
);

export const Cloud = ({ x, y, s = 1, o = 0.16 }) => (
  <svg style={{ position: 'absolute', left: x, top: y, opacity: o }} width={360 * s} height={140 * s} viewBox="0 0 360 140"><path d="M60 130c-33 0-55-20-55-45s24-45 55-45c8-25 35-40 66-36 20-25 70-26 92 2 33-5 66 16 69 46 30 4 50 25 50 46 0 20-20 32-45 32z" fill="#fff" /></svg>
);
