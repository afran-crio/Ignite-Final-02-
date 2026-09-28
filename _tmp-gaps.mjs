import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const W of [1440, 1280, 1024, 768, 430, 375]) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: 900 });
  await p.goto('http://localhost:5175/', { waitUntil: 'networkidle0' });
  await p.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    document.querySelectorAll('.reveal').forEach(e => { e.classList.add('is-visible'); e.style.transition = 'none'; e.style.transform = 'none'; e.style.opacity = '1'; });
    scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  const res = await p.evaluate((W) => {
    const lines = [];
    const vw = document.documentElement.clientWidth;
    // overflow & clipping
    const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > vw + 0.5 && !e.closest('.logos,.works__track,.testimonials__viewport,.hero__media,[class*=embla]'); }).slice(0, 5).map(e => `${e.className}`);
    const clipped = [...document.querySelectorAll('h1,h2,h3,p,span,a')].filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').slice(0, 5).map(e => e.className);
    lines.push(`pageW=${document.documentElement.scrollWidth} overflow=${JSON.stringify(over)} clipped=${JSON.stringify(clipped)}`);
    // eyebrow -> next gap per section
    for (const s of document.querySelectorAll('section[id]')) {
      const eb = s.querySelector('.label');
      const flow = [...s.querySelectorAll('.label, h1, h2, .h2, [class*=__lead], [class*=__statement], [class*=__title], [class*=__headline], [class*=__quote], p, .btn, ul, [class*=__grid], [class*=__top], [class*=__row], [class*=__track], .logos')].filter(e => e.getBoundingClientRect().height);
      const fs = (e) => getComputedStyle(e).fontSize;
      const heads = [...s.querySelectorAll('h1,h2,[class*=__statement],[class*=__lead-line],.founder__lead,.contact__headline,.stats-bold__value')].map(e => `${e.className.split(' ').pop()}:${fs(e)}:lh${(parseFloat(getComputedStyle(e).lineHeight) / parseFloat(fs(e))).toFixed(2)}`);
      let gap = '';
      if (eb) { const next = flow.find(e => e !== eb && !eb.contains(e) && !e.contains(eb) && e.getBoundingClientRect().top >= eb.getBoundingClientRect().bottom - 1); if (next) gap = `eyebrow→${next.className.split(' ').pop()}=${Math.round(next.getBoundingClientRect().top - eb.getBoundingClientRect().bottom)}`; }
      lines.push(`  ${s.id}: ${gap} heads=[${heads.join(' ')}]`);
    }
    return lines.join('\n');
  }, W);
  console.log(`\n=== ${W}\n${res}`);
}
await b.close();
