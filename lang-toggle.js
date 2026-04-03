/* ═══════════════════════════════════════════════════
   PILOT VALUE — Language Toggle (JP / EN)
   Key: pv-lang  |  Values: 'ja' | 'en'
   Pattern-based routing — no manual page map needed.
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── URL mapping helpers ── */
  function jaToEn(path) {
    if (path === '/' || path === '/index.html') return '/en/';
    // /airlines/xxx.html → /en/airlines/xxx.html
    if (/^\/airlines\/[^/]+\.html$/.test(path)) return '/en' + path;
    // /world-airlines.html, /pilot-salary-guide.html, etc.
    if (/^\/[^/]+\.html$/.test(path)) return '/en' + path;
    return null; // no EN version — don't redirect
  }

  function enToJa(path) {
    if (path === '/en' || path === '/en/') return '/';
    return path.replace(/^\/en/, '') || '/';
  }

  /* ── Detect current state ── */
  var raw = location.pathname.replace(/\/$/, '') || '/';
  var isEN = raw.indexOf('/en') === 0;

  /* ── Auto-redirect based on saved preference ── */
  var saved = localStorage.getItem('pv-lang');
  if (saved === 'en' && !isEN) {
    var enDest = jaToEn(raw);
    if (enDest) { location.replace(enDest); return; }
  }
  if (saved === 'ja' && isEN) {
    location.replace(enToJa(raw)); return;
  }

  /* ── Inject button after DOM ready ── */
  function injectBtn() {
    if (document.getElementById('lang-toggle')) return;

    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', isEN ? 'Switch to Japanese' : 'Switch to English');
    btn.innerHTML = isEN
      ? '<span aria-hidden="true" style="font-size:1.05em">🇺🇸</span> EN'
      : '<span aria-hidden="true" style="font-size:1.05em">🇯🇵</span> JP';

    // Prefer inserting after theme-toggle; fall back to last child in nav
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.parentNode.insertBefore(btn, themeBtn.nextSibling);
    } else {
      var nav = document.getElementById('main-nav');
      if (!nav) return;
      var inner = nav.querySelector('.max-w-7xl');
      if (inner) inner.appendChild(btn);
      else nav.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      if (isEN) {
        localStorage.setItem('pv-lang', 'ja');
        location.href = enToJa(raw);
      } else {
        localStorage.setItem('pv-lang', 'en');
        location.href = jaToEn(raw) || '/en/';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBtn);
  } else {
    injectBtn();
  }
})();
