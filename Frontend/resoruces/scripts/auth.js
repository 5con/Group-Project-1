/*
  Auth Guards & Login (resoruces/scripts/auth.js)
  - Simple local login (email/password not validated here)
  - Redirects unauthenticated users to the landing page
*/
;(function () {
  /** Redirect to login if on a protected page */
  function guardProtectedPages() {
    const isIndex = /\/index\.html?$/.test(location.pathname) || location.pathname.endsWith('/')
    const isRegister = /\/register\.html?$/.test(location.pathname)
    if (!isIndex && !isRegister && !window.AppStorage.isAuthenticated()) {
      location.href = './index.html'
    }
  }

  /** Bind login form submit */
  function bindLogin() {
    const form = document.getElementById('loginForm')
    if (!form) return

    form.addEventListener('submit', async function (e) {
      e.preventDefault()

      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value.trim()

      if (!email || !password) return

      // Store original button text
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent

      try {
        // Show loading state
        submitBtn.textContent = 'Logging in...'
        submitBtn.disabled = true

        // Send login request
        const result = await window.AppAPI.login({ email, password })

        // Check if login was successful (result should contain user object)
        if (result && result.user) {
          // Store auth data
          window.AppStorage.setAuth({
            email: result.user.email,
            userId: result.user.id,
            ts: Date.now()
          })

          // Store profile data
          const profileData = {
            height: result.user.heightCm,
            weight: result.user.weightKg,
            sport: result.user.sport,
            level: result.user.level,
            position: result.user.position
          }
          window.AppStorage.setProfile(profileData)

          location.href = './home.html'
        } else {
          // Login failed
          alert('Login failed: ' + (result?.message || 'Invalid credentials'))
        }
      } catch (error) {
        console.error('Login error:', error)
        alert('Login failed: Network error. Please try again.')
      } finally {
        // Reset loading state
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }

  /** Bind logout button */
  function bindLogout() {
    const btn = document.getElementById('logoutBtn')
    if (!btn) return
    btn.addEventListener('click', function () {
      window.AppStorage.clearAuth()
      location.href = './index.html'
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    guardProtectedPages()
    bindLogin()
    bindLogout()
  })
})()


