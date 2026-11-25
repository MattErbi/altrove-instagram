import React from 'react';
import { Composition } from 'remotion';
import { Reel } from './Reel';
import score from './score.json';

export const RemotionRoot = () => (
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30} durationInFrames={Math.round(score.duration * 30)} />
);
