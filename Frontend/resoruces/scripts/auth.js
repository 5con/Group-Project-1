/*
  Auth Guards & Login (resoruces/scripts/auth.js)
  - Simple local login (email/password not validated here)
  - Redirects unauthenticated users to the landing page
*/
;(function () {
  /** Redirect to login if on a protected page */
  function guardProtectedPages() {
    const isIndex = /\/index\.html?$/.test(location.pathname) || location.pathname.endsWith('/')
    if (!isIndex && !window.AppStorage.isAuthenticated()) {
      location.href = './index.html'
    }
  }

  /** Bind login form submit */
  function bindLogin() {
    const form = document.getElementById('loginForm')
    if (!form) return
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value.trim()
      if (!email || !password) return
      // For real auth, call backend and store token. Here we store a session stub.
      window.AppStorage.setAuth({ email, ts: Date.now() })
      location.href = './home.html'
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


