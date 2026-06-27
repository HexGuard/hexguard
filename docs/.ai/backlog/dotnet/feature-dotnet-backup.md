---
id: feature-dotnet-backup
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.Backup
---

# HexGuard.Backup

## Summary

Database backup/restore orchestration — scheduled backups, retention policies, restore verification. Every production database needs automated backups.

## Proposed Public API

```csharp
public interface IBackupService
{
    Task<BackupResult> CreateBackupAsync(string database, CancellationToken ct);
    Task<BackupResult> RestoreAsync(string database, string backupId, CancellationToken ct);
    Task<IReadOnlyList<BackupInfo>> ListBackupsAsync(string database, CancellationToken ct);
    Task CleanupExpiredAsync(CancellationToken ct);
}

builder.Services.AddBackup(options => {
    options.Provider = BackupProvider.SqlServer;
    options.ConnectionString = config["ConnectionStrings:Default"];
    options.RetentionDays = 30;
    options.Schedule = "0 2 * * *";
    options.StoragePath = "/backups";
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Backup/`.
2. Implement backup/restore, retention, scheduling.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
