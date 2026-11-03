#!/usr/bin/env python3
"""Area pages SEO helper.
1. Marks the outlying area pages noindex (kept live and linked, just not offered to Google) and removes them from sitemap.xml.
2. Adds a short 'Training near X' section to the area pages Google had not indexed: the real distance from Stratford and links to the nearest neighbouring areas.
Safe to re-run. Edit FAR_MILES / the lists below to change the rule.
"""
import glob, math, re, json, html

BASE = (51.5416, -0.0033)  # Stratford centre
FAR_MILES = 4.5            # unindexed pages farther than this from Stratford are marked noindex
# Pages Google crawled but did not index (Search Console, Nov 2026), area pages only
UNINDEXED = json.load(open('area_unindexed.json'))
# Coordinates for the older area pages that have no geo meta tag (approximate town centres)
EXTRA = {'upminster': (51.5586, 0.2510), 'woodford': (51.6078, 0.0339), 'canary-wharf': (51.5054, -0.0235), 'buckhurst-hill': (51.6264, 0.0384),
         'clapton': (51.5614, -0.0553), 'hornchurch': (51.5546, 0.2186), 'loughton': (51.6412, 0.0757), 'rainham': (51.5207, 0.1903)}

# Real service areas listed on the site (Essex towns): never noindexed, whatever the distance
KEEP = {'upminster', 'hornchurch', 'rainham', 'loughton', 'buckhurst-hill', 'woodford'}

def hav(a, b, c, d):
    R = 3958.8; p = math.pi / 180
    x = math.sin((c - a) * p / 2) ** 2 + math.cos(a * p) * math.cos(c * p) * math.sin((d - b) * p / 2) ** 2
    return 2 * R * math.asin(math.sqrt(x))

def coords():
    out = {}
    for f in glob.glob('personal-trainer-*.html'):
        slug = f[len('personal-trainer-'):-5]
        if slug == 'east-london-areas': continue
        s = open(f, encoding='utf-8').read()
        m = re.search(r'geo.position" content="([\d.]+);(-?[\d.]+)"', s)
        if m: out[slug] = (float(m.group(1)), float(m.group(2)))
        elif slug in EXTRA: out[slug] = EXTRA[slug]
    return out

def name_of(slug):
    s = open(f'personal-trainer-{slug}.html', encoding='utf-8').read()
    m = re.search(r'<title>Personal Trainer (.+?) \|', s)
    return html.unescape(m.group(1)) if m else slug.replace('-', ' ').title()

def main():
    co = coords()
    dist = {k: hav(*BASE, *v) for k, v in co.items()}
    far = sorted(k for k in UNINDEXED if k in dist and dist[k] > FAR_MILES and k not in KEEP)
    sm = open('sitemap.xml', encoding='utf-8').read(); removed = 0
    for k in far:
        f = f'personal-trainer-{k}.html'
        s = open(f, encoding='utf-8').read()
        s2 = s.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, follow">', 1)
        if s2 != s: open(f, 'w', encoding='utf-8').write(s2)
        sm, n = re.subn(r'\s*<url><loc>https://dbworkouts\.co\.uk/personal-trainer-%s</loc>.*?</url>' % re.escape(k), '', sm)
        removed += n
    open('sitemap.xml', 'w', encoding='utf-8').write(sm)
    indexable = {k for k in co if k not in far}
    added = 0
    for k in sorted(UNINDEXED):
        if k in far or k not in co: continue
        f = f'personal-trainer-{k}.html'
        s = open(f, encoding='utf-8').read()
        if '<!-- nearby-areas -->' in s: continue
        near = sorted((o for o in indexable if o != k), key=lambda o: hav(*co[k], *co[o]))[:4]
        links = ', '.join(f'<a href="/personal-trainer-{o}">{html.escape(name_of(o))}</a>' for o in near[:-1]) + f' or <a href="/personal-trainer-{near[-1]}">{html.escape(name_of(near[-1]))}</a>'
        d = dist[k]
        away = 'under a mile' if d < 1 else f'about {d:.1f} miles'
        area = name_of(k)
        block = (f'<!-- nearby-areas --><section class="seo-section"><h2>Training near <span class="redText">{html.escape(area)}</span></h2>'
                 f'<p>{html.escape(area)} is {away} from Stratford, where DB\'s Workouts is based, so sessions are easy to arrange. '
                 f'If you live or work close by you can also train near {links}.</p></section>\n')
        m = re.search(r'Training Locations in[^<]*</h2>.*?</section>\n?', s, re.S)
        if not m: print('no location block', f); continue
        s = s[:m.end()] + block + s[m.end():]
        open(f, 'w', encoding='utf-8').write(s); added += 1
    print(f'noindex {len(far)} pages, removed {removed} from sitemap, added nearby section to {added} pages')
    print('noindexed:', ', '.join(far))

if __name__ == '__main__':
    main()
