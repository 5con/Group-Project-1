;(function () {
  const base = () => {
    const url = (window.AppConfig && window.AppConfig.API_BASE_URL) || 'http://localhost:5226'
    if (!url) {
      console.warn('API_BASE_URL not configured')
    }
    return url
  }

  async function http(path, opts) {
    const url = `${base()}${path}`
    console.log('Making API request to:', url, opts)

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    })

    console.log('Raw response:', res)
    console.log('Response type:', typeof res)
    console.log('Response ok:', res?.ok)
    console.log('Response status:', res?.status)
    console.log('Response statusText:', res?.statusText)

    if (!res) {
      throw new Error('No response received from server')
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status || 'unknown'}: ${res.statusText || 'unknown error'}`)
    }
    const ct = res.headers.get('content-type') || ''
    console.log('Content type:', ct)

    let result
    if (ct.includes('application/json')) {
      result = await res.json()
    } else {
      result = await res.text()
    }
    console.log('Parsed result:', result)
    return result
  }

  const Api = {
    async register(userData) {
      return http('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
    },

    async login(credentials) {
      return http('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
    },

    async upsertUserFromProfile(email, profile) {
      // find existing by email
      const found = await http(`/api/users?email=${encodeURIComponent(email)}`)
      if (Array.isArray(found) && found.length > 0) {
        const u = found[0]
        // update
        await http(`/api/users/${u.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            id: u.id,
            email,
            heightCm: profile.height,
            weightKg: profile.weight,
            sport: profile.sport,
            level: profile.level,
            position: profile.position,
          }),
        })
        return u
      }
      // create
      const created = await http('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          email,
          heightCm: profile.height,
          weightKg: profile.weight,
          sport: profile.sport,
          level: profile.level,
          position: profile.position,
        }),
      })
      return created
    },

    async generatePlan(userId, weekStartISO) {
      const qs = weekStartISO ? `?weekStart=${encodeURIComponent(weekStartISO)}` : ''
      return http(`/api/users/${userId}/plans/generate${qs}`, { method: 'POST' })
    },

    async getPlan(userId, weekStartISO) {
      const qs = weekStartISO ? `?weekStart=${encodeURIComponent(weekStartISO)}` : ''
      return http(`/api/users/${userId}/plans${qs}`)
    },

    async getTips(sport, position = null) {
      if (position) {
        return http(`/api/tips/${encodeURIComponent(sport)}/${encodeURIComponent(position)}`)
      }
      return http(`/api/tips/${encodeURIComponent(sport)}`)
    },
  }

  window.Api = Api
  window.AppAPI = Api
})()


