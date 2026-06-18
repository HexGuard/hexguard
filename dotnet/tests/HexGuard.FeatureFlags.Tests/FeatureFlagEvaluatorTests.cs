using HexGuard.FeatureFlags;

namespace HexGuard.FeatureFlags.Tests;

public sealed class FeatureFlagEvaluatorTests
{
    private static readonly FlagEvaluationContext DefaultContext = new(
        UserId: "user-42",
        TenantId: "tenant-1",
        Groups: new[] { "beta-testers", "employees" },
        Attributes: new Dictionary<string, string>
        {
            ["region"] = "us-east",
            ["tier"] = "premium",
        });

    [Fact]
    public void Disabled_flag_returns_disabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: false);

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
        Assert.Equal("disabled", result.Variant);
        Assert.Null(result.MatchedRule);
    }

    [Fact]
    public void Enabled_flag_with_no_rules_and_full_rollout_returns_enabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            RolloutPercentage: 100);

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("enabled", result.Variant);
        Assert.Null(result.MatchedRule);
    }

    [Fact]
    public void Always_rule_returns_enabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[] { new AlwaysRule() });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("enabled", result.Variant);
        Assert.Equal("always", result.MatchedRule);
    }

    [Fact]
    public void Never_rule_returns_disabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[] { new NeverRule() });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
        Assert.Equal("disabled", result.Variant);
        Assert.Equal("never", result.MatchedRule);
    }

    [Fact]
    public void UserIn_rule_matches_specified_user()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new UserInRule(new[] { "user-42", "user-99" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("userIn", result.MatchedRule);
    }

    [Fact]
    public void UserIn_rule_does_not_match_different_user()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new UserInRule(new[] { "user-99" }),
            });

        var context = new FlagEvaluationContext(UserId: "other-user");
        var result = FeatureFlagEvaluator.Evaluate(flag, context);

        Assert.False(result.Enabled);
    }

    [Fact]
    public void UserNotIn_rule_excludes_specified_user()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new UserNotInRule(new[] { "user-42" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled); // user-42 is excluded
    }

    [Fact]
    public void UserNotIn_rule_allows_other_user()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new UserNotInRule(new[] { "user-99" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("userNotIn", result.MatchedRule);
    }

    [Fact]
    public void GroupIn_rule_matches_user_group()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new GroupInRule(new[] { "beta-testers" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("groupIn", result.MatchedRule);
    }

    [Fact]
    public void GroupIn_rule_does_not_match_non_member()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new GroupInRule(new[] { "alpha-testers" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
    }

    [Fact]
    public void GroupNotIn_rule_excludes_matching_group()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new GroupNotInRule(new[] { "beta-testers" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled); // user is in beta-testers
    }

    [Fact]
    public void GroupNotIn_rule_allows_non_member()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new GroupNotInRule(new[] { "alpha-testers" }),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("groupNotIn", result.MatchedRule);
    }

    [Fact]
    public void AttributeMatch_rule_matches_correct_value()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new AttributeMatchRule("region", "us-east"),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("attributeMatch", result.MatchedRule);
    }

    [Fact]
    public void AttributeMatch_rule_does_not_match_different_value()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new AttributeMatchRule("region", "eu-west"),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
    }

    [Fact]
    public void AttributeNotMatch_rule_excludes_matching_value()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new AttributeNotMatchRule("region", "us-east"),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
    }

    [Fact]
    public void AttributeNotMatch_rule_allows_different_value()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new AttributeNotMatchRule("region", "eu-west"),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("attributeNotMatch", result.MatchedRule);
    }

    [Fact]
    public void First_match_wins_rule_ordering()
    {
        // userIn should match first and never reach the never rule
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new UserInRule(new[] { "user-42" }),
                new NeverRule(),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("userIn", result.MatchedRule);
    }

    [Fact]
    public void Rollout_rule_uses_stable_hash()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new RolloutRule(50),
            });

        var context = new FlagEvaluationContext(UserId: "user-42");

        var result1 = FeatureFlagEvaluator.Evaluate(flag, context);
        var result2 = FeatureFlagEvaluator.Evaluate(flag, context);

        // Stable hash should produce deterministic results
        Assert.Equal(result1.Enabled, result2.Enabled);
        Assert.NotNull(result1);
        Assert.Equal("feature-x", result1.Key);
    }

    [Fact]
    public void Rollout_rule_at_0_percent_always_disabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new RolloutRule(0),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled);
    }

    [Fact]
    public void Rollout_rule_at_100_percent_always_enabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new RolloutRule(100),
            });

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled);
        Assert.Equal("rollout", result.MatchedRule);
    }

    [Fact]
    public void EvaluateMany_returns_results_for_all_flags()
    {
        var flags = new Dictionary<string, FeatureFlag>
        {
            ["flag-a"] = new FeatureFlag("flag-a", true, TargetingRules: new TargetingRule[] { new AlwaysRule() }),
            ["flag-b"] = new FeatureFlag("flag-b", true, TargetingRules: new TargetingRule[] { new NeverRule() }),
            ["flag-c"] = new FeatureFlag("flag-c", false),
        };

        var results = FeatureFlagEvaluator.EvaluateMany(flags, DefaultContext);
        var resultDict = results.ToDictionary(r => r.Key);

        Assert.Equal(3, results.Count);
        Assert.True(resultDict["flag-a"].Enabled);  // always
        Assert.False(resultDict["flag-b"].Enabled); // never
        Assert.False(resultDict["flag-c"].Enabled); // disabled
    }

    [Fact]
    public void Null_context_groups_handled_gracefully()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new GroupInRule(new[] { "beta-testers" }),
            });

        var context = new FlagEvaluationContext(UserId: "user-42");
        var result = FeatureFlagEvaluator.Evaluate(flag, context);

        Assert.False(result.Enabled); // no groups to match
    }

    [Fact]
    public void Null_context_attributes_handled_gracefully()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            TargetingRules: new TargetingRule[]
            {
                new AttributeMatchRule("region", "us-east"),
            });

        var context = new FlagEvaluationContext(UserId: "user-42");
        var result = FeatureFlagEvaluator.Evaluate(flag, context);

        Assert.False(result.Enabled); // no attributes to match
    }

    [Fact]
    public void Empty_user_id_does_not_crash()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            RolloutPercentage: 50);
        var context = new FlagEvaluationContext(UserId: "");

        var result = FeatureFlagEvaluator.Evaluate(flag, context);

        Assert.NotNull(result);
        Assert.Equal("feature-x", result.Key);
    }

    [Fact]
    public void EvaluateMany_empty_flags_returns_empty()
    {
        var flags = new Dictionary<string, FeatureFlag>();
        var results = FeatureFlagEvaluator.EvaluateMany(flags, DefaultContext);

        Assert.Empty(results);
    }

    [Fact]
    public void EvaluateMany_results_are_in_key_order()
    {
        var flags = new Dictionary<string, FeatureFlag>
        {
            ["z-flag"] = new FeatureFlag("z-flag", true, TargetingRules: new TargetingRule[] { new NeverRule() }),
            ["a-flag"] = new FeatureFlag("a-flag", true, TargetingRules: new TargetingRule[] { new AlwaysRule() }),
            ["m-flag"] = new FeatureFlag("m-flag", false),
        };

        var results = FeatureFlagEvaluator.EvaluateMany(flags, DefaultContext);

        // Results should be sorted by key: a-flag, m-flag, z-flag
        Assert.Equal("a-flag", results[0].Key);
        Assert.Equal("m-flag", results[1].Key);
        Assert.Equal("z-flag", results[2].Key);
    }

    [Fact]
    public void Enabled_flag_with_rollout_below_zero_is_disabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            RolloutPercentage: -10);

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.False(result.Enabled); // clamped to 0
    }

    [Fact]
    public void Enabled_flag_with_rollout_above_100_is_enabled()
    {
        var flag = new FeatureFlag(
            Key: "feature-x",
            Enabled: true,
            RolloutPercentage: 150);

        var result = FeatureFlagEvaluator.Evaluate(flag, DefaultContext);

        Assert.True(result.Enabled); // clamped to 100
    }

    [Fact]
    public void Null_flag_throws()
    {
        Assert.Throws<ArgumentNullException>(() =>
            FeatureFlagEvaluator.Evaluate(null!, DefaultContext));
    }

    [Fact]
    public void Null_context_throws()
    {
        var flag = new FeatureFlag("flag-a", true);

        Assert.Throws<ArgumentNullException>(() =>
            FeatureFlagEvaluator.Evaluate(flag, null!));
    }
}
