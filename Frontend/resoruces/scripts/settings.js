/*
  Settings Page (resoruces/scripts/settings.js)
  - Edit and save profile
  - Regenerate current week plan on demand
*/
;(function () {
  function fillForm(profile) {
    if (!profile) return
    document.getElementById('height').value = profile.height
    document.getElementById('weight').value = profile.weight
    document.getElementById('sport').value = profile.sport
    document.getElementById('level').value = profile.level
    
    // Handle position field for football
    const positionField = document.getElementById('positionField')
    const positionSelect = document.getElementById('position')
    const sportSelect = document.getElementById('sport')
    
    if (profile.sport === 'Football' && profile.position) {
      positionField.style.display = 'block'
      positionSelect.value = profile.position
      positionSelect.required = true
    } else {
      positionField.style.display = 'none'
      positionSelect.required = false
    }
  }

  function bindForm() {
    const form = document.getElementById('settingsForm')
    const sportSelect = document.getElementById('sport')
    const positionField = document.getElementById('positionField')
    const positionSelect = document.getElementById('position')
    
    // Show/hide position field based on sport selection
    sportSelect.addEventListener('change', function() {
      if (this.value === 'Football') {
        positionField.style.display = 'block'
        positionSelect.required = true
      } else {
        positionField.style.display = 'none'
        positionSelect.required = false
        positionSelect.value = ''
      }
    })
    
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      const height = parseInt(document.getElementById('height').value, 10)
      const weight = parseInt(document.getElementById('weight').value, 10)
      const sport = document.getElementById('sport').value
      const level = document.getElementById('level').value
      const position = document.getElementById('position').value
      
      if (sport === 'Football' && !position) {
        alert('Please select a position for football.')
        return
      }
      
      const profile = { height, weight, sport, level, position }
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
    })

    document.getElementById('regenPlan').addEventListener('click', function () {
      const profile = window.AppStorage.getProfile()
      const start = window.AppStorage.startOfWeek(new Date())
      const key = window.AppStorage.getWeekKey(start)
      const plan = window.Onboarding.generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, plan)
      const toast = document.createElement('div')
      toast.className = 'alert alert-info mt-3'
      toast.textContent = "This week's plan regenerated."
      document.getElementById('settingsForm').appendChild(toast)
      setTimeout(() => toast.remove(), 2000)
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


