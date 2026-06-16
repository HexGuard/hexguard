using HexGuard.ReferenceData;

namespace HexGuard.SampleApi.Packages.HexGuardReferenceData;

internal static class SampleReferenceDataCatalogs
{
    /// <summary>
    /// Creates a valid product reference-data catalog using the HexGuard.ReferenceData library types.
    /// </summary>
    public static ReferenceDataCatalog CreateProductCatalog()
    {
        return new ReferenceDataCatalog(
            new ReferenceDataCatalogMetadata(
                Version: "products-2026-06-15",
                GeneratedAtUtc: new DateTimeOffset(2026, 6, 15, 0, 0, 0, TimeSpan.Zero)),
            new List<ReferenceDataCollection>
            {
                new(
                    Key: "categories",
                    Revision: "categories-r1",
                    Items: new List<ReferenceDataItem>
                    {
                        new("hardware", "Hardware"),
                        new("software", "Software"),
                        new("services", "Services"),
                    }),
                new(
                    Key: "suppliers",
                    Revision: "suppliers-r3",
                    Items: new List<ReferenceDataItem>
                    {
                        new("contoso", "Contoso Industrial"),
                        new("northwind", "Northwind Supply"),
                        new("tailspin", "Tailspin Components"),
                    }),
                new(
                    Key: "lifecycleStates",
                    Revision: "lifecycle-r2",
                    Items: new List<ReferenceDataItem>
                    {
                        new("draft", "Draft"),
                        new("active", "Active"),
                        new("retired", "Retired", IsActive: false),
                    }),
            });
    }

    /// <summary>
    /// Creates an intentionally invalid catalog to demonstrate validation.
    /// </summary>
    public static ReferenceDataCatalog CreateInvalidCatalog()
    {
        return new ReferenceDataCatalog(
            new ReferenceDataCatalogMetadata(
                Version: "",
                GeneratedAtUtc: default),
            new List<ReferenceDataCollection>
            {
                new(
                    Key: "categories",
                    Revision: "categories-r1",
                    Items: new List<ReferenceDataItem>
                    {
                        new("hardware", "Hardware"),
                    }),
                new(
                    Key: "categories",
                    Revision: "categories-r2",
                    Items: new List<ReferenceDataItem>
                    {
                        new("software", "Software"),
                    }),
            });
    }
}
