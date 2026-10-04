(function () {
  'use strict';
  function $(s) { return document.querySelector(s); }
  function toast(m) {
    var t = $('#dvToast'); if (!t) return; t.textContent = m; t.classList.add('on');
    setTimeout(function () { t.classList.remove('on'); }, 3000);
  }
  function init() {
    /* Contact channel cards copy their links from the footer icons (one place to edit) */
    var map = { mail: '.dv-s-mail', tel: '.dv-s-tel', wa: '.dv-s-wa', fb: '.dv-s-fb' };
    [].forEach.call(document.querySelectorAll('[data-ch]'), function (c) {
      var k = c.getAttribute('data-ch'), f = document.querySelector('.dv-foot ' + map[k]); if (!f) return;
      var h = f.getAttribute('href'); c.href = h;
      if (f.getAttribute('target')) { c.target = '_blank'; c.rel = 'noopener noreferrer'; }
      var v = c.querySelector('.dv-chv'); if (!v) return;
      v.textContent = k === 'mail' ? h.replace('mailto:', '') : k === 'tel' ? h.replace('tel:', '') : k === 'wa' ? '+' + h.replace(/\D/g, '') : h.replace(/^https?:\/\/(www\.)?/, '');
    });

    /* Collaboration form: opens the visitor's email app */
    var old = $('#dvEForm'); if (!old) return;
    var f = old.cloneNode(true); old.parentNode.replaceChild(f, old);
    var email = 'chris.johnson@oxford.edu'; /* where collaboration requests are delivered */
    var mailLink = document.querySelector('.dv-foot .dv-s-mail');
    if (mailLink) email = (mailLink.getAttribute('href') || '').replace('mailto:', '') || email;
    function bad(id, eid, msg) { $(id).setAttribute('aria-invalid', 'true'); $(eid).textContent = msg; return false; }
    function good(id, eid) { $(id).removeAttribute('aria-invalid'); $(eid).textContent = ''; return true; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#eHp').value) return;
      var n = $('#eName').value.trim(), m = $('#eMail').value.trim(), o = $('#eOrg').value.trim(), r = $('#eRole').value, i = $('#eInt').value, t = $('#eMsg').value.trim();
      var ok1 = n.length > 1 ? good('#eName', '#eNameE') : bad('#eName', '#eNameE', 'Please add your full name.');
      var ok2 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m) ? good('#eMail', '#eMailE') : bad('#eMail', '#eMailE', 'Please add your email address so a reply can reach you.');
      var ok3 = t.length > 9 ? good('#eMsg', '#eMsgE') : bad('#eMsg', '#eMsgE', 'Please add a short message (at least 10 characters).');
      if (!(ok1 && ok2 && ok3)) { var first = f.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
      var body = 'Name: ' + n + '\nEmail: ' + m + '\nInstitution: ' + (o || 'Not given') + '\nRole: ' + r + '\nInterest: ' + i + '\n\n' + t;
      window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Collaboration: ' + i + ' | The Prophetic Witness') + '&body=' + encodeURIComponent(body);
      toast('Opening your email app.');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
