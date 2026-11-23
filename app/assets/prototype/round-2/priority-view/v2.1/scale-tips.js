// Adds an "i" toggletip beside each measure title, in the table headings and on the cards.
// It shows every level of that measure in order, so each label reads next to the others. It does not define the labels.
// Needs JavaScript. Without it the key further down the page is still there.
;(function () {
  var scales = {
    risk: {
      title: 'Risk of incursion',
      order: 'Lowest risk first',
      names: ['Negligible', 'Very low', 'Low', 'Medium', 'High', 'Very high'],
      classes: ['1', '2', '3', 'mid', '4', '5']
    },
    impact: {
      title: 'Impact',
      order: 'Lowest impact first',
      names: ['Insignificant', 'Minor', 'Significant', 'Major', 'Severe'],
      classes: ['1', '2', '3', '4', '5']
    },
    preparedness: {
      title: 'Preparedness',
      order: 'Most prepared first',
      names: ['Totally prepared', 'Largely prepared', 'Moderately prepared', 'Slightly prepared', 'Not at all prepared'],
      classes: ['1', '2', '3', '4', '5']
    }
  }
  // Priority is a score with four labels, so it has its own content.
  var priority = {
    title: 'Priority',
    html: '<span class="app-toggletip__title">Priority: score out of 60</span>' +
      '<p class="app-toggletip__text">Risk of incursion multiplied by impact (up to 30), made larger the less prepared we are. A higher score is a higher priority.</p>' +
      '<ul class="app-toggletip__list">' +
      '<li><span class="app-band app-band--act">Highest priority</span> 30 or more</li>' +
      '<li><span class="app-band app-band--prioritise">High priority</span> 20 to 29</li>' +
      '<li><span class="app-band app-band--monitor">Medium priority</span> 8 to 19</li>' +
      '<li><span class="app-band app-band--maintain">Low priority</span> 1 to 7</li></ul>' +
      '<p class="app-toggletip__text">The full working is at the foot of the page.</p>'
  }
  var byTitle = { 'risk of incursion': 'risk', impact: 'impact', preparedness: 'preparedness' }
  var open = null

  function content(scale) {
    if (scale.html) return scale.html
    var html = '<span class="app-toggletip__title">' + scale.title + ': ' + scale.order + '</span><ol class="app-toggletip__list">'
    scale.names.forEach(function (name, i) {
      html += '<li><strong class="govuk-tag app-level-tag app-level-tag--' + scale.classes[i] + '">' + name + '</strong></li>'
    })
    return html + '</ol>'
  }

  // The popup is fixed to the window, not the table, because the table scrolls sideways and would clip it.
  // It sits under the button and is kept inside the window on both sides.
  function place(button, live) {
    var margin = 12
    var b = button.getBoundingClientRect()
    var width = live.offsetWidth
    var left = Math.min(b.left, window.innerWidth - margin - width)
    live.style.left = Math.max(margin, left) + 'px'
    live.style.top = (b.bottom + 8) + 'px'
  }

  function close() {
    if (!open) return
    open.live.innerHTML = ''
    open.button.setAttribute('aria-expanded', 'false')
    open.wrap.classList.remove('app-toggletip--open')
    open = null
  }

  function add(target, scale) {
    var wrap = document.createElement('span')
    wrap.className = 'app-toggletip'
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'app-toggletip__button'
    button.setAttribute('aria-label', 'Levels of ' + scale.title.toLowerCase())
    button.setAttribute('aria-expanded', 'false')
    button.textContent = 'i'
    var live = document.createElement('span')
    live.className = 'app-toggletip__live'
    live.setAttribute('role', 'status')
    wrap.appendChild(button)
    wrap.appendChild(live)
    target.appendChild(wrap)

    button.addEventListener('click', function (e) {
      e.stopPropagation()
      var wasOpen = open && open.button === button
      close()
      if (wasOpen) return
      live.innerHTML = content(scale)
      place(button, live)
      button.setAttribute('aria-expanded', 'true')
      wrap.classList.add('app-toggletip--open')
      open = { button: button, live: live, wrap: wrap }
    })
  }

  scales.priority = priority

  document.querySelectorAll('th[data-scale]').forEach(function (th) {
    var title = th.querySelector('a, [data-title]')
    add(th, scales[th.dataset.scale])
    var tip = th.querySelector('.app-toggletip__button')
    tip.setAttribute('aria-describedby', 'hint-' + th.dataset.key)
    // The button sits beside the title, not inside it, so a link keeps its own text.
    title.after(th.querySelector('.app-toggletip'))
  })

  document.querySelectorAll('.app-card__meta').forEach(function (meta) {
    add(meta, scales.priority)
  })

  document.querySelectorAll('.app-card dt').forEach(function (dt) {
    var key = byTitle[dt.firstChild.textContent.trim().toLowerCase()]
    if (key) add(dt, scales[key])
  })

  window.addEventListener('resize', close)
  window.addEventListener('scroll', close, true)
  document.addEventListener('click', function (e) {
    if (open && !open.wrap.contains(e.target)) close()
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) {
      var button = open.button
      close()
      button.focus()
    }
  })
})()
