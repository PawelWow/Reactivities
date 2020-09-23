using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<UserFollowing> Followings { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base( options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>().HasData(
                    new Value { Id = 1, Name = "Value 1-1" },
                    new Value { Id = 2, Name = "Value 1-2" },
                    new Value { Id = 3, Name = "Value 1-3" }
                );

            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            builder.Entity<UserActivity>().HasOne(u => u.AppUser).WithMany(a => a.UserActivities).HasForeignKey(u => u.AppUserId);

            builder.Entity<UserActivity>().HasOne(a => a.Activity).WithMany(u => u.UserActivities).HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(builder =>
            {
                builder.HasKey(key => new { key.ObserverId, key.TargetId });
                builder.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(o => o.Target)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
