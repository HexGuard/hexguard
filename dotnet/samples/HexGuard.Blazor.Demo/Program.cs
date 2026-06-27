using HexGuard.Blazor.Demo.Components;
using HexGuard.Blazor.DebouncedInput;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddCors();

// Register HexGuard Blazor services
builder.Services.AddDebouncedValue<string>();
builder.Services.AddDebouncedValue<int>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// CORS for Angular dev server
app.UseCors(policy => policy
    .WithOrigins("http://127.0.0.1:4200", "http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapGet("/api/blazor-demo/info", () => Results.Ok(new
{
    name = "HexGuard Blazor Demo",
    version = "0.1.0",
    packages = new[] { "HexGuard.Blazor.DebouncedInput" }
}));

app.Run();

public partial class Program;
