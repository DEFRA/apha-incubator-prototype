// Draws the small wireframes in the user flow diagrams, so each screen is described once and reused.
;(function () {
  // Illustrative data in the order of Option C: sorted by priority score out of 25. c and r are items still to review, out of 10 and 8.
  var diseases = [
    { band: 'act', score: 20, risk: 'Almost certain', imp: 'Major', c: 9, r: 7 },
    { band: 'act', score: 15, prev: 12, risk: 'Confirmed in the UK', confirmed: true, imp: 'Significant', c: 8, r: 5 },
    { band: 'pri', score: 12, prev: 16, risk: 'Moderate', imp: 'Major', c: 6, r: 6 },
    { band: 'pri', score: 10, risk: 'Unlikely', imp: 'Severe', c: 7, r: 4 },
    { band: 'mon', score: 8, risk: 'Likely', imp: 'Minor', c: 5, r: 2 }
  ]
  var CONTROL_TOTAL = 10,
    RESPONSE_TOTAL = 8
  function seg(out, total) {
    return (
      '<span class="seg" style="--n:' + total + ';--out:' + out + '"></span>'
    )
  }
    function risk(d, short) {
    return (
      '<div class="tx s' +
      (d.confirmed ? ' ptag' : '') +
      '">' +
      (d.confirmed && short ? 'In UK' : d.risk) +
      '</div>'
    )
  }
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
      (cards ? ' class="on"' : '') +
      '>Cards</span><span' +
      (cards ? '' : ' class="on"') +
      '>Table</span></div>'
    if (cards) {
      h +=
        '<div class="cards">' +
        diseases
          .map(function (d) {
            return (
              '<div class="card ' +
              d.band +
              '">' +
              ln('d w80') +
              ln('k w50') +
              '<div class="tx s">Score ' +
              d.score +
              ' out of 25</div>' +
              (d.prev ? '<div class="tx s m">Previous score ' + d.prev + '</div>' : '') +
              ln('w60') +
              risk(d) +
              '<div class="tx s">' +
              d.imp +
              '</div>' +
              seg(d.c, CONTROL_TOTAL) +
              seg(d.r, RESPONSE_TOTAL) +
              '</div>'
            )
          })
          .join('') +
        '</div>'
    } else {
      diseases.forEach(function (d) {
        h +=
          '<div class="rowf top"><div class="c1">' +
          ln('d w80') +
          ln('k w60') +
          '</div><div class="c2"><span class="band b-' +
          d.band +
          '"></span><div class="tx s">' +
          d.score +
          '/25</div>' +
          (d.prev ? ln('w60') : '') +
          ln('w50') +
          '</div><div class="c3">' +
          risk(d, true) +
          '</div><div class="c4"><div class="tx s">' +
          d.imp +
          '</div></div><div class="c5">' +
          seg(d.c, CONTROL_TOTAL) +
          '</div><div class="c6">' +
          seg(d.r, RESPONSE_TOTAL) +
          '</div></div>'
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
      '<div class="rowf" style="margin-top:3px"><span class="band b-act"></span><span class="tx s">Priority score 20 out of 25</span></div>' +
      ln('w50') +
      '<div class="tiles">' +
      '<div class="tile"><div class="tx s m">Risk</div><div class="tx s">Almost certain</div></div>' +
      '<div class="tile"><div class="tx s m">Impact</div><div class="tx s">Major</div></div>' +
      '<div class="tile"><div class="tx s m">Control</div><div class="tx s">9 of 10 to review</div>' +
      seg(9, CONTROL_TOTAL) +
      '</div>' +
      '<div class="tile"><div class="tx s m">Response</div><div class="tx s">7 of 8 to review</div>' +
      seg(7, RESPONSE_TOTAL) +
      '</div>' +
      '</div><div class="xlinks"><div class="ln k w70"></div><div class="ln k w60"></div></div></div>'
  }
  function measure(el) {
    var k = el.dataset.kind,
      idx = { risk: 1, impact: 2, control: 3, response: 4 }[k]
    var h = header + '<div class="bd">' + tabs(idx)
    diseases.forEach(function (d) {
      var value = {
        risk: risk(d),
        impact: '<div class="tx s">' + d.imp + '</div>',
        control: seg(d.c, CONTROL_TOTAL),
        response: seg(d.r, RESPONSE_TOTAL)
      }[k]
      h +=
        '<div class="rowf"><div class="ln d" style="width:36%"></div>' +
        '<div style="width:40%">' +
        value +
        '</div></div>'
    })
    el.innerHTML = h + '</div>'
  }
  var fn = { priority: priority, disease: disease, measure: measure }
  document.querySelectorAll('.uf-journey .screen').forEach(function (el) {
    el.setAttribute('aria-hidden', 'true')
    fn[el.dataset.screen](el)
  })
})()
