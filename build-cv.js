#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   build-cv.js — turns content.js into cv.html, a print-ready CV
   ══════════════════════════════════════════════════════════════════════════

     node build-cv.js

   Then open cv.html and press Cmd-P → Save as PDF → save it as cv.pdf in this
   folder. That is the file the two "Curriculum vitae" buttons on the site
   point at.

   WHY THIS EXISTS
   ───────────────────────────────────────────────────────────────────────────
   Your CV and your website will otherwise drift apart, and you will discover
   it three days after sending the stale one to a PI. Both now read from the
   same content.js, so a role added in one place appears in both.

   This is a STARTING POINT, not a finished CV. It carries everything the site
   knows about you, in a conventional academic order. A real CV wants things
   the website does not — coursework, technical detail, references, a grade
   point average if it flatters you. Edit CV_EXTRA at the bottom of this file
   for those, or export once and take it into a document editor.

   Deliberately different from the website:
     · reverse-chronological throughout, no "Right now" section
     · Education first, the academic convention
     · no About prose — a CV is a record, not an argument
     · black on white, no colour, no dark mode
     · Letter paper with 0.6in margins, sized to print
   ══════════════════════════════════════════════════════════════════════════ */

const fs   = require('fs');
const path = require('path');
const C    = require('./content.js');

const visible = a => (a || []).filter(x => !x.hidden);
const attr = s => String(s == null ? '' : s)
  .replace(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
  .replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// CV dates want to be one line, not the two-line form the website uses.
const flat = s => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();

// Strip the website's inline emphasis — a CV should not have italic asides.
const bare = s => String(s || '').replace(/<\/?(?:em|b|strong|i)>/gi, '');

// A CV entry gets the first sentence or two, not the website's full paragraph.
// Two pages beats four; anyone who wants the long version reads the site.
function trim(s, sentences){
  const t = bare(s || '').trim();
  if (!t) return '';
  const parts = t.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!parts) return t;
  return parts.slice(0, sentences || 2).join('').trim();
}

const m = C.meta;

/* ── row: a dated entry ──────────────────────────────────────────────────── */
function row(when, title, sub, detail){
  return `      <div class="row">
        <div class="when">${flat(when)}</div>
        <div class="what">
          <div class="title">${bare(title)}</div>
${sub    ? `          <div class="sub">${bare(sub)}</div>\n` : ''}${detail ? `          <div class="detail">${bare(detail)}</div>\n` : ''}        </div>
      </div>`;
}

function section(name, inner){
  if (!inner.trim()) return '';
  return `    <section>
      <h2>${bare(name)}</h2>
${inner}
    </section>`;
}

/* ── Education ───────────────────────────────────────────────────────────── */
const education = section('Education', visible(C.education.items)
  .map(e => row(e.when, e.school, e.degree, null)).join('\n'));

/* ── Research ────────────────────────────────────────────────────────────── */
const research = section('Research experience', visible(C.research.items)
  .map(p => row(p.when, p.title, (p.meta || []).join(' · '), trim(p.blurb, 2))).join('\n'));

/* ── Professional ────────────────────────────────────────────────────────── */
const professional = section('Professional experience', visible(C.experience.items)
  .map(it => it.group
    ? visible(it.roles).map(r => row(r.when, r.title, `${bare(it.group)} · ${bare(r.detail || '')}`, null)).join('\n')
    : row(it.when, it.title, (it.meta || []).join(' · '), trim(it.blurb, 1))
  ).join('\n'));

/* ── Teaching ────────────────────────────────────────────────────────────── */
const teaching = section('Teaching &amp; education', visible(C.teaching.items)
  .map(t => row(t.when, t.title, (t.meta || []).join(' · '), trim(t.blurb, 2))).join('\n'));

/* ── Coverage ────────────────────────────────────────────────────────────── */
const coverage = C.press ? section('Selected coverage', visible(C.press.items)
  .map(p => row(p.when, p.title, (p.meta || []).join(' · '),
    (p.links && p.links[0]) ? String(p.links[0].href).replace(/^https?:\/\/(www\.)?/, '') : null
  )).join('\n')) : '';

/* ── Service ─────────────────────────────────────────────────────────────── */
const service = section('Service &amp; leadership', visible(C.service.items)
  .map(s => row(s.yr, s.role, s.org, null)).join('\n'));

/* ── Skills ──────────────────────────────────────────────────────────────── */
const skills = section('Skills &amp; certifications', visible(C.skills.groups)
  .map(g => `      <div class="row">
        <div class="when">${bare(g.name)}</div>
        <div class="what"><div class="detail skills-line">${
          visible(g.items).map(i => bare(i.t) + (i.cert ? '<sup>†</sup>' : '')).join(', ')
        }</div></div>
      </div>`).join('\n')
  + `\n      <div class="row"><div class="when"></div><div class="what"><div class="detail footnote">† formally certified</div></div></div>`);

/* ── extra sections you add by hand ──────────────────────────────────────── */
const CV_EXTRA = `
    <!-- ═══════════════════════════════════════════════════════════════════
         ADD CV-ONLY SECTIONS HERE. They will not appear on the website.
         Copy the shape of a row: a left column (dates or a label) and a right
         column (title, sub, detail). For example:

    <section>
      <h2>Awards</h2>
      <div class="row">
        <div class="when">2025</div>
        <div class="what">
          <div class="title">Top prize, Trainee Rapid Talks</div>
          <div class="sub">UBC Synergy Undergraduate Research Day</div>
        </div>
      </div>
    </section>

    <section>
      <h2>Relevant coursework</h2>
      ...
    </section>

    <section>
      <h2>References</h2>
      <div class="row"><div class="when"></div><div class="what">
        <div class="detail">Available on request.</div>
      </div></div>
    </section>
         ═══════════════════════════════════════════════════════════════════ -->
`;

/* ── assemble ────────────────────────────────────────────────────────────── */
/* The CV header wants a compact professional line, not the website's
   conversational tagline. Falls back to the tagline if identity is unset. */
const cvRole = (C.hero.identity && C.hero.identity.length)
  ? C.hero.identity.join('  ·  ') + '  ·  Neuroscience, University of British Columbia'
  : String(m.tagline || '').split('.')[0];

const contactLine = [
  m.email,
  m.location,
  String(m.linkedin || '').replace(/^https?:\/\/(www\.)?/, ''),
  String(m.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
].filter(Boolean).join('  ·  ');

const html = `<!doctype html>
<html lang="${attr(m.lang || 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(m.name)} — Curriculum Vitae</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* GENERATED by build-cv.js — edit content.js or CV_EXTRA, not this file. */
@page{ size: letter; margin: 0.6in; }

*,*::before,*::after{box-sizing:border-box}
:root{
  --ink:#141414;
  --ink-2:#3d3d3d;
  --ink-3:#6b6b6b;
  --rule:#c9c9c9;
  --rule-strong:#141414;
  --f-serif:"Source Serif 4",Iowan Old Style,Palatino,Georgia,serif;
  --f-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
}
html,body{background:#fff}
body{
  margin:0;color:var(--ink);font-family:var(--f-serif);
  font-size:10pt;line-height:1.36;-webkit-font-smoothing:antialiased;
}
.page{max-width:7.3in;margin:0 auto;padding:0.55in 0.5in 0.7in}

/* ── masthead ── */
header{border-bottom:1.5pt solid var(--rule-strong);padding-bottom:8pt;margin-bottom:4pt}
h1{margin:0;font-weight:600;font-size:23pt;letter-spacing:-.018em;line-height:1.05}
.role{
  margin-top:5pt;font-family:var(--f-mono);font-size:7.6pt;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink-2);
}
.contact{
  margin-top:8pt;font-family:var(--f-mono);font-size:7.8pt;color:var(--ink-2);
  letter-spacing:.01em;line-height:1.65;
}

/* ── sections ── */
section{margin-top:12pt;break-inside:auto}
h2{
  margin:0 0 5.5pt;font-family:var(--f-mono);font-size:7.8pt;font-weight:500;
  letter-spacing:.16em;text-transform:uppercase;color:var(--ink);
  padding-bottom:4pt;border-bottom:.6pt solid var(--rule);
}
.row{
  display:grid;grid-template-columns:1.08in 1fr;gap:0 14pt;
  padding:4pt 0;break-inside:avoid;
}
.when{
  font-family:var(--f-mono);font-size:7.6pt;color:var(--ink-3);
  padding-top:1.6pt;line-height:1.5;font-variant-numeric:tabular-nums;
}
.title{font-weight:600;font-size:10.3pt;line-height:1.28}
.sub{font-family:var(--f-mono);font-size:7.8pt;color:var(--ink-2);margin-top:2.2pt;line-height:1.55}
.detail{font-size:9.2pt;color:var(--ink-2);margin-top:2.8pt;line-height:1.38}
.skills-line{margin-top:1.6pt;color:var(--ink)}
.footnote{font-family:var(--f-mono);font-size:7.4pt;color:var(--ink-3);margin-top:1pt}
sup{font-size:.72em;line-height:0}

/* ── on screen only ── */
.hint{
  max-width:7.3in;margin:14pt auto 0;padding:10pt 13pt;
  border-left:2pt solid #4A2D6E;background:#f4f2f8;
  font-family:var(--f-mono);font-size:8pt;line-height:1.7;color:#3d3d3d;
}
@media print{ .hint{display:none} .page{padding:0} body{font-size:10pt} }
</style>
</head>
<body>

<div class="hint">
  Press Cmd-P (Ctrl-P on Windows) → Destination “Save as PDF” → Save it as
  <b>cv.pdf</b> in this folder. Turn <b>off</b> “Headers and footers” in the
  print dialog's More settings, or the browser stamps a URL and a date across
  every page.<br>
  This block does not print. Regenerate any time with <b>node build-cv.js</b>.
</div>

<div class="page">

  <header>
    <h1>${attr(m.name)}</h1>
    <div class="role">${bare(cvRole)}</div>
    <div class="contact">${attr(contactLine)}</div>
  </header>

${[education, research, professional, teaching, coverage, service, skills].filter(Boolean).join('\n\n')}
${CV_EXTRA}
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'cv.html'), html, 'utf8');
console.log('✓ cv.html written');
console.log('  Open it, Cmd-P, Save as PDF, name it cv.pdf in this folder.');
