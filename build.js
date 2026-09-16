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

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

/* Cache-busting query string for styles.css. Without it, a browser that
   already fetched the stylesheet once keeps using its cached copy after a
   CSS-only push — the HTML changes (it's a new file every build) but the
   look doesn't, which reads as "the change didn't take" when it's really
   just a stale cache. Short hash of the file's own contents, so the query
   string only changes when the CSS actually does. */
const cssVersion = crypto.createHash('md5')
  .update(fs.readFileSync(path.join(__dirname, 'styles.css')))
  .digest('hex').slice(0, 8);
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

// Clicking an email link opens Gmail's web compose with the address already
// in "To", rather than whatever mail app the visitor's OS happens to hand
// mailto: to. Runs before externalizeLinks so the resulting mail.google.com
// URL also picks up target="_blank"/rel="noopener" from that pass.
const gmailify = html => html.replace(/href="mailto:([^"?]+)(?:\?[^"]*)?"/g,
  // &amp; because this lands inside an HTML attribute, not a bare URL.
  (_, addr) => `href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=${encodeURIComponent(addr)}"`);

// Every off-site link opens in a new tab, so a visitor never loses this
// page by clicking out to LinkedIn, a lab, or a press write-up. Run once
// over the finished HTML rather than threading target/rel through every
// renderer that builds an <a>. Internal links (mailto:, tel:, relative
// paths) are untouched — those aren't "leaving the site".
const externalizeLinks = html => html.replace(/<a\b([^>]*)>/g, (tag, attrs) => {
  if (!/href="https?:\/\//.test(attrs) || /\btarget=/.test(attrs)) return tag;
  const withRel = /\brel="/.test(attrs)
    ? attrs.replace(/rel="([^"]*)"/, (_, r) => `rel="${r} noopener"`)
    : attrs + ' rel="noopener"';
  return `<a${withRel} target="_blank">`;
});

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
  search: '<path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0-2a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"/><path d="M16.2 16.2a1 1 0 0 1 1.4 0l4.1 4.1a1 1 0 0 1-1.4 1.4l-4.1-4.1a1 1 0 0 1 0-1.4Z"/>'
};

/* ── social marks ──────────────────────────────────────────────────────────
   Inline SVG, so the row costs no image request and no icon font. A social
   entry in content.js names a `logo` (a key here), or falls back to the
   `icon` emoji it carries.

   `brand: true` means the mark supplies its own colours and styles.css must
   not repaint it — a brand mark in the wrong colour is worse than no mark.
   Everything else draws in currentColor and follows the theme.
   ────────────────────────────────────────────────────────────────────────── */
const LOGOS = {
  /* LinkedIn's "in" bug in its brand blue, used nominatively to link to
     Leo's own profile. */
  linkedin: { brand: true, svg:
    '<rect width="24" height="24" rx="4.6" fill="#0A66C2"/>' +
    '<path fill="#fff" d="M7.2 9.3H3.9v10.8h3.3V9.3Zm.2-3.4a1.9 1.9 0 1 0-3.8 0 1.9 1.9 0 0 0 3.8 0Z"/>' +
    '<path fill="#fff" d="M9.3 9.3h3.2v1.5h.1c.4-.9 1.5-1.8 3.2-1.8 3.4 0 4 2.3 4 5.2v5.9h-3.3v-5.2c0-1.3 0-2.9-1.7-2.9s-2 1.4-2 2.8v5.3H9.3V9.3Z"/>' },

  /* Gmail's envelope: white body, blue and green side walls, and the "M"
     valley in red and yellow. Hand-reconstructed in Google's palette —
     #4285F4, #34A853, #EA4335, #FBBC04 — because the site ships no image
     requests. If it does not match the official mark closely enough, drop
     the real SVG into assets/ and point this entry at it instead; a brand
     logo is better taken from the official asset than redrawn. */
  gmail: { brand: true, vb: '0 0 24 18', svg:
    '<path fill="#fff" d="M2.6 18h18.8a2.6 2.6 0 0 0 2.6-2.6V2.6A2.6 2.6 0 0 0 21.4 0H2.6A2.6 2.6 0 0 0 0 2.6v12.8A2.6 2.6 0 0 0 2.6 18Z"/>' +
    '<path fill="#4285F4" d="M0 2.6A2.6 2.6 0 0 1 2.6 0h2.9v18H2.6A2.6 2.6 0 0 1 0 15.4Z"/>' +
    '<path fill="#34A853" d="M18.5 0h2.9A2.6 2.6 0 0 1 24 2.6v12.8a2.6 2.6 0 0 1-2.6 2.6h-2.9Z"/>' +
    '<path fill="#EA4335" d="M5.5 0 12 4.9 12 9.5 5.5 4.6Z"/>' +
    '<path fill="#FBBC04" d="M18.5 0 12 4.9 12 9.5 18.5 4.6Z"/>' },

  /* Instagram's gradient camera glyph, hand-reconstructed like the Gmail
     mark above — check it against the official logo and swap in the real
     asset if it's off (see the Gmail note). */
  instagram: { brand: true, svg:
    '<defs><linearGradient id="ig" x1="0" y1="24" x2="24" y2="0">' +
    '<stop offset="0" stop-color="#FEDA77"/><stop offset=".35" stop-color="#F58529"/>' +
    '<stop offset=".6" stop-color="#DD2A7B"/><stop offset=".85" stop-color="#8134AF"/>' +
    '<stop offset="1" stop-color="#515BD4"/></linearGradient></defs>' +
    '<rect width="24" height="24" rx="6" fill="url(#ig)"/>' +
    '<rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" stroke-width="1.6"/>' +
    '<circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" stroke-width="1.6"/>' +
    '<circle cx="16.3" cy="7.7" r="1" fill="#fff"/>' },

  /* Chess.com's pawn-on-green, same approach as Instagram above. */
  chess: { brand: true, svg:
    '<rect width="24" height="24" rx="4.6" fill="#81B64C"/>' +
    '<circle cx="12" cy="8.3" r="3" fill="#fff"/>' +
    '<path fill="#fff" d="M9.4 12.3h5.2l1.1 3.6H8.3l1.1-3.6Z"/>' +
    '<path fill="#fff" d="M7 19.3h10v-2H7v2Z"/>' },

  /* The NeuroArts Blueprint's own site icon — the "NA" square it serves as
     its favicon at neuroartsblueprint.org (the Johns Hopkins / Aspen
     Institute initiative behind the Neuroarts Resource Center). Used, like
     LinkedIn's, only to link to Leo's profile there. An image file rather
     than inline SVG because it is their published asset, not a redraw. */
  neuroarts: { brand: true, src: 'assets/neuroarts-icon.png' },

  /* A plain globe, for a site with no mark of its own. */
  globe: { svg:
    '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.5a13 13 0 0 0-1.2-3.2A8 8 0 0 1 18.9 8ZM12 4.1c.6.9 1.2 2.2 1.5 3.9h-3c.3-1.7.9-3 1.5-3.9ZM4.3 14a8.3 8.3 0 0 1 0-4h2.9a17 17 0 0 0 0 4H4.3Zm.8 2h2.5c.3 1.2.7 2.3 1.2 3.2A8 8 0 0 1 5.1 16Zm2.5-8H5.1a8 8 0 0 1 3.7-3.2A13 13 0 0 0 7.6 8ZM12 19.9c-.6-.9-1.2-2.2-1.5-3.9h3c-.3 1.7-.9 3-1.5 3.9ZM13.8 14h-3.6a15 15 0 0 1 0-4h3.6a15 15 0 0 1 0 4Zm1.4 5.2c.5-.9.9-2 1.2-3.2h2.5a8 8 0 0 1-3.7 3.2ZM16.8 14a17 17 0 0 0 0-4h2.9a8.3 8.3 0 0 1 0 4h-2.9Z"/>' }
};

/* One social button's mark: a real logo when the entry names one, else its
   emoji. A mark with `src` is an image file in assets/; the button's
   aria-label already names it, so the image itself is decorative. */
const socialMark = s => {
  const l = s.logo && LOGOS[s.logo];
  if (!l) return s.icon || '';
  if (l.src) return `<img class="mark brand" src="${attr(l.src)}" alt="" width="29" height="29">`;
  return `<svg class="mark${l.brand ? ' brand' : ''}" viewBox="${l.vb || '0 0 24 24'}" aria-hidden="true">${l.svg}</svg>`;
};

/* The marked pin in the "Based in" card, after the row of pins in Kellie
   Ho's reference card. The check is #fff rather than a token because it sits
   on --accent, which is the same violet in both themes — the one place in
   the markup where a literal colour is correct. */
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
  const items = visible(d.items);
  // One card with a logo gives every card a logo slot, so the rows align.
  const slot  = items.some(i => i.logo);
  const logo  = i => slot
    ? `          <div class="now-logo">${i.logo ? `<img src="${attr(i.logo)}" alt="${attr(i.logoAlt || '')}">` : ''}</div>
`
    : '';
  return `      <div class="cards">
${items.map(i => card('', `${logo(i)}          <p class="now-tag">${i.tag}</p>
          <h3 class="now-role">${i.role}</h3>
          <p class="now-org">${i.org}${i.note ? ` — ${i.note}` : ''}</p>
          <p class="now-since">${flat(i.since)}</p>`)).join('\n')}
      </div>`;
}

/* Featured. The Right Now card row, but each card links out to a write-up.
   Items are picked by idx from another entry-list block (`from`, normally
   `press`), so an article is verified and dated in one place only. */
function renderFeatured(d){
  const pool  = visible((C[d.from] || {}).items);
  const items = (d.pick || []).map(idx => {
    const it = pool.find(x => x.idx === idx);
    if (!it) throw new Error(`featured: no visible item "${idx}" in ${d.from}`);
    return it;
  });
  return `      <div class="cards">
${items.map(it => {
    const link  = (it.links || [])[0];
    const inner = `          <p class="now-tag">${(it.meta || [])[0] || ''}</p>
          <h3 class="now-role">${it.title}</h3>
          <p class="now-org">${it.blurb}</p>
          <p class="now-since">${flat(it.when)}${link ? ` · ${link.label} ↗` : ''}</p>`;
    return link
      ? card('feat', inner, 'a').replace('<a class="card', `<a href="${attr(link.href)}" target="_blank" rel="noopener" class="card`)
      : card('feat', inner);
  }).join('\n')}
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

    /* Titles, affiliations and award/write-up links only — no blurb, for a
       leaner, more minimalist list (Leo's request, Sep 2026). The fuller
       write-up still lives in the CV. */
    return card('sp-6 entry', `${idx}          <h3 class="entry-title">${it.title}</h3>
${it.meta && it.meta.length ? chips(it.meta) + '\n' : ''}${links}`.replace(/\n$/, ''));
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

/* Ask — a headline and one input, nothing else. main.js owns the keyword
   map and the navigate-on-submit behaviour; this just renders the field. */
function renderAsk(d){
  return `      <div class="ask-bar" id="ask-bar" role="search">
        <input id="ask-input" type="text" placeholder="${attr(d.placeholder || 'Ask a question…')}"
               autocomplete="off" aria-label="Ask a question about this site">
        <button type="button" id="ask-submit" aria-label="Ask">
          <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.search}</svg>
        </button>
      </div>
      <p class="ask-result" id="ask-result" role="status" aria-live="polite"></p>`;
}

/* Fun / In the lab. Videos are click-to-play: the tile is a button showing a
   poster, and main.js swaps in the iframe on click, so nothing is requested
   from YouTube for a visitor who only scrolls past. Do not "simplify" this
   into a plain iframe. */
function renderMedia(d){
  return `      <div class="fun-grid">
${visible(d.items).map(function(it){
  const cap = (it.title || it.caption)
    ? `          <figcaption>${it.title ? `<span class="ft">${it.title}</span>` : ''}${it.caption ? `<span class="fc">${it.caption}</span>` : ''}</figcaption>`
    : '';
  const shape = it.shape ? ` ${attr(it.shape)}` : '';

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
    media = `          <button class="media${shape}" type="button" data-src="${attr(src)}" aria-label="Play: ${attr(plain(it.title || 'video'))}"${style}>
            <span class="badge">Watch</span>
            <span class="tri" aria-hidden="true"></span>
          </button>`;
  } else if (it.kind === 'photo' && it.src){
    media = `          <div class="media${shape}"><img src="${attr(it.src)}" alt="${attr(plain(it.title || it.caption || 'photo'))}" loading="lazy"></div>`;
  } else if (it.kind === 'link' && it.href){
    media = `          <a class="media linkcard${shape}" href="${attr(it.href)}" target="_blank" rel="noopener">
            <span class="badge">Link</span>
            <span class="lk">${it.title || it.href}</span>
          </a>`;
  } else {
    media = `          <div class="media slot${shape}">${it.kind === 'video' ? 'add a YouTube id in content.js' : 'add a file to assets/ and set its path in content.js'}</div>`;
  }

  return `        <figure class="tile stagger-item">
${media}
${cap}        </figure>`;
}).join('\n')}
      </div>`;
}

/* ── ADDING A SECTION: add one line here, pointing at a renderer above. ──── */
const RENDERERS = {
  featured:   renderFeatured,
  now:        renderNow,
  principles: renderPrinciples,
  research:   renderEntries,
  teaching:   renderEntries,
  notes:      renderEntries,
  press:      renderRail,
  reading:    renderList,
  fun:        renderMedia,
  lab:        renderMedia,
  ask:        renderAsk
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
      <div class="sec-head">
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
    ? card('sp-4 center', `          <p class="label">${primary.k}</p>
          ${primary.href ? `<a class="contact-value big" href="${attr(primary.href)}">${primary.label}</a>` : `<p class="contact-value big">${primary.label}</p>`}${primary.sub ? `\n          <a class="contact-value ubc big" href="${attr(primary.sub.href)}">${primary.sub.label}</a>` : ''}`)
    : '';

  /* The cards under the email card fill whole rows: three across when the
     count divides by three, otherwise two across, so no card is left alone
     on a row. Long values (the Neuroarts URL) need at least half a row. */
  const span = rest.length % 3 === 0 ? 'sp-4' : 'sp-6';
  const restCards = rest.map(l => {
    const inner = `          <p class="label">${l.k}</p>
          <p class="contact-value">${l.label}</p>`;
    return l.href
      ? card(`${span} center`, inner, 'a').replace('<a class="card', `<a href="${attr(l.href)}"${l.me ? ' rel="me"' : ''} class="card`)
      : card(`${span} center`, inner);
  }).join('\n');

  return `    <section class="section reveal" aria-labelledby="contact-h">
      <div class="bento">
${card('sp-8', `          <span class="eyebrow">${d.eyebrow || 'contact'}</span>
          <h2 class="display" id="contact-h">${d.title}</h2>
          <p class="body contact-blurb">${d.blurb}</p>`)}
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
          <label class="field">
            <span>${lbl.email || 'Your email'}</span>
            <input type="email" name="email" id="f-email" autocomplete="email" required>
          </label>
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

  /* Quote — bare, centered, no card fill. Sits directly on the page the way
     Kellie Ho's section titles do before her boxed content begins. The
     headline's <em> is the grey half of the sentence. */
  const quoteSection = `    <section class="quote-block reveal" aria-label="Quote">
      <h1 class="display">${h.headline}</h1>
${h.cite ? `      <p class="hero-cite">— <cite>${h.cite}</cite></p>\n` : ''}      <a class="scroll-cue" href="#splash">
        <span>Scroll for profile</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </section>`;

  /* Splash — the "Hi, I'm Leo" screen, modelled on the centered intro at
     kellieho.framer.ai/about: portrait with a live-status dot, name,
     greeting, tagline, credential, socials, CTAs — bare like the quote
     above it, not a card. */
  const cr = h.credential;
  const crLogo = !!(cr && cr.logo && fs.existsSync(path.join(__dirname, cr.logo)));
  if (cr && cr.logo && !crLogo) console.warn(`  ! credential.logo "${cr.logo}" not found, using the letters`);
  const credential = cr
    ? `\n      <p class="credential">${crLogo
        ? `<img class="uni-logo" src="${attr(cr.logo)}" alt="University of British Columbia">`
        : `<span class="uni-mark">${attr(cr.mark)}</span>`}<span>${cr.detail}</span></p>`
    : '';

  const portrait = C.meta.portrait
    ? `\n      <img class="hero-portrait" src="${attr(C.meta.portrait)}" alt="${attr(C.meta.name)}" width="230" height="230">`
    : '';

  const socialRow = (i.social && i.social.length) ? `\n      <div class="social-row">
${i.social.map(s => `        <a class="social-btn" href="${attr(s.href)}" aria-label="${attr(s.label)}">${socialMark(s)}<span class="tip">${attr(s.label)}</span></a>`).join('\n')}
      </div>` : '';

  const splashSection = `    <section class="splash reveal" id="splash" aria-label="Introduction">${portrait}
      <p class="hero-name">${attr(C.meta.name)}</p>
      <h2 class="display-sm">${i.greeting || 'Hi'}<br><em>${C.meta.tagline}</em></h2>${credential}${socialRow}
      <div class="pill-row">
${(h.buttons || []).map(b => `        <a class="pill ${b.solid ? 'blue' : 'ghost'}" href="${attr(b.href)}">${b.label}</a>`).join('\n')}
      </div>
    </section>`;

  /* B — based in, with the pin row. Paired with C as a plain half-and-half
         row now that A (their old tall partner) has moved into the splash
         above. */
  const cardB = card('sp-6', `          <p class="label">Based in</p>
          <p class="value">${attr(i.location ? plain(i.location).replace(/^📍\s*/, '') : C.meta.location)} 🇨🇦</p>
          <div class="pins" aria-hidden="true">
            ${PIN_FAR}${PIN_FAR}${PIN_FAR}${PIN_HERE}${PIN_FAR}${PIN_FAR}${PIN_FAR}
          </div>`);

  /* C — what drives him. Used to carry a faux notebook panel repeating the
         record card's fields/degree/etc rows underneath — dropped (Sep 2026,
         Leo's request) since card F already shows that data; showing it
         twice on one page was the actual bug. */
  const cardC = card('sp-6', `          <p class="label caps">What drives me</p>
          <p class="value">${i.focus || C.meta.tagline}</p>`);

  /* D — about. The greeting and socials now live in the splash above this
         section, so this card is a few big bullet points now (Leo's
         request) instead of a paragraph — same size/weight as "What
         drives me". */
  const cardD = card('sp-7', `          <span class="eyebrow">About</span>
          <ul class="about-points">
${(h.points || []).map(p => `            <li class="value">${p}</li>`).join('\n')}
          </ul>`);

  /* E — the rotating interest. main.js cycles .like-word through data-list.
         Its own full-width row, right under About. */
  const likes = i.likes || [];
  const cardE = likes.length
    ? card('sp-12 like-card center', `          <p class="like-lead">I also like…</p>
          <span class="like-word" data-list="${attr(likes.join('|'))}">${attr(likes[0])}</span>`)
    : '';

  /* F — the record. Moved up (Leo's request) to sit beside About instead of
         after it. */
  const cardF = card('sp-5', `          <span class="eyebrow">The record</span>
          <ul class="record">
${(h.record || []).map(r => `            <li><span class="k">${r.k}</span><span class="v">${r.flag ? '<span class="live-dot">●</span>' : ''}${r.v}</span></li>`).join('\n')}
          </ul>`);

  const bentoSection = `    <section class="reveal" aria-label="More about me">
      <div class="bento">
${[cardB, cardC, cardF, cardD, cardE].filter(Boolean).join('\n')}
      </div>
    </section>`;

  return `${quoteSection}\n${splashSection}\n${bentoSection}`;
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

<link rel="stylesheet" href="styles.css?v=${cssVersion}">

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

  /* Same list and order as the Home splash's social row (Leo's request),
     not contact.links — so "Follow" always matches what's on Home. */
  const follow = (C.intro.social || [])
    .filter(s => s.href)
    .map(s => `            <li><a href="${attr(s.href)}">${attr(s.label)}</a></li>`)
    .join('\n');

  const portrait = m.portrait
    ? `\n          <img src="${attr(m.portrait)}" alt="" width="150" height="150">`
    : '';

  return `<footer class="site-foot">
  <div class="shell">
    <div class="bento">
${card('sp-4 foot-id', `          <p class="t">Hi, I'm ${attr(m.name.split(' ')[0])}!</p>
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
  const html = externalizeLinks(gmailify(renderPage(page)));
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
