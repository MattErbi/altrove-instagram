import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { loadBrandFonts } from './brand';
import { Camera } from './components/Camera';
import { Captions } from './components/Captions';
import score from './score.json';
import { SCENES } from './scenes/current';

loadBrandFonts();

export const Reel = () => {
  const { fps } = useVideoConfig();
  const S = score.scenes;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {S.map((sc, i) => {
        const from = Math.round(sc.start * fps); const to = i + 1 < S.length ? Math.round(S[i + 1].start * fps) : Math.round(score.duration * fps);
        const def = SCENES[sc.id]; const Comp = def.C;
        return (
          <Sequence key={sc.id} name={sc.id} from={from} durationInFrames={to - from}>
            <AbsoluteFill style={{ background: def.bg, overflow: 'hidden' }}>
              <Camera sc={sc} nextEnter={S[i + 1]?.enter}>
                <Comp sc={sc} />
                <Captions sc={sc} dark={def.dark} glow={def.glow !== false} />
              </Camera>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
