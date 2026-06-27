---
id: feature-dotnet-sms
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Sms
---

# HexGuard.Sms

## Summary

SMS delivery — OTP generation, verification, transactional SMS via Twilio/Vonage, delivery tracking. Every app with phone verification or SMS alerts needs this.

## Proposed Public API

```csharp
public interface ISmsService
{
    Task<SmsResult> SendAsync(string to, string message, CancellationToken ct);
    Task<string> GenerateOtpAsync(string to, int length = 6, TimeSpan? ttl = null, CancellationToken ct = default);
    Task<bool> VerifyOtpAsync(string to, string code, CancellationToken ct);
}

builder.Services.AddSms(options => {
    options.Provider = SmsProvider.Twilio;
    options.AccountSid = config["Twilio:Sid"];
    options.AuthToken = config["Twilio:Token"];
    options.DefaultFrom = "+1234567890";
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Sms/`.
2. Implement Twilio/Vonage adapters, OTP generation/verification.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
