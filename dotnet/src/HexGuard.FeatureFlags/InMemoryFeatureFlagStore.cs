using System.Security.Cryptography;
using System.Text;

namespace HexGuard.FeatureFlags;

/// <summary>
/// In-memory feature flag store populated from <see cref="FeatureFlagOptions"/>.
/// Uses a content hash for conditional sync support.
/// </summary>
public sealed class InMemoryFeatureFlagStore : IFeatureFlagStore
{
    private readonly FeatureFlagCatalog _catalog;

    /// <summary>
    /// Creates a store from the configured flag definitions.
    /// When duplicate keys are present, the last definition wins.
    /// </summary>
    public InMemoryFeatureFlagStore(FeatureFlagOptions options)
    {
        var flags = new Dictionary<string, FeatureFlag>(StringComparer.Ordinal);

        foreach (var flag in options.Flags)
        {
            flags[flag.Key] = flag;
        }

        var evaluatedAt = DateTimeOffset.UtcNow;
        var contextHash = ComputeContextHash(flags);

        _catalog = new FeatureFlagCatalog(flags, evaluatedAt, contextHash);
    }

    /// <inheritdoc />
    public Task<FeatureFlagCatalog> GetCatalogAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_catalog);
    }

    /// <inheritdoc />
    public Task<FeatureFlag?> GetFlagAsync(string key, CancellationToken cancellationToken = default)
    {
        _catalog.Flags.TryGetValue(key, out var flag);
        return Task.FromResult(flag);
    }

    // ── Stable context hash ────────────────────────────────────

    /// <summary>
    /// Computes a deterministic SHA-256 hash from the flag definitions
    /// including key, enabled state, variant, rollout percentage, and
    /// targeting rules. Used by clients for conditional 304 sync requests.
    /// </summary>
    internal static string ComputeContextHash(IReadOnlyDictionary<string, FeatureFlag> flags)
    {
        var sb = new StringBuilder();

        foreach (var (key, flag) in flags.OrderBy(kvp => kvp.Key, StringComparer.Ordinal))
        {
            sb.Append(key);
            sb.Append(flag.Enabled ? '1' : '0');
            sb.Append(flag.Variant);
            sb.Append(flag.RolloutPercentage);

            if (flag.TargetingRules is not null)
            {
                foreach (var rule in flag.TargetingRules)
                {
                    sb.Append(rule.Type);
                    sb.Append(';');
                }
            }
        }

        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(sb.ToString()));
        return Convert.ToHexStringLower(bytes);
    }
}
