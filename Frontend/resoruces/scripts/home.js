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
    const athlete = window.Onboarding.getStarAthlete(profile.sport, profile.position)
    document.getElementById('athleteImg').src = athlete.img
    document.getElementById('athleteName').textContent = athlete.name
    const sportLabel = profile.sport === 'Football' && profile.position 
      ? `${profile.sport} • ${profile.position} • ${profile.level}`
      : `${profile.sport} • ${profile.level}`
    document.getElementById('sportLabel').textContent = sportLabel
    
    // Use fallback diet tip for now, will be updated by API call
    const diet = window.Onboarding.getDietTip(profile.sport)
    document.getElementById('dietTips').textContent = diet
    
    // Add position-specific styling to athlete card
    if (profile.sport === 'Football' && profile.position) {
      const athleteCard = document.querySelector('#athleteImg').closest('.card')
      if (athleteCard) {
        athleteCard.classList.add('athlete-card', profile.position.toLowerCase())
      }
      
      // Show position dashboard
      renderPositionDashboard(profile.position)
    }
  }

  function getPositionIcon(position) {
    const icons = {
      'QB': '🏈',
      'WR': '⚡',
      'LB': '🎯',
      'CB': '🏃‍♂️'
    }
    return icons[position] || '🏈'
  }

  function renderFootballWorkout(item, position, checked) {
    const positionIcon = getPositionIcon(position)
    const typeBadge = `<span class="workout-type-badge ${item.type}">${item.type.toUpperCase()}</span>`
    const positionClass = position.toLowerCase()
    
    // Get workout details based on type and position
    const workoutDetails = getWorkoutDetails(item.type, position)
    const intensity = getIntensityLevel(item.type, position)
    const equipment = getEquipmentIcons(item.type)
    
    return `
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="position-icon ${positionClass} me-3">${positionIcon}</div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <h6 class="mb-0 fw-semibold">${item.day} • ${item.date}</h6>
                  <span class="difficulty-badge ${workoutDetails.level}">${workoutDetails.level.toUpperCase()}</span>
                </div>
                <p class="mb-1 text-muted">${item.workout}</p>
                <div class="d-flex align-items-center gap-3">
                  <div class="time-estimate">
                    <span class="equipment-icon">⏱️</span>
                    ${workoutDetails.duration}
                  </div>
                  <div class="time-estimate">
                    <span class="equipment-icon">${equipment}</span>
                    Equipment
                  </div>
                </div>
                <div class="intensity-meter">
                  ${getIntensityDots(intensity)}
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                ${typeBadge}
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" ${checked ? 'checked' : ''} data-date="${item.date}" />
                </div>
              </div>
            </div>
            ${checked ? '<div class="workout-progress"><div class="workout-progress-bar" style="width: 100%"></div></div>' : ''}
          </div>
        </div>
      </div>
    `
  }

  function getWorkoutDetails(type, position) {
    const details = {
      strength: { level: 'intermediate', duration: '45-60 min' },
      conditioning: { level: 'advanced', duration: '30-45 min' },
      skill: { level: 'beginner', duration: '60-90 min' },
      rest: { level: 'beginner', duration: '20-30 min' }
    }
    return details[type] || { level: 'intermediate', duration: '45 min' }
  }

  function getIntensityLevel(type, position) {
    const intensityMap = {
      strength: 4,
      conditioning: 5,
      skill: 3,
      rest: 1
    }
    return intensityMap[type] || 3
  }

  function getEquipmentIcons(type) {
    const equipmentMap = {
      strength: '🏋️',
      conditioning: '🏃',
      skill: '⚽',
      rest: '🧘'
    }
    return equipmentMap[type] || '🏋️'
  }

  function getIntensityDots(intensity) {
    let dots = ''
    for (let i = 1; i <= 5; i++) {
      let classes = 'intensity-dot'
      if (i <= intensity) {
        classes += i <= 3 ? ' active' : ' high'
      }
      dots += `<div class="${classes}"></div>`
    }
    return dots
  }

  function renderPositionDashboard(position) {
    const dashboard = document.getElementById('positionDashboard')
    const metrics = document.getElementById('positionMetrics')
    
    if (!dashboard || !metrics) return
    
    dashboard.style.display = 'block'
    const positionClass = position.toLowerCase()
    
    const positionMetrics = getPositionMetrics(position)
    
    metrics.innerHTML = positionMetrics.map(metric => `
      <div class="metric-card ${positionClass}">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="metric-value">${metric.value}</div>
            <div class="metric-label">${metric.label}</div>
          </div>
          <div class="text-end">
            <small class="text-muted">${metric.target}</small>
          </div>
        </div>
        <div class="metric-progress">
          <div class="metric-progress-bar ${positionClass}" style="width: ${metric.progress}%"></div>
        </div>
      </div>
    `).join('')
  }

  function getPositionMetrics(position) {
    const metrics = {
      'QB': [
        { label: 'Throwing Accuracy', value: '87%', target: 'Target: 90%', progress: 87 },
        { label: 'Pocket Time', value: '3.2s', target: 'Target: 3.5s', progress: 91 },
        { label: 'Decision Speed', value: '2.1s', target: 'Target: 2.0s', progress: 95 }
      ],
      'WR': [
        { label: 'Route Running', value: '92%', target: 'Target: 95%', progress: 92 },
        { label: 'Catch Rate', value: '89%', target: 'Target: 90%', progress: 89 },
        { label: '40-Yard Dash', value: '4.3s', target: 'Target: 4.2s', progress: 95 }
      ],
      'LB': [
        { label: 'Tackling Form', value: '94%', target: 'Target: 95%', progress: 94 },
        { label: 'Reaction Time', value: '0.8s', target: 'Target: 0.7s', progress: 88 },
        { label: 'Bench Press', value: '315 lbs', target: 'Target: 325 lbs', progress: 97 }
      ],
      'CB': [
        { label: 'Coverage Skills', value: '91%', target: 'Target: 93%', progress: 91 },
        { label: 'Hip Flexibility', value: '88%', target: 'Target: 90%', progress: 88 },
        { label: 'Shuttle Run', value: '4.1s', target: 'Target: 4.0s', progress: 98 }
      ]
    }
    
    return metrics[position] || []
  }

  function renderEnhancedNutrition(tips, position) {
    const nutritionContent = document.getElementById('nutritionContent')
    if (!nutritionContent) return
    
    const positionClass = position ? position.toLowerCase() : ''
    const tipsArray = Array.isArray(tips) ? tips : [String(tips)]
    
    // Get position-specific macro targets
    const macroTargets = getPositionMacros(position)
    
    nutritionContent.innerHTML = `
      <div class="nutrition-card ${positionClass}">
        <h6 class="mb-2">Daily Macros</h6>
        <div class="macro-breakdown">
          <div class="macro-item">
            <div class="macro-value">${macroTargets.protein}g</div>
            <div class="macro-label">Protein</div>
          </div>
          <div class="macro-item">
            <div class="macro-value">${macroTargets.carbs}g</div>
            <div class="macro-label">Carbs</div>
          </div>
          <div class="macro-item">
            <div class="macro-value">${macroTargets.fat}g</div>
            <div class="macro-label">Fat</div>
          </div>
        </div>
      </div>
      
      <div class="nutrition-card ${positionClass}">
        <h6 class="mb-2">Nutrition Tips</h6>
        ${tipsArray.map(tip => `<div class="nutrition-tip">${tip}</div>`).join('')}
      </div>
      
      <div class="hydration-tracker">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Hydration Goal</h6>
          <span class="fw-semibold">3.5L / 5L</span>
        </div>
        <div class="hydration-progress">
          <div class="hydration-bar" style="width: 70%"></div>
        </div>
        <small class="text-muted mt-1 d-block">Drink 16-20oz 2h before training</small>
      </div>
    `
  }

  function getPositionMacros(position) {
    const macros = {
      'QB': { protein: 160, carbs: 400, fat: 80 },
      'WR': { protein: 150, carbs: 380, fat: 75 },
      'LB': { protein: 180, carbs: 420, fat: 90 },
      'CB': { protein: 155, carbs: 360, fat: 70 }
    }
    return macros[position] || { protein: 160, carbs: 400, fat: 80 }
  }

  function showDayDetail(day, date, workout, type, profile) {
    const modal = new bootstrap.Modal(document.getElementById('dayDetailModal'))
    const title = document.getElementById('dayDetailTitle')
    const content = document.getElementById('dayDetailContent')
    const markCompleteBtn = document.getElementById('markCompleteBtn')
    
    title.textContent = `${day} • ${date} - ${type.toUpperCase()}`
    
    const positionClass = profile.position ? profile.position.toLowerCase() : ''
    const isCompleted = window.AppStorage.getCompletions()[date]
    
    content.innerHTML = `
      <div class="workout-detail-card ${positionClass}">
        <h5 class="mb-3">${type.toUpperCase()} Workout</h5>
        <p class="mb-3">${workout}</p>
        <h6 class="mb-2">Exercise Breakdown:</h6>
        <ul class="exercise-list">
          ${getExerciseBreakdown(type, profile.position).map(exercise => `
            <li class="exercise-item">
              <div>
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-details">${exercise.details}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <div class="nutrition-detail-card">
        <h5 class="mb-3">Daily Nutrition Plan</h5>
        <div class="meal-timing">
          <div class="meal-time">Pre-Workout (2-3 hours before)</div>
          <div class="meal-content">${getPreWorkoutMeal(type, profile.position)}</div>
        </div>
        <div class="meal-timing">
          <div class="meal-time">Post-Workout (within 30 minutes)</div>
          <div class="meal-content">${getPostWorkoutMeal(type, profile.position)}</div>
        </div>
        <div class="meal-timing">
          <div class="meal-time">Evening Recovery</div>
          <div class="meal-content">${getEveningMeal(type, profile.position)}</div>
        </div>
      </div>
    `
    
    markCompleteBtn.textContent = isCompleted ? 'Mark Incomplete' : 'Mark Complete'
    markCompleteBtn.onclick = function() {
      const newStatus = !isCompleted
      window.AppStorage.setCompletion(date, newStatus)
      renderStreak()
      modal.hide()
      // Refresh the plan to update UI
      const weekStart = window.AppStorage.getISODate(window.AppStorage.startOfWeek(new Date()))
      const plan = window.AppStorage.getPlan(weekStart)
      if (plan) renderPlan(plan)
    }
    
    modal.show()
  }

  function getExerciseBreakdown(type, position) {
    const exercises = {
      strength: {
        'QB': [
          { name: 'Squats', details: '4 sets x 8-10 reps @ 75% 1RM' },
          { name: 'RDLs', details: '3 sets x 10-12 reps @ 70% 1RM' },
          { name: 'Sled Pushes', details: '3 sets x 20 yards' },
          { name: 'Core Rotation', details: '3 sets x 15 reps each side' }
        ],
        'WR': [
          { name: 'Squats', details: '4 sets x 8-10 reps @ 75% 1RM' },
          { name: 'Lunges', details: '3 sets x 12 reps each leg' },
          { name: 'Plyometric Jumps', details: '3 sets x 8 reps' },
          { name: 'Single-leg RDLs', details: '3 sets x 10 reps each leg' }
        ],
        'LB': [
          { name: 'Squats', details: '5 sets x 5 reps @ 85% 1RM' },
          { name: 'Deadlifts', details: '4 sets x 6 reps @ 80% 1RM' },
          { name: 'Sled Pushes', details: '4 sets x 25 yards' },
          { name: 'Weighted Carries', details: '3 sets x 50 yards' }
        ],
        'CB': [
          { name: 'Squats', details: '4 sets x 8-10 reps @ 75% 1RM' },
          { name: 'Lunges', details: '3 sets x 12 reps each leg' },
          { name: 'Single-leg Power', details: '3 sets x 8 reps each leg' },
          { name: 'Calf Raises', details: '4 sets x 15 reps' }
        ]
      },
      conditioning: {
        'QB': [
          { name: '7-on-7 Simulation', details: '30 minutes of game-like scenarios' },
          { name: 'Sprint Intervals', details: '8 x 40-yard sprints with 2 min rest' },
          { name: 'Pocket Movement', details: '15 minutes of footwork drills' }
        ],
        'WR': [
          { name: 'Route Running', details: '20 minutes of various routes' },
          { name: 'Sprint Intervals', details: '10 x 40-yard sprints with 90 sec rest' },
          { name: 'Agility Ladder', details: '3 sets x 30 seconds' }
        ],
        'LB': [
          { name: 'Tackling Form', details: '20 minutes of technique work' },
          { name: 'Reaction Drills', details: '15 minutes of quick response training' },
          { name: 'Sled Hits', details: '3 sets x 10 reps' }
        ],
        'CB': [
          { name: 'Coverage Drills', details: '25 minutes of 1v1 scenarios' },
          { name: 'Backpedal Work', details: '15 minutes of technique' },
          { name: 'Ball Skills', details: '10 minutes of interception practice' }
        ]
      },
      skill: {
        'QB': [
          { name: 'Throwing Mechanics', details: '30 minutes of form work' },
          { name: 'Footwork Drills', details: '20 minutes of pocket movement' },
          { name: 'Accuracy Training', details: '15 minutes of target practice' }
        ],
        'WR': [
          { name: 'Route Running', details: '25 minutes of route tree' },
          { name: 'Catching Drills', details: '20 minutes of hand work' },
          { name: 'Speed Work', details: '15 minutes of acceleration' }
        ],
        'LB': [
          { name: 'Tackling Footwork', details: '25 minutes of technique' },
          { name: 'Lateral Movement', details: '20 minutes of agility' },
          { name: 'Coverage Drills', details: '15 minutes of pass coverage' }
        ],
        'CB': [
          { name: 'Mirror Drills', details: '20 minutes of reaction work' },
          { name: 'Ball Tracking', details: '15 minutes of interception practice' },
          { name: 'Hip Mobility', details: '10 minutes of flexibility work' }
        ]
      },
      rest: {
        'QB': [
          { name: 'Active Recovery', details: '20 minute light walk' },
          { name: 'Mobility Work', details: '15 minutes of stretching' },
          { name: 'Film Study', details: '30 minutes of game analysis' }
        ],
        'WR': [
          { name: 'Active Recovery', details: '20 minute light walk' },
          { name: 'Mobility Work', details: '15 minutes of stretching' },
          { name: 'Film Study', details: '30 minutes of route analysis' }
        ],
        'LB': [
          { name: 'Active Recovery', details: '20 minute light walk' },
          { name: 'Mobility Work', details: '15 minutes of stretching' },
          { name: 'Film Study', details: '30 minutes of defensive analysis' }
        ],
        'CB': [
          { name: 'Active Recovery', details: '20 minute light walk' },
          { name: 'Mobility Work', details: '15 minutes of stretching' },
          { name: 'Film Study', details: '30 minutes of coverage analysis' }
        ]
      }
    }
    
    return exercises[type]?.[position] || [
      { name: 'General Exercise', details: 'Standard workout for this type' }
    ]
  }

  function getPreWorkoutMeal(type, position) {
    const meals = {
      'QB': 'Oatmeal with berries + Greek yogurt + banana',
      'WR': 'Rice cakes with almond butter + banana + sports drink',
      'LB': 'Sweet potato + grilled chicken + mixed vegetables',
      'CB': 'Quinoa bowl with chicken + avocado + vegetables'
    }
    return meals[position] || 'Complex carbs + lean protein + hydration'
  }

  function getPostWorkoutMeal(type, position) {
    const meals = {
      'QB': 'Protein shake + banana + electrolyte drink',
      'WR': 'Chocolate milk + protein bar + water',
      'LB': 'Grilled chicken + rice + vegetables + protein shake',
      'CB': 'Greek yogurt + berries + granola + water'
    }
    return meals[position] || '3:1 carb-to-protein ratio within 30 minutes'
  }

  function getEveningMeal(type, position) {
    const meals = {
      'QB': 'Salmon + quinoa + roasted vegetables + recovery drink',
      'WR': 'Turkey + sweet potato + green vegetables + herbal tea',
      'LB': 'Lean beef + brown rice + vegetables + protein shake',
      'CB': 'White fish + rice + vegetables + recovery drink'
    }
    return meals[position] || 'Balanced meal with lean protein + complex carbs + vegetables'
  }

  function renderPlan(plan) {
    const container = document.getElementById('planList')
    container.innerHTML = ''
    const completions = window.AppStorage.getCompletions()
    const profile = window.AppStorage.getProfile()
    const isFootball = profile && profile.sport === 'Football'
    
    plan.forEach((item) => {
      const checked = !!completions[item.date]
      const div = document.createElement('div')
      
      if (isFootball) {
        div.className = `card workout-card football-specific ${profile.position.toLowerCase()} ${item.type} ${checked ? 'done' : ''}`
        div.innerHTML = renderFootballWorkout(item, profile.position, checked)
      } else {
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
      }
      
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
    
    // Add click handlers for detailed day view
    container.addEventListener('click', function (e) {
      const workoutCard = e.target.closest('.workout-card')
      if (workoutCard && !e.target.matches('input[type="checkbox"]') && !e.target.matches('button')) {
        const day = workoutCard.querySelector('h6').textContent.split(' • ')[0]
        const date = workoutCard.querySelector('h6').textContent.split(' • ')[1]
        const workout = workoutCard.querySelector('p').textContent
        const type = workoutCard.classList.contains('strength') ? 'strength' : 
                    workoutCard.classList.contains('conditioning') ? 'conditioning' :
                    workoutCard.classList.contains('skill') ? 'skill' : 'rest'
        
        showDayDetail(day, date, workout, type, profile)
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
          const tips = await window.Api.getTips(profile.sport, profile.position)
          renderEnhancedNutrition(tips, profile.position)
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
          const tips = await window.Api.getTips(p.sport, p.position)
          renderEnhancedNutrition(tips, p.position)
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


