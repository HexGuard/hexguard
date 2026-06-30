import { ConsentScriptLoader } from './consent-script-loader';
import type { ConsentManagedScript } from './types';

describe('ConsentScriptLoader', () => {
  let loader: ConsentScriptLoader;
  const createdScripts: HTMLScriptElement[] = [];

  beforeEach(() => {
    loader = new ConsentScriptLoader();
    createdScripts.length = 0;

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      const el = originalCreateElement(tagName, options);
      if (tagName === 'script') {
        createdScripts.push(el as HTMLScriptElement);
      }
      return el;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const necessaryScript: ConsentManagedScript = {
    id: 'necessary-js',
    src: 'https://example.com/necessary.js',
    category: 'necessary',
    strategy: 'load_always',
  };

  const analyticsScript: ConsentManagedScript = {
    id: 'analytics-js',
    src: 'https://example.com/analytics.js',
    category: 'analytics',
    strategy: 'block_until_consent',
  };

  const marketingScript: ConsentManagedScript = {
    id: 'marketing-js',
    src: 'https://example.com/marketing.js',
    category: 'marketing',
    strategy: 'block_until_consent',
    attributes: { 'data-test': 'true' },
  };

  it('should load load_always scripts immediately', () => {
    loader.register([necessaryScript]);
    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toBe(necessaryScript.src);
  });

  it('should not load block_until_consent scripts immediately', () => {
    loader.register([analyticsScript]);
    expect(createdScripts.length).toBe(0);
  });

  it('should load block_until_consent scripts when consent is granted', () => {
    loader.register([analyticsScript]);
    expect(createdScripts.length).toBe(0);

    loader.onConsentChange({ analytics: true });
    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toBe(analyticsScript.src);
  });

  it('should not load scripts when consent is denied', () => {
    loader.register([analyticsScript]);
    loader.onConsentChange({ analytics: false });
    expect(createdScripts.length).toBe(0);
  });

  it('should apply custom attributes to script elements', () => {
    loader.register([marketingScript]);
    loader.onConsentChange({ marketing: true });
    expect(createdScripts[0].getAttribute('data-test')).toBe('true');
  });

  it('should return pending scripts', () => {
    loader.register([analyticsScript, marketingScript]);
    const pending = loader.getPendingScripts();
    expect(pending.length).toBe(2);
    expect(pending.map(s => s.id)).toEqual(['analytics-js', 'marketing-js']);
  });

  it('should not load the same script twice', () => {
    loader.register([analyticsScript]);
    loader.onConsentChange({ analytics: true });
    loader.onConsentChange({ analytics: true });
    expect(createdScripts.length).toBe(1);
  });

  it('should load scripts by category when consent changes', () => {
    loader.register([analyticsScript, marketingScript]);
    loader.onConsentChange({ analytics: true, marketing: false });
    expect(createdScripts.length).toBe(1);
    expect(createdScripts[0].src).toBe(analyticsScript.src);
  });
});
