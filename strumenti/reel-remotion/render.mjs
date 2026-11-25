// node render.mjs stills 0,30,90      -> out/frames/*.jpg (look at them)
// node render.mjs video               -> out/video.mp4 (silent), then: node audio.cjs && sh mux.sh out/reel.mp4
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const mode = process.argv[2] || 'video';
const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx'), publicDir: path.resolve('public') });
const opts = { serveUrl, id: 'Reel', browserExecutable: process.env.CHROME || '/usr/bin/google-chrome', chromiumOptions: { gl: 'swangle' }, logLevel: 'error' };
const composition = await selectComposition(opts);
fs.mkdirSync('out/frames', { recursive: true });
if (mode === 'stills') {
  const frames = (process.argv[3] || '0').split(',').map(Number);
  for (const frame of frames) await renderStill({ ...opts, composition, frame, output: `out/frames/f${String(frame).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 85 });
} else {
  await renderMedia({ ...opts, composition, codec: 'h264', crf: 18, x264Preset: 'veryfast', pixelFormat: 'yuv420p', muted: true, outputLocation: 'out/video.tmp.mp4', concurrency: 2,
    onProgress: ({ progress }) => { const p = Math.round(progress * 100); if (p % 10 === 0 && p !== globalThis.__p) { globalThis.__p = p; console.log(p + '%'); } } });
  fs.renameSync('out/video.tmp.mp4', 'out/video.mp4');
}
console.log('done', ((Date.now() - t0) / 1000).toFixed(1), 's');
