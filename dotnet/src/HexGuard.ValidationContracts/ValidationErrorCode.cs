namespace HexGuard.ValidationContracts;

/// <summary>
/// Common validation error codes used across HexGuard validation contracts.
/// Backend validation can use these constants or define custom codes.
/// The Angular side mirrors these codes for form-error matching.
/// </summary>
public static partial class ValidationErrorCode
{
    /// <summary>A required field was missing or empty.</summary>
    public const string Required = "Required";

    /// <summary>The value does not match the expected format (email, phone, pattern, etc.).</summary>
    public const string InvalidFormat = "InvalidFormat";

    /// <summary>The value is outside the allowed range (min, max, length, etc.).</summary>
    public const string OutOfRange = "OutOfRange";

    /// <summary>A duplicate value was detected where uniqueness is required.</summary>
    public const string Duplicate = "Duplicate";

    /// <summary>The value does not match a related field (password confirmation, etc.).</summary>
    public const string Mismatch = "Mismatch";

    /// <summary>The referenced entity does not exist.</summary>
    public const string NotFound = "NotFound";

    /// <summary>The value is already in use or conflicts with existing data.</summary>
    public const string Conflict = "Conflict";

    /// <summary>The value exceeds the maximum allowed length.</summary>
    public const string MaxLength = "MaxLength";

    /// <summary>The value is shorter than the minimum allowed length.</summary>
    public const string MinLength = "MinLength";

    /// <summary>The value contains prohibited characters or content.</summary>
    public const string ProhibitedValue = "ProhibitedValue";

    /// <summary>A business rule validation failed.</summary>
    public const string BusinessRule = "BusinessRule";
}
