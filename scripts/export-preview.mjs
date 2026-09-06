import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = new URL('../', import.meta.url);
const output = resolve(process.argv[2] || 'preview.html');
let html = await readFile(new URL('index.html', root), 'utf8');
let css = await readFile(new URL('assets/styles.css', root), 'utf8');
const embed = async (path, mime) => `data:${mime};base64,${(await readFile(new URL(path, root))).toString('base64')}`;
css = css.replace("url('./fonts/fantaisie-artistique.ttf')", `url('${await embed('assets/fonts/fantaisie-artistique.ttf', 'font/ttf')}')`);
html = html.replace('<link rel="stylesheet" href="assets/styles.css">', `<style>${css}</style>`);
html = html.replace(/  <link rel="preload"[^>]+>\n/, '');
for (const [path, mime] of [['assets/sorcery-hero.webp', 'image/webp'], ['assets/sorcery-logo.png', 'image/png'], ['assets/avatar-tier-list.webp', 'image/webp'], ['assets/erik-design-message.webp', 'image/webp']]) {
  html = html.replaceAll(path, await embed(path, mime));
}
html = html.replace('<script src="assets/main.js" defer></script>', `<script>${await readFile(new URL('assets/main.js', root), 'utf8')}</script>`);
await writeFile(output, html);
console.log(`Exported standalone preview: ${output}`);
