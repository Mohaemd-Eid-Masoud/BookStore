using AutoMapper;
using BookStore.API.Configuration;
using BookStore.Infrastructure.Context;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;

namespace BookStore.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configuring DbContext with SQL Server
            services.AddDbContext<BookStoreDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            // Registering AutoMapper with the Startup class as the profile
            services.AddAutoMapper(typeof(Startup));

            // Adding support for controllers
            services.AddControllers();

            // Configuring Swagger for API documentation
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo()
                {
                    Title = "BookStore API",
                    Version = "v1"
                });
            });

            // Adding CORS to allow all origins
            services.AddCors();

            // Custom service registration (likely in an extension method)
            services.ResolveDependencies();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Automatically applying migrations at startup
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<BookStoreDbContext>();
                try
                {
                    Console.WriteLine("Starting migration...");
                    dbContext.Database.Migrate();  // Automatically apply migrations
                    Console.WriteLine("DB is Migrated");
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Startup>>();
                    logger.LogError(ex, "An error occurred while applying migrations.");
                    Console.WriteLine("Migration failed:");
                    Console.WriteLine(ex.ToString());
                }
            }

            // Enabling Swagger middleware for generating API documentation
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            });

            // Forcing HTTPS redirection
            app.UseHttpsRedirection();

          

            // Enabling routing middleware
            app.UseRouting();

            // Adding Authorization middleware (though not configured)
            app.UseAuthorization();

            // Enabling CORS to allow any origin, method, and header
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            // Configuring endpoints for controllers
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
