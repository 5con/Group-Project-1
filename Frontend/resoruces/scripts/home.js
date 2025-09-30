/*
  Home Page Rendering (resoruces/scripts/home.js)
  - Displays weekly plan summary
  - Shows star athlete and diet tip
  - Tracks completion and updates streak badge
*/
;(function () {
  let cachedPlan = []
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

    const showPosition = profile.position && profile.position.length > 0
    const sportLabel = showPosition
      ? `${profile.sport} • ${profile.position} • ${profile.level}`
      : `${profile.sport} • ${profile.level}`
    document.getElementById('sportLabel').textContent = sportLabel

    const diet = window.Onboarding.getDietTip(profile.sport)
    document.getElementById('dietTips').textContent = diet

    const athleteCard = document.querySelector('#athleteImg').closest('.card')
    if (athleteCard) {
      athleteCard.classList.remove(
        'athlete-card',
        'qb',
        'wr',
        'lb',
        'cb',
        'running',
        'basketball',
        'pg',
        'forward',
        'center'
      )
      athleteCard.classList.add('athlete-card')

      if (profile.sport === 'Football' && profile.position) {
        athleteCard.classList.add(profile.position.toLowerCase())
      }

      if (profile.sport === 'Running') {
        athleteCard.classList.add('running')
      }

      if (profile.sport === 'Basketball' && profile.position) {
        athleteCard.classList.add('basketball', profile.position.toLowerCase())
      }
    }

    renderPositionDashboard(profile)
  }

  function getPositionIcon(position) {
    const icons = {
      'QB': '🏈',
      'WR': '⚡',
      'LB': '🎯',
      'CB': '🏃‍♂️',
      'PG': '🧠',
      'Forward': '🎯',
      'Center': '🎯'
    }
    return icons[position] || '🏈'
  }

  function renderRunningWorkout(item, checked) {
    const workoutTypes = {
      'strength': { icon: '💪', color: 'primary', title: 'Strength Training' },
      'skills': { icon: '🏃‍♂️', color: 'success', title: 'Form & Drills' },
      'conditioning': { icon: '⚡', color: 'info', title: 'Speed Work' },
      'mobility': { icon: '🧘‍♂️', color: 'warning', title: 'Recovery & Mobility' },
      'rest': { icon: '😴', color: 'secondary', title: 'Rest Day' }
    }
    
    const workout = workoutTypes[item.type] || { icon: '🏃‍♂️', color: 'primary', title: 'Running Workout' }
    
    return `
      <div class="card-body">
        <div class="d-flex align-items-center mb-2">
          <span class="badge bg-${workout.color} me-2">${workout.icon}</span>
          <div class="flex-grow-1">
            <div class="fw-semibold">${item.day} • ${item.date}</div>
            <div class="text-secondary small">${workout.title}</div>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" ${checked ? 'checked' : ''} data-date="${item.date}" />
          </div>
        </div>
        <div class="workout-details">
          <div class="text-muted small">${item.workout}</div>
        </div>
        <div class="mt-2">
          <button class="btn btn-outline-${workout.color} btn-sm" onclick="showRunningWorkoutDetails('${item.type}', '${item.date}')">
            View Details
          </button>
        </div>
      </div>
    `
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

  function renderPositionDashboard(profile) {
    const dashboard = document.getElementById('positionDashboard')
    const metrics = document.getElementById('positionMetrics')

    if (!dashboard || !metrics) return

    const sport = profile?.sport
    const position = profile?.position

    if (!sport || !position) {
      dashboard.style.display = 'none'
      metrics.innerHTML = ''
      return
    }

    const data = getPositionMetricsForSport(sport, position)
    if (!data || data.metrics.length === 0) {
      dashboard.style.display = 'none'
      metrics.innerHTML = ''
      return
    }

    dashboard.style.display = 'block'

    const positionClass = (data.className || position).toLowerCase()

    metrics.innerHTML = data.metrics
      .map(
        (metric) => `
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
    `
      )
      .join('')
  }

  function getPositionMetricsForSport(sport, position) {
    if (sport === 'Football') {
      const metrics = {
        QB: [
          { label: 'Throwing Accuracy', value: '87%', target: 'Goal: 90%', progress: 87 },
          { label: 'Pocket Time', value: '3.2s', target: 'Goal: 3.5s', progress: 91 },
          { label: 'Decision Speed', value: '2.1s', target: 'Goal: 2.0s', progress: 95 }
        ],
        WR: [
          { label: 'Route Running', value: '92%', target: 'Goal: 95%', progress: 92 },
          { label: 'Catch Rate', value: '89%', target: 'Goal: 90%', progress: 89 },
          { label: '40-Yard Dash', value: '4.3s', target: 'Goal: 4.2s', progress: 95 }
        ],
        LB: [
          { label: 'Tackling Form', value: '94%', target: 'Goal: 95%', progress: 94 },
          { label: 'Reaction Time', value: '0.8s', target: 'Goal: 0.7s', progress: 88 },
          { label: 'Bench Press', value: '315 lbs', target: 'Goal: 325 lbs', progress: 97 }
        ],
        CB: [
          { label: 'Coverage Skills', value: '91%', target: 'Goal: 93%', progress: 91 },
          { label: 'Hip Flexibility', value: '88%', target: 'Goal: 90%', progress: 88 },
          { label: 'Shuttle Run', value: '4.1s', target: 'Goal: 4.0s', progress: 98 }
        ]
      }
      return { className: position, metrics: metrics[position] || [] }
    }

    if (sport === 'Basketball') {
      const blueprints = window.Onboarding?.BASKETBALL_BLUEPRINTS
      const blueprint = blueprints ? blueprints[position] : null
      if (!blueprint) return null
      return { className: position, metrics: blueprint.metrics || [] }
    }

    return null
  }

  function renderEnhancedNutrition(tips, position, sport) {
    const nutritionContent = document.getElementById('nutritionContent')
    if (!nutritionContent) return

    const positionClass = position ? position.toLowerCase() : ''
    const tipsArray = Array.isArray(tips) ? tips : [String(tips)]

    const macroTargets = getPositionMacros(position, sport)
    const hydrationInfo = getHydrationInfo(position, sport)
    const blueprint = sport === 'Basketball' ? window.Onboarding?.BASKETBALL_BLUEPRINTS?.[position] : null
    const businessTips = blueprint?.nutritionTips || []

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
        ${businessTips.map(tip => `<div class="nutrition-tip">${tip}</div>`).join('')}
      </div>

      <div class="hydration-tracker">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Hydration Goal</h6>
          <span class="fw-semibold">${hydrationInfo.goal}</span>
        </div>
        <div class="hydration-progress">
          <div class="hydration-bar" style="width: 70%"></div>
        </div>
        <small class="text-muted mt-1 d-block">${hydrationInfo.notes}</small>
      </div>
    `
  }

  function getPositionMacros(position, sport) {
    if (sport === 'Basketball') {
      const blueprint = window.Onboarding?.BASKETBALL_BLUEPRINTS?.[position]
      if (blueprint?.macros) return blueprint.macros
      return { protein: 180, carbs: 450, fat: 85 }
    }

    const macros = {
      QB: { protein: 160, carbs: 400, fat: 80 },
      WR: { protein: 150, carbs: 380, fat: 75 },
      LB: { protein: 180, carbs: 420, fat: 90 },
      CB: { protein: 155, carbs: 360, fat: 70 }
    }
    return macros[position] || { protein: 160, carbs: 400, fat: 80 }
  }

  function getHydrationInfo(position, sport) {
    if (sport === 'Basketball') {
      const blueprint = window.Onboarding?.BASKETBALL_BLUEPRINTS?.[position]
      if (blueprint?.hydration) return blueprint.hydration
      return {
        goal: '4.0L / day',
        notes: 'Sip 12-14oz every 20 minutes during court work.'
      }
    }

    return {
      goal: '3.5L / 5L',
      notes: 'Drink 16-20oz 2h before training'
    }
  }

  function renderBasketballWorkout(item, profile, checked) {
    const blueprint = window.Onboarding?.BASKETBALL_BLUEPRINTS?.[profile.position]
    const level = profile.level
    const data = blueprint?.sessions?.[item.key]

    const intensity = data?.intensity?.[level] || 3
    const duration = data?.duration?.[level] || '60 min'
    const equipment = data?.equipment || 'Basketball + court'
    const icon = profile.position === 'PG' ? '🏀' : profile.position === 'Forward' ? '🛡️' : '🛠️'

    const summary = data?.cardSummary?.[level] || item.workout
    const notes = (data?.notes || []).slice(0, 2)

    return `
      <div class="card-body">
        <div class="d-flex align-items-start gap-3">
          <div class="basketball-icon ${profile.position.toLowerCase()}">${icon}</div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1 fw-semibold">${item.day} • ${item.date}</h6>
                <p class="mb-1 text-muted">${summary}</p>
                <div class="d-flex flex-wrap gap-3 small text-secondary">
                  <span><span class="equipment-icon">⏱️</span>${duration}</span>
                  <span><span class="equipment-icon">🧰</span>${equipment}</span>
                </div>
              </div>
              <div class="text-end">
                <span class="badge text-bg-dark text-uppercase">${item.type}</span>
                <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" ${checked ? 'checked' : ''} data-date="${item.date}" />
                </div>
              </div>
            </div>
            <div class="intensity-meter mt-2">
              ${getIntensityDots(intensity)}
            </div>
            ${notes.length > 0 ? `
            <ul class="mt-3 mb-0 small text-secondary basketball-notes">
              ${notes.map((note) => `<li>${note}</li>`).join('')}
            </ul>
            ` : ''}
            ${data?.doubleSession?.[level] ? `
            <div class="alert alert-warning mt-3 py-2 px-3 small">
              <strong>PM Block:</strong> ${data.doubleSession[level]}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }

  function showDayDetail(day, date, workout, type, profile, planItem) {
    const modal = new bootstrap.Modal(document.getElementById('dayDetailModal'))
    const title = document.getElementById('dayDetailTitle')
    const content = document.getElementById('dayDetailContent')
    const markCompleteBtn = document.getElementById('markCompleteBtn')

    title.textContent = `${day} • ${date} - ${type.toUpperCase()}`

    const positionClass = profile.position ? profile.position.toLowerCase() : ''
    const isCompleted = window.AppStorage.getCompletions()[date]

    if (profile.sport === 'Basketball' && planItem) {
      const blueprint = window.Onboarding?.BASKETBALL_BLUEPRINTS?.[profile.position]
      const session = planItem.key ? blueprint?.sessions?.[planItem.key] : null
      const level = profile.level

      const exercises = session ? getBasketballExerciseBreakdown(session, level) : []
      const nutrition = session?.nutrition?.[level] || {}

      content.innerHTML = `
        <div class="workout-detail-card ${positionClass}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">${session?.title || `${type.toUpperCase()} Workout`}</h5>
            ${session?.inspiration ? `<span class="badge text-bg-dark">${session.inspiration}</span>` : ''}
          </div>
          <p class="mb-3">${session?.summary || workout}</p>
          ${session?.film ? `<div class="alert alert-secondary py-2 px-3 small">Film Study: ${session.film}</div>` : ''}
          ${session?.segments ? `
          <h6 class="mt-3 mb-2">Session Blocks</h6>
          <ol class="exercise-list">
            ${session.segments.map((segment, index) => `
              <li class="exercise-item">
                <div>
                  <div class="exercise-name">${index + 1}. ${segment.split(':')[0]}</div>
                  <div class="exercise-details">${segment}</div>
                </div>
              </li>
            `).join('')}
          </ol>
          ` : ''}
          ${exercises.length > 0 ? `
          <h6 class="mt-3 mb-2">Level Focus & Finishers</h6>
          <ul class="exercise-list">
            ${exercises.map((exercise) => `
              <li class="exercise-item">
                <div>
                  <div class="exercise-name">${exercise.name}</div>
                  <div class="exercise-details">${exercise.details}</div>
                </div>
              </li>
            `).join('')}
          </ul>
          ` : ''}
          ${session?.notes?.length ? `
          <div class="alert alert-info mt-3 py-2 px-3 small">
            <strong>Coach Notes:</strong> ${session.notes.join(' • ')}
          </div>
          ` : ''}
        </div>

        <div class="nutrition-detail-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Fuel Strategy</h5>
            <button type="button" class="btn btn-outline-dark btn-sm" id="openFuelPlanBtn">Full Plan</button>
          </div>
          <div class="meal-timing">
            <div class="meal-time">Pre-Workout (2h prior)</div>
            <div class="meal-content">${nutrition.pre || 'High-carb plate + lean protein + hydration stack.'}</div>
          </div>
          <div class="meal-timing">
            <div class="meal-time">During Session</div>
            <div class="meal-content">${nutrition.during || 'Water + electrolytes every 20 minutes.'}</div>
          </div>
          <div class="meal-timing">
            <div class="meal-time">Post-Workout (30 min)</div>
            <div class="meal-content">${nutrition.post || '30g protein + 60-80g carbs within 30 minutes.'}</div>
          </div>
          <div class="meal-timing">
            <div class="meal-time">Evening Recovery</div>
            <div class="meal-content">${nutrition.evening || 'Balanced meal with lean protein, complex carbs, antioxidants.'}</div>
          </div>
        </div>
      `

      setTimeout(() => {
        const btn = document.getElementById('openFuelPlanBtn')
        if (btn) {
          btn.addEventListener('click', function (event) {
            event.stopPropagation()
            openFuelPlanModal(profile, session, level)
          })
        }
      }, 0)
    } else {
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
    }

    markCompleteBtn.textContent = isCompleted ? 'Mark Incomplete' : 'Mark Complete'
    markCompleteBtn.onclick = function() {
      const newStatus = !isCompleted
      window.AppStorage.setCompletion(date, newStatus)
      renderStreak()
      modal.hide()
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
        ],
        'PG': [
          { name: 'Trap Bar Deadlift Clusters', details: '5x3 @ 85% with velocity feedback' },
          { name: 'Single-leg Pogo Jumps', details: '4x8 each leg with 45s rest' },
          { name: 'Half-kneeling Cable Press', details: '3x10 with anti-rotation focus' },
          { name: 'Med-ball Hook Passes', details: '3x10 each side with intent' }
        ],
        'Forward': [
          { name: 'Front Squat Waves', details: '4x5 @ 80% + iso holds 30s' },
          { name: 'Landmine Press + Med-ball Chest Pass', details: 'Super-set 4 rounds' },
          { name: 'Rear-foot Split Squat', details: '4x8 each leg @ RPE 8' },
          { name: 'Sled Push Finish', details: '4x25m heavy push' }
        ],
        'Center': [
          { name: 'Front Squat Triples', details: '5x3 @ 85% with tempo eccentric' },
          { name: 'Farmer/Yoke Carry', details: '4x30m heavy, tall posture' },
          { name: 'Glute Bridge Iso', details: '4x20s hold + 10 reps' },
          { name: 'Thoracic Mobility Pairing', details: 'Between sets, 30s each side' }
        ],
        'Running': [
          { name: 'Single-leg Squats', details: '3 sets x 8 reps each leg' },
          { name: 'Lunges', details: '3 sets x 12 reps each leg' },
          { name: 'Calf Raises', details: '4 sets x 15 reps' },
          { name: 'Hip Thrusts', details: '3 sets x 12 reps' }
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
        ],
        'PG': [
          { name: 'Agility Ladder Flow', details: '6 rounds with cross-over, Icky shuffle, lateral in/outs' },
          { name: 'Lane Agility Shuttle', details: '5 reps targeting sub 10.5s, add resistance for advanced' },
          { name: 'Court Tempo Runs', details: '10 reps baseline-to-baseline at 1:2 work:rest' }
        ],
        'Forward': [
          { name: 'Defensive Slide Matrix', details: '6 sets with closeout + retreat sequences' },
          { name: 'Halfcourt to Fullcourt Tempos', details: '8 reps, focus on posture and decels' },
          { name: 'Single-leg Bounds', details: '3x12 each leg with soft landings' }
        ],
        'Center': [
          { name: 'Lane Sprint Repeats', details: '8 reps, 1:1 rest, track best time' },
          { name: 'Sled Drags Forward/Backward', details: '5 sets heavy drag 15m each direction' },
          { name: 'Bike Intervals', details: '8 x 30s hard / 45s easy, nasal breathing on recovery' }
        ],
        'Running': [
          { name: 'Tempo Run', details: '20-30 minutes at moderate pace' },
          { name: 'Fartlek Training', details: '25 minutes of varied pace' },
          { name: 'Hill Repeats', details: '6-8 x 2-minute hill climbs' }
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
        ],
        'PG': [
          { name: 'Two-Ball Ladder', details: '5 rounds including tennis ball distraction' },
          { name: 'Pick-and-Roll Pace Finishes', details: '4 sets w/ pad contact, add veer + hang dribbles advanced' },
          { name: 'Relocation Shooting Circuit', details: '80 makes with drift + flare patterns' }
        ],
        'Forward': [
          { name: 'Triple-Threat Ladder', details: '60 makes across spots with jab counter progression' },
          { name: 'Mid-post Footwork', details: 'Spin, fade, step-through with pad contact' },
          { name: 'Sidestep & Drift 3s', details: '4 rounds focusing on balance + speed' }
        ],
        'Center': [
          { name: 'High-Post DHO Sequencing', details: '8-minute blocks, add fake DHO + re-screen' },
          { name: 'Low-post Counter Series', details: 'Drop-step, up-and-under, Sombor shuffle' },
          { name: 'Short-roll Passing', details: '20 assisted reps hitting cutters + corners' }
        ],
        'Running': [
          { name: 'Form Drills', details: '15 minutes of running mechanics' },
          { name: 'Cadence Work', details: '10 minutes of stride rate practice' },
          { name: 'Breathing Drills', details: '10 minutes of rhythm training' }
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
        ],
        'PG': [
          { name: 'Mobility Flow', details: '20 minutes hips/ankles/thoracic + breath work' },
          { name: 'Film Reset', details: '30 minutes pick-and-roll reads vs coverage' },
          { name: 'Mindfulness', details: '10 minutes guided breathing and journaling' }
        ],
        'Forward': [
          { name: 'Mobility & Yoga', details: '25 minutes hip + shoulder flow' },
          { name: 'NormaTec or Bike Flush', details: '20 minutes easy effort' },
          { name: 'Visualization', details: '10 minutes game scenarios' }
        ],
        'Center': [
          { name: 'Pool Walk or Bike', details: '20 minutes low-impact movement' },
          { name: 'Mobility Flow', details: '20 minutes focusing on hips and thoracic' },
          { name: 'Breath Ladder', details: '8 minutes box breathing + HRV check' }
        ],
        'Running': [
          { name: 'Easy Walk', details: '30 minute light walk' },
          { name: 'Foam Rolling', details: '20 minutes of self-massage' },
          { name: 'Yoga/Stretching', details: '30 minutes of flexibility work' }
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
    cachedPlan = plan
    const container = document.getElementById('planList')
    container.innerHTML = ''
    const completions = window.AppStorage.getCompletions()
    const profile = window.AppStorage.getProfile()
    const isFootball = profile && profile.sport === 'Football'
    const isRunning = profile && profile.sport === 'Running'
    const isBasketball = profile && profile.sport === 'Basketball'

    plan.forEach((item) => {
      const checked = !!completions[item.date]
      const div = document.createElement('div')

      if (isFootball) {
        div.className = `card workout-card football-specific ${profile.position.toLowerCase()} ${item.type} ${checked ? 'done' : ''}`
        div.innerHTML = renderFootballWorkout(item, profile.position, checked)
      } else if (isBasketball) {
        div.className = `card workout-card basketball-specific ${profile.position.toLowerCase()} ${item.type} ${checked ? 'done' : ''}`
        div.innerHTML = renderBasketballWorkout(item, profile, checked)
      } else if (isRunning) {
        div.className = `card workout-card running-specific ${item.type} ${checked ? 'done' : ''}`
        div.innerHTML = renderRunningWorkout(item, checked)
      } else {
        div.className = `card workout-card ${checked ? 'done' : ''}`
        div.innerHTML = `
          <div class="card-body d-flex align-items-center justify-content-between">
            <div>
              <div class="fw-semibold">${item.day} • ${item.date}</div>
              <div class="text-secondary">${item.workout}</div>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" ${checked ? 'checked' : ''} data-date="${item.date}" />
            </div>
          </div>
        `
      }

      div.setAttribute('data-day', item.day)
      div.setAttribute('data-date', item.date)
      div.setAttribute('data-type', item.type)
      if (item.key) div.setAttribute('data-key', item.key)

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

    container.addEventListener('click', function (e) {
      const workoutCard = e.target.closest('.workout-card')
      if (workoutCard && !e.target.matches('input[type="checkbox"]') && !e.target.matches('button')) {
        const day = workoutCard.getAttribute('data-day')
        const date = workoutCard.getAttribute('data-date')
        const type = workoutCard.getAttribute('data-type')
        const planItem = cachedPlan.find((p) => p.date === date)
        const summary = planItem ? planItem.workout : ''

        showDayDetail(day, date, summary, type || '', profile, planItem)
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
          renderEnhancedNutrition(tips, profile.position, profile.sport)
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
          renderEnhancedNutrition(tips, p.position, p.sport)
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

  // Running workout details function
  function showRunningWorkoutDetails(type, date) {
    const runningWorkouts = {
      strength: {
        title: 'Strength Training',
        description: 'Running-specific strength exercises to improve power and prevent injury',
        exercises: [
          { name: 'Single-leg Squats', details: '3 sets x 8 reps each leg' },
          { name: 'Lunges', details: '3 sets x 12 reps each leg' },
          { name: 'Calf Raises', details: '4 sets x 15 reps' },
          { name: 'Hip Thrusts', details: '3 sets x 12 reps' }
        ],
        tips: [
          'Focus on single-leg movements to improve balance',
          'Maintain proper form throughout each exercise',
          'Control the eccentric (lowering) phase',
          'Engage your core during all movements'
        ]
      },
      skills: {
        title: 'Form & Drills',
        description: 'Running mechanics and technique work',
        exercises: [
          { name: 'Form Drills', details: '15 minutes of running mechanics' },
          { name: 'Cadence Work', details: '10 minutes of stride rate practice' },
          { name: 'Breathing Drills', details: '10 minutes of rhythm training' }
        ],
        tips: [
          'Focus on landing on your midfoot',
          'Maintain a slight forward lean from ankles',
          'Keep your arms relaxed and moving forward',
          'Practice breathing in rhythm with your steps'
        ]
      },
      conditioning: {
        title: 'Speed Work',
        description: 'High-intensity training to improve speed and VO2 max',
        exercises: [
          { name: 'Tempo Run', details: '20-30 minutes at moderate pace' },
          { name: 'Fartlek Training', details: '25 minutes of varied pace' },
          { name: 'Hill Repeats', details: '6-8 x 2-minute hill climbs' }
        ],
        tips: [
          'Warm up thoroughly before speed work',
          'Start conservatively and build intensity',
          'Focus on maintaining form at higher speeds',
          'Cool down properly after intense efforts'
        ]
      },
      mobility: {
        title: 'Recovery & Mobility',
        description: 'Active recovery and flexibility work',
        exercises: [
          { name: 'Easy Walk', details: '30 minute light walk' },
          { name: 'Foam Rolling', details: '20 minutes of self-massage' },
          { name: 'Yoga/Stretching', details: '30 minutes of flexibility work' }
        ],
        tips: [
          'Listen to your body and adjust intensity',
          'Focus on hip flexor and calf stretches',
          'Use foam rolling for muscle recovery',
          'Practice deep breathing during stretching'
        ]
      },
      rest: {
        title: 'Rest Day',
        description: 'Complete rest or light active recovery',
        exercises: [
          { name: 'Optional Light Activity', details: '0-30 minutes of walking, yoga, or complete rest' }
        ],
        tips: [
          'Rest is when your body adapts and gets stronger',
          'Light walking or stretching is OK if you feel good',
          'Focus on sleep and nutrition',
          'Mental recovery is just as important as physical'
        ]
      }
    }
    
    const workout = runningWorkouts[type] || runningWorkouts.strength
    const modal = new bootstrap.Modal(document.getElementById('dayDetailModal'))
    const titleEl = document.getElementById('dayDetailTitle')
    const contentEl = document.getElementById('dayDetailContent')
    
    if (titleEl) titleEl.textContent = `${workout.title} - ${date}`
    
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="mb-3">
          <p class="text-muted">${workout.description}</p>
        </div>
        
        <div class="mb-3">
          <h6>Workout Structure</h6>
          <div class="list-group">
            ${workout.exercises.map(ex => `
              <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">${ex.name}</h6>
                    <p class="mb-1 small">${ex.details}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="mb-3">
          <h6>Key Tips</h6>
          <ul class="list-unstyled">
            ${workout.tips.map(tip => `<li class="mb-1">• ${tip}</li>`).join('')}
          </ul>
        </div>
        
        <div class="mb-3">
          <h6>Running Nutrition</h6>
          <p class="mb-0">Hydrate well, eat carbs 2-3 hours before, and consume protein + carbs within 30 minutes post-run for optimal recovery.</p>
        </div>
      `
    }
    
    modal.show()
  }

  function openFuelPlanModal(profile, session, level) {
    const modalEl = document.getElementById('fuelPlanModal')
    if (!modalEl || !session) return
    const modal = new bootstrap.Modal(modalEl)
    const title = document.getElementById('fuelPlanTitle')
    const content = document.getElementById('fuelPlanContent')

    const nutrition = session.nutrition?.[level] || {}

    title.textContent = `${session.title || 'Fuel Strategy'} • ${profile.position}`
    content.innerHTML = `
      <div class="fuel-plan">
        <section class="mb-4">
          <h5 class="fw-semibold">Pre-Workout (2h prior)</h5>
          <p class="mb-2">${nutrition.pre || 'High-carb meal with lean protein + hydration.'}</p>
        </section>
        <section class="mb-4">
          <h5 class="fw-semibold">During Session</h5>
          <p class="mb-2">${nutrition.during || 'Water + electrolytes as needed.'}</p>
        </section>
        <section class="mb-4">
          <h5 class="fw-semibold">Post-Workout (30 min)</h5>
          <p class="mb-2">${nutrition.post || '30g protein + 60-80g carbs within 30 minutes.'}</p>
        </section>
        <section class="mb-0">
          <h5 class="fw-semibold">Evening Recovery</h5>
          <p class="mb-0">${nutrition.evening || 'Balanced meal with lean protein, complex carbs, antioxidants.'}</p>
        </section>
      </div>
    `

    modal.show()
  }

  function getBasketballExerciseBreakdown(session, level) {
    const levelNotes = session?.levelNotes?.[level]
    const segments = session?.segments || []
    const finisher = session?.finisher?.[level]

    const breakdown = []

    if (levelNotes) {
      breakdown.push({
        name: 'Level Focus',
        details: levelNotes
      })
    }

    segments.forEach((segment, index) => {
      breakdown.push({
        name: `Block ${index + 1}`,
        details: segment
      })
    })

    if (finisher) {
      breakdown.push({
        name: 'Finisher',
        details: finisher
      })
    }

    return breakdown
  }

  // Make the function globally available
  window.showRunningWorkoutDetails = showRunningWorkoutDetails

  document.addEventListener('DOMContentLoaded', init)
})()


