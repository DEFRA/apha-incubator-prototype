// Draws the small wireframes in the user flow diagrams, so each screen is described once and reused.
;(function () {
  var diseases = [
    { band: 'act', rank: 1, risk: 1, imp: 5, c: 2, r: 1 },
    { band: 'pri', rank: 2, risk: 3, imp: 4, c: 3, r: 2 },
    { band: 'pri', rank: 3, risk: 3, imp: 4, c: 2, r: 3 },
    { band: 'mon', rank: 4, risk: 4, imp: 4, c: 3, r: 4 },
    { band: 'mai', rank: 5, risk: 4, imp: 4, c: 4, r: 5 }
  ]
  var header = '<div class="gb">Animal and Plant Health Agency</div>'
  function ln(cls) {
    return '<div class="ln ' + (cls || '') + '"></div>'
  }
  function tabs(active) {
    var t = ['Priority', 'Risk', 'Impact', 'Control', 'Resp.']
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
          d.c * 20 +
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
      '<div class="rowf" style="margin-top:3px"><span class="band b-act"></span><span class="tx">4.8 / 5</span></div>' +
      '<div class="tiles">' +
      '<div class="tile"><div class="tx">Risk</div><div class="tx v">1 / 5</div></div>' +
      '<div class="tile"><div class="tx">Impact</div><div class="tx v">5 / 5</div></div>' +
      '<div class="tile"><div class="tx">Control</div><div class="tx v">2 / 5</div></div>' +
      '<div class="tile"><div class="tx">Response</div><div class="tx v">1 / 5</div></div>' +
      '</div><div class="xlinks"><div class="ln k w70"></div><div class="ln k w60"></div></div></div>'
  }
  function measure(el) {
    var k = el.dataset.kind,
      idx = { risk: 1, impact: 2, control: 3, response: 4 }[k]
    var h = header + '<div class="bd">' + tabs(idx)
    diseases.forEach(function (d) {
      var score = { risk: d.risk, impact: d.imp, control: d.c, response: d.r }[
        k
      ]
      h +=
        '<div class="rowf"><div class="ln k" style="width:36%"></div>' +
        '<div class="bar" style="width:40%;margin:0"><i style="width:' +
        score * 20 +
        '%"></i></div></div>'
    })
    el.innerHTML = h + '</div>'
  }
  var fn = { priority: priority, disease: disease, measure: measure }
  document.querySelectorAll('.uf-journey .screen').forEach(function (el) {
    el.setAttribute('aria-hidden', 'true')
    fn[el.dataset.screen](el)
  })
})()
