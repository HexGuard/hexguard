using Xunit;
using HexGuard.Pagination;

namespace HexGuard.Pagination.Tests;

public class SortSpecTests
{
    [Fact]
    public void Constructor_SetsFieldAndDescending()
    {
        var sort = new SortSpec("name", true);
        Assert.Equal("name", sort.Field);
        Assert.True(sort.Descending);
    }
}
