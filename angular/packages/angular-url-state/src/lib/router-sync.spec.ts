import {
  buildNavigationQuery,
  parseUrlState,
  serializeUrlState,
  type QueryParamSource,
} from './router-sync';
import { resolveUrlStateSchema } from './schema';
import { arrayParam, numberParam, stringParam } from './param-codecs';

function createQueryParamSource(queryString: string): QueryParamSource {
  const params = new URLSearchParams(queryString);
  const keys = [...new Set(Array.from(params.keys()))];

  return {
    keys,
    getAll(key: string) {
      return params.getAll(key);
    },
  };
}

describe('router sync helpers', () => {
  const schema = {
    search: stringParam(''),
    page: numberParam(1),
    tags: arrayParam(stringParam()),
  };
  const remappedSchema = {
    search: { codec: stringParam(''), queryKey: 'q' },
    page: { codec: numberParam(1), queryKey: 'p' },
    tags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
  };

  it('parses state and records invalid values', () => {
    const parsed = parseUrlState(schema, (key) => {
      switch (key) {
        case 'search':
          return 'boots';
        case 'page':
          return 'oops';
        case 'tags':
          return ['red', 'blue'];
        default:
          return null;
      }
    });

    expect(parsed.state).toEqual({
      search: 'boots',
      page: 1,
      tags: ['red', 'blue'],
    });
    expect(parsed.invalid).toEqual([
      {
        key: 'page',
        queryKey: 'page',
        raw: 'oops',
        reason: 'Expected a finite number but received "oops".',
        fallback: 1,
      },
    ]);
  });

  it('omits defaults from the URL and keeps schema order deterministic', () => {
    const serialized = serializeUrlState(
      schema,
      {
        search: 'boots',
        page: 1,
        tags: ['red', 'blue'],
      },
      { removeDefaultsFromUrl: true },
    );

    expect(serialized.queryParams).toEqual({
      search: 'boots',
      tags: ['red', 'blue'],
    });
    expect(serialized.queryString).toBe('search=boots&tags=red&tags=blue');
  });

  it('merges unmanaged params deterministically', () => {
    const current = createQueryParamSource('z=9&other=a&other=b');
    const managed = serializeUrlState(
      schema,
      {
        search: 'query',
        page: 2,
        tags: [],
      },
      { removeDefaultsFromUrl: true },
    );

    const merged = buildNavigationQuery(['search', 'page', 'tags'], current, managed);

    expect(merged.queryString).toBe('search=query&page=2&other=a&other=b&z=9');
    expect(merged.queryParams).toEqual({
      search: 'query',
      page: '2',
      other: ['a', 'b'],
      z: '9',
    });
  });

  it('parses remapped query keys and records the incoming query key in invalid diagnostics', () => {
    const resolved = resolveUrlStateSchema(remappedSchema);
    const parsed = parseUrlState<typeof remappedSchema>(
      remappedSchema,
      (key) => {
        switch (key) {
          case 'q':
            return 'boots';
          case 'p':
            return 'oops';
          case 'tag':
            return ['red', 'blue'];
          default:
            return null;
        }
      },
      resolved,
    );

    expect(parsed.state).toEqual({
      search: 'boots',
      page: 1,
      tags: ['red', 'blue'],
    });
    expect(parsed.invalid).toEqual([
      {
        key: 'page',
        queryKey: 'p',
        raw: 'oops',
        reason: 'Expected a finite number but received "oops".',
        fallback: 1,
      },
    ]);
  });

  it('serializes remapped query keys in schema property order', () => {
    const resolved = resolveUrlStateSchema(remappedSchema);
    const serialized = serializeUrlState(
      remappedSchema,
      {
        search: 'boots',
        page: 2,
        tags: ['red', 'blue'],
      },
      { removeDefaultsFromUrl: true },
      resolved,
    );

    expect(serialized.queryParams).toEqual({
      q: 'boots',
      p: '2',
      tag: ['red', 'blue'],
    });
    expect(serialized.queryString).toBe('q=boots&p=2&tag=red&tag=blue');
  });

  it('rejects duplicate remapped query keys', () => {
    expect(() =>
      resolveUrlStateSchema({
        search: { codec: stringParam(''), queryKey: 'q' },
        page: { codec: numberParam(1), queryKey: 'q' },
      }),
    ).toThrowError('Duplicate queryKey "q" configured for schema keys "search" and "page".');
  });
});
