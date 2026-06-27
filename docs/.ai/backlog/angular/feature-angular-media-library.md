---
id: feature-angular-media-library
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-media-library'
---

# @hexguard/angular-media-library

## Summary

Headless media library / DAM browsing state — browse, search, filter, upload, and manage digital assets. For CMS media pickers, brand asset management, and file galleries.

## Goals

- Media grid/list browsing with thumbnails
- Folder/category navigation
- Search by filename, tags, metadata
- Filter by type (image, video, document, audio), date, size
- Upload with progress tracking
- Media detail with metadata (dimensions, size, format, EXIF)
- Selection state for multi-select and bulk operations
- Drag-and-drop upload zone state
- Tag management per asset
- Usage tracking (where is this asset used?)

## Non-Goals

- No actual image processing or thumbnail generation
- No CDN URL management
- No rendered gallery UI

## Proposed Public API

```typescript
export function injectMediaLibrary(config: {
  endpoint: string;
  acceptedTypes?: MediaType[];
}): {
  readonly assets: Signal<MediaAsset[]>;
  readonly selected: Signal<MediaAsset[]>;
  readonly selectedAsset: Signal<MediaAsset | null>;
  readonly folders: Signal<MediaFolder[]>;
  readonly currentFolder: Signal<MediaFolder | null>;
  readonly filters: Signal<MediaFilters>;
  readonly uploads: Signal<UploadProgress[]>;
  readonly isLoading/hasMore: Signal<boolean>;
  // Navigation
  navigateToFolder(folderId: string | null): void;
  setFilters(f: Partial<MediaFilters>): void;
  search(query: string): void;
  loadMore(): Promise<void>;
  // Actions
  select(assetId: string): void;
  selectRange(fromId: string, toId: string): void;
  deselectAll(): void;
  upload(files: File[]): void;
  cancelUpload(uploadId: string): void;
  updateTags(assetId: string, tags: string[]): Promise<void>;
  deleteAssets(assetIds: string[]): Promise<void>;
  moveAssets(assetIds: string[], folderId: string): Promise<void>;
};

export interface MediaAsset {
  id: string; filename: string; type: MediaType; sizeBytes: number;
  url: string; thumbnailUrl: string; width?: number; height?: number;
  duration?: number; tags: string[]; folderId?: string; uploadedAt: Date;
}
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export interface MediaFolder { id: string; name: string; parentId?: string; assetCount: number; }
export interface MediaFilters { type?: MediaType; tags?: string[]; dateFrom?: Date; dateTo?: Date; }
export interface UploadProgress { id: string; filename: string; progress: number; status: 'uploading' | 'processing' | 'complete' | 'error'; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-media-library/`.
2. Implement browsing, folder navigation, search, upload, selection with signals.
3. Add filter and bulk operations.
4. Add tests. Register in workspace.
