import json, re, numpy as np, soundfile as sf
T = json.load(open("timing.json")); SC = {s["id"]: s for s in json.load(open("script.json"))}
def gaps(a, sr):
    hop = int(0.01*sr); e = np.array([np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0, len(a)-hop, hop)])
    thr = max(e.max()*0.04, 1e-4); sil = e < thr; out = []; i = 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if i > 0 and j < len(sil) and (j-i) >= 6: out.append((i*0.01, j*0.01))
            i = j
        else: i += 1
    nz = np.where(~sil)[0]
    return out, nz[0]*0.01, (nz[-1]+1)*0.01
def weight(x):
    d = len(re.sub(r"[^0-9]", "", x))  # numbers are spoken long: ~7 letters per digit
    return len(re.sub(r"[^A-Za-z]", "", x)) + 7.0 * d + 2.0
t = 0; out = []
for s in T:
    a, sr = sf.read(f"audio/{s['id']}.wav"); a = a if a.ndim == 1 else a.mean(1)
    G, v0, v1 = gaps(a, sr)
    words = s["vo"].split()
    breaks = [i for i, w in enumerate(words[:-1]) if w[-1] in ".?!,:"]
    G = sorted(sorted(G, key=lambda g: g[0]-g[1])[:len(breaks)])  # longest gaps, in time order
    # phrases
    phrases = []; st = 0
    for b in breaks: phrases.append(words[st:b+1]); st = b+1
    phrases.append(words[st:])
    bounds = []; cur = v0
    for k, ph in enumerate(phrases):
        end = G[k][0] if k < len(G) else v1
        bounds.append((cur, end)); cur = G[k][1] if k < len(G) else v1
    if len(G) < len(breaks):  # fallback: proportional over whole line
        bounds = None
    L = SC[s["id"]].get("lead", 0.15); Tl = SC[s["id"]].get("tail", 0.22)
    ws = []
    if bounds:
        for ph, (b0, b1) in zip(phrases, bounds):
            tot = sum(weight(w) for w in ph); c = b0
            for w in ph: ws.append({"w": w, "t": round(L + c, 3)}); c += (b1-b0)*weight(w)/tot
    else:
        tot = sum(weight(w) for w in words); c = v0
        for w in words: ws.append({"w": w, "t": round(L + c, 3)}); c += (v1-v0)*weight(w)/tot
    for w in ws: w["accent"] = w["w"] in SC[s["id"]].get("accent", [])
    D = round(L + s["dur"] + Tl, 3)
    out.append({"id": s["id"], "start": round(t,3), "D": D, "lead": L, "vdur": s["dur"], "caption": SC[s["id"]].get("caption", True), "words": ws, "aligned": bool(bounds)})
    t += D
json.dump(out, open("timeline.json","w"), indent=1)
print("total", round(t,2))
for o in out: print(o["id"], o["aligned"], [(w["w"], w["t"]) for w in o["words"]][:8])
