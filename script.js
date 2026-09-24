/* ─────────────────────────────────────────────
   Arcline — script.js
   - Local clock (IST)
   - Project count from the index
   - Cursor-following preview over the index (desktop)
   - Inline previews on touch screens
   - Scroll reveals
───────────────────────────────────────────── */

document.documentElement.classList.add('js');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;

/* ─── Clock + year + count ─── */
const clock = document.getElementById('clock');
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST'; };
tick();
setInterval(tick, 30000);

document.getElementById('year').textContent = new Date().getFullYear();

const rows = [...document.querySelectorAll('.row')];
document.getElementById('count').textContent = String(rows.length).padStart(2, '0');

/* ─── Preview images ───
   Each row's data-shot names a screenshot in assets/shots/<name>.jpg.
   If it's missing we ask a screenshot service for the live site,
   and if that fails too, a typographic tile stands in. */
const shotSources = (row) => [
  `assets/shots/${row.dataset.shot}.jpg`,
  `https://image.thum.io/get/width/1200/crop/750/noanimate/${row.href}`,
];

function loadShot(img, tile, row) {
  const sources = shotSources(row);
  let i = 0;
  tile.textContent = row.querySelector('.row__name').textContent;
  img.hidden = false;
  img.onerror = () => {
    i += 1;
    if (i < sources.length) img.src = sources[i];
    else img.hidden = true;
  };
  img.src = sources[0];
}

/* ─── Desktop: cursor-following preview ─── */
if (canHover) {
  const peek = document.getElementById('peek');
  const img = document.getElementById('peekImg');
  const tile = document.getElementById('peekTile');
  const note = document.getElementById('peekNote');

  let x = innerWidth / 2, y = innerHeight / 2;   // target
  let px = x, py = y, rot = 0;                   // rendered
  let active = null, raf = null;

  const render = () => {
    const k = reduceMotion ? 1 : 0.14;
    const dx = x - px;
    px += dx * k;
    py += (y - py) * k;
    rot += ((reduceMotion ? 0 : Math.max(-6, Math.min(6, dx * 0.04))) - rot) * 0.12;
    const s = peek.classList.contains('on') ? 1 : 0.92;
    // Sit to the lower-right of the cursor, flip left near the edge
    const w = peek.offsetWidth;
    const ox = x + w + 40 > innerWidth ? -w / 2 - 28 : w / 2 + 28;
    peek.style.transform = `translate3d(${px + ox}px, ${py}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${s})`;
    raf = requestAnimationFrame(render);
  };

  addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      if (active !== row) {
        active = row;
        loadShot(img, tile, row);
        note.textContent = row.dataset.note;
      }
      peek.classList.add('on');
      if (!raf) { px = x; py = y; render(); }
    });
    row.addEventListener('mouseleave', () => peek.classList.remove('on'));
  });

  // Stop the loop once the preview has faded out
  peek.addEventListener('transitionend', () => {
    if (!peek.classList.contains('on') && raf) { cancelAnimationFrame(raf); raf = null; }
  });
}

/* ─── Touch: inline preview under each row ─── */
if (!canHover) {
  rows.forEach((row) => {
    const box = document.createElement('span');
    box.className = 'row__thumb';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<span class="peek__frame"><img alt="" loading="lazy" /><span class="peek__tile"></span></span><p></p>';
    box.querySelector('p').textContent = row.dataset.note;
    loadShot(box.querySelector('img'), box.querySelector('.peek__tile'), row);
    row.appendChild(box);
  });
}

/* ─── Scroll reveals ─── */
const revealables = document.querySelectorAll('.open__title, .open__foot, .index__head, .rows li, .make, .about, .contact');
revealables.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealables.forEach((el, i) => {
    el.style.transitionDelay = el.matches('.rows li') ? `${(i % 6) * 60}ms` : '0ms';
    io.observe(el);
  });
} else {
  revealables.forEach((el) => el.classList.add('in'));
}
