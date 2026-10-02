(function () {
  'use strict';
  var CFG = {
    title: 'The Prophetic Witness',
    subtitle: 'Cultivating Civic Engagement and Political Leadership in Christian Education',
    author: 'Dr. Chris Johnson',
    affiliation: 'Oxford University',
    year: 2025,
    prefix: 'dvPW_'
  };
  var mods = [], cache = {}, cur = 'home', ready = false;
  var $ = function (s) { return document.querySelector(s); };

  function storeGet(k) { try { return localStorage.getItem(CFG.prefix + k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(CFG.prefix + k, v); } catch (e) {} }

  var tt;
  function toast(msg) {
    var t = $('#dvToast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 3000);
  }

  function closeSides() {
    ['#dvLeft', '#dvRight', '#dvOverlay'].forEach(function (s) { $(s).classList.remove('open'); });
  }
  function openSide(s) { closeSides(); $(s).classList.add('open'); $('#dvOverlay').classList.add('open'); }

  function buildToc() {
    var box = $('#dvToc'); box.innerHTML = '';
    [{ id: 'home', title: 'Home' }].concat(mods).forEach(function (m) {
      var b = document.createElement('button');
      b.className = 'dv-toc-item' + (m.id === cur ? ' on' : '');
      b.textContent = m.title; b.setAttribute('data-go', m.id);
      box.appendChild(b);
    });
  }

  function pager(page, i) {
    var p = document.createElement('div'); p.className = 'dv-pager';
    var a = document.createElement('button'), n = document.createElement('button');
    a.textContent = 'Previous'; n.textContent = 'Next';
    n.disabled = i >= mods.length - 1;
    a.onclick = function () { go(i > 0 ? mods[i - 1].id : 'home'); };
    n.onclick = function () { go(mods[i + 1].id); };
    p.appendChild(a); p.appendChild(n); page.appendChild(p);
  }

  function load(m, page) {
    if (m.render) { m.render(page); return Promise.resolve(); }
    if (cache[m.id]) { page.innerHTML = cache[m.id]; return Promise.resolve(); }
    return fetch(m.src).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (h) { cache[m.id] = h; page.innerHTML = h; });
  }

  function show(id) {
    var home = $('#dvHome'), page = $('#dvPage');
    var i = mods.findIndex(function (m) { return m.id === id; });
    if (id !== 'home' && i < 0) { id = 'home'; toast('That section is not available.'); }
    cur = id; closeSides(); buildToc();
    if (id === 'home') {
      home.hidden = false; page.hidden = true; $('#dvSection').textContent = 'Home';
      window.scrollTo(0, 0);
      document.dispatchEvent(new CustomEvent('dv:view', { detail: { id: id } }));
      return;
    }
    var m = mods[i];
    $('#dvSection').textContent = m.title;
    page.innerHTML = ''; home.hidden = true; page.hidden = false;
    load(m, page).then(function () {
      pager(page, i); window.scrollTo(0, 0);
      storeSet('last', id);
      document.dispatchEvent(new CustomEvent('dv:view', { detail: { id: id } }));
    }).catch(function () {
      page.innerHTML = '<p>This section could not be loaded.</p>'; pager(page, i);
      toast('Could not load ' + m.title + '. Check your connection.');
    });
  }
  function go(id) { if (location.hash !== '#/' + id) location.hash = '#/' + id; else show(id); }

  window.dvCore = {
    cfg: CFG, toast: toast, go: go, store: { get: storeGet, set: storeSet },
    register: function (m) {
      mods = mods.filter(function (x) { return x.id !== m.id; });
      mods.push(m); mods.sort(function (a, b) { return a.order - b.order; });
      if (ready) buildToc();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-cfg]').forEach(function (e) { e.textContent = CFG[e.getAttribute('data-cfg')]; });
    $('#dvOpenLeft').onclick = $('#dvNavToc').onclick = function () { openSide('#dvLeft'); };
    $('#dvOpenRight').onclick = $('#dvNavMore').onclick = function () { openSide('#dvRight'); };
    $('#dvOverlay').onclick = closeSides;
    $('#dvStart').onclick = function () { if (mods.length) go(mods[0].id); else toast('No chapters are installed.'); };
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-go]'); if (t) go(t.getAttribute('data-go'));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSides(); });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
    window.addEventListener('hashchange', function () { show(location.hash.replace('#/', '') || 'home'); });
    ready = true; buildToc();
    show(location.hash.replace('#/', '') || 'home');
  });
})();
