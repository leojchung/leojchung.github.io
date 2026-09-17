# leojchung.github.io

Personal website for Leo J. Chung — neuroscience, teaching, and the things
that don't fit on a CV.

**Live at <https://leojchung.github.io/>.** Static HTML, no framework, no
dependencies, served from this repo's root by GitHub Pages. There is no
`npm install` step anywhere; you need Node only to regenerate the pages.

---

## The thirty-second version

```bash
node build.js && node check.js
git add -A && git commit -m "Update the Moss Lab entry" && git push
```

Edit `content.js`, run those two commands, push. Pages redeploys within a
minute. That is the whole workflow.

---

## How it fits together

Every word on the site lives in `content.js`. Two scripts turn it into
everything that gets served:

```
content.js ──[ node build.js ]───▶ index.html, projects.html,
                                   contact.html, ask.html, sitemap.xml

content.js ──[ node build-cv.js ]─▶ cv.html ──[ print to PDF ]──▶ cv.pdf
```

| File | What it is | Edit it? |
|---|---|---|
| `content.js` | Every word, date and link on the site | **Yes — this is the one** |
| `styles.css` | The whole design system. Colours are tokens at the top | To reskin |
| `build.js` | Turns `content.js` into the four live pages and the sitemap | Only for new section *types* |
| `build-cv.js` | Turns the same `content.js` into a print-ready `cv.html` | Only for CV-only sections |
| `check.js` | Audits the build — markup, escaping, WCAG contrast both themes | Rarely |
| `main.js` | Theme toggle, footer year, click-to-play video, the Ask page | Rarely |
| `index.html` and the other three pages | **Generated.** `node build.js` overwrites them | **No** |
| `cv.html` | **Generated.** Open it, Cmd-P, Save as PDF over `cv.pdf` | **No** |
| `cv.pdf` | **Generated** from `cv.html` | **No** |
| `sitemap.xml` | **Generated** from the `pages` array | **No** |
| `assets/` | Photos, logos, syllabus PDFs — anything linked from content | Yes |
| `404.html` | The not-found page Pages serves | For different wording |
| `favicon.svg` | The tab icon | For a different mark |
| `robots.txt`, `.nojekyll` | Tell crawlers and Pages how to behave | No |
| `CLAUDE.md` | House rules and constraints for AI coding sessions | As they change |

### Why the HTML is generated *and* committed

Two things are usually in tension: keeping content in one editable place, and
serving plain static HTML that loads instantly and that Google can read
without running JavaScript. Generating at author time and committing the
result gets both. The site does not depend on Node — that is only an
authoring convenience. If `build.js` were never run again, the site would
keep working exactly as it is.

---

## Common edits

**Add a role.** Find the right block in `content.js` — `experience`,
`teaching`, `research`, `service` — copy the nearest entry and change the
fields. Order in the file is order on the page.

**Hide something without deleting it.** Add `hidden: true` to that entry.

**Reorder or drop a whole section.** Each page's `sections` array in `pages`,
at the bottom of `content.js`. The dock and `sitemap.xml` both rebuild
themselves from it.

**Rename a section.** Change its `title`, and `eyebrow` — the small label
above it. The dock uses each page's `navLabel`.

**Change the colours.** `styles.css`, the `:root` block at the top, then the
two dark-theme blocks under it. Every colour reads from those tokens. Do not
hard-code a colour anywhere else — you will fix one theme and break the other.

**Swap a logo.** Drop a transparent PNG in `assets/` and point at it: a social
entry takes `src: "assets/whatever.png"`, `hero.credential` takes `logo:`, and
a Right Now entry takes `logo:`. A missing file logs a warning at build time
and falls back to the drawn mark, so a typo can't ship a broken image.

**The Fun page is shelved,** switched off (not deleted) at Leo's request
until he has time to fill it in for real. See CLAUDE.md's "The Fun page
(shelved)" section for exactly where it lives and how to turn it back on.

**Update the CV.** Edit `content.js`, then:

```bash
node build-cv.js      # writes cv.html
```

Open `cv.html`, Cmd-P, Save as PDF over `cv.pdf`. Turn **off** "Headers and
footers" in the print dialog or the browser stamps a URL and date on every
page. For sections a CV wants and a website doesn't — awards, coursework,
references — there is a `CV_EXTRA` block at the bottom of `build-cv.js` with
worked examples.

---

## Local preview

```bash
python -m http.server 8000      # python3 on macOS
```

Then <http://localhost:8000>. Opening `index.html` from disk mostly works too,
but a server is closer to how Pages actually serves it.

---

## Before you push

```bash
node build.js && node check.js
```

`check.js` verifies tag balance, unescaped ampersands, that every class the
HTML uses exists in the CSS, WCAG AA contrast for every pairing in **both**
themes, and that the two dark-theme blocks agree with each other.

`.github/workflows/check-build.yml` runs exactly those two commands on every
push and fails if the committed HTML doesn't match what `build.js` produces.
It catches one specific mistake: hand-editing a generated page, whose edits
the next build would silently erase. If that job goes red, the fix is always
`node build.js`, then commit the result.

What `check.js` cannot do is render anything — it will not tell you whether a
card looks right at 390px. Open the page for that.

---

## Accessibility and SEO

- Semantic landmarks, a skip link, a visible keyboard focus ring.
- WCAG AA contrast in both themes, including the 10–11px monospaced labels —
  the usual place designs like this fail. Measured, not eyeballed.
- `prefers-reduced-motion` respected.
- `prefers-color-scheme` handled in all three states: explicit dark, explicit
  light, and the un-stamped "system" default most visitors are actually in.
- Open Graph tags, a canonical URL, and schema.org `Person` data.
- Every outbound link opens in a new tab; site navigation does not.
- A print stylesheet.
- Works with JavaScript off.

---

## A custom domain, later

`leojchung.github.io` is a perfectly respectable URL and costs nothing. If you
ever want `leojchung.com` instead — about $12–15/year:

1. Buy the domain (Cloudflare Registrar sells at cost; Namecheap and Porkbun
   are fine too).
2. At the registrar, point `A` records for `@` at GitHub's Pages IPs and a
   `CNAME` for `www` at `leojchung.github.io`. **Check GitHub's current
   documentation for the IPs** — they have changed before, so a list copied
   into this file would be a liability.
3. Add a file named `CNAME` at the repo root containing just the domain, one
   line, no `https://`.
4. Settings → Pages → Custom domain → enter it → tick **Enforce HTTPS** once
   the certificate is issued (can take an hour).
5. Update `meta.url` in `content.js` and rebuild, so the canonical URL and the
   structured data agree with reality.
