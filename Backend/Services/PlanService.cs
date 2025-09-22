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
            var position = user.Position;
            
            for (int i = 0; i < 7; i++)
            {
                var date = weekStart.AddDays(i);
                var (type, workout) = sport == "football" 
                    ? GetFootballWorkout(position, level, i)
                    : SuggestWorkout(sport, level, i);
                    
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
                    "Protein: 1.6-2.0 g/kg bodyweight/day",
                    "Carbohydrate: 5-7 g/kg/day (higher on heavy/skill days)",
                    "Hydration: 3-5 L/day, electrolyte replacement after long practices",
                    "Timing: Carb + protein snack within 60 minutes post-session",
                    "Recovery: Anti-inflammatory foods (turmeric, berries)"
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

        public object GetPositionSpecificDietTips(string sport, string? position)
        {
            if (sport?.ToLowerInvariant() != "football" || string.IsNullOrEmpty(position))
                return GetDietTips(sport);

            return position.ToLowerInvariant() switch
            {
                "qb" or "quarterback" => new[]
                {
                    "Protein: 1.6-2.0 g/kg/day",
                    "Carbohydrate: 5-7 g/kg/day (higher on heavy/skill days)",
                    "Hydration: 3-5 L/day, electrolyte replacement after long practices",
                    "Timing: Carb + protein snack within 60 minutes post-session"
                },
                "wr" or "receiver" => new[]
                {
                    "Protein: 1.6-2.0 g/kg/day",
                    "Carbohydrate: 5-7 g/kg/day (high around sprint days)",
                    "Calories: Slightly less than QB unless bulking",
                    "Emphasize lean speed, agility fueling"
                },
                "lb" or "linebacker" => new[]
                {
                    "Protein: 1.8-2.0 g/kg/day",
                    "Carbohydrate: 5-7 g/kg/day (higher for mass + power days)",
                    "Calories: Often in surplus to maintain/build mass",
                    "Emphasize fueling strength and recovery"
                },
                "cb" or "cornerback" => new[]
                {
                    "Protein: 1.6-2.0 g/kg/day",
                    "Carbohydrate: 5-6 g/kg/day (fuel agility + sprint work)",
                    "Calories: Slightly lower than WR if maintaining lighter playing weight",
                    "Focus on staying lean, quick, and agile"
                },
                _ => GetDietTips(sport)
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

        private static (string type, string workout) GetFootballWorkout(string? position, string level, int dayIndex)
        {
            var pos = (position ?? "generic").ToLowerInvariant();
            var isRest = (dayIndex == 3 || dayIndex == 6) && level == "beginner";
            
            if (isRest) return ("rest", "Active recovery: 20 min walk + mobility work");

            return pos switch
            {
                "qb" or "quarterback" => GetQBWorkout(level, dayIndex),
                "wr" or "receiver" => GetWRWorkout(level, dayIndex),
                "lb" or "linebacker" => GetLBWorkout(level, dayIndex),
                "cb" or "cornerback" => GetCBWorkout(level, dayIndex),
                _ => GetGenericFootballWorkout(level, dayIndex)
            };
        }

        private static (string type, string workout) GetQBWorkout(string level, int dayIndex)
        {
            return dayIndex switch
            {
                0 => ("strength", "Lower body emphasis: Squats, RDLs, sled pushes"),
                1 => ("skill", "Speed & Agility + Throwing: Footwork, sprints, mechanics"),
                2 => ("strength", "Power & Upper body: Cleans, med-ball throws, push press"),
                3 => ("rest", "Recovery + Film Study + Mobility"),
                4 => ("conditioning", "Position Simulation & Conditioning: 7-on-7, sprints"),
                5 => ("strength", "Upper body heavy, core stability"),
                6 => ("rest", "Long Recovery + Light Throwing"),
                _ => ("rest", "Active recovery")
            };
        }

        private static (string type, string workout) GetWRWorkout(string level, int dayIndex)
        {
            return dayIndex switch
            {
                0 => ("skill", "Speed development: Flying sprints, bounding, route acceleration"),
                1 => ("strength", "Lower body focus: Squats, lunges, plyometric jumps"),
                2 => ("skill", "Agility + Route running: Cone drills, COD, catching"),
                3 => ("rest", "Recovery + Film Study"),
                4 => ("conditioning", "Top-end sprint intervals + Route reps: Long ball & short routes"),
                5 => ("strength", "Upper body push/pull, explosive lifts"),
                6 => ("rest", "Recovery mobility + Light skill drills: Hands, rhythm routes"),
                _ => ("rest", "Active recovery")
            };
        }

        private static (string type, string workout) GetLBWorkout(string level, int dayIndex)
        {
            return dayIndex switch
            {
                0 => ("strength", "Heavy lower: Squats, deadlifts, sled pushes"),
                1 => ("skill", "Speed & Agility: Short bursts, lateral movement, tackling footwork"),
                2 => ("strength", "Power & Explosiveness: Cleans, med-ball slams, box jumps"),
                3 => ("rest", "Recovery + Film Study"),
                4 => ("conditioning", "Contact conditioning: Sled hits, tackling form, reaction drills"),
                5 => ("strength", "Upper body: Bench, rows, weighted carries"),
                6 => ("rest", "Active recovery + Mobility"),
                _ => ("rest", "Active recovery")
            };
        }

        private static (string type, string workout) GetCBWorkout(string level, int dayIndex)
        {
            return dayIndex switch
            {
                0 => ("skill", "Speed & Agility: Short sprints, lateral quickness drills"),
                1 => ("strength", "Lower body: Squats, lunges, single-leg power"),
                2 => ("skill", "Agility & Reaction: Mirror drills, COD, ball tracking"),
                3 => ("rest", "Recovery + Film Study"),
                4 => ("conditioning", "Top-speed intervals + Coverage footwork: 1v1 simulation"),
                5 => ("strength", "Upper body, grip work, pull-ups, presses"),
                6 => ("rest", "Active recovery + Light mobility/footwork"),
                _ => ("rest", "Active recovery")
            };
        }

        private static (string type, string workout) GetGenericFootballWorkout(string level, int dayIndex)
        {
            return dayIndex % 2 == 0
                ? ("strength", "Full-body power: Cleans, squats, bench, rows, core")
                : ("conditioning", "Sprint intervals, agility drills, functional movements");
        }
    }
}


