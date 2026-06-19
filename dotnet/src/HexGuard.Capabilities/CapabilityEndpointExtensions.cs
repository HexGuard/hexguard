using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace HexGuard.Capabilities;

/// <summary>Extension methods for mapping capability endpoints.</summary>
public static class CapabilityEndpointExtensions
{
    /// <summary>Maps the capability endpoints.</summary>
    public static RouteGroupBuilder MapCapabilityEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/user", async (ICapabilityService service, CancellationToken ct) =>
        {
            var caps = await service.GetCapabilitiesAsync(ct);
            return Results.Ok(caps);
        });

        group.MapPost("/check", async (CapabilityCheckRequest request, ICapabilityService service, CancellationToken ct) =>
        {
            var allowed = await service.HasCapabilityAsync(request.Resource, request.Action, ct);
            return Results.Ok(new CapabilityCheckResponse { Allowed = allowed });
        });

        return group;
    }
}
