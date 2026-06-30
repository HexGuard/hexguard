import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIcons, injectIcons } from './icon-registry';

const SAMPLE_ICONS = {
  home: {
    svgContent: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
    viewBox: '0 0 24 24',
  },
  settings: {
    svgContent: '<path d="M19 14v3h-2v-3h-2v-2h2V9h2v3h2v2h-2zM5 14v3H3v-3H1v-2h2V9h2v3h2v2H5z"/>',
    viewBox: '0 0 24 24',
    aliases: ['gear', 'cog'],
  },
};

@Component({
  standalone: true,
  providers: [provideIcons({ icons: SAMPLE_ICONS, defaultSize: '2rem' })],
  template: '',
})
class TestHostComponent {
  readonly icons = injectIcons();
}

describe('IconRegistry', () => {
  it('resolves icons by name', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const home = host.icons.get('home');
    expect(home()).not.toBeNull();
    expect(home()!.svgContent).toContain('M10 20');
    expect(home()!.viewBox).toBe('0 0 24 24');
    expect(home()!.size).toBe('2rem');
    expect(home()!.color).toBe('currentColor');
  });

  it('resolves icons by alias', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const gear = host.icons.get('gear');
    expect(gear()).not.toBeNull();
    expect(gear()!.svgContent).toContain('M19 14');
  });

  it('resolves icons by secondary alias', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const cog = host.icons.get('cog');
    expect(cog()).not.toBeNull();
    expect(cog()!.svgContent).toContain('M19 14');
  });

  it('returns null signal for unknown icons', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const unknown = host.icons.get('nonexistent');
    expect(unknown()).toBeNull();
  });

  it('has() returns true for registered icons', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    expect(host.icons.has('home')).toBe(true);
    expect(host.icons.has('settings')).toBe(true);
    expect(host.icons.has('gear')).toBe(true);
    expect(host.icons.has('nonexistent')).toBe(false);
  });

  it('names() returns all canonical icon names', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const names = host.icons.names();
    expect(names).toContain('home');
    expect(names).toContain('settings');
    expect(names).not.toContain('gear'); // aliases excluded
  });

  it('default size is 1.5rem when not configured', () => {
    @Component({
      standalone: true,
      providers: [
        provideIcons({ icons: { test: { svgContent: '<circle/>', viewBox: '0 0 10 10' } } }),
      ],
      template: '',
    })
    class DefaultSizeHost {
      readonly icons = injectIcons();
    }

    const fixture = TestBed.createComponent(DefaultSizeHost);
    const host = fixture.componentInstance;
    expect(host.icons.get('test')()!.size).toBe('1.5rem');
  });

  it('get() returns the same signal for repeated calls (cached)', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;

    const a = host.icons.get('home');
    const b = host.icons.get('home');
    expect(a).toBe(b);
  });
});
