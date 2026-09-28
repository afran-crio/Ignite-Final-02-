/**
 * Downloads one HD photograph per transaction and wires it into the tiles.
 *
 * Sourcing these from the free CC pools was tried and abandoned — Wikimedia
 * and Openverse simply do not carry commercial-grade industrial photography,
 * and Unsplash blocks scraping without a key. So this asks for a key once and
 * does the whole job in one pass.
 *
 *   1. Create a free app at https://unsplash.com/oauth/applications
 *   2. UNSPLASH_ACCESS_KEY=xxxx node scripts/fetch-work-images.mjs
 *
 * It writes public/media/works/NN-segment.jpg at 2400px wide, appends the
 * photographer credits to media-source/CREDITS.md, and prints the exact
 * `image:` lines to paste into src/content/content.ts.
 */
import { writeFile, appendFile, mkdir } from 'node:fs/promises';

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error('Set UNSPLASH_ACCESS_KEY first. See the header of this file.');
  process.exit(1);
}

/* Query per transaction, in the order they appear in works.transactions. */
const SEGMENTS = [
  ['01-cross-border', 'container ship port terminal aerial'],
  ['02-renewable', 'wind turbines solar farm renewable energy'],
  ['03-food', 'food processing factory production line'],
  ['04-logistics', 'logistics warehouse distribution centre'],
  ['05-equipment', 'industrial machinery manufacturing plant'],
  ['06-healthcare', 'modern hospital building architecture'],
  ['07-automotive', 'automotive assembly line robotics factory'],
];

const OUT = 'public/media/works';
await mkdir(OUT, { recursive: true });

const credits = [];
const lines = [];

for (const [slug, query] of SEGMENTS) {
  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}` +
    `&orientation=landscape&content_filter=high&per_page=5`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  if (!res.ok) {
    console.error(`${slug}: search failed ${res.status}`);
    continue;
  }
  const { results } = await res.json();
  /* HD or better only. */
  const hit = results.find((r) => r.width >= 1920 && r.height >= 1080);
  if (!hit) {
    console.error(`${slug}: no HD result for "${query}"`);
    continue;
  }

  const img = await fetch(`${hit.urls.raw}&w=2400&q=82&fm=jpg&fit=max`);
  await writeFile(`${OUT}/${slug}.jpg`, Buffer.from(await img.arrayBuffer()));

  /* Unsplash asks that a download be registered when one is used. */
  await fetch(hit.links.download_location, { headers: { Authorization: `Client-ID ${KEY}` } });

  credits.push(`| \`works/${slug}.jpg\` | ${hit.user.name} | ${query} | ${hit.links.html} |`);
  lines.push(`  ${slug}: image: '/media/works/${slug}.jpg' as string | null,`);
  console.log(`${slug}  ${hit.width}x${hit.height}  ${hit.user.name}`);
}

if (credits.length) {
  await appendFile(
    'media-source/CREDITS.md',
    `\n## Transaction tile artwork\n\n| File | Photographer | Subject | Source |\n| --- | --- | --- | --- |\n${credits.join('\n')}\n`,
  );
  console.log('\nPaste these onto the matching transactions in src/content/content.ts:\n');
  console.log(lines.join('\n'));
}
