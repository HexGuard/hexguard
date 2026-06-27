---
id: feature-dotnet-email
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Email
---

# HexGuard.Email

## Summary

Transactional email delivery — template rendering (Liquid/Handlebars), SMTP/API senders, open/click tracking, bounce handling. **Promoted from sidenote.** Every B2B SaaS sends welcome emails, password resets, invoices, notifications.

## Proposed Public API

```csharp
public interface IEmailService
{
    Task<EmailResult> SendAsync(EmailMessage message, CancellationToken ct);
    Task<EmailResult> SendTemplateAsync<T>(string templateId, T model, string to, CancellationToken ct);
}

public sealed record EmailMessage { string To; string? From; string Subject; string? HtmlBody; string? TextBody; }

builder.Services.AddEmail(options => {
    options.Provider = EmailProvider.Smtp;
    options.DefaultFrom = "noreply@myapp.com";
    options.TemplatePath = "./Templates/Email";
    options.TrackingEnabled = true;
});

await emailService.SendTemplateAsync("welcome", new { Name = "John" }, "john@example.com");
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Email/`.
2. Implement `IEmailService` with SMTP, SendGrid, Mailgun adapters.
3. Implement template engine. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
