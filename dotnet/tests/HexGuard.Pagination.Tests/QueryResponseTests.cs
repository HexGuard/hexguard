using Xunit;
using HexGuard.Pagination;

namespace HexGuard.Pagination.Tests;

public class QueryResponseTests
{
    [Fact]
    public void Create_ComputesTotalPages()
    {
        var items = new[] { "a", "b", "c", "d", "e" };
        var response = QueryResponse<string>.Create(items, 25, 1, 10);

        Assert.Equal(3, response.TotalPages);
        Assert.Equal(items, response.Items);
        Assert.Equal(25, response.TotalCount);
    }

    [Fact]
    public void HasNext_ReturnsTrueWhenPageIsNotLast()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 1, 10);
        Assert.True(response.HasNext);
    }

    [Fact]
    public void HasNext_ReturnsFalseWhenPageIsLast()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 3, 10);
        Assert.False(response.HasNext);
    }

    [Fact]
    public void HasPrevious_ReturnsTrueWhenPageIsNotFirst()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 2, 10);
        Assert.True(response.HasPrevious);
    }

    [Fact]
    public void HasPrevious_ReturnsFalseWhenPageIsFirst()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 1, 10);
        Assert.False(response.HasPrevious);
    }

    [Fact]
    public void RangeStart_ReturnsCorrectValue()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 2, 10);
        Assert.Equal(11, response.RangeStart);
    }

    [Fact]
    public void RangeEnd_ReturnsCorrectValue()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 2, 10);
        Assert.Equal(20, response.RangeEnd);
    }

    [Fact]
    public void RangeEnd_CapsAtTotalCountForLastPage()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 25, 3, 10);
        Assert.Equal(25, response.RangeEnd);
    }

    [Fact]
    public void RangeStart_ReturnsZeroWhenTotalCountIsZero()
    {
        var response = QueryResponse<string>.Create(Array.Empty<string>(), 0, 1, 10);
        Assert.Equal(0, response.RangeStart);
    }
}
