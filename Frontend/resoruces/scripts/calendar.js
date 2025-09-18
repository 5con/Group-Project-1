/*
  Calendar Page (resoruces/scripts/calendar.js)
  - Renders week grid with workouts and completion toggles
  - Navigate between previous/next week and today
*/
;(function () {
  function renderStreak() {
    const el = document.getElementById('streakBadge')
    if (el) el.textContent = `Streak: ${window.AppStorage.currentStreak()}🔥`
  }

  function renderWeek(date) {
    const start = window.AppStorage.startOfWeek(date)
    const profile = window.AppStorage.getProfile()
    if (!profile) return
    const key = window.AppStorage.getWeekKey(start)
    let plan = window.AppStorage.getPlan(key)
    if (!plan) {
      plan = window.Onboarding.generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, plan)
    }

    const grid = document.getElementById('calendarGrid')
    grid.innerHTML = ''
    const completions = window.AppStorage.getCompletions()
    plan.forEach((item) => {
      const checked = !!completions[item.date]
      const col = document.createElement('div')
      col.className = 'col-12 col-md-6 col-lg-4'
      col.innerHTML = `
        <div class=\"card ${checked ? 'border-success' : ''}\">
          <div class=\"card-body\">
            <div class=\"d-flex justify-content-between align-items-center mb-1\">
              <div class=\"fw-semibold\">${item.day}</div>
              <div class=\"text-secondary small\">${item.date}</div>
            </div>
            <div class=\"mb-2\">${item.workout}</div>
            <div class=\"form-check\">
              <input class=\"form-check-input\" type=\"checkbox\" ${checked ? 'checked' : ''} data-date=\"${item.date}\" id=\"chk-${item.date}\" />
              <label for=\"chk-${item.date}\" class=\"form-check-label\">Mark complete</label>
            </div>
          </div>
        </div>
      `
      grid.appendChild(col)
    })

    grid.addEventListener('change', function (e) {
      if (e.target && e.target.matches('input[type="checkbox"]')) {
        const date = e.target.getAttribute('data-date')
        window.AppStorage.setCompletion(date, e.target.checked)
        renderWeek(start)
        renderStreak()
      }
    })
  }

  function init() {
    renderWeek(new Date())
    renderStreak()

    document.getElementById('prevWeek').addEventListener('click', function () {
      const start = window.AppStorage.startOfWeek(new Date())
      start.setDate(start.getDate() - 7)
      renderWeek(start)
    })
    document.getElementById('thisWeek').addEventListener('click', function () {
      renderWeek(new Date())
    })
    document.getElementById('nextWeek').addEventListener('click', function () {
      const start = window.AppStorage.startOfWeek(new Date())
      start.setDate(start.getDate() + 7)
      renderWeek(start)
    })
  }

  document.addEventListener('DOMContentLoaded', init)
})()


