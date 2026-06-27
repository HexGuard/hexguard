namespace HexGuard.Blazor.DebouncedInput;

/// <summary>
/// Determines when the debounced callback fires relative to incoming <see cref="DebouncedValue{T}.Push"/> calls.
/// </summary>
public enum DebounceMode
{
    /// <summary>
    /// Fire the callback only after the debounce window elapses with no new pushes.
    /// This is the default and the best fit for search-as-you-type and auto-save scenarios.
    /// </summary>
    Trailing,

    /// <summary>
    /// Fire the callback immediately on the first push, then suppress subsequent
    /// pushes until the debounce window elapses.
    /// </summary>
    Leading,

    /// <summary>
    /// Fire the callback immediately on the first push AND again after the debounce
    /// window elapses (with the most recent value).
    /// </summary>
    LeadingAndTrailing,
}
