using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

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
        }
    }
}
