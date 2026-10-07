/* Arcline
   - Mobile menu toggle
   - Highlight the nav link for the part of the page in view
   - Scroll progress on the nav logo's baseline, tinted by the work category in view
   - Hero: letter intro, the logo mark with a dot per work category
   - Tools marquee that speeds up and turns with the scroll
   - Scroll reveals, counting stats, labels that decode, card spotlight, magnetic buttons
   - Live-site previews beside the cursor on project cards
   - Cards without a link light up when clicked
   - The mark again in Contact, with a dot that slides along its line
   - Project filter (status + search by name or stack)
   - Command palette (⌘K, Ctrl+K or /)
   - Copy email
   All motion is skipped under prefers-reduced-motion.
*/

(() => {
  const root = document.documentElement;
  root.classList.add('motion');   // tells the <head> fallback that this script ran

  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const behavior = reduce ? 'auto' : 'smooth';


  /* ─── MOBILE MENU ─── */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a, button')) setOpen(false); });
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


  /* ─── SCROLL PROGRESS: the logo's baseline fills ─── */
  const markFill = $('.nav__mark-fill');
  let progressQueued = false;
  const updateProgress = () => {
    progressQueued = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    markFill.style.strokeDashoffset = String(1 - p);
    updateWhere();
  };
  addEventListener('scroll', () => {
    if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener('resize', updateProgress);


  /* ─── WHERE AM I: the work category in view tints the nav ─── */
  const logo  = $('.nav__logo');
  const where = $('.nav__where', logo);
  const work  = $('#work');
  const catEls = $$('.cat');
  // read once, before the labels' decode effect touches the text
  const catLabels = new Map(catEls.map(c => [c, {
    n: $('.cat__index', c).firstChild.textContent.replace('Section', '').trim(),
    t: $('.cat__title', c).textContent,
  }]));
  let shownCat = null;

  function updateWhere() {
    const mid = innerHeight * 0.5;
    const w = work.getBoundingClientRect();
    let cur = null;
    if (w.top < mid && w.bottom > mid) {
      for (const c of catEls) {
        if (c.hidden) continue;
        if (c.getBoundingClientRect().top <= mid) cur = c; else break;
      }
    }
    if (cur === shownCat) return;
    shownCat = cur;
    if (!cur) {
      logo.removeAttribute('data-cat');
      where.classList.remove('is-on');
      return;
    }
    const { n, t } = catLabels.get(cur);
    logo.dataset.cat = cur.dataset.cat;
    where.textContent = '';
    const b = document.createElement('b');
    b.textContent = n;
    where.append(b, ' ' + t);
    where.classList.remove('is-on');
    void where.offsetWidth;
    where.classList.add('is-on');
  }
  updateProgress();


  /* ─── HERO TITLE: one span per letter ─── */
  const title = $('.hero__title');
  const word  = title.textContent.trim();
  title.setAttribute('aria-label', word);
  title.textContent = '';
  [...word].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'hero__char';
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--i', i);
    span.textContent = ch;
    title.appendChild(span);
  });


  /* ─── SCROLL REVEALS ─── */
  const heroDelays = new Map([
    ['.hero .eyebrow', 0], ['.hero__title', 0], ['.hero__mark', 0],
    ['.hero__lead', 0.55], ['.hero__sub', 0.68], ['.hero__actions', 0.8],
  ]);
  heroDelays.forEach((d, sel) => {
    const el = $(sel);
    el.classList.add('reveal');
    el.style.setProperty('--d', d + 's');
  });

  $$('.block .eyebrow, .work__intro .eyebrow, .block__title, .about__text p, .cat__head, .contents .label, .contact .eyebrow, .contact__title, .contact__lead, .contact__mark')
    .forEach(el => el.classList.add('reveal'));

  // groups whose children come in one after another
  [['.toc', 'li', 60], ['.stats', 'div', 90], ['.services', 'li', 70], ['.steps', 'li', 280], ['.contact__grid', 'div', 80]]
    .forEach(([parent, child, step]) => $$(parent).forEach(p => {
      $$(':scope > ' + child, p).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--d', Math.min(i * step, 900) + 'ms');
      });
    }));
  // cards: the two cards of a row arrive together, the right one a beat later
  $$('.cards').forEach(grid => $$(':scope > .card', grid).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', (i % 2) * 90 + 'ms');
  }));

  const onReveal = (el) => {
    if (el.parentElement.classList.contains('stats')) countUp(el);
    if (el.matches('.eyebrow, .label')) decode(el);
    if (el.matches('.cat__head')) decode($('.cat__index', el));
    if (el.matches('.contact__mark')) travel(el);
  };

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealIO.unobserve(entry.target);
      onReveal(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  $$('.reveal').forEach(el => revealIO.observe(el));


  /* ─── COUNTING STATS ─── */
  $$('.stats dt').forEach(dt => {
    const n = parseInt(dt.textContent, 10);
    dt.dataset.n = n;
    dt.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'sr';
    sr.textContent = n;
    const shown = document.createElement('span');
    shown.setAttribute('aria-hidden', 'true');
    shown.textContent = reduce ? n : 0;
    dt.append(sr, shown);
  });

  function countUp(item) {
    const dt = $('dt', item);
    const shown = dt.lastElementChild;
    const n = +dt.dataset.n;
    if (reduce) { shown.textContent = n; return; }
    const dur = 900 + n * 18, t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      shown.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }


  /* ─── LABELS THAT DECODE ───
     Mono labels settle letter by letter, left to right, from random glyphs. */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#';
  function decode(el) {
    if (reduce || !el) return;
    const nodes = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) if (walk.currentNode.nodeValue.trim()) nodes.push(walk.currentNode);
    const finals = nodes.map(n => n.nodeValue);
    const total = finals.reduce((a, f) => a + f.length, 0);
    const dur = 700, t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      let at = 0;
      nodes.forEach((n, j) => {
        const f = finals[j];
        let out = '';
        for (let i = 0; i < f.length; i++) {
          out += (at + i) / total < k || f[i] === ' ' ? f[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        n.nodeValue = out;
        at += f.length;
      });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }


  /* ─── LIVE CHIPS: projects that are live keep a slow pulse ─── */
  $$('.chip--done').forEach((chip, i) => {
    if (!/^live/i.test(chip.textContent.trim())) return;
    chip.classList.add('chip--live');
    chip.style.setProperty('--pd', ((i * 0.53) % 2.6).toFixed(2) + 's');
  });


  /* ─── THE MARK (hero) ───
     The logo's "a." with a square dot per work category as its full stop.
     Hover or focus a dot for its name and count; click to jump there. */
  const markBox = $('.hero__mark');
  const VB_W = 520, VB_H = 320;
  const dots = $$('.mark__dot', markBox);
  const tip = $('.mark__tip', markBox);

  // category name and count, read from the Contents list so nothing is written twice
  const catInfo = {};
  $$('.toc li').forEach(li => {
    const a = $('a', li);
    catInfo[a.getAttribute('href')] = {
      n: $('.toc__n', a).textContent,
      t: $('.toc__t', a).textContent,
      c: $('.toc__c', a).textContent,
    };
  });
  dots.forEach(dot => {
    const info = catInfo[dot.getAttribute('href')];
    if (info) dot.setAttribute('aria-label', `${info.n} ${info.t}, ${info.c}`);
  });

  const showTip = (dot) => {
    const info = catInfo[dot.getAttribute('href')];
    if (!info) return;
    const [x, y] = dot.getAttribute('transform').match(/[\d.]+/g).map(Number);
    tip.dataset.cat = dot.dataset.cat;
    tip.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = info.n;
    tip.append(b, ` ${info.t} · ${info.c}`);
    tip.style.left = (x / VB_W * 100) + '%';
    tip.style.top  = (y / VB_H * 100) + '%';
    tip.style.setProperty('--ax', (x / VB_W).toFixed(3));
    tip.classList.add('is-on');
  };
  const hideTip = () => tip.classList.remove('is-on');

  dots.forEach(dot => {
    dot.addEventListener('pointerenter', () => showTip(dot));
    dot.addEventListener('focus', () => showTip(dot));
    dot.addEventListener('pointerleave', hideTip);
    dot.addEventListener('blur', hideTip);
  });


  /* ─── THE MARK AGAIN (contact) ───
     A dot slides along the line and lands as its full stop. */
  const traveller = $('.contact__mark .mark__traveller');
  function travel(box) {
    if (reduce) return;   // the markup already places it at the end
    const [x1, y] = traveller.getAttribute('transform').match(/[\d.]+/g).map(Number);
    const x0 = Number(traveller.dataset.from);
    const put = (x) => traveller.setAttribute('transform', `translate(${x.toFixed(1)} ${y})`);
    put(x0);
    setTimeout(() => {
      const dur = 1500, t0 = performance.now();
      const step = (t) => {
        const k = clamp((t - t0) / dur, 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        put(x0 + (x1 - x0) * e);
        if (k < 1) requestAnimationFrame(step); else box.classList.add('is-landed');
      };
      requestAnimationFrame(step);
    }, 1150);
  }


  /* ─── LIVE-SITE PREVIEWS ───
     Hovering a project card that has a live site shows its homepage in a
     small browser frame beside the cursor, after a short pause so it does
     not flash up while the cursor is just passing. Hovering the link itself
     shows it at once. Mouse and trackpad only. */
  const peekLinks = $$('[data-peek]');
  if (fine && peekLinks.length) {
    const peek = document.createElement('div');
    peek.className = 'peek';
    peek.setAttribute('aria-hidden', 'true');
    peek.innerHTML = '<div class="peek__box"><p class="peek__bar"><i></i><i></i><i></i><span></span></p><img alt="" width="640" height="400" decoding="async" /></div>';
    document.body.appendChild(peek);
    const img = $('img', peek), url = $('span', peek);
    const W = 320, H = 228;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const aim = (cx, cy) => {
      const left = cx + 28 + W > innerWidth - 12;
      peek.classList.toggle('is-left', left);
      tx = left ? cx - 28 - W : cx + 28;
      ty = clamp(cy + 20, 12, innerHeight - H - 12);
    };
    const place = () => {
      const tilt = reduce ? 0 : clamp((tx - x) * 0.06, -5, 5);
      peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    };
    const follow = () => {
      x = reduce ? tx : lerp(x, tx, 0.18);
      y = reduce ? ty : lerp(y, ty, 0.18);
      place();
      raf = requestAnimationFrame(follow);
    };

    const HOVER_DELAY = 250;
    let timer = 0, shown = false, last = [0, 0];

    const show = (a) => {
      clearTimeout(timer);
      if (shown) return;
      shown = true;
      img.src = a.dataset.peek;
      url.textContent = a.firstChild.textContent.trim();
      peek.dataset.cat = a.closest('[data-cat]').dataset.cat;
      aim(...last);
      x = tx; y = ty;
      place();
      peek.classList.add('is-on');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(follow);
    };
    const hide = () => {
      clearTimeout(timer);
      shown = false;
      peek.classList.remove('is-on');
      cancelAnimationFrame(raf);
    };

    peekLinks.forEach(a => {
      const card = a.closest('.card');
      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        last = [e.clientX, e.clientY];
        timer = setTimeout(() => show(a), HOVER_DELAY);
      });
      // the link is stretched over the whole card, so "on the link" means
      // over its visible text, not anywhere on the card
      card.addEventListener('pointermove', (e) => {
        last = [e.clientX, e.clientY];
        if (shown) return aim(...last);
        if (e.pointerType !== 'mouse') return;
        const r = a.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) show(a);
      });
      card.addEventListener('pointerleave', hide);
    });

    // fetch the images once the work is close, so the first hover is instant
    new IntersectionObserver((entries, io) => {
      if (!entries[0].isIntersecting) return;
      peekLinks.forEach(a => { new Image().src = a.dataset.peek; });
      io.disconnect();
    }, { rootMargin: '800px 0px' }).observe(work);
  }


  /* ─── CARDS WITHOUT A LINK ───
     Cards with a live site open it from anywhere on the card (style.css
     stretches the link). The rest have nothing to open, so a click brings
     the card fully into view and lights it up briefly. Selecting text does
     not count as a click. */
  const flash = (el) => {
    el.classList.remove('is-flash');
    void el.offsetWidth;
    el.classList.add('is-flash');
    el.addEventListener('animationend', () => el.classList.remove('is-flash'), { once: true });
  };

  $$('.card').filter(card => !$('.card__link', card)).forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button') || String(getSelection())) return;
      card.scrollIntoView({ behavior, block: 'nearest' });
      if (!reduce) flash(card);
    });
  });


  /* ─── TOOLS MARQUEE ─── */
  const marquee = $('.marquee');
  const track   = $('.marquee__track', marquee);
  const list    = $('.marquee__list', track);

  const fillMarquee = () => {
    while (track.children.length < 6 && track.scrollWidth < innerWidth + list.offsetWidth * 2) {
      const copy = list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    }
  };

  if (!reduce) {
    fillMarquee();
    addEventListener('resize', fillMarquee);
    marquee.classList.add('is-moving');

    let x = 0, dir = 1, boost = 0, hold = 1, holdTarget = 1, lastY = scrollY, last = 0, raf = 0;
    addEventListener('scroll', () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (dy) dir = dy > 0 ? 1 : -1;
      boost = Math.min(boost + Math.abs(dy) * 0.5, 700);
    }, { passive: true });
    marquee.addEventListener('pointerenter', () => { holdTarget = 0; });
    marquee.addEventListener('pointerleave', () => { holdTarget = 1; });

    const step = (t) => {
      const dt = last ? Math.min(t - last, 64) / 1000 : 0;
      last = t;
      boost *= Math.exp(-dt * 2.5);
      hold = lerp(hold, holdTarget, 0.08);
      x -= (36 + boost) * dir * hold * dt;
      const w = list.offsetWidth;
      if (w) { while (x <= -w) x += w; while (x > 0) x -= w; }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(step);
    };
    new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(step);
    }).observe(marquee);
  }


  /* ─── POINTER POLISH: card spotlight, magnetic buttons, contact glow ─── */
  if (fine && !reduce) {
    $$('.card').forEach(card => card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));

    $$('.btn, .nav__cta').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const contact = $('.contact');
    contact.addEventListener('pointermove', (e) => {
      const r = contact.getBoundingClientRect();
      contact.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      contact.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  }


  /* ─── PROJECT FILTER ─── */
  const filter = $('.filter');
  const filterInput = $('#filterInput');
  const filterCount = $('.filter__count');
  const filterEmpty = $('.filter__empty');
  const pills = $$('.filter__pill', filter);

  const cats = $$('.cat').map(cat => {
    const countEl = $('.cat__index span', cat);
    const catTitle = $('.cat__title', cat).textContent;
    return {
      el: cat,
      grid: $('.cards', cat),
      countEl,
      orig: countEl.textContent,
      title: catTitle,
      cards: $$('.card', cat).map(el => {
        const t = $('.card__title', el);
        return {
          el,
          cat: cat.dataset.cat,
          catTitle,
          title: t.getAttribute('aria-label') || t.textContent,
          status: $('.chip', el).classList.contains('chip--done') ? 'done' : 'open',
          chip: $('.chip', el).textContent,
          num: $('.card__num', el).textContent,
          text: (el.textContent + ' ' + (t.getAttribute('aria-label') || '') + ' ' + catTitle).toLowerCase(),
        };
      }),
    };
  });
  const allCards = cats.flatMap(c => c.cards);
  const fstate = { status: 'all', q: '' };

  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > -120 && r.top < innerHeight + 120;
  };

  const applyFilter = () => {
    const terms = fstate.q.toLowerCase().split(/\s+/).filter(Boolean);
    const filtering = fstate.status !== 'all' || terms.length > 0;

    // FLIP: remember where the visible cards were
    const first = new Map();
    if (!reduce) allCards.forEach(c => { if (!c.el.hidden && inView(c.el)) first.set(c.el, c.el.getBoundingClientRect()); });

    let total = 0;
    cats.forEach(cat => {
      let shown = 0;
      cat.cards.forEach(c => {
        const ok = (fstate.status === 'all' || c.status === fstate.status) && terms.every(t => c.text.includes(t));
        if (ok && c.el.hidden) c.el.classList.add('is-in');
        c.el.hidden = !ok;
        if (ok) { c.el.classList.toggle('is-right', shown % 2 === 1); shown++; }
      });
      cat.el.hidden = shown === 0;
      cat.grid.toggleAttribute('data-filtered', filtering);
      cat.countEl.textContent = filtering ? `${shown} of ${cat.cards.length} projects` : cat.orig;
      if (shown) cat.el.querySelector('.cat__head').classList.add('is-in');
      total += shown;
    });

    filterCount.innerHTML = `<strong>${total}</strong> of ${allCards.length} projects`;
    filterEmpty.hidden = total > 0;

    if (reduce) return;
    allCards.forEach(c => {
      if (c.el.hidden || !inView(c.el)) return;
      const was = first.get(c.el);
      const now = c.el.getBoundingClientRect();
      if (was) {
        const dx = was.left - now.left, dy = was.top - now.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          c.el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
            { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)' });
        }
      } else {
        c.el.animate([{ opacity: 0, transform: 'translateY(12px) scale(.985)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  };

  const setStatus = (status) => {
    fstate.status = status;
    pills.forEach(p => p.setAttribute('aria-pressed', String(p.dataset.status === status)));
    applyFilter();
  };
  const resetFilter = () => {
    filterInput.value = '';
    fstate.q = '';
    setStatus('all');
  };

  filter.hidden = false;
  pills.forEach(p => p.addEventListener('click', () => setStatus(p.dataset.status)));
  let filterQueued = false;
  filterInput.addEventListener('input', () => {
    fstate.q = filterInput.value;
    if (!filterQueued) { filterQueued = true; requestAnimationFrame(() => { filterQueued = false; applyFilter(); }); }
  });
  filterInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterInput.value) { e.stopPropagation(); filterInput.value = ''; fstate.q = ''; applyFilter(); }
  });
  $$('.filter__try button').forEach(b => b.addEventListener('click', () => {
    filterInput.value = b.dataset.q;
    fstate.q = b.dataset.q;
    applyFilter();
    filterInput.focus();
  }));
  $('[data-filter-clear]').addEventListener('click', () => { resetFilter(); filterInput.focus(); });


  /* ─── COPY + TOAST ─── */
  const toast = document.createElement('p');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer = 0;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* not supported */ }
      ta.remove();
      return ok;
    }
  };
  const copyEmail = async (text) => say(await copyText(text) ? 'Email copied' : 'Could not copy. The address is ' + text);

  $$('[data-copy]').forEach(btn => {
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      await copyEmail(btn.dataset.copy);
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
    });
  });


  /* ─── COMMAND PALETTE ─── */
  const palette = $('#palette');
  const pInput  = $('#paletteInput');
  const pList   = $('#paletteList');
  const isMac   = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || '');
  $$('[data-kbd]').forEach(k => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

  const goTo = (el, { highlight = false } = {}) => {
    if (el.hidden || el.closest('[hidden]')) resetFilter();
    el.classList.add('is-in');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.scrollIntoView({ behavior, block: highlight ? 'center' : 'start' });
    el.focus({ preventScroll: true });
    if (highlight) setTimeout(() => flash(el), reduce ? 0 : 450);
    if (el.id) history.replaceState(null, '', '#' + el.id);
  };

  const email = $('[data-copy]').dataset.copy;
  const items = [
    ...navLinks.map(a => ({
      group: 'Sections', label: a.textContent, hint: '', cat: '',
      run: () => goTo($(a.getAttribute('href'))),
    })),
    ...cats.map(c => ({
      group: 'Sections', label: c.title, hint: c.orig, cat: c.el.dataset.cat,
      run: () => goTo(c.el),
    })),
    ...allCards.map(c => ({
      group: 'Projects', label: c.title, hint: `${c.num} · ${c.catTitle} · ${c.chip}`, cat: c.cat,
      keywords: c.text,
      run: () => goTo(c.el, { highlight: true }),
    })),
    { group: 'Contact', label: 'Copy email address', hint: email, cat: '', run: () => copyEmail(email) },
    { group: 'Contact', label: 'Write an email', hint: email, cat: '', run: () => { location.href = 'mailto:' + email; } },
    { group: 'Contact', label: 'Message on WhatsApp', hint: 'Opens in a new tab', cat: '', run: () => window.open('https://wa.me/918857852631', '_blank', 'noopener') },
    { group: 'Contact', label: 'GitHub', hint: 'github.com/rohantdk', cat: '', run: () => window.open('https://github.com/rohantdk', '_blank', 'noopener') },
  ];
  items.forEach((it, i) => {
    it.id = 'pi-' + i;
    it.hay = (it.label + ' ' + it.hint + ' ' + (it.keywords || '')).toLowerCase();
  });

  let results = [];
  let active = 0;

  const score = (it, terms) => {
    if (!terms.length) return 1;
    if (!terms.every(t => it.hay.includes(t))) return 0;
    const label = it.label.toLowerCase(), q = terms.join(' ');
    if (label.startsWith(q)) return 4;
    if (label.includes(q)) return 3;
    return terms.every(t => label.includes(t)) ? 2 : 1;
  };

  const markMatch = (el, text, q) => {
    const i = q ? text.toLowerCase().indexOf(q) : -1;
    if (i < 0) { el.textContent = text; return; }
    const m = document.createElement('mark');
    m.textContent = text.slice(i, i + q.length);
    el.append(text.slice(0, i), m, text.slice(i + q.length));
  };

  const setActive = (i) => {
    if (!results.length) { pInput.removeAttribute('aria-activedescendant'); return; }
    active = (i + results.length) % results.length;
    $$('[role="option"]', pList).forEach(li => li.setAttribute('aria-selected', String(li.id === results[active].id)));
    const li = document.getElementById(results[active].id);
    pInput.setAttribute('aria-activedescendant', li.id);
    li.scrollIntoView({ block: 'nearest' });
  };

  const render = () => {
    const q = pInput.value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const order = ['Sections', 'Projects', 'Contact'];
    results = items
      .map(it => ({ it, s: score(it, terms) }))
      .filter(r => r.s > 0)
      .sort((a, b) => order.indexOf(a.it.group) - order.indexOf(b.it.group) || (terms.length ? b.s - a.s : 0))
      .map(r => r.it);

    pList.textContent = '';
    let group = '';
    results.forEach(it => {
      if (it.group !== group) {
        group = it.group;
        const h = document.createElement('li');
        h.className = 'palette__group';
        h.setAttribute('role', 'presentation');
        h.textContent = group;
        pList.appendChild(h);
      }
      const li = document.createElement('li');
      li.id = it.id;
      li.className = 'palette__item';
      li.setAttribute('role', 'option');
      if (it.cat) li.dataset.cat = it.cat;
      const dot = document.createElement('span');
      dot.className = 'palette__dot';
      const label = document.createElement('span');
      label.className = 'palette__label';
      markMatch(label, it.label, q);
      const hint = document.createElement('span');
      hint.className = 'palette__hint';
      hint.textContent = it.hint;
      li.append(dot, label, hint);
      li.addEventListener('pointermove', () => { if (results[active] !== it) setActive(results.indexOf(it)); });
      li.addEventListener('click', () => run(it));
      pList.appendChild(li);
    });

    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'palette__none';
      li.setAttribute('role', 'presentation');
      li.textContent = 'No matches. Try a client, a city or a tool.';
      pList.appendChild(li);
    }
    setActive(0);
  };

  const openPalette = () => {
    if (palette.open) return;
    setOpen(false);
    pInput.value = '';
    render();
    palette.showModal();
    pInput.focus();
  };
  const run = (it) => {
    palette.close();
    requestAnimationFrame(() => it.run());
  };

  pInput.addEventListener('input', render);
  pInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) run(results[active]); }
  });
  palette.addEventListener('click', (e) => { if (e.target === palette) palette.close(); });

  const typing = (el) => el.closest('input, textarea, select, [contenteditable="true"]');
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.open ? palette.close() : openPalette();
    } else if (e.key === '/' && !palette.open && !typing(e.target)) {
      e.preventDefault();
      openPalette();
    }
  });
  $$('[data-palette-open]').forEach(b => { b.hidden = false; b.addEventListener('click', openPalette); });


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
