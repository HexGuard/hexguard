import { detectRegion } from './region-detection';

describe('detectRegion', () => {
  it('should return null when mode is disabled', () => {
    expect(detectRegion({ mode: 'disabled' })).toBeNull();
  });

  it('should detect a region from browser timezone', () => {
    const region = detectRegion({ mode: 'browser-timezone' });
    expect(region).not.toBeNull();
    expect(region!.length).toBe(2);
  });

  it('should use custom detector when mode is geo-api', () => {
    const region = detectRegion({
      mode: 'geo-api',
      customDetector: () => 'US',
    });
    expect(region).toBe('US');
  });

  it('should return null when custom detector fails', () => {
    const region = detectRegion({
      mode: 'geo-api',
      customDetector: () => { throw new Error('geo error'); },
    });
    expect(region).toBeNull();
  });

  it('should return null for unknown timezone', () => {
    const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = () =>
      ({ timeZone: 'Unknown/Zone' }) as Intl.ResolvedDateTimeFormatOptions;
    const region = detectRegion({ mode: 'browser-timezone' });
    Intl.DateTimeFormat.prototype.resolvedOptions = orig;
    expect(region).toBeNull();
  });
});
