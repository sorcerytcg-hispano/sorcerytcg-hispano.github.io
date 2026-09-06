import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('content/site.json', root), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const anchor = (label, url, className = '') => `<a href="${escape(url)}"${className ? ` class="${className}"` : ''}>${escape(label)}</a>`;
const links = items => `<div class="links">${items.map(item => anchor(item.label, item.url)).join('')}</div>`;
const resources = items => `<div class="resource-grid">${items.map(item => `<article class="resource"><h3>${escape(item.name)}</h3><p>${escape(item.description)}</p>${links(item.links)}</article>`).join('')}</div>`;
const heading = (title, number) => `<div class="section-heading"><h2>${escape(title)}</h2><span class="section-label" aria-hidden="true">${number}</span></div>`;
const nav = data.navigation.map(([id, label]) => anchor(label, `#${id}`)).join('');
const countryBlocks = data.countries.map(country => `<details><summary><span>${escape(country.name)}<small>${escape(country.summary)}</small></span></summary><div class="details-content">${country.groups.map(group => `<article class="community-row"><div><h4>${escape(group.area)} · ${escape(group.name)}</h4>${group.shops ? `<p>Tiendas: ${escape(group.shops)}.</p>` : ''}</div>${links(group.links)}</article>`).join('')}</div></details>`).join('');
const storeTable = region => `<div class="table-wrap"><table><caption>Oferta orientativa recopilada por Marc y la comunidad. Consulta disponibilidad y envíos con cada tienda.</caption><thead><tr><th scope="col">Tienda</th><th scope="col">Zona</th><th scope="col">Productos</th></tr></thead><tbody>${data.stores.filter(store => store.region === region).map(store => `<tr><td>${store.url ? anchor(store.name, store.url) : escape(store.name)}</td><td>${escape(store.city || store.region)}</td><td>${escape(store.products)}</td></tr>`).join('')}</tbody></table></div>`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#111b18">
  <meta name="description" content="Aprende a jugar a Sorcery: Contested Realm, encuentra partidas online y conecta con comunidades de España e Hispanoamérica.">
  <title>${escape(data.name)}</title>
  <link rel="stylesheet" href="assets/styles.css">
  <link rel="preload" href="assets/fonts/fantaisie-artistique.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="icon" href="assets/sorcery-logo.png" type="image/png">
</head>
<body id="top">
<a class="skip" href="#main">Saltar al contenido</a>
<header class="site-header"><div class="wrap header-inner">
  <a class="brand" href="#top" aria-label="Comunidad Hispana de Sorcery, inicio"><span class="brand-name">Sorcery<small>Comunidad hispana</small></span></a>
  <nav class="header-nav" aria-label="Navegación principal"><a href="#start">Empezar</a><a href="#online">Jugar online</a><a href="#communities">Comunidades</a><a class="extra" href="#league">Liga Hispana</a>${anchor('Entrar al Discord', data.discord, 'button')}</nav>
</div></header>
<section class="hero" aria-labelledby="site-title">
  <img class="hero-art" src="assets/sorcery-hero.webp" alt="" width="2048" height="1116" fetchpriority="high">
  <div class="wrap hero-inner"><div class="hero-copy">
    <p class="eyebrow">Sorcery: Contested Realm · En español</p>
    <h1 id="site-title">Comunidad Hispana <span>de Sorcery</span></h1>
    <p>Tu punto de encuentro para aprender, encontrar partidas y compartir mesa con jugadores de España e Hispanoamérica.</p>
    <div class="actions">${anchor('Encuentra tu comunidad', '#communities', 'button primary')}${anchor('Quiero aprender a jugar', '#start', 'button')}</div>
  </div></div>
  <span class="art-caption">Ilustración de Sorcery: Contested Realm</span>
</section>
<div class="wrap quick-paths" aria-label="Accesos rápidos">
  <a class="quick-path" href="#start"><span class="path-number">01</span><span><strong>Estoy empezando</strong><small>Guías, reglas y tu primera partida.</small></span><span class="arrow" aria-hidden="true">↗</span></a>
  <a class="quick-path" href="#online"><span class="path-number">02</span><span><strong>Quiero jugar online</strong><small>Elige plataforma y encuentra rival.</small></span><span class="arrow" aria-hidden="true">↗</span></a>
  <a class="quick-path" href="#communities"><span class="path-number">03</span><span><strong>Busco gente cerca</strong><small>Grupos, tiendas y encuentros locales.</small></span><span class="arrow" aria-hidden="true">↗</span></a>
</div>
<div class="wrap page-body">
<nav class="toc" aria-label="Secciones de la guía"><p>Explora la guía</p>${nav}</nav>
<main id="main">
  <section class="section" id="start">
    ${heading('Tu primera partida empieza aquí', '01')}
    <p class="section-intro">En Sorcery, dos jugadores construyen un reino con sus cartas y se enfrentan como avatares. Para empezar, aprende lo esencial y busca a alguien con quien practicar.</p>
    <div class="step-grid">
      <article class="step"><span class="number">01 · APRENDE</span><h3>Conoce el juego</h3><p>Empieza por la guía en español de Marc. Puedes acompañarla de los tutoriales oficiales en inglés.</p>${anchor('Leer la guía de inicio', data.guide)}</article>
      <article class="step"><span class="number">02 · PREPARA</span><h3>Elige cómo jugar</h3><p>Prueba una plataforma online o contacta con un grupo local. Un mazo de inicio facilita tus primeras partidas.</p>${anchor('Ver las plataformas', '#online')}</article>
      <article class="step"><span class="number">03 · COMPARTE</span><h3>Pide una partida de iniciación</h3><p>Preséntate en Discord, indica que estás aprendiendo y comparte tu disponibilidad y zona horaria.</p>${anchor('Entrar a la comunidad', data.discord)}</article>
    </div>
  </section>
  <section class="section" id="online">
    ${heading('Juega desde donde estés', '02')}
    <p class="section-intro">Busca rival en nuestro Discord y acordad la plataforma antes de jugar. Al proponer una partida, indica día, hora, zona horaria y si buscas aprender o practicar un mazo.</p>
    <div class="discord-panel"><div><h3>¿Te falta alguien al otro lado de la mesa?</h3><p>Únete a Sorcery TCG en Español y propón una partida.</p></div>${anchor('Buscar partida en Discord', data.discord, 'button primary')}</div>
    <div class="platform-grid">${data.platforms.map(platform => `<article class="platform"><div class="platform-header"><h3>${escape(platform.name)}</h3><span class="tag">${escape(platform.tag)}</span></div><p>${escape(platform.description)}</p>${links(platform.links)}</article>`).join('')}</div>
    <p class="note">Si utilizas Tabletop Simulator, comprueba que el módulo y la importación de mazos funcionan antes de quedar. Si tienes dificultades, pide ayuda en Discord.</p>
  </section>
  <section class="section" id="communities">
    ${heading('Una mesa cerca de ti', '03')}
    <p class="section-intro">Encuentra el grupo de tu país o ciudad. Pregunta por las próximas quedadas, las tiendas de la zona y las partidas para aprender.</p>
    <div class="community-list">${countryBlocks}</div>
    <p class="note">¿No aparece tu zona? ${anchor('Pregunta en nuestro Discord', data.discord)}. Los grupos locales pueden orientarte sobre dónde jugar y a quién contactar.</p>
  </section>
  <section class="section" id="league">
    ${heading('Liga Hispana de Sorcery', '04')}
    <div class="league-panel"><p class="eyebrow">Online · Amistosa · Gratuita</p><h3>Una liga para compartir el juego</h3><p>Apúntate con una cuenta gratuita de Challonge y entra en el Discord de la comunidad. Las inscripciones, los emparejamientos y los resultados se gestionan en Challonge.</p><div class="league-facts"><div><strong>10 días</strong><span>por ronda</span></div><div><strong>Construido</strong><span>suizo y fase final</span></div><div><strong>Top 4</strong><span>final al mejor de tres</span></div></div><div class="actions">${anchor('Ver torneos e inscribirme', data.leagueUrl, 'button primary')}${anchor('Entrar al Discord', data.discord, 'button')}</div></div>
    <details><summary>Normas de la liga</summary><div class="details-content"><p class="section-intro">Normas facilitadas por la organización. Consulta la convocatoria de cada torneo para conocer sus fechas y cualquier actualización.</p>${data.leagueRules.map(block => `<div class="rule-block"><h4>${escape(block.title)}</h4>${block.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>`).join('')}<div class="rule-block"><h4>Plataformas</h4><p>Podéis jugar en cualquiera de las ${anchor('cuatro plataformas de esta guía', '#online')}, siempre que ambos jugadores estéis de acuerdo.</p></div></div></details>
  </section>
  <section class="section" id="rules">${heading('Reglas, cartas y mazos', '05')}<p class="section-intro">Una consulta rápida para resolver dudas, conocer las cartas y preparar tu próxima partida.</p>${resources(data.rules)}</section>
  <section class="section" id="stores">
    ${heading('Dónde conseguir tus cartas', '06')}
    <p class="section-intro">Apoyar a una tienda local también ayuda a crear un lugar donde jugar. Para comprar online, distingue entre una tienda y un mercado con varios vendedores.</p>
    <div class="store-list">${['España','Europa','Estados Unidos'].map((region,index) => `<details${index === 0 ? ' open' : ''}><summary>Tiendas de ${escape(region)}</summary><div class="details-content">${storeTable(region)}</div></details>`).join('')}<details><summary>Mercados de cartas <small>Europa, Estados Unidos y Brasil</small></summary><div class="details-content">${resources(data.marketplaces)}</div></details></div>
    <p class="credit">Gracias a <strong>Marc, de Barcelona</strong>, por preparar la primera guía de inicio y recopilar buena parte de estas tiendas y recursos. ${anchor('Consultar su guía original', data.guide)}.</p>
    <p class="note">Encontrarás otras tiendas vinculadas a cada grupo en ${anchor('Comunidades', '#communities')}. También puedes consultar el ${anchor('buscador oficial de tiendas', 'https://sorcerytcg.com/stores')}. Confirma con ellas el catálogo y las actividades actuales.</p>
  </section>
  <section class="section" id="tools">${heading('Herramientas para tu mesa', '07')}<p class="section-intro">Lleva la cuenta de la vida y los umbrales elementales, prepara proxies y consulta referencias de precios.</p>${resources(data.tools)}</section>
  <section class="section" id="creators">
    ${heading('Aprende viendo jugar', '08')}
    <p class="section-intro">Creadores de contenido de la comunidad internacional. Las descripciones están en español; el contenido de estos canales es principalmente en inglés.</p>
    <details><summary>Canales de YouTube <small>${data.creators.length} creadores y recursos</small></summary><div class="details-content"><div class="creator-grid">${data.creators.map(creator => `<article class="creator">${anchor(creator.name, creator.url)}<p>${escape(creator.description)}</p></article>`).join('')}</div></div></details>
    <h3 class="group-heading">Para escuchar y leer</h3>${resources([ {name:'Death’s Door',description:'Pódcast dedicado a Sorcery: Contested Realm, en inglés.',links:[{label:'Escuchar el pódcast',url:'https://deathsdoorsorcerypod.substack.com/'}]}, {name:'The Ruby Core-ier',description:'Revista de la comunidad con estética retro, en inglés.',links:[{label:'Ver la revista',url:'https://www.patreon.com/c/therubycoreier/home'}]} ])}
  </section>
  <section class="section" id="resources">${heading('Sigue explorando el reino', '09')}
    <div class="community-list"><details><summary>Comunidades y ligas internacionales</summary><div class="details-content">${resources(data.international)}</div></details><details><summary>Recursos oficiales, imágenes y tipografía</summary><div class="details-content">${resources(data.officialResources)}</div></details><details><summary>Arte, lecturas y accesorios</summary><div class="details-content">${resources(data.additionalResources)}</div></details></div>
  </section>
</main></div>
<footer class="footer"><div class="wrap footer-inner"><div><img class="footer-logo" src="assets/sorcery-logo.png" width="136" height="55" alt="Sorcery: Contested Realm" loading="lazy"><p>Comunidad Hispana de Sorcery · Un proyecto independiente de jugadores.</p><p>Sorcery: Contested Realm y sus marcas pertenecen a Erik’s Curiosa Limited. Las ilustraciones pertenecen a sus respectivos artistas.</p><p>${anchor('Discord', data.discord)} · ${anchor('GitHub', 'https://github.com/sorcerytcg-hispano/sorcerytcg-hispano.github.io')} · ${anchor('Fuentes y agradecimientos', '#stores')}</p></div>${anchor('Volver arriba ↑', '#top', 'back-top')}</div></footer>
<script src="assets/main.js" defer></script>
</body></html>`;

await writeFile(new URL('index.html', root), html);
console.log(`Built ${fileURLToPath(new URL('index.html', root))}`);
