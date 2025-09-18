namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public double? HeightCm { get; set; }
        public double? WeightKg { get; set; }
        public string? Sport { get; set; }
        public string? Level { get; set; } // beginner, intermediate, advanced
        public DateTime CreatedAtUtc { get; set; }
    }
}


