---
id: feature-dotnet-assessment
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Assessment'
---

# HexGuard.Assessment

## Summary

Quiz and assessment engine for .NET — question management, exam delivery, answer grading, and result reporting. For learning platforms, certification exams, and diagnostic tools.

## Goals

- Question bank management with multiple types
- Quiz/exam definition with sections and question selection
- Timed exam delivery with auto-submit
- Answer collection and automatic grading
- Weighted scoring with partial credit
- Result generation with detailed breakdown
- Question randomization and pool selection
- Passing score configuration
- Exam retake policy enforcement

## Non-Goals

- No question authoring UI
- No proctoring or anti-cheat
- No adaptive testing

## Proposed Public API

```csharp
public interface IAssessmentService
{
    // Questions
    Task<Question> CreateQuestionAsync(CreateQuestionRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<Question>> GetQuestionsAsync(QuestionQuery query, CancellationToken ct = default);
    // Quizzes
    Task<Quiz> CreateQuizAsync(CreateQuizRequest request, CancellationToken ct = default);
    Task<Quiz?> GetQuizAsync(string quizId, CancellationToken ct = default);
    // Attempts
    Task<QuizAttempt> StartAttemptAsync(string userId, string quizId, CancellationToken ct = default);
    Task<QuizAttempt> SubmitAnswerAsync(string attemptId, string questionId, Answer answer, CancellationToken ct = default);
    Task<QuizResult> SubmitAttemptAsync(string attemptId, CancellationToken ct = default);
    Task<QuizAttempt?> GetAttemptAsync(string attemptId, CancellationToken ct = default);
    Task<IReadOnlyList<QuizResult>> GetResultsAsync(string userId, CancellationToken ct = default);
}

public sealed record CreateQuestionRequest(
    string Text,
    QuestionType Type,
    int Points,
    IReadOnlyList<QuestionOption>? Options = null,
    object? CorrectAnswer = null
);

public enum QuestionType { SingleChoice, MultipleChoice, TrueFalse, ShortAnswer, Matching }

public sealed record CreateQuizRequest(
    string Title,
    string? Description = null,
    int? TimeLimitSeconds = null,
    int PassingScore = 70,
    bool ShuffleQuestions = false,
    IReadOnlyList<QuizSection>? Sections = null,
    IReadOnlyList<string>? QuestionIds = null
);

public sealed record QuizResult(
    string AttemptId,
    string QuizTitle,
    int TotalPoints,
    int EarnedPoints,
    decimal PercentScore,
    bool Passed,
    int TimeTakenSeconds,
    DateTimeOffset CompletedAt,
    IReadOnlyList<QuestionResult> QuestionResults
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Assessment/` with `.csproj`.
2. Implement question bank, quiz definition, attempt tracking, auto-grading.
3. Add scoring engine, retake policy, result reporting.
4. Add xunit tests. Register in `HexGuard.slnx`.
