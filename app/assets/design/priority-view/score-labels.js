// Shows risk of incursion and impact as a level word in a muted colour block (Very low to Very high).
// The 1 to 5 number in the markup is used to pick the word and is then removed.
;(function () {
  var levels = ['Very low', 'Low', 'Medium', 'High', 'Very high']
  document.querySelectorAll('.app-score').forEach(function (score) {
    var value = parseInt(score.textContent, 10)
    var level = levels[value - 1]
    if (!level) return

    var tag = document.createElement('strong')
    tag.className = 'govuk-tag app-level-tag app-level-tag--' + value
    tag.textContent = level
    score.replaceWith(tag)
  })
})()
