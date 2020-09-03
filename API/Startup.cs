using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistance;

namespace API
{
    public class Startup
    {
        private const string m_policyName = "CorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(this.Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(options =>
            {
                options.AddPolicy(m_policyName, policy =>
                {
                    // taki adres jest w kursie, wiêc zostawiam, ale nie wiem czemu, jak moja apka startuje na porcie 5000
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddMvc(options => options.EnableEndpointRouting = false).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // Domyœlnie HSTS ustawione jest na 30 dni. Mo¿na to zmieniæ zgodnie z wymaganiami na produkcji.
                // zob. https://aka.ms/aspnetcore-hsts
                //app.UseHsts();
            }

            // don't want to redirect to https. Also removed https address from launchSettings.json (API section, application url)
            //app.UseHttpsRedirection();

            app.UseCors(m_policyName);
            
            app.UseMvc();
        }
    }
}
