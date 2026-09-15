#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   check.js — audits the built site. Run it after build.js.

     node build.js && node check.js

   No dependencies. Exits non-zero if anything fails, so CI can gate on it
   (see .github/workflows/check-build.yml).

   WHY THIS EXISTS
   ───────────────────────────────────────────────────────────────────────────
   CLAUDE.md says contrast is "checked, not eyeballed". This is the thing
   that checks it. Every colour pairing the design actually uses is measured
   against the real WCAG formula in BOTH themes — which is not something you
   can do by looking, and which caught three genuine failures the first time
   it ran. If you change a token in styles.css, this tells you whether you
   just broke legibility for somebody.

   It also catches the two mistakes this codebase is structurally prone to:
   markup that no longer matches the stylesheet after a rename, and a bare
   "&" in an attribute (easy to introduce in a template string, invisible in
   a browser, invalid in the document).

   WHAT IT CANNOT DO
   ───────────────────────────────────────────────────────────────────────────
   It does not render anything. Layout, wrapping, overlap, whether a card
   looks right at 390px — none of that is checked here. Open the page.

   Notably it cannot see font sizes, so it cannot tell you that --ink-mute
   (legal only at display sizes, where AA is 3:1) has been used on something
   small. That one is on you; the rule is in styles.css's header.
   ══════════════════════════════════════════════════════════════════════════ */

const fs = require('fs');
const C  = require('./content.js');

const PAGES = C.pages.map(p => p.file);
const css   = fs.readFileSync('styles.css', 'utf8');

let fails = 0;
const fail = m => { console.log('  ✗ ' + m); fails++; };
const ok   = m => console.log('  ✓ ' + m);
const note = m => console.log('  · ' + m);

/* ── 1. tag balance ─────────────────────────────────────────────────────── */
console.log('\n[1] Tag balance');
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link',
  'meta','param','source','track','wbr','path','circle','rect','line','polyline','polygon','use','stop']);

PAGES.forEach(f => {
  const clean = fs.readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!doctype[^>]*>/gi, '');

  const stack = [];
  let bad = null;
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const tag = m[2].toLowerCase();
    if (VOID.has(tag) || m[4] === '/') continue;
    if (m[1] === '/') {
      if (!stack.length) { bad = `stray </${tag}>`; break; }
      const top = stack.pop();
      if (top !== tag) { bad = `</${tag}> closes <${top}>`; break; }
    } else stack.push(tag);
  }
  if (bad) fail(`${f}: ${bad}`);
  else if (stack.length) fail(`${f}: unclosed <${stack.join('>, <')}>`);
  else ok(`${f}: balanced`);
});

/* ── 2. bare ampersands ─────────────────────────────────────────────────── */
console.log('\n[2] Unescaped ampersands');
PAGES.forEach(f => {
  const html = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  const m = html.match(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g);
  if (m) fail(`${f}: ${m.length} bare & — run it through attr()`);
  else ok(`${f}: clean`);
});

/* ── 3. class coverage ──────────────────────────────────────────────────────
   Informational, not fatal: several classes are emitted only in states the
   current content does not produce (the form fields once Formspree is
   configured, `subroles` for a grouped entry, `slot` for an empty media
   tile), so "unused" is normal here. A class used in the HTML with no rule
   at all is usually a rename that missed a spot — worth a look.           */
console.log('\n[3] Class coverage');
const htmlClasses = new Set();
PAGES.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  let m; const re = /class="([^"]*)"/g;
  while ((m = re.exec(html)) !== null) m[1].trim().split(/\s+/).filter(Boolean).forEach(c => htmlClasses.add(c));
});
const cssClasses = new Set();
{
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let m; const re = /\.(-?[_a-zA-Z][\w-]*)/g;
  while ((m = re.exec(noComments)) !== null) cssClasses.add(m[1]);
}
const RUNTIME = new Set(['has-reveal', 'in', 'stroke']);   // added by main.js
const orphan  = [...htmlClasses].filter(c => !cssClasses.has(c)).sort();
const unused  = [...cssClasses].filter(c => !htmlClasses.has(c) && !RUNTIME.has(c)).sort();

if (orphan.length) fail(`in the HTML with no CSS rule: ${orphan.join(', ')}`);
else ok('every class in the HTML has a rule');
if (unused.length) note(`in the CSS but not in any page (conditional, or dead): ${unused.join(', ')}`);

/* ── 4. WCAG contrast ───────────────────────────────────────────────────── */
console.log('\n[4] WCAG contrast');

const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
  return 0.2126 * lin(parseInt(n.slice(0, 2), 16))
       + 0.7152 * lin(parseInt(n.slice(2, 4), 16))
       + 0.0722 * lin(parseInt(n.slice(4, 6), 16));
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* Read a token out of one theme block. The dark blocks must agree with each
   other — [5] checks that — so reading either one is enough here. */
const blockFrom = marker => {
  const i = css.indexOf(marker);
  if (i < 0) return '';
  const open = css.indexOf('{', i);
  return css.slice(open, css.indexOf('}', open));
};
const LIGHT = blockFrom(':root{');
const DARK  = blockFrom(':root[data-theme="dark"]');
const tok = (block, name) => {
  const m = block.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{3,6})'));
  return m ? m[1] : null;
};

const theme = which => {
  const b = which === 'light' ? LIGHT : DARK;
  const get = n => tok(b, n) || tok(LIGHT, n);   // dark inherits what it omits
  return {
    page: get('page'), card: get('card'), card2: get('card-2'), card3: get('card-3'),
    ink: get('ink'), inkMute: get('ink-mute'), ink2: get('ink-2'),
    accent: get('accent'), accentInk: get('accent-ink'), cta: get('cta'), live: get('live')
  };
};

/* [what it is, foreground, background, minimum]
   4.5 = body text · 3.0 = large display text, and non-text UI like the dot */
const pairs = t => [
  ['ink on page',                     t.ink,       t.page,   4.5],
  ['ink on card',                     t.ink,       t.card,   4.5],
  ['ink on card-2',                   t.ink,       t.card2,  4.5],
  ['ink on card-3',                   t.ink,       t.card3,  4.5],
  ['ink-2 on page',                   t.ink2,      t.page,   4.5],
  ['ink-2 on card',                   t.ink2,      t.card,   4.5],
  ['ink-2 on card-2',                 t.ink2,      t.card2,  4.5],
  ['ink-2 on card-3 (the chips)',     t.ink2,      t.card3,  4.5],
  ['ink-mute on card [display only]', t.inkMute,   t.card,   3.0],
  ['ink-mute on page [display only]', t.inkMute,   t.page,   3.0],
  ['accent-ink on page',              t.accentInk, t.page,   4.5],
  ['accent-ink on card',              t.accentInk, t.card,   4.5],
  ['accent-ink on card-2',            t.accentInk, t.card2,  4.5],
  ['white on the accent fill',        '#FFFFFF',   t.accent, 4.5],
  ['ink on the amber fill',           '#0A0A0A',   t.cta,    4.5],
  ['live dot on card [UI]',           t.live,      t.card,   3.0]
];

['light', 'dark'].forEach(which => {
  console.log(`  ── ${which} ──`);
  const t = theme(which);
  pairs(t).forEach(([label, fg, bg, min]) => {
    if (!fg || !bg) { fail(`${which}: cannot resolve tokens for "${label}"`); return; }
    const r = ratio(fg, bg);
    const line = `${label}: ${r.toFixed(2)}:1 (needs ${min})`;
    if (r >= min) ok(line); else fail(`${which} — ${line}  [${fg} on ${bg}]`);
  });
});

/* ── 5. the two dark blocks must agree ──────────────────────────────────────
   A visitor's theme has three states, not two. The media query serves
   everyone on "system"; the [data-theme] block serves the toggle. If they
   disagree, the toggle and the OS default render differently — the exact
   bug this repo has hit before.                                          */
console.log('\n[5] Dark theme blocks agree');
{
  const mq = blockFrom(':root:not([data-theme="light"])');
  const names = [...new Set([...mq.matchAll(/--([\w-]+):/g)].map(m => m[1])
    .concat([...DARK.matchAll(/--([\w-]+):/g)].map(m => m[1])))];
  const bad = names.filter(n => {
    const a = (mq.match(new RegExp('--' + n + ':\\s*([^;]+);')) || [])[1];
    const b = (DARK.match(new RegExp('--' + n + ':\\s*([^;]+);')) || [])[1];
    return !a || !b || a.trim() !== b.trim();
  });
  if (bad.length) fail(`tokens differing between the two dark blocks: ${bad.join(', ')}`);
  else ok(`all ${names.length} dark tokens match in both blocks`);
}

/* ── 6. structure ───────────────────────────────────────────────────────── */
console.log('\n[6] Structure');
PAGES.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const p = [];
  if (!/<nav class="dock"/.test(html))         p.push('no dock');
  if (!/id="theme-toggle"/.test(html))         p.push('no theme toggle');
  if (!/class="stroke"/.test(html))            p.push('theme icon missing .stroke (main.js paints stroked paths)');
  if (!/<a class="skip"/.test(html))           p.push('no skip link');
  if (!/id="main"/.test(html))                 p.push('no #main');
  if (!/<footer class="site-foot"/.test(html)) p.push('no footer');
  if (!/#f-gotcha|_gotcha/.test(html) && /class="msgform"|<form/.test(html)) p.push('form without the honeypot');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (f === 'index.html' ? h1 !== 1 : h1 !== 0) p.push(`${h1} <h1> (home wants 1, subpages 0)`);
  if (p.length) fail(`${f}: ${p.join('; ')}`); else ok(`${f}: ok`);
});

/* ── 7. the skills marquee ──────────────────────────────────────────────────
   The seam-free loop depends on one non-obvious invariant: the track must
   space its chips with margin-right, NOT a flex `gap`. With a gap, the
   track is 2N chips and 2N-1 gaps, so translating by -50% lands half a gap
   short of the loop point and the row stutters once per cycle. Easy to
   "tidy" into a gap later and not notice for a while, hence this check. */
console.log('\n[7] Skills marquee');
{
  const flat = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
  const track = (flat.match(/\.marquee-track\{([^}]*)\}/) || [])[1] || '';
  const chip  = (flat.match(/\.marquee-track\.chip\{([^}]*)\}/) || [])[1] || '';

  if (!/@keyframesmarquee\{/.test(flat))      fail('no @keyframes marquee');
  else if (!/translateX\(-50%\)/.test(flat))  fail('keyframes do not translate by -50%');
  else ok('keyframes translate the track by exactly -50%');

  if (!/animation:marquee/.test(track))       fail('.marquee-track has no marquee animation');
  else ok('.marquee-track runs the animation');

  if (/(^|;)gap:/.test(track))                fail('.marquee-track uses flex gap — breaks the seamless loop (see note)');
  else ok('.marquee-track sets no flex gap');

  if (!/margin-right:/.test(chip))            fail('.marquee-track .chip has no margin-right — nothing spaces the chips');
  else ok('chips spaced by margin-right');

  if (!/\.mq-copy\{display:contents\}/.test(flat)) fail('.mq-copy is not display:contents — chips would not be flex items of the track');
  else ok('.mq-copy is display:contents');

  const html = fs.readFileSync('index.html', 'utf8');
  const copies = (html.match(/class="mq-copy/g) || []).length;
  if (copies !== 2) fail(`index.html has ${copies} marquee copies, needs exactly 2`);
  else ok('index.html renders exactly 2 copies of the list');
  if (!/mq-copy" aria-hidden="true"/.test(html)) fail('the duplicate copy is not aria-hidden — the list would be announced twice');
  else ok('the duplicate copy is aria-hidden');
}

console.log(`\n${fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED'}\n`);
process.exit(fails ? 1 : 0);
