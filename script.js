/* Arcline
   - Nashik clock in the top line
   - Category words in the paragraph filter the ledger (and the URL hash)
*/

(() => {
  /* ─── CLOCK ─── */
  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  });
  const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST'; };
  tick();
  setInterval(tick, 15000);


  /* ─── FILTER ─── */
  const prose   = document.querySelector('.prose');
  const words   = [...document.querySelectorAll('.f')];
  const rows    = [...document.querySelectorAll('.w')];
  const tally   = document.getElementById('tally');
  const reset   = document.getElementById('reset');
  const total   = rows.length;
  const keys    = new Set(words.map(w => w.dataset.f));

  const apply = (key) => {
    let shown = 0;
    rows.forEach(row => {
      const match = !key || row.dataset.c === key;
      row.hidden = !match;
      if (!match) row.open = false;
      if (match) shown++;
    });
    words.forEach(w => w.setAttribute('aria-pressed', String(w.dataset.f === key)));
    prose.classList.toggle('filtering', Boolean(key));
    reset.hidden = !key;

    const label = key ? ', ' + words.find(w => w.dataset.f === key).firstChild.textContent.trim() : '';
    tally.textContent = `${shown} of ${total}${label}`;

    const hash = key ? '#' + key : '';
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname + location.search);
  };

  words.forEach(w => w.addEventListener('click', () => {
    const on = w.getAttribute('aria-pressed') === 'true';
    apply(on ? null : w.dataset.f);
  }));

  reset.addEventListener('click', () => apply(null));

  const fromHash = () => {
    const key = location.hash.slice(1);
    apply(keys.has(key) ? key : null);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
