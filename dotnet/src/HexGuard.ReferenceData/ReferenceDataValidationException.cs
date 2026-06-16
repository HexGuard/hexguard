namespace HexGuard.ReferenceData;

/// <summary>
/// Raised when a reference-data catalog violates the documented contract.
/// </summary>
public sealed class ReferenceDataValidationException : Exception
{
    /// <summary>
    /// Creates an exception from one or more validation errors.
    /// </summary>
    public ReferenceDataValidationException(IReadOnlyList<string> errors)
        : base(CreateMessage(errors))
    {
        Errors = errors;
    }

    /// <summary>
    /// Contract errors collected during validation.
    /// </summary>
    public IReadOnlyList<string> Errors { get; }

    private static string CreateMessage(IReadOnlyList<string> errors)
    {
        ArgumentNullException.ThrowIfNull(errors);

        return errors.Count == 0
            ? "Reference-data catalog validation failed."
            : $"Reference-data catalog validation failed: {string.Join(" ", errors)}";
    }
}