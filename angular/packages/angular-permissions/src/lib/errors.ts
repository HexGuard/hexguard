/** Error used when a permissions helper is configured without a requirement object. */
export class PermissionRequirementMissingError extends Error {
  constructor() {
    super('A permission requirement must be provided.');
    this.name = 'PermissionRequirementMissingError';
  }
}
