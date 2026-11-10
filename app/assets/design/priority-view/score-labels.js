// Adds a word to each 1 to 5 measure score, so "1 out of 5" also reads "Very low".
// In tables the word leads, as a muted colour block, followed by the number.
;(function () {
  var levels = ['Very low', 'Low', 'Medium', 'High', 'Very high']
  document.querySelectorAll('.app-score').forEach(function (score) {
    var value = parseInt(score.textContent, 10)
    var level = levels[value - 1]
    if (!level) return

    if (score.closest('td')) {
      var tag = document.createElement('strong')
      tag.className = 'govuk-tag app-level-tag app-level-tag--' + value
      tag.textContent = level
      score.insertAdjacentElement('beforebegin', tag)
      score.classList.add('app-score--after-tag')
      return
    }

    var label = document.createElement('span')
    label.className = 'app-level'
    label.textContent = level
    score.insertAdjacentElement('afterend', label)
  })
})()
