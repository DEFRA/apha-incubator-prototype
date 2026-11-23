// Shows risk of incursion, impact and preparedness as a name in a muted colour block.
// The number in the markup picks the name and is then removed.
// Risk has six levels, impact has five. Preparedness (when it is one measure) has five statuses, most prepared first.
// Red always means the worse end: a very high risk, a severe impact, or not at all prepared.
;(function () {
  var groups = {
    'Risk of incursion': {
      names: ['Negligible', 'Very low', 'Low', 'Medium', 'High', 'Very high'],
      classes: ['1', '2', '3', 'mid', '4', '5']
    },
    Impact: {
      names: ['Insignificant', 'Minor', 'Significant', 'Major', 'Severe'],
      classes: ['1', '2', '3', '4', '5']
    },
    Preparedness: {
      names: ['Totally prepared', 'Largely prepared', 'Moderately prepared', 'Slightly prepared', 'Not at all prepared'],
      classes: ['1', '2', '3', '4', '5']
    }
  }

  function measureName(score) {
    var cell = score.closest('td')
    if (cell) return cell.getAttribute('data-label')
    var item = score.closest('div')
    var term = item && item.querySelector('dt')
    return term ? term.firstChild.textContent.trim() : ''
  }

  document.querySelectorAll('.app-score').forEach(function (score) {
    var value = parseInt(score.textContent, 10)
    var group = groups[measureName(score)]
    if (!group || !group.names[value - 1]) return

    var tag = document.createElement('strong')
    tag.className = 'govuk-tag app-level-tag app-level-tag--' + group.classes[value - 1]
    tag.textContent = group.names[value - 1]
    score.replaceWith(tag)
  })
})()
