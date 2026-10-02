(function () {
  var bar = document.createElement('div'); bar.className = 'dv-prog';
  function upd() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
  }
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(bar); });
  window.addEventListener('scroll', upd, { passive: true });
  document.addEventListener('dv:view', function (e) { bar.style.display = e.detail.id === 'home' ? 'none' : 'block'; setTimeout(upd, 50); });
})();
