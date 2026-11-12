(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = 'https://www.clarity.ms/tag/' + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, 'clarity', 'script', 'zckja1zeht');

window.clarity('consentv2', {
  ad_Storage: 'denied',
  analytics_Storage: 'denied'
});

try {
  window.localStorage.removeItem('menus-clarity-consent');
} catch (error) {
  console.warn('No se pudo borrar la preferencia anterior de Clarity.', error);
}
