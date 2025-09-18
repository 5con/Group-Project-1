/*
  Home Page Rendering (resoruces/scripts/home.js)
  - Displays weekly plan summary
  - Shows star athlete and diet tip
  - Tracks completion and updates streak badge
*/
;(function () {
  function renderStreak() {
    const el = document.getElementById('streakBadge')
    if (!el) return
    const s = window.AppStorage.currentStreak()
    el.textContent = `Streak: ${s}🔥`
  }

  function renderAthlete(profile) {
    const athlete = window.Onboarding.getStarAthlete(profile.sport)
    const diet = window.Onboarding.getDietTip(profile.sport)
    document.getElementById('athleteImg').src = athlete.img
    document.getElementById('athleteName').textContent = athlete.name
    document.getElementById('sportLabel').textContent = `${profile.sport} • ${profile.level}`
    document.getElementById('dietTips').textContent = diet
  }

  function renderPlan(plan) {
    const container = document.getElementById('planList')
    container.innerHTML = ''
    const completions = window.AppStorage.getCompletions()
    plan.forEach((item) => {
      const checked = !!completions[item.date]
      const div = document.createElement('div')
      div.className = `card workout-card ${checked ? 'done' : ''}`
      div.innerHTML = `
        <div class=\"card-body d-flex align-items-center justify-content-between\">
          <div>
            <div class=\"fw-semibold\">${item.day} • ${item.date}</div>
            <div class=\"text-secondary\">${item.workout}</div>
          </div>
          <div class=\"form-check\">
            <input class=\"form-check-input\" type=\"checkbox\" ${checked ? 'checked' : ''} data-date=\"${item.date}\" />
          </div>
        </div>
      `
      container.appendChild(div)
    })

    container.addEventListener('change', function (e) {
      if (e.target && e.target.matches('input[type="checkbox"]')) {
        const date = e.target.getAttribute('data-date')
        window.AppStorage.setCompletion(date, e.target.checked)
        renderStreak()
        const card = e.target.closest('.workout-card')
        if (e.target.checked) card.classList.add('done')
        else card.classList.remove('done')
      }
    })
  }

  async function init() {
    const profile = window.AppStorage.getProfile()
    if (profile) {
      renderAthlete(profile)
      const weekStart = window.AppStorage.getISODate(window.AppStorage.startOfWeek(new Date()))
      try {
        if (window.AppConfig.USE_BACKEND_WHEN_AVAILABLE && profile.email) {
          const found = await window.Api.upsertUserFromProfile(profile.email, profile)
          const serverPlan = await window.Api.getPlan(found.id, weekStart)
          if (Array.isArray(serverPlan) && serverPlan.length > 0) {
            const planDays = serverPlan.map((p) => ({ date: p.date, day: p.dayName, workout: p.workout, type: p.type }))
            window.AppStorage.setPlan(weekStart, planDays)
            renderPlan(planDays)
          } else {
            const gen = await window.Api.generatePlan(found.id, weekStart)
            const planDays = (gen.plan || []).map((p) => ({ date: p.date, day: p.dayName, workout: p.workout, type: p.type }))
            window.AppStorage.setPlan(weekStart, planDays)
            renderPlan(planDays)
          }
          const tips = await window.Api.getTips(profile.sport)
          document.getElementById('dietTips').textContent = Array.isArray(tips) ? tips.join(' ') : String(tips)
        } else {
          const { plan } = window.Onboarding.ensureWeekPlan(profile)
          renderPlan(plan)
        }
      } catch (e) {
        const { plan } = window.Onboarding.ensureWeekPlan(profile)
        renderPlan(plan)
      }
    }
    window.Onboarding.openOnboardingModalIfNeeded()
    window.Onboarding.bindOnboardingForm()
    document.addEventListener('profile:updated', async function () {
      const p = window.AppStorage.getProfile()
      renderAthlete(p)
      const weekStart = window.AppStorage.getISODate(window.AppStorage.startOfWeek(new Date()))
      try {
        if (window.AppConfig.USE_BACKEND_WHEN_AVAILABLE && p.email) {
          const user = await window.Api.upsertUserFromProfile(p.email, p)
          const gen = await window.Api.generatePlan(user.id, weekStart)
          const planDays = (gen.plan || []).map((q) => ({ date: q.date, day: q.dayName, workout: q.workout, type: q.type }))
          window.AppStorage.setPlan(weekStart, planDays)
          renderPlan(planDays)
          const tips = await window.Api.getTips(p.sport)
          document.getElementById('dietTips').textContent = Array.isArray(tips) ? tips.join(' ') : String(tips)
        } else {
          const { plan } = window.Onboarding.ensureWeekPlan(p)
          renderPlan(plan)
        }
      } catch (e) {
        const { plan } = window.Onboarding.ensureWeekPlan(p)
        renderPlan(plan)
      }
    })
    renderStreak()
  }

  document.addEventListener('DOMContentLoaded', init)
})()


