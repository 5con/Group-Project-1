using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default") ?? "Data Source=app.db";
    options.UseSqlite(connectionString);
});
builder.Services.AddScoped<PlanService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", p => p
        .WithOrigins(
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "https://localhost:5500",
            "https://127.0.0.1:5500")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Ensure DB exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

// Minimal API endpoints
var users = app.MapGroup("/api/users");

users.MapGet("", async (string? email, AppDbContext db) =>
{
    if (!string.IsNullOrWhiteSpace(email))
    {
        var match = await db.Users.AsNoTracking()
            .Where(u => u.Email.ToLower() == email.ToLower())
            .ToListAsync();
        return Results.Ok(match);
    }
    return Results.Ok(await db.Users.AsNoTracking().ToListAsync());
});

users.MapGet("/{id:int}", async Task<Results<Ok<Backend.Models.User>, NotFound>> (int id, AppDbContext db) =>
{
    var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
    return user is null ? TypedResults.NotFound() : TypedResults.Ok(user);
});

users.MapPost("", async Task<Created<Backend.Models.User>> (Backend.Models.User user, AppDbContext db) =>
{
    user.CreatedAtUtc = DateTime.UtcNow;
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return TypedResults.Created($"/api/users/{user.Id}", user);
});

users.MapPut("/{id:int}", async Task<Results<NoContent, NotFound>> (int id, Backend.Models.User updated, AppDbContext db) =>
{
    var existing = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (existing is null) return TypedResults.NotFound();

    existing.Email = updated.Email;
    existing.HeightCm = updated.HeightCm;
    existing.WeightKg = updated.WeightKg;
    existing.Sport = updated.Sport;
    existing.Level = updated.Level;
    existing.Position = updated.Position;
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});

users.MapDelete("/{id:int}", async Task<Results<NoContent, NotFound>> (int id, AppDbContext db) =>
{
    var existing = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (existing is null) return TypedResults.NotFound();
    db.Users.Remove(existing);
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
});

// Plans
users.MapGet("/{id:int}/plans", async (int id, DateOnly? weekStart, AppDbContext db) =>
{
    var userExists = await db.Users.AsNoTracking().AnyAsync(u => u.Id == id);
    if (!userExists) return Results.NotFound();

    var start = weekStart ?? DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek));
    var end = start.AddDays(7);
    var plans = await db.PlanDays.AsNoTracking()
        .Where(p => p.UserId == id && p.Date >= start && p.Date < end)
        .OrderBy(p => p.Date)
        .ToListAsync();
    return Results.Ok(plans);
});

users.MapPost("/{id:int}/plans/generate", async (int id, DateOnly? weekStart, AppDbContext db, PlanService planner) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (user is null) return Results.NotFound();

    var start = weekStart ?? DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek));
    var (planDays, advice) = planner.GenerateWeeklyPlan(user, start);

    // Remove existing for that week
    var end = start.AddDays(7);
    var existing = await db.PlanDays.Where(p => p.UserId == id && p.Date >= start && p.Date < end).ToListAsync();
    db.PlanDays.RemoveRange(existing);

    foreach (var day in planDays)
    {
        day.UserId = id;
        db.PlanDays.Add(day);
    }
    await db.SaveChangesAsync();

    return Results.Ok(new { plan = planDays.OrderBy(p => p.Date), advice });
});

// Tips
app.MapGet("/api/tips/{sport}", (string sport, PlanService planner) => Results.Ok(planner.GetDietTips(sport)));
app.MapGet("/api/tips/{sport}/{position}", (string sport, string position, PlanService planner) => Results.Ok(planner.GetPositionSpecificDietTips(sport, position)));

app.Run();
