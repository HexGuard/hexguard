using HexGuard.SampleApi.Packages.AngularAsyncState;
using HexGuard.SampleApi.Packages.AngularLookups;
using HexGuard.SampleApi.Packages.AngularOptimisticState;
using HexGuard.SampleApi.Packages.AngularPermissions;
using HexGuard.SampleApi.Packages.HexGuardReferenceData;
using HexGuard.SampleApi.Packages.HexGuardValidationContracts;

var builder = WebApplication.CreateBuilder(args);

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
    },
}));

app.MapAngularLookupsSampleEndpoints();
app.MapAsyncStateSampleEndpoints();
app.MapOptimisticStateSampleEndpoints();
app.MapPermissionsSampleEndpoints();
app.MapReferenceDataSampleEndpoints();
app.MapValidationContractsSampleEndpoints();

app.Run();

public partial class Program;