namespace HexGuard.ValidationContracts.Tests;

public sealed class FieldPathTests
{
    [Fact]
    public void Root_ReturnsEmpty()
    {
        Assert.Equal("", FieldPath.Root);
    }

    [Fact]
    public void Child_AppendsSegment()
    {
        Assert.Equal("address.city", FieldPath.Child("address", "city"));
    }

    [Fact]
    public void Child_ReturnsChildOnly_WhenParentIsRoot()
    {
        Assert.Equal("name", FieldPath.Child("", "name"));
    }

    [Fact]
    public void Index_CreatesNumericPath()
    {
        Assert.Equal("items.0", FieldPath.Index("items", 0));
        Assert.Equal("items.1", FieldPath.Index("items", 1));
    }

    [Fact]
    public void IndexChild_CreatesNestedCollectionPath()
    {
        Assert.Equal("items.0.name", FieldPath.IndexChild("items", 0, "name"));
        Assert.Equal("items.1.price", FieldPath.IndexChild("items", 1, "price"));
    }

    [Fact]
    public void GetParent_ReturnsParentPath()
    {
        Assert.Equal("address", FieldPath.GetParent("address.city"));
        Assert.Equal("items.0", FieldPath.GetParent("items.0.name"));
    }

    [Fact]
    public void GetParent_ReturnsRoot_ForTopLevelField()
    {
        Assert.Equal("", FieldPath.GetParent("name"));
    }

    [Fact]
    public void GetParent_ReturnsRoot_ForEmptyPath()
    {
        Assert.Equal("", FieldPath.GetParent(""));
    }

    [Fact]
    public void GetLeaf_ReturnsLastSegment()
    {
        Assert.Equal("city", FieldPath.GetLeaf("address.city"));
        Assert.Equal("name", FieldPath.GetLeaf("items.0.name"));
    }

    [Fact]
    public void GetLeaf_ReturnsFullPath_ForSingleSegment()
    {
        Assert.Equal("name", FieldPath.GetLeaf("name"));
    }
}
