# FitTrack Backend (.NET API)

Minimal ASP.NET Core Web API with SQLite and an ORM (Entity Framework Core). Provides CRUD for Users and generated weekly plans based on sport and level.

## Requirements

- .NET 8 SDK

## Running

```powershell
cd Backend
# restore and run
dotnet restore
dotnet run
# default: http://localhost:5000 (adjust launchSettings if needed)
```

## Entities (example)

- User: Id, Email, HeightCm, WeightKg, Sport, Level, CreatedAt
- PlanDay: Id, UserId, Date (ISO), DayName, Workout, Type

## Endpoints

- GET `/api/users?email=you@example.com` → list (filter by email optional)
- GET `/api/users/{id}` → user
- POST `/api/users` → create user { email, heightCm, weightKg, sport, level }
- PUT `/api/users/{id}` → update
- DELETE `/api/users/{id}` → delete
- GET `/api/users/{id}/plans?weekStart=YYYY-MM-DD` → 7-day plan for week
- POST `/api/users/{id}/plans/generate?weekStart=YYYY-MM-DD` → regenerate plan for week, returns `{ plan, advice }`
- GET `/api/tips/{sport}` → diet tips array

## Notes

- Use EF Core + SQLite (single file DB). Migrations recommended.
- Seed default tips for each sport.
- Plan generation can mirror the frontend logic initially; later, make it data-driven.
- Enable CORS for `http://localhost:5500`.

### Connection string

App uses SQLite file `app.db` by default via `ConnectionStrings:Default`.

## Frontend Integration

Configure the frontend base URL in `Frontend/resoruces/scripts/config.js`:

```js
window.AppConfig = {
  API_BASE_URL: 'http://localhost:5226',
  USE_BACKEND_WHEN_AVAILABLE: true,
}
```

Flow:
- On onboarding submit, frontend upserts user (by email) and `POST`s plan generation for current week; saves to localStorage for offline use.
- On home load, frontend fetches existing plan; if empty, it generates; also fetches `/api/tips/{sport}`.

## Sample CORS (Program.cs)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        p => p.WithOrigins("http://localhost:5500")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("AllowFrontend");
```
