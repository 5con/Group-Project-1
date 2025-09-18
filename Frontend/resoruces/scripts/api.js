;(function () {
  const base = () => (window.AppConfig && window.AppConfig.API_BASE_URL) || ''

  async function http(path, opts) {
    const res = await fetch(`${base()}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? res.json() : res.text()
  }

  const Api = {
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

    async getTips(sport) {
      return http(`/api/tips/${encodeURIComponent(sport)}`)
    },
  }

  window.Api = Api
})()


