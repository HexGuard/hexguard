namespace HexGuard.FeatureFlags;

/// <summary>
/// A single targeting rule evaluated in first-match-wins order.
/// Sub-types determine which audience the rule applies to.
/// </summary>
public abstract record TargetingRule
{
    /// <summary>
    /// The rule type discriminator used for serialization and
    /// cross-platform rule matching.
    /// </summary>
    public abstract string Type { get; }
}

/// <summary>Flag is enabled for all users.</summary>
public sealed record AlwaysRule : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "always";
}

/// <summary>Flag is disabled for all users.</summary>
public sealed record NeverRule : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "never";
}

/// <summary>Flag is enabled for a percentage of users based on a
/// deterministic hash of their identifier.</summary>
/// <param name="Percentage">0–100 percentage of users to enable for.</param>
public sealed record RolloutRule(double Percentage) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "rollout";
}

/// <summary>Flag is enabled for the specified users.</summary>
/// <param name="Users">List of user identifiers.</param>
public sealed record UserInRule(IReadOnlyList<string> Users) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "userIn";
}

/// <summary>Flag is disabled for the specified users.</summary>
/// <param name="Users">List of user identifiers.</param>
public sealed record UserNotInRule(IReadOnlyList<string> Users) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "userNotIn";
}

/// <summary>Flag is enabled for users in the specified groups.</summary>
/// <param name="Groups">List of group identifiers.</param>
public sealed record GroupInRule(IReadOnlyList<string> Groups) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "groupIn";
}

/// <summary>Flag is disabled for users in the specified groups.</summary>
/// <param name="Groups">List of group identifiers.</param>
public sealed record GroupNotInRule(IReadOnlyList<string> Groups) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "groupNotIn";
}

/// <summary>Flag is enabled when a context attribute matches the
/// expected value.</summary>
/// <param name="Attribute">Attribute key to check.</param>
/// <param name="Value">Expected value.</param>
public sealed record AttributeMatchRule(string Attribute, string Value) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "attributeMatch";
}

/// <summary>Flag is disabled when a context attribute matches the
/// specified value.</summary>
/// <param name="Attribute">Attribute key to check.</param>
/// <param name="Value">Value that disables the flag.</param>
public sealed record AttributeNotMatchRule(string Attribute, string Value) : TargetingRule
{
    /// <inheritdoc />
    public override string Type => "attributeNotMatch";
}
