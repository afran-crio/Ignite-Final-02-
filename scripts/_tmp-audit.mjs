import puppeteer from 'puppeteer';
const W = +process.argv[2] || 1440;
const b = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage();
await p.setViewport({ width: W, height: 900 });
await p.goto('http://localhost:5175/', { waitUntil: 'networkidle0' });
await p.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
  scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 800));
const out = await p.evaluate(() => {
  const rows = [];
  const secs = [document.querySelector('header.nav'), ...document.querySelectorAll('main section, body section'), document.querySelector('footer')].filter((e, i, a) => e && a.indexOf(e) === i);
  for (const s of secs) {
    const name = s.id || s.className.split(' ').pop();
    const cs = getComputedStyle(s);
    rows.push(`\n## ${name}  pad=${cs.paddingTop}/${cs.paddingBottom} h=${Math.round(s.getBoundingClientRect().height)}`);
    const seen = new Map();
    s.querySelectorAll('*').forEach(e => {
      const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const c = getComputedStyle(e); const r = e.getBoundingClientRect();
      if (!r.width || c.visibility === 'hidden' || e.closest('.visually-hidden,[aria-hidden=true]')) return;
      const cls = (typeof e.className === 'string' ? e.className : '').split(' ').filter(x => x && !['reveal', 'is-visible'].includes(x)).join('.') || e.tagName.toLowerCase();
      const key = `${cls} | ${c.fontSize} w${c.fontWeight} lh=${c.lineHeight} ls=${c.letterSpacing} ${c.textTransform !== 'none' ? 'UPPER' : ''}`;
      if (!seen.has(key)) seen.set(key, { n: 0, left: Math.round(r.left), mw: Math.round(r.width), txt: e.textContent.trim().slice(0, 28) });
      const v = seen.get(key); v.n++; v.left = Math.min(v.left, Math.round(r.left));
    });
    for (const [k, v] of seen) rows.push(`  ${k} ×${v.n} left=${v.left} w=${v.mw} "${v.txt}"`);
  }
  return rows.join('\n');
});
console.log(out);
await b.close();
