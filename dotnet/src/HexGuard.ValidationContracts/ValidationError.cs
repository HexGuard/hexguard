namespace HexGuard.ValidationContracts;

/// <summary>
/// Represents a single validation error with a field path, error code, and human-readable message.
/// </summary>
/// <param name="Field">Dot-separated field path, e.g. <c>"address.city"</c> or <c>"items.0.name"</c>. Use <c>""</c> for model-level errors.</param>
/// <param name="Code">Machine-readable error code, e.g. <c>"Required"</c>, <c>"InvalidFormat"</c>, <c>"Duplicate"</c>.</param>
/// <param name="Message">Human-readable error description suitable for display or logging.</param>
public sealed record ValidationError(
    string Field,
    string Code,
    string Message)
{
    /// <summary>Returns <c>true</c> when this error targets a specific field (non-empty field path).</summary>
    public bool IsFieldError => Field.Length > 0;
}
