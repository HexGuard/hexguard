import { ApiErrorCode } from './api-error-codes';

describe('ApiErrorCode', () => {
  it('contains Required', () => {
    expect(ApiErrorCode.Required).toBe('Required');
  });

  it('contains InvalidFormat', () => {
    expect(ApiErrorCode.InvalidFormat).toBe('InvalidFormat');
  });

  it('contains BusinessRule', () => {
    expect(ApiErrorCode.BusinessRule).toBe('BusinessRule');
  });

  it('contains all expected codes', () => {
    const codes = Object.values(ApiErrorCode);
    expect(codes).toContain('Required');
    expect(codes).toContain('InvalidFormat');
    expect(codes).toContain('OutOfRange');
    expect(codes).toContain('Duplicate');
    expect(codes).toContain('NotFound');
    expect(codes).toContain('Conflict');
    expect(codes).toContain('MaxLength');
    expect(codes).toContain('MinLength');
    expect(codes).toContain('BusinessRule');
  });
});
