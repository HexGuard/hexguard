using System.Net.Http.Json;
using System.Text.Json;

using HexGuard.ReferenceData;

using Microsoft.AspNetCore.Mvc.Testing;

namespace HexGuard.ReferenceData.Tests;

public sealed class ProductReferenceDataEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ProductReferenceDataEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task BaseCatalogEndpoint_ReturnsTheVersionedCatalog()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/angular-lookups/catalog");

        response.EnsureSuccessStatusCode();

        var catalog = await response.Content.ReadFromJsonAsync<ReferenceDataCatalog>();

        Assert.NotNull(catalog);
        Assert.Equal("products-2026-06-15", catalog.Metadata.Version);

        var suppliers = catalog.GetRequiredCollection("suppliers");

        Assert.Equal("Contoso Industrial", suppliers.FindLabel("contoso"));
    }

    [Fact]
    public async Task RefreshedCatalogEndpoint_ReturnsUpdatedLabels()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/angular-lookups/catalog?scenario=refreshed");

        response.EnsureSuccessStatusCode();

        var catalog = await response.Content.ReadFromJsonAsync<ReferenceDataCatalog>();

        Assert.NotNull(catalog);
        Assert.Equal("products-2026-07-01", catalog.Metadata.Version);

        var suppliers = catalog.GetRequiredCollection("suppliers");

        Assert.Equal("Contoso Global", suppliers.FindLabel("contoso"));
    }

    [Fact]
    public async Task InvalidCatalogScenario_ReturnsDuplicateCollectionsForFrontendValidation()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/angular-lookups/catalog?scenario=invalid");

        response.EnsureSuccessStatusCode();

        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var root = document.RootElement;
        var collections = root.GetProperty("collections");

        Assert.Equal("products-invalid", root.GetProperty("metadata").GetProperty("version").GetString());
        Assert.Equal(2, collections.GetArrayLength());
        Assert.Equal("categories", collections[0].GetProperty("key").GetString());
        Assert.Equal("categories", collections[1].GetProperty("key").GetString());
    }
}