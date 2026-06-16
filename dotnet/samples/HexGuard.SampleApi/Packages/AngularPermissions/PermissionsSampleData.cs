namespace HexGuard.SampleApi.Packages.AngularPermissions;

internal static class PermissionsSampleData
{
    public static object CreatePersonas()
    {
        return new
        {
            personas = new[]
            {
                new
                {
                    id = "guest",
                    label = "Guest reviewer",
                    summary = "Can inspect read-only order state but cannot trigger privileged actions.",
                    roles = new[] { "guest" },
                    capabilities = new[] { "orders.view" },
                },
                new
                {
                    id = "analyst",
                    label = "Analyst",
                    summary = "Can view orders and issue refunds, but still cannot approve finance work.",
                    roles = new[] { "analyst" },
                    capabilities = new[] { "orders.view", "orders.refund" },
                },
                new
                {
                    id = "approver",
                    label = "Approver",
                    summary = "Can approve orders and inspect finance routes, but cannot open audit workflows.",
                    roles = new[] { "approver" },
                    capabilities = new[] { "orders.view", "orders.approve", "finance.view" },
                },
                new
                {
                    id = "admin",
                    label = "Admin auditor",
                    summary = "Has the full action set, finance approval access, and audit visibility.",
                    roles = new[] { "admin", "auditor" },
                    capabilities = new[] { "orders.view", "orders.approve", "orders.refund", "orders.override", "finance.view", "finance.approve", "audit.view" },
                },
            },
        };
    }

    public static object? GetPersonaById(string id)
    {
        var normalizedId = id.Trim().ToLowerInvariant();

        return normalizedId switch
        {
            "guest" => new
            {
                id = "guest",
                label = "Guest reviewer",
                roles = new[] { "guest" },
                capabilities = new[] { "orders.view" },
            },
            "analyst" => new
            {
                id = "analyst",
                label = "Analyst",
                roles = new[] { "analyst" },
                capabilities = new[] { "orders.view", "orders.refund" },
            },
            "approver" => new
            {
                id = "approver",
                label = "Approver",
                roles = new[] { "approver" },
                capabilities = new[] { "orders.view", "orders.approve", "finance.view" },
            },
            "admin" => new
            {
                id = "admin",
                label = "Admin auditor",
                roles = new[] { "admin", "auditor" },
                capabilities = new[] { "orders.view", "orders.approve", "orders.refund", "orders.override", "finance.view", "finance.approve", "audit.view" },
            },
            _ => null,
        };
    }
}
