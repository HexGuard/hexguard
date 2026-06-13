import {
  arrayParam,
  booleanParam,
  dateIsoParam,
  enumParam,
  nullableParam,
  numberParam,
  stringParam,
} from './param-codecs';

describe('param codecs', () => {
  it('parses and serializes strings', () => {
    const codec = stringParam('');

    expect(codec.parse(null)).toEqual({ ok: true, value: '' });
    expect(codec.parse('orders')).toEqual({ ok: true, value: 'orders' });
    expect(codec.serialize('orders')).toBe('orders');
  });

  it('parses and serializes numbers', () => {
    const codec = numberParam(1);

    expect(codec.parse('42')).toEqual({ ok: true, value: 42 });
    expect(codec.serialize(0)).toBe('0');
  });

  it('falls back for invalid numbers, including blanks', () => {
    const codec = numberParam(7);

    expect(codec.parse('oops')).toEqual({
      ok: false,
      reason: 'Expected a finite number but received "oops".',
      fallback: 7,
    });
    expect(codec.parse('')).toEqual({
      ok: false,
      reason: 'Expected a non-empty numeric value.',
      fallback: 7,
    });
  });

  it('parses and serializes booleans', () => {
    const codec = booleanParam(false);

    expect(codec.parse('true')).toEqual({ ok: true, value: true });
    expect(codec.parse('0')).toEqual({ ok: true, value: false });
    expect(codec.serialize(true)).toBe('true');
    expect(codec.serialize(false)).toBe('false');
  });

  it('validates enum values', () => {
    const codec = enumParam(['open', 'closed', 'archived'] as const, 'open');

    expect(codec.parse('closed')).toEqual({ ok: true, value: 'closed' });
    expect(codec.parse('unknown')).toEqual({
      ok: false,
      reason: 'Expected one of "open", "closed", "archived".',
      fallback: 'open',
    });
  });

  it('supports arrays with repeated query params', () => {
    const codec = arrayParam(stringParam());

    expect(codec.parse(['red', 'blue'])).toEqual({ ok: true, value: ['red', 'blue'] });
    expect(codec.serialize(['red', 'blue'])).toEqual(['red', 'blue']);
    expect(codec.serialize([])).toBeNull();
  });

  it('supports nullable values', () => {
    const codec = nullableParam(stringParam(''));

    expect(codec.parse(null)).toEqual({ ok: true, value: null });
    expect(codec.parse('report-17')).toEqual({ ok: true, value: 'report-17' });
    expect(codec.serialize(null)).toBeNull();
  });

  it('parses and serializes ISO dates', () => {
    const codec = dateIsoParam();
    const parsed = codec.parse('2026-06-13T15:30:00.000Z');

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      throw new Error('Expected the ISO date to parse successfully.');
    }

    expect(parsed.value).not.toBeNull();

    expect((parsed.value as Date).toISOString()).toBe('2026-06-13T15:30:00.000Z');
    expect(codec.serialize(new Date('2026-06-13T15:30:00.000Z'))).toBe('2026-06-13T15:30:00.000Z');
    expect(codec.parse('not-a-date')).toEqual({
      ok: false,
      reason: 'Expected a valid ISO 8601 date string but received "not-a-date".',
      fallback: null,
    });
  });
});
