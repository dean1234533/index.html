"""Remove inline analytics scripts from all HTML pages and replace with cookie-consent.js."""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))
CONSENT_TAG = '  <script src="/Script/cookie-consent.js"></script>'

# Patterns to remove — GTM inline scripts, GA4 inline scripts, Clarity inline scripts
PATTERNS = [
    # GTM head snippet (both containers)
    re.compile(r'\s*<!-- Google Tag Manager -->\s*<script>.*?</script>\s*<!-- End Google Tag Manager -->', re.DOTALL),
    # GA4 gtag snippet with src tag
    re.compile(r'\s*<!-- Google tag \(gtag\.js\) -->\s*<script[^>]*src="https://www\.googletagmanager\.com/gtag/js[^"]*"[^>]*></script>\s*<script>.*?</script>', re.DOTALL),
    # Bare GA4 src + config block
    re.compile(r'\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=[^"]*"></script>\s*<script>\s*window\.dataLayer.*?</script>', re.DOTALL),
    # Bare GA4 config-only block (no src tag, just dataLayer/gtag calls)
    re.compile(r'\s*<script>\s*window\.dataLayer\s*=\s*window\.dataLayer[^<]*gtag\([^<]*</script>', re.DOTALL),
    # Clarity with comment wrapper
    re.compile(r'\s*<!--[^-]*[Cc]larity[^-]*-->\s*<script[^>]*>.*?clarity.*?</script>', re.DOTALL),
    # Bare Clarity inline (any script containing clarity.ms)
    re.compile(r'\s*<script[^>]*>\s*\(function[^<]*clarity\.ms[^<]*</script>', re.DOTALL),
    # GTM noscript iframes in body
    re.compile(r'\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript>.*?</noscript>\s*<!-- End Google Tag Manager \(noscript\) -->', re.DOTALL),
]

html_files = glob.glob(os.path.join(BASE, '*.html'))
updated = 0

for fpath in sorted(html_files):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Always re-run patterns even if consent script already present (clean leftovers)

    # Remove all inline tracking
    for pattern in PATTERNS:
        content = pattern.sub('', content)

    # Inject consent script just before </head>
    if CONSENT_TAG not in content and '</head>' in content:
        content = content.replace('</head>', CONSENT_TAG + '\n</head>', 1)

    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {os.path.basename(fpath)}')
        updated += 1
    else:
        print(f'No change: {os.path.basename(fpath)}')

print(f'\nDone — {updated} files updated.')
