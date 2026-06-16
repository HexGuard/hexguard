namespace HexGuard.SampleApi.Packages.AngularAsyncState;

internal static class AsyncStateSampleData
{
    public static object CreateBaseMetrics()
    {
        return new
        {
            cards = new[]
            {
                new { id = "open-orders", label = "Open orders", value = "128", detail = "12 more than the previous snapshot", tone = "steady" },
                new { id = "approval-lag", label = "Approval lag", value = "41m", detail = "Within the current operations target", tone = "steady" },
                new { id = "retry-queue", label = "Retry queue", value = "6", detail = "One customer integration is backing off", tone = "warning" },
            },
        };
    }

    public static object CreateRefreshedMetrics()
    {
        return new
        {
            cards = new[]
            {
                new { id = "open-orders", label = "Open orders", value = "119", detail = "9 orders cleared since the last refresh", tone = "steady" },
                new { id = "approval-lag", label = "Approval lag", value = "54m", detail = "A regional queue is drifting above target", tone = "warning" },
                new { id = "retry-queue", label = "Retry queue", value = "11", detail = "Recovery work is rising and needs attention", tone = "critical" },
            },
        };
    }

    public static object CreateObservableHealthySnapshot()
    {
        return new
        {
            cards = new[]
            {
                new { id = "queued-approvals", label = "Queued approvals", value = "14", detail = "Fresh approvals are arriving within the live processing target.", tone = "steady" },
                new { id = "broker-lag", label = "Broker lag", value = "18s", detail = "Regional subscribers are caught up across the active stream.", tone = "steady" },
                new { id = "retry-lane", label = "Retry lane", value = "2", detail = "Only two approvals are waiting for an automated replay.", tone = "steady" },
            },
        };
    }

    public static object CreateObservableWarningSnapshot()
    {
        return new
        {
            cards = new[]
            {
                new { id = "queued-approvals", label = "Queued approvals", value = "27", detail = "The queue is growing faster than downstream workers are clearing it.", tone = "warning" },
                new { id = "broker-lag", label = "Broker lag", value = "52s", detail = "A regional subscriber is drifting above the live target window.", tone = "warning" },
                new { id = "retry-lane", label = "Retry lane", value = "9", detail = "Replay work is rising and needs attention before the next batch.", tone = "critical" },
            },
        };
    }

    public static object CreateOrderOptions()
    {
        return new
        {
            orders = new[]
            {
                new { id = "HG-1042", customer = "Northwind", total = 18420, region = "Berlin" },
                new { id = "HG-1068", customer = "Lighthouse Media", total = 6320, region = "Dublin" },
                new { id = "HG-1080", customer = "Atlas Capital", total = 18990, region = "New York" },
            },
        };
    }

    public static object CreateApprovalResult(string orderId, bool success)
    {
        return new
        {
            orderId,
            approved = success,
            processedAtUtc = DateTimeOffset.UtcNow,
        };
    }
}
