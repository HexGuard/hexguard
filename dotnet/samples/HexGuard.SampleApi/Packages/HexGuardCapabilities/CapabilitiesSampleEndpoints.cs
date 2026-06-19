using HexGuard.Capabilities;

namespace HexGuard.SampleApi.Packages.HexGuardCapabilities;

/// <summary>Maps capability sample endpoints for the HexGuard.Capabilities demo.</summary>
public static class CapabilitiesSampleEndpoints
{
    /// <summary>Registers the capabilities sample endpoints using the library's ICapabilityService.</summary>
    public static void MapCapabilitiesSampleEndpoints(this WebApplication app)
    {
        var personas = CapabilitiesSampleData.CreatePersonas();
        var personaKeys = personas.Keys.ToArray();

        var api = app.MapGroup("/api/capabilities");

        api.MapGet("/personas", () => Results.Ok(new { personas = personaKeys }));

        // Map library endpoints (/user, /check) that use ICapabilityService
        api.MapCapabilityEndpoints();

        // Persona-switching endpoint: sets user context then delegates to /user
        api.MapGet("/user", async (string? persona, ICapabilityService service) =>
        {
            var key = persona ?? "guest";
            if (!personas.ContainsKey(key))
            {
                return Results.NotFound(new { error = $"Unknown persona '{key}'. Available: {string.Join(", ", personaKeys)}" });
            }

            // Hydrate the in-memory store then set the current user
            // In production, the store would be populated from a database.
            // Here we pre-load personas into the store that was registered via AddHexGuardCapabilities.
            service.SetCurrentUser(key);
            var caps = await service.GetCapabilitiesAsync();
            return Results.Ok(caps);
        });
    }
}
