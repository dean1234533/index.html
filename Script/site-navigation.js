(() => {
  const header = document.getElementById('primaryNav');
  if (!header || header.dataset.initialized) return;
  header.dataset.initialized = 'true';
  const toggle = document.getElementById('navigationToggle');
  const panel = document.getElementById('navigationPanel');
  const mobile = matchMedia('(max-width: 1099px)');
  const dropdowns = [...header.querySelectorAll('details')];
  let previousOverflow = null;
  function closeDropdowns() { dropdowns.forEach(item => { item.open = false; }); }
  function setOpen(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    panel.classList.toggle('is-open', open);
    panel.inert = mobile.matches && !open;
    if (open && previousOverflow === null) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!open && previousOverflow !== null) {
      document.body.style.overflow = previousOverflow;
      previousOverflow = null;
    }
    if (!open) closeDropdowns();
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  dropdowns.forEach(item => item.querySelector('summary').addEventListener('click', () => {
    dropdowns.filter(other => other !== item).forEach(other => { other.open = false; });
  }));
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
      else {
        const open = dropdowns.find(item => item.open);
        if (open) { open.open = false; open.querySelector('summary').focus(); }
      }
    }
    if (event.key === 'Tab' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') {
      const focusable = [...header.querySelectorAll('a,button,summary')].filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => setOpen(false));
  window.addEventListener('pageshow', () => setOpen(false));
  setOpen(false);
})();
