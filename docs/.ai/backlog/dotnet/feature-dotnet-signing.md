---
id: feature-dotnet-signing
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Signing'
---

# HexGuard.Signing

## Summary

Document signing and e-signature orchestration for .NET — signing session management, signer ordering, signature audit trail, and document sealing. Backend for contract signing and consent workflows.

## Goals

- Signing session creation with multiple signers and ordering
- Signature data storage (drawn + typed)
- Signer status tracking (pending, signed, declined)
- Sequential and parallel signing flows
- Signature audit trail with timestamps and IP
- Document sealing (prevent modification after all signed)
- Signing link generation with expiry
- Reminder notifications for pending signers
- Signing certificate generation

## Non-Goals

- No legal validity verification
- No document rendering or preview
- No integration with external e-signature providers

## Proposed Public API

```csharp
public interface ISigningService
{
    Task<SigningSession> CreateSessionAsync(CreateSessionRequest request, CancellationToken ct = default);
    Task<SigningSession?> GetSessionAsync(string sessionId, CancellationToken ct = default);
    Task<SigningSession> SubmitSignatureAsync(string sessionId, string signerId, SignatureData signature, CancellationToken ct = default);
    Task<SigningSession> DeclineAsync(string sessionId, string signerId, string reason, CancellationToken ct = default);
    Task<SigningSession> SealAsync(string sessionId, CancellationToken ct = default);
    Task SendRemindersAsync(string sessionId, CancellationToken ct = default);
    Task<Stream> GenerateAuditReportAsync(string sessionId, CancellationToken ct = default);
}

public sealed record CreateSessionRequest(
    string DocumentId,
    string DocumentName,
    IReadOnlyList<SignerInfo> Signers,
    SigningFlow Flow = SigningFlow.Sequential,
    int? ExpiresInHours = null
);

public enum SigningFlow { Sequential, Parallel }

public sealed record SignerInfo(string Name, string Email, int Order);

public sealed record SigningSession(
    string Id,
    string DocumentId,
    SigningStatus Status,
    IReadOnlyList<SignerRecord> Signers,
    DateTimeOffset CreatedAt,
    DateTimeOffset? CompletedAt,
    DateTimeOffset ExpiresAt
);

public enum SigningStatus { Pending, InProgress, Completed, Declined, Expired }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Signing/` with `.csproj`.
2. Implement session management, signature submission, audit trail, sealing.
3. Add sequential/parallel flow support and reminders.
4. Add xunit tests. Register in `HexGuard.slnx`.
