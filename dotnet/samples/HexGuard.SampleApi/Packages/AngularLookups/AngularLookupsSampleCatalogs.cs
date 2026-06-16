using HexGuard.ReferenceData;

namespace HexGuard.SampleApi.Packages.AngularLookups;

internal static class AngularLookupsSampleCatalogs
{
    public static ReferenceDataCatalog CreateBaseCatalog()
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

    public static ReferenceDataCatalog CreateRefreshedCatalog()
    {
        return new ReferenceDataCatalog(
            new ReferenceDataCatalogMetadata(
                Version: "products-2026-07-01",
                GeneratedAtUtc: new DateTimeOffset(2026, 7, 1, 0, 0, 0, TimeSpan.Zero)),
            new List<ReferenceDataCollection>
            {
                new(
                    Key: "categories",
                    Revision: "categories-r2",
                    Items: new List<ReferenceDataItem>
                    {
                        new("hardware", "Hardware and Devices"),
                        new("software", "Software"),
                        new("services", "Services and Support"),
                    }),
                new(
                    Key: "suppliers",
                    Revision: "suppliers-r4",
                    Items: new List<ReferenceDataItem>
                    {
                        new("contoso", "Contoso Global"),
                        new("northwind", "Northwind Supply"),
                        new("tailspin", "Tailspin Components"),
                    }),
                new(
                    Key: "lifecycleStates",
                    Revision: "lifecycle-r3",
                    Items: new List<ReferenceDataItem>
                    {
                        new("draft", "Draft"),
                        new("active", "Active"),
                        new("retired", "Archived", IsActive: false),
                    }),
            });
    }

    public static object CreateInvalidCatalogPayload()
    {
        return new
        {
            metadata = new
            {
                version = "products-invalid",
                generatedAtUtc = "2026-07-02T00:00:00Z",
            },
            collections = new object[]
            {
                new
                {
                    key = "categories",
                    revision = "categories-r3",
                    items = new object[]
                    {
                        new { key = "hardware", label = "Hardware" },
                    },
                },
                new
                {
                    key = "categories",
                    revision = "categories-r4",
                    items = new object[]
                    {
                        new { key = "software", label = "Software" },
                    },
                },
            },
        };
    }
}