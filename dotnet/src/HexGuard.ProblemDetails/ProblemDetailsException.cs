namespace HexGuard.ProblemDetails;

/// <summary>
/// An exception that carries a <see cref="ProblemDetails"/> payload. Useful
/// for throw-vs-return middleware patterns where business logic throws and
/// middleware converts the exception to an RFC 9457 response.
/// </summary>
public class ProblemDetailsException : Exception
{
    /// <summary>
    /// The Problem Details payload describing the error.
    /// </summary>
    public ProblemDetails Details { get; }

    /// <summary>
    /// Creates a new <see cref="ProblemDetailsException"/>.
    /// </summary>
    /// <param name="details">The Problem Details payload.</param>
    /// <param name="innerException">An optional inner exception.</param>
    public ProblemDetailsException(ProblemDetails details, Exception? innerException = null)
        : base(details?.Title ?? details?.Detail, innerException)
    {
        ArgumentNullException.ThrowIfNull(details);
        Details = details;
    }
}
