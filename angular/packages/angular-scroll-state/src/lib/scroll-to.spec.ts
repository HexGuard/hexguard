import { scrollTo } from './scroll-to';

describe(scrollTo.name, () => {
  it('scrolls to y position', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    scrollTo({ y: 500 });
    expect(scrollSpy).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
  });

  it('scrolls to top by default', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    scrollTo({});
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('uses auto behavior when specified', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    scrollTo({ y: 100, behavior: 'auto' });
    expect(scrollSpy).toHaveBeenCalledWith({ top: 100, behavior: 'auto' });
  });
});
