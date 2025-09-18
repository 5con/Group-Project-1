/*
  Onboarding & Plan Generation (resoruces/scripts/onboarding.js)
  - First-time profile capture via modal
  - Weekly plan generation and persistence
  - Athlete and diet tip helpers
*/
;(function () {
  const SPORTS = ['Baseball', 'Basketball', 'Football', 'Tennis', 'Golf']
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

  // Star athlete assets (served locally from resoruces/images)
  const STAR_ATHLETES = {
    Baseball: { name: 'Shohei Ohtani', img: './resoruces/images/athlete-baseball.svg' },
    Basketball: { name: 'LeBron James', img: './resoruces/images/athlete-basketball.svg' },
    Football: { name: 'Patrick Mahomes', img: './resoruces/images/athlete-football.svg' },
    Tennis: { name: 'Serena Williams', img: './resoruces/images/athlete-tennis.svg' },
    Golf: { name: 'Tiger Woods', img: './resoruces/images/athlete-golf.svg' },
  }

  const DIET_TIPS = {
    Baseball: 'Lean protein, shoulder health, steady carbs.',
    Basketball: 'Hydrate; complex carbs + recovery protein.',
    Football: 'High-protein, balanced fats; carb timing around training.',
    Tennis: 'Frequent small meals; electrolytes; quick match fuel.',
    Golf: 'Light steady energy; hydration; posture-support nutrients.',
  }

  function intensity(level) {
    switch (level) {
      case 'Beginner':
        return { vol: 'low', dur: 30 }
      case 'Intermediate':
        return { vol: 'moderate', dur: 45 }
      case 'Advanced':
        return { vol: 'high', dur: 60 }
      default:
        return { vol: 'moderate', dur: 40 }
    }
  }

  function sportBlocks(sport) {
    const common = {
      mobility: 'Mobility + activation',
      strength: 'Full-body strength',
      rest: 'Active recovery / rest',
      conditioning: 'Conditioning / cardio',
      skills: 'Skills + drills',
    }
    switch (sport) {
      case 'Baseball':
        return { ...common, skills: 'Hitting + fielding drills' }
      case 'Basketball':
        return { ...common, skills: 'Shooting + ball handling' }
      case 'Football':
        return { ...common, skills: 'Position-specific drills' }
      case 'Tennis':
        return { ...common, skills: 'Serve + footwork drills' }
      case 'Golf':
        return { ...common, skills: 'Swing mechanics + short game' }
      default:
        return common
    }
  }

  /** Generate one week plan using profile + templates */
  function generateWeeklyPlan(profile, weekStartDate) {
    const { sport, level } = profile
    const blocks = sportBlocks(sport)
    const it = intensity(level)
    const days = [
      { title: 'Mon', type: 'strength' },
      { title: 'Tue', type: 'skills' },
      { title: 'Wed', type: 'conditioning' },
      { title: 'Thu', type: 'strength' },
      { title: 'Fri', type: 'skills' },
      { title: 'Sat', type: 'mobility' },
      { title: 'Sun', type: 'rest' },
    ]
    const plan = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStartDate)
      d.setDate(d.getDate() + i)
      const block = days[i]
      plan.push({
        date: window.AppStorage.getISODate(d),
        day: block.title,
        workout: `${blocks[block.type]} — ${it.vol} • ${it.dur} min`,
        type: block.type,
      })
    }
    return plan
  }

  /** Ensure week plan exists; if not, generate and persist */
  function ensureWeekPlan(profile) {
    const start = window.AppStorage.startOfWeek(new Date())
    const key = window.AppStorage.getWeekKey(start)
    let p = window.AppStorage.getPlan(key)
    if (!p) {
      p = generateWeeklyPlan(profile, start)
      window.AppStorage.setPlan(key, p)
    }
    return { key, plan: p }
  }

  /** Open onboarding modal on first visit (no stored profile) */
  function openOnboardingModalIfNeeded() {
    const profile = window.AppStorage.getProfile()
    const modalEl = document.getElementById('onboardingModal')
    if (!modalEl) return
    const modal = new bootstrap.Modal(modalEl)
    if (!profile) modal.show()
  }

  /** Handle onboarding form submit */
  function bindOnboardingForm() {
    const form = document.getElementById('onboardingForm')
    if (!form) return
    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      const height = parseInt(document.getElementById('height').value, 10)
      const weight = parseInt(document.getElementById('weight').value, 10)
      const sport = document.getElementById('sport').value
      const level = document.getElementById('level').value
      if (!height || !weight || !sport || !level) return
      const auth = window.AppStorage.isAuthenticated() ? JSON.parse(localStorage.getItem('ft_auth_v1')) : null
      const email = auth ? auth.email : null
      const profile = { height, weight, sport, level, email }
      window.AppStorage.setProfile(profile)
      try {
        if (window.AppConfig.USE_BACKEND_WHEN_AVAILABLE && email) {
          const user = await window.Api.upsertUserFromProfile(email, profile)
          const weekStart = window.AppStorage.getISODate(window.AppStorage.startOfWeek(new Date()))
          const generated = await window.Api.generatePlan(user.id, weekStart)
          const planDays = (generated.plan || []).map((p) => ({
            date: p.date,
            day: p.dayName,
            workout: p.workout,
            type: p.type,
          }))
          window.AppStorage.setPlan(weekStart, planDays)
        } else {
          ensureWeekPlan(profile)
        }
      } catch (err) {
        // Fallback to local if backend fails
        ensureWeekPlan(profile)
      }
      const modalEl = document.getElementById('onboardingModal')
      const modal = bootstrap.Modal.getInstance(modalEl)
      modal.hide()
      document.dispatchEvent(new CustomEvent('profile:updated', { detail: profile }))
    })
  }

  function getStarAthlete(sport) {
    return STAR_ATHLETES[sport] || { name: 'Athlete', img: './resoruces/images/athlete-generic.svg' }
  }

  function getDietTip(sport) {
    return DIET_TIPS[sport] || 'Eat whole foods, hydrate, and prioritize sleep.'
  }

  window.Onboarding = {
    SPORTS,
    LEVELS,
    getStarAthlete,
    getDietTip,
    generateWeeklyPlan,
    ensureWeekPlan,
    openOnboardingModalIfNeeded,
    bindOnboardingForm,
  }
})()


