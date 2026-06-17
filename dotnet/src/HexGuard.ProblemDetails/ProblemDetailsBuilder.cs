using System.Collections.Immutable;

namespace HexGuard.ProblemDetails;

/// <summary>
/// Fluent builder for constructing <see cref="ProblemDetails"/> instances.
/// </summary>
public sealed class ProblemDetailsBuilder
{
    private string? _typeUri;
    private string? _title;
    private int? _status;
    private string? _detail;
    private string? _instance;
    private Dictionary<string, object?>? _extensions;

    /// <summary>Sets the <see cref="ProblemDetails.TypeUri"/>.</summary>
    public ProblemDetailsBuilder WithType(string typeUri)
    {
        _typeUri = typeUri ?? throw new ArgumentNullException(nameof(typeUri));
        return this;
    }

    /// <summary>Sets the <see cref="ProblemDetails.Title"/>.</summary>
    public ProblemDetailsBuilder WithTitle(string title)
    {
        _title = title ?? throw new ArgumentNullException(nameof(title));
        return this;
    }

    /// <summary>Sets the <see cref="ProblemDetails.Status"/>.</summary>
    public ProblemDetailsBuilder WithStatus(int status)
    {
        _status = status;
        return this;
    }

    /// <summary>Sets the <see cref="ProblemDetails.Detail"/>.</summary>
    public ProblemDetailsBuilder WithDetail(string detail)
    {
        _detail = detail ?? throw new ArgumentNullException(nameof(detail));
        return this;
    }

    /// <summary>Sets the <see cref="ProblemDetails.Instance"/>.</summary>
    public ProblemDetailsBuilder WithInstance(string instance)
    {
        _instance = instance ?? throw new ArgumentNullException(nameof(instance));
        return this;
    }

    /// <summary>
    /// Adds an extension member. Multiple calls with the same <paramref name="key"/>
    /// overwrite the previous value.
    /// </summary>
    public ProblemDetailsBuilder WithExtension(string key, object? value)
    {
        _extensions ??= new Dictionary<string, object?>();
        _extensions[key] = value;
        return this;
    }

    /// <summary>Builds the <see cref="ProblemDetails"/> instance.</summary>
    public ProblemDetails Build()
    {
        return new ProblemDetails(
            TypeUri: _typeUri,
            Title: _title,
            Status: _status,
            Detail: _detail,
            Instance: _instance,
            Extensions: _extensions?.ToImmutableDictionary(StringComparer.Ordinal)
        );
    }
}
