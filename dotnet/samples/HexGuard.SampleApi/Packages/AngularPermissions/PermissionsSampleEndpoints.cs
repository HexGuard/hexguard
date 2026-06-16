namespace HexGuard.SampleApi.Packages.AngularPermissions;

internal static class PermissionsSampleEndpoints
{
    public static IEndpointRouteBuilder MapPermissionsSampleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/angular-permissions");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "angular-permissions",
            description = "Persona-based capability and role definitions used by the Angular permissions demos.",
            personasEndpoint = "/api/angular-permissions/personas",
            userEndpoint = "/api/angular-permissions/user?persona=guest",
            supportedPersonas = new[] { "guest", "analyst", "approver", "admin" },
        }));

        group.MapGet("/personas", () =>
        {
            return Results.Ok(PermissionsSampleData.CreatePersonas());
        });

        group.MapGet("/user", (string? persona) =>
        {
            var normalizedPersona = string.IsNullOrWhiteSpace(persona)
                ? "guest"
                : persona.Trim().ToLowerInvariant();

            var result = PermissionsSampleData.GetPersonaById(normalizedPersona);

            if (result is null)
            {
                return Results.BadRequest(new
                {
                    error = $"Unknown persona '{persona}'.",
                    supportedPersonas = new[] { "guest", "analyst", "approver", "admin" },
                });
            }

            return Results.Ok(result);
        });

        return endpoints;
    }
}
