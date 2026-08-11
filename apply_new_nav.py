"""
Applies new premium nav + footer to location pages.
- Replaces old navContainer/navBar structure with new db-nav
- Replaces old footer with new db-footer
- Adds db.css link (after Bootstrap, so it can add the nav/footer styles)
- Adds Montserrat font to Google Fonts
- Keeps Bootstrap content areas intact
"""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# Pages to skip (already fully rebuilt with db.css)
SKIP = {'index.html', 'about.html', 'pricing.html', 'contact.html', 'testimonials.html', 'active-living-1.html', 'active-living-2.html', 'active-living-3.html', 'blog-post.html'}

NEW_NAV = '''<nav class="db-nav" id="dbNav">
  <div class="db-nav-inner">
    <a href="index.html" class="db-nav-logo">
      <img src="./pics/logo.png" alt="DB's Workouts" width="36" height="36" loading="lazy">
      <span>DB\'s Workouts</span>
    </a>
    <div class="db-nav-links">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="pricing.html">Pricing</a>
      <a href="testimonials.html">Results</a>
      <a href="active-living-1.html">Blog</a>
      <a href="contact.html">Contact</a>
    </div>
    <a href="contact.html" class="db-nav-cta">Book Free Consultation</a>
    <button class="db-nav-hamburger" id="navToggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="db-mobile-menu" id="mobileMenu">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="pricing.html">Pricing</a>
    <a href="testimonials.html">Results</a>
    <a href="active-living-1.html">Blog</a>
    <a href="contact.html">Contact</a>
    <a href="contact.html" class="db-mobile-cta">Book Free Consultation</a>
  </div>
</nav>'''

NEW_FOOTER = '''<footer class="db-footer">
  <div class="db-footer-inner">
    <div>
      <div class="db-footer-brand">
        <img src="./pics/logo.png" alt="DB\'s Workouts logo" width="44" height="44" loading="lazy">
        <div><div class="db-fb-name">DB\'s Workouts</div><span class="db-fb-tag">East London Personal Trainer</span><span class="db-fb-stars">&#9733;&#9733;&#9733;&#9733;&#9733; Google Rated</span></div>
      </div>
      <p style="font-size:.85rem;max-width:280px;line-height:1.7;color:var(--text-muted);margin-top:24px">Premium personal training across East London &amp; Essex parks. REPs certified. 700+ clients transformed since 2016.</p>
    </div>
    <div class="db-footer-col">
      <div class="db-footer-heading">Pages</div>
      <a href="about.html">About Dean</a>
      <a href="pricing.html">Pricing</a>
      <a href="testimonials.html">Results</a>
      <a href="active-living-1.html">Blog</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="db-footer-col">
      <div class="db-footer-heading">Locations</div>
      <a href="outdoor-pt-walthamstow.html">Walthamstow</a>
      <a href="personal-trainer-ilford.html">Ilford</a>
      <a href="personal-trainer-hackney.html">Hackney</a>
      <a href="personal-trainer-chingford.html">Chingford</a>
      <a href="personal-trainer-dagenham.html">Dagenham</a>
    </div>
    <div class="db-footer-col">
      <div class="db-footer-heading">Get In Touch</div>
      <a href="tel:+447752300937" class="db-footer-contact-item">07752 300937</a>
      <a href="mailto:dbs-workouts@yahoo.com" class="db-footer-contact-item">dbs-workouts@yahoo.com</a>
      <a href="https://wa.me/447752300937" class="db-footer-contact-item" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
  <div class="db-footer-bottom"><p>&#169; 2025 DB\'s Workouts. All rights reserved. &middot; <a href="privacy-policy.html">Privacy Policy</a></p></div>
</footer>
<a href="https://wa.me/447752300937" class="db-wa-fab" aria-label="WhatsApp Dean" target="_blank" rel="noopener">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.55 4.123 1.511 5.863L.057 23.01a.5.5 0 00.633.633l5.183-1.461A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.654-.49-5.193-1.349l-.371-.219-3.838 1.082 1.093-3.783-.238-.39A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
</a>'''

NAV_JS = '''<script>
  var nav=document.getElementById(\'dbNav\'),tog=document.getElementById(\'navToggle\'),mob=document.getElementById(\'mobileMenu\');
  window.addEventListener(\'scroll\',function(){nav.classList.toggle(\'scrolled\',window.scrollY>20);},{passive:true});
  tog.addEventListener(\'click\',function(){var o=mob.classList.toggle(\'open\');tog.classList.toggle(\'active\',o);document.body.style.overflow=o?\'hidden\':\'\';});
  var ro=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add(\'revealed\');ro.unobserve(x.target);}});},{threshold:.12});
  document.querySelectorAll(\'[data-reveal]\').forEach(function(el){ro.observe(el);});
</script>'''

DB_CSS_LINK = '  <link rel="stylesheet" href="Styles/db.css">'
MONTSERRAT_FONT = 'family=Montserrat:wght@700;800;900&'

html_files = [f for f in glob.glob(os.path.join(BASE, '*.html'))
              if os.path.basename(f) not in SKIP]

updated = 0
skipped = 0

# Old nav patterns to detect and replace
NAV_PATTERNS = [
    # Pattern 1: navContainer wrapping navBar
    r'<div[^>]*class=["\']navContainer["\'][^>]*>.*?</div>\s*(?=<)',
    # Pattern 2: standalone navBar
    r'<nav[^>]*class=["\']navBar["\'][^>]*>.*?</nav>',
    # Pattern 3: section.section1 that wraps nav
]

# Old footer patterns
FOOTER_PATTERNS = [
    r'<footer[^>]*>.*?</footer>',
]

for fpath in sorted(html_files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Skip if already has db-nav (already updated)
    if 'db-nav' in content:
        print(f'Skip (already updated): {fname}')
        skipped += 1
        continue

    # 1. Add db.css before </head> if not already present
    if 'Styles/db.css' not in content:
        content = content.replace('</head>', DB_CSS_LINK + '\n</head>', 1)

    # 2. Upgrade Google Fonts to include Montserrat if Inter is there but Montserrat isn't
    if 'fonts.googleapis.com' in content and 'Montserrat' not in content:
        content = content.replace(
            'family=Inter',
            'family=Inter&family=Montserrat:wght@700;800;900'
        )

    # 3. Replace old nav with new nav
    # Try to find and replace the navContainer + everything inside
    nav_replaced = False

    # Pattern: <div class="navContainer"> ... </div>\n<div class="content-container">
    # or just the nav section
    nav_match = re.search(
        r'<div[^>]*class=["\']?navContainer["\']?[^>]*>.*?</div>\s*(?=<div|<main|<section)',
        content, re.DOTALL | re.IGNORECASE
    )
    if nav_match:
        content = content[:nav_match.start()] + NEW_NAV + '\n' + content[nav_match.end():]
        nav_replaced = True

    if not nav_replaced:
        # Try navBar alone
        nav_match = re.search(
            r'<nav[^>]*class=["\']?navBar["\']?[^>]*>.*?</nav>',
            content, re.DOTALL | re.IGNORECASE
        )
        if nav_match:
            content = content[:nav_match.start()] + NEW_NAV + content[nav_match.end():]
            nav_replaced = True

    if not nav_replaced:
        print(f'  WARNING: Could not find old nav in {fname}')

    # 4. Replace old footer with new footer
    footer_match = re.search(r'<footer[^>]*>.*?</footer>', content, re.DOTALL | re.IGNORECASE)
    if footer_match:
        # Remove everything after the existing closing footer tag up to the scripts
        # since we'll add the footer + FAB
        content = content[:footer_match.start()] + NEW_FOOTER + content[footer_match.end():]
    else:
        # Append before </body>
        content = content.replace('</body>', NEW_FOOTER + '\n</body>', 1)

    # 5. Inject nav JS before </body> if not already present
    if 'dbNav' not in content:
        content = content.replace('</body>', NAV_JS + '\n</body>', 1)

    # 6. Remove Bootstrap dark mode overrides added by previous script
    content = re.sub(r'\s*<style>\s*body \{ font-family.*?\}\s*</style>', '', content, flags=re.DOTALL)

    # 7. Ensure body has dark background via inline style if no Bootstrap dark mode
    if 'data-bs-theme="dark"' not in content and 'background:#0a0a0a' not in content:
        content = content.replace('<body>', '<body style="background:#080808;color:#f0f0f0">', 1)

    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {fname}')
        updated += 1
    else:
        print(f'No change: {fname}')

print(f'\nDone — {updated} updated, {skipped} already done.')
