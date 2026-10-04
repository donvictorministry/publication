(function () {
  'use strict';
  if (window.__dvSearch) return; window.__dvSearch = true;
  var FILES = ['index.html', 'contents.html', 'foreword.html', 'preface.html', 'introduction-the-unclaimed-mantle.html',
    'chapter-1-the-prophetic-witness.html', 'chapter-2-mapping-the-terrain.html', 'chapter-3-a-framework-for-formation.html',
    'chapter-4-from-theory-to-practice.html', 'chapter-5-interpreting-the-outcomes.html', 'chapter-6-writing-the-vision.html',
    'chapter-7-conclusion.html', 'about-the-author.html', 'references.html', 'contact.html', 'engage.html'];
  var DB = [], ready = false, loading = null, tm, panel, input, out, st;

  var css = '.dvs-panel{position:fixed;inset:0;z-index:90;background:var(--card);color:var(--text);display:none;flex-direction:column;font-family:Arial,sans-serif}' +
    '.dvs-panel.on{display:flex}' +
    '.dvs-bar{display:flex;align-items:center;gap:.5rem;padding:.6rem;background:var(--blue);flex-shrink:0}' +
    '.dvs-bar input{flex:1;min-width:0;min-height:52px;font:inherit;font-size:1rem;color:var(--text);background:var(--card);border:0;border-radius:8px;padding:.5rem 1rem;outline:0}' +
    '.dvs-close{width:52px;height:52px;border:0;background:none;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;font:inherit}' +
    '.dvs-close svg{width:28px;height:28px;fill:currentColor}' +
    '.dvs-body{flex:1;overflow-y:auto;padding:1rem}' +
    '.dvs-st{font-size:1rem;margin:0 0 1rem;opacity:.85}' +
    '.dvs-res{display:grid;gap:.75rem}' +
    '.dvs-item{display:block;text-decoration:none;color:var(--text);background:var(--soft);border-left:5px solid var(--blue);border-radius:8px;padding:.9rem 1.1rem;line-height:1.5;font-size:1rem}' +
    '.dvs-item strong{display:block;color:var(--blue);margin-bottom:.25rem}' +
    '.dvs-item mark{background:rgba(212,175,55,.45);color:inherit;padding:0 2px;border-radius:3px}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function load() {
    if (loading) return loading;
    loading = Promise.all(FILES.map(function (f) {
      return fetch(f).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
        if (!t) return;
        var d = new DOMParser().parseFromString(t, 'text/html'), b = d.querySelector('.dv-book'), h = d.querySelector('h1');
        if (!b || !h) return;
        [].forEach.call(b.querySelectorAll('.dv-share,.dv-pager,form'), function (n) { n.remove(); });
        var m = d.querySelector('meta[name="description"]'), text = b.textContent.replace(/\s+/g, ' ').trim(), title = h.textContent.trim(), desc = m ? m.getAttribute('content') : '';
        DB.push({ u: f === 'index.html' ? './' : f, t: title, d: desc, x: text, tl: title.toLowerCase(), dl: desc.toLowerCase(), xl: text.toLowerCase() });
      }).catch(function () {});
    })).then(function () { ready = true; });
    return loading;
  }
  function count(h, t) { var n = 0, i = h.indexOf(t); while (i > -1 && n < 50) { n++; i = h.indexOf(t, i + t.length); } return n; }

  function snippet(p, tokens) {
    var pos = -1;
    tokens.forEach(function (t) { var i = p.xl.indexOf(t); if (i > -1 && (pos < 0 || i < pos)) pos = i; });
    var s = pos < 0 ? p.d : p.x.substr(Math.max(0, pos - 80), 200);
    if (pos > 80) s = '...' + s;
    if (pos > -1 && p.x.length > pos + 120) s += '...';
    var re = new RegExp('(' + tokens.map(rx).join('|') + ')', 'gi');
    return s.split(re).map(function (part, i) { return i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part); }).join('');
  }

  function run() {
    var v = input.value.trim().toLowerCase();
    if (v.length < 2) { out.innerHTML = ''; st.textContent = 'Type at least two letters to search every page.'; return; }
    var tokens = v.split(/\s+/).filter(function (t) { return t.length > 1; });
    var res = DB.map(function (p) {
      var s = 0, all = true;
      tokens.forEach(function (t) {
        var a = p.tl.indexOf(t) > -1, b = p.dl.indexOf(t) > -1, c = count(p.xl, t);
        if (!a && !b && !c) all = false;
        s += (a ? 10 : 0) + (b ? 4 : 0) + Math.min(c, 15);
      });
      return { p: p, s: s, all: all };
    }).filter(function (r) { return r.s > 0; });
    var strict = res.filter(function (r) { return r.all; });
    if (strict.length) res = strict;
    res.sort(function (a, b) { return b.s - a.s; });
    res = res.slice(0, 20);
    if (!res.length) { out.innerHTML = ''; st.textContent = 'No pages match that search yet. Try a different or shorter word.'; return; }
    st.textContent = res.length + (res.length === 1 ? ' page found' : ' pages found');
    out.innerHTML = res.map(function (r) { return '<a class="dvs-item" href="' + r.p.u + '"><strong>' + esc(r.p.t) + '</strong>' + snippet(r.p, tokens) + '</a>'; }).join('');
  }
  function go() { if (ready) run(); else { st.textContent = 'Searching...'; load().then(run); } }

  function open() {
    [].forEach.call(document.querySelectorAll('.dv-side,.dv-ov'), function (e) { e.classList.remove('on'); });
    panel.classList.add('on'); document.body.style.overflow = 'hidden'; input.focus(); load();
  }
  function close() { panel.classList.remove('on'); document.body.style.overflow = ''; }

  function init() {
    panel = document.createElement('div'); panel.className = 'dvs-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Search');
    panel.innerHTML = '<div class="dvs-bar"><input type="search" placeholder="Search chapters, topics, scripture" autocomplete="off" aria-label="Search the book"><button class="dvs-close" type="button" aria-label="Close search"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div><div class="dvs-body"><p class="dvs-st">Type at least two letters to search every page.</p><div class="dvs-res"></div></div>';
    document.body.appendChild(panel);
    input = panel.querySelector('input'); out = panel.querySelector('.dvs-res'); st = panel.querySelector('.dvs-st');
    panel.querySelector('.dvs-close').onclick = close;
    input.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(go, 150); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    var old = document.getElementById('dvSearchBtn'); if (old) old.remove();
    var hdr = document.querySelector('.dv-h1'), dots = document.getElementById('dvOpenR');
    if (hdr && dots) {
      var b = document.createElement('button'); b.id = 'dvSearchBtn'; b.className = 'dv-ic'; b.type = 'button'; b.setAttribute('aria-label', 'Search');
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
      b.onclick = open; hdr.insertBefore(b, dots);
    }
    var nav = document.querySelector('#dvLeft nav');
    if (nav) {
      var dead = nav.querySelector('a[href="search.html"]'); if (dead) dead.remove();
      var a = document.createElement('a'); a.className = 'dv-nav-item'; a.href = '#'; a.textContent = 'Search';
      a.onclick = function (e) { e.preventDefault(); open(); }; nav.appendChild(a);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
