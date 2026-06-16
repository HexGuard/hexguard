using HexGuard.SampleApi.Packages.AngularLookups;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors((options) =>
{
    options.AddPolicy(
        "DemoFrontends",
        (policy) => policy
            .WithOrigins("http://127.0.0.1:4200", "http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("DemoFrontends");

app.MapGet("/", () => Results.Ok(new
{
    sampleApi = "HexGuard shared demo API",
    packages = new[]
    {
        new
        {
            id = "angular-lookups",
            route = "/api/angular-lookups",
            catalogEndpoint = "/api/angular-lookups/catalog?scenario=base",
            scenarios = new[] { "base", "refreshed", "invalid" },
        },
    },
}));

app.MapAngularLookupsSampleEndpoints();

app.Run();

public partial class Program;