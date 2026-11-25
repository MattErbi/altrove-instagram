// Builds score.json (single source of truth for picture AND sound) from script.json + timeline.json
const fs = require('fs');
const S = JSON.parse(fs.readFileSync('script.json', 'utf8'));
const TL = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
const norm = (w) => w.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
const scenes = [], sfx = [];
for (const sc of TL) {
  const spec = S.find((s) => s.id === sc.id) || {};
  const cues = {};
  for (const c of spec.cues || []) {
    let t = c.t;
    if (c.word) {
      const hits = sc.words.filter((w) => norm(w.w) === norm(c.word));
      const w = hits[c.n || 0];
      if (!w) throw new Error(`cue ${sc.id}.${c.name}: word "${c.word}" not found`);
      t = w.t + (c.offset || 0);
    }
    cues[c.name] = +t.toFixed(3);
    if (c.sfx) sfx.push({ t: +(sc.start + t).toFixed(3), k: c.sfx, gain: c.gain || 1 });
  }
  const enter = spec.enter || 'zoom';
  if (enter === 'whip') sfx.push({ t: Math.max(0, +(sc.start - 0.14).toFixed(3)), k: 'whoosh', gain: 1 });
  scenes.push({ ...sc, enter, cues });
}
const total = scenes.reduce((a, s) => a + s.D, 0);
fs.writeFileSync('score.json', JSON.stringify({ fps: 30, width: 1080, height: 1920, duration: +total.toFixed(3), scenes, sfx: sfx.sort((a, b) => a.t - b.t) }, null, 1));
fs.copyFileSync('score.json', 'src/score.json');
console.log('score.json:', scenes.length, 'scenes,', sfx.length, 'sounds,', total.toFixed(2), 's');
