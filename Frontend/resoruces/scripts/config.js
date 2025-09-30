/*
  FitTrack Config (resoruces/scripts/config.js)
  Centralized configuration for API endpoints and feature flags.
*/

;(function () {
  window.AppConfig = {
    // Base URL of the backend API; adjust to your local .NET API port.
    API_BASE_URL: 'http://localhost:5226',

    // Whether to prefer backend for plans and tips. If backend is unavailable,
    // the frontend will gracefully fallback to local generation.
    USE_BACKEND_WHEN_AVAILABLE: true,
  }
})()


