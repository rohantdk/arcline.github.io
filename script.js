/* Arcline
   - Mobile menu toggle
   - Highlight the nav link for the part of the page in view
*/

(() => {
  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });


  /* ─── ACTIVE NAV LINK ─── */
  const navLinks = [...links.querySelectorAll('a[href^="#"]')];
  const targets  = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  targets.forEach(t => observer.observe(t));


  /* ─── DEEP LINKS ─── */
  // Opening on a #hash jumps before the web fonts load and shift the layout;
  // re-align once they have, then turn on smooth scrolling for in-page links.
  const target = location.hash && document.querySelector(location.hash);
  window.addEventListener('load', () => {
    const settle = () => requestAnimationFrame(() => {
      if (target) target.scrollIntoView();
      document.documentElement.classList.add('is-ready');
    });
    document.fonts ? document.fonts.ready.then(settle) : settle();
  }, { once: true });
})();
