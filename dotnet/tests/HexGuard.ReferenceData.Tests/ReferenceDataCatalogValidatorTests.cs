using HexGuard.ReferenceData;

namespace HexGuard.ReferenceData.Tests;

public sealed class ReferenceDataCatalogValidatorTests
{
    [Fact]
    public void ValidateOrThrow_AcceptsAValidCatalog()
    {
        var catalog = CreateCatalog();

        ReferenceDataCatalogValidator.ValidateOrThrow(catalog);
    }

    [Fact]
    public void ValidateOrThrow_RejectsDuplicateCollectionKeys()
    {
        var catalog = new ReferenceDataCatalog(
            new ReferenceDataCatalogMetadata("catalog-v1", new DateTimeOffset(2026, 6, 15, 0, 0, 0, TimeSpan.Zero)),
            new List<ReferenceDataCollection>
            {
                new("categories", "r1", new List<ReferenceDataItem> { new("hardware", "Hardware") }),
                new("categories", "r2", new List<ReferenceDataItem> { new("software", "Software") }),
            });

        var exception = Assert.Throws<ReferenceDataValidationException>(
            () => ReferenceDataCatalogValidator.ValidateOrThrow(catalog));

        Assert.Contains(exception.Errors, (error) => error.Contains("Duplicate collection key 'categories'.", StringComparison.Ordinal));
    }

    [Fact]
    public void FindLabel_ReturnsNullWhenTheKeyIsMissing()
    {
        var categories = CreateCatalog().GetRequiredCollection("categories");

        Assert.Equal("Hardware", categories.FindLabel("hardware"));
        Assert.Null(categories.FindLabel("missing"));
    }

    private static ReferenceDataCatalog CreateCatalog()
    {
        return new ReferenceDataCatalog(
            new ReferenceDataCatalogMetadata("catalog-v1", new DateTimeOffset(2026, 6, 15, 0, 0, 0, TimeSpan.Zero)),
            new List<ReferenceDataCollection>
            {
                new(
                    "categories",
                    "r1",
                    new List<ReferenceDataItem>
                    {
                        new("hardware", "Hardware"),
                        new("software", "Software"),
                    }),
            });
    }
}