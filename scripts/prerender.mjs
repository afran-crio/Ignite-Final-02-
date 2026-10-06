/**
 * Pre-render: after the client build, render each route with the server
 * bundle (dist-ssr/, built from src/entry-server.tsx) and write its HTML
 * into the built page — dist/index.html for the home page, and
 * dist/<route>/index.html for the legal pages, which static hosts serve
 * before the SPA fallback in public/_redirects.
 *
 * Skipped for the hash-routed preview build (VITE_PREVIEW), whose routes
 * live in the hash.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssr = path.join(root, 'dist-ssr');

const routes = ['/', '/privacy-policy', '/disclaimer'];

if (process.env.VITE_PREVIEW) {
  console.log('prerender: skipped for the preview build');
} else {
  const { render, titles } = await import(pathToFileURL(path.join(ssr, 'entry-server.js')).href);
  const template = await readFile(path.join(dist, 'index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) throw new Error('prerender: #root not found in dist/index.html');

  for (const route of routes) {
    /* data-route names the page the HTML is for: main.tsx takes it over only
       where it matches the address (a host falling back to the home page for
       an unknown path must not hand the legal pages the home page's HTML). */
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root" data-route="${route}">${render(route)}</div>`,
    );
    /* Each legal page names itself in the tab and in search results. */
    if (titles[route]) {
      const escaped = titles[route].replace(/&/g, '&amp;').replace(/</g, '&lt;');
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escaped}</title>`);
    }
    const out = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, html);
    console.log(`prerender: ${route} → ${path.relative(root, out)} (${(html.length / 1024).toFixed(0)} kB)`);
  }
}

await rm(ssr, { recursive: true, force: true });
