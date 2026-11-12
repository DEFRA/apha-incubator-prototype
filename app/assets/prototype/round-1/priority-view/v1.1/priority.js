// Priority view prototype v1.1. Shared by both preparedness variants.
// Progressive enhancement. Without JavaScript the table is shown on its own and the header links are plain links.
;(function () {
  var table = document.getElementById('priority-table')
  var body = table.tBodies[0]
  var heads = Array.prototype.slice.call(table.querySelectorAll('th[data-key]'))
  var status = document.getElementById('view-status')
  var cols = {}
  var names = {}
  heads.forEach(function (th) {
    cols[th.dataset.key] = th.cellIndex
    names[th.dataset.key] = th.querySelector('a').textContent.toLowerCase()
  })
  var views = { table: document.getElementById('view-table'), cards: document.getElementById('view-cards') }
  var toggle = document.getElementById('view-toggle')
  var buttons = Array.prototype.slice.call(toggle.querySelectorAll('button'))
  var q = new URLSearchParams(location.search)

  function updateUrl(changes) {
    var p = new URLSearchParams(location.search)
    Object.keys(changes).forEach(function (k) { p.set(k, changes[k]) })
    history.replaceState(null, '', '?' + p.toString())
    keepVariantLink()
  }

  // The link to the other preparedness variant keeps the chosen view and sort, so you can compare like with like.
  function keepVariantLink() {
    var other = document.getElementById('variant-link')
    if (other) other.href = other.getAttribute('href').split('?')[0] + location.search
  }

  // A light tint on the sorted column. The arrow and aria-sort carry the state too, so colour is not the only cue.
  function markSorted(key) {
    Array.prototype.forEach.call(table.rows, function (row) {
      Array.prototype.forEach.call(row.cells, function (cell, i) {
        cell.classList.toggle('app-sorted', i === cols[key])
      })
    })
  }

  function value(row, key) {
    var v = row.cells[cols[key]].getAttribute('data-sort-value')
    return key === 'disease' ? v.toLowerCase() : Number(v)
  }

  function sortBy(key, order, announce) {
    var rows = Array.prototype.slice.call(body.rows)
    rows.sort(function (a, b) {
      var x = value(a, key)
      var y = value(b, key)
      var d = x < y ? -1 : x > y ? 1 : 0
      if (order === 'descending') d = -d
      return d || (Number(a.dataset.rank) - Number(b.dataset.rank))
    })
    rows.forEach(function (r) { body.appendChild(r) })
    heads.forEach(function (th) {
      var on = th.dataset.key === key
      th.setAttribute('aria-sort', on ? order : 'none')
      var next = on ? (order === 'ascending' ? 'descending' : 'ascending') : th.dataset.first
      th.querySelector('a').setAttribute('href', '?sort=' + th.dataset.key + '&order=' + next)
    })
    if (announce) status.textContent = 'Sorted by ' + names[key] + ', ' + order
    markSorted(key)
  }

  function setView(view, announce) {
    views.table.hidden = view !== 'table'
    views.cards.hidden = view !== 'cards'
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === view)) })
    if (announce) status.textContent = 'Showing the ' + view + ' view'
  }

  heads.forEach(function (th) {
    th.querySelector('a').addEventListener('click', function (e) {
      e.preventDefault()
      var key = th.dataset.key
      var current = th.getAttribute('aria-sort')
      var order = current === 'none' ? th.dataset.first : (current === 'ascending' ? 'descending' : 'ascending')
      sortBy(key, order, true)
      updateUrl({ sort: key, order: order })
    })
  })

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      setView(b.dataset.view, true)
      updateUrl({ view: b.dataset.view })
    })
  })

  toggle.hidden = false
  keepVariantLink()
  markSorted('priority')
  if (cols.hasOwnProperty(q.get('sort')) && /^(ascending|descending)$/.test(q.get('order'))) {
    sortBy(q.get('sort'), q.get('order'), false)
  }

  // Table by default. On a small screen, where sorting isn't available, start on cards.
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

  // Adds a "More details" link after each measure on the cards. The hidden text says which measure and disease it is for,
  // so the links make sense one at a time, for example when a screen reader lists the links on the page.
  document.querySelectorAll('.app-card').forEach(function (card) {
    var title = card.querySelector('h4')
    var slug = new URLSearchParams(card.querySelector('.app-more-summary').search).get('disease')
    card.querySelectorAll('dl > div').forEach(function (item) {
      var measure = item.querySelector('dt').firstChild.textContent.trim()
      var link = document.createElement('a')
      link.className = 'govuk-link app-more'
      link.href = 'not-in-test.html?page=disease&disease=' + slug + '&measure=' + encodeURIComponent(measure.toLowerCase())
      link.innerHTML = 'More details<span class="govuk-visually-hidden"> about ' + measure.toLowerCase() + ' for ' + title.textContent + '</span>'
      item.querySelector('dd').appendChild(link)
    })
  })
})()
