/**
 * Builds the shareable preview of the site: a static copy that works when
 * hosted as a page under a path it does not own (no server, no SPA
 * fallback). Vite is run with a relative base and the app in hash-routing
 * mode (VITE_PREVIEW), and the root-relative asset paths the content files
 * use (/team/…, /clients/…, /media/…, /brand/…) are rewritten to relative
 * ones in the bundle. Output: dist-preview/. Production stays `npm run build`.
 *
 *   node scripts/build-preview.mjs
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist-preview';
rmSync(OUT, { recursive: true, force: true });
execSync(`npx vite build --base=./ --outDir ${OUT}`, { stdio: 'inherit', env: { ...process.env, VITE_PREVIEW: '1' } });

const assets = join(OUT, 'assets');
let rewrites = 0;
for (const f of readdirSync(assets)) {
  if (!/\.(js|css)$/.test(f)) continue;
  const p = join(assets, f);
  const before = readFileSync(p, 'utf8');
  const after = before.replace(/(^|[\s'"`(,])\/(team|clients|media|brand)\//g, (_, pre, dir) => { rewrites += 1; return `${pre}./${dir}/`; });
  if (after !== before) writeFileSync(p, after);
}
// the index.html references (favicons, logo) are already relative via --base
rmSync(join(OUT, '_redirects'), { force: true });
console.log(`preview built: ${OUT}/ (${rewrites} asset paths made relative)`);
