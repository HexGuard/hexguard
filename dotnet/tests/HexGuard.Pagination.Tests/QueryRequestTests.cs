using Xunit;
using HexGuard.Pagination;

namespace HexGuard.Pagination.Tests;

public class QueryRequestTests
{
    [Fact]
    public void DefaultConstructor_UsesPage1AndSize20()
    {
        var request = new QueryRequest();
        Assert.Equal(1, request.Page);
        Assert.Equal(20, request.PageSize);
        Assert.Null(request.Search);
        Assert.Null(request.Sort);
        Assert.Null(request.Filters);
    }

    [Fact]
    public void Constructor_SetsPageAndPageSize()
    {
        var request = new QueryRequest(3, 50);
        Assert.Equal(3, request.Page);
        Assert.Equal(50, request.PageSize);
    }

    [Fact]
    public void FullConstructor_SetsAllProperties()
    {
        var sort = new[] { new SortSpec("name", false) };
        var filters = new Dictionary<string, string> { { "status", "active" } };
        var request = new QueryRequest(1, 20, "search", sort, filters);

        Assert.Equal(1, request.Page);
        Assert.Equal(20, request.PageSize);
        Assert.Equal("search", request.Search);
        Assert.Single(request.Sort!);
        Assert.Single(request.Filters!);
    }
}
