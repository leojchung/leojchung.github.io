#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   build.js — turns content.js into index.html
   ══════════════════════════════════════════════════════════════════════════

     node build.js

   No dependencies, no npm install, no build tools. Plain Node.

   You only need to open this file if you are changing the STRUCTURE of the
   page (adding a new kind of section, changing the markup a section emits).
   For everything else, edit content.js.

   The generated index.html is committed to the repo on purpose: GitHub Pages
   serves it directly, so the site works even if nobody ever runs this script.
   ══════════════════════════════════════════════════════════════════════════ */

const fs   = require('fs');
const path = require('path');
const C    = require('./content.js');

const OUT = path.join(__dirname, 'index.html');

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

const metaLine = list => (list || [])
  .map(m => `<span class="bit">${m}</span>`)
  .join('<span class="sep">·</span>');

/* ── section renderers ─────────────────────────────────────────────────────
   Each one receives the matching block from content.js and returns the inner
   HTML for the right-hand column. The rail (§ number, title, hint) is drawn
   by renderSection() below, so renderers never draw their own heading.
   ────────────────────────────────────────────────────────────────────────── */

function renderNow(d){
  return `<div class="now">
${visible(d.items).map(i => `          <article>
            <div class="tag">${i.tag}</div>
            <h3>${i.role}</h3>
            <div class="org">${i.org}${i.note ? `<br>${i.note}` : ''}</div>
            <div class="since">${i.since}</div>
          </article>`).join('\n')}
        </div>`;
}

function renderProse(d){
  return `<div class="prose">
${(d.paragraphs || []).map(p => `          <p>${p}</p>`).join('\n')}
        </div>`;
}

function renderEntries(d){
  const body = visible(d.items).map(it => {
    // grouped employer
    if (it.group){
      return `          <div class="group">
            <div class="group-head">
              <div class="when">${it.when || ''}</div>
              <h3>${it.group}</h3>
            </div>
            <ul class="subroles">
${visible(it.roles).map(r => `              <li>
                <div class="when">${r.when || ''}</div>
                <div>
                  <div class="t">${r.title}</div>
${r.detail ? `                  <div class="d">${r.detail}</div>\n` : ''}                </div>
              </li>`).join('\n')}
            </ul>
          </div>`;
    }
    // plain entry
    const links = (it.links && it.links.length)
      ? `              <div class="meta">${it.links.map(l => `<a class="bit" href="${attr(l.href)}">${l.label}</a>`).join('<span class="sep">·</span>')}</div>\n`
      : '';
    return `          <article class="entry">
            <div class="when">${it.idx ? `<span class="idx">${it.idx}</span>` : ''}${it.when || ''}</div>
            <div>
              <h3>${it.title}</h3>
${it.meta && it.meta.length ? `              <div class="meta">${metaLine(it.meta)}</div>\n` : ''}${it.blurb ? `              <p>${it.blurb}</p>\n` : ''}${links}            </div>
          </article>`;
  }).join('\n');

  return `<div class="entries">\n${body}\n        </div>`;
}

function renderEducation(d){
  return `<div class="edu">
${visible(d.items).map(e => `          <div class="edu-item">
            <div class="when">${e.when}</div>
            <div>
              <h3>${e.school}</h3>
              <div class="degree">${e.degree}</div>
${e.chips && e.chips.length ? `              <div class="chips">${e.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>\n` : ''}            </div>
          </div>`).join('\n')}
        </div>`;
}

function renderService(d){
  return `<div class="service">
${visible(d.items).map(s => `          <div class="svc">
            <div><span class="role">${s.role}</span><span class="org">${s.org}</span></div>
            <div class="yr${s.live ? ' live' : ''}">${s.yr}</div>
          </div>`).join('\n')}
        </div>`;
}

function renderSkills(d){
  return `<div>
          <div class="skills">
${visible(d.groups).map(g => `            <div class="skillset">
              <h3>${g.name}</h3>
              <ul>${visible(g.items).map(i => `<li${i.cert ? ' class="cert"' : ''}>${i.t}</li>`).join('')}</ul>
            </div>`).join('\n')}
          </div>
${d.note ? `          <p class="cert-note"><span class="sw"></span>${d.note}</p>\n` : ''}        </div>`;
}

/* Contact is the one section that breaks the rail layout — it is rendered
   whole by renderContact() and skips renderSection(). */
function renderContact(d, band){
  return `  <section class="section${band ? ' band' : ''}" id="contact" aria-labelledby="contact-h">
    <div class="shell">
      <div class="contact-grid">
        <div>
          <h2 id="contact-h">${d.title}</h2>
          <p>${d.blurb}</p>
        </div>
        <div class="links">
${visible(d.links).map(l => {
  const inner = l.href
    ? `<a href="${attr(l.href)}"${l.me ? ' rel="me"' : ''}>${l.label}</a>`
    : `<span class="static">${l.label}</span>`;
  return `          <div class="link-row"><div class="k">${l.k}</div>${inner}</div>`;
}).join('\n')}
        </div>
      </div>
${renderForm(d)}    </div>
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

  if (!f.action){
    return `      <div class="formwrap">
        <div class="form-fallback">
          <h3>${f.heading || 'Send me a message'}</h3>
          <p>The message form is not connected yet — see the setup note in <code>content.js</code>. Until then, email works perfectly well.</p>
          <a class="btn solid" href="mailto:${attr(d.links.find(l => l.k === 'Email') ? String(d.links.find(l => l.k === 'Email').href).replace(/^mailto:/, '') : '')}">Email me instead</a>
        </div>
      </div>
`;
  }

  return `      <div class="formwrap">
        <form class="msgform" action="${attr(f.action)}" method="POST">
          <h3>${f.heading || 'Send me a message'}</h3>
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
            <button class="btn solid" type="submit">${f.button || 'Send'}</button>
${f.note ? `            <p class="formnote">${f.note}</p>\n` : ''}          </div>
        </form>
      </div>
`;
}

function renderFun(d){
  return `<div class="fun">
${visible(d.items).map(function(it){
  const cap = (it.title || it.caption)
    ? `        <figcaption>${it.title ? `<span class="ft">${it.title}</span>` : ''}${it.caption ? `<span class="fc">${it.caption}</span>` : ''}</figcaption>`
    : '';

  // ── video: click-to-play. Nothing is requested from YouTube until the
  //    visitor actually clicks, so the page stays fast and no third party
  //    sets a cookie on someone who merely scrolled past.
  if (it.kind === 'video' && (it.youtube || it.vimeo)){
    const id   = attr(it.youtube || it.vimeo);
    const src  = it.youtube
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${id}?autoplay=1`;
    const post = it.poster
      ? attr(it.poster)
      : (it.youtube ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    const style = post ? ` style="background-image:url('${post}')"` : '';
    return `      <figure class="fun-item">
        <button class="media play" type="button" data-src="${src}" aria-label="Play: ${attr(plain(it.title || 'video'))}"${style}>
          <span class="pill">Watch</span>
          <span class="tri" aria-hidden="true"></span>
        </button>
${cap}      </figure>`;
  }

  if (it.kind === 'photo' && it.src){
    return `      <figure class="fun-item">
        <div class="media"><img src="${attr(it.src)}" alt="${attr(plain(it.title || it.caption || 'photo'))}" loading="lazy"></div>
${cap}      </figure>`;
  }

  if (it.kind === 'link' && it.href){
    return `      <figure class="fun-item">
        <a class="media linkcard" href="${attr(it.href)}" target="_blank" rel="noopener">
          <span class="pill">Link</span>
          <span class="lk">${it.title || it.href}</span>
        </a>
${cap}      </figure>`;
  }

  // nothing filled in yet
  return `      <figure class="fun-item">
        <div class="media slot">${it.kind === 'video' ? 'add a YouTube id in content.js' : 'add a file to assets/ and set its path in content.js'}</div>
${cap}      </figure>`;
}).join('\n')}
        </div>`;
}

/* ── ADDING A SECTION: add one line here, pointing at a renderer above. ──── */
const RENDERERS = {
  now:        renderNow,
  about:      renderProse,
  research:   renderEntries,
  experience: renderEntries,
  teaching:   renderEntries,
  notes:      renderEntries,
  press:      renderEntries,
  education:  renderEducation,
  service:    renderService,
  skills:     renderSkills,
  fun:        renderFun
  // contact is handled separately — see below.
};

/* ── section shell (the § rail + right column) ──────────────────────────── */
function renderSection(key, data, num, band){
  const fn = RENDERERS[key];
  if (!fn) throw new Error(`No renderer for section "${key}". Add one to RENDERERS in build.js.`);

  const hid  = `${key}-h`;
  const idAt = data.id ? ` id="${attr(data.id)}"` : '';
  const n    = String(num).padStart(2, '0');

  return `  <section class="section${band ? ' band' : ''}"${idAt} aria-labelledby="${hid}">
    <div class="shell">
      <div class="sec-grid">
        <div class="sec-rail">
          <span class="num">§ ${n}</span>
          <h2 id="${hid}">${data.title}</h2>
${data.hint ? `          <p class="hint">${data.hint}</p>\n` : ''}        </div>
        ${fn(data)}
      </div>
    </div>
  </section>`;
}

/* ── assemble ──────────────────────────────────────────────────────────── */

const m        = C.meta;
const sections = C.sections.filter(s => s.on);

const navItems = sections
  .filter(s => s.nav && s.id)
  .map(s => `        <a href="#${attr(s.id)}">${s.navLabel || C[s.key].title}</a>`)
  .join('\n');

let num = 1;   // § numbering starts at 01
const sectionHtml = sections.map((s, i) => {
  const data = C[s.key];
  if (!data) throw new Error(`content.js has no block named "${s.key}".`);
  data.id = s.id;                       // carry the anchor id through
  const band = i % 2 === 1;             // alternating tonal band — "shades"
  if (s.key === 'contact') return renderContact(data, band);
  return renderSection(s.key, data, num++, band);
}).join('\n\n');

const heroButtons = C.hero.buttons
  .map(b => `            <a class="btn${b.solid ? ' solid' : ''}" href="${attr(b.href)}">${b.label}</a>`)
  .join('\n');

const heroRecord = C.hero.record
  .map(r => `          <div class="row"><div class="k">${r.k}</div><div class="v">${r.flag ? '<span class="open-dot">◆</span> ' : ''}${r.v}</div></div>`)
  .join('\n');

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

const html = `<!doctype html>
<html lang="${attr(m.lang || 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(m.name)}</title>
<meta name="description" content="${attr(plain(m.description))}">
<meta name="author" content="${attr(m.name)}">
<link rel="canonical" href="${attr(m.url)}">

<meta property="og:type" content="profile">
<meta property="og:title" content="${attr(m.name)}">
<meta property="og:description" content="${attr(plain(m.tagline))}">
<meta property="og:url" content="${attr(m.url)}">
<meta name="twitter:card" content="summary">

<link rel="icon" href="favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400..600&family=JetBrains+Mono:wght@400;500;700&display=swap">

<link rel="stylesheet" href="styles.css">

<script type="application/ld+json">
${jsonLd}
</script>
</head>
<body>

<!-- ─────────────────────────────────────────────────────────────────────────
     GENERATED FILE — do not edit by hand.
     Edit content.js, then run:  node build.js
     ───────────────────────────────────────────────────────────────────── -->

<a class="skip" href="#main">Skip to content</a>

<header class="site-head">
  <div class="shell">
    <a class="wordmark" href="#top">${attr(m.shortName).replace(/\s+(\S+)$/, ' <span>$1</span>')}</a>
    <div class="head-right">
      <nav class="site-nav" aria-label="Sections">
${navItems}
      </nav>
      <button id="theme-toggle" type="button" aria-label="Switch between light and dark">
        <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>
      </button>
    </div>
  </div>
</header>

<main id="main">

  <section class="hero" id="top">
    <div class="shell">
      <div class="hero-grid">
        <div>
${C.hero.identity ? `          <div class="identity">${C.hero.identity.map(w => `<span>${w}</span>`).join('')}</div>\n` : ''}          <h1>${C.hero.headline}</h1>
          <p class="standfirst">${C.hero.standfirst}</p>
          <div class="hero-cta">
${heroButtons}
          </div>
        </div>
        <div>
${m.portrait ? `          <img class="portrait" src="${attr(m.portrait)}" alt="${attr(m.name)}" width="600" height="600">\n` : ''}          <div class="record" aria-label="Profile summary">
${heroRecord}
          </div>
        </div>
      </div>
    </div>
  </section>

${sectionHtml}

</main>

<footer class="site-foot">
  <div class="shell">
    <div>&copy; <span id="yr">2026</span> ${attr(m.name)}</div>
    <div><a href="#top">Back to top</a></div>
  </div>
</footer>

<script src="main.js"></script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`✓ index.html written — ${kb} KB, ${sections.length} sections`);
sections.forEach(s => console.log(`    · ${s.key}${s.id ? '  #' + s.id : ''}`));
