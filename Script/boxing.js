// Homepage navigation behaviour for the boxing service page.
(function () {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  function setOpen(open) {
    toggle.classList.toggle('active', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
  }
  function updateScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  setOpen(false);
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
})();
