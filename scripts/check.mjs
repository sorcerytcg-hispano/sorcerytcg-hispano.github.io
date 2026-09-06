import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const data = JSON.parse(await readFile(new URL('content/site.json', root), 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML identifiers');
for (const [, destination] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (destination.startsWith('#')) assert(ids.includes(destination.slice(1)), `Missing anchor ${destination}`);
  else if (!/^https?:/.test(destination)) await access(new URL(destination, root));
  else assert(['http:', 'https:'].includes(new URL(destination.replaceAll('&amp;', '&')).protocol));
}
for (const [, path] of (await readFile(new URL('assets/styles.css', root), 'utf8')).matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  await access(new URL(path, new URL('assets/', root)));
}
for (const [id] of data.navigation) assert(ids.includes(id), `Missing section ${id}`);
assert(html.includes('<html lang="es">'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(!/undefined|\[object Object\]|TODO|TBD/.test(html));
assert.equal(data.countries.length, 5);
assert.equal(data.platforms.length, 4);
assert(data.leagueRules.some(block => block.title === 'Reglas de las partidas'));
console.log('Static page checked: local assets, navigation anchors, content structure, and language metadata.');
