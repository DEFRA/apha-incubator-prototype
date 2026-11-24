// Adds the preparedness breakdown behind the single status, for the table and the cards.
// Illustrative figures. The status stays the headline and the breakdown is shown on request, so the front page stays simple.
// Option to consider later: show the breakdown by default, once the two areas are firmed up and known to be helpful.
// The two area names are placeholders until the team agrees names. Needs JavaScript: without it only the status is shown.
;(function () {
  var AREA_NAMES = ['Stopping it arriving', 'Responding if it arrives']
  var TOTAL = 10

  // Items in place, out of 10, for each area, per disease.
  var data = {
    'african-swine-fever': [1, 2],
    'hpai': [3, 4],
    'foot-and-mouth-disease': [5, 6],
    'african-horse-sickness': [8, 7],
    'bluetongue-virus': [10, 10]
  }

  // Alternative for testing: add ?preparedness=percentage to the priority view address to show percentages instead of counts.
  var PERCENT = new URLSearchParams(window.location.search).get('preparedness') === 'percentage'

  function build(slug, name) {
    var counts = data[slug]
    if (!counts) return null
    var details = document.createElement('details')
    details.className = 'govuk-details app-breakdown'
    var html = '<summary class="govuk-details__summary"><span class="govuk-details__summary-text">What makes up this status<span class="govuk-visually-hidden"> for ' + name + '</span></span></summary><div class="govuk-details__text">'
    counts.forEach(function (done, i) {
      var left = TOTAL - done
      // Under half in place is flagged. Exactly half is not.
      var flag = done < TOTAL / 2
      var pct = Math.round(done / TOTAL * 100)
      if (PERCENT) {
        html += '<div class="app-done"><p class="app-done__name">' + AREA_NAMES[i] + '</p>' +
          '<p class="app-done__line"><strong>' + pct + '%</strong> of actions complete</p>' +
          '<div class="app-done__bar app-done__bar--pct" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
          '<p class="app-done__line"><strong class="app-todo' + (flag ? ' app-todo--more' : '') + '">' + (100 - pct) + '% still to do</strong></p></div>'
        return
      }      html += '<div class="app-done"><p class="app-done__name">' + AREA_NAMES[i] + '</p>' +
        '<p class="app-done__line"><strong>' + done + ' of ' + TOTAL + '</strong> actions complete</p>' +
        '<div class="app-done__bar" aria-hidden="true">'
      for (var n = 0; n < TOTAL; n++) html += '<span class="' + (n < done ? 'app-done__on' : '') + '"></span>'
      html += '</div><p class="app-done__line"><strong class="app-todo' + (flag ? ' app-todo--more' : '') + '">' + left + ' actions still to do</strong></p></div>'
    })
    html += '<p class="govuk-body app-breakdown__link"><a class="govuk-link" href="preparedness.html">What are these actions?<span class="govuk-visually-hidden"> for ' + name + '</span></a></p>'
    details.innerHTML = html + '</div>'
    return details
  }

  // Most links carry ?disease=slug. The African swine fever link goes to its own page, so use the page name.
  function slugOf(link) {
    var fromQuery = new URLSearchParams(link.search).get('disease')
    if (fromQuery) return fromQuery
    var m = link.pathname.match(/disease-([a-z-]+)\.html$/)
    return m ? m[1] : null
  }

  document.querySelectorAll('#priority-table tbody tr').forEach(function (row) {
    var link = row.querySelector('th a')
    var slug = slugOf(link)
    var cell = row.querySelector('td[data-label="Preparedness"]')
    var details = build(slug, row.querySelector('th').getAttribute('data-sort-value'))
    if (cell && details) cell.appendChild(details)
  })

  document.querySelectorAll('.app-card').forEach(function (card) {
    var slug = slugOf(card.querySelector('.app-more-summary'))
    var item = Array.prototype.filter.call(card.querySelectorAll('dl > div'), function (d) {
      return d.querySelector('dt').firstChild.textContent.trim() === 'Preparedness'
    })[0]
    var details = build(slug, card.querySelector('h4').textContent)
    if (!item || !details) return
    var dd = item.querySelector('dd')
    dd.insertBefore(details, dd.querySelector('br'))
  })
})()
