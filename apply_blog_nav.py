import os, re

BASE = os.path.dirname(os.path.abspath(__file__))
TARGET = ['active-living-1.html', 'active-living-2.html', 'active-living-3.html', 'blog-post.html']

NEW_NAV = """<nav class="db-nav" id="dbNav">
  <div class="db-nav-inner">
    <a href="index.html" class="db-nav-logo">
      <img src="./pics/logo.png" alt="DB's Workouts" width="36" height="36" loading="lazy">
      <span>DB's Workouts</span>
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
</nav>"""

NAV_JS = """<script>
  var nav=document.getElementById('dbNav'),tog=document.getElementById('navToggle'),mob=document.getElementById('mobileMenu');
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20);},{passive:true});
  tog.addEventListener('click',function(){var o=mob.classList.toggle('open');tog.classList.toggle('active',o);document.body.style.overflow=o?'hidden':'';});
</script>"""

for fname in TARGET:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'Not found: {fname}')
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'db-nav' in content:
        print(f'Already updated: {fname}')
        continue

    # Add db.css
    if 'Styles/db.css' not in content:
        content = content.replace('</head>', '  <link rel="stylesheet" href="Styles/db.css">\n</head>', 1)

    # Replace old navContainer
    m = re.search(r'<div[^>]*class=["\']?navContainer["\']?[^>]*>.*?</div>\s*', content, re.DOTALL | re.IGNORECASE)
    if m:
        content = content[:m.start()] + NEW_NAV + '\n' + content[m.end():]
        content = content.replace('</body>', NAV_JS + '\n</body>', 1)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {fname}')
    else:
        print(f'  WARNING: no old nav found in {fname}')
