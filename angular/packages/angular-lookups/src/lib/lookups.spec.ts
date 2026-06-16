import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LookupCatalogValidationError } from './errors';
import { HexguardLookupLabelPipe } from './hexguard-lookup-label.pipe';
import { provideHexGuardLookups } from './lookup-context';
import { injectLookups } from './lookups';
import type { LookupCatalog } from './types';

describe('provideHexGuardLookups', () => {
  it('uses the initial catalog without forcing a first load', async () => {
    const initialCatalog = createCatalog('catalog-v1', 'Hardware');
    const loader = vi.fn(async () => createCatalog('catalog-v2', 'Devices'));

    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: loader,
          initialCatalog,
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());

    expect(lookups.state.hasLoaded()).toBe(true);
    expect(lookups.version()).toBe('catalog-v1');
    expect(lookups.label('categories', 'hardware')).toBe('Hardware');

    await expect(lookups.ensureLoaded()).resolves.toBe(initialCatalog);
    expect(loader).not.toHaveBeenCalled();
  });

  it('loads catalogs and updates signal-backed label resolution', async () => {
    const loader = vi
      .fn<() => Promise<LookupCatalog>>()
      .mockResolvedValueOnce(createCatalog('catalog-v1', 'Hardware'))
      .mockResolvedValueOnce(createCatalog('catalog-v2', 'Hardware and Devices'));

    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: loader,
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());
    const label = lookups.labelSignal('categories', 'hardware');

    expect(label()).toBeNull();

    await lookups.ensureLoaded();

    expect(lookups.version()).toBe('catalog-v1');
    expect(label()).toBe('Hardware');

    await lookups.reload();

    expect(loader).toHaveBeenCalledTimes(2);
    expect(lookups.version()).toBe('catalog-v2');
    expect(label()).toBe('Hardware and Devices');
  });

  it('surfaces validation errors for malformed catalogs', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: async () => ({
            metadata: {
              version: 'catalog-v1',
              generatedAtUtc: '2026-06-15T00:00:00Z',
            },
            collections: [
              {
                key: 'categories',
                items: [{ key: 'hardware', label: 'Hardware' }],
              },
              {
                key: 'categories',
                items: [{ key: 'software', label: 'Software' }],
              },
            ],
          }),
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());

    await expect(lookups.ensureLoaded()).rejects.toBeInstanceOf(LookupCatalogValidationError);
    expect(lookups.state.isError()).toBe(true);
    expect(lookups.state.error()).toBeInstanceOf(LookupCatalogValidationError);
  });

  it('resolves collection, options, and items through signal-backed helpers', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: async () => createCatalog('catalog-v1', 'Hardware'),
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());
    const collectionSig = lookups.collectionSignal('categories');
    const optionsSig = lookups.optionsSignal('categories');
    const hasHardwareSig = lookups.hasItemSignal('categories', 'hardware');

    expect(collectionSig()).toBeNull();
    expect(optionsSig()).toHaveLength(0);
    expect(hasHardwareSig()).toBe(false);
    expect(lookups.hasItem('categories', 'hardware')).toBe(false);
    expect(lookups.hasItem('categories', 'missing')).toBe(false);

    await lookups.ensureLoaded();

    expect(collectionSig()).not.toBeNull();
    expect(collectionSig()!.key).toBe('categories');
    expect(collectionSig()!.items).toHaveLength(2);
    expect(optionsSig()).toHaveLength(2);
    expect(optionsSig()[0].label).toBe('Hardware');
    expect(lookups.collection('missing')).toBeNull();
    expect(lookups.options('missing')).toHaveLength(0);
    expect(hasHardwareSig()).toBe(true);
    expect(lookups.hasItem('categories', 'hardware')).toBe(true);
    expect(lookups.hasItem('categories', 'missing')).toBe(false);
    expect(lookups.hasItem('suppliers', 'hardware')).toBe(false);
  });

  it('exposes metadata and version signals from the loaded catalog', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: async () => createCatalog('catalog-v1', 'Hardware'),
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());

    expect(lookups.metadata()).toBeNull();
    expect(lookups.version()).toBeNull();

    await lookups.ensureLoaded();

    expect(lookups.metadata()).not.toBeNull();
    expect(lookups.metadata()!.version).toBe('catalog-v1');
    expect(lookups.version()).toBe('catalog-v1');
  });

  it('maps transport errors through the mapError callback', async () => {
    class TransportError extends Error {
      override readonly name = 'TransportError';
    }

    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: async () => {
            throw new TransportError('Network failure');
          },
          mapError: (error) =>
            error instanceof TransportError ? 'MAPPED: ' + error.message : String(error),
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());

    await expect(lookups.ensureLoaded()).rejects.toBe('MAPPED: Network failure');
    expect(lookups.state.isError()).toBe(true);
    expect(lookups.state.error()).toBe('MAPPED: Network failure');
  });

  it('resets to idle and clears metadata after invalidate', async () => {
    const loader = vi
      .fn<() => Promise<LookupCatalog>>()
      .mockResolvedValue(createCatalog('catalog-v1', 'Hardware'));

    TestBed.configureTestingModule({
      providers: [
        provideHexGuardLookups({
          load: loader,
        }),
      ],
    });

    const lookups = TestBed.runInInjectionContext(() => injectLookups());

    await lookups.ensureLoaded();
    expect(lookups.version()).toBe('catalog-v1');
    expect(loader).toHaveBeenCalledTimes(1);

    lookups.invalidate();

    expect(lookups.state.isIdle()).toBe(true);
    expect(lookups.version()).toBeNull();
    expect(lookups.hasItem('categories', 'hardware')).toBe(false);

    await lookups.ensureLoaded();
    expect(lookups.version()).toBe('catalog-v1');
    expect(loader).toHaveBeenCalledTimes(2);
  });
});

describe('HexguardLookupLabelPipe', () => {
  it('renders the resolved label and falls back for missing keys', () => {
    const catalog = createCatalog('catalog-v1', 'Hardware');

    TestBed.configureTestingModule({
      imports: [LookupLabelPipeHostComponent],
      providers: [
        provideHexGuardLookups({
          load: async () => catalog,
          initialCatalog: catalog,
        }),
      ],
    });

    const fixture = TestBed.createComponent(LookupLabelPipeHostComponent);
    const host = fixture.componentInstance;

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Hardware');

    host.itemKey.set('missing');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Unknown');
  });
});

@Component({
  standalone: true,
  imports: [HexguardLookupLabelPipe],
  template: `{{ itemKey() | hexguardLookupLabel: 'categories': 'Unknown' }}`,
})
class LookupLabelPipeHostComponent {
  readonly itemKey = signal('hardware');
}

function createCatalog(version: string, hardwareLabel: string): LookupCatalog {
  return {
    metadata: {
      version,
      generatedAtUtc: '2026-06-15T00:00:00Z',
    },
    collections: [
      {
        key: 'categories',
        revision: 'categories-r1',
        items: [
          {
            key: 'hardware',
            label: hardwareLabel,
          },
          {
            key: 'software',
            label: 'Software',
          },
        ],
      },
      {
        key: 'suppliers',
        revision: 'suppliers-r1',
        items: [
          {
            key: 'contoso',
            label: 'Contoso Industrial',
          },
        ],
      },
    ],
  };
}