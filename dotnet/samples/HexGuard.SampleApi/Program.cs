using HexGuard.SampleApi.Packages.AngularAsyncState;
using HexGuard.SampleApi.Packages.AngularLookups;
using HexGuard.SampleApi.Packages.AngularOptimisticState;
using HexGuard.SampleApi.Packages.AngularPermissions;
using HexGuard.SampleApi.Packages.HexGuardProblemDetails;
using HexGuard.SampleApi.Packages.HexGuardReferenceData;
using HexGuard.FeatureFlags;
using HexGuard.SampleApi.Packages.HexGuardFeatureFlags;
using HexGuard.SampleApi.Packages.HexGuardValidationContracts;
using HexGuard.SampleApi.Packages.HexGuardBulkOperations;
using HexGuard.SampleApi.Packages.HexGuardCapabilities;
using HexGuard.SampleApi.Packages.HexGuardPagination;
using HexGuard.SampleApi.Packages.HexGuardUploads;
using HexGuard.Capabilities;
using HexGuard.Uploads;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHexGuardFeatureFlags(options =>
{
    foreach (var flag in FeatureFlagsSampleData.CreateOptions().Flags)
    {
        options.Flags.Add(flag);
    }
});

builder.Services.AddHexGuardCapabilities(options =>
{
    foreach (var (userId, caps) in CapabilitiesSampleData.CreatePersonas())
    {
        options.AddCapabilities(userId, caps);
    }
});

builder.Services.AddCors((options) =>
{
    options.AddPolicy(
        "DemoFrontends",
        (policy) => policy
            .WithOrigins("http://127.0.0.1:4200", "http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("DemoFrontends");

app.UseMiddleware<HexGuard.ProblemDetails.ProblemDetailsMiddleware>();

app.MapGet("/", () => Results.Ok(new
{
    sampleApi = "HexGuard shared demo API",
    packages = new object[]
    {
        new
        {
            id = "angular-lookups",
            route = "/api/angular-lookups",
            catalogEndpoint = "/api/angular-lookups/catalog?scenario=base",
            scenarios = new[] { "base", "refreshed", "invalid" },
        },
        new
        {
            id = "angular-async-state",
            route = "/api/angular-async-state",
            metricsEndpoint = "/api/angular-async-state/metrics?scenario=base",
            scenarios = new[] { "base", "refreshed" },
        },
        new
        {
            id = "angular-optimistic-state",
            route = "/api/angular-optimistic-state",
            featuresEndpoint = "/api/angular-optimistic-state/features",
            draftsEndpoint = "/api/angular-optimistic-state/drafts",
        },
        new
        {
            id = "angular-permissions",
            route = "/api/angular-permissions",
            personasEndpoint = "/api/angular-permissions/personas",
            userEndpoint = "/api/angular-permissions/user?persona=guest",
        },
        new
        {
            id = "hexguard-reference-data",
            route = "/api/reference-data",
            catalogEndpoint = "/api/reference-data/catalog",
            note = ".NET-only — demonstrates HexGuard.ReferenceData library directly",
        },
        new
        {
            id = "hexguard-validation-contracts",
            route = "/api/validation-contracts",
            validateEndpoint = "/api/validation-contracts/validate (POST)",
            errorCodesEndpoint = "/api/validation-contracts/error-codes",
            note = ".NET validation contract shapes and RFC 9457 Problem Details",
        },
        new
        {
            id = "hexguard-problem-details",
            route = "/api/problem-details",
            validationEndpoint = "/api/problem-details/validation",
            notFoundEndpoint = "/api/problem-details/not-found",
            serverErrorEndpoint = "/api/problem-details/server-error",
            note = "RFC 9457 Problem Details — core types, builder, middleware",
        },
        new
        {
            id = "hexguard-feature-flags",
            route = "/api/feature-flags",
            syncEndpoint = "/api/feature-flags/sync?contextHash=",
            evaluateEndpoint = "/api/feature-flags/evaluate?key=beta-search&userId=user-42",
            personasEndpoint = "/api/feature-flags/personas",
            note = "Feature flags — evaluation, targeting rules, sync, paired with @hexguard/angular-feature-flags",
        },
        new
        {
            id = "hexguard-bulk-operations",
            route = "/api/bulk-operations",
            deleteEndpoint = "/api/bulk-operations/delete (POST)",
            approveEndpoint = "/api/bulk-operations/approve (POST)",
            note = "Bulk operations — HTTP 207 Multi-Status, partial-success, paired with @hexguard/angular-bulk-operations",
        },
        new
        {
            id = "hexguard-capabilities",
            route = "/api/capabilities",
            personasEndpoint = "/api/capabilities/personas",
            userEndpoint = "/api/capabilities/user?persona=admin",
            note = "Capabilities — server-side permission contracts, paired with @hexguard/angular-permissions",
        },
        new
        {
            id = "hexguard-pagination",
            route = "/api/pagination",
            productsEndpoint = "/api/pagination/products?page=1&pageSize=5",
            note = "Pagination — QueryRequest/QueryResponse contracts, paired with @hexguard/angular-pagination",
        },
    },
}));

app.MapAngularLookupsSampleEndpoints();
app.MapAsyncStateSampleEndpoints();
app.MapOptimisticStateSampleEndpoints();
app.MapPermissionsSampleEndpoints();
app.MapProblemDetailsSampleEndpoints();
app.MapReferenceDataSampleEndpoints();
app.MapValidationContractsSampleEndpoints();
app.MapFeatureFlagEndpoints();
app.MapFeatureFlagsSampleEndpoints();
app.MapBulkOperationsSampleEndpoints();
app.MapPaginationSampleEndpoints();
app.MapCapabilitiesSampleEndpoints();
app.MapUploadsSampleEndpoints();

app.Run();

public partial class Program;