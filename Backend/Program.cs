using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Password hashing utility methods
string HashPassword(string password)
{
    // Generate a random salt
    byte[] salt = new byte[16];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(salt);
    }

    // Hash the password with the salt
    using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
    {
        byte[] hash = pbkdf2.GetBytes(32);

        // Combine salt and hash
        byte[] hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        // Convert to base64 string
        return Convert.ToBase64String(hashBytes);
    }
}

bool VerifyPassword(string password, string hashedPassword)
{
    // Convert base64 string back to bytes
    byte[] hashBytes = Convert.FromBase64String(hashedPassword);

    // Extract salt and hash from the stored string
    byte[] salt = new byte[16];
    byte[] hash = new byte[32];
    Array.Copy(hashBytes, 0, salt, 0, 16);
    Array.Copy(hashBytes, 16, hash, 0, 32);

    // Hash the provided password with the same salt
    using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
    {
        byte[] hashAttempt = pbkdf2.GetBytes(32);

        // Compare the hashes
        for (int i = 0; i < 32; i++)
        {
            if (hash[i] != hashAttempt[i])
                return false;
        }
        return true;
    }
}

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
            "https://127.0.0.1:5500",
            "http://localhost:5000",
            "http://127.0.0.1:5000",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
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

users.MapGet("/{id:int}", async Task<IResult> (int id, AppDbContext db) =>
{
    var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

users.MapPost("", async (Backend.Models.User user, AppDbContext db) =>
{
    // Check if user already exists
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == user.Email.ToLower());
    if (existingUser != null)
    {
        return Results.BadRequest(new { message = "An account with this email already exists. Please try logging in instead, or use a different email address." });
    }

    user.CreatedAtUtc = DateTime.UtcNow;
    user.Password = HashPassword(user.Password);
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});

users.MapPut("/{id:int}", async (int id, Backend.Models.User updated, AppDbContext db) =>
{
    var existing = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (existing is null) return Results.NotFound();

    // Check if email is being changed and if it conflicts with another user
    if (existing.Email.ToLower() != updated.Email.ToLower())
    {
        var emailConflict = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == updated.Email.ToLower() && u.Id != id);
        if (emailConflict != null)
        {
            return Results.BadRequest("Email is already in use by another account");
        }
    }

    existing.Email = updated.Email;
    existing.HeightCm = updated.HeightCm;
    existing.WeightKg = updated.WeightKg;
    existing.Sport = updated.Sport;
    existing.Level = updated.Level;
    existing.Position = updated.Position;

    // Only update password if it's provided (not empty)
    if (!string.IsNullOrEmpty(updated.Password))
    {
        existing.Password = HashPassword(updated.Password);
    }

    await db.SaveChangesAsync();
    return Results.NoContent();
});

users.MapDelete("/{id:int}", async Task<IResult> (int id, AppDbContext db) =>
{
    var existing = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
    if (existing is null) return Results.NotFound();
    db.Users.Remove(existing);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Authentication endpoints
users.MapPost("/login", async (Backend.Models.LoginRequest login, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == login.Email.ToLower());
    if (user == null || !VerifyPassword(login.Password, user.Password))
    {
        return Results.BadRequest("Invalid email or password");
    }

    // Return user data without password
    var userResponse = new
    {
        user.Id,
        user.Email,
        user.HeightCm,
        user.WeightKg,
        user.Sport,
        user.Level,
        user.Position,
        user.CreatedAtUtc
    };

    return Results.Ok(new { user = userResponse, message = "Login successful" });
});

// Register endpoint (same as POST /api/users but returns auth response)
users.MapPost("/register", async (Backend.Models.User user, AppDbContext db) =>
{
    // Check if user already exists
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == user.Email.ToLower());
    if (existingUser != null)
    {
        return Results.BadRequest(new { message = "An account with this email already exists. Please try logging in instead, or use a different email address." });
    }

    user.CreatedAtUtc = DateTime.UtcNow;
    user.Password = HashPassword(user.Password);
    db.Users.Add(user);
    await db.SaveChangesAsync();

    // Return user data without password
    var userResponse = new
    {
        user.Id,
        user.Email,
        user.HeightCm,
        user.WeightKg,
        user.Sport,
        user.Level,
        user.Position,
        user.CreatedAtUtc
    };

    return Results.Created($"/api/users/{user.Id}", new { user = userResponse, message = "Registration successful" });
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
