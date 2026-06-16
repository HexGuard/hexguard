import { FieldPath } from './field-path';

describe('FieldPath', () => {
  describe('Root', () => {
    it('returns empty string', () => {
      expect(FieldPath.Root).toBe('');
    });
  });

  describe('child', () => {
    it('appends segment', () => {
      expect(FieldPath.child('address', 'city')).toBe('address.city');
    });

    it('returns child only when parent is root', () => {
      expect(FieldPath.child('', 'name')).toBe('name');
    });
  });

  describe('index', () => {
    it('creates numeric path', () => {
      expect(FieldPath.index('items', 0)).toBe('items.0');
      expect(FieldPath.index('items', 1)).toBe('items.1');
    });
  });

  describe('indexChild', () => {
    it('creates nested collection path', () => {
      expect(FieldPath.indexChild('items', 0, 'name')).toBe('items.0.name');
      expect(FieldPath.indexChild('items', 1, 'price')).toBe('items.1.price');
    });
  });

  describe('getParent', () => {
    it('returns parent path', () => {
      expect(FieldPath.getParent('address.city')).toBe('address');
      expect(FieldPath.getParent('items.0.name')).toBe('items.0');
    });

    it('returns root for top-level field', () => {
      expect(FieldPath.getParent('name')).toBe('');
    });

    it('returns root for empty path', () => {
      expect(FieldPath.getParent('')).toBe('');
    });
  });

  describe('getLeaf', () => {
    it('returns last segment', () => {
      expect(FieldPath.getLeaf('address.city')).toBe('city');
      expect(FieldPath.getLeaf('items.0.name')).toBe('name');
    });

    it('returns full path for single segment', () => {
      expect(FieldPath.getLeaf('name')).toBe('name');
    });
  });
});
