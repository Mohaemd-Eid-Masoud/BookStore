using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Infrastructure.Context
{
    public class BookStoreDbContextFactory : IDesignTimeDbContextFactory<BookStoreDbContext>
    {
        public BookStoreDbContext CreateDbContext(string[] args)
        {
            // Change to the relative path of the Web/API project
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../BookStore.API")) // Adjust path as per your main project folder
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<BookStoreDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseSqlServer(connectionString);

            return new BookStoreDbContext(optionsBuilder.Options);
        }
    }

}
