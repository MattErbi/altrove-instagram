// Reel "Where does your holiday money really go?" — scenes for the Altrove reel engine.
// Each scene reads its local time with useT() and its cue times (seconds, from score.json) from sc.cues,
// so every animation lands on the same moment as its sound effect.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F } from '../brand';
import { useT, sp, pr, eo, eio, clamp, rnd, shake, at } from '../lib';
import { Coin, Person, Shop, Plane, Bed, Ticket, Check, Clock, Mono, Bokeh } from '../components/Icons';

const lbl = { fontFamily: F.sans, fontWeight: 800, color: C.ink };
const card = { background: C.white, borderRadius: 34, boxShadow: '0 18px 50px rgba(31,27,24,.12)' };
const src = { position: 'absolute', left: 0, right: 0, top: 1128, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 27, color: C.muted };

export const Hook = ({ sc }) => {
  const t = useT(); const c = sc.cues; const land = c.land;
  const drop = t < land ? 330 + 320 * Math.pow(t / land, 2) : 650 - 60 * Math.exp(-(t - land) * 7) * Math.sin((t - land) * 22);
  const spin = t < 0.9 ? Math.cos(t * 16) : 1; const [sx, sy] = shake(t, land, 10);
  const q = sp(t, c.q, 3, 0.35);
  return (
    <AbsoluteFill>
      <Bokeh items={[[160, 380, 180, C.tql], [930, 980, 220, '#F9E7B8'], [880, 260, 120, C.tql, 0.5]]} />
      <div style={{ position: 'absolute', left: 540 + sx, top: drop + sy, translate: '-50% -50%', scale: `${0.25 + 0.75 * Math.abs(spin)} 1` }}><Coin s={430} /></div>
      {Array.from({ length: 9 }, (_, i) => {
        const d = t - land; if (d < 0) return null; const a = (i / 9) * Math.PI * 2 + 0.3; const v = 900 + 300 * rnd(i);
        return <div key={i} style={at(540 + Math.cos(a) * v * d, 650 + Math.sin(a) * v * d * 0.8 + 1400 * d * d, 0.6 + 0.5 * rnd(i + 3), d * 400 * (rnd(i) - 0.5), clamp((0.75 - d) / 0.25))}><Coin s={84} /></div>;
      })}
      <div style={{ ...at(820, 420, q, -12 + 8 * (1 - q), clamp(q * 2)), fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 300, color: C.sun, WebkitTextStroke: `6px ${C.ink}` }}>?</div>
    </AbsoluteFill>
  );
};

export const Agency = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const a = sp(t, c.you, 3, 0.4), b = sp(t, c.ag, 3, 0.4), f = sp(t, c.fee, 3, 0.4);
  const dash = { strokeWidth: 8, strokeDasharray: '10 16', strokeLinecap: 'round', fill: 'none', strokeDashoffset: -t * 60 };
  return (
    <AbsoluteFill>
      <Bokeh items={[[120, 1000, 200, C.tql, 0.55], [980, 300, 160, '#F9E7B8', 0.6]]} />
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={1180}>
        <path d="M540 380 V560" stroke={C.ink} style={{ ...dash, opacity: clamp(a) }} />
        <path d="M540 760 C540 820 260 820 260 880 M540 760 V880 M540 760 C540 820 820 820 820 880" stroke={C.ink} style={{ ...dash, opacity: clamp(sp(t, c.s0)) }} />
        <path d="M640 660 H860" stroke={C.sun} style={{ ...dash, opacity: clamp(f) }} />
      </svg>
      <div style={{ ...at(540, 280, a, 0, clamp(a * 2)), width: 200, height: 200, borderRadius: '50%', background: C.tq, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Person s={140} /></div>
      <div style={{ ...at(700, 280, a, 0, clamp(a * 2)), ...lbl, fontSize: 40 }}>You</div>
      <div style={{ ...at(540, 660, b, 0, clamp(b * 2)), ...card, width: 250, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Shop s={130} /><div style={{ ...lbl, fontSize: 34 }}>Agency</div></div>
      {[Plane, Bed, Ticket].map((Ic, i) => { const s = sp(t, c['s' + i], 3, 0.4); return <div key={i} style={{ ...at([260, 540, 820][i], 960, s, 0, clamp(s * 2)), ...card, width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic s={110} /></div>; })}
      <div style={{ ...at(900, 660, f, 0, clamp(f * 2)), width: 200, height: 150, borderRadius: 28, background: C.sun, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ ...lbl, fontSize: 34 }}>Fees</div><div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.ink }}>not your trip</div></div>
      {Array.from({ length: 8 }, (_, i) => {
        const d = t - (c.flow + i * 0.32); if (d < 0) return null; const fee = i % 2 === 1; let x = 540, y;
        if (d < 0.45) y = 380 + 280 * eio(d / 0.45);
        else if (fee) { const e = eio((d - 0.45) / 0.45); x = 540 + 360 * e; y = 660 - 120 * Math.sin(Math.PI * e); }
        else { const e = eio((d - 0.45) / 0.5), tx = [260, 540, 820][(i / 2) % 3 | 0]; x = 540 + (tx - 540) * e; y = 660 + 240 * e; }
        const op = Math.min(fee ? clamp((1.05 - d) / 0.15) : clamp((1.1 - d) / 0.15), clamp(d / 0.08));
        return <div key={i} style={at(x, y, 1, 0, op)}><Coin s={64} /></div>;
      })}
    </AbsoluteFill>
  );
};

export const Commission = ({ sc }) => {
  const t = useT(); const c = sc.cues; const t8 = c.count, tl = c.land, tc = c.bar, ta = c.cut;
  const g = sp(t, c.tag, 3, 0.45); const k = pr(t, t8, tl); const v = Math.round(eo(k) * 15);
  const [sx, sy] = shake(t, tl, 16); const s = t < tl ? 0.9 + 0.1 * eo(k) : 1 + 0.12 * Math.exp(-(t - tl) * 8) * Math.cos((t - tl) * 30);
  const cut = sp(t, ta, 2.8, 0.45);
  return (
    <AbsoluteFill>
      <Bokeh items={[[920, 300, 200, C.tql, 0.6], [140, 1000, 160, '#F9E7B8', 0.6]]} />
      <div style={{ ...at(540, 330, g, 0, clamp(g * 2)), padding: '14px 28px', borderRadius: 40, background: C.ink, color: C.cream, fontFamily: F.sans, fontWeight: 800, fontSize: 34, whiteSpace: 'nowrap' }}>Hotel → agency commission</div>
      <div style={{ ...at(540 + sx, 560 + sy, (t < t8 ? 0.78 + 0.12 * clamp(sp(t, c.tag + 0.1, 3, 0.45)) : s), 0, clamp(sp(t, c.tag + 0.1, 3, 0.45) * 2) * (t < t8 ? 0.35 + 0.1 * Math.sin(t * 6) : 1)), fontFamily: F.brand, fontWeight: 800, fontSize: 205, letterSpacing: -8, color: C.tq, whiteSpace: 'nowrap' }}>{t < tl ? v + '%' : '8–15%'}</div>
      <div style={{ position: 'absolute', left: 110, top: 780, ...lbl, fontSize: 36, opacity: clamp(pr(t, tc - 0.2, tc)) }}>Your hotel price</div>
      <div style={{ position: 'absolute', left: 110, top: 840, width: 860, height: 110, borderRadius: 28, background: C.white, boxShadow: '0 14px 40px rgba(31,27,24,.1)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: eio(pr(t, tc, tc + 0.6)) * 860, background: C.tq }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: Math.max(0, cut) * 110, background: C.sun }} />
      </div>
      <div style={{ ...at(860, 1010, clamp(cut), 0, clamp(cut * 1.5)), fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 44, color: C.ink, whiteSpace: 'nowrap' }}>already inside ↑</div>
      <div style={{ ...src, opacity: clamp(pr(t, tl, tl + 0.3)) }}>Italy · Source: TeamSystem</div>
    </AbsoluteFill>
  );
};

export const Extras = ({ sc }) => {
  const t = useT(); const c = sc.cues; const r = sp(t, c.paper, 2.6, 0.5); const f = sp(t, c.fee, 3.2, 0.35);
  const tfi = c.stamp; const st = pr(t, tfi - 0.15, tfi); const [sx, sy] = shake(t, tfi, 20);
  const row = { display: 'flex', justifyContent: 'space-between', fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.ink, padding: '14px 0' };
  return (
    <AbsoluteFill>
      <Bokeh items={[[160, 300, 180, '#F9E7B8', 0.6], [960, 900, 220, C.tql, 0.55]]} />
      <div style={{ ...at(540, 1450 - 760 * r, 1, -2 + 2 * clamp(r)), width: 640, height: 760, background: C.white, borderRadius: '26px 26px 0 0', boxShadow: '0 24px 70px rgba(31,27,24,.16)', padding: '56px 56px 0' }}>
        <div style={{ fontFamily: F.brand, fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: -1 }}>Your booking</div>
        <div style={{ height: 4, background: `repeating-linear-gradient(90deg,${C.ink} 0 14px,transparent 14px 26px)`, margin: '26px 0 22px', opacity: 0.25 }} />
        {['Flights', 'Hotel', 'Activities'].map((n, i) => { const e = sp(t, c['r' + i], 3.5, 0.5); return <div key={i} style={{ ...row, opacity: clamp(e * 2), translate: `${(1 - e) * 40}px 0px` }}>{n}<span style={{ color: C.tq }}>✓</span></div>; })}
        <div style={{ ...row, fontSize: 46, padding: '16px 22px', margin: '18px -22px 0', borderRadius: 18, background: C.sun, opacity: clamp(f * 2), scale: String(0.7 + 0.3 * f) }}>Booking fee<span>+€50</span></div>
        <svg style={{ position: 'absolute', left: 0, bottom: -28 }} width={640} height={30}><path d={`${Array.from({ length: 17 }, (_, i) => `${i ? 'L' : 'M'}${i * 40} 0 L${i * 40 + 20} 28`).join(' ')} L640 0 Z`} fill={C.white} /></svg>
      </div>
      <div style={{ ...at(780 + sx, 520 + sy, t < tfi ? 2.6 - 1.6 * st : 1, -14, t < tfi - 0.15 ? 0 : clamp(st * 3)), padding: '16px 40px', border: `10px solid ${C.red}`, borderRadius: 22, color: C.red, fontFamily: F.brand, fontWeight: 800, fontSize: 84, letterSpacing: 2, background: 'rgba(255,255,255,.6)' }}>EXTRA</div>
      <div style={{ ...src, opacity: clamp(pr(t, c.fee, c.fee + 0.3)) }}>Source: GuidaViaggi, 2025</div>
    </AbsoluteFill>
  );
};

export const Diy = ({ sc }) => {
  const t = useT(); const c = sc.cues; const th = c.clock; const cc = sp(t, th, 3, 0.35); const [sx, sy] = shake(t, th, 14);
  return (
    <AbsoluteFill>
      <Bokeh items={[[200, 300, 200, C.tql, 0.55], [900, 1000, 200, '#F9E7B8', 0.55]]} />
      {Array.from({ length: 12 }, (_, i) => {
        const s = sp(t, c['w' + i], 3.4, 0.42);
        return (
          <div key={i} style={{ ...at(300 + 480 * rnd(i + 7), 360 + 620 * rnd(i + 19), 0.55 + 0.45 * s, (rnd(i + 5) - 0.5) * 24, clamp(s * 3)), ...card, width: 520, height: 330, overflow: 'hidden' }}>
            <div style={{ height: 58, background: i % 3 === 0 ? C.tql : C.sand, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px' }}>
              {['#E0675A', C.sun, C.tq].map((col, j) => <i key={j} style={{ width: 18, height: 18, borderRadius: '50%', background: col }} />)}
              <b style={{ marginLeft: 18, height: 26, width: 180 + 120 * rnd(i), borderRadius: 13, background: '#fff' }} />
            </div>
            <div style={{ padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[0.9, 0.7, 0.8, 0.5].map((w, j) => <b key={j} style={{ height: j ? 22 : 34, width: `${(w - 0.2 * rnd(i + j)) * 100}%`, borderRadius: 11, background: j ? '#ECE6DD' : C.ink, opacity: j ? 1 : 0.85 }} />)}
            </div>
          </div>
        );
      })}
      <div style={at(540 + sx, 640 + sy, 1.2 * cc, 0, clamp(cc * 2))}><Clock s={220} t={t} /></div>
    </AbsoluteFill>
  );
};

export const Meet = ({ sc }) => {
  const t = useT(); const c = sc.cues; const w = eo(pr(t, 0, 0.35)) * 2900; const l = sp(t, c.logo, 2.8, 0.4); const k = sp(t, c.word, 3, 0.45);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 540, top: 760, width: w, height: w, borderRadius: '50%', background: C.tq, translate: '-50% -50%' }} />
      <div style={at(540, 640, l, 0, clamp(l * 2))}><Mono s={470} morph={eio(pr(t, c.morph, c.morph + 0.28))} /></div>
      <div style={{ ...at(540, 1000 + 60 * (1 - k), 1, 0, clamp(k * 2)), fontFamily: F.brand, fontWeight: 600, fontSize: 130, letterSpacing: -4, color: C.cream }}>altrove</div>
    </AbsoluteFill>
  );
};

export const Chat = ({ sc }) => {
  const t = useT(); const c = sc.cues; const p = sp(t, c.phone, 2.6, 0.5); const u = sp(t, c.user, 3.2, 0.45); const a = sp(t, c.agent, 3.2, 0.45); const ex = sp(t, 0.2);
  const bubble = { padding: '20px 28px', fontFamily: F.sans, fontWeight: 800, fontSize: 34, lineHeight: 1.2 };
  return (
    <AbsoluteFill>
      <Bokeh items={[[150, 400, 200, C.tql, 0.6], [960, 1000, 180, '#F9E7B8', 0.6]]} />
      <div style={{ ...at(540, 670 + 500 * (1 - p)), width: 600, height: 880, borderRadius: 72, background: C.white, border: `14px solid ${C.ink}`, boxShadow: '0 30px 80px rgba(31,27,24,.2)', overflow: 'hidden' }}>
        <div style={{ height: 120, display: 'flex', alignItems: 'center', gap: 16, padding: '30px 36px 0', borderBottom: '2px solid #EEE7DD' }}><Mono s={64} ink={C.tq} morph={1} /><div style={{ fontFamily: F.brand, fontWeight: 600, fontSize: 34, color: C.ink }}>altrove</div></div>
        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...bubble, alignSelf: 'flex-end', maxWidth: 420, borderRadius: '30px 30px 8px 30px', background: C.tq, color: C.cream, opacity: clamp(u * 2), scale: String(0.6 + 0.4 * u), transformOrigin: 'right bottom' }}>Plan me 4 days in Lisbon</div>
          {t >= c.typing && t < c.agent && <div style={{ alignSelf: 'flex-start', padding: '20px 26px', borderRadius: '30px 30px 30px 8px', background: C.sand, display: 'flex', gap: 10 }}>{[0, 1, 2].map((i) => <i key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: C.ink, opacity: 0.5, translate: `0px ${-8 * Math.max(0, Math.sin(t * 14 - i * 0.9))}px` }} />)}</div>}
          {t >= c.agent && <div style={{ ...bubble, alignSelf: 'flex-start', borderRadius: '30px 30px 30px 8px', background: C.sand, color: C.ink, opacity: clamp(a * 2), scale: String(0.6 + 0.4 * a), transformOrigin: 'left bottom' }}>Done. Your whole trip:</div>}
          {[[Plane, 'Flights'], [Bed, 'Stay'], [Ticket, 'Activities']].map(([Ic, n], i) => {
            const s0 = c['c' + i]; if (t < s0) return null; const e = sp(t, s0, 3.2, 0.45), k = sp(t, s0 + 0.15, 3.4, 0.35);
            return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px', borderRadius: 24, background: '#fff', border: '3px solid #EEE7DD', opacity: clamp(e * 2), translate: `0px ${(1 - e) * 40}px` }}><Ic s={66} c={C.tq} /><div style={{ flex: 1, fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: C.ink }}>{n}</div><div style={{ scale: String(Math.max(0, k)) }}><Check s={56} /></div></div>;
          })}
        </div>
      </div>
      <div style={{ ...at(540, 205, clamp(ex), 0, clamp(ex * 2)), padding: '10px 26px', borderRadius: 30, background: C.ink, color: C.cream, fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 2 }}>EXAMPLE</div>
    </AbsoluteFill>
  );
};

export const Total = ({ sc }) => {
  const t = useT(); const c = sc.cues; const cc = sp(t, c.card, 2.8, 0.5); const g = sp(t, c.total, 3, 0.35);
  return (
    <AbsoluteFill>
      <Bokeh items={[[940, 320, 200, C.tql, 0.55], [140, 1000, 180, '#F9E7B8', 0.6]]} />
      <div style={{ ...at(540, 560, 0.85 + 0.15 * cc, 0, clamp(cc * 2)), ...card, width: 820, padding: '44px 50px' }}>
        <div style={{ fontFamily: F.brand, fontWeight: 600, fontSize: 40, color: C.ink, letterSpacing: -1, marginBottom: 22 }}>Your trip</div>
        {['Flights', 'Stay', 'Activities'].map((n, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '2px solid #F1EBE2', opacity: clamp(sp(t, c['r' + i], 3.4, 0.5) * 2) }}><span style={{ ...lbl, fontSize: 38 }}>{n}</span><b style={{ width: 150 + 40 * i, height: 24, borderRadius: 12, background: '#ECE6DD' }} /></div>)}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, padding: '22px 28px', borderRadius: 22, background: C.tq, scale: String(0.8 + 0.2 * g), opacity: clamp(g * 2) }}><span style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 54, color: C.cream }}>Total</span><span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 32, color: C.sun }}>all in, from day one</span></div>
      </div>
      <div style={{ ...at(540, 1000, 1, 0, clamp(pr(t, c.t0 - 0.3, c.t0 - 0.1))), display: 'flex', gap: 22 }}>
        {['Budget', 'Times', 'Transport'].map((n, i) => { const k = eo(pr(t, c['t' + i], c['t' + i] + 0.15)); return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderRadius: 26, background: C.sand }}><div style={{ width: 74, height: 42, borderRadius: 21, background: k > 0.5 ? C.tq : '#CFC6BA', position: 'relative' }}><i style={{ position: 'absolute', top: 5, left: 5 + 32 * k, width: 32, height: 32, borderRadius: '50%', background: '#fff' }} /></div><span style={{ ...lbl, fontSize: 32 }}>{n}</span></div>; })}
      </div>
    </AbsoluteFill>
  );
};

export const Save = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const icons = [<Coin s={110} />, <svg width={110} height={110} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill={C.cream} /><path d="M50 50V24M50 50l16 10" stroke={C.ink} strokeWidth="8" strokeLinecap="round" /></svg>, <div style={{ width: 110, height: 110, borderRadius: '50%', background: C.sun, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plane s={74} /></div>];
  const lines = [['Less money on', 'extras.'], ['Less time', 'planning.'], ['More', 'trip.']];
  return (
    <AbsoluteFill>
      <Bokeh items={[[140, 300, 220, C.tqd, 0.8], [960, 1100, 240, '#0E8A7B', 0.7]]} />
      {lines.map(([a, b], i) => {
        const tt = c['l' + i]; const s = sp(t, tt, 3.2, 0.4); const [sx, sy] = shake(t, tt + 0.05, 10); const big = i === 2;
        return <div key={i} style={{ ...at(540 + sx + (1 - s) * 200, 420 + i * 330 + sy, 0.6 + 0.4 * s, 0, clamp(s * 3)), display: 'flex', alignItems: 'center', gap: 26, whiteSpace: 'nowrap' }}>{icons[i]}<span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: big ? 116 : 72, color: C.cream, letterSpacing: -2 }}>{a}</span><span style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: big ? 132 : 84, color: C.sun }}>{b}</span></div>;
      })}
    </AbsoluteFill>
  );
};

export const End = ({ sc }) => {
  const t = useT(); const c = sc.cues; const l = sp(t, c.logo, 2.8, 0.4); const w = sp(t, c.word, 3, 0.45); const s = sp(t, c.soon, 3, 0.4); const h = sp(t, c.handle, 3, 0.45);
  const cyc = (t % 2.4) / 2.4; const m = cyc < 0.25 ? 0 : cyc < 0.38 ? eio((cyc - 0.25) / 0.13) : cyc < 0.75 ? 1 : cyc < 0.88 ? 1 - eio((cyc - 0.75) / 0.13) : 0;
  return (
    <AbsoluteFill>
      <Bokeh items={[[160, 260, 220, C.tqd, 0.8], [940, 1250, 260, '#0E8A7B', 0.7]]} />
      <div style={at(540, 560, l, 0, clamp(l * 2))}><Mono s={420} morph={m} /></div>
      <div style={{ ...at(540, 880 + 50 * (1 - w), 1, 0, clamp(w * 2)), fontFamily: F.brand, fontWeight: 600, fontSize: 124, letterSpacing: -4, color: C.cream }}>altrove</div>
      <div style={{ ...at(540, 1060, s, -3, clamp(s * 2)), fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 96, color: C.sun, whiteSpace: 'nowrap' }}>Coming soon</div>
      <div style={{ ...at(540, 1260 + 40 * (1 - h), 1, 0, clamp(h * 2)), padding: '18px 36px', borderRadius: 40, background: C.cream, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink, whiteSpace: 'nowrap' }}>Follow @aitrove.travel</div>
    </AbsoluteFill>
  );
};

// id → { component, background, dark (cream captions) }
export const SCENES = {
  hook: { C: Hook, bg: C.cream }, agency: { C: Agency, bg: C.white }, commission: { C: Commission, bg: C.cream },
  extras: { C: Extras, bg: C.white }, diy: { C: Diy, bg: C.cream }, meet: { C: Meet, bg: C.cream, dark: true },
  chat: { C: Chat, bg: C.cream }, total: { C: Total, bg: C.white }, save: { C: Save, bg: C.tq, dark: true }, end: { C: End, bg: C.tq, dark: true },
};
