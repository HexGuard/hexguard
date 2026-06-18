using HexGuard.ProblemDetails;
using HexGuard.ValidationContracts;

namespace HexGuard.SampleApi.Packages.HexGuardValidationContracts;

internal static class ValidationContractsSampleEndpoints
{
    public static IEndpointRouteBuilder MapValidationContractsSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/validation-contracts");

        group.MapGet("/", () => Results.Ok(new
        {
            packageId = "validation-contracts",
            description = "Demonstrates HexGuard.ValidationContracts error shapes and RFC 9457 Problem Details integration.",
            contractShape = new
            {
                validationError = new { field = "string (dot-separated path)", code = "string", message = "string" },
                validationResult = new { errors = "ValidationError[]", traceId = "string?", isCalculated = "derived from errors.Count" },
                problemDetails = new { type = "string", title = "string", status = "int", detail = "string?", instance = "string?", traceId = "string?", errors = "ValidationError[]" },
            },
            validateEndpoint = "/api/validation-contracts/validate (POST — accepts a product payload, returns validation errors as Problem Details)",
            errorCodesEndpoint = "/api/validation-contracts/error-codes",
        }));

        group.MapPost("/validate", (ProductPayload? payload) =>
        {
            var builder = new ValidationResultBuilder();

            if (payload is null)
            {
                builder.AddModelError(ValidationErrorCode.Required, "Request body must contain a product payload.");
                return ToProblem(builder.Build());
            }

            // Name validation
            if (string.IsNullOrWhiteSpace(payload.Name))
            {
                builder.AddError("name", ValidationErrorCode.Required, "Product name is required.");
            }
            else if (payload.Name.Length > 100)
            {
                builder.AddError("name", ValidationErrorCode.MaxLength, "Product name must not exceed 100 characters.");
            }

            // Price validation
            if (payload.Price <= 0)
            {
                builder.AddError("price", ValidationErrorCode.OutOfRange, "Price must be greater than zero.");
            }
            else if (payload.Price > 100_000)
            {
                builder.AddError("price", ValidationErrorCode.OutOfRange, "Price must not exceed 100,000.");
            }

            // Category validation
            if (string.IsNullOrWhiteSpace(payload.Category))
            {
                builder.AddError("category", ValidationErrorCode.Required, "Category is required.");
            }
            else if (!IsValidCategory(payload.Category))
            {
                builder.AddError("category", ValidationErrorCode.InvalidFormat, $"'{payload.Category}' is not a recognized category. Valid categories: Electronics, Clothing, Home, Books, Sports.");
            }

            // SKU validation (pattern)
            if (!string.IsNullOrWhiteSpace(payload.Sku) && !IsValidSku(payload.Sku))
            {
                builder.AddError("sku", ValidationErrorCode.InvalidFormat, "SKU must match the pattern XXX-999999.");
            }

            // Tags validation
            if (payload.Tags is { Length: > 5 })
            {
                builder.AddError("tags", ValidationErrorCode.MaxLength, "At most 5 tags are allowed.");
            }

            var result = builder.Build();

            return result.IsValid
                ? Results.Ok(new { isValid = true, message = $"Product '{payload.Name}' is valid." })
                : ToProblem(result);
        });

        group.MapGet("/error-codes", () => Results.Ok(new
        {
            description = "Standard error codes used by HexGuard.ValidationContracts.",
            codes = new[]
            {
                ValidationErrorCode.Required,
                ValidationErrorCode.InvalidFormat,
                ValidationErrorCode.OutOfRange,
                ValidationErrorCode.Duplicate,
                ValidationErrorCode.Mismatch,
                ValidationErrorCode.NotFound,
                ValidationErrorCode.Conflict,
                ValidationErrorCode.MaxLength,
                ValidationErrorCode.MinLength,
                ValidationErrorCode.ProhibitedValue,
                ValidationErrorCode.BusinessRule,
            },
        }));

        return endpoints;
    }

    private static IResult ToProblem(ValidationResult result) =>
        result.ToProblemResult(
            statusCode: 400,
            detail: "The request payload failed validation. See the 'errors' extension for details.",
            instance: "/api/validation-contracts/validate");

    private static bool IsValidCategory(string category) => category switch
    {
        "Electronics" or "Clothing" or "Home" or "Books" or "Sports" => true,
        _ => false,
    };

    private static bool IsValidSku(string sku) =>
        sku.Length >= 7 && sku.Length <= 11 &&
        sku[..3].All(char.IsAsciiLetterUpper) &&
        sku[3] == '-' &&
        sku[4..].All(char.IsDigit);
}

/// <summary>Sample product creation payload for validation demo.</summary>
internal sealed record ProductPayload
{
    public string? Name { get; init; }
    public decimal Price { get; init; }
    public string? Category { get; init; }
    public string? Sku { get; init; }
    public string[]? Tags { get; init; }
}
