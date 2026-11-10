// Draws the small wireframes in the user flow diagrams, so each screen is described once and reused.
;(function () {
  var diseases = [
    { band: 'act', rank: 1, risk: 1, imp: 4, c: 3, r: 2 },
    { band: 'pri', rank: 2, risk: 2, imp: 3, c: 5, r: 4 },
    { band: 'pri', rank: 3, risk: 2, imp: 3, c: 4, r: 6 },
    { band: 'mon', rank: 4, risk: 3, imp: 3, c: 6, r: 7 },
    { band: 'mai', rank: 5, risk: 3, imp: 3, c: 8, r: 9 }
  ]
  var header = '<div class="gb">Animal and Plant Health Agency</div>'
  function ln(cls) {
    return '<div class="ln ' + (cls || '') + '"></div>'
  }
  function tabs(active) {
    var t = ['Priority', 'Risk', 'Impact', 'Prep.']
    return (
      '<div class="tabs">' +
      t
        .map(function (x, i) {
          return (
            '<span' + (i === active ? ' class="on"' : '') + '>' + x + '</span>'
          )
        })
        .join('') +
      '</div>'
    )
  }
  function priority(el) {
    var cards = el.dataset.view === 'cards'
    var h =
      header +
      '<div class="bd">' +
      tabs(0) +
      '<div class="tx" style="font-size:9px">Diseases by priority</div>' +
      '<div class="switch"><span' +
      (cards ? '' : ' class="on"') +
      '>Table</span><span' +
      (cards ? ' class="on"' : '') +
      '>Cards</span></div>'
    if (cards) {
      h +=
        '<div class="cards">' +
        diseases
          .map(function (d) {
            return (
              '<div class="card ' +
              d.band +
              '">' +
              ln('k w80') +
              ln('w50') +
              ln('w70') +
              '</div>'
            )
          })
          .join('') +
        '</div>'
    } else {
      diseases.forEach(function (d) {
        h +=
          '<div class="rowf"><span class="rk">' +
          d.rank +
          '</span><div class="ln k" style="width:40%"></div><span class="band b-' +
          d.band +
          '"></span>' +
          '<div class="bar" style="width:16%;margin:0"><i style="width:' +
          d.c * 10 +
          '%"></i></div></div>'
      })
    }
    el.innerHTML = h + '</div>'
  }
  function disease(el) {
    el.innerHTML =
      header +
      '<div class="bd">' +
      tabs(-1) +
      '<div class="tx" style="font-size:9px">Sprouting hoof disease</div>' +
      '<div class="rowf" style="margin-top:3px"><span class="band b-act"></span><span class="tx">75 / 140</span></div>' +
      '<div class="tiles">' +
      '<div class="tile"><div class="tx">Risk</div><div class="tx v">Low</div></div>' +
      '<div class="tile"><div class="tx">Impact</div><div class="tx v">Very high</div></div>' +
      '<div class="tile"><div class="tx">Control</div><div class="tx v">3 / 10</div></div>' +
      '<div class="tile"><div class="tx">Response</div><div class="tx v">2 / 10</div></div>' +
      '</div><div class="xlinks"><div class="ln k w70"></div><div class="ln k w60"></div></div></div>'
  }
  function measure(el) {
    var k = el.dataset.kind,
      idx = { risk: 1, impact: 2, prep: 3 }[k]
    var h = header + '<div class="bd">' + tabs(idx)
    diseases.forEach(function (d) {
      h += '<div class="rowf"><div class="ln k" style="width:36%"></div>'
      if (k === 'risk')
        h +=
          '<span class="cell on" style="width:' +
          (8 * d.risk + 4) +
          'px"></span><span class="cell" style="width:14px"></span>'
      if (k === 'impact')
        h +=
          '<span class="cell on" style="width:' +
          (8 * (d.imp - 1) + 6) +
          'px"></span><div class="ln" style="width:22%"></div>'
      if (k === 'prep')
        h +=
          '<div class="bar" style="width:24%;margin:0"><i style="width:' +
          d.c * 10 +
          '%"></i></div><div class="bar" style="width:24%;margin:0"><i style="width:' +
          d.r * 10 +
          '%"></i></div>'
      h += '</div>'
    })
    el.innerHTML = h + '</div>'
  }
  var fn = { priority: priority, disease: disease, measure: measure }
  document.querySelectorAll('.uf-journey .screen').forEach(function (el) {
    el.setAttribute('aria-hidden', 'true')
    fn[el.dataset.screen](el)
  })
})()
