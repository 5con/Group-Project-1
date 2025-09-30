/*
  Settings Page (resoruces/scripts/settings.js)
  - Edit and save profile
  - Regenerate current week plan on demand
*/
;(function () {
  const SPORT_POSITIONS = window.Onboarding?.SPORT_POSITIONS || {}

  function populatePositionOptions(select, options, currentValue) {
    select.innerHTML = ''
    const placeholder = document.createElement('option')
    placeholder.value = ''
    placeholder.disabled = true
    placeholder.textContent = 'Select position'
    select.appendChild(placeholder)

    options.forEach((opt) => {
      const node = document.createElement('option')
      node.value = opt.value
      node.textContent = opt.label
      select.appendChild(node)
    })

    if (currentValue) {
      select.value = currentValue
      placeholder.selected = false
    } else {
      placeholder.selected = true
    }
  }

  function togglePositionField(sport, currentValue = '') {
    const positionField = document.getElementById('positionField')
    const positionSelect = document.getElementById('position')
    const options = SPORT_POSITIONS[sport] || []

    if (options.length > 0) {
      positionField.style.display = 'block'
      positionField.hidden = false
      positionSelect.required = true
      populatePositionOptions(positionSelect, options, currentValue)
    } else {
      positionField.style.display = 'none'
      positionField.hidden = true
      positionSelect.required = false
      positionSelect.innerHTML = ''
    }
  }

  function fillForm(profile) {
    if (!profile) return
    document.getElementById('height').value = profile.height
    document.getElementById('weight').value = profile.weight
    document.getElementById('sport').value = profile.sport
    document.getElementById('level').value = profile.level

    togglePositionField(profile.sport, profile.position || '')
  }

  function bindForm() {
    const form = document.getElementById('settingsForm')
    const sportSelect = document.getElementById('sport')
    const positionSelect = document.getElementById('position')

    sportSelect.addEventListener('change', function () {
      const current = window.AppStorage.getProfile()
      const isSameSport = current && current.sport === this.value
      const previousPosition = isSameSport ? current.position : ''
      togglePositionField(this.value, previousPosition)
    })

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      const height = parseInt(document.getElementById('height').value, 10)
      const weight = parseInt(document.getElementById('weight').value, 10)
      const sport = document.getElementById('sport').value
      const level = document.getElementById('level').value
      const requiresPosition = (SPORT_POSITIONS[sport] || []).length > 0
      const positionValue = requiresPosition ? positionSelect.value : ''

      if (requiresPosition && !positionValue) {
        alert('Please select a position for the chosen sport.')
        return
      }

      const profile = { height, weight, sport, level, position: positionValue }
      window.AppStorage.setProfile(profile)
      const start = window.AppStorage.startOfWeek(new Date())
      const key = window.AppStorage.getWeekKey(start)
      const plan = window.Onboarding.generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, plan)

      const toast = document.createElement('div')
      toast.className = 'alert alert-success mt-3'
      toast.textContent = 'Profile saved and plan updated.'
      form.appendChild(toast)
      setTimeout(() => toast.remove(), 2000)

      document.dispatchEvent(new CustomEvent('profile:updated', { detail: profile }))
    })

    document.getElementById('regenPlan').addEventListener('click', function () {
      const profile = window.AppStorage.getProfile()
      if (!profile) return
      const start = window.AppStorage.startOfWeek(new Date())
      const key = window.AppStorage.getWeekKey(start)
      const plan = window.Onboarding.generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, plan)
      const toast = document.createElement('div')
      toast.className = 'alert alert-info mt-3'
      toast.textContent = "This week's plan regenerated."
      document.getElementById('settingsForm').appendChild(toast)
      setTimeout(() => toast.remove(), 2000)
      document.dispatchEvent(new CustomEvent('profile:updated', { detail: profile }))
    })
  }

  function renderStreak() {
    const el = document.getElementById('streakBadge')
    if (el) el.textContent = `Streak: ${window.AppStorage.currentStreak()}🔥`
  }

  function init() {
    const profile = window.AppStorage.getProfile()
    if (profile) fillForm(profile)
    renderStreak()
  }

  document.addEventListener('DOMContentLoaded', function () {
    init()
    bindForm()
  })
})()


