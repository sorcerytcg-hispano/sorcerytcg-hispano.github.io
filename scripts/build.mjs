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
const storeTable = region => `<div class="table-wrap"><table><caption>Oferta orientativa recopilada por la comunidad. Consulta disponibilidad y envíos con cada tienda.</caption><thead><tr><th scope="col">Tienda</th><th scope="col">Zona</th><th scope="col">Productos</th></tr></thead><tbody>${data.stores.filter(store => store.region === region).map(store => `<tr><td>${store.url ? anchor(store.name, store.url) : escape(store.name)}</td><td>${escape(store.city || store.region)}</td><td>${escape(store.products)}</td></tr>`).join('')}</tbody></table></div>`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b1427">
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
    <div class="actions">${anchor('Empieza con el vídeo', '#start', 'button primary')}${anchor('Encuentra tu comunidad', '#communities', 'button')}</div>
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
    ${heading('De tu primer vídeo a tu primera partida', '01')}
    <p class="section-intro">Sorcery es un juego de cartas de fantasía en el que dos jugadores construyen un reino sobre la mesa, invocan criaturas y se enfrentan como avatares. Este recorrido te ayudará a empezar paso a paso.</p>
    <h3>1. Mira cómo se juega</h3>
    <p>Empieza por este vídeo introductorio. Ver las cartas en la mesa te ayudará a entender cómo se desarrolla una partida antes de entrar en los detalles del reglamento.</p>
    <div class="guide-video"><div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${escape(data.video.id)}?hl=es" title="${escape(data.video.title)}" width="960" height="540" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><p class="video-caption">${anchor('Ver el vídeo en YouTube', data.video.url)} si el reproductor no carga.</p></div>
    <div class="guide-step"><h3>2. Empieza con un precon de Beta o Gothic</h3><p>Los precons son mazos preconstruidos, preparados para jugar desde el primer momento. Probablemente sean la forma más sencilla de empezar: puedes aprender las reglas y descubrir qué te gusta sin tener que construir un mazo desde cero.</p>${resources(data.precons)}<p>Elige el conjunto que más te atraiga y juega varias partidas con esos mazos. Ya habrá tiempo de ampliarlos o dar el salto a construido.</p></div>
    <div class="guide-step"><h3>3. Encuentra con quién jugar</h3><div class="guide-actions"><article><h4>En persona</h4><p>Busca tu ciudad o país y pregunta por partidas de iniciación. Un grupo local puede ayudarte a probar los precons y conocer las tiendas de tu zona.</p>${anchor('Buscar un grupo cercano', '#communities', 'text-link')}</article><article><h4>Online</h4><p>Si no tienes con quién jugar físicamente, también puedes empezar online. Busca rival en Discord y acordad una plataforma y unos mazos para aprender.</p>${anchor('Elegir una plataforma', '#online', 'text-link')}</article></div></div>
    <div class="guide-step"><h3>4. Sigue aprendiendo y da el salto a la liga</h3><p>Consulta las <a href="#rules">reglas y el Codex</a>, prueba <a href="#decks">mazos comunitarios</a> y descubre qué estilo disfrutas. Cuando te apetezca jugar con continuidad, tienes dos buenos puntos de encuentro.</p><div class="guide-actions"><article><h4>Nuestra Liga Hispana</h4><p>Una liga online, amistosa y gratuita para compartir partidas con la comunidad en español.</p>${anchor('Conocer la Liga Hispana', '#league', 'text-link')}</article><article><h4>Sorcerers Summit</h4><p>Una de las principales comunidades internacionales de Sorcery, en inglés. Organiza temporadas y competición estructurada: un lugar para seguir aprendiendo, medirte con jugadores experimentados y explorar el competitivo.</p>${anchor('Descubrir Sorcerers Summit', 'https://www.sorcererssummit.com/', 'text-link')}</article></div></div>
    <aside class="design-note" aria-labelledby="design-title"><h3 id="design-title">El espíritu de Sorcery: partidas que te sorprendan</h3><p><strong>Erik Olofsson</strong>, creador de Sorcery, es desarrollador de videojuegos, director creativo y coleccionista de cartas. Quiso recuperar la sensación de descubrimiento de los primeros juegos de cartas coleccionables, uniendo arte tradicional, decisiones tácticas sobre el tablero y partidas para disfrutar con amigos. Así lo explica en ${anchor('su entrevista en la web oficial', 'https://sorcerytcg.com/news/interview-with-game-creator-erik-olofsson')}.</p><p>Erik describe el juego como diseñado para ser <strong>«injusto y espectacular»</strong> (<em>unfair and splashy</em>): hay cartas y jugadas de gran impacto que pueden cambiar por completo una partida. Sorcery busca una variabilidad alta, con situaciones nuevas y sorpresas frecuentes. En el mensaje que acompaña a esta guía explica que aumentar el tamaño de los mazos ayuda a contener la consistencia que aporta un catálogo de cartas cada vez mayor.</p><p>Su intención es evitar que los mazos extremadamente optimizados y consistentes dominen hasta eliminar esa sorpresa. Construir bien tu mazo sigue importando; la experiencia que persigue deja espacio a lo inesperado.</p><figure class="guide-figure"><a href="assets/erik-design-message.webp" target="_blank" rel="noopener" aria-label="Ampliar la captura del mensaje de Erik"><img src="assets/erik-design-message.webp" alt="Mensaje de Erik sobre el aumento del tamaño de los mazos para mantener la variabilidad y las jugadas sorprendentes. El contenido se explica en español en los párrafos anteriores." width="1292" height="478" loading="lazy"></a><figcaption>Captura compartida por la comunidad, en inglés. ${anchor('Leer el mensaje original de Erik en Discord', 'https://discord.com/channels/769359301466652693/769359301466652696/1281759447198335117')}. El acceso al mensaje puede requerir pertenecer al servidor.</figcaption></figure></aside>
    <p class="credit">Gracias a <strong>Marc</strong>, compañero de la comunidad hispana, por su primera recopilación de recursos. Parte de esta guía se apoya en ${anchor('la guía que empezó a preparar', data.guide)}, que hemos tomado como una de nuestras fuentes para ampliar y actualizar este recorrido.</p>
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
  <section class="section" id="rules">
    ${heading('Resuelve tus primeras dudas', '04')}
    <p class="section-intro">Después de probar el juego, es normal encontrarse con una habilidad o una interacción que no está clara. Estos son los recursos oficiales que conviene tener a mano.</p>
    <div class="codex-panel"><p class="eyebrow">Tu referencia para las dudas de reglas</p><h3>El Codex oficial</h3><p>El Codex complementa al reglamento: permite buscar términos, habilidades y situaciones concretas. Si no sabes cómo resolver algo durante una partida, empieza por aquí y consulta también las preguntas frecuentes de la carta implicada.</p>${anchor('Consultar el Codex', 'https://sorcerytcg.com/codex', 'button primary')}</div>
    ${resources(data.rules)}
    <p class="note">Para guardar tus mazos y registrar tu colección, inicia sesión en la web oficial de Sorcery. Más abajo encontrarás ${anchor('las herramientas de cartas y construcción de mazos', '#deckbuilding')}.</p>
  </section>
  <section class="section" id="decks">
    ${heading('Tu siguiente mazo, a tu ritmo', '05')}
    <p class="section-intro">Cuando hayas jugado con los precons y conozcas lo esencial, puedes probar construido: un mazo elegido carta a carta. Empezar por una lista comunitaria te permite aprender cómo encajan sus piezas.</p>
    <div class="deck-stages">${data.deckGuides.map((guide,index) => `<article class="deck-stage"><p class="eyebrow">${index === 0 ? 'Primero · Una lista para aprender' : 'Después · Explora el competitivo'}</p><h3>${escape(guide.name)}</h3><p>${escape(guide.description)}</p>${links(guide.links)}</article>`).join('')}</div>
    <p class="note"><strong>Sorcerers Summit</strong> es una de las principales comunidades internacionales de Sorcery en inglés. Organiza competición estructurada, temporadas y su propio sistema competitivo. Sus mazos recomendados están seleccionados por su equipo; son listas comunitarias.</p>
    <div class="guide-step"><h3>Avatares y elementos: cómo leer una tier list</h3><p>Esta clasificación orientativa toma como referencia los Top 8 de torneos importantes, pero también refleja la opinión de su autor. No es una clasificación oficial ni una garantía de resultados: puede cambiar con el metajuego, las nuevas cartas y los torneos que se tengan en cuenta.</p><p>Un avatar no juega solo. Su habilidad se combina con uno o varios <strong>elementos</strong>, que determinan las cartas disponibles y sus requisitos de umbral. Esa combinación perfila el arquetipo: sus sinergias, sus respuestas y cómo se enfrenta a otros mazos. Por eso, el mismo avatar puede rendir de forma distinta según los elementos y la lista que lo acompañen.</p><p>Utilízala para descubrir opciones y compararla con <a href="https://www.sorcererssummit.com/top-8">las listas que han conseguido resultados</a>. Elige también por tu estilo y por lo que te apetezca aprender.</p><figure class="guide-figure"><a href="assets/avatar-tier-list.webp" target="_blank" rel="noopener" aria-label="Ampliar la clasificación orientativa de avatares"><img src="assets/avatar-tier-list.webp" alt="Tier list comunitaria de avatares con cinco niveles, de S a D. En el nivel S aparecen Pathfinder, Archimago, Necromancer, Imposter, Avatar of Air y Geomancer." width="1778" height="1448" loading="lazy"></a><figcaption>Imagen aportada por la comunidad. De mayor a menor valoración: S, A, B, C y D. Los nombres y las etiquetas originales están en inglés. Pulsa la imagen para ampliarla.</figcaption></figure></div>
    <p class="credit">Antes de comprar una lista completa, puedes probarla online. Para un torneo, comprueba que el mazo cumple el formato de la convocatoria: los precons de iniciación no equivalen por sí solos a una lista de construido.</p>
  </section>
  <section class="section" id="deckbuilding">
    ${heading('Consulta cartas y construye tu mazo', '06')}
    <p class="section-intro">Utiliza una base de datos para buscar cartas, comparar opciones y dar forma a tu lista. Estas herramientas reúnen consultas de cartas y, según la plataforma, construcción de mazos y gestión de la colección.</p>
    <div class="codex-panel"><p class="eyebrow">Cartas, mazos y colección</p><h3>La web oficial de Sorcery</h3><p>Busca cartas, crea y comparte tus mazos y lleva un registro de tu colección. Es el punto de partida para conocer el catálogo del juego y organizar las cartas que tienes. Las listas compartidas por jugadores son mazos comunitarios.</p><div class="actions">${anchor('Explorar la web oficial', 'https://sorcerytcg.com/', 'button primary')}${anchor('Consultar cartas', 'https://sorcerytcg.com/cards', 'button')}${anchor('Crear un mazo', 'https://sorcerytcg.com/decks/create', 'button')}${anchor('Mi colección', 'https://sorcerytcg.com/collection', 'button')}</div></div>
    ${resources(data.deckTools.filter(tool => tool.name !== 'Web oficial de Sorcery'))}
  </section>
  <section class="section" id="proxies">
    ${heading('Imprime proxies para probar tu mazo', '07')}
    <p class="section-intro">Prueba una lista en mesa antes de comprar las cartas. Los proxies son copias de prueba: acuerda su uso con la otra persona antes de jugar.</p>
    <div class="codex-panel"><p class="eyebrow">Una herramienta de la comunidad hispana</p><h3>Generador de proxies de Sorcery</h3><p>Pega la URL de tu mazo de sorcerytcg.com y prepara un PDF con sus cartas para imprimir. Una forma sencilla de pasar de la lista a la mesa y probar cambios en tu mazo.</p>${anchor('Crear e imprimir mis proxies', 'https://proxy.sorcerytcg.workers.dev/', 'button primary')}</div>
    <p class="note">También puedes utilizar ${anchor('Sorcerer’s Spellbook', 'https://sorcererspellbook.com/')} como alternativa para preparar proxies.</p>
  </section>
  <section class="section" id="league">
    ${heading('Liga Hispana de Sorcery', '08')}
    <div class="league-panel"><p class="eyebrow">Online · Amistosa · Gratuita</p><h3>Una liga para compartir el juego</h3><p>Apúntate con una cuenta gratuita de Challonge y entra en el Discord de la comunidad. Las inscripciones, los emparejamientos y los resultados se gestionan en Challonge.</p><div class="league-facts"><div><strong>10 días</strong><span>por ronda</span></div><div><strong>Construido</strong><span>suizo y fase final</span></div><div><strong>Top 4</strong><span>final al mejor de tres</span></div></div><div class="actions">${anchor('Ver torneos e inscribirme', data.leagueUrl, 'button primary')}${anchor('Entrar al Discord', data.discord, 'button')}</div></div>
    <details><summary>Normas de la liga</summary><div class="details-content"><p class="section-intro">Normas facilitadas por la organización. Consulta la convocatoria de cada torneo para conocer sus fechas y cualquier actualización.</p>${data.leagueRules.map(block => `<div class="rule-block"><h4>${escape(block.title)}</h4>${block.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>`).join('')}<div class="rule-block"><h4>Plataformas</h4><p>Podéis jugar en cualquiera de las ${anchor('cuatro plataformas de esta guía', '#online')}, siempre que ambos jugadores estéis de acuerdo.</p></div></div></details>
  </section>
  <section class="section" id="creators">
    ${heading('Creadores de contenido: vídeos y partidas', '09')}
    <p class="section-intro">Descubre partidas comentadas, análisis de mazos y vídeos para seguir aprendiendo. Estos creadores publican principalmente en inglés.</p>
    <div class="creator-grid">${data.creators.map(creator => `<article class="creator">${anchor(creator.name, creator.url)}<p>${escape(creator.description)}</p></article>`).join('')}</div>
    <h3 class="group-heading">También para escuchar</h3>${resources([{name:'Death’s Door',description:'Pódcast dedicado a Sorcery: Contested Realm, en inglés.',links:[{label:'Escuchar el pódcast',url:'https://deathsdoorsorcerypod.substack.com/'}]}])}
  </section>
  <section class="section" id="reading">
    ${heading('Lecturas y blogs', '10')}
    <p class="section-intro">Artículos, guías y revistas para profundizar en el juego, sus mazos y su comunidad. Estos recursos son principalmente en inglés.</p>
    <article class="reading-feature"><p class="eyebrow">Lectura destacada</p><h3>${escape(data.reading[0].name)}</h3><p>${escape(data.reading[0].description)}</p>${anchor(data.reading[0].links[0].label, data.reading[0].links[0].url, 'button primary')}</article>
    ${resources(data.reading.slice(1))}
    <h3 class="group-heading">Revistas de la comunidad</h3>${resources([{name:'The Ruby Core-ier',description:'Revista de la comunidad con estética retro, en inglés.',links:[{label:'Ver la revista',url:'https://www.patreon.com/c/therubycoreier/home'}]}])}
  </section>
  <section class="section" id="stores">
    ${heading('Dónde conseguir tus cartas', '11')}
    <p class="section-intro">Con un mazo en mente, compara dónde conseguir las cartas que te faltan. En un mercado compras a distintos vendedores; en una tienda puedes encontrar producto sellado, cartas sueltas y, en algunos casos, una comunidad con la que jugar.</p>
    <div class="store-list"><details open><summary>Mercados de cartas <small>Europa, Estados Unidos y Brasil</small></summary><div class="details-content">${resources(data.marketplaces)}</div></details>${['Europa','España','Estados Unidos'].map(region => `${region === 'Estados Unidos' ? `<div class="codex-panel"><p class="eyebrow">Producto sellado · Estados Unidos</p><h3>Team Covenant</h3><p>Tienda estadounidense donde comprar cajas de sobres y mazos de inicio de Sorcery. Además, colabora con Erik’s Curiosa mediante Covenant Fulfilled, una plataforma de distribución para tiendas autorizadas que facilita el acceso a producto y material de juego organizado.</p><div class="actions">${anchor('Ver Sorcery en Team Covenant', 'https://www.teamcovenant.com/games/sorcery-tcg', 'button primary')}${anchor('Guía de compra', 'https://blog.teamcovenant.com/sorcery-tcg-buyers-guide/', 'button')}</div><p class="credit">${anchor('Conoce la colaboración en la web oficial', 'https://sorcerytcg.com/news/erik-s-curiosa-expands-retail-access-through-covenant-fulfilled')}. Para pedidos desde otros países, consulta las condiciones de envío antes de comprar.</p></div>` : ''}<details><summary>Tiendas de ${escape(region)}</summary><div class="details-content">${storeTable(region)}</div></details>`).join('')}</div>
    <div class="price-panel"><h3>Cómo interpretar las referencias de precios</h3><p class="section-intro">Estas herramientas sirven para orientarte. Los precios pueden variar bastante entre Europa y Latinoamérica, e incluso dentro de cada región. Una referencia internacional o estadounidense no tiene por qué coincidir con lo que pagarás en tu país. Compara la edición, el idioma, el acabado, el estado de la carta y el coste total con envío.</p>${resources(data.priceTools)}</div>
    <p class="credit">Buena parte de la recopilación de tiendas parte del trabajo de <strong>Marc</strong>. Gracias por preparar aquella primera lista para la comunidad. La que presentamos aquí ha sido ampliada y actualizada; puedes consultar ${anchor('su guía original', data.guide)}.</p>
    <p class="note">Encontrarás otras tiendas vinculadas a cada grupo en ${anchor('Comunidades', '#communities')}. También puedes consultar el ${anchor('buscador oficial de tiendas', 'https://sorcerytcg.com/stores')}. Confirma con ellas el catálogo y las actividades actuales.</p>
  </section>
  <section class="section" id="dust">
    ${heading('Dust: jugar también tiene recompensa', '12')}
    <p class="section-intro">Dust es el sistema de recompensas y fidelización de Sorcery. Acumulas puntos Dust y puedes canjearlos en la Dust Store por recompensas exclusivas.</p>
    <div class="dust-steps"><article><h3>Autentica tus cajas</h3><p>Al comprar cajas de sobres, busca su código y autentícalas en la web oficial para obtener Dust.</p></article><article><h3>Participa en eventos</h3><p>Los eventos del Sorcery Play Network también permiten obtener Dust. Las recompensas dependen del tipo de evento y de las condiciones del programa.</p></article><article><h3>Canjea tus puntos</h3><p>Utiliza Dust en la tienda de recompensas para conseguir cartas promocionales, tapetes y otros artículos exclusivos.</p></article></div>
    <p>Entre las recompensas hay versiones con arte alternativo y también cartas propias y exclusivas de este sistema, como <em>Court of Equity</em>, <em>Mobbed Court</em>, <em>Mock Court</em> y <em>Overflowing Court</em>. Los eventos también forman parte de la distribución de cartas promocionales exclusivas.</p>
    <div class="links">${anchor('Consultar el programa Dust y sus recompensas', 'https://sorcerytcg.com/dust')}${anchor('Conocer las cartas exclusivas de Dust', 'https://sorcerytcg.com/news/all-rise-new-dust-rewards-are-here')}</div>
  </section>
  <section class="section" id="tools">${heading('Herramientas para tu mesa', '13')}<p class="section-intro">Aplicaciones para acompañar tus partidas presenciales: lleva la cuenta de la vida y los umbrales elementales desde el móvil.</p>${resources(data.tools)}</section>

  <section class="section" id="international">
    ${heading('Comunidades y ligas internacionales', '14')}
    <p class="section-intro">Conecta con jugadores de otros países, encuentra más partidas y sigue la competición internacional. Estas comunidades se comunican principalmente en inglés.</p>
    ${resources(data.international)}
  </section>
  <section class="section" id="resources">${heading('Sigue explorando el reino', '15')}
    <div class="community-list"><details><summary>Recursos oficiales, imágenes y tipografía</summary><div class="details-content">${resources(data.officialResources)}</div></details><details><summary>Arte, lecturas y accesorios</summary><div class="details-content">${resources(data.additionalResources)}</div></details></div>
  </section>
</main></div>
<footer class="footer"><div class="wrap footer-inner"><div><img class="footer-logo" src="assets/sorcery-logo.png" width="136" height="55" alt="Sorcery: Contested Realm" loading="lazy"><p>Comunidad Hispana de Sorcery · Un proyecto independiente de jugadores.</p><p>Sorcery: Contested Realm y sus marcas pertenecen a Erik’s Curiosa Limited. Las ilustraciones pertenecen a sus respectivos artistas.</p><p>${anchor('Discord', data.discord)} · ${anchor('GitHub', 'https://github.com/sorcerytcg-hispano/sorcerytcg-hispano.github.io')} · ${anchor('Fuentes y agradecimientos', '#stores')}</p></div>${anchor('Volver arriba ↑', '#top', 'back-top')}</div></footer>
<script src="assets/main.js" defer></script>
</body></html>`;

await writeFile(new URL('index.html', root), html);
console.log(`Built ${fileURLToPath(new URL('index.html', root))}`);
