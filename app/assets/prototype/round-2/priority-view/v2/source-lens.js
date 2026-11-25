// Case management references are a comparison lens: off by default, on with ?source=case, off again with ?source=none.
(function () {
  var q = new URLSearchParams(location.search).get('source');
  try {
    if (q === 'case') sessionStorage.setItem('app-source', 'case');
    if (q === 'none') sessionStorage.removeItem('app-source');
  } catch (e) {}
  var on = false;
  try { on = sessionStorage.getItem('app-source') === 'case'; } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    if (on) document.body.classList.add('app-source-on');
    var bar = document.querySelector('.app-hub-bar');
    if (!bar) return;
    var url = new URL(location.href);
    url.searchParams.set('source', on ? 'none' : 'case');
    var a = document.createElement('a');
    a.href = url.pathname + url.search;
    a.style.marginLeft = '16px';
    a.textContent = on ? 'Case management links on: turn off' : 'Case management links off (default): turn on';
    bar.appendChild(a);
  });
})();
