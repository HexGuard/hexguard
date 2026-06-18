namespace HexGuard.BulkOperations;

/// <summary>
/// Per-item error information in a bulk operation result.
/// Mirrors the error shape used by HexGuard.ValidationContracts
/// for consistent field-level error display.
/// </summary>
/// <param name="Code">Machine-readable error code.</param>
/// <param name="Message">Human-readable error message.</param>
/// <param name="Field">Optional dot-separated field path for form-level binding.</param>
public sealed record BulkOperationError(
    string Code,
    string Message,
    string? Field = null
);
