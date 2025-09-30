/*
  Calendar Page (resoruces/scripts/calendar.js)
  - Renders week grid with workouts and completion toggles
  - Navigate between previous/next week and today
*/
;(function () {
  const STATE = {
    currentWeekStart: window.AppStorage.startOfWeek(new Date()),
  }

  function renderStreak() {
    const el = document.getElementById('streakBadge')
    if (el) el.textContent = `Streak: ${window.AppStorage.currentStreak()}🔥`
  }

  function formatDateRange(start) {
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    return `${formatter.format(start)} – ${formatter.format(end)}`
  }

  function getWeekPlan(start, profile) {
    const key = window.AppStorage.getWeekKey(start)
    let plan = window.AppStorage.getPlan(key)
    if (!plan) {
      plan = window.Onboarding.generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, plan)
    }
    return plan
  }

  function renderNavigation(start, profile) {
    const labelEl = document.getElementById('currentWeekLabel')
    const rangeEl = document.getElementById('currentWeekRange')
    if (labelEl) labelEl.textContent = profile?.sport ? `${profile.sport} Week` : 'This Week'
    if (rangeEl) {
      rangeEl.textContent = formatDateRange(start)
      rangeEl.dataset.start = start.toISOString()
    }
  }

  function renderWeek(date, { preserveListeners = false } = {}) {
    const start = window.AppStorage.startOfWeek(date)
    STATE.currentWeekStart = start
    const profile = window.AppStorage.getProfile()
    const grid = document.getElementById('calendarGrid')
    if (!grid) return

    const rangeLabelTarget = document.getElementById('currentWeekRange')
    if (rangeLabelTarget && !rangeLabelTarget.dataset.start) {
      rangeLabelTarget.dataset.start = start.toISOString()
    }

    grid.innerHTML = ''
    if (!profile) {
      return
    }

    renderNavigation(start, profile)
    const plan = getWeekPlan(start, profile)

    const completions = window.AppStorage.getCompletions()
    const todayIso = window.AppStorage.getISODate(new Date())
    const typePalette = {
      strength: 'primary',
      conditioning: 'info',
      skills: 'success',
      skill: 'success',
      mobility: 'warning',
      rest: 'secondary',
      iq: 'dark',
      combo: 'danger',
    }

    plan.forEach((item) => {
      const checked = !!completions[item.date]
      const column = document.createElement('div')
      column.className = 'day-column'
      if (checked) column.classList.add('completed')
      if (item.date === todayIso) column.classList.add('today')

      const badgeContext = typePalette[item.type] || 'secondary'

      column.innerHTML = `
        <div class="day-header">
          <span class="day-name">${item.day}</span>
          <span class="day-date">${item.date}</span>
        </div>
        <div class="day-body">
          <div>
            <div class="workout-summary">${item.workout || 'No workout scheduled.'}</div>
            <span class="badge rounded-pill text-bg-${badgeContext} type-badge">${(item.type || 'focus').toUpperCase()}</span>
          </div>
          <div class="completion-toggle">
            <input class="form-check-input" type="checkbox" ${checked ? 'checked' : ''} data-date="${item.date}" id="chk-${item.date}" />
            <label for="chk-${item.date}" class="form-check-label">Complete</label>
          </div>
        </div>
      `

      grid.appendChild(column)
    })

    if (!preserveListeners && grid.dataset.bound !== 'true') {
      grid.addEventListener('change', function (e) {
        if (e.target && e.target.matches('input[type="checkbox"]')) {
          const dateAttr = e.target.getAttribute('data-date')
          window.AppStorage.setCompletion(dateAttr, e.target.checked)
          renderWeek(STATE.currentWeekStart, { preserveListeners: true })
          renderStreak()
        }
      })
      grid.dataset.bound = 'true'
    }
  }

  function bindNavigation() {
    const prevBtn = document.getElementById('prevWeek')
    const nextBtn = document.getElementById('nextWeek')
    const thisWeekBtn = document.getElementById('thisWeek')

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        const prev = new Date(STATE.currentWeekStart)
        prev.setDate(prev.getDate() - 7)
        renderWeek(prev)
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        const next = new Date(STATE.currentWeekStart)
        next.setDate(next.getDate() + 7)
        renderWeek(next)
      })
    }

    if (thisWeekBtn) {
      thisWeekBtn.addEventListener('click', function () {
        renderWeek(new Date())
      })
    }
  }

  function init() {
    renderWeek(new Date())
    renderStreak()
    bindNavigation()
  }

  document.addEventListener('DOMContentLoaded', init)
})()


