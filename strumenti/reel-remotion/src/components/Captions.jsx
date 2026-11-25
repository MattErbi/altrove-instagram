import React from 'react';
import { C, F } from '../brand';
import { useT, sp, clamp } from '../lib';

// TikTok-style kinetic captions: chunks of up to 3 words, each word springs in when spoken,
// accent words in Fraunces italic and colour, landing a beat early; the word being spoken is highlighted.
const chunks = (words) => { const out = []; let cur = []; for (const w of words) { cur.push(w); const len = cur.map((x) => x.w).join(' ').length; if (/[.?!,:]$/.test(w.w) || cur.length >= 3 || len > 15) { out.push(cur); cur = []; } } if (cur.length) out.push(cur); return out; };

export const Captions = ({ sc, dark, glow = true }) => {
  const t = useT();
  if (!sc.caption) return null;
  const ch = chunks(sc.words);
  let idx = -1; ch.forEach((c, i) => { if (t >= c[0].t - (c[0].accent ? 0.16 : 0.06)) idx = i; }); // switch chunk exactly when its first word starts to appear
  if (idx < 0) return null;
  const words = ch[idx];
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 1200, height: 330, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', columnGap: 26 }}>
      {words.map((w, j) => {
        const start = w.t - (w.accent ? 0.16 : 0.06); const s = sp(t, start, 3.6, 0.42);
        const next = words[j + 1]; const speaking = t >= w.t && (!next || t < next.t);
        const base = dark ? C.cream : C.ink;
        return (
          <span key={j} style={{
            display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1.12,
            fontFamily: w.accent ? F.serif : F.sans, fontStyle: w.accent ? 'italic' : 'normal', fontWeight: w.accent ? 600 : 800,
            fontSize: w.accent ? 104 : 92, letterSpacing: w.accent ? -1 : -1.5,
            color: w.accent ? (dark ? C.sun : C.tq) : base,
            opacity: clamp(s * 3), translate: `0px ${(1 - s) * 50}px`, scale: String(0.55 + 0.45 * s + (speaking && !w.accent ? 0.04 : 0)),
            textShadow: dark ? '0 6px 24px rgba(0,0,0,.35)' : glow ? '0 4px 0 rgba(255,255,255,.9), 0 0 30px rgba(255,255,255,.9)' : 'none',
          }}>{w.w}</span>
        );
      })}
    </div>
  );
};
