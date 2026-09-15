#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   build.js — turns content.js into the site's HTML pages

   ═════════════════════════════════════════════════════════════════════════

     node build.js

   No dependencies, no npm install, no build tools. Plain Node.

   Writes one file per entry in content.js's `pages` array (currently
   index.html, projects.html, fun.html, contact.html), sharing one bottom
   dock and one bento footer.

   You only need to open this file if you are changing the STRUCTURE of the
   page (adding a new kind of section, changing the markup a section emits,
   adding a whole new page). For everything else, edit content.js.

   The generated HTML files are committed to the repo on purpose: GitHub
   Pages serves them directly, so the site works even if nobody ever runs
   this script.

   ── LAYOUT MODEL ──────────────────────────────────────────────────────────
   Every page is a bento grid: flat filled cards of mixed widths on a plain
   ground. `card()` builds one; `sp-N` sets how many of the 12 columns it
   takes. There is no top header — the fixed dock at the bottom is the whole
   navigation, with the theme toggle at its right end.
   ══════════════════════════════════════════════════════════════════════════ */

const fs   = require('fs');
const path = require('path');
const C    = require('./content.js');

/* ── helpers ───────────────────────────────────────────────────────────── */

const visible = arr => (arr || []).filter(x => !x.hidden);

// Escape for use inside an HTML attribute. Content strings are trusted HTML
// (you write them), attribute values are not.
const attr = s => String(s == null ? '' : s)
  .replace(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// Strip tags + decode the few entities we use, for meta descriptions / JSON-LD.
const plain = s => String(s == null ? '' : s)
  .replace(/<[^>]*>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Dates in content.js carry a <br> for the two-line CV layout. The bento
// cards set them inline, so flatten it.
const flat = s => String(s == null ? '' : s).replace(/<br\s*\/?>/gi, ' ');

/* One card. `cls` carries the span (sp-7) plus any modifiers. */
const card = (cls, inner, tag) => {
  const t = tag || 'div';
  return `        <${t} class="card stagger-item ${cls}">
${inner}
        </${t}>`;
};

const chips = list => (list && list.length)
  ? `          <ul class="chips">${list.map(c => `<li class="chip">${c}</li>`).join('')}</ul>`
  : '';

/* ── icons ─────────────────────────────────────────────────────────────────
   Filled single-colour glyphs, drawn inline so the site ships no icon font
   and no image request. `fill:currentColor` is set in styles.css, so a path
   here never names a colour. Add one and reference it from a page's `icon`
   in content.js.
   ────────────────────────────────────────────────────────────────────────── */
const ICONS = {
  home:   '<path d="M12 3.1 2.5 11.2h2.4v8.2c0 .6.5 1.1 1.1 1.1h3.6v-5.9h4.8v5.9H18c.6 0 1.1-.5 1.1-1.1v-8.2h2.4L12 3.1Z"/>',
  folder: '<path d="M3 6.7C3 5.8 3.8 5 4.7 5h3.9c.5 0 1 .2 1.3.6l1.1 1.3c.2.3.5.4.8.4h6.5c.9 0 1.7.8 1.7 1.7v9.3c0 .9-.8 1.7-1.7 1.7H4.7C3.8 20 3 19.2 3 18.3V6.7Z"/>',
  spark:  '<path d="M11.4 2.3a.6.6 0 0 1 1.2 0l1.5 4.1c.1.2.2.3.4.4l4.1 1.5a.6.6 0 0 1 0 1.1l-4.1 1.5c-.2.1-.3.2-.4.4l-1.5 4.1a.6.6 0 0 1-1.2 0L9.9 11.3c-.1-.2-.2-.3-.4-.4L5.4 9.4a.6.6 0 0 1 0-1.1l4.1-1.5c.2-.1.3-.2.4-.4l1.5-4.1Z"/><path d="M18 15.2a.4.4 0 0 1 .8 0l.7 1.9 1.9.7a.4.4 0 0 1 0 .8l-1.9.7-.7 1.9a.4.4 0 0 1-.8 0l-.7-1.9-1.9-.7a.4.4 0 0 1 0-.8l1.9-.7.7-1.9Z"/>',
  mail:   '<path d="M3 7.6c0-1.2 1-2.2 2.2-2.2h13.6c1.2 0 2.2 1 2.2 2.2v.5l-9 5.3-9-5.3V7.6Z"/><path d="M3 10.4l8.5 5c.3.2.7.2 1 0l8.5-5v6c0 1.2-1 2.2-2.2 2.2H5.2C4 18.6 3 17.6 3 16.4v-6Z"/>',
  pin:    '<path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Z"/>'
};

/* The marked pin in the "Based in" card. The check is #fff rather than a
   token because it sits on --accent, which is the same blue in both themes
   — the one place in the CSS-or-markup where a literal colour is correct. */
const PIN_HERE =
  '<svg class="here" viewBox="0 0 24 26" aria-hidden="true">' +
  '<path d="M12 0C6.9 0 2.8 4.1 2.8 9.2 2.8 16.1 12 26 12 26s9.2-9.9 9.2-16.8C21.2 4.1 17.1 0 12 0Z"/>' +
  '<path d="M7.7 9.3l1.5-1.5 2 2 4.6-4.6 1.5 1.5-6.1 6.1-3.5-3.5Z" fill="#fff"/></svg>';

const PIN_FAR = '<svg class="far" viewBox="0 0 24 26" aria-hidden="true">' +
  '<path d="M12 0C6.9 0 2.8 4.1 2.8 9.2 2.8 16.1 12 26 12 26s9.2-9.9 9.2-16.8C21.2 4.1 17.1 0 12 0Z"/></svg>';


/* ── section renderers ─────────────────────────────────────────────────────
   Each one receives the matching block from content.js and returns the
   cards for that section. The header (eyebrow, headline, action pill) is
   drawn by renderSection() below, so renderers never draw their own.
   ────────────────────────────────────────────────────────────────────────── */

function renderNow(d){
  return `      <div class="cards">
${visible(d.items).map(i => card('', `          <p class="now-tag">${i.tag}</p>
          <h3 class="now-role">${i.role}</h3>
          <p class="now-org">${i.org}${i.note ? ` — ${i.note}` : ''}</p>
          <p class="now-since">${flat(i.since)}</p>`)).join('\n')}
      </div>`;
}

function renderPrinciples(d){
  return `      <div class="cards">
${visible(d.items).map(i => card('', `          <h3 class="principle-word">${i.word}</h3>
          <p class="body">${i.blurb}</p>`)).join('\n')}
      </div>`;
}

/* Research / teaching / notes. The big-title-plus-grey-body card from the
   reference's project section. The amber pill appears only when the entry
   actually links somewhere. */
function renderEntries(d){
  const items = visible(d.items).map(it => {
    if (it.group){
      return card('sp-6 entry', `          <p class="entry-idx"><span class="when">${flat(it.when)}</span></p>
          <h3 class="entry-title">${it.group}</h3>
          <ul class="subroles">
${visible(it.roles).map(r => `            <li>
              <div class="t">${r.title}</div>
${r.detail ? `              <div class="d">${r.detail}</div>\n` : ''}              <div class="d">${flat(r.when)}</div>
            </li>`).join('\n')}
          </ul>`);
    }

    const idx = (it.idx || it.when)
      ? `          <p class="entry-idx">${it.idx ? `<span>${it.idx}</span>` : ''}${it.when ? `<span class="when">${flat(it.when)}</span>` : ''}</p>\n`
      : '';
    const links = (it.links && it.links.length)
      ? `          <div class="pill-row">${it.links.map(l => `<a class="pill amber sm" href="${attr(l.href)}">${l.label}</a>`).join('')}</div>\n`
      : '';

    return card('sp-6 entry', `${idx}          <h3 class="entry-title">${it.title}</h3>
${it.meta && it.meta.length ? chips(it.meta) + '\n' : ''}${it.blurb ? `          <p class="body">${it.blurb}</p>\n` : ''}${links}`.replace(/\n$/, ''));
  }).join('\n');

  return `      <div class="bento">\n${items}\n      </div>`;
}

/* Featured — a horizontal scroll-snap rail, so the next card peeks in from
   the edge the way the reference's project carousel does. The overflow is
   on .rail, never on the page. */
function renderRail(d){
  const items = visible(d.items).map(it => {
    const href = (it.links && it.links.length) ? it.links[0].href : null;
    const inner = `          <p class="entry-idx">${it.idx ? `<span>${it.idx}</span>` : ''}${it.when ? `<span class="when">${flat(it.when)}</span>` : ''}</p>
          <h3 class="entry-title">${it.title}</h3>
${it.meta && it.meta.length ? chips(it.meta) + '\n' : ''}${it.blurb ? `          <p class="body">${it.blurb}</p>\n` : ''}${href ? `          <div class="pill-row"><span class="pill amber sm">${it.links[0].label} ↗</span></div>` : ''}`;
    return href
      ? card('entry', inner, 'a').replace('<a class="card', `<a href="${attr(href)}" target="_blank" rel="noopener" class="card`)
      : card('entry', inner);
  }).join('\n');

  return `      <div class="rail">\n${items}\n      </div>
      <p class="rail-note">Scroll for more →</p>`;
}

/* The reading list — one card holding a divided list of links. */
function renderList(d){
  return `      <div class="bento">
${card('sp-12 list-card', `          <ul class="linklist">
${visible(d.items).map(i => `            <li>${i.href
  ? `<a href="${attr(i.href)}" target="_blank" rel="noopener">${i.title}</a>`
  : `<span>${i.title}</span>`}</li>`).join('\n')}
          </ul>`)}
      </div>`;
}

/* Fun / In the lab. Videos are click-to-play: the tile is a button showing a
   poster, and main.js swaps in the iframe on click, so nothing is requested
   from YouTube for a visitor who only scrolls past. Do not "simplify" this
   into a plain iframe. */
function renderMedia(d){
  return `      <div class="cards">
${visible(d.items).map(function(it){
  const cap = (it.title || it.caption)
    ? `          <figcaption>${it.title ? `<span class="ft">${it.title}</span>` : ''}${it.caption ? `<span class="fc">${it.caption}</span>` : ''}</figcaption>`
    : '';

  let media;
  if (it.kind === 'video' && (it.youtube || it.vimeo)){
    const id   = attr(it.youtube || it.vimeo);
    const src  = it.youtube
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${id}?autoplay=1`;
    const post = it.poster
      ? attr(it.poster)
      : (it.youtube ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    const style = post ? ` style="background-image:url('${post}')"` : '';
    media = `          <button class="media" type="button" data-src="${attr(src)}" aria-label="Play: ${attr(plain(it.title || 'video'))}"${style}>
            <span class="badge">Watch</span>
            <span class="tri" aria-hidden="true"></span>
          </button>`;
  } else if (it.kind === 'photo' && it.src){
    media = `          <div class="media"><img src="${attr(it.src)}" alt="${attr(plain(it.title || it.caption || 'photo'))}" loading="lazy"></div>`;
  } else if (it.kind === 'link' && it.href){
    media = `          <a class="media linkcard" href="${attr(it.href)}" target="_blank" rel="noopener">
            <span class="badge">Link</span>
            <span class="lk">${it.title || it.href}</span>
          </a>`;
  } else {
    media = `          <div class="media slot">${it.kind === 'video' ? 'add a YouTube id in content.js' : 'add a file to assets/ and set its path in content.js'}</div>`;
  }

  return `        <figure class="tile stagger-item">
${media}
${cap}        </figure>`;
}).join('\n')}
      </div>`;
}

/* ── ADDING A SECTION: add one line here, pointing at a renderer above. ──── */
const RENDERERS = {
  now:        renderNow,
  principles: renderPrinciples,
  research:   renderEntries,
  teaching:   renderEntries,
  notes:      renderEntries,
  press:      renderRail,
  reading:    renderList,
  fun:        renderMedia,
  lab:        renderMedia
  // contact is handled separately — see renderContact below.
};

/* ── section shell ────────────────────────────────────────────────────────
   Eyebrow, two-tone headline, optional hint, optional action pill.        */
function renderSection(key, data){
  const fn = RENDERERS[key];
  if (!fn) throw new Error(`No renderer for section "${key}". Add one to RENDERERS in build.js.`);

  const hid    = `${key}-h`;
  const action = data.action
    ? `        <a class="pill blue" href="${attr(data.action.href)}">${data.action.label}</a>\n`
    : '';

  return `    <section class="section reveal" aria-labelledby="${hid}">
      <div class="sec-head${data.action ? ' has-action' : ''}">
        <div class="sec-head-text">
          <span class="eyebrow">${data.eyebrow || key}</span>
          <h2 id="${hid}">${data.title}</h2>
${data.hint ? `          <p class="sec-hint">${data.hint}</p>\n` : ''}        </div>
${action}      </div>
${fn(data)}
    </section>`;
}

/* ── contact ──────────────────────────────────────────────────────────────
   Rendered whole, as its own bento: the ask on a wide card, each way of
   reaching Leo on its own card, and the form across the bottom.          */
function renderContact(d){
  const links = visible(d.links);
  const primary = links[0];
  const rest    = links.slice(1);

  const primaryCard = primary
    ? card('sp-5 center', `          <p class="label">${primary.k}</p>
          ${primary.href ? `<a class="contact-value" href="${attr(primary.href)}">${primary.label}</a>` : `<p class="contact-value">${primary.label}</p>`}`)
    : '';

  const restCards = rest.map(l => {
    const inner = `          <p class="label">${l.k}</p>
          <p class="contact-value">${l.label}</p>`;
    return l.href
      ? card('sp-4 center', inner, 'a').replace('<a class="card', `<a href="${attr(l.href)}"${l.me ? ' rel="me"' : ''} class="card`)
      : card('sp-4 center', inner);
  }).join('\n');

  return `    <section class="section reveal" aria-labelledby="contact-h">
      <div class="bento">
${card('sp-7', `          <span class="eyebrow">${d.eyebrow || 'contact'}</span>
          <h2 class="display" id="contact-h">${d.title}</h2>
          <p class="body">${d.blurb}</p>`)}
${primaryCard}
${restCards}
${renderForm(d)}      </div>
    </section>`;
}

/* The message form. GitHub Pages has no server, so the form POSTs to a
   third-party endpoint (Formspree by default). With no endpoint configured
   it degrades to a plain mailto: link rather than a form that silently
   fails — a broken contact form is worse than none. */
function renderForm(d){
  const f = d.form;
  if (!f || f.on === false) return '';
  const lbl = f.fields || {};
  const emailLink = d.links.find(l => l.k === 'Email');
  const mailto = emailLink ? String(emailLink.href).replace(/^mailto:/, '') : '';

  if (!f.action){
    return card('sp-12', `          <h3 class="display-sm">${f.heading || 'Send me a message'}</h3>
          <p class="body">The message form is not connected yet — see the setup note in <code>content.js</code>. Until then, email works perfectly well.</p>
          <div class="pill-row"><a class="pill blue" href="mailto:${attr(mailto)}">Email me instead</a></div>`) + '\n';
  }

  return `        <form class="card stagger-item sp-12" action="${attr(f.action)}" method="POST">
          <h3 class="display-sm">${f.heading || 'Send me a message'}</h3>
          <div class="fieldrow">
            <label class="field">
              <span>${lbl.name || 'Your name'}</span>
              <input type="text" name="name" id="f-name" autocomplete="name" required>
            </label>
            <label class="field">
              <span>${lbl.email || 'Your email'}</span>
              <input type="email" name="email" id="f-email" autocomplete="email" required>
            </label>
          </div>
          <label class="field">
            <span>${lbl.message || 'Message'}</span>
            <textarea name="message" id="f-message" rows="5" required></textarea>
          </label>
          <input type="text" name="_gotcha" id="f-gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="formfoot">
            <button class="pill blue" type="submit">${f.button || 'Send'}</button>
${f.note ? `            <p class="formnote">${f.note}</p>\n` : ''}          </div>
        </form>
`;
}

/* ── the Home bento ───────────────────────────────────────────────────────
   Seven cards over four rows, mirroring the reference's opening screen: a
   tall identity card on the left, two stacked cards to its right, then the
   about card, the rotating-interest card, the record, and the training row.
   Spans must total 12 per row — see the sp-* classes in styles.css.      */
function renderHome(){
  const h = C.hero;
  const i = C.intro || {};

  /* A — identity. The headline's <em> is the grey half of the sentence. */
  const identityChips = []
    .concat(h.identity || [])
    .concat(h.credential ? [h.credential.detail] : []);

  const portrait = C.meta.portrait
    ? `\n          <img class="hero-portrait" src="${attr(C.meta.portrait)}" alt="${attr(C.meta.name)}" width="230" height="230">`
    : '';

  const cardA = card('sp-7 rows-2 hero-card', `          <div>
            <p class="hero-name">${attr(C.meta.name)}</p>
            <h1 class="display">${h.headline}</h1>
${h.card ? `            <p class="body">${h.card}</p>\n` : ''}${chips(identityChips)}
            <div class="pill-row">
${(h.buttons || []).map(b => `              <a class="pill ${b.solid ? 'blue' : 'ghost'}" href="${attr(b.href)}">${b.label}</a>`).join('\n')}
            </div>
          </div>${portrait}`);

  /* B — based in, with the pin row. */
  const cardB = card('sp-5', `          <p class="label">Based in</p>
          <p class="value">${attr(i.location ? plain(i.location).replace(/^📍\s*/, '') : C.meta.location)}</p>
          <div class="pins" aria-hidden="true">
            ${PIN_FAR}${PIN_FAR}${PIN_FAR}${PIN_HERE}${PIN_FAR}${PIN_FAR}${PIN_FAR}
          </div>`);

  /* C — what drives him, over a faux notebook panel built from the record
         rows. Real content, so the mockup is not decorative filler. */
  // attr() over plain(): plain() decodes &amp; back to a bare &, which is
  // invalid in the document. Re-escaping puts it back.
  const panelRows = (h.record || []).slice(0, 5).map(r =>
    `              <div><span class="k">${attr(plain(r.k).toLowerCase())}:</span> <span class="v">${attr(plain(r.v))}</span></div>`
  ).join('\n');

  const cardC = card('sp-5 flush', `          <p class="label caps">What drives me</p>
          <p class="value">${i.focus || C.meta.tagline}</p>
          <div class="panel" aria-hidden="true">
            <div class="panel-bar"><i></i><i></i><i></i></div>
            <div class="panel-body">
${panelRows}
            </div>
          </div>`);

  /* D — about. */
  const cardD = card('sp-7', `          <span class="eyebrow">About</span>
          <h2 class="display-sm">${i.greeting || 'Hi'}</h2>
          <p class="body">${h.standfirst}</p>
${(i.paragraphs || []).map(p => `          <p class="body">${p}</p>`).join('\n')}
${(i.social && i.social.length) ? `          <div class="social-row">
${i.social.map(s => `            <a class="social-btn" href="${attr(s.href)}" aria-label="${attr(s.label)}">${s.icon}<span class="tip">${attr(s.label)}</span></a>`).join('\n')}
          </div>` : ''}`);

  /* E — the rotating interest. main.js cycles .like-word through data-list. */
  const likes = i.likes || [];
  const cardE = likes.length
    ? card('sp-5 like-card center', `          <p class="like-lead">I also like…</p>
          <span class="like-word" data-list="${attr(likes.join('|'))}">${attr(likes[0])}</span>`)
    : '';

  /* F — the record. */
  const cardF = card('sp-5', `          <span class="eyebrow">The record</span>
          <ul class="record">
${(h.record || []).map(r => `            <li><span class="k">${r.k}</span><span class="v">${r.flag ? '<span class="live-dot">●</span>' : ''}${r.v}</span></li>`).join('\n')}
          </ul>`);

  /* G — training, with the chip row bleeding off both card edges. */
  const sk = C.skills || {};
  const skillChips = (sk.groups || []).reduce((acc, g) => acc.concat((g.items || []).map(x => x.t)), []);
  const cardG = sk.headline
    ? card('sp-7', `          <div class="bleed-row">${skillChips.map(t => `<span class="chip">${t}</span>`).join('')}</div>
          <p class="label caps">${sk.label || 'Trained in'}</p>
          <h2 class="display-sm">${sk.headline}</h2>`)
    : '';

  return `    <section class="reveal" aria-label="Introduction">
      <div class="bento">
${[cardA, cardB, cardC, cardD, cardE, cardF, cardG].filter(Boolean).join('\n')}
      </div>
    </section>`;
}

/* ── page shell: head, dock, footer — shared by every page ────────────────── */

const m = C.meta;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: m.name,
  jobTitle: "Undergraduate Researcher in Neuroscience",
  email: "mailto:" + m.email,
  url: m.url,
  sameAs: [m.linkedin].concat(
    (C.contact.links || [])
      .filter(l => l.me && l.href !== m.linkedin)
      .map(l => l.href)
  ),
  affiliation: [
    { "@type": "CollegeOrUniversity", name: "University of British Columbia" },
    { "@type": "Organization",        name: "STEMCELL Technologies" },
    { "@type": "CollegeOrUniversity", name: "Johns Hopkins University" }
  ],
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "University of Washington" }],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vancouver",
    addressRegion: "BC",
    addressCountry: "CA"
  }
}, null, 2);

function renderHead(page){
  const title       = page.key === 'home' ? attr(m.name) : `${attr(page.navLabel)} — ${attr(m.name)}`;
  const canonical   = page.file === 'index.html' ? m.url : m.url.replace(/\/$/, '') + '/' + page.file;
  const description = plain(page.description || m.description);
  const ogDesc      = plain(page.description || m.tagline);

  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>(function(){try{var t=localStorage.getItem('ljc-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B0B0C" media="(prefers-color-scheme: dark)">
<title>${title}</title>
<meta name="description" content="${attr(description)}">
<meta name="author" content="${attr(m.name)}">
<link rel="canonical" href="${attr(canonical)}">

<meta property="og:type" content="profile">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${attr(ogDesc)}">
<meta property="og:url" content="${attr(canonical)}">
<meta name="twitter:card" content="summary">

<link rel="icon" href="favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap">

<link rel="stylesheet" href="styles.css">

<script type="application/ld+json">
${jsonLd}
</script>
</head>`;
}

/* The dock — the site's only navigation. Built from C.pages, so adding a
   page there automatically adds a button; `icon` names a key in ICONS.
   The theme toggle sits at the right end behind a divider. Its <svg> keeps
   class="stroke" because main.js paints it with stroked sun/moon paths,
   while every other icon here is a filled shape. */
function renderDock(activeFile){
  const buttons = C.pages.map(p => {
    const active = p.file === activeFile;
    const glyph  = ICONS[p.icon] || ICONS.home;
    return `  <a class="dock-btn${active ? ' active' : ''}" href="${attr(p.file)}"${active ? ' aria-current="page"' : ''}>
    <svg viewBox="0 0 24 24" aria-hidden="true">${glyph}</svg>
    <span class="sr-only">${attr(p.navLabel)}</span>
    <span class="tip" aria-hidden="true">${attr(p.navLabel)}</span>
  </a>`;
  }).join('\n');

  return `<nav class="dock" aria-label="Pages">
${buttons}
  <span class="dock-sep" aria-hidden="true"></span>
  <button class="dock-btn" id="theme-toggle" type="button" aria-label="Switch between light and dark">
    <svg class="stroke" id="theme-icon" viewBox="0 0 24 24" aria-hidden="true"></svg>
  </button>
</nav>`;
}

/* The footer, as its own bento — an identity card beside a card of link
   columns, with the fine print along the bottom edge of the wide one. */
function renderFooter(){
  const menu = C.pages
    .map(p => `            <li><a href="${attr(p.file)}">${attr(p.navLabel)}</a></li>`)
    .join('\n');

  const follow = visible(C.contact.links)
    .filter(l => l.href)
    .map(l => `            <li><a href="${attr(l.href)}"${l.me ? ' rel="me"' : ''}>${l.k}</a></li>`)
    .join('\n');

  const portrait = m.portrait
    ? `\n          <img src="${attr(m.portrait)}" alt="" width="150" height="150">`
    : '';

  return `<footer class="site-foot">
  <div class="shell">
    <div class="bento">
${card('sp-4 foot-id', `          <p class="t">Hi, I'm ${attr(m.name.split(' ')[0])}.</p>
          <p class="s">${C.hero.card || attr(plain(m.tagline))}</p>${portrait}`)}
${card('sp-8', `          <div class="foot-cols">
            <div class="foot-col">
              <h3>Menu</h3>
              <ul>
${menu}
              </ul>
            </div>
            <div class="foot-col">
              <h3>Follow</h3>
              <ul>
${follow}
              </ul>
            </div>
          </div>
          <div class="foot-fine">
            <span>&copy; <span id="yr">2026</span> ${attr(m.name)}</span>
            <a href="#main">Back to top</a>
          </div>`)}
    </div>
  </div>
</footer>`;
}

/* ── one page ─────────────────────────────────────────────────────────────── */

function renderPage(page){
  const body = [];
  if (page.key === 'home') body.push(renderHome());

  page.sections.forEach(key => {
    if (key === 'contact'){ body.push(renderContact(C.contact)); return; }
    const data = C[key];
    if (!data) throw new Error(`content.js has no block named "${key}".`);
    body.push(renderSection(key, data));
  });

  return `<!doctype html>
<html lang="${attr(m.lang || 'en')}">
${renderHead(page)}
<body>

<!-- ─────────────────────────────────────────────────────────────────────────
     GENERATED FILE — do not edit by hand.
     Edit content.js, then run:  node build.js
     ───────────────────────────────────────────────────────────────────── -->

<a class="skip" href="#main">Skip to content</a>

<main id="main">
  <div class="shell">

${body.filter(Boolean).join('\n\n')}

  </div>
</main>

${renderFooter()}
${renderDock(page.file)}

<script src="main.js"></script>
</body>
</html>
`;
}

/* ── write every page ─────────────────────────────────────────────────────── */

C.pages.forEach(page => {
  const html = renderPage(page);
  fs.writeFileSync(path.join(__dirname, page.file), html, 'utf8');
  const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
  console.log(`✓ ${page.file} written — ${kb} KB`);
  page.sections.forEach(key => console.log(`    · ${key}`));
});

/* sitemap.xml — built from the same C.pages list the dock and every page
   loop over, so it can't list a page that doesn't exist or miss one that does. */
const base = m.url.replace(/\/$/, '');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${C.pages.map(p => `  <url><loc>${attr(p.file === 'index.html' ? base + '/' : base + '/' + p.file)}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ sitemap.xml written');
