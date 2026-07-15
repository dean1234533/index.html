"""
Apply Bootstrap dark mode + font upgrade to all inner pages.
- Adds data-bs-theme="dark" to <html> on every Bootstrap page
- Upgrades body font to Inter (via Google Fonts preload)
- Skips index.html (has its own separate dark CSS)
"""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

FONT_TAG = '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'

FONT_OVERRIDE = """  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
    h1,h2,h3,h4,h5,h6 { font-family: 'Inter', sans-serif !important; font-weight: 700 !important; }
    [data-bs-theme="dark"] { --bs-body-bg: #0a0a0a; --bs-body-color: #e8e8e8; }
    [data-bs-theme="dark"] .card { background-color: #141414 !important; border-color: rgba(255,255,255,0.07) !important; }
    [data-bs-theme="dark"] .bg-light, [data-bs-theme="dark"] .bg-white { background-color: #111 !important; }
    [data-bs-theme="dark"] a { color: #e8e8e8; }
    [data-bs-theme="dark"] a:hover { color: #fff; }
    [data-bs-theme="dark"] h1,
    [data-bs-theme="dark"] h2,
    [data-bs-theme="dark"] h3 { color: #ffffff; }
  </style>"""

html_files = [f for f in glob.glob(os.path.join(BASE, '*.html'))
              if os.path.basename(f) != 'index.html']

updated = 0

for fpath in sorted(html_files):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Only touch Bootstrap pages
    if 'bootstrap' not in content.lower():
        print(f'Skip (no Bootstrap): {os.path.basename(fpath)}')
        continue

    # 1. Add data-bs-theme="dark" to <html>
    if 'data-bs-theme' not in content:
        content = re.sub(r'<html\b([^>]*)>', lambda m: f'<html{m.group(1)} data-bs-theme="dark">', content, count=1)

    # 2. Inject Inter font before </head>
    if 'fonts.googleapis.com/css2?family=Inter' not in content and FONT_TAG not in content:
        content = content.replace('</head>', FONT_TAG + '\n' + FONT_OVERRIDE + '\n</head>', 1)
    elif FONT_OVERRIDE not in content:
        content = content.replace('</head>', FONT_OVERRIDE + '\n</head>', 1)

    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {os.path.basename(fpath)}')
        updated += 1
    else:
        print(f'No change: {os.path.basename(fpath)}')

print(f'\nDone — {updated} files updated.')
