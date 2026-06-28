---
id: feature-angular-quiz
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/angular-quiz'
---

# @hexguard/angular-quiz

## Summary

Headless quiz/assessment state — question navigation, answer selection, timer, scoring, and result review. For learning platforms, certification exams, surveys, and diagnostic tools.

## Goals

- Question list with navigation (linear, free, section-based)
- Multiple question types (single choice, multiple choice, true/false, short answer, matching)
- Answer selection and review state
- Timer with auto-submit on expiry
- Scoring engine with weighted questions
- Section-based organization with section scores
- Result review with correct/incorrect indicators
- Quiz retake with randomized question order
- Progress tracking (answered, flagged, skipped)

## Non-Goals

- No rendered quiz UI
- No question authoring
- No proctoring

## Proposed Public API

```typescript
export function injectQuiz(config: {
  endpoint: string;
  quizId?: string;
}): {
  readonly quiz: Signal<Quiz | null>;
  readonly questions: Signal<QuizQuestion[]>;
  readonly currentQuestion: Signal<QuizQuestion | null>;
  readonly currentIndex: Signal<number>;
  readonly answers: Signal<Map<string, Answer>>;
  readonly progress: Signal<QuizProgress>;
  readonly timeRemaining: Signal<number>; // seconds
  readonly isTimeUp: Signal<boolean>;
  readonly result: Signal<QuizResult | null>;
  readonly isLoading/submitting: Signal<boolean>;
  // Navigation
  next(): void;
  previous(): void;
  goTo(index: number): void;
  readonly canGoNext: Signal<boolean>;
  readonly canGoPrevious: Signal<boolean>;
  // Answers
  selectAnswer(questionId: string, answer: Answer): void;
  clearAnswer(questionId: string): void;
  flagQuestion(questionId: string): void;
  readonly isComplete: Signal<boolean>;
  // Actions
  startQuiz(): Promise<void>;
  submitQuiz(): Promise<QuizResult>;
  reviewResults(): void; // enters review mode
  retakeQuiz(): Promise<void>;
  // Sections
  readonly sections: Signal<QuizSection[]>;
  readonly currentSection: Signal<QuizSection | null>;
  goToSection(sectionId: string): void;
};

export interface Quiz { id: string; title: string; description?: string; timeLimitSeconds?: number; passingScore: number; shuffleQuestions: boolean; sections: QuizSection[]; }
export interface QuizSection { id: string; title: string; description?: string; questionIds: string[]; }
export interface QuizQuestion { id: string; type: 'single' | 'multiple' | 'truefalse' | 'shortanswer' | 'matching'; text: string; options?: QuizOption[]; points: number; sectionId?: string; }
export interface QuizOption { id: string; text: string; isCorrect?: boolean; }
export type Answer = string | string[] | boolean | Record<string, string>; // varies by question type
export interface QuizProgress { total: number; answered: number; flagged: number; skipped: number; percentComplete: number; }
export interface QuizResult { totalPoints: number; earnedPoints: number; percentScore: number; passed: boolean; sectionResults: { sectionId: string; sectionName: string; points: number; earned: number }[]; questionResults: { questionId: string; correct: boolean; givenAnswer: Answer; correctAnswer: Answer; pointsEarned: number }[]; completedAt: Date; timeTakenSeconds: number; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-quiz/`.
2. Implement question navigation, answer management, timer, scoring, results with signals.
3. Add section support, retake, review mode.
4. Add tests. Register in workspace.
