namespace HexGuard.ValidationContracts;

/// <summary>
/// Aggregates validation errors from a single validation pass.
/// </summary>
/// <param name="Errors">The list of validation errors found. Empty when the payload is valid.</param>
/// <param name="TraceId">Optional correlation or trace identifier for observability.</param>
public sealed record ValidationResult(
    IReadOnlyList<ValidationError> Errors,
    string? TraceId = null)
{
    /// <summary>Returns <c>true</c> when no validation errors were produced.</summary>
    public bool IsValid => Errors.Count == 0;

    /// <summary>
    /// Returns only the errors that target a specific field (non-empty field path).
    /// </summary>
    public IReadOnlyList<ValidationError> FieldErrors =>
        Errors.Where(static e => e.IsFieldError).ToList();

    /// <summary>
    /// Returns only the errors that apply to the model as a whole (empty field path).
    /// </summary>
    public IReadOnlyList<ValidationError> ModelErrors =>
        Errors.Where(static e => !e.IsFieldError).ToList();

    /// <summary>
    /// Returns all errors matching the given field path.
    /// </summary>
    /// <param name="field">Dot-separated field path to filter by.</param>
    public IReadOnlyList<ValidationError> ForField(string field) =>
        Errors.Where(e => string.Equals(e.Field, field, StringComparison.Ordinal)).ToList();

    /// <summary>
    /// Returns all errors whose field path starts with the given prefix, for
    /// nested or collection-path matching such as <c>"items.0"</c>.
    /// </summary>
    /// <param name="fieldPrefix">Dot-separated field path prefix.</param>
    public IReadOnlyList<ValidationError> ForFieldPrefix(string fieldPrefix) =>
        Errors.Where(e =>
            e.Field.Length > fieldPrefix.Length &&
            e.Field.StartsWith(fieldPrefix, StringComparison.Ordinal) &&
            e.Field[fieldPrefix.Length] == '.')
        .ToList();

    /// <summary>
    /// Converts this validation result into a <see cref="ValidationResultProblemDetails"/>
    /// for use in RFC 9457 Problem Details responses.
    /// </summary>
    /// <param name="statusCode">HTTP status code. Defaults to <c>400</c>.</param>
    /// <param name="detail">Human-readable explanation specific to this occurrence.</param>
    /// <param name="instance">URI identifying the specific occurrence of the problem.</param>
    public ValidationResultProblemDetails ToProblemDetails(
        int statusCode = 400,
        string? detail = null,
        string? instance = null) =>
        ValidationResultProblemDetails.FromResult(this, statusCode, detail, instance);
}
