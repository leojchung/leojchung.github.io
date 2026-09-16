/* ══════════════════════════════════════════════════════════════════════════
   main.js — the only JavaScript the site runs.

   It does two things: the light/dark toggle, and the footer year.
   Everything else on the page is plain HTML and CSS, which is why the site
   still works perfectly with JavaScript disabled.
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var root = document.documentElement;
  var btn  = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');

  var SUN  = '<circle cx="12" cy="12" r="4"></circle>' +
             '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2' +
             'M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>';

  /* localStorage can throw (private windows, blocked site data), so every
     read and write is wrapped. The page must render correctly without it. */
  function stored() {
    try { return localStorage.getItem('ljc-theme'); } catch (e) { return null; }
  }
  function remember(v) {
    try { localStorage.setItem('ljc-theme', v); } catch (e) { /* fine */ }
  }

  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  /* Three states, not two: an explicit stamp on <html> wins, otherwise the OS. */
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark')  return true;
    if (t === 'light') return false;
    return systemDark();
  }

  function paint() {
    if (!icon || !btn) return;
    var dark = isDark();
    icon.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  var saved = stored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  paint();

  if (btn) {
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      remember(next);
      paint();
    });
  }

  /* Follow the OS only while the visitor has not made an explicit choice. */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (!root.getAttribute('data-theme')) paint(); };
    if (mq.addEventListener)   mq.addEventListener('change', onChange);
    else if (mq.addListener)   mq.addListener(onChange);
  }

  /* Click-to-play video tiles in the Fun section. The iframe does not exist
     until someone clicks, so no visitor who merely scrolls past ever touches
     YouTube. Swapping the button for the iframe also autoplays, because the
     click counts as the user gesture browsers require. */
  document.querySelectorAll('button.media[data-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-src');
      if (!src) return;
      var frame = document.createElement('iframe');
      frame.setAttribute('src', src);
      frame.setAttribute('title', btn.getAttribute('aria-label') || 'video');
      frame.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; picture-in-picture');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('loading', 'lazy');
      var wrap = document.createElement('div');
      wrap.className = 'media';
      wrap.appendChild(frame);
      btn.replaceWith(wrap);
    });
  });

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Scroll reveal: each .reveal element (every section) fades and slides up
     once as it enters the viewport. Gated behind a class this script adds —
     a visitor with JavaScript disabled must still see everything, so the
     CSS only hides .reveal elements once .has-reveal is present. */
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('has-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .stagger-item').forEach(function (el) { io.observe(el); });
  }

  /* The "I also like ___" bubble on Home — cycles through the pipe-separated
     list in data-list. Skipped for prefers-reduced-motion; the first item
     (already in the markup) just sits there instead. */
  var likeWord = document.querySelector('.like-word');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (likeWord && !reduceMotion) {
    var likes = (likeWord.getAttribute('data-list') || '').split('|').filter(Boolean);
    if (likes.length > 1) {
      var likeIdx = 0;
      setInterval(function () {
        likeIdx = (likeIdx + 1) % likes.length;
        likeWord.style.opacity = '0';
        setTimeout(function () {
          likeWord.textContent = likes[likeIdx];
          likeWord.style.opacity = '1';
        }, 220);
      }, 2200);
    }
  }

  /* ── the Ask bar ──────────────────────────────────────────────────────────
     No API, no server: a small keyword map per destination, scored against
     whatever was typed. Best match wins and the browser navigates there
     (a plain link — a section on another page, or this one's own anchor);
     nothing close enough gets an honest "try rephrasing" instead of a wrong
     guess. Edit TARGETS below to add a destination or its keywords. */
  var askInput = document.getElementById('ask-input');
  if (askInput) {
    var askSubmit = document.getElementById('ask-submit');
    var askResult = document.getElementById('ask-result');

    var TARGETS = [
      { href: 'index.html',              keys: ['home', 'about you', 'who are you', 'intro', 'yourself'] },
      { href: 'projects.html#research-h', keys: ['research', 'lab work', 'neuroscience', 'ciernia', 'microglia', 'brain', 'autism', 'gut', 'science', 'baf', 'mice', 'studies'] },
      { href: 'projects.html#teaching-h', keys: ['teach', 'teaching', 'class', 'course', 'astu', 'neuroaesthetics', 'education', 'instructor', 'mentor', 'tutor', 'adjudicate'] },
      { href: 'projects.html#lab-h',      keys: ['photos', 'lab photo', 'candid', 'in the lab', 'pictures'] },
      { href: 'projects.html#press-h',    keys: ['press', 'featured', 'write-up', 'article', 'news', 'media coverage'] },
      { href: 'fun.html#fun-h',           keys: ['fun', 'hobbies', 'hobby', 'chess', 'lakers', 'rams', 'bike', 'biking', 'music', 'star wars', 'bbq', 'off the clock'] },
      { href: 'contact.html#contact-h',   keys: ['contact', 'email', 'reach', 'message', 'phone', 'linkedin', 'talk', 'hire', 'get in touch'] },
      { href: 'cv.pdf',                   keys: ['cv', 'resume', 'curriculum vitae'] }
    ];

    function runAsk() {
      var text = (askInput.value || '').trim();
      if (!text) return;
      var lower = text.toLowerCase();
      var words = lower.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);

      var best = null, bestScore = 0;
      TARGETS.forEach(function (t) {
        var score = 0;
        t.keys.forEach(function (k) {
          if (lower.indexOf(k) !== -1) score += k.split(' ').length + 1;
          if (words.indexOf(k) !== -1) score += 1;
        });
        if (score > bestScore) { bestScore = score; best = t; }
      });

      askResult.classList.remove('show');
      if (best) {
        askResult.innerHTML = 'Taking you there<b> → ' + best.href.split('#')[0] + '</b>';
        setTimeout(function () { window.location.href = best.href; }, 450);
      } else {
        askResult.textContent = 'Not sure about that one — try asking about research, teaching, fun, or contact.';
      }
      requestAnimationFrame(function () { askResult.classList.add('show'); });
    }

    askSubmit.addEventListener('click', runAsk);
    askInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') runAsk(); });
  }
})();
