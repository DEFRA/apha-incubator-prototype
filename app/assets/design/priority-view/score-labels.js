// Adds a word to each 1 to 5 measure score, so "1 out of 5" also reads "Very low".
;(function () {
  var levels = ['Very low', 'Low', 'Medium', 'High', 'Very high']
  document.querySelectorAll('.app-score').forEach(function (score) {
    var level = levels[parseInt(score.textContent, 10) - 1]
    if (!level) return
    var label = document.createElement('span')
    label.className = 'app-level'
    label.textContent = level
    score.insertAdjacentElement('afterend', label)
  })
})()
