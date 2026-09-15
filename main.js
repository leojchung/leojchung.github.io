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
  document.querySelectorAll('button.media.play').forEach(function (btn) {
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
})();
