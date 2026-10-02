(function () {
  var C = window.dvCore; if (!C) return;
  var COLORS = ['#1877F2','#0F9D58','#E53935','#8E24AA','#F57C00','#00897B','#3949AB','#D81B60','#6D4C41','#546E7A'];
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  function apply() {
    var r = document.documentElement, s = parseInt(C.store.get('font') || '100', 10);
    r.style.fontSize = (19 * Math.max(100, Math.min(140, s)) / 100) + 'px';
    r.setAttribute('data-theme', C.store.get('dark') === '1' ? 'dark' : 'light');
    var a = C.store.get('accent') || COLORS[0];
    r.style.setProperty('--dv-accent', a);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = a;
  }
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('dvRightBody'); if (!box) return;
    box.innerHTML =
      '<div class="dv-row"><label for="dvFont">Text size</label><input id="dvFont" type="range" min="100" max="140" step="5"></div>' +
      '<div class="dv-row"><label for="dvDark">Dark mode</label><input id="dvDark" type="checkbox"></div>' +
      '<div class="dv-swatches" id="dvSw"></div>' +
      '<button class="dv-wide" id="dvInstall">Install App</button><button class="dv-wide" id="dvShare">Share App</button>';
    var f = box.querySelector('#dvFont'), d = box.querySelector('#dvDark'), sw = box.querySelector('#dvSw');
    f.value = C.store.get('font') || '100'; d.checked = C.store.get('dark') === '1';
    function mark() { var a = C.store.get('accent') || COLORS[0]; [].forEach.call(sw.children, function (b, i) { b.classList.toggle('on', COLORS[i] === a); }); }
    COLORS.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'dv-swatch'; b.style.background = c;
      b.setAttribute('aria-label', 'Accent color ' + c);
      b.onclick = function () { C.store.set('accent', c); apply(); mark(); }; sw.appendChild(b);
    });
    f.oninput = function () { C.store.set('font', f.value); apply(); };
    d.onchange = function () { C.store.set('dark', d.checked ? '1' : '0'); apply(); };
    box.querySelector('#dvInstall').onclick = function () {
      if (!deferred) { C.toast('Use your browser menu and choose Add to Home screen.'); return; }
      deferred.prompt(); deferred = null;
    };
    box.querySelector('#dvShare').onclick = function () {
      var u = location.href.split('#')[0];
      if (navigator.share) navigator.share({ title: C.cfg.title, url: u }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { C.toast('Link copied.'); }, function () { C.toast('Could not copy the link.'); });
      else C.toast('Sharing is not supported on this browser.');
    };
    mark();
  });
  apply();
})();
