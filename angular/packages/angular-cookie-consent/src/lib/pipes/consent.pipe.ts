import { Pipe, PipeTransform, inject } from '@angular/core';
import { injectConsentManager } from '@hexguard/angular-consent-manager';

/**
 * Template pipe that checks whether a consent category is granted.
 *
 * @example
 * ```html
 * @if (('analytics' | hexConsent)) {
 *   <img src="analytics-pixel.png" />
 * }
 * ```
 */
@Pipe({
  standalone: true,
  name: 'hexConsent',
  pure: false,
})
export class ConsentPipe implements PipeTransform {
  private readonly consent = injectConsentManager();

  transform(categoryId: string): boolean {
    return this.consent.state()[categoryId] === true;
  }
}
