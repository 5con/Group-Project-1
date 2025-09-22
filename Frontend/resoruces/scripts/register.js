/*
  Registration Handler (resoruces/scripts/register.js)
  - Handles user registration form submission
  - Validates form data and sends to backend
  - Shows position field only for football
*/
;(function () {
  /** Show/hide position field based on sport selection */
  function bindSportChange() {
    const sportSelect = document.getElementById('sport')
    const positionGroup = document.getElementById('positionGroup')

    if (!sportSelect || !positionGroup) return

    sportSelect.addEventListener('change', function () {
      if (this.value === 'football') {
        positionGroup.style.display = 'block'
      } else {
        positionGroup.style.display = 'none'
        document.getElementById('position').value = ''
      }
    })
  }

  /** Handle registration form submission */
  function bindRegistration() {
    const form = document.getElementById('registerForm')
    if (!form) return

    form.addEventListener('submit', async function (e) {
      e.preventDefault()

      // Clear previous validation
      form.classList.remove('was-validated')

      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value
      const confirmPassword = document.getElementById('confirmPassword').value
      const sport = document.getElementById('sport').value
      const level = document.getElementById('level').value
      const position = document.getElementById('position').value
      const height = document.getElementById('height').value
      const weight = document.getElementById('weight').value

      // Client-side validation
      if (!email || !password || !sport || !level) {
        form.classList.add('was-validated')
        return
      }

      if (password.length < 6) {
        document.getElementById('password').classList.add('is-invalid')
        return
      }

      if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid')
        return
      }

      // Prepare user data
      const userData = {
        email: email,
        password: password,
        sport: sport,
        level: level,
        position: position || null,
        heightCm: height ? parseFloat(height) : null,
        weightKg: weight ? parseFloat(weight) : null
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = 'Creating Account...'
      submitBtn.disabled = true

      try {

        // Send registration request
        const response = await window.AppAPI.register(userData)

        console.log('Registration response:', response)
        console.log('Response type:', typeof response)

        // Check if registration was successful (response should contain user object)
        if (response && response.user) {
          // Registration successful
          alert('Account created successfully! Please log in.')

          // Store auth data and redirect to home
          window.AppStorage.setAuth({
            email: userData.email,
            userId: response.user.id,
            ts: Date.now()
          })

          // Store profile data
          const profileData = {
            height: userData.heightCm,
            weight: userData.weightKg,
            sport: userData.sport,
            level: userData.level,
            position: userData.position
          }
          window.AppStorage.setProfile(profileData)

          location.href = './home.html'
        } else {
          // Registration failed
          console.log('Registration failed, response:', response)
          console.log('Response type:', typeof response)

          let errorMessage = 'Unknown error'
          if (response && response.message) {
            errorMessage = response.message
          } else if (response && typeof response === 'string') {
            errorMessage = response
          }
          alert('Registration failed: ' + errorMessage)
        }
      } catch (error) {
        console.error('Registration error:', error)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          alert('Registration failed: Cannot connect to server. Please check if the backend is running on http://localhost:5226')
        } else {
          alert('Registration failed: ' + (error.message || 'Network error. Please try again.'))
        }
      } finally {
        // Reset loading state
        const submitBtn = form.querySelector('button[type="submit"]')
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindSportChange()
    bindRegistration()
  })
})()
