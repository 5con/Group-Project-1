# FitTrack Frontend

Static Bootstrap 5 app (no build tools). Provides login, first-time onboarding, weekly workout plan, calendar, streak tracking, and settings.

## Structure

- `index.html`: Landing / login
- `home.html`: Home with weekly plan, athlete, diet tips, onboarding modal
- `calendar.html`: Week view with completion toggles
- `settings.html`: Edit profile and regenerate plan
- `resoruces/`
  - `styles/main.css`: Minimal custom styles
  - `scripts/`
    - `config.js`: API base URL & flags
    - `storage.js`: localStorage, week helpers, streak
    - `auth.js`: login/logout + guard
    - `onboarding.js`: profile modal, plan generation, athlete/diet helpers
    - `home.js`, `calendar.js`, `settings.js`: page scripts
  - `images/`: local SVG athlete placeholders

## Running Locally

Open with any static server (or directly via file://).

No Node or bundlers required.

## Data & Persistence

- Stored in `localStorage`.
- Keys: `ft_auth_v1`, `ft_profile_v1`, `ft_plans_v1`, `ft_completions_v1`.
- Streak counts consecutive completed days up to today.

## Backend Integration

- Configure `resoruces/scripts/config.js` with your backend base URL and toggle:

```js
window.AppConfig = {
  API_BASE_URL: 'http://localhost:5226',
  USE_BACKEND_WHEN_AVAILABLE: true,
}
```

- Scripts involved: `api.js`, `onboarding.js`, `home.js`.
  - On onboarding submit, user is upserted by email, server plan is generated for the current week, stored locally, and rendered.
  - On home load, the app fetches the plan for the week; if none, it requests generation. Diet tips are also fetched.

If backend is down, the app falls back to local plan generation and localStorage.

## Reusability Notes

- Keep logic in `resoruces/scripts/*` modular and page-specific initialization in each page script.
- Prefer Bootstrap utilities; only extend CSS in `main.css`.
- Athlete images are local SVG placeholders to avoid external dependencies.
