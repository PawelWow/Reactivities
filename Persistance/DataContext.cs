using System;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Persistance
{
    public class DataContext : DbContext
    {
        public DbSet<Value> Values { get; set; }

        public DataContext(DbContextOptions options) : base( options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>().HasData(
                    new Value { Id = 1, Name = "Value 1-1" },
                    new Value { Id = 2, Name = "Value 1-2" },
                    new Value { Id = 3, Name = "Value 1-3" }
                );
        }
    }
}
