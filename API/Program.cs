using API;
using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using AutoMapper;
using API.Extensions;
using FluentValidation;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Domain;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddValidatorsFromAssemblyContaining<Create>();

var app = builder.Build();
SeedDatabase();
// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapControllers();

app.UseCors(MyAllowSpecificOrigins);

app.Run();

async void SeedDatabase()
{
    using (var scope = app.Services.CreateScope())
        try
        {
            var scopedContext = scope.ServiceProvider.GetRequiredService<DataContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            await scopedContext.Database.MigrateAsync();
            await DbInitializer.InitializeAsync(scopedContext, userManager);
        }
        catch
        {
            throw;
        }
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
