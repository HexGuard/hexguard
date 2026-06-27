namespace HexGuard.Blazor.DebouncedInput.Tests;

public class DebouncedValueTests
{
    [Fact]
    public void Create_WithValidArgs_ReturnsInstance()
    {
        var dv = DebouncedValue<string>.Create(_ => Task.CompletedTask);
        Assert.NotNull(dv);
        Assert.Null(dv.LastProcessed);
    }

    [Fact]
    public void Create_WithNullCallback_ThrowsArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() =>
            DebouncedValue<string>.Create(null!));
    }

    [Fact]
    public void Create_WithNegativeDelay_ThrowsArgumentOutOfRangeException()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            DebouncedValue<string>.Create(_ => Task.CompletedTask, delayMs: -1));
    }

    [Fact]
    public async Task Trailing_FiresAfterDelay()
    {
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value => { tcs.SetResult(value); await Task.CompletedTask; },
            delayMs: 100,
            mode: DebounceMode.Trailing);

        dv.Push("hello");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal("hello", result);
        Assert.Equal("hello", dv.LastProcessed);
    }

    [Fact]
    public async Task Trailing_MultipleRapidPushesFiresOnlyOnce()
    {
        var callCount = 0;
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                Interlocked.Increment(ref callCount);
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 200,
            mode: DebounceMode.Trailing);

        dv.Push("a");
        dv.Push("b");
        dv.Push("c");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal("c", result);
        Assert.Equal(1, callCount);
    }

    [Fact]
    public async Task Leading_FiresImmediately()
    {
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 500,
            mode: DebounceMode.Leading);

        dv.Push("first");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(2));
        Assert.Equal("first", result);
    }

    [Fact]
    public async Task Leading_SubsequentWithinWindowSuppressed()
    {
        var callCount = 0;
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                Interlocked.Increment(ref callCount);
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 300,
            mode: DebounceMode.Leading);

        dv.Push("first");

        var firstResult = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(2));
        Assert.Equal("first", firstResult);
        Assert.Equal(1, callCount);

        // Second push within window should be suppressed
        dv.Push("second");
        await Task.Delay(100);
        Assert.Equal(1, callCount); // Still 1 — second push suppressed
    }

    [Fact]
    public async Task LeadingAndTrailing_FiresImmediatelyAndAfterPause()
    {
        var results = new List<string>();
        var allFired = new TaskCompletionSource<bool>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                lock (results)
                {
                    results.Add(value);
                }
                if (results.Count >= 2)
                    allFired.TrySetResult(true);
                await Task.CompletedTask;
            },
            delayMs: 100,
            mode: DebounceMode.LeadingAndTrailing);

        dv.Push("hello");

        await allFired.Task.WaitAsync(TimeSpan.FromSeconds(5));

        Assert.Equal(2, results.Count);
        Assert.Contains("hello", results); // Both leading and trailing fire with the value
    }

    [Fact]
    public async Task Flush_ImmediatelyInvokesWithLatestPending()
    {
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 5000,
            mode: DebounceMode.Trailing);

        dv.Push("flush-me");
        dv.Flush();

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(2));
        Assert.Equal("flush-me", result);
        Assert.Equal("flush-me", dv.LastProcessed);
    }

    [Fact]
    public async Task Cancel_DiscardsPendingWithoutFiring()
    {
        var callCount = 0;
        var dv = DebouncedValue<string>.Create(
            _ =>
            {
                Interlocked.Increment(ref callCount);
                return Task.CompletedTask;
            },
            delayMs: 500,
            mode: DebounceMode.Trailing);

        dv.Push("discard-me");
        dv.Cancel();

        await Task.Delay(100);
        Assert.Equal(0, callCount);
    }

    [Fact]
    public async Task Dispose_CleansUpAndStopsFiring()
    {
        var callCount = 0;
        var dv = DebouncedValue<string>.Create(
            _ =>
            {
                Interlocked.Increment(ref callCount);
                return Task.CompletedTask;
            },
            delayMs: 100,
            mode: DebounceMode.Trailing);

        dv.Push("before-dispose");
        dv.Dispose();
        await Task.Delay(300);

        // The in-flight debounce should have been cancelled by Dispose
        Assert.Equal(0, callCount);
    }

    [Fact]
    public async Task LastProcessed_UpdatesCorrectly()
    {
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 50,
            mode: DebounceMode.Trailing);

        Assert.Null(dv.LastProcessed);

        dv.Push("processed");
        await tcs.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal("processed", dv.LastProcessed);
    }

    [Fact]
    public async Task ZeroDelay_FiresImmediately()
    {
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 0,
            mode: DebounceMode.Trailing);

        dv.Push("instant");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(2));
        Assert.Equal("instant", result);
    }

    [Fact]
    public void NullValue_IsAccepted()
    {
        var tcs = new TaskCompletionSource<string?>();
        var dv = DebouncedValue<string?>.Create(
            async value =>
            {
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 50,
            mode: DebounceMode.Trailing);

        dv.Push(null);

        Assert.Null(dv.LastProcessed); // Not yet processed
    }

    [Fact]
    public async Task NewPushDuringDelay_ResetsTimer_Trailing()
    {
        var callCount = 0;
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                Interlocked.Increment(ref callCount);
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 300,
            mode: DebounceMode.Trailing);

        dv.Push("first");
        await Task.Delay(100);
        dv.Push("second");
        await Task.Delay(100);
        dv.Push("third");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal("third", result);
        Assert.Equal(1, callCount);
    }

    [Fact]
    public async Task Leading_TrailingWindowFiresLastPending()
    {
        var results = new List<string>();
        var trailingFired = new TaskCompletionSource<bool>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                lock (results) results.Add(value);
                await Task.CompletedTask;
            },
            delayMs: 150,
            mode: DebounceMode.Leading);

        // First push fires immediately (leading)
        dv.Push("first");

        // Push within window — suppressed for leading but stored as pending
        await Task.Delay(50);
        dv.Push("second");

        // Wait for the trailing window to elapse + processing time
        await Task.Delay(300);

        // "first" from leading, "second" from trailing window completion
        Assert.Equal(2, results.Count);
        Assert.Equal("first", results[0]);
        Assert.Equal("second", results[1]);
    }

    [Fact]
    public async Task OnError_CallbackReceivesException()
    {
        Exception? captured = null;
        var dv = DebouncedValue<string>.Create(
            _ => throw new InvalidOperationException("test error"),
            delayMs: 50,
            onError: ex => captured = ex);

        dv.Push("trigger");

        // Wait for the trailing window
        await Task.Delay(200);

        Assert.NotNull(captured);
        Assert.IsType<InvalidOperationException>(captured);
        Assert.Equal("test error", captured.Message);
        // LastProcessed still updated (the value was accepted)
        Assert.Equal("trigger", dv.LastProcessed);
    }

    [Fact]
    public async Task MaxDelay_FiresEvenWhileStillPushing()
    {
        var callCount = 0;
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                Interlocked.Increment(ref callCount);
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 2000,
            maxDelayMs: 200);

        // Push several times with short delays — maxDelay should force fire
        dv.Push("a");
        await Task.Delay(60);
        dv.Push("b");
        await Task.Delay(60);
        dv.Push("c");
        await Task.Delay(60);
        dv.Push("d");

        // Total elapsed ~180ms, maxDelay is 200ms — should fire by ~200ms from first push
        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.True(callCount >= 1, $"Expected at least 1 call, got {callCount}");
        Assert.Equal("d", result);
    }

    [Fact]
    public async Task MaxDelay_FiresImmediatelyWhenExceeded()
    {
        var callCount = 0;
        var tcs = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                Interlocked.Increment(ref callCount);
                tcs.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 1000,
            maxDelayMs: 150);

        // Push twice quickly — maxDelay should force fire before delayMs would
        dv.Push("x");
        await Task.Delay(100);
        dv.Push("y");

        var result = await tcs.Task.WaitAsync(TimeSpan.FromSeconds(3));
        Assert.Equal("y", result);
        Assert.Equal(1, callCount);
    }

    [Fact]
    public async Task MaxDelay_ResetsWhenBurstEnds()
    {
        var callCount = 0;
        var tcs1 = new TaskCompletionSource<string>();
        var dv = DebouncedValue<string>.Create(
            async value =>
            {
                var current = Interlocked.Increment(ref callCount);
                if (current == 1) tcs1.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 100,
            maxDelayMs: 300);

        // First burst
        dv.Push("burst1-a");
        await Task.Delay(50);
        dv.Push("burst1-b");

        var result1 = await tcs1.Task.WaitAsync(TimeSpan.FromSeconds(3));
        Assert.Equal("burst1-b", result1);

        // Second burst — maxDelay timer should be fresh
        await Task.Delay(150); // Let the burst fully settle
        var tcs2 = new TaskCompletionSource<string>();
        dv = DebouncedValue<string>.Create(
            async value =>
            {
                tcs2.TrySetResult(value);
                await Task.CompletedTask;
            },
            delayMs: 100,
            maxDelayMs: 300);

        dv.Push("burst2-a");
        await Task.Delay(50);
        dv.Push("burst2-b");
        await Task.Delay(50);
        dv.Push("burst2-c");

        var result2 = await tcs2.Task.WaitAsync(TimeSpan.FromSeconds(3));
        Assert.Equal("burst2-c", result2);
    }
}
