---
id: feature-media-library-cross-stack
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.MediaLibrary + @hexguard/angular-media-library'
---

# Media Library / DAM Cross-Stack Pair

## Summary

Server-side digital asset management + client-side media browsing and upload state.

### .NET (`HexGuard.MediaLibrary`)
Asset upload with metadata extraction, folder organization, tagging, search, thumbnail generation, versioning, CDN URL transforms, usage tracking.

### Angular (`@hexguard/angular-media-library`)
Media grid browsing, folder navigation, search/filter, upload with progress, multi-select, bulk operations, tag management, drag-and-drop upload zone state.

### Integration Contract
```typescript
interface MediaLibraryEndpoints {
  'POST /api/media/upload': { body: FormData; response: MediaAsset };
  'GET /api/media': { params: MediaQuery; response: MediaAsset[] };
  'GET /api/media/{id}': { response: MediaAsset };
  'GET /api/media/{id}/thumbnail': { params: { width?: number; height?: number }; response: Blob };
  'PUT /api/media/{id}': { body: UpdateAssetRequest; response: MediaAsset };
  'DELETE /api/media': { body: { ids: string[] }; response: void };
  'POST /api/media/move': { body: { ids: string[]; folderId: string }; response: MediaAsset[] };
  'GET /api/media/folders': { params: { parentId?: string }; response: MediaFolder[] };
  'POST /api/media/folders': { body: CreateFolderRequest; response: MediaFolder };
  'GET /api/media/{id}/usage': { response: AssetUsage[] };
}
```
