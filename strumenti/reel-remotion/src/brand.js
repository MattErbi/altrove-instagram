import { staticFile, continueRender, delayRender } from 'remotion';

export const C = { tq: '#00796B', tqd: '#005F54', tql: '#DCEFEC', sun: '#FFC94D', ink: '#1F1B18', cream: '#FBF8F3', sand: '#F5EFE6', white: '#FFFFFF', red: '#D4483A', muted: '#7A716B' };
export const F = { brand: 'Unbounded', serif: 'Fraunces', sans: 'Manrope' };

const faces = [
  ['Unbounded', 'unbounded-latin-600-normal.woff2', '600', 'normal'],
  ['Unbounded', 'unbounded-latin-800-normal.woff2', '800', 'normal'],
  ['Fraunces', 'fraunces-latin-600-normal.woff2', '600', 'normal'],
  ['Fraunces', 'fraunces-latin-600-italic.woff2', '600', 'italic'],
  ['Manrope', 'manrope-latin-600-normal.woff2', '600', 'normal'],
  ['Manrope', 'manrope-latin-800-normal.woff2', '800', 'normal'],
];
let loaded = false;
export const loadBrandFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const h = delayRender('brand fonts');
  Promise.all(faces.map(([family, file, weight, style]) => {
    const f = new FontFace(family, `url(${staticFile('fonts/' + file)})`, { weight, style });
    return f.load().then((ff) => document.fonts.add(ff));
  })).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
};
