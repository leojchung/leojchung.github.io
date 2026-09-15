# CLAUDE.md — leojchung.github.io

Context for Claude Code working in this repo. Read this before touching anything.

## What this is

Leo J. Chung's personal website. Static HTML, no framework, no npm dependencies,
served free from GitHub Pages at the repo root.

## The one rule that matters

**`index.html`, `cv.html` and `cv.pdf` are GENERATED. Never edit them by hand.**

```
content.js  --[ node build.js ]-->     index.html
content.js  --[ node build-cv.js ]-->  cv.html --[ print to PDF ]--> cv.pdf
```

All content — every word, date, link and section on the site — lives in
`content.js`. Editing the generated HTML directly works right up until the next
build silently erases it. `.github/workflows/check-build.yml` fails the push if
the committed `index.html` doesn't match what `build.js` produces, which is the
safety net for exactly this mistake.

**After any change to `content.js`, run `node build.js` before committing.**

## Layout

| File | Role |
|---|---|
| `content.js` | All content + the `sections` array controlling order and visibility |
| `styles.css` | Design system. Colour tokens at the top; nothing else hard-codes a colour |
| `build.js` | content.js → index.html. `RENDERERS` maps a section key to a renderer |
| `build-cv.js` | content.js → cv.html. `CV_EXTRA` holds CV-only sections |
| `main.js` | Light/dark toggle and the footer year. The only JS the site ships |
| `404.html` | Not-found page |
| `assets/` | Photos, syllabus PDFs, anything linked from content |

## Conventions

- **US spelling** throughout (behavioral, remodeling, analyzing). One convention,
  held consistently. Do not mix.
- **Three theme blocks in `styles.css`**, and they must agree: bare `:root`
  (light), `@media (prefers-color-scheme: dark)` guarded with
  `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`. A visitor's
  theme has three states, not two — the un-stamped "system" default is the one
  people forget. Change a dark token in one block, change it in both.
- **Colour roles are fixed.** Purple `--accent` carries structure. Maroon
  `--flag` means one thing only: a currently-held post. Gold appears on the ◆
  status diamond and the identity rule, nowhere else. Do not spend these
  elsewhere for decoration.
- **Contrast is checked, not eyeballed.** Every colour meets WCAG AA in both
  themes including the 10–11px monospaced labels. If you change a token, verify
  the ratio rather than assuming.
- Sentences in prose run roughly 20–25 words; em-dashes rather than semicolons.
  There is a fuller voice profile at
  `~/Downloads/ClaudeCoworkProjects/00_Resources/voice-principles.md` — read it
  before writing any prose in Leo's name.

## Common tasks

```bash
node build.js          # rebuild index.html after editing content.js
node build-cv.js       # rebuild cv.html; then print to PDF over cv.pdf
python3 -m http.server 8000   # local preview at http://localhost:8000
```

- **Add a role** → copy the nearest entry in the right `content.js` block.
- **Hide something** → `hidden: true` on that entry. Don't delete.
- **Reorder / disable a section** → the `sections` array at the bottom of
  `content.js`. `§` numbers and the nav rebuild themselves.
- **New section type** → add the data block to `content.js`, add one line to
  `RENDERERS` in `build.js`, add its line to `sections`.
- **Reskin** → only the token blocks at the top of `styles.css`.

The `notes` section is built but `on: false` — placeholder entries, off until
Leo has real writing for it.

The `fun` section ("Off the clock") is ON and currently holds placeholder
tiles. **It must be filled in or switched off before the site goes public** —
tiles reading "add a YouTube id" on a live page look broken.

### Rules for the fun section

- Items have `kind: "photo" | "video" | "link"`.
- **Never download a game highlight or music video into `assets/`.** That
  republishes someone else's copyrighted work from Leo's own domain under his
  real name. Clips are `kind: "video"` with a YouTube or Vimeo id, which plays
  from the rightsholder's own upload. Photos in `assets/` must be Leo's own.
- Videos are click-to-play by design: the tile is a `<button>` and `main.js`
  swaps in the iframe on click, so nothing is requested from YouTube for a
  visitor who only scrolls past. Do not "simplify" this into a plain iframe.

### Rules for the contact form

- GitHub Pages has no backend, so the form POSTs to a third-party endpoint set
  in `contact.form.action` (Formspree by default).
- With `action` empty it renders a mailto: fallback instead. **Keep that
  fallback.** A form that silently fails is worse than no form.
- `#f-gotcha` is a honeypot — hidden, `aria-hidden`, out of the tab order.
  Leave it alone; it is most of the spam defence.

## Git

- Small, single-purpose commits. Present tense, no scope prefixes:
  `Add Moss Lab role`, not `feat(content): add role`.
- Always `node build.js` before committing a `content.js` change, and include
  the regenerated `index.html` in the same commit.
- `main` is the deploy branch — GitHub Pages serves it directly.

## Things to check with Leo before doing

- **Anything that makes the site or repo public.** The repo is private on
  purpose. Flipping visibility, enabling Pages on a public repo, or adding a
  custom domain are his calls, not yours.
- **Changing the Si-Lab description** (entry `T-02`). It draws on an unsubmitted
  manuscript; Dr. Skoretz needs to be comfortable with the public wording.
- **The STEMCELL and Moss Lab descriptions.** Both are deliberately vague about
  the work because the co-op and lab agreements may constrain what can be said.
  Do not enrich them from other sources without asking.
- **Adding claims about the Neuroaesthetics seminar.** It was *co*-created with
  Betty Bao under faculty sponsor Dr. Steven Barnes, and ran Winter Term 2
  (Jan–Apr 2026), course code `ASTU_V 400E-001`. Do not upgrade this to a solo
  credit — official UBC sources name both coordinators.
