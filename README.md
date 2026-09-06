# Hispanic Sorcery Community

A fast, Spanish-language community guide for Sorcery: Contested Realm. All source identifiers and filenames are in English. Visitor-facing content is in Spanish.

## Preview

Open `index.html` in a browser. The complete page, navigation, and expandable sections work without a server or JavaScript. Keep the `assets` directory beside the HTML file.

## Edit and build

- Edit the resource records in `content/site.json`.
- Edit page layout and introductory copy in `scripts/build.mjs`.
- Edit styling in `assets/styles.css`.
- Run `npm run build` using Node.js 22 or newer. No dependencies need to be installed.
- Run `npm run check` to validate generated links and local assets.

The generated `index.html` is tracked and must be committed with content changes. GitHub Pages publishes the repository automatically from `main` using its existing branch deployment. The validation workflow regenerates the page and checks that the committed HTML matches its source.

## Publication

Version 0.3.0 is the first public release, authorized by the project owner. The public address is https://sorcerytcg-hispano.github.io/ . No Cloudflare Worker, D1 database, account system, or API backend is involved.

See `EDITORIAL.md` for source provenance and unresolved content questions. See `CREDITS.md` for graphic assets and font attribution. Third-party assets retain their respective rights.

Export a single-file preview with `node scripts/export-preview.mjs /absolute/path/preview.html`. The YouTube video and external links require an internet connection.
