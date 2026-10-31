"""Apply the shared, static SEO landing-page design without changing SEO copy.

Run after generating area pages. No third-party Python dependencies required.
"""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
import re
from shared_navigation import apply_navigation

ROOT = Path(__file__).resolve().parent
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class Children(HTMLParser):
    """Read direct child elements while preserving their original HTML."""
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source, self.depth, self.start, self.items = source, 0, 0, []
        self.lines = [0]
        self.lines += [m.end() for m in re.finditer('\n', source)]
        self.feed(source)

    def source_offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if self.depth == 0:
            self.start = self.source_offset()
        if tag in VOID:
            if self.depth == 0:
                self.items.append(self.source[self.start:self.source_offset() + len(self.get_starttag_text())])
        else:
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        if self.depth == 0:
            self.items.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        if tag not in VOID:
            self.depth -= 1
            if self.depth == 0:
                end = self.source.index('>', self.source_offset()) + 1
                self.items.append(self.source[self.start:end])


def plain(html):
    return unescape(re.sub('<[^>]+>', '', html)).strip()


def div_span(html, class_name):
    match = re.search(r'<div class="' + class_name + r'">', html)
    if not match:
        raise ValueError('Missing ' + class_name)
    depth = 0
    for tag in re.finditer(r'</?div\b[^>]*>', html[match.start():]):
        depth += -1 if tag.group().startswith('</') else 1
        if not depth:
            return match.start(), match.start() + tag.end()
    raise ValueError('Unclosed ' + class_name)


def button(href, text):
    return f'<a class="db-btn db-btn-primary" href="{href}">{text} <span aria-hidden="true">↗</span></a>'


def refresh_html(html):
    canonical = re.search(r'<link rel="canonical" href="https://dbworkouts.co.uk([^"\s]*)"', html)
    html = apply_navigation(html, canonical.group(1) or "/" if canonical else "/")
    if 'class="seo-page"' in html or 'class="hero-local"' not in html:
        return html
    hs, he = div_span(html, 'hero-local')
    cs, ce = div_span(html, 'page-content')
    hero = html[hs:he]
    content = html[cs:ce]
    heading = re.search(r'<h1[^>]*>(.*?)</h1>', hero, re.S).group(1)
    paras = re.findall(r'<p[^>]*>(.*?)</p>', hero, re.S)
    label, intro = paras[:2]
    title = plain(heading)
    is_group = 'Pair Personal Training' in title
    is_directory = 'Areas Covered' in title
    is_service = any(slug in html[:hs] for slug in ('weight-loss-personal-trainer-east-london', 'personal-training-for-beginners-east-london', 'mobile-personal-trainer-east-london', 'pair-personal-training-east-london'))
    image = 'training-8096.webp' if is_group else 'training-7856.webp'
    image_alt = 'DB’s Workouts clients training with dumbbells outdoors' if is_group else 'DB’s Workouts clients performing lunges in a local park'
    photo_caption = 'Good company. A shared goal.' if is_group else 'Fresh air. Focused coaching.'
    hero_new = f'''<main id="main-content" class="seo-page">
<section class="seo-hero"><div class="seo-wrap seo-hero-grid">
<div><p class="seo-kicker">{label}</p><h1>{heading}</h1>
<p class="seo-lead">{intro}</p>
<div class="seo-actions">{button('/contact', 'Book a free consultation')}<a class="seo-text-link" href="#training-details">Explore your training <span aria-hidden="true">↓</span></a></div>
<p class="seo-note">Beginners welcome · Equipment provided · No gym needed</p></div>
<figure class="seo-hero-photo"><img src="/pics/optimized/{image}" alt="{image_alt}" width="640" height="360" fetchpriority="high" decoding="async"><figcaption><span>DB’S WORKOUTS · OUTDOORS, TOGETHER</span><strong>{photo_caption}</strong></figcaption></figure>
</div></section>
<div class="seo-trust"><div class="seo-wrap"><a href="/testimonials"><b>5.0 ★★★★★</b><span>70 Google reviews</span></a><span><b>Since 2019</b>Qualified personal trainer</span><span><b>Built around you</b>Your goals. Your starting point.</span><span><b>Free consultation</b>A conversation with Dean</span></div></div>
<div class="seo-wrap seo-content" id="training-details">'''
    inner = content[content.index('>')+1:content.rfind('</div>')]
    groups = []
    for item in Children(inner).items:
        tag = re.match(r'<(\w+)', item).group(1)
        if tag == 'h2' or tag == 'div':
            groups.append([item])
        elif tag == 'a' and 'cta-btn' in item:
            continue
        elif groups:
            groups[-1].append(item)
        else:
            groups.append([item])
    sections = []
    for group in groups:
        block = '\n'.join(group)
        text = plain(block)
        if re.search(r'<h3\b', block):
            # Keep answer text verbatim, including every schema-backed FAQ.
            block = re.sub(r'<h3[^>]*>(.*?)</h3>\s*(<p[^>]*>.*?</p>)',
                           r'<details><summary>\1<span aria-hidden="true">+</span></summary>\2</details>', block, flags=re.S)
            block = re.sub(r'<div class="info-block"[^>]*>', '<div class="seo-faq">', block, count=1)
            block = re.sub(r'<h2[^>]*>', '<h2>', block, count=1)
            sections.append('<section class="seo-section seo-faq-section">' + block + '</section>')
        elif text.startswith('Quick answer:'):
            block = re.sub(r'<div class="info-block"[^>]*>', '<aside class="seo-quick">', block, count=1)
            block = block[:block.rfind('</div>')] + '</aside>'
            sections.append(block)
        elif re.search(r'^Pricing for', text):
            sections.append('<section class="seo-section">' + block + price_grid() + '</section>')
        elif text.startswith("What's Included") or text.startswith('What your first personal training session involves'):
            sections.append('<section class="seo-section seo-session"><div>' + block + steps() + '</div><figure><img src="/pics/optimized/training-8096.webp" alt="Clients exercising with portable training equipment outdoors" width="640" height="360" loading="lazy" decoding="async"><figcaption>Real sessions. Real people. Room to progress.</figcaption></figure></section>')
        else:
            sections.append('<section class="seo-section">' + block + '</section>')
    proof = '''<section class="seo-proof seo-section"><div><p class="seo-kicker">YOUR COACH, OUTDOORS</p><h2>A familiar face.<br>A plan that fits you.</h2><p>Dean Burt is a REPs Level 3 certified personal trainer, qualified since 2019. Start with a conversation about your goals, your experience and a location that works for you.</p><a class="seo-text-link" href="/about">Meet Dean <span aria-hidden="true">↗</span></a></div><img src="/pics/optimized/dean-portrait.webp" alt="Dean Burt, your DB’s Workouts personal trainer" width="620" height="700" loading="lazy" decoding="async"><blockquote><span class="seo-stars" aria-label="5 stars">★★★★★</span><p>“Really enjoy these classes for a full body workout! Dean is a great instructor, friendly and will help you get the most out of the class.”</p><cite>Sean Bree · Google review</cite><a class="seo-text-link" href="/testimonials">More client stories <span aria-hidden="true">↗</span></a></blockquote></section>'''
    # Social proof appears early, while the local and service copy remains intact.
    sections.insert(min(2, len(sections)), proof)
    if is_service and not is_directory:
        sections.insert(-1, '<section class="seo-section"><p class="seo-kicker">TRAIN YOUR WAY</p><h2>Choose your next step.</h2>' + price_grid() + '</section>')
    final = f'''<section class="seo-final"><p class="seo-kicker">LET’S GET STARTED</p><h2>Your next chapter<br>starts outside.</h2><p>Tell Dean what you want from training. Find your starting point together.</p><div class="seo-actions">{button('/contact','Book a free consultation')}<a class="seo-text-link" href="https://wa.me/447752300937">Message Dean on WhatsApp <span aria-hidden="true">↗</span></a></div><p class="seo-note">Free · No commitment · Personal advice</p></section></div></main>'''
    # Existing service pages already have a main wrapper.
    start = hs
    end = ce
    main_before = re.search(r'<main>\s*$', html[:hs])
    if main_before:
        start = main_before.start()
        after = re.match(r'\s*</main>', html[ce:])
        if after:
            end += after.end()
    html = html[:start] + hero_new + '\n'.join(sections) + final + html[end:]
    shared = '' if 'Styles/db.css' in html else '<link rel="stylesheet" href="/Styles/db.css?v=9">\n'
    html = html.replace('</head>', shared + '<link rel="stylesheet" href="/Styles/seo-pages.css?v=2">\n</head>', 1)
    # Repair the malformed legacy font URL on these pages only.
    html = html.replace('family=Inter&family=Montserrat:wght@700;800;900:wght@400;500;600;700', 'family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900')
    html = html.replace('<body>', '<body>\n<a class="seo-skip" href="#main-content">Skip to content</a>', 1)
    html = html.replace('&#169; 2025', '&#169; 2026')
    return html


def steps():
    return '''<ol class="seo-steps"><li><span>01</span><div><h3>Find your starting point</h3><p>A warm-up and movements suited to your current fitness.</p></div></li><li><span>02</span><div><h3>Train with purpose</h3><p>Coached strength, conditioning or boxing fitness around your goals.</p></div></li><li><span>03</span><div><h3>Build from here</h3><p>Cool down, review your session and keep your progress moving.</p></div></li></ol>'''


def price_grid():
    return '''<div class="seo-prices"><article><p class="seo-kicker">TRY A SESSION</p><h3>Pay as you go</h3><p class="seo-price">£50<span> / session</span></p><p>One-to-one coaching, with no block commitment.</p><a href="/contact" class="seo-text-link">Arrange a session ↗</a></article><article><p class="seo-kicker">BUILD YOUR ROUTINE</p><h3>10-session block</h3><p class="seo-price">£450<span> / block</span></p><p>£45 per session. Includes app nutrition and workout plans.</p><a href="/pricing" class="seo-text-link">Compare all packages ↗</a></article><article><p class="seo-kicker">TRAIN AS A PAIR</p><h3>Pair personal training</h3><p class="seo-price">£75<span> / pair / session</span></p><p>Pay-as-you-go total for two people. Pair sessions cost 1.5 times the corresponding one-person price.</p><a href="/pair-personal-training-east-london" class="seo-text-link">Explore pair training ↗</a></article></div>'''


if __name__ == '__main__':
    changed = []
    for path in sorted(ROOT.glob('*.html')):
        before = path.read_text()
        after = refresh_html(before)
        if before != after:
            path.write_text(after)
            changed.append(path.name)
    print(f'Refreshed {len(changed)} SEO pages')
