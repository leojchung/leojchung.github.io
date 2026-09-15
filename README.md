# leojchung.github.io

Personal website for Leo J. Chung. Static HTML, no framework, no build
dependencies, hosted free on GitHub Pages.

---

## The thirty-second version

```bash
# 1. edit your content
open content.js

# 2. regenerate the page
node build.js

# 3. look at it
open index.html

# 4. ship it
git add -A && git commit -m "Update research section" && git push
```

GitHub Pages redeploys within a minute of the push.

---

## How the repo is put together

| File | What it is | Do you edit it? |
|---|---|---|
| `content.js` | Every word, date and link on the site | **Yes — this is the one** |
| `styles.css` | The whole design system. Colours are tokens at the top | Yes, to reskin |
| `build.js` | Turns `content.js` into `index.html` | Only for new section *types* |
| `index.html` | **Generated.** Do not hand-edit — `node build.js` overwrites it | No |
| `build-cv.js` | Turns the same `content.js` into a print-ready `cv.html` | Only for CV-only sections |
| `cv.html` | **Generated.** Open it, Cmd-P, Save as PDF → `cv.pdf` | No |
| `404.html` | The not-found page GitHub Pages serves | If you want different wording |
| `main.js` | Light/dark toggle and the footer year. That is all the JS | Rarely |
| `favicon.svg` | The tab icon | If you want a different mark |
| `cv.pdf` | **Generated** from `cv.html`. Replace it whenever content changes | No |
| `assets/` | Photos, syllabus PDFs, anything you link to | Yes |
| `.nojekyll` | Tells GitHub Pages to serve files as-is | No |

### Why `index.html` is generated *and* committed

Two things are usually in tension: keeping content in one editable place, and
serving plain static HTML that loads instantly and that Google can read without
running JavaScript. Generating the HTML at author time and committing the result
gets both. The site does not depend on Node at all — that is only your authoring
convenience. If you never ran `build.js` again, the site would keep working.

---

## Common edits

**Add a role.** Find the right block in `content.js` — `experience`, `teaching`,
`research`, `service` — copy the nearest entry, change the fields. Order in the
file is the order on the page.

**Hide something without deleting it.** Add `hidden: true` to that entry.

**Reorder or hide a whole section.** The `sections` array at the bottom of
`content.js`. Move the lines around; set `on: false` to hide. The § numbers and
the nav bar both rebuild themselves.

**Rename a section.** Change its `title`. The nav uses `navLabel` if present,
otherwise the title.

**Change the colours.** `styles.css`, the `:root` block at the top, then the two
dark-theme blocks under it. Every colour on the page reads from those tokens, so
changing them there changes the whole site. Do not hard-code colours elsewhere —
you will fix one theme and break the other.

**Add your photo.** Put a square image in `assets/`, then set
`meta.portrait: "assets/leo.jpg"` in `content.js`.

**Fill in the fun section.** `fun.items` in `content.js`. Each item has a
`kind`: `photo` (your own file in `assets/`), `video` (a YouTube or Vimeo id —
an embed, never a downloaded file), or `link`. It is switched on and currently
shows placeholders, so fill it in or set `on: false` before going public.

**Connect the message form.** Make a free account at formspree.io, create a
form, and paste the endpoint it gives you into `contact.form.action`. Until you
do, the form shows an "Email me instead" button, which works fine.

**Update your CV.** Edit `content.js` as usual, then `node build-cv.js`, open
`cv.html`, and Cmd-P → Save as PDF over the existing `cv.pdf`. Both CV buttons
on the site already point at it.

---

## The CV

`cv.pdf` in this folder was generated from `content.js`, so your CV and your
site cannot drift apart. To regenerate it after editing content:

```bash
node build-cv.js      # writes cv.html
open cv.html          # then Cmd-P → Save as PDF → cv.pdf
```

Turn **off** "Headers and footers" in the print dialog, or the browser stamps a
URL and a date across every page.

It currently runs to three pages, which is on the long side. That is a function
of how much you have done, not a bug — but if you want two, cut the pre-2024
jobs and trim Service. For sections a CV wants and a website does not — awards,
coursework, references — there is a `CV_EXTRA` block at the bottom of
`build-cv.js` with worked examples.

---

## Publishing it — GitHub Pages, free, forever

You have not done this part yet. It takes about five minutes.

### 1. Create the repository

On github.com, make a **new repository** named exactly:

```
leojchung.github.io
```

The name is not cosmetic. A repo named `<username>.github.io` is published at
`https://<username>.github.io/` with nothing else to configure. Replace
`leojchung` with your actual GitHub username if it differs.

Choose **Private** for now. Pages on a private repo needs a paid plan, so the
site will not be live while it is private — that is fine, you are reviewing it
locally. Flip the repo to Public when you are ready to go live (Settings →
General → Danger Zone → Change visibility).

Do **not** let GitHub add a README, .gitignore, or licence — this repo already
has what it needs.

### 2. Point this folder at it

```bash
cd ~/Downloads/ClaudeCoworkProjects/leojchung.github.io
git remote add origin https://github.com/leojchung/leojchung.github.io.git
git branch -M main
git push -u origin main
```

Git will ask you to authenticate. Use a browser login or a personal access
token — whichever you normally use.

### 3. Turn Pages on

Repo → **Settings** → **Pages** → Source: **Deploy from a branch** →
Branch: `main`, folder `/ (root)` → **Save**.

Give it a minute. `https://leojchung.github.io/` goes live.

### 4. Check it

Open it on your phone as well as your laptop. Toggle dark mode. Click every
link, including both CV buttons and one of the Featured links.

---

## A custom domain, later

`leojchung.github.io` is a perfectly respectable URL and costs nothing. If you
want `leojchung.com` instead, it runs about $12–15 a year:

1. Buy the domain (Cloudflare Registrar sells at cost; Namecheap and Porkbun are
   also fine).
2. At your registrar, add these DNS records:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `leojchung.github.io` |

   *Verify those IPs against GitHub's current documentation before relying on
   them — GitHub has changed them before.*
3. Rename `CNAME.example` to `CNAME` and put your domain in it, one line, no
   `https://`.
4. Repo → Settings → Pages → Custom domain → enter it → tick **Enforce HTTPS**
   once the certificate is issued (can take an hour).
5. Update `meta.url` in `content.js` and rebuild, so the canonical URL and the
   structured data agree with reality.

---

## Accessibility and SEO, already handled

- Semantic landmarks, a skip link, and a visible keyboard focus ring.
- Colour contrast meets WCAG AA in both themes, including the small
  monospaced labels — the usual place these designs fail.
- `prefers-reduced-motion` respected.
- `prefers-color-scheme` handled in all three states: explicit dark, explicit
  light, and the un-stamped "system" default most visitors are actually in.
- Open Graph tags, a canonical URL, and schema.org `Person` structured data, so
  a Google result for your name can show the right thing.
- A print stylesheet, so `Cmd-P` produces a clean CV-ish document.
- Works with JavaScript off.

---

## The one safeguard

`.github/workflows/check-build.yml` runs on every push and fails if the
committed `index.html` does not match what `build.js` produces from
`content.js`. It exists to catch exactly one mistake: editing `index.html` by
hand, whose edits the next build would silently erase. If that job goes red,
the fix is always `node build.js`, then commit.

It costs nothing on a public repo and needs no setup beyond pushing.

---

## Local preview

Opening `index.html` directly in a browser works fine. If you want a real local
server:

```bash
cd ~/Downloads/ClaudeCoworkProjects/leojchung.github.io
python3 -m http.server 8000
# then visit http://localhost:8000
```
