namespace HexGuard.SampleApi.Packages.AngularOptimisticState;

internal static class OptimisticStateSampleData
{
    public static object CreateFeatures()
    {
        return new
        {
            features = new[]
            {
                new { id = "billing-alerts", label = "Billing alerts", description = "Regional finance leads receive the new invoicing anomaly pings.", enabled = false },
                new { id = "audit-export", label = "Audit export", description = "Exports the signed approval trail to the nightly audit bucket.", enabled = true },
                new { id = "priority-routing", label = "Priority routing", description = "Moves platinum tickets into the fast follow-up lane.", enabled = false },
            },
        };
    }

    public static object CreateDraftRows()
    {
        return new
        {
            drafts = new[]
            {
                new { id = "draft-101", title = "reconcile approval backlog", owner = "Mina Patel" },
                new { id = "draft-114", title = "confirm finance queue replay", owner = "Jonas Meyer" },
                new { id = "draft-125", title = "triage stale webhooks", owner = "Nadia Chen" },
            },
        };
    }

    public static object CreateCampaignRows()
    {
        return new
        {
            campaigns = new[]
            {
                new { id = "campaign-201", label = "Renewal guide", status = "draft" },
                new { id = "campaign-204", label = "Incident recap", status = "draft" },
                new { id = "campaign-219", label = "Pricing update", status = "published" },
            },
        };
    }

    public static object CreateUpdateResult(string id, string? title, bool? enabled, string? status)
    {
        return new
        {
            id,
            title,
            enabled,
            status,
            reconciledAtUtc = DateTimeOffset.UtcNow,
        };
    }
}
