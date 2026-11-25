# Reel di Altrove con Remotion (motore principale)

Video 1080×1920, 30 fps, 15–35 s. Immagine fatta con **Remotion** (React), suono con il **motore musicale di animation-studio** (MIT, in `vendor/engine`), effetti sonori **Kenney CC0** (`sfx/`), voce **Kokoro** (af_heart). Un solo file, `score.json`, decide i tempi di tutto: le animazioni e i suoni leggono gli stessi "cue", quindi non possono andare fuori sincrono.

Licenze: Remotion è gratis per persone e aziende fino a 3 persone; engine MIT (vendor/engine/LICENSE); suoni Kenney CC0 (sfx/LICENSE-Kenney-CC0.txt); font OFL (public/fonts/OFL.txt).

## Preparazione (una volta per sessione, ~2 minuti)
```
cp -r strumenti/reel-remotion ~/reel && cd ~/reel
npm i remotion@4.0.547 @remotion/bundler@4.0.547 @remotion/renderer@4.0.547 @remotion/motion-blur@4.0.547 @remotion/transitions@4.0.547 @remotion/fonts@4.0.547 react@19 react-dom@19
pip install --break-system-packages kokoro-onnx soundfile scipy
mkdir -p models && cd models && curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx && curl -sSLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin && cd ..
mkdir -p public/audio && ln -sfn public/audio audio
```

## Passi
1. **script.json** (il testo e i tempi). Una riga per scena:
   `{"id", "vo" (voce, inglese), "accent" (parole chiave come scritte in vo), "enter" ("zoom" | "whip" | "none"), "lead"/"tail" (secondi prima/dopo la voce, default 0.15/0.22), "caption" (false se la scena mostra già le parole in grande), "cues": [...]}`.
   Un cue è un momento della scena con il suo suono: `{"name": "land", "t": 0.42, "sfx": "impact"}` oppure agganciato a una parola detta: `{"name": "land", "word": "fifteen", "offset": -0.05, "sfx": "impact"}` (`"n": 1` per la seconda volta che la parola compare). Suoni: pop, pop2, tick, toggle, coins, ding, slide, stamp, impact, whoosh, whoosh_s, sparkle (sparkle suona anche il carillon del logo). Le transizioni "whip" aggiungono da sole il whoosh.
2. **Voce**: `MODELS=models python3 tts.py af_heart 1.1` → public/audio/*.wav + timing.json. Numeri in lettere ("eight to fifteen percent").
3. **Tempi**: `python3 timeline.py && node make-score.cjs` → score.json (anche in src/score.json): inizio e durata di ogni scena, parole con il loro tempo, cue in secondi.
4. **Scene**: scrivi `src/scenes/<nome-reel>.jsx` partendo da `esempio-agenzie.jsx` e fai puntare `src/scenes/current.jsx` al nuovo file. Ogni scena è un componente React che riceve `sc` (la scena di score.json): `const t = useT()` (secondi nella scena), `sc.cues.nome` (secondi del cue). Aiuti in `src/lib.js`: `sp(t, inizio, freq, smorzamento)` molla con rimbalzo, `pr`, `eo`, `eio`, `shake(t, quando, ampiezza)`, `at(x, y, scala, rotazione, opacità)`, `rnd(i)`. Icone in `src/components/Icons.jsx` (Coin, Person, Shop, Plane, Bed, Ticket, Check, Clock, Mono = logo con `morph` 0 "al" → 1 "ai", Bokeh). Sottotitoli parola per parola e camera (zoom kick, whip con vero motion blur, lenta spinta in avanti) sono automatici. Esporta `SCENES = { id: { C: Componente, bg: colore, dark: true se fondo scuro } }`.
   - Spazio: grafica tra y 180 e 1150; sottotitoli tra 1200 e 1530; niente di importante sotto 1600 né oltre x 960 in basso (pulsanti di Instagram).
   - Non usare `transition`/`animation` CSS: tutto deve dipendere da `t`.
   - Per effetti avanzati (transizioni @remotion/transitions, 3D, testo evidenziato, luci) leggi le skill del plugin Remotion se sono disponibili (`remotion-best-practices`, poi i suoi file in remotion-markup/).
5. **Anteprime**: `node render.mjs stills 0,45,120,...` (numeri di fotogramma = secondi × 30) → out/frames/*.jpg. Guardale con Read: fotogramma 0 pieno, niente testo tagliato o sovrapposto, ogni scena nel suo momento più carico.
6. **Video**: `node render.mjs video` (circa 3 minuti per 30 s) → out/video.mp4 muto.
7. **Suono**: `node audio.cjs afrobeats` → out/mix.wav (-14 LUFS). Generi: afrobeats (default, caldo e da viaggio), lofi (calmo), edm (energia), orchestral (epico), boombap. Ricetta e strumenti: `vendor/engine` + `references/music-cookbook.md` della skill animation-studio se disponibile. La musica si abbassa da sola sotto la voce.
8. **Unisci**: `sh mux.sh out/reel.mp4`, poi guarda almeno 6 fotogrammi del file finale (ffmpeg -ss <t> -frames:v 1).

## Regole
Solo colori e font del brand; nessuna emoji nelle grafiche; nessuna canzone; foto solo da Unsplash (e solo se l'ambiente riesce a scaricarle); numeri solo dalla tabella "Numeri verificati" del Piano con la fonte in piccolo nella scena; dati italiani detti come tali; un esempio di conversazione va segnato "EXAMPLE". Ganci e formati: vedi strumenti/reel/README.md nella galleria.
