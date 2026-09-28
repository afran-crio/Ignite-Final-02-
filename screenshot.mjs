/* Captures the running dev server at both breakpoints. Usage: npm run screenshot */
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:5175';
const OUT = 'screenshots';

const targets = [
  { name: 'home-desktop', path: '/', width: 1440, height: 900, dsf: 1 },
  { name: 'home-mobile', path: '/', width: 390, height: 844, dsf: 2 },
  { name: 'privacy-policy-desktop', path: '/privacy-policy', width: 1440, height: 900, dsf: 1 },
];

await mkdir(OUT, { recursive: true });

/* Puppeteer's bundled Chrome needs a newer macOS than this machine runs, so
   fall back to a system Chrome. PUPPETEER_EXECUTABLE_PATH wins if set. */
async function launchBrowser() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    undefined, // puppeteer's own download
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter((v, i) => v !== undefined || i === 1);

  let lastError;
  for (const executablePath of candidates) {
    try {
      return await puppeteer.launch({ headless: true, executablePath });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

const browser = await launchBrowser();

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: t.width, height: t.height, deviceScaleFactor: t.dsf });
  await page.goto(`${BASE}${t.path}`, { waitUntil: 'networkidle0', timeout: 60000 });

  /* Scroll the whole page so the IntersectionObserver reveals fire, then settle
     any element the scroll missed. A full-page capture is one long viewport, so
     anything left at opacity 0 would photograph as a blank band. */
  await page.evaluate(async () => {
    const de = document.documentElement;
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < de.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);

    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      el.classList.add('is-visible');
    });

    /* Wait out the reveal transition so nothing is captured mid-fade. */
    await new Promise((r) => setTimeout(r, 1100));
  });

  await page.screenshot({ path: `${OUT}/${t.name}.png`, fullPage: true });
  console.log(`captured ${t.name}`);
  await page.close();
}

await browser.close();
