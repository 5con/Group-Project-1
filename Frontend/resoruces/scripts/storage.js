/*
  Storage Utilities (resoruces/scripts/storage.js)
  - Local persistence via localStorage
  - Week utilities and current streak computation

  Data keys:
    - ft_auth_v1:      { email, ts }
    - ft_profile_v1:   { height, weight, sport, level }
    - ft_plans_v1:     { [weekKey: string]: PlanDay[] }
    - ft_completions_v1: { [isoDate: string]: true }
*/
;(function () {
  const AUTH_KEY = 'ft_auth_v1'
  const PROFILE_KEY = 'ft_profile_v1'
  const PLANS_KEY = 'ft_plans_v1'
  const COMPLETIONS_KEY = 'ft_completions_v1'

  /** Get JSON from localStorage with a fallback */
  function getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (e) {
      return fallback
    }
  }

  /** Save JSON to localStorage */
  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /** Public API for storage and date helpers */
  const AppStorage = {
    // Auth
    isAuthenticated() {
      return !!getJSON(AUTH_KEY, null)
    },
    setAuth(session) {
      setJSON(AUTH_KEY, session)
    },
    clearAuth() {
      localStorage.removeItem(AUTH_KEY)
    },

    // Profile
    getProfile() {
      return getJSON(PROFILE_KEY, null)
    },
    setProfile(profile) {
      setJSON(PROFILE_KEY, profile)
    },

    // Plans
    getPlans() {
      return getJSON(PLANS_KEY, {})
    },
    getPlan(weekKey) {
      const plans = getJSON(PLANS_KEY, {})
      return plans[weekKey] || null
    },
    setPlan(weekKey, plan) {
      const plans = getJSON(PLANS_KEY, {})
      plans[weekKey] = plan
      setJSON(PLANS_KEY, plans)
    },

    // Completions
    getCompletions() {
      return getJSON(COMPLETIONS_KEY, {})
    },
    setCompletion(dateStr, isDone) {
      const comp = getJSON(COMPLETIONS_KEY, {})
      if (isDone) comp[dateStr] = true
      else delete comp[dateStr]
      setJSON(COMPLETIONS_KEY, comp)
    },

    // Date helpers
    getISODate(d) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    getWeekKey(d) {
      const monday = AppStorage.startOfWeek(d)
      return AppStorage.getISODate(monday)
    },
    startOfWeek(d) {
      const date = new Date(d)
      const day = (date.getDay() + 6) % 7 // Monday as 0
      date.setDate(date.getDate() - day)
      date.setHours(0, 0, 0, 0)
      return date
    },
    addDays(d, n) {
      const x = new Date(d)
      x.setDate(x.getDate() + n)
      return x
    },
    /** Count consecutive days from today with completion */
    currentStreak() {
      const comp = AppStorage.getCompletions()
      let streak = 0
      let cursor = new Date()
      cursor.setHours(0, 0, 0, 0)
      while (true) {
        const key = AppStorage.getISODate(cursor)
        if (comp[key]) {
          streak += 1
          cursor.setDate(cursor.getDate() - 1)
        } else {
          break
        }
      }
      return streak
    },
  }

  window.AppStorage = AppStorage
})()


