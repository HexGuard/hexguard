---
id: feature-dotnet-background-jobs
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.BackgroundJobs'
---

# .NET Background Jobs Package

## Summary

Design `HexGuard.BackgroundJobs` as a .NET package for standardizing background job scheduling, recurring job definitions, job-status tracking, and configurable retry policies with a persistence abstraction.

The repeated problem is that most .NET applications eventually need background processing — send emails, generate reports, sync data, process imports — yet every team builds their own `IHostedService` loop, job queue, status tracking, and retry logic. Hangfire and Quartz exist but are heavyweight; HexGuard.BackgroundJobs would provide a lightweight, conventions-based alternative.

## Goals

- Provide `IBackgroundJob` interface and `RecurringJob` base class for defining jobs.
- Provide `IJobScheduler` for enqueuing one-shot and scheduled jobs.
- Provide `IJobStore` abstraction with in-memory and EF Core backends.
- Provide configurable retry policies (fixed, exponential backoff, max retries).
- Provide job-status tracking (queued, running, completed, failed, cancelled).
- Provide `JobResult` model with success/failure state, error details, and duration.
- Integrate with `IServiceProvider` for DI in job execution.

## Decisions

- Keep the package lightweight — no external queue dependency, no distributed locking in v0.1.
- Jobs run in-process via `IHostedService`. Distributed execution is a future concern.
- Recurring jobs use cron expressions for scheduling.
- Retry policy is defined per-job type, configurable via options.

## Proposed Public API

```csharp
// Define a job
public class SendEmailJob : IBackgroundJob
{
    public string JobType => "send-email";

    public async Task<JobResult> ExecuteAsync(JobContext context, CancellationToken ct)
    {
        var payload = context.GetPayload<EmailPayload>();
        // send email
        return JobResult.Success();
    }
}

// Schedule a job
await scheduler.EnqueueAsync("send-email", new EmailPayload { To = "user@example.com" });
await scheduler.ScheduleAsync("send-email", payload, TimeSpan.FromHours(1));
await scheduler.ScheduleRecurringAsync("daily-report", "0 8 * * *");

// Registration
builder.Services.AddHexGuardBackgroundJobs(options =>
{
    options.RegisterJob<SendEmailJob>();
    options.RetryPolicy = RetryPolicy.ExponentialBackoff(maxRetries: 3);
    options.Store = new InMemoryJobStore();
});
```

## Implementation Plan

1. Scaffold project + tests.
2. Define `IBackgroundJob`, `JobContext`, `JobResult`, `RecurringJobDefinition`.
3. Implement `InMemoryJobStore` and `IJobScheduler`.
4. Implement `BackgroundJobHostedService` — polls store, executes queued jobs.
5. Implement retry policy engine.
6. Implement cron-based recurring job scheduling.
7. Add unit tests for: job execution, retry, scheduled jobs, recurring jobs, status tracking, failure handling.
8. Add sample endpoint in `HexGuard.SampleApi`.
9. Add integration tests, docs, release.
