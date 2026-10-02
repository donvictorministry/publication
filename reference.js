(function () {
  if (!window.dvCore) return;
  var REFS = [
    'Creswell, J. W. (2014). <em>Research Design: Qualitative, Quantitative, and Mixed Methods Approaches</em>. SAGE Publications.',
    'Elshtain, J. B. (1995). <em>Democracy on Trial</em>. Basic Books.',
    'Gerth, H. H., &amp; Mills, C. W. (Eds.). (1946). <em>From Max Weber: Essays in Sociology</em>. Oxford University Press.',
    'Holmes, A. F. (1987). <em>The Idea of a Christian College</em>. William B. Eerdmans Publishing Company.',
    'Niebuhr, H. R. (1951). <em>Christ and Culture</em>. Harper &amp; Row.',
    'Palmer, P. J. (1998). <em>The Courage to Teach: Exploring the Inner Landscape of a Teacher\'s Life</em>. Jossey-Bass.',
    'Putnam, R. D. (2000). <em>Bowling Alone: The Collapse and Revival of American Community</em>. Simon &amp; Schuster.',
    'The Holy Bible, King James Version. (1611).'
  ];
  window.dvCore.register({ id: 'references', title: 'References', order: 5, render: function (el) {
    el.innerHTML = '<h2>References</h2><ul class="dv-refs">' + REFS.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul>';
  } });
})();
