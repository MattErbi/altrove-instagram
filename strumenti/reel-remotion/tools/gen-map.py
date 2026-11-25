# Builds src/data/europe.json: a dot map of Europe (Italy marked) + city points, from the Natural Earth
# outlines shipped with animation-studio (engine/data/geo.js, public domain). Usage: python3 tools/gen-map.py <geo.js>
import json, math, sys
src = open(sys.argv[1]).read(); i = src.index('const GEO = ') + len('const GEO = ')
GEO, _ = json.JSONDecoder().raw_decode(src[i:])
LON0, LON1, LAT0, LAT1 = -11.5, 33.0, 34.0, 60.5
K = 1000 / ((LON1 - LON0) * math.cos(math.radians(48)))
def P(lon, lat): return ((lon - LON0) * K * math.cos(math.radians(48)), (LAT1 - lat) * K)
W, H = P(LON1, LAT0)
rings = []
for name, rs in GEO['world'].items():
    for r in rs:
        pts = [P(r[j], r[j+1]) for j in range(0, len(r), 2)]
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        if max(xs) < -20 or min(xs) > W + 20 or max(ys) < -20 or min(ys) > H + 20: continue
        rings.append((name, pts, (min(xs), min(ys), max(xs), max(ys))))
def inside(x, y, pts):
    c = False; n = len(pts)
    for a in range(n):
        x1, y1 = pts[a]; x2, y2 = pts[a-1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c
S = 17.0; dots = []
row = 0; y = S / 2
while y < H:
    x = S / 2 + (S / 2 if row % 2 else 0)
    while x < W:
        for name, pts, (a, b, c, d) in rings:
            if a <= x <= c and b <= y <= d and inside(x, y, pts):
                dots.append([round(x, 1), round(y, 1), 1 if name == 'Italy' else 0]); break
        x += S
    y += S * 0.866; row += 1
cities = {'Milan': (9.19, 45.46), 'Rome': (12.5, 41.9), 'Lisbon': (-9.14, 38.72), 'Paris': (2.35, 48.86), 'Barcelona': (2.17, 41.39),
          'Athens': (23.73, 37.98), 'Amsterdam': (4.9, 52.37), 'Prague': (14.42, 50.08), 'Copenhagen': (12.57, 55.68), 'Vienna': (16.37, 48.21)}
out = {'W': round(W), 'H': round(H), 'S': S, 'dots': dots, 'cities': {k: [round(v, 1) for v in P(*c)] for k, c in cities.items()}}
json.dump(out, open('src/data/europe.json', 'w'))
print(len(dots), 'dots,', sum(d[2] for d in dots), 'in Italy; size', out['W'], out['H'])
