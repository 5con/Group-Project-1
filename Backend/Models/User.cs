namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public double? HeightCm { get; set; }
        public double? WeightKg { get; set; }
        public string Sport { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty; // beginner, intermediate, advanced
        public string? Position { get; set; }
        // For football: QB, WR, LB, CB
        //
        public DateTime CreatedAtUtc { get; set; }
    }
}


