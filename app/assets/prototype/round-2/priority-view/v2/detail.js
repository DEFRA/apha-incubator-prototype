// Shared by the v2 detail pages. Puts the disease name from the address into the heading and the links between pages.
;(function () {
  var diseases = {
    'african-swine-fever': 'African swine fever',
    'hpai': 'Highly pathogenic avian influenza (HPAI)',
    'foot-and-mouth-disease': 'Foot and mouth disease',
    'african-horse-sickness': 'African horse sickness',
    'bluetongue-virus': 'Bluetongue virus'
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
  if (slug === 'african-swine-fever') {
    var risk = document.querySelector('[data-risk-link]')
    if (risk) risk.href = 'risk-african-swine-fever.html'
  }
  var back = document.querySelector('[data-disease-page]')
  if (back) back.href = 'disease.html?disease=' + slug
})()
