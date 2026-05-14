/* ═══════════════════════════════════════════════════
   FORMA STUDIO — script.js
   - Navbar scroll behaviour
   - Hamburger menu toggle
   - Scroll reveal (IntersectionObserver)
   - Staggered child animations
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 20;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load


  /* ─── HAMBURGER MENU ─── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ─── SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -64px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ─── STAGGER ANIMATIONS ─── */
  // Stagger project cards
  document.querySelectorAll('.work__grid .project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  // Stagger service cards
  document.querySelectorAll('.services__grid .service-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Stagger about chips
  document.querySelectorAll('.about__chips span').forEach((chip, i) => {
    chip.style.transitionDelay = `${i * 0.04}s`;
  });


  /* ─── ACTIVE NAV LINK HIGHLIGHT ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(section => sectionObserver.observe(section));

});
