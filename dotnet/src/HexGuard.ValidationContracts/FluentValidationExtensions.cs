// <summary>
// Optional extension methods for mapping FluentValidation results into
// HexGuard.ValidationContracts shapes. No hard dependency on FluentValidation;
// callers must reference FluentValidation separately.
// </summary>

#if HEXGUARD_HAS_FLUENTVALIDATION

namespace HexGuard.ValidationContracts;

using global::FluentValidation.Results;

/// <summary>
/// Extension methods for converting FluentValidation <see cref="ValidationResult"/>
/// into <see cref="ValidationResult"/>.
/// </summary>
public static class FluentValidationExtensions
{
    /// <summary>
    /// Converts a FluentValidation <see cref="ValidationResult"/> into a
    /// <see cref="HexGuard.ValidationContracts.ValidationResult"/>.
    /// </summary>
    /// <param name="fluentResult">The FluentValidation result to convert.</param>
    /// <param name="traceId">Optional trace identifier to include.</param>
    /// <returns>A <see cref="HexGuard.ValidationContracts.ValidationResult"/> with mapped errors.</returns>
    public static ValidationResult AsValidationResult(
        this FluentValidation.Results.ValidationResult fluentResult,
        string? traceId = null)
    {
        ArgumentNullException.ThrowIfNull(fluentResult);

        var builder = new ValidationResultBuilder().WithTraceId(traceId);

        foreach (var failure in fluentResult.Errors)
        {
            builder.AddError(
                failure.PropertyName,
                failure.ErrorCode,
                failure.ErrorMessage);
        }

        return builder.Build();
    }
}

#endif
