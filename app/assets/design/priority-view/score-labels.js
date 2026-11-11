// Shows risk of incursion and impact as a group name in a muted colour block, using the 5x5 risk matrix groups.
// The 1 to 5 number in the markup is used to pick the name and is then removed.
;(function () {
  var groups = {
    'Risk of incursion': [
      'Rare',
      'Unlikely',
      'Moderate',
      'Likely',
      'Almost certain'
    ],
    Impact: ['Insignificant', 'Minor', 'Significant', 'Major', 'Severe']
  }
  var fallback = ['Very low', 'Low', 'Medium', 'High', 'Very high']

  function measureName(score) {
    var cell = score.closest('td')
    if (cell) return cell.getAttribute('data-label')
    var item = score.closest('div')
    var term = item && item.querySelector('dt')
    return term ? term.textContent.trim() : ''
  }

  document.querySelectorAll('.app-score').forEach(function (score) {
    var value = parseInt(score.textContent, 10)
    var names = groups[measureName(score)] || fallback
    var name = names[value - 1]
    if (!name) return

    var tag = document.createElement('strong')
    tag.className = 'govuk-tag app-level-tag app-level-tag--' + value
    tag.textContent = name
    score.replaceWith(tag)
  })
})()
