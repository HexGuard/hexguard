import {
  buildNavigationQuery,
  parseUrlState,
  serializeUrlState,
  type QueryParamSource,
} from './router-sync';
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
});
