using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<PlanDay> PlanDays => Set<PlanDay>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.Sport).IsRequired(false);
                entity.Property(e => e.Level).IsRequired(false);
                entity.Property(e => e.CreatedAtUtc).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<PlanDay>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DayName).IsRequired();
                entity.Property(e => e.Workout).IsRequired();
                entity.Property(e => e.Type).IsRequired();
                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}


