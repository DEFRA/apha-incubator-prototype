// Adds the preparedness breakdown behind the single status, for the table and the cards.
// Illustrative figures. The status stays the headline and the breakdown is shown on request, so the front page stays simple.
// Option to consider later: show the breakdown by default, once the two areas are firmed up and known to be helpful.
// The two area names are placeholders until the team agrees names. Needs JavaScript: without it only the status is shown.
;(function () {
  var AREA_NAMES = ['Stopping it arriving', 'Responding if it arrives']
  var TOTAL = 10

  // Items in place, out of 10, for each area, per disease.
  var data = {
    'sprouting-hoof-disease': [1, 2],
    'himalayan-dragon-pox': [3, 4],
    'rainbow-tail-disease': [5, 6],
    'fuzzy-fox-flu': [8, 7],
    'wing-wobble': [10, 10]
  }

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
      html += '<div class="app-done"><p class="app-done__name">' + AREA_NAMES[i] + '</p>' +
        '<p class="app-done__line"><strong>' + done + ' of ' + TOTAL + '</strong> in place</p>' +
        '<div class="app-done__bar" aria-hidden="true">'
      for (var n = 0; n < TOTAL; n++) html += '<span class="' + (n < done ? 'app-done__on' : '') + '"></span>'
      html += '</div><p class="app-done__line"><strong class="app-todo' + (flag ? ' app-todo--more' : '') + '">' + left + ' still to do</strong></p></div>'
    })
    details.innerHTML = html + '</div>'
    return details
  }

  document.querySelectorAll('#priority-table tbody tr').forEach(function (row) {
    var link = row.querySelector('th a')
    var slug = new URLSearchParams(link.search).get('disease')
    var cell = row.querySelector('td[data-label="Preparedness"]')
    var details = build(slug, row.querySelector('th').getAttribute('data-sort-value'))
    if (cell && details) cell.appendChild(details)
  })

  document.querySelectorAll('.app-card').forEach(function (card) {
    var slug = new URLSearchParams(card.querySelector('.app-more-summary').search).get('disease')
    var item = Array.prototype.filter.call(card.querySelectorAll('dl > div'), function (d) {
      return d.querySelector('dt').firstChild.textContent.trim() === 'Preparedness'
    })[0]
    var details = build(slug, card.querySelector('h4').textContent)
    if (!item || !details) return
    var dd = item.querySelector('dd')
    dd.insertBefore(details, dd.querySelector('br'))
  })
})()
