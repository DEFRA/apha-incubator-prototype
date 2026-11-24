// Priority view prototype v2.
// Progressive enhancement. Without JavaScript the table is shown on its own and the column headings are plain links.
// Sorting was removed in v2: the column headings now link to the detail pages instead.
;(function () {
  var table = document.getElementById('priority-table')
  var status = document.getElementById('view-status')
  var views = { table: document.getElementById('view-table'), cards: document.getElementById('view-cards') }
  var toggle = document.getElementById('view-toggle')
  var buttons = Array.prototype.slice.call(toggle.querySelectorAll('button'))
  var q = new URLSearchParams(location.search)

  function updateUrl(changes) {
    var p = new URLSearchParams(location.search)
    Object.keys(changes).forEach(function (k) { p.set(k, changes[k]) })
    history.replaceState(null, '', '?' + p.toString())
  }

  function setView(view, announce) {
    views.table.hidden = view !== 'table'
    views.cards.hidden = view !== 'cards'
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === view)) })
    if (announce) status.textContent = 'Showing the ' + view + ' view'
    updateScrollRegion()
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      setView(b.dataset.view, true)
      updateUrl({ view: b.dataset.view })
    })
  })

  // Says which column a value belongs to at the start of each cell, for example "Risk of incursion: Medium". Screen readers
  // that read in a straight line, and reader modes, give a cell like "Medium" with no column heading otherwise.
  // On small screens the stacked layout already shows the label, so the hidden text is switched off there in the styles.
  Array.prototype.forEach.call(table.querySelectorAll('tbody td[data-label]'), function (cell) {
    var label = document.createElement('span')
    label.className = 'govuk-visually-hidden app-cell-label'
    label.textContent = cell.getAttribute('data-label') + ': '
    cell.insertBefore(label, cell.firstChild)
  })

  // The scroll region is only a tab stop and a landmark when the table really is wider than the space it has,
  // for example when text is enlarged. Otherwise it would be an empty stop for keyboard and screen reader users.
  var scrollRegion = table.parentNode
  function updateScrollRegion () {
    if (scrollRegion.scrollWidth > scrollRegion.clientWidth + 1) {
      scrollRegion.setAttribute('tabindex', '0')
      scrollRegion.setAttribute('role', 'region')
      scrollRegion.setAttribute('aria-label', 'Priority table, scrolls sideways')
    } else {
      scrollRegion.removeAttribute('tabindex')
      scrollRegion.removeAttribute('role')
      scrollRegion.removeAttribute('aria-label')
    }
  }
  updateScrollRegion()
  window.addEventListener('resize', updateScrollRegion)

  toggle.hidden = false

  // Table by default. On a small screen, start on cards.
  // view=both shows the table and then the cards, for printing or saving as a PDF.
  var small = window.matchMedia('(max-width: 40.0525em)').matches
  if (q.get('view') === 'both') {
    document.body.classList.add('app-both')
    toggle.hidden = true
    views.table.hidden = false
    views.cards.hidden = false
    Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) { d.open = true })
  } else {
    setView(q.get('view') === 'cards' || (small && q.get('view') !== 'table') ? 'cards' : 'table', false)
  }

  // Adds a "More details" link after each measure on the cards, to the detail page for that measure. The hidden text says
  // which measure and disease it is for, so the links make sense one at a time, for example in a list of links.
  var pages = { 'risk of incursion': 'risk.html', impact: 'impact.html', preparedness: 'preparedness.html' }
  document.querySelectorAll('.app-card').forEach(function (card) {
    var title = card.querySelector('h4')
    var href = card.querySelector('.app-more-summary').getAttribute('href')
    var slug = /african-swine-fever/.test(href) ? 'african-swine-fever' : new URLSearchParams(card.querySelector('.app-more-summary').search).get('disease')
    card.querySelectorAll('dl > div').forEach(function (item) {
      var measure = item.querySelector('dt').firstChild.textContent.trim()
      var link = document.createElement('a')
      link.className = 'govuk-link app-more'
      link.href = (slug === 'african-swine-fever' && measure === 'Risk of incursion') ? 'risk-african-swine-fever.html' : pages[measure.toLowerCase()] + '?disease=' + slug
      link.innerHTML = 'More details<span class="govuk-visually-hidden"> about ' + measure.toLowerCase() + ' for ' + title.textContent + '</span>'
      // The link stays in the same cell as the status, with a line break before it, so the two read on separate lines
      // without styles (for example in reader mode). Reader modes can drop a block that holds only a link.
      var dd = item.querySelector('dd')
      dd.appendChild(document.createElement('br'))
      dd.appendChild(link)
    })
  })
})()
