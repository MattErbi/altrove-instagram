import { useCurrentFrame, useVideoConfig } from 'remotion';

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const pr = (t, a, b) => clamp((t - a) / (b - a));
export const eo = (x) => 1 - Math.pow(1 - clamp(x), 3);
export const eio = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
// damped spring that overshoots and settles (0 before t0, → 1)
export const spring = (t, f = 3.2, z = 0.38) => { if (t <= 0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); };
export const sp = (t, a, f, z) => spring(t - a, f, z);
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const shake = (t, at, amp = 18) => { if (t < at) return [0, 0]; const d = t - at, e = Math.exp(-d * 9) * amp; return [e * Math.sin(d * 83), e * Math.cos(d * 71)]; };
// style for an element placed by its centre
export const at = (x, y, s = 1, r = 0, o = 1) => ({ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(s), rotate: `${r}deg`, opacity: o });
// local time in seconds inside the current Sequence
export const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
