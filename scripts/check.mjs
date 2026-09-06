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

assert.deepEqual(data.platforms.map(platform => platform.name), ['PlaySorceryOnline', 'Valkenhall', 'Realms', 'Tabletop Simulator']);
assert(!/mazos oficiales/i.test(html));
assert.equal((html.match(/<strong>Marc<\/strong>/g) || []).length, 2);
assert(html.includes('youtube-nocookie.com/embed/OXE2UF6nKPY'));
assert(html.includes('https://www.sorcererssummit.com/deck-rec'));
assert(html.includes('https://www.sorcererssummit.com/top-8'));
const shopLabels = ['<summary>Mercados de cartas', '<summary>Tiendas de Europa', '<summary>Tiendas de España', '<summary>Tiendas de Estados Unidos'];
assert(shopLabels.every((label, index) => index === 0 || html.indexOf(label) > html.indexOf(shopLabels[index - 1])));
assert(!data.tools.some(tool => tool.name === 'Seguimiento de precios'));
console.log('Beginner flow, platform order, store order, credits, and video embed checked.');
