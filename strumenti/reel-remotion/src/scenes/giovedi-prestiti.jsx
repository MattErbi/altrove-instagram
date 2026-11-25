// Reel "€225 million. Borrowed. For holidays." (Thursday 26/11, pillar "the real cost of a trip").
// Night-sky departure board, dot map of Italy and Europe, boarding pass, suitcase, routes, sunset board finale.
// Every animation reads its cue times (seconds) from sc.cues, the same times the sound effects use.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F } from '../brand';
import { useT, sp, pr, eo, eio, clamp, rnd, shake, at } from '../lib';
import { Coin, Plane, Bed, Ticket, Check, Mono, Bokeh } from '../components/Icons';
import { Stars, FlapRow, DotMap, MAP, IT, Jet, Cloud } from '../components/Travel';

const NIGHT = 'radial-gradient(120% 80% at 50% 30%, #0B4A42 0%, #062E29 45%, #021714 100%)';
const MAPBG = 'radial-gradient(90% 70% at 52% 42%, #0A4A42 0%, #052A26 60%, #031A17 100%)';
const MX = 40, MY = 170; // map position on screen
const srcStyle = (o, col = C.cream) => ({ position: 'absolute', left: 0, right: 0, top: 1112, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 27, color: col, opacity: 0.72 * o });
const center = { position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center' };
const panel = { position: 'absolute', background: '#0B1D1A', border: '4px solid #1E3934', borderRadius: 36, boxShadow: '0 30px 80px rgba(0,0,0,.55), inset 0 0 40px rgba(0,0,0,.5)' };

// ---------- 1. hook: departure board flips to €225 MILLION, BORROWED stamp ----------
export const Hook = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const [lx, ly] = shake(t, c.land, 12); const [kx, ky] = shake(t, c.stamp, 22);
  const punch = 1 + 0.05 * Math.exp(-(t - c.land) * 7) * (t > c.land ? Math.cos((t - c.land) * 26) : 0);
  const k = pr(t, c.stamp, c.stamp + 0.13); const st = t < c.stamp ? 0 : 2.4 - 1.4 * eo(k) + (k >= 1 ? 0.06 * Math.exp(-(t - c.stamp - 0.13) * 9) * Math.sin((t - c.stamp) * 30) : 0);
  const px = t < c.plane ? 1180 - 210 * t : 1180 - 210 * t - 2600 * (t - c.plane) ** 2;
  return (
    <AbsoluteFill>
      <Stars t={t} n={80} maxY={1250} />
      <div style={{ position: 'absolute', left: px, top: 132 }}>
        <div style={{ position: 'absolute', left: 120, top: 22, width: 520, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, rgba(251,248,243,.55), rgba(251,248,243,0))' }} />
        <div style={{ transform: 'scaleX(-1)' }}><Jet s={130} /></div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, translate: `${lx + kx}px ${ly + ky}px`, scale: String(punch), transformOrigin: '540px 630px' }}>
        <div style={{ ...center, top: 236, alignItems: 'center', gap: 18 }}>
          <Plane s={58} c={C.sun} />
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 42, letterSpacing: 12, color: C.cream }}>DEPARTURES</div>
        </div>
        <div style={{ ...panel, left: 46, top: 318, width: 988, height: 640 }} />
        <div style={{ ...center, top: 345 }}><FlapRow text="€225" t={t} start={0} settle={0.28} spread={c.land - 0.28} w={190} h={250} gap={16} fs={190} fg={C.sun} /></div>
        <div style={{ ...center, top: 618 }}><FlapRow text="MILLION" t={t} start={0} settle={c.land - 0.12} spread={0.36} w={112} h={150} gap={10} fs={100} /></div>
        <div style={{ ...center, top: 812 }}><FlapRow text="FOR HOLIDAYS" t={t} start={c.hol} settle={c.hol + 0.12} spread={0.45} w={68} h={96} gap={6} fs={56} /></div>
        {t >= c.stamp && (
          <div style={{ ...at(548, 560, st, -9, clamp(k * 3) * 0.95), padding: '10px 34px 14px', border: `10px solid ${C.red}`, borderRadius: 22, background: 'rgba(212,72,58,.14)', fontFamily: F.brand, fontWeight: 800, fontSize: 112, letterSpacing: 6, color: C.red, whiteSpace: 'nowrap', textShadow: '0 0 30px rgba(0,0,0,.4)' }}>BORROWED</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Italy lights up on the dot map, "€225M · Jan–Jun 2026" ----------
export const Italy = ({ sc }) => {
  const t = useT(); const c = sc.cues; const z = 1 + 0.12 * eio(t / sc.D);
  const ox = MX + IT[0], oy = MY + IT[1];
  const cl = sp(t, c.lit + 0.15, 3, 0.45), ch = sp(t, c.chip, 3.2, 0.45);
  return (
    <AbsoluteFill>
      <Stars t={t} n={30} seed={5} o={0.5} />
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, scale: String(z), transformOrigin: `${ox}px ${oy}px` }}>
        <div style={{ position: 'absolute', left: MX, top: MY }}><DotMap t={t} appear={-0.15} lit={c.lit} /></div>
        <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1080} height={1920}><path d={`M${ox + 40} ${oy - 70} L${ox + 150} ${oy - 225}`} stroke={C.sun} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${eo(pr(t, c.lit + 0.05, c.lit + 0.3))} 1`} /></svg>
        <div style={{ ...at(ox + 250, oy - 300, cl, -3, clamp(cl * 2)), padding: '18px 30px', borderRadius: 30, background: C.cream, boxShadow: '0 20px 50px rgba(0,0,0,.4)', textAlign: 'center' }}>
          <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 76, color: C.tq, letterSpacing: -2, lineHeight: 1 }}>€225M</div>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.ink, marginTop: 6, whiteSpace: 'nowrap' }}>borrowed to travel</div>
        </div>
      </div>
      <div style={{ ...at(540, 196, ch, 0, clamp(ch * 2)), padding: '14px 30px', borderRadius: 40, background: C.sun, fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 4, color: C.ink, whiteSpace: 'nowrap' }}>JAN – JUN 2026</div>
      <div style={srcStyle(clamp(pr(t, c.chip, c.chip + 0.3)))}>In Italy · Source: Facile.it</div>
    </AbsoluteFill>
  );
};

// ---------- 3. boarding pass: average summer holiday €917 per person ----------
const Field = ({ x, y, label, value, show, size = 54 }) => (
  <div style={{ position: 'absolute', left: x, top: y }}>
    <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 21, letterSpacing: 3, color: C.muted }}>{label}</div>
    <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: size, color: C.ink, letterSpacing: -1, marginTop: 4, whiteSpace: 'nowrap' }}>{value.slice(0, Math.round(show * value.length))}</div>
  </div>
);
export const Trip = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const s = sp(t, c.pass, 2.4, 0.55); const fill = (d) => clamp((t - c.fill - d) / 0.32);
  const k = pr(t, c.count, c.land); const v = Math.round(917 * eo(k)); const land = t > c.land ? 1 + 0.14 * Math.exp(-(t - c.land) * 8) * Math.cos((t - c.land) * 28) : 1;
  const sk = pr(t, c.stamp, c.stamp + 0.12); const st = t < c.stamp ? 0 : 2.2 - 1.2 * eo(sk);
  const [sx, sy] = shake(t, c.stamp, 14);
  const bars = Array.from({ length: 34 }, (_, i) => 2 + Math.round(rnd(i + 40) * 6));
  return (
    <AbsoluteFill>
      <Bokeh items={[[900, 220, 260, C.sun, 0.55], [140, 1100, 240, '#33A394', 0.6]]} />
      <Cloud x={-120 + 30 * t} y={150} s={1.1} /><Cloud x={640 - 25 * t} y={1010} s={0.9} o={0.12} /><Cloud x={760 + 20 * t} y={290} s={0.6} o={0.1} />
      <div style={{ position: 'absolute', left: 90 + sx, top: 410 + 1300 * (1 - s) + sy, width: 900, height: 500, rotate: `${-4 + 10 * (1 - s)}deg`, borderRadius: 34, background: C.cream, boxShadow: '0 40px 90px rgba(0,30,26,.45)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 640, height: 92, borderRadius: '34px 0 0 0', background: C.tqd, display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 40 }}>
          <Plane s={50} c={C.sun} /><div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 7, color: C.cream }}>BOARDING PASS</div>
        </div>
        <div style={{ position: 'absolute', left: 640, top: 0, width: 260, height: 92, borderRadius: '0 34px 0 0', background: C.sun, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.ink }}>SUMMER 2026</div>
        <div style={{ position: 'absolute', left: 638, top: 92, bottom: 18, borderLeft: `4px dashed ${C.muted}`, opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: 618, top: -22, width: 44, height: 44, borderRadius: '50%', background: '#0A7C6E' }} />
        <div style={{ position: 'absolute', left: 618, bottom: -22, width: 44, height: 44, borderRadius: '50%', background: '#03665B' }} />
        <Field x={40} y={116} label="FROM" value="ITALY" show={fill(0)} size={48} />
        <div style={{ position: 'absolute', left: 252, top: 150, opacity: fill(0.15) }}><Plane s={52} c={C.tq} /></div>
        <Field x={330} y={116} label="TO" value="SUMMER" show={fill(0.2)} size={48} />
        <Field x={672} y={116} label="PASSENGER" value="YOU" show={fill(0.35)} size={50} />
        <div style={{ position: 'absolute', left: 40, top: 240, fontFamily: F.sans, fontWeight: 800, fontSize: 23, letterSpacing: 3, color: C.tq, opacity: clamp(pr(t, c.count - 0.2, c.count)) }}>AVERAGE HOLIDAY · PER PERSON</div>
        <div style={{ position: 'absolute', left: 32, top: 268, fontFamily: F.brand, fontWeight: 800, fontSize: 168, letterSpacing: -6, color: C.ink, lineHeight: 1.1, scale: String(land), transformOrigin: '20% 60%', opacity: clamp(pr(t, c.count - 0.15, c.count + 0.05)) }}>€{v}</div>
        <div style={{ position: 'absolute', left: 672, top: 262, display: 'flex', gap: 4, alignItems: 'flex-end', height: 150 }}>{bars.map((b, i) => <div key={i} style={{ width: b, height: 150 - (i % 5 === 0 ? 0 : 14), background: C.ink, marginRight: i % 3 ? 1 : 3 }} />)}</div>
        {t >= c.land && Array.from({ length: 8 }, (_, i) => { const d = t - c.land; const a = -Math.PI * (0.1 + 0.8 * (i / 7)); const vv = 700 + 260 * rnd(i + 2);
          return <div key={i} style={at(250 + Math.cos(a) * vv * d, 360 + Math.sin(a) * vv * d + 1500 * d * d, 0.55 + 0.3 * rnd(i), d * 500 * (rnd(i + 1) - 0.5), clamp((0.8 - d) / 0.25))}><Coin s={80} /></div>; })}
        {t >= c.stamp && <div style={{ ...at(745, 352, st, -14, clamp(sk * 3) * 0.92), padding: '8px 22px 10px', border: `8px solid ${C.red}`, borderRadius: 18, fontFamily: F.brand, fontWeight: 800, fontSize: 44, letterSpacing: 2, color: C.red, background: 'rgba(251,248,243,.7)', whiteSpace: 'nowrap' }}>PER PERSON</div>}
      </div>
      <div style={srcStyle(clamp(pr(t, c.land, c.land + 0.3)))}>Italy · Summer 2026 · Source: Tecnè for Federalberghi</div>
    </AbsoluteFill>
  );
};

// ---------- 4. coins fly into the suitcase; fee tags grab some, then get crossed out; lid shuts ----------
const TAGS = [['fees', 150, 520, -8, 190], ['extras', 948, 420, 7, 220], ['add-ons', 950, 640, -5, 240]];
export const Fees = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const cs = sp(t, c.case, 3, 0.45);
  const lid = t < c.close ? 1 : 1 - 1.12 * clamp(sp(t, c.close, 2.6, 0.5), 0, 1.15);
  const hop = t > c.close + 0.12 ? -36 * Math.max(0, Math.sin((t - c.close - 0.12) * 9)) * Math.exp(-(t - c.close) * 3) : 0;
  const coins = [];
  for (let i = 0; i < 40; i++) {
    const ti = c.flow + i * 0.085; if (ti > c.close - 0.32) break; const d = t - ti; if (d < 0) continue;
    const toTag = ti >= c.tags - 0.2 && ti < c.cut - 0.1 && i % 2 === 0; const tg = TAGS[(i / 2) % 3 | 0];
    const x0 = 540 + (rnd(i) - 0.5) * 900, y0 = -90, x1 = toTag ? tg[1] : 540 + (rnd(i + 5) - 0.5) * 320, y1 = toTag ? tg[2] + 40 : 690;
    const T = 0.5, q = clamp(d / T); if (q >= 1) continue;
    coins.push(<div key={i} style={at(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q * q, 0.9 - 0.25 * q, d * 360 * (rnd(i + 2) - 0.5), clamp((1 - q) / 0.15))}><Coin s={82} /></div>);
  }
  const W = 560, H = 360, X = 540 - W / 2, Y = 660;
  return (
    <AbsoluteFill>
      <Bokeh items={[[160, 240, 230, '#FFF3C9', 0.8], [960, 1120, 240, '#FFE08A', 0.7]]} />
      {TAGS.map(([label, x, y, r, tw], i) => {
        const a = sp(t, c.tags + i * 0.08, 3, 0.4); const cut = t - c.cut; const fall = cut > 0.18 ? cut - 0.18 : 0;
        const sw = Math.sin(t * 3 + i) * 5;
        return (
          <div key={i} style={{ ...at(x + (i ? 160 : -160) * fall, y + 1400 * fall * fall, clamp(a, 0, 1.2), r + sw + 260 * fall * (i ? 1 : -1), clamp(a * 2) * clamp(1 - fall * 1.6)) }}>
            <div style={{ position: 'absolute', left: tw / 2 - 2, top: -300, width: 4, height: 300, background: 'rgba(31,27,24,.35)' }} />
            <div style={{ position: 'relative', width: tw, height: 96, whiteSpace: 'nowrap', background: C.ink, borderRadius: '20px 48px 48px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 14px 30px rgba(120,80,0,.3)' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.sun }} />
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.cream }}>{label}</div>
              {cut > 0 && <svg style={{ position: 'absolute', left: -10, top: -10 }} width={tw + 20} height={116}><path d={`M12 12 L${tw + 8} 104 M${tw + 8} 12 L12 104`} stroke={C.red} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={`${eo(cut / 0.14)} 1`} /></svg>}
            </div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, translate: `0px ${hop + 700 * (1 - clamp(cs, 0, 1.2))}px` }}>
        {/* lid: inner lining while open (scaleY > 0), outer shell once it has flipped over the hinge */}
        <div style={{ position: 'absolute', left: X + 10, top: Y - 300, width: W - 20, height: 300, transformOrigin: '50% 100%', transform: `scaleY(${lid})`, borderRadius: '40px 40px 10px 10px', background: lid > 0 ? '#004D44' : C.tq, boxShadow: lid > 0 ? 'inset 0 -30px 60px rgba(0,0,0,.35)' : 'none' }}>
          {lid > 0 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 40, right: 40, top: 40 + i * 48, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.07)' }} />)}
        </div>
        <div style={{ position: 'absolute', left: X + 20, top: Y - 14, width: W - 40, height: 40, borderRadius: 16, background: '#00322C', opacity: lid > 0 ? 1 : 0 }} />
        {coins}
        <div style={{ position: 'absolute', left: X, top: Y + 4, width: W, height: H, borderRadius: 44, background: `linear-gradient(180deg, ${C.tq}, ${C.tqd})`, boxShadow: '0 30px 60px rgba(120,80,0,.35)' }}>
          {[150, W - 170].map((x, i) => <div key={i} style={{ position: 'absolute', left: x, top: 0, width: 20, height: H, background: 'rgba(0,0,0,.18)' }} />)}
          <div style={{ position: 'absolute', left: W / 2 - 60, top: H / 2 - 24, fontFamily: F.brand, fontWeight: 800, fontSize: 40, color: C.cream, letterSpacing: 1, whiteSpace: 'nowrap', translate: '-25% 0' }}>YOUR TRIP</div>
          {[70, W - 110].map((x, i) => <div key={i} style={{ position: 'absolute', left: x, top: H - 6, width: 40, height: 40, borderRadius: '50%', background: C.ink }} />)}
        </div>
        {lid <= 0 && <div style={{ position: 'absolute', left: X + 10, top: Y - 4, width: W - 20, height: 26, borderRadius: 13, background: '#0E8A7B' }} />}
        {t > c.close + 0.1 && <div style={at(540, Y - 120, sp(t, c.close + 0.1, 3, 0.4), 0, clamp(sp(t, c.close + 0.1) * 2))}><Check s={130} bg={C.ink} /></div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Altrove: routes from Italy across Europe, then one clear total ----------
const DEST = ['Lisbon', 'Paris', 'Amsterdam', 'Copenhagen', 'Prague', 'Athens', 'Barcelona'];
const ICONS = [Plane, Bed, Ticket];
export const Altrove = ({ sc }) => {
  const t = useT(); const c = sc.cues;
  const [x0, y0] = MAP.cities.Milan; const lg = sp(t, 0.05, 3, 0.45);
  const card = sp(t, c.card, 2.6, 0.55); const dim = clamp(pr(t, c.card - 0.1, c.card + 0.3));
  const routes = DEST.map((name, i) => {
    const [x1, y1] = MAP.cities[name]; const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    const mx = (x0 + x1) / 2 + (dy / L) * L * 0.22 * (dx < 0 ? 1 : -1), my = (y0 + y1) / 2 - Math.abs(dx / L) * L * 0.22;
    const p = eio(pr(t, c.routes + i * 0.09, c.routes + i * 0.09 + 0.6));
    const B = (u) => [(1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * x1, (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u * u * y1];
    const [px, py] = B(p), [qx, qy] = B(Math.min(1, p + 0.01));
    return { name, x1, y1, d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`, p, px, py, ang: (Math.atan2(qy - py, qx - px) * 180) / Math.PI, i };
  });
  return (
    <AbsoluteFill>
      <div style={{ ...at(540, 160, lg, 0, clamp(lg * 2)), display: 'flex', alignItems: 'center', gap: 16 }}><Mono s={100} morph={clamp(pr(t, 0.6, 0.9))} /><div style={{ fontFamily: F.brand, fontWeight: 600, fontSize: 70, letterSpacing: -2, color: C.cream }}>altrove</div></div>
      <div style={{ position: 'absolute', left: MX, top: MY + 30, scale: String(1.04 - 0.04 * eo(t / sc.D)), transformOrigin: `${IT[0]}px ${IT[1]}px` }}>
        <DotMap t={t} lit={-1}>
          {routes.map((r) => <path key={r.name} d={r.d} fill="none" stroke={C.sun} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${r.p} 1`} opacity={0.9} style={{ filter: 'drop-shadow(0 0 6px rgba(255,201,77,.8))' }} />)}
        </DotMap>
        {routes.map((r) => r.p > 0 && r.p < 1 && <div key={r.name} style={at(r.px, r.py, 1, r.ang, 1)}><Plane s={54} c={C.cream} /></div>)}
        {routes.map((r) => { const Ic = ICONS[r.i % 3]; const a = sp(t, Math.max(c.routes + r.i * 0.09 + 0.6, c.icons + r.i * 0.07), 3.2, 0.42);
          return <div key={r.name} style={{ ...at(r.x1, r.y1, clamp(a, 0, 1.3), 0, clamp(a * 2)), width: 74, height: 74, borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,.4)' }}><Ic s={46} c={C.tq} /></div>; })}
        <div style={{ ...at(x0, y0, 1, 0, 1), width: 30, height: 30, borderRadius: '50%', background: C.sun, boxShadow: `0 0 0 ${10 + 6 * Math.sin(t * 6)}px rgba(255,201,77,.3)` }} />
      </div>
      <AbsoluteFill style={{ background: 'rgba(2,20,18,.55)', opacity: dim }} />
      <div style={{ ...at(540, 680 + 1500 * (1 - clamp(card, 0, 1.1)), 1, -2 + 2 * clamp(card), clamp(card * 3)), width: 760, padding: '40px 50px 36px', borderRadius: 40, background: C.cream, boxShadow: '0 40px 100px rgba(0,0,0,.5)' }}>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: C.ink, marginBottom: 14 }}>Your trip</div>
        {[[Plane, 'Flights'], [Bed, 'Stays'], [Ticket, 'Experiences']].map(([Ic, label], i) => { const a = sp(t, c.card + 0.18 + i * 0.12, 3.2, 0.45);
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '12px 0', borderBottom: '3px solid #EDE6DA', opacity: clamp(a * 2), translate: `${60 * (1 - clamp(a))}px 0px` }}><Ic s={60} c={C.tq} /><div style={{ flex: 1, fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.ink }}>{label}</div><div style={{ scale: String(clamp(a, 0, 1.2)) }}><Check s={50} /></div></div>; })}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <div style={{ fontFamily: F.brand, fontWeight: 800, fontSize: 50, color: C.tq, letterSpacing: -1 }}>One clear total</div>
          <div style={{ scale: String(clamp(sp(t, c.check, 3, 0.4), 0, 1.3)), filter: 'drop-shadow(0 0 14px rgba(255,201,77,.9))' }}><Check s={84} bg={C.sun} /></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. finale: sunset, "NEXT DEPARTURE" board flips to ALTROVE / COMING SOON ----------
const SUNSET = 'linear-gradient(180deg, #03221E 0%, #005A50 36%, #0E8A7B 54%, #F0A35E 80%, #FFC94D 100%)';
export const End = ({ sc }) => {
  const t = useT(); const c = sc.cues; const h = sp(t, c.handle, 3, 0.45); const lg = sp(t, 0.05, 2.8, 0.45);
  const cyc = ((t + 1.2) % 2.4) / 2.4; const m = cyc < 0.25 ? 0 : cyc < 0.38 ? eio((cyc - 0.25) / 0.13) : cyc < 0.75 ? 1 : cyc < 0.88 ? 1 - eio((cyc - 0.75) / 0.13) : 0;
  const px = -260 + 420 * t;
  return (
    <AbsoluteFill>
      <Stars t={t} n={45} maxY={560} seed={11} o={0.8} />
      <div style={{ position: 'absolute', left: 540 - 340, top: 1480 - 40 * eo(t / sc.D), width: 680, height: 680, borderRadius: '50%', background: C.sun, boxShadow: '0 0 160px 60px rgba(255,201,77,.6)' }} />
      <div style={{ position: 'absolute', left: px, top: 1330 }}>
        <div style={{ position: 'absolute', left: -520, top: 22, width: 520, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, rgba(251,248,243,0), rgba(251,248,243,.6))' }} />
        <Jet s={130} c="#173B36" />
      </div>
      <div style={at(540, 250, lg, 0, clamp(lg * 2))}><Mono s={190} morph={t > c.soon ? m : 0} /></div>
      <div style={{ ...center, top: 432, fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: C.sun }}>NEXT DEPARTURE</div>
      <div style={{ ...panel, left: 80, top: 500, width: 920, height: 440 }} />
      <div style={{ ...center, top: 540 }}><FlapRow text="ALTROVE" t={t} start={0} settle={c.land1 - 0.36} spread={0.36} w={112} h={160} gap={10} fs={108} fg={C.sun} /></div>
      <div style={{ ...center, top: 750 }}><FlapRow text="COMING SOON" t={t} start={Math.max(0.2, c.flip2)} settle={c.soon - 0.4} spread={0.4} w={72} h={104} gap={6} fs={60} /></div>
      <div style={{ ...at(540, 1060 + 40 * (1 - clamp(h)), 1, 0, clamp(h * 2)), padding: '18px 38px', borderRadius: 40, background: C.cream, fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,.3)' }}>Follow @aitrove.travel</div>
    </AbsoluteFill>
  );
};

// id → { component, background, dark (cream captions), glow (white glow behind dark captions) }
export const SCENES = {
  hook: { C: Hook, bg: NIGHT, dark: true }, italy: { C: Italy, bg: MAPBG, dark: true },
  trip: { C: Trip, bg: 'linear-gradient(170deg, #0E8F80 0%, #00796B 45%, #005F54 100%)', dark: true },
  fees: { C: Fees, bg: 'linear-gradient(180deg, #FFD56E 0%, #FFC94D 50%, #F6B530 100%)', glow: false },
  altrove: { C: Altrove, bg: MAPBG, dark: true }, end: { C: End, bg: SUNSET, dark: true },
};
