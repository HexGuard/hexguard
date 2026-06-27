using System.Diagnostics;

namespace HexGuard.Blazor.DebouncedInput;

/// <summary>
/// A headless debounce primitive that delays value propagation by a configurable interval.
/// Designed for search-as-you-type, form auto-save, and live-filter scenarios in Blazor.
/// </summary>
/// <typeparam name="T">The type of value being debounced.</typeparam>
/// <remarks>
/// <para>Uses <see cref="CancellationTokenSource"/> and <c>Task.Delay</c> internally —
/// no JavaScript interop required. Designed for Blazor's single-threaded synchronization context.</para>
/// <para>Register via <c>builder.Services.AddDebouncedValue&lt;T&gt;()</c> for transient lifetime
/// (each component gets its own instance).</para>
/// </remarks>
/// <example>
/// <code>
/// // ── Registration (Program.cs) ──────────────────────
/// builder.Services.AddDebouncedValue&lt;string&gt;();
///
/// // ── Usage (Razor component) ────────────────────────
/// @inject DebouncedValue&lt;string&gt; SearchDebounce
///
/// &lt;input @oninput="OnSearch" @bind-value="searchText" /&gt;
///
/// @code {
///     private string searchText = "";
///
///     protected override void OnInitialized()
///     {
///         SearchDebounce = DebouncedValue&lt;string&gt;.Create(
///             async value => { /* call API, filter data, etc. */ },
///             delayMs: 300);
///     }
///
///     private void OnSearch(ChangeEventArgs e)
///     {
///         searchText = e.Value?.ToString() ?? "";
///         SearchDebounce.Push(searchText);
///     }
///
///     public void Dispose() =&gt; SearchDebounce.Dispose();
/// }
/// </code>
/// </example>
public sealed class DebouncedValue<T> : IDisposable
{
    private readonly Func<T, Task> _onValue;
    private readonly Action<Exception>? _onError;
    private readonly int _delayMs;
    private readonly int _maxDelayMs;
    private readonly DebounceMode _mode;

    private CancellationTokenSource? _cts;
    private T? _lastPending;
    private bool _hasLeadingFired;
    private long _firstPushTimestamp;

    /// <summary>
    /// The last value that was successfully processed by the callback.
    /// </summary>
    public T? LastProcessed { get; private set; }

    /// <summary>
    /// Creates a debounced value handler.
    /// </summary>
    /// <param name="onValue">The async callback invoked with the debounced value.</param>
    /// <param name="delayMs">Debounce window in milliseconds. Must be &gt;= 0.</param>
    /// <param name="mode">When the callback fires relative to pushes. Defaults to <see cref="DebounceMode.Trailing"/>.</param>
    /// <param name="maxDelayMs">
    /// Maximum time in milliseconds the debounce can defer before firing regardless of new pushes.
    /// Use 0 for no limit (default). Can be smaller than <paramref name="delayMs"/> to force
    /// periodic firings during continuous input. Prevents infinite deferral when inputs never
    /// pause, e.g. holding down a key.
    /// </param>
    /// <param name="onError">
    /// Optional callback invoked when <paramref name="onValue"/> throws. If not provided,
    /// exceptions from the callback are silently caught and discarded.
    /// </param>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="onValue"/> is null.</exception>
    /// <exception cref="ArgumentOutOfRangeException">Thrown when <paramref name="delayMs"/> is negative.</exception>
    /// <exception cref="ArgumentException">Thrown when <paramref name="maxDelayMs"/> is less than <paramref name="delayMs"/>.</exception>
    public static DebouncedValue<T> Create(
        Func<T, Task> onValue,
        int delayMs = 300,
        DebounceMode mode = DebounceMode.Trailing,
        int maxDelayMs = 0,
        Action<Exception>? onError = null)
    {
        return new DebouncedValue<T>(onValue, delayMs, mode, maxDelayMs, onError);
    }

    private DebouncedValue(Func<T, Task> onValue, int delayMs, DebounceMode mode, int maxDelayMs, Action<Exception>? onError)
    {
        ArgumentNullException.ThrowIfNull(onValue);
        ArgumentOutOfRangeException.ThrowIfNegative(delayMs);
        ArgumentOutOfRangeException.ThrowIfNegative(maxDelayMs);

        _onValue = onValue;
        _delayMs = delayMs;
        _maxDelayMs = maxDelayMs;
        _mode = mode;
        _onError = onError;
    }

    /// <summary>
    /// Pushes a new value into the debounce pipeline. The callback fires according to
    /// the configured <see cref="DebounceMode"/> and delay.
    /// </summary>
    /// <param name="value">The value to debounce.</param>
    public void Push(T value)
    {
        // Cancel any in-flight debounce
        CancelCurrent();

        // Track first push in burst for maxDelay enforcement
        if (_firstPushTimestamp == 0)
        {
            _firstPushTimestamp = Stopwatch.GetTimestamp();
        }

        switch (_mode)
        {
            case DebounceMode.Leading:
                if (!_hasLeadingFired)
                {
                    _hasLeadingFired = true;
                    ProcessValue(value);
                    StartTrailingWindow(value);
                }
                else
                {
                    _lastPending = value;
                    StartTrailingWindow(value);
                }
                break;

            case DebounceMode.LeadingAndTrailing:
                if (!_hasLeadingFired)
                {
                    _hasLeadingFired = true;
                    ProcessValue(value);
                }
                _lastPending = value;
                StartTrailingWindow(value);
                break;

            case DebounceMode.Trailing:
            default:
                _lastPending = value;
                StartTrailingWindow(value);
                break;
        }
    }

    /// <summary>
    /// Immediately invokes the callback with the most recent pending value (if any).
    /// Cancels any in-flight debounce window.
    /// </summary>
    public void Flush()
    {
        CancelCurrent();
        if (_lastPending is not null)
        {
            ProcessValue(_lastPending);
            _lastPending = default;
        }
        ClearBurstTracking();
    }

    /// <summary>
    /// Cancels any in-flight debounce without invoking the callback.
    /// Pending values are discarded.
    /// </summary>
    public void Cancel()
    {
        CancelCurrent();
        _lastPending = default;
        ClearBurstTracking();
    }

    /// <summary>
    /// Disposes the debounce handler, cancelling any in-flight operation.
    /// </summary>
    public void Dispose()
    {
        CancelCurrent();
    }

    private void StartTrailingWindow(T value)
    {
        _cts = new CancellationTokenSource();
        var capturedToken = _cts.Token;
        var capturedValue = value;

        var effectiveDelay = _delayMs;
        if (_maxDelayMs > 0 && _firstPushTimestamp > 0)
        {
            var elapsedMs = Stopwatch.GetElapsedTime(_firstPushTimestamp).TotalMilliseconds;
            var remainingMaxMs = _maxDelayMs - elapsedMs;
            if (remainingMaxMs <= 0)
            {
                // Max delay exceeded — fire immediately
                ProcessValue(capturedValue!);
                _lastPending = default;
                ClearBurstTracking();
                return;
            }
            // Wait for the shorter of delayMs and remaining maxDelay
            effectiveDelay = (int)Math.Min(_delayMs, remainingMaxMs);
        }

        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(effectiveDelay, capturedToken);
                // Only fire if this is still the current token and value hasn't been superseded
                if (!capturedToken.IsCancellationRequested &&
                    EqualityComparer<T>.Default.Equals(capturedValue, _lastPending))
                {
                    ProcessValue(capturedValue!);
                    _lastPending = default;
                    ClearBurstTracking();
                }
            }
            catch (OperationCanceledException)
            {
                // Expected when a new push arrives or Cancel/Dispose is called
            }
        }, capturedToken);
    }

    private void ClearBurstTracking()
    {
        _firstPushTimestamp = 0;
        _hasLeadingFired = false;
    }

    private void CancelCurrent()
    {
        if (_cts is not null)
        {
            _cts.Cancel();
            _cts.Dispose();
            _cts = null;
        }
    }

    private void ProcessValue(T value)
    {
        LastProcessed = value;
        _ = InvokeCallbackAsync(value);
    }

    private async Task InvokeCallbackAsync(T value)
    {
        try
        {
            await _onValue(value);
        }
        catch (Exception ex)
        {
            if (_onError is not null)
            {
                _onError(ex);
            }
        }
    }
}
