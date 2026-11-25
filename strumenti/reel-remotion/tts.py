import json, os, soundfile as sf, numpy as np, sys
from kokoro_onnx import Kokoro
voice = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.08
k = Kokoro(os.environ.get("MODELS","models") + "/kokoro-v1.0.onnx", os.environ.get("MODELS","models") + "/voices-v1.0.bin")
S = json.load(open("script.json"))
out = []
for s in S:
    a, sr = k.create(s["vo"], voice=voice, speed=speed, lang="en-us")
    a = np.asarray(a, dtype=np.float32)
    # trim leading/trailing silence
    thr = 0.01; idx = np.where(np.abs(a) > thr)[0]
    a = a[max(0, idx[0]-int(0.03*sr)): idx[-1]+int(0.08*sr)]
    os.makedirs("audio", exist_ok=True); sf.write(f"audio/{s['id']}.wav", a, sr)
    s["dur"] = round(len(a)/sr, 3); out.append(s)
    print(s["id"], s["dur"])
json.dump(out, open("timing.json", "w"), indent=1)
print("total voice", round(sum(x["dur"] for x in out), 2))
