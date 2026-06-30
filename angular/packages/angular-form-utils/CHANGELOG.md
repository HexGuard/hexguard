# Changelog

## 0.2.0

- Added `aggregateFormErrors()` — recursive form-tree error collection
- Added `asyncFieldValidator()` — typed wrapper for promise-based async validation
- Added `injectFormArrayDirtyState()` — index-based dirty state tracking for FormArray items
- Added `arrayToggleItem()`, `moveArrayItem()`, `syncArrayValues()` — FormArray manipulation helpers
- Added `controlSignal()` — typed Signal from a form control value at a dotted path
- Added `isControlInvalid()` — touched && invalid shorthand
- Added `formDiff()` — deep partial diff between two form value snapshots
- Added `formStatusSignal()` — reactive Signal tracking form status (VALID/INVALID/PENDING/DISABLED)
- Added `formSubmitHandler()` — standardized form submit handler with mark-all-touched + validation
- Added `IsInvalidPipe` / `FormErrorPipe` — template pipes for validation display
- Added `ShowFormErrorDirective` — structural directive for touched && invalid conditional display
- Updated demo with sections for all new APIs
- Updated documentation and catalog

## 0.1.0

- Initial release.
