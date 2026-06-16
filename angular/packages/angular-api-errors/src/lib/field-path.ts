/**
 * Static helpers for constructing and manipulating dot-separated field paths.
 * Mirrors the .NET `HexGuard.ValidationContracts.FieldPath` helpers.
 */
export abstract class FieldPath {
  /** Empty root path, used for model-level errors. */
  static readonly Root = '';

  /**
   * Creates a child path by appending a segment to the parent path.
   * @example `FieldPath.child('address', 'city')` → `"address.city"`
   */
  static child(parent: string, child: string): string {
    return parent.length === 0 ? child : `${parent}.${child}`;
  }

  /**
   * Creates a path for an indexed collection element.
   * @example `FieldPath.index('items', 0)` → `"items.0"`
   */
  static index(parent: string, index: number): string {
    return `${parent}.${index}`;
  }

  /**
   * Creates a child path under an indexed element.
   * @example `FieldPath.indexChild('items', 0, 'name')` → `"items.0.name"`
   */
  static indexChild(parent: string, index: number, child: string): string {
    return FieldPath.index(parent, index).length === 0
      ? child
      : `${FieldPath.index(parent, index)}.${child}`;
  }

  /**
   * Returns the parent path (everything before the last dot), or `Root` if there is no parent.
   * @example `FieldPath.getParent('address.city')` → `"address"`
   */
  static getParent(path: string): string {
    if (path.length === 0) return FieldPath.Root;
    const lastDot = path.lastIndexOf('.');
    return lastDot < 0 ? FieldPath.Root : path.slice(0, lastDot);
  }

  /**
   * Returns the last segment of the path (everything after the last dot), or the full path if there is no dot.
   * @example `FieldPath.getLeaf('address.city')` → `"city"`
   */
  static getLeaf(path: string): string {
    if (path.length === 0) return FieldPath.Root;
    const lastDot = path.lastIndexOf('.');
    return lastDot < 0 ? path : path.slice(lastDot + 1);
  }
}
