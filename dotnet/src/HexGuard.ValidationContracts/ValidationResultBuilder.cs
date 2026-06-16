namespace HexGuard.ValidationContracts;

/// <summary>
/// Fluent builder for constructing a <see cref="ValidationResult"/> incrementally.
/// </summary>
public sealed class ValidationResultBuilder
{
    private readonly List<ValidationError> _errors = [];
    private string? _traceId;

    /// <summary>Sets the trace or correlation identifier.</summary>
    public ValidationResultBuilder WithTraceId(string? traceId)
    {
        _traceId = traceId;
        return this;
    }

    /// <summary>Adds a validation error.</summary>
    public ValidationResultBuilder AddError(ValidationError error)
    {
        ArgumentNullException.ThrowIfNull(error);
        _errors.Add(error);
        return this;
    }

    /// <summary>Adds a validation error from its components.</summary>
    /// <param name="field">Dot-separated field path, or <c>""</c> for model-level errors.</param>
    /// <param name="code">Machine-readable error code.</param>
    /// <param name="message">Human-readable error description.</param>
    public ValidationResultBuilder AddError(string field, string code, string message)
    {
        _errors.Add(new ValidationError(field, code, message));
        return this;
    }

    /// <summary>Adds a model-level (non-field) error.</summary>
    /// <param name="code">Machine-readable error code.</param>
    /// <param name="message">Human-readable error description.</param>
    public ValidationResultBuilder AddModelError(string code, string message) =>
        AddError(FieldPath.Root, code, message);

    /// <summary>Adds multiple validation errors at once.</summary>
    public ValidationResultBuilder AddErrors(IEnumerable<ValidationError> errors)
    {
        foreach (var error in errors)
        {
            AddError(error);
        }

        return this;
    }

    /// <summary>Builds the immutable <see cref="ValidationResult"/>.</summary>
    public ValidationResult Build() => new(_errors.AsReadOnly(), _traceId);
}
