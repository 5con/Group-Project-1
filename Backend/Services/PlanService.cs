using Backend.Models;

namespace Backend.Services
{
    public class PlanService
    {
        public (IEnumerable<PlanDay> days, object advice) GenerateWeeklyPlan(User user, DateOnly weekStart)
        {
            var plan = new List<PlanDay>();
            var sport = (user.Sport ?? "generic").ToLowerInvariant();
            var level = (user.Level ?? "beginner").ToLowerInvariant();
            for (int i = 0; i < 7; i++)
            {
                var date = weekStart.AddDays(i);
                var (type, workout) = SuggestWorkout(sport, level, i);
                plan.Add(new PlanDay
                {
                    Date = date,
                    DayName = date.ToDateTime(TimeOnly.MinValue).ToString("ddd"),
                    Type = type,
                    Workout = workout
                });
            }

            var advice = new
            {
                calories = EstimateCalories(user),
                macros = GetMacros(user),
                tips = GetDietTips(sport)
            };

            return (plan, advice);
        }

        public object GetDietTips(string sport)
        {
            sport = (sport ?? "generic").ToLowerInvariant();
            return sport switch
            {
                "basketball" => new[]
                {
                    "Hydrate aggressively before practices",
                    "Carb load 1-2h pre-court",
                    "Electrolytes during long runs"
                },
                "football" => new[]
                {
                    "Prioritize lean protein for recovery",
                    "Complex carbs for sustained energy",
                    "Omega-3s to manage inflammation"
                },
                "tennis" => new[]
                {
                    "Carbs between sets for quick energy",
                    "Banana + isotonic drink mid-session",
                    "Protein within 45 minutes post match"
                },
                "golf" => new[]
                {
                    "Steady hydration every 3 holes",
                    "Light snacks to avoid energy dips",
                    "Limit alcohol on practice days"
                },
                _ => new[]
                {
                    "Eat whole foods 80% of the time",
                    "Protein in every meal",
                    "Sleep 7-9 hours for recovery"
                }
            };
        }

        private static (string type, string workout) SuggestWorkout(string sport, string level, int dayIndex)
        {
            bool isRest = (dayIndex == 3 || dayIndex == 6) && level == "beginner";
            if (isRest) return ("rest", "Rest and mobility: 20 min walk + stretch");

            return sport switch
            {
                "basketball" => dayIndex % 2 == 0
                    ? ("cardio", "Intervals: 8x court sprints, defensive slides, layup drills")
                    : ("strength", "Lower body: squats, lunges, calf raises; Core: planks"),
                "football" => dayIndex % 2 == 0
                    ? ("strength", "Power: cleans, squats, bench; Accessory: rows, hamstrings")
                    : ("conditioning", "Tempo runs, shuttle, agility ladder, sled pushes"),
                "tennis" => dayIndex % 2 == 0
                    ? ("skill", "Serve practice, cross-court drills, footwork ladders")
                    : ("strength", "Upper body pull/push superset + rotational core"),
                "golf" => dayIndex % 2 == 0
                    ? ("mobility", "T-spine rotation, hip mobility, band work, putting")
                    : ("strength", "Glute bridges, deadlifts light, anti-rotation core"),
                _ => dayIndex % 2 == 0
                    ? ("cardio", "30-40 min Zone 2 + strides")
                    : ("strength", "Full body compound lifts + core")
            };
        }

        private static int EstimateCalories(User user)
        {
            // Very rough estimate; can be refined later
            var weightKg = user.WeightKg ?? 75;
            var baseKcal = (int)(weightKg * 30);
            var multiplier = (user.Level ?? "beginner").ToLowerInvariant() switch
            {
                "advanced" => 1.2,
                "intermediate" => 1.1,
                _ => 1.0
            };
            return (int)(baseKcal * multiplier);
        }

        private static object GetMacros(User user)
        {
            var kcal = EstimateCalories(user);
            // 30P / 40C / 30F
            var protein = (int)(kcal * 0.30 / 4);
            var carbs = (int)(kcal * 0.40 / 4);
            var fat = (int)(kcal * 0.30 / 9);
            return new { protein_g = protein, carbs_g = carbs, fat_g = fat };
        }
    }
}


