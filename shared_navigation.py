"""Render one static navigation across the public site and its generators."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parent
TRAINING = [
    ('/', 'One-to-one training'),
    ('/boxing-fitness-east-london', 'Boxing fitness'),
    ('/weight-loss-personal-trainer-east-london', 'Weight loss coaching'),
    ('/personal-training-for-beginners-east-london', 'Training for beginners'),
    ('/mobile-personal-trainer-east-london', 'Mobile personal training'),
    ('/pair-personal-training-east-london', 'Pair sessions'),
]
MORE = [('/blog', 'Blog'), ('/tools', 'Free fitness tools'), ('https://app.dbworkouts.co.uk/', 'AI plans'), ('/contact', 'Contact Dean')]


def navigation(path='/'):
    def link(href, label):
        current = ' aria-current="page"' if path == href else ''
        return f'<a href="{href}"{current}>{escape(label)}</a>'
    def disclosure(label, links):
        return '<details class="primary-dropdown"><summary>' + label + '<span aria-hidden="true">⌄</span></summary><div class="primary-dropdown-links">' + ''.join(link(*x) for x in links) + '</div></details>'
    return '''<header class="primary-nav" id="primaryNav">
<div class="primary-nav-inner">
<a class="primary-brand" href="/" aria-label="DB's Workouts home"><img src="/pics/optimized/logo-160.webp" alt="" width="56" height="56" decoding="async"><span>DB's Workouts</span></a>
<button class="primary-toggle" id="navigationToggle" type="button" aria-label="Open navigation" aria-controls="navigationPanel" aria-expanded="false"><span></span><span></span><span></span></button>
<nav class="primary-links" id="navigationPanel" aria-label="Main navigation">''' + disclosure('Training', TRAINING) + link('/personal-trainer-east-london-areas', 'Areas') + link('/pricing', 'Pricing') + link('/testimonials', 'Results') + link('/about', 'About Dean') + disclosure('More', MORE) + '''<a class="primary-book" href="/contact">Book free consultation <span aria-hidden="true">↗</span></a></nav>
</div></header>'''


def apply_navigation(html, path='/'):
    patterns = [r'<header\b[^>]*class="site-nav"[^>]*>.*?</header>', r'<nav\b[^>]*class="db-nav"[^>]*>.*?</nav>', r'<header\b[^>]*class="primary-nav"[^>]*>.*?</header>']
    found = False
    for pattern in patterns:
        if re.search(pattern, html, re.S):
            html = re.sub(pattern, lambda _: navigation(path), html, count=1, flags=re.S)
            found = True
            break
    if not found:
        return html
    # Some pages attached two click handlers. Preserve their other page logic.
    def clean_script(match):
        script = match.group()
        if not any(token in script for token in ('navToggle', 'mobileMenu', 'dbNav', 'siteNav')):
            return script
        if 'var ro=' in script:
            return '<script>\n' + script[script.index('var ro='):]
        return ''
    html = re.sub(r'<script\b[^>]*>.*?</script>', clean_script, html, flags=re.S)
    html = re.sub(r'<script[^>]*src="/Script/boxing.js[^\"]*"[^>]*></script>', '', html)
    if '/Styles/site-navigation.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="/Styles/site-navigation.css?v=1">\n<script defer src="/Script/site-navigation.js?v=1"></script>\n</head>', 1)
    return html


if __name__ == '__main__':
    changed = 0
    for p in ROOT.glob('*.html'):
        before = p.read_text()
        after = apply_navigation(before, '/' if p.name == 'index.html' else '/' + p.stem)
        if after != before:
            p.write_text(after)
            changed += 1
    print(f'Updated navigation on {changed} pages')
