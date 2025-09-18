namespace Backend.Models
{
    public class PlanDay
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateOnly Date { get; set; }
        public string DayName { get; set; } = string.Empty; // Mon, Tue, ...
        public string Workout { get; set; } = string.Empty; // description
        public string Type { get; set; } = string.Empty; // strength, cardio, rest
    }
}


