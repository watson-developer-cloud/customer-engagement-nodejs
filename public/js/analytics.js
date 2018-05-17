function loadAnalytics() {
  var idaScript = document.createElement('script'); // eslint-disable-line no-var
  idaScript.src = '//www.ibm.com/common/stats/ida_stats.js';
  document.head.appendChild(idaScript);
}

window.addEventListener('load', loadAnalytics);
