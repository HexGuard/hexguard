export interface ThrowScenario {
  readonly id: string;
  readonly label: string;
  readonly errorFactory: () => Error;
}

export const THROW_SCENARIOS: readonly ThrowScenario[] = [
  {
    id: 'simple',
    label: 'Throw simple error',
    errorFactory: () => new Error('Something went wrong in this component.'),
  },
  {
    id: 'async',
    label: 'Throw async error',
    errorFactory: () => {
      const error = new Error('Async operation failed.');
      setTimeout(() => { throw error; }, 100);
      return error;
    },
  },
] as const;
