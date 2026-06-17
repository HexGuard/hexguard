namespace HexGuard.ProblemDetails;

/// <summary>
/// Constants for well-known RFC 9457 Problem Details type URIs.
/// </summary>
public static partial class WellKnownProblemTypes
{
    /// <summary>
    /// <c>about:blank</c> — the default type when no more specific type is known.
    /// </summary>
    public const string AboutBlank = "about:blank";

    /// <summary>
    /// A generic validation error. The <c>Extensions</c> dictionary should contain
    /// a <c>errors</c> member with per-field validation details.
    /// </summary>
    public const string ValidationError = "https://docs.hexguard.dev/problems/validation-error";

    /// <summary>
    /// The request referenced a resource that does not exist.
    /// </summary>
    public const string NotFound = "https://docs.hexguard.dev/problems/not-found";

    /// <summary>
    /// A supplied value is outside the allowed range.
    /// </summary>
    public const string OutOfRange = "https://docs.hexguard.dev/problems/out-of-range";

    /// <summary>
    /// The request is malformed or cannot be processed.
    /// </summary>
    public const string BadRequest = "https://docs.hexguard.dev/problems/bad-request";

    /// <summary>
    /// The server encountered an unexpected condition that prevented it
    /// from fulfilling the request.
    /// </summary>
    public const string InternalServerError = "https://docs.hexguard.dev/problems/internal-server-error";
}
