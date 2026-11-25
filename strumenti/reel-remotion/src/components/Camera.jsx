import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useT, pr, eo, eio, sp } from '../lib';

// Scene camera: 'zoom' kick in, 'whip' pan in, whip out when the next scene whips in, slow push-in.
// Fast pans get a smooth horizontal motion blur (SVG gaussian blur stretched along the movement).
export const Camera = ({ sc, nextEnter, children }) => {
  const t = useT(); const D = sc.D;
  let tx = 0, s = 1, blur = 0;
  if (sc.enter === 'whip') { const k = pr(t, 0, 0.2); tx = 620 * (1 - eo(k)); blur = 70 * (1 - k); }
  if (sc.enter === 'zoom') { const z = sp(t, 0, 3.4, 0.5); s = 1.14 - 0.14 * z; blur = Math.max(blur, 14 * Math.max(0, 1 - t / 0.12)); }
  if (nextEnter === 'whip') { const k = pr(t, D - 0.13, D); tx -= 700 * eio(k); blur = Math.max(blur, 80 * k); }
  s *= 1 + 0.025 * (t / D);
  const id = `mb-${sc.id}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: 'absolute' }}><filter id={id} x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation={`${blur.toFixed(1)} 0`} /></filter></svg>
      <AbsoluteFill style={{ translate: `${tx}px 0px`, scale: String(s), transformOrigin: '540px 760px', filter: blur > 0.5 ? `url(#${id})` : 'none' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
