namespace HexGuard.ValidationContracts;

/// <summary>
/// Static helpers for constructing and manipulating dot-separated field paths.
/// </summary>
public static partial class FieldPath
{
    /// <summary>Empty root path, used for model-level errors.</summary>
    public const string Root = "";

    /// <summary>Creates a child path by appending a segment to the parent path.</summary>
    /// <param name="parent">Parent field path, e.g. <c>"address"</c>.</param>
    /// <param name="child">Child segment name, e.g. <c>"city"</c>.</param>
    /// <returns>A dot-separated path, e.g. <c>"address.city"</c>.</returns>
    public static string Child(string parent, string child) =>
        parent.Length == 0 ? child : $"{parent}.{child}";

    /// <summary>Creates a path for an indexed collection element.</summary>
    /// <param name="parent">Parent field path, e.g. <c>"items"</c>.</param>
    /// <param name="index">Zero-based element index.</param>
    /// <returns>A path with numeric index, e.g. <c>"items.0"</c>.</returns>
    public static string Index(string parent, int index) =>
        $"{parent}.{index}";

    /// <summary>Creates a child path under an indexed element.</summary>
    /// <param name="parent">Parent field path including index, e.g. <c>"items.0"</c>.</param>
    /// <param name="index">Zero-based element index.</param>
    /// <param name="child">Child segment name, e.g. <c>"name"</c>.</param>
    /// <returns>A nested collection path, e.g. <c>"items.0.name"</c>.</returns>
    public static string IndexChild(string parent, int index, string child) =>
        Index(parent, index).Length == 0 ? child : $"{Index(parent, index)}.{child}";

    /// <summary>Returns the parent path (everything before the last dot), or <see cref="Root"/> if there is no parent.</summary>
    public static string GetParent(string path)
    {
        if (path.Length == 0) return Root;
        var lastDot = path.LastIndexOf('.');
        return lastDot < 0 ? Root : path[..lastDot];
    }

    /// <summary>Returns the last segment of the path (everything after the last dot), or the full path if there is no dot.</summary>
    public static string GetLeaf(string path)
    {
        if (path.Length == 0) return Root;
        var lastDot = path.LastIndexOf('.');
        return lastDot < 0 ? path : path[(lastDot + 1)..];
    }
}
