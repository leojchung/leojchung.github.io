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
  mail:   '<path d="M3 7.6c0-1.2 1-2.2 2.2-2.2h13.6c1.2 0 2.2 1 2.2 2.2v.5l-9 5.3-9-5.3V7.6Z"/><path d="M3 10.4l8.5 5c.3.2.7.2 1 0l8.5-5v6c0 1.2-1 2.2-2.2 2.2H5.2C4 18.6 3 17.6 3 16.4v-6Z"/>'
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

/* ── the map in the "Based in" card ────────────────────────────────────────
   Vancouver, traced from real OpenStreetMap data — not map tiles. The water
   shapes (the sea from OSM's coastline, plus rivers and lakes) were pulled
   once from OpenStreetMap's vector tiles in September 2026, projected to Web
   Mercator and simplified into the single path below. The site makes no
   map request at all: the geometry is baked in, like the old hand drawing,
   but it is accurate.

   The frame is set by three edges, at Leo's request:
     north  49.293   the downtown waterfront
     south  49.112   the south edge of Richmond
     west  -123.268  the tip of Point Grey, past UBC
   East is whatever those three leave. The viewBox is 1400 x 400 — wider than
   any card the map sits in — and `xMinYMid slice` pins the left edge while
   the height fills the card, so north, south and west never move and a
   narrower card simply shows less of the east (at desktop width, roughly to
   the Pitt River).

   The land is the rectangle behind the water, filled --map-land (the violet
   accent). The one literal is #fff on the marker, which sits on that violet
   in both themes. OpenStreetMap data is ODbL, which requires the credit
   rendered under the map (.map-credit) — keep it.

   To regenerate: fetch shortbread_v1 tiles at z12 covering the frame, take
   the `ocean` and `water_polygons` layers, clip to the frame, simplify at
   ~0.8 units and drop rings under ~40 square units.
   ────────────────────────────────────────────────────────────────────────── */
const MAP_VANCOUVER = `<svg viewBox="0 0 1400 400" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
            <rect class="land" width="1400" height="400"/>
            <path class="water" d="M-3-3l68 0l0 36l-3 0l-3-2l-10-2l-2 2l-9-2l-8 1l-22 19l-2 7l-9 0zM41 183l24-8l0 8zM-3 56l9 0l-1 6l3 4l-1 8l2-2l3 0l5 10l3 3l2 8l8 6l12 6l23 18l0 27l-7-4l-9-8l-2 1l7 7l4 2l7 6l0 20l-27 9l-41 0zM65 183l0 127l-68 0l0-127l41 0l-32 10l1 2l-1-1l35-11zM-3 403l0-93l68 0l0 77l-4 1l-4 3l-2 7l3 5zM170-3l1 4l4 6l3 1l2 2l-1 9l2 2l2 6l1 0l2 4l1 1l1 2l2 1l0 4l2 0l0 5l-3 1l0 6l-4-4l0-4l2-2l-3-6l-5-4l-4 2l-1-1l0-1l-3 3l-4 0l-4 9l-6 0l-2-2l-4 1l-5 3l-7 2l-23-4l-10 2l-3-1l1-2l-3-1l-1-3l0 1l-2 0l-3-3l-10 3l-6-4l-3 1l-2-2l-3 1l-4-3l-2 1l0-36zM65 150l0-27l12 10l0 3l-2 1l3 5l-5-1l-1 3l-5 0l2 1zM65 175l14-5l3-1l6 0l2 1l0 2l3 0l-1 3l2 7l-1 1l-28 0zM65 154l11 6l1 11l-12 3zM69 145l32 13l12 2l4 5l11 1l-1 1l3 2l11 1l5 2l11 5l6 6l-7 0l-6-5l-8-3l-1 0l1 1l-1 2l-1-3l-4 1l-2-1l-6 4l-7 2l-15 1l-6 1l-2-1l-2 0l0-3l2-5l-1-1l11 3l14-1l6 1l1-2l-9-3l-11-6l-25-7l-17-7l-2-1zM93 183l-4 12l-3 4l-1 4l-4 3l2 1l0 3l-2 9l-5 5l-7 1l13 3l0 5l2 2l6 26l0 8l5 9l0 21l3 9l-1 2l-32 0l0-127zM155 182l8 1l3 3l3 6l2 1l0-1l13 9l-1 2l-8-6l-1 1l-1-2l0 1l4 3l6 4l8 2l1-1l1 20l-11 22l-3 4l-11 8l-10 4l-14-1l-5 1l-4-1l-11 1l-20-4l-14 2l-6-26l20 3l5 2l0 2l17 11l8-1l2 2l8 2l20-2l8-3l7-7l2-4l-1-5l2-2l10-23l-11-4l-7-4zM90 242l-2 1l3 4l15 5l9 5l7 0l-3-4l-18-10zM65 387l0-77l32 0l2 13l0 11l-1 4l1 8l-2 6l-3-2l-3 0l0 2l-1 1l-5 1l0 3l3 5l8 3l-1 2l10 0l-8 1l16 35l-32 0l7-4l2-3l-9-6l-14-3zM90 400l-5 3l16 0l-1-2l-3-2l-5-1zM77 351l-1 1l3 2l0 2l-3 3l-5 0l16 5l10 6l-3-2l0-3l-7-3l-6-9zM98 371l3 0l1 2l3-2l1 2l2-2l2 2l6-1l16 5l3-1l0 1l-1 0l1 1l9 3l4 2l0 2l4 2l2-5l2 2l-2 4l2 2l1-1l16 11l9 3l-69 0zM109 374l24 13l4 0l4 2l5 4l14 3l-2-3l-10-4l-3-2l-9-1l-8-5l-4 0zM319-3l0 1l-3 1l-1-1l-2 0l-9 5l-5 4l-2 4l-2 0l-1 3l-1-1l-2-1l-1 0l0 2l-2 0l0-7l-2 0l0 4l-11-4l0 5l-3 1l0 4l-1-4l-1 0l-2 2l-1 5l-1 0l-1-5l-3-1l0-3l-7-3l-1 3l-13-5l-1 4l7 3l1 3l-2 1l-2-4l-1 3l-4 1l-1-2l-9 0l-1-3l-2 2l-5-4l1-2l-5-3l-3 2l-5-4l-2 2l-2 0l-3-3l1-2l-3-1l-2 1l-4-3l15 1l1-1zM192 40l6 5l1 3l1-1l4 2l1 1l2-3l3 2l3 0l1-4l2-1l4 1l8-4l2 1l0-4l8 1l1 7l-7 0l0 1l-3-1l-8 2l-5 4l-1 4l-3 0l-1-2l-3 1l0 1l-7-1l-5 1l-3-2l1-1l4 1l0-2l-5-7zM278 186l7 2l11 5l24 1l0 7l-17-2l-14 0l-2 3l-6 0l-19 9l-6 2l-22-4l-12-5l-9 1l-12 8l-2-1l-5 2l-1 4l-1 8l0-22l0 2l6 0l25-12l16 1l7-1l3 0zM279 188l-15 4l-12 5l-9 1l-20-2l-6 3l7 1l14 5l13 1l4-1l1 2l8-3l1-3l24-6l-1-2l-6-4zM320 351l0 6l-4 5l-6 4l-9 1l-10 9l-12 8l-9 7l7 1l6-1l7 2l-1-3l4-1l2-2l12-19l4 0l-8 16l-9 10l-3 0l-1 0l1 1l-6 1l-11 0l0 1l-3-2l-3 2l-4 6l-58 0l7-1l36-19l8-4l-1 3l6-2l1-3l-2-5l3-2l2 3l-1 3l1 1l10-4l-1-2l2 2l7-7l6-9l6-4l15-21l7-7l2 0l0 24l-5 7l0 1l2 0zM263 394l-24 7l-1 2l19 0l3-4l0-4zM446-3l0 14l-5 2l-11-3l0-2l-4-2l-3 0l-9-5l-5-4l-9 0l-14 9l-8-1l-5-4l-15-2l-8 0l-9 6l-3 0l0 1l-7-2l-2-2l-5 0l-5-4l0-1zM432 121l4 5l0 3l-5 2l-12-4l0-2l1-3zM447 296l0 12l-19-3l-13 2l-6 3l-50 0l17-5l6-3l6-9l6-3l41-16l4-3l4-8l4-3l0 5l-8 14l-20 7l-8 6l-3 3l1 1l11-3l7 0zM442 228l5-5l0 7l-8 6l-6 9l12-10l1 1l-7 7l-8 6l-14 3l-8-4l-14-9l-19-18l-19-10l-11-2l-17-8l-9-2l-1 2l0-7l9 0l12 6l12 2l9 6l22 10l13 16l18 13l8 1l5-3zM319 350l0-25l11-6l31-10l51 0l-16 5l-6 4l-1-1l-6 5l-14 0l0-4l2 0l-3-1l-1 1l1 1l0 2l-5-1l-23 8l0 1l-7 4l-2 4l-1 0l-11 22l0-6l1-2l1 1l0-1l-1-2zM502-3l4 3l5-2l6 1l2-2l54 0l0 7l-6-2l-12 1l-2 1l-13-2l-5 6l-9 3l-9-2l-4-3l-9 3l-9-8l0 1l-2 0l-6 1l-3-1l-8 0l-12 4l-9 0l-9 5l0-14zM446 95l1 1l0-2l1 4l4 3l2 1l0 1l1 0l0 2l1-1l0 1l3 2l7 0l1 2l2-1l1 2l1-1l0 1l2-1l0 2l1 1l1-2l0 2l1 0l0-2l0 2l4-1l0 1l1-2l1 2l2 0l1-2l2 1l0-1l1 0l3-1l-1-2l2 1l4-4l11-4l-15 9l-2 3l2 0l0 2l-1-1l-1 1l-1-1l-1 0l-1-1l-2 1l-1 1l2 2l0 2l-2 1l-3-1l-1 2l-2-1l0-2l-2 0l0-1l-1 2l0-2l-1-1l-2 3l1-2l-1-1l-2 3l1-3l-2 1l0-2l-2 0l1-1l-9-3l-5 1l1 1l0 1l4 3l0 1l-4-2l-6-4l-1 0l3-4l-5-2l0-7l1 4l1-2zM574 158l0 13l-13 5l-10 7l-15 0l5-10l2-13l1 2l5-6l13-5l1-3l1 2l10-1l0 8l-5 0l-2 2zM446 266l0-5l28-17l9-9l9-6l8-10l1-4l16 10l-2 2l-6 16l-2 1l-8 25l-2 3l8-9l3-8l1 0l0 3l-3 7l-7 8l-3 1l-4 5l-9 8l-9 10l-4 2l0 3l-2 1l-2 3l-10 4l-10-2l0-13l6 1l7-1l4-1l4-4l1 1l4-5l11-10l5-8l3-11l1-2l1 0l6-18l7-16l-1-1l-1-1l-1 1l-12 14l-6 4l-2 3l-1 2l4 0l1 2l-5 1l-11 8l-11 6l-5 1l0 1l-1 2l-1-3l-2 0zM446 231l0-8l30-19l7-1l3 0l3 1l1 2l5 3l8 1l-2 5l-7-2l-6 1l-19-2l-12 9l-4 5l-3 1l-1 5l-2-2zM481 205l-6 2l-1 2l11 1l5 0l-4-4zM522 201l9-10l6-9l15 0l-8 8l-2 5l-7 8l-11 7l4 0l3-3l0 1l-5 8l-3 1l-6 8l-16-10l2-5l8 0zM618 17l-4-2l0-1l4 1l0 1l1-1l0 2l0-3l5 3l1 2l-2 3l1 1l0 3l-4-3l-10 6l-3-1l-3-3l-3 4l1-1l-2-1l-1-2l-1 3l-1-2l-5 0l0 5l-2 0l-4-5l4-3l-12-14l-5-5l0-7l17 0l4 1l6 6l13 6l2 4l-2 0l1 1zM573 157l0-8l2 0l28 3l18 4l2 1l1-1l6 1l2 1l0-1l3 1l8-1l16-6l42-6l0 8l-13 11l0 1l13 3l0 10l-17-3l-32-8l-11-1l-13 1l-12 2l-24 0l-19 2l0-13l1-1zM698 66l-3 2l-6 3l-7 1l-2 2l-1 14l4 10l-1 1l-3-1l-1 5l-6 1l1 6l-7 5l0 7l1 2l4 1l3 0l0-1l2 3l-1 6l-7 11l-1 2l2 3l-2 1l-1-8l5-4l5-11l-1-1l-6 0l-3-2l-1-2l1-8l7-4l-2-4l1-2l6-2l1-4l3 0l-4-10l2-14l2-3l7-1l5-2l6-6zM805 38l0-3l2-4l1-4l19 8l-8 7l-9 14l-13 0l7-14l-2-1l2 0zM715 14l2-2l-2-5l1-5l-4-5l2 1l2 4l0 5l2 6l-8 12l0 18l-7 13l4-11l2-2l0-19l6-9l2-2zM827 17l-3 1l-4 4l-3 7l2 0l8-5l0 11l-19-8l7-8l5-4l7-3zM798 55l13 0l-10 26l-6 6l-2 4l-3-4l-5-1l-1-1l3-2l1-7l2-1l2-9zM785 86l5 1l3 4l-1-1l-3 2l0 2l-2 0l-7 6l-4 8l-7 5l3 0l-1 2l-1-1l-3 1l-31 17l-5 8l1 7l-16-9l7-6l-1-1l1 0l3-3l4-2l15-12l13-8l11-3l4-5l2 0zM764 170l18 8l22 5l-39 0l-6-3zM700 153l0-8l11-2l2-2l3-3l16 9l5 8l7 9l5 2l15 4l-5 10l-6-2l-11-2l-23 4l-19-3l0-9l16 4l13-3l5-4l-5-10l-6-6l-2-1l-11 0zM787 225l5 8l9 5l11 2l15-2l0 6l-22 1l-6-2l-12-7l-3-6l-2-7l-2-18l-3-11l-4-6l-10-6l39 0l25 13l0 11l-27-17l-20-3l4 12zM933 35l0 12l-6 1l-4-3l1-5l5-2l1-3l3 0zM832 15l-6 3l0-6l12-4l16-3l22-8l7 0l0 2l2 0l-1 0l-4 5l-10 7l-5 1l-3 2l-8 1l-1-1l-14 8l-7 5l-5 8l-1-10l11-11l-4 1l-7 9l0-2l3-2zM870 55l-5 5l-6-5l-3 1l-2 6l-8 6l-3 0l-4-4l-13-2l0-1l15 2l1 0l2 3l2 0l6-5l3-6l8 0l3 2zM911 105l-1 4l1-9l-4 1l-1-2l-3 1l-6-4l-3-6l1-7l0-3l-10-3l-5-8l-3-1l-3 0l0-1l6 1l6 9l9 2l1 3l0 8l2 5l6 4l2 0l2 1l3 0l1 10l3 3l2 3l4-1l2 1l3-1l6 0l2-1l5 2l3-1l5 0l7 10l-7-10l-5 0l-3 2l-5-3l-2 2l-5-1l-4 1l-3-1l-3 1l-5-5zM941 177l13 2l0 4l-36 0l17-5zM834 237l9-3l14-10l2-3l-7-3l-3-3l-23-9l0-12l17 9l10 3l14 0l15-5l39-19l33 0l0 6l-4-1l-14 1l-11 2l-10 5l-17 10l-12 10l-39 24l-21 6l0-7zM1042 279l-4-2l-9 0l-26-5l-16-13l-7-10l-2-26l-4-15l-10-13l-11-8l0-5l11 0l18 18l8 13l6 13l8 11l14 6l31 16l32 10l0 17l-8 2l-9-1zM981 232l0 7l3 12l4 6l12 10l9 3l30 5l-1-6l-1 0l-9-11l-28-12l-9-6zM1150-3l-9 6l-11 11l-4-1l-1 1l-1-9l1-6l2-2zM1177 183l-2-1l0-7l5-6l6 1l7 10l0 2l-2 0l-1 1zM1208 284l0 5l-34-12l-29 0l-19 4l-46 5l0-17l9 2l25 0l11-1l16-3l12 0l26-3l23 2l6 1l0 12l-9-4l-14-3l-11 0l-8 1l31 6zM1305 51l2-7l6-5l3 0l1 3l-5 14l-6 0zM1333 34l2-1l0 23l-4 0l2-6l0-8l-1-3zM1334 35l1 0l0 21l-4 0l2-3l0-11l-1-3l1-4zM1316 152l1 2l2-1l0-10l1 0l0 5l1-2l1 1l0 10l-5 5l3 3l-9 11l-2 3l-4 0l-1 3l-10 1l2-3l0-2l4-2l1-4l1 1l1-1l1-3l3-1l2-5l5-3l1-8l-2-2l3-7l-2 6l0 1zM1278 99l3 1l-1 1l-8 9l-8 2l2-5zM1308 121l-3-8l1-7l-3-4l2-3l-1 0l0-6l4-13l5-5l2 0l1 2l3-1l3-8l5-5l5-8l3 0l0 34l-3 5l-2 13l-9 9l-2 11l1 4l-3 2l-1 3l2 3l-2 2l-1-2zM1332 55l3 0l0 34l-3 5l-2 13l-9 9l-2 11l1 4l-3 2l-1 3l2 2l-2 3l-2-2l-4-14l-2-2l1-2l-2 0l-2-8l2-5l-3-5l3-3l0-1l-3 0l2-1l-1-8l3-8l4-3l-3-1l5-2l2 2l3-2l1-6l7-7zM1253 201l5 2l1-2l-2-2l2 1l5-2l-1-1l2 1l3-2l1-3l2-2l0-3l3 3l5-5l5 1l6-3l2 1l3-3l9 0l-10 7l-6 3l-2-1l-1 5l-4 3l1 3l-2 4l1 1l-1 0l-1 2l-1-1l-1 2l1 1l-1 1l1 2l-2-2l-1 4l-5 2l-3-1l-1-4l-2 1l-4-2l-2 4l-3 0l4 2l1 6l2 1l1 2l-5-2l-1-4l-4-2l-3-6l-3 2l-2-1l-1 2l-2-3l1-3l6-1l2-6zM1251 237l-1 1l0-1l-9-1l-11 8l-5 15l7 7l0 1l-4 0l-7 0l10 6l-9-5l-5-1l2-4l0-5l1 0l-2-1l2 0l-2-1l2-2l-2-1l-1-5l1 3l3-2l1-5l-1-1l-1-5l2-2l9-4l2-3l2 1l0-7l1-4l6-4l-1 6l8 6l2 4zM1241 239l7 0l0 6l1-1l1-5l2 1l1 2l-2 1l1 3l-3 0l0 3l3 0l-4 5l0 10l-2 1l0 8l-2-2l-4 7l1 1l2-2l-2 3l-9-8l0-8l6-12l-1-7l-1-2l3-4zM1235 223l1-4l0 7l1-6l5-5l-2 5l3 3l-2-2l0-3l-1 1l1 4l2 1l-2 12l9 0l0-5l-3-6l-4-2l3 1l4 4l-2-2l-1 1l4 4l-2 3l1 2l-9 0l-10 7l-4 10l-4 13l-3 2l-3-1l3-3l-1-2l1-4l-2-1l2 0l-2-1l4-12l-1-1l3-5l4-4l6-2zM1207 278l0-11l13 1l9 8l18 23l11 11l-12 0l-17-12l-22-10l0-4l9 4l10 2l-1-4zM1335 401l0 2l-6 0l-34-31l-20-16l-11-16l-3-9l-6-11l-10-11l12 0l8 9l11 18l6 6l6 4l25 8l3 0l19 6l0 11l-15-8l-13-1l-7-3l-15-4l24 22l14 16zM1384 28l-7-1l-13 4l-5 0l3-3l5 0l10-2l10 1l4-2l-1 2zM1403-3l0 11l-7-7l-2-4l-24 0l2 5l-1 6l-2 1l-1 3l-1-2l-3 11l-2 4l7-6l2 1l-1 3l-4 2l2-1l1 1l-6 2l-4 4l-8 0l-2 2l-1 6l2 8l-1 7l-1 2l-14 0l0-23l3 0l2-1l-2-1l1-1l2 0l-3-1l3-2l-3-2l2 0l-2-5l1-1l2 0l11-4l1-2l4-4l2-7l-2-1l2 0l0-4zM1403-3l0 7l0-1l-3-1l-4-5l-26 0l1 5l-1 6l-3 3l-5 13l0 2l6-5l2 1l-2-1l-4 4l-4 3l-1 3l-8 0l-2 2l-1 6l2 8l-1 7l-1 2l-14 0l0-21l3 1l4-4l-2-1l2 0l1-3l-1 0l1-1l-2-6l2 1l6-4l1 1l1-2l3 0l-1-4l2 1l4-4l0-3l3-5l-1-5zM1382 88l-1 0l-1-4l-2-9l0-14l4-2l3 1l1 7l-2 8l0 6l-2 3zM1355 68l5 2l-1 2l2 3l-1 3l-3-1l1-1l-1-2l-1 2l-2-2l0-4zM1334 91l0-36l14 0l-10 20l-1 7zM1334 91l0-36l14 0l-10 20l-1 7zM1334 371l0-11l15 3l11 9l5 3l9 0l14-6l15-11l0 13l-10 9l-5 6l-24 17l-30 0l0-2l6 1l11-4l14-10l-9-6z"/>
            <circle class="marker-halo" cx="212.7" cy="22.8" r="19"/>
            <circle class="marker" cx="212.7" cy="22.8" r="9"/>
          </svg>`;


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
  const identityChips = [].concat(h.identity || []);

  /* The UBC badge: the official logo file once Leo supplies one (see the
     note on `credential` in content.js), otherwise the letters in a disc.
     A logo path that is not on disk falls back to the letters, so a typo
     cannot ship a broken image. */
  const cr = h.credential;
  const crLogo = !!(cr && cr.logo && fs.existsSync(path.join(__dirname, cr.logo)));
  if (cr && cr.logo && !crLogo) console.warn(`  ! credential.logo "${cr.logo}" not found, using the letters`);
  const credential = cr
    ? `\n            <p class="credential">${crLogo
        ? `<img class="uni-logo" src="${attr(cr.logo)}" alt="University of British Columbia">`
        : `<span class="uni-mark">${attr(cr.mark)}</span>`}<span>${cr.detail}</span></p>`
    : '';

  const portrait = C.meta.portrait
    ? `\n          <img class="hero-portrait" src="${attr(C.meta.portrait)}" alt="${attr(C.meta.name)}" width="230" height="230">`
    : '';

  const cardA = card('sp-7 rows-2 hero-card', `          <div>
            <p class="hero-name">${attr(C.meta.name)}</p>
            <h1 class="display">${h.headline}</h1>
${h.cite ? `            <p class="hero-cite">— <cite>${h.cite}</cite></p>\n` : ''}${h.card ? `            <p class="body">${h.card}</p>\n` : ''}${chips(identityChips)}${credential}
            <div class="pill-row">
${(h.buttons || []).map(b => `              <a class="pill ${b.solid ? 'blue' : 'ghost'}" href="${attr(b.href)}">${b.label}</a>`).join('\n')}
            </div>
          </div>${portrait}`);

  /* B — based in, over the map. */
  const cardB = card('sp-5 flush', `          <div>
            <p class="label">Based in</p>
            <p class="value">${attr(i.location ? plain(i.location).replace(/^📍\s*/, '') : C.meta.location)}</p>
          </div>
          <div class="map">
            ${MAP_VANCOUVER}
            <a class="map-credit" href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a>
          </div>`);

  /* C — what drives him, over a faux notebook panel built from the record
         rows. Real content, so the mockup is not decorative filler. */
  // attr() over plain(): plain() decodes &amp; back to a bare &, which is
  // invalid in the document. Re-escaping puts it back.
  const panelRows = (h.record || []).slice(0, 5).map(r =>
    `              <div><span class="k">${attr(plain(r.k).toLowerCase())}:</span> <span class="v">${attr(plain(r.v))}</span></div>`
  ).join('\n');

  const cardC = card('sp-5 flush', `          <div>
            <p class="label caps">What drives me</p>
            <p class="value">${i.focus || C.meta.tagline}</p>
          </div>
          <div class="panel" aria-hidden="true">
            <div class="panel-bar"><i></i><i></i><i></i></div>
            <div class="panel-body">
${panelRows}
            </div>
          </div>`);

  /* D — about. */
  const cardD = card('sp-7 rows-2', `          <span class="eyebrow">About</span>
          <h2 class="display-sm">${i.greeting || 'Hi'}</h2>
          <p class="body">${h.standfirst}</p>
${(i.paragraphs || []).map(p => `          <p class="body">${p}</p>`).join('\n')}
${(i.social && i.social.length) ? `          <div class="social-row">
${i.social.map(s => `            <a class="social-btn" href="${attr(s.href)}" aria-label="${attr(s.label)}">${socialMark(s)}<span class="tip">${attr(s.label)}</span></a>`).join('\n')}
          </div>` : ''}`);

  /* E — the rotating interest. main.js cycles .like-word through data-list.
         Half-height, with the weather card stacked under it: card D beside
         them spans both rows. */
  const likes = i.likes || [];
  const cardE = likes.length
    ? card('sp-5 like-card center', `          <p class="like-lead">I also like…</p>
          <span class="like-word" data-list="${attr(likes.join('|'))}">${attr(likes[0])}</span>`)
    : '';

  /* W — live Vancouver weather and local time. Everything after the labels
         is filled in by main.js: the clock needs no network; the current
         conditions and the seven-hour strip (three hours either side of now)
         come from one Open-Meteo request. With JavaScript off, or if the
         request fails, each value keeps its em dash and the strip stays
         empty, rather than promising an update that never arrives. */
  const w = i.weather;
  const cardW = w
    ? card('sp-5 wx', `          <div class="wx-top">
            <div>
              <p class="label">${w.label || 'Weather'}</p>
              <p class="value"><span class="wx-icon" aria-hidden="true"></span><span id="wx-temp">—</span></p>
              <p class="wx-cond" id="wx-cond" data-lat="${attr(w.lat)}" data-lon="${attr(w.lon)}"></p>
            </div>
            <div class="wx-time">
              <p class="label">Local time</p>
              <p class="value" id="wx-clock">—</p>
              <p class="wx-cond" id="wx-date"></p>
            </div>
          </div>
          <ol class="wx-hours" id="wx-hours" aria-label="Hourly forecast, three hours either side of now"></ol>`)
    : '';

  /* F — the record. */
  const cardF = card('sp-5', `          <span class="eyebrow">The record</span>
          <ul class="record">
${(h.record || []).map(r => `            <li><span class="k">${r.k}</span><span class="v">${r.flag ? '<span class="live-dot">●</span>' : ''}${r.v}</span></li>`).join('\n')}
          </ul>`);

  /* G — training. The chip row is a marquee: one track holding the skill
         list twice, translated by exactly half its width, which lands copy
         two where copy one started and so loops without a seam. The second
         copy is aria-hidden so the list is announced once, and CSS pauses
         it on hover and disables it outright under prefers-reduced-motion. */
  const sk = C.skills || {};
  const skillChips = (sk.groups || []).reduce((acc, g) => acc.concat((g.items || []).map(x => x.t)), []);
  const run = skillChips.map(t => `<span class="chip">${t}</span>`).join('');
  const cardG = sk.headline
    ? card('sp-7', `          <div class="marquee">
            <div class="marquee-track">
              <span class="mq-copy">${run}</span>
              <span class="mq-copy" aria-hidden="true">${run}</span>
            </div>
          </div>
          <p class="label caps">${sk.label || 'Trained in'}</p>
          <h2 class="display-sm">${sk.headline}</h2>${(sk.areas && sk.areas.length) ? `
          <ul class="trained">
${sk.areas.map(a => `            <li><span class="t">${a.t}</span><span class="d">${a.d}</span></li>`).join('\n')}
          </ul>` : ''}`)
    : '';

  return `    <section class="reveal" aria-label="Introduction">
      <div class="bento">
${[cardA, cardB, cardC, cardD, cardE, cardW, cardF, cardG].filter(Boolean).join('\n')}
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
