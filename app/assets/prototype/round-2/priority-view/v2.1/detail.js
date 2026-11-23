// Shared by the v2.1 detail pages. Puts the disease name from the address into the heading and the links between pages.
;(function () {
  var diseases = {
    'sprouting-hoof-disease': 'Sprouting hoof disease',
    'himalayan-dragon-pox': 'Himalayan Dragon Pox',
    'rainbow-tail-disease': 'Rainbow tail disease',
    'fuzzy-fox-flu': 'Fuzzy fox flu',
    'wing-wobble': 'Wing wobble'
  }
  var slug = new URLSearchParams(location.search).get('disease')
  var name = diseases[slug]
  if (!name) return

  var heading = document.getElementById('name')
  if (heading.hasAttribute('data-prefix')) {
    heading.textContent = heading.textContent + ' for ' + name
  } else {
    heading.textContent = name
  }
  document.title = heading.textContent + ' – Disease threat intelligence'

  document.querySelectorAll('[data-keep-disease]').forEach(function (a) {
    a.href = a.getAttribute('href').split('?')[0] + '?disease=' + slug
  })
  var back = document.querySelector('[data-disease-page]')
  if (back) back.href = 'disease.html?disease=' + slug
})()
