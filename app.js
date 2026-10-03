(function () {
  'use strict';
  window.addEventListener('error', function (e) { e.preventDefault(); });
  window.addEventListener('unhandledrejection', function (e) { e.preventDefault(); });
  var CFG = {
    prefix: 'dvPW_', title: 'The Prophetic Witness',
    contactEmail: 'chris.johnson@oxford.edu' /* where contact form messages are delivered */
  };
  var ACCENTS = ['#1877F2', '#0F9D58', '#E53935', '#8E24AA', '#F57C00', '#00897B', '#3949AB', '#D81B60', '#6D4C41', '#546E7A'];
  var deferred = null, tt;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function sget(k) { try { return localStorage.getItem(CFG.prefix + k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(CFG.prefix + k, v); } catch (e) {} }

  function toast(m) {
    var t = $('#dvToast'); if (!t) return; t.textContent = m; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 3000);
  }
  function closeSides() { $$('.dv-side,.dv-ov').forEach(function (e) { e.classList.remove('on'); }); }
  function openSide(id) { closeSides(); $(id).classList.add('on'); $('#dvOv').classList.add('on'); }

  function apply() {
    var r = document.documentElement;
    var s = parseInt(sget('font') || '100', 10); s = Math.max(100, Math.min(140, isNaN(s) ? 100 : s));
    r.style.fontSize = (19 * s / 100) + 'px';
    r.setAttribute('data-theme', sget('dark') === '1' ? 'dark' : 'light');
    var a = sget('accent') || ACCENTS[0];
    r.style.setProperty('--blue', a);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', a);
    $$('.dv-sw').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-c') === a); });
  }

  function progress() {
    var bar = $('#dvBar'); if (!bar) return;
    if (!document.body.hasAttribute('data-read')) { bar.style.width = '0'; return; }
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 100) + '%';
  }

  function copyFallback(url) {
    try {
      var t = document.createElement('textarea'); t.value = url; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); var ok = document.execCommand('copy'); document.body.removeChild(t);
      if (ok) toast('Link copied.');
    } catch (e) {}
  }
  function shareIt(url, title) {
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); }
    else if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast('Link copied.'); }, function () { copyFallback(url); }); }
    else { copyFallback(url); }
  }
  function pageUrl() { return location.href.split('#')[0]; }
  function homeUrl() { return pageUrl().replace(/[^\/]*$/, ''); }

  function initForm() {
    var f = $('#dvForm'); if (!f) return;
    $('#dvNote').textContent = 'Sending opens your email app with the message ready to send.';
    function bad(id, eid, msg) { $(id).setAttribute('aria-invalid', 'true'); $(eid).textContent = msg; return false; }
    function good(id, eid) { $(id).removeAttribute('aria-invalid'); $(eid).textContent = ''; return true; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#dvHp').value) return;
      var n = $('#dvName').value.trim(), m = $('#dvMail').value.trim(), s = $('#dvSubj').value, t = $('#dvMsg').value.trim();
      var ok1 = n.length > 1 ? good('#dvName', '#dvNameE') : bad('#dvName', '#dvNameE', 'Please add your full name.');
      var ok2 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m) ? good('#dvMail', '#dvMailE') : bad('#dvMail', '#dvMailE', 'Please add your email address so a reply can reach you.');
      var ok3 = t.length > 9 ? good('#dvMsg', '#dvMsgE') : bad('#dvMsg', '#dvMsgE', 'Please add a short message (at least 10 characters).');
      if (!(ok1 && ok2 && ok3)) { var first = f.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
      var body = 'Name: ' + n + '\nEmail: ' + m + '\n\n' + t;
      window.location.href = 'mailto:' + CFG.contactEmail + '?subject=' + encodeURIComponent(s + ' | ' + CFG.title) + '&body=' + encodeURIComponent(body);
      toast('Opening your email app.');
    });
  }

  function init() {
    var sw = $('#dvSw');
    if (sw) ACCENTS.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'dv-sw'; b.style.background = c;
      b.setAttribute('data-c', c); b.setAttribute('aria-label', 'Accent color ' + c); b.type = 'button'; sw.appendChild(b);
    });
    var font = $('#dvFont'), dark = $('#dvDark');
    if (font) { font.value = sget('font') || '100'; font.oninput = function () { sset('font', this.value); apply(); }; }
    if (dark) { dark.checked = sget('dark') === '1'; dark.onchange = function () { sset('dark', this.checked ? '1' : '0'); apply(); }; }
    apply();

    document.addEventListener('click', function (e) {
      var s = e.target.closest('.dv-sw'); if (s) { sset('accent', s.getAttribute('data-c')); apply(); return; }
      if (e.target.closest('.dv-sharebtn')) shareIt(pageUrl(), document.title);
    });
    $('#dvOpenL').onclick = function () { openSide('#dvLeft'); };
    $('#dvOpenR').onclick = $('#dvMore').onclick = function () { openSide('#dvRight'); };
    $('#dvOv').onclick = closeSides;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSides(); });

    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
    window.addEventListener('appinstalled', function () { deferred = null; toast('App installed.'); });
    $('#dvInstall').onclick = function () {
      if (!deferred) { toast('Open your browser menu and choose Add to Home screen.'); return; }
      deferred.prompt(); deferred = null;
    };
    $('#dvShare').onclick = function () { shareIt(homeUrl(), CFG.title); };
    $('#dvSharePage').onclick = function () { shareIt(pageUrl(), document.title); };

    window.addEventListener('scroll', progress, { passive: true });
    window.addEventListener('resize', progress);
    progress(); initForm();
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) { navigator.serviceWorker.register('sw.js').catch(function () {}); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
