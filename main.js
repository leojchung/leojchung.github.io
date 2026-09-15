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

  /* ── Vancouver's live weather ────────────────────────────────────────────
     The one live third-party request the site makes. Open-Meteo is used
     because it needs no API key and sets no cookie — the endpoint is a
     plain GET with the coordinates in the query string, so nothing about
     the visitor is sent and there is nothing to keep secret in the page.

     Coordinates come from the markup (content.js sets them), not from the
     visitor: the card reports the weather where Leo is, and asking for
     someone's location to tell them about a city they are not in would be
     both useless and rude.

     Every failure path leaves the card exactly as it was rendered — an em
     dash and an empty strip. A weather card that silently shows stale
     or wrong numbers is worse than one that shows nothing. */
  var wxList = document.getElementById('wx-hours');
  var wxTemp = document.getElementById('wx-temp');
  if (wxList && wxTemp && window.fetch) {
    /* WMO weather codes, grouped. Open-Meteo returns the numeric code;
       anything not listed falls through to no icon and no wording. */
    var WMO = {
      0:  ['☀️', 'Clear'],
      1:  ['🌤️', 'Mainly clear'],
      2:  ['⛅', 'Partly cloudy'],
      3:  ['☁️', 'Overcast'],
      45: ['🌫️', 'Fog'],          48: ['🌫️', 'Freezing fog'],
      51: ['🌦️', 'Light drizzle'], 53: ['🌦️', 'Drizzle'],       55: ['🌦️', 'Heavy drizzle'],
      56: ['🌧️', 'Freezing drizzle'], 57: ['🌧️', 'Freezing drizzle'],
      61: ['🌦️', 'Light rain'],    63: ['🌧️', 'Rain'],           65: ['🌧️', 'Heavy rain'],
      66: ['🌧️', 'Freezing rain'], 67: ['🌧️', 'Freezing rain'],
      71: ['🌨️', 'Light snow'],    73: ['🌨️', 'Snow'],           75: ['🌨️', 'Heavy snow'],
      77: ['🌨️', 'Snow grains'],
      80: ['🌦️', 'Light showers'], 81: ['🌦️', 'Showers'],        82: ['🌧️', 'Heavy showers'],
      85: ['🌨️', 'Snow showers'],  86: ['🌨️', 'Snow showers'],
      95: ['⛈️', 'Thunderstorm'],  96: ['⛈️', 'Thunderstorm'],    99: ['⛈️', 'Thunderstorm, hail']
    };

    /* Clear skies after dark get a moon, not a sun. */
    var glyph = function (code, isDay) {
      var hit = WMO[code];
      if (!hit) return '';
      if (isDay === 0 && (code === 0 || code === 1)) return '🌙';
      return hit[0];
    };

    var lat = wxList.getAttribute('data-lat');
    var lon = wxList.getAttribute('data-lon');
    /* past_hours=3 plus forecast_hours=4 returns exactly seven hourly rows:
       three before the current hour, the current hour, three after. */
    var url = 'https://api.open-meteo.com/v1/forecast'
            + '?latitude='  + encodeURIComponent(lat)
            + '&longitude=' + encodeURIComponent(lon)
            + '&current=temperature_2m,weather_code,is_day'
            + '&hourly=temperature_2m,weather_code,is_day'
            + '&past_hours=3&forecast_hours=4'
            + '&timezone=America%2FVancouver';

    fetch(url)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        var cur = d && d.current;
        if (!cur || typeof cur.temperature_2m !== 'number') return;
        wxTemp.textContent = Math.round(cur.temperature_2m) + '°C';
        var hit = WMO[cur.weather_code];
        /* No condition line in the minimal strip: the words ride on the
           icon's label, for screen readers and as a hover tooltip. */
        var icon = document.getElementById('wx-icon');
        if (hit && icon) {
          icon.textContent = glyph(cur.weather_code, cur.is_day);
          icon.setAttribute('aria-label', hit[1]);
          icon.setAttribute('title', hit[1]);
        }

        /* The hourly strip. Times come back as Vancouver-local ISO strings
           ("2026-09-15T12:00"), so the current hour is found by matching the
           current reading's time truncated to the hour — no clock maths in
           the visitor's own timezone. */
        var list = wxList;
        var h = d.hourly;
        if (!list || !h || !h.time || !h.time.length) return;
        var nowKey = String(cur.time || '').slice(0, 13);
        var html = '';
        h.time.forEach(function (t, k) {
          var temp = h.temperature_2m[k];
          if (typeof temp !== 'number') return;
          var hr = parseInt(t.slice(11, 13), 10);
          var isNow = t.slice(0, 13) === nowKey;
          var label = isNow ? 'Now' : ((hr % 12 || 12) + (hr < 12 ? ' AM' : ' PM'));
          var cond = (WMO[h.weather_code[k]] || [])[1] || '';
          html += '<li' + (isNow ? ' class="now" aria-current="time"' : '') + '>'
                + '<span class="h">' + label + '</span>'
                + '<span class="i" role="img" aria-label="' + cond + '">' + glyph(h.weather_code[k], h.is_day && h.is_day[k]) + '</span>'
                + '<span class="t">' + Math.round(temp) + '°</span>'
                + '</li>';
        });
        list.innerHTML = html;
      })
      .catch(function () { /* leave the card as rendered */ });
  }

  /* ── Vancouver's local time ──────────────────────────────────────────────
     Computed in the browser from the visitor's own clock, formatted in the
     America/Vancouver zone, so it needs no request. Re-rendered every 15s,
     which is close enough that the minute never visibly lags. Browsers
     without Intl time-zone support leave the em dash. */
  var wxClock = document.getElementById('wx-clock');
  if (wxClock && window.Intl) {
    try {
      var fTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Vancouver', hour: 'numeric', minute: '2-digit' });
      var tick = function () {
        wxClock.textContent = fTime.format(new Date());
      };
      tick();
      setInterval(tick, 15000);
    } catch (e) { /* no time-zone support: keep the em dash */ }
  }

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
})();
