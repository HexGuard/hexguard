/**
 * IAB TCF v2.2 purpose definitions and constants.
 *
 * See: https://iabeurope.eu/iab-europe-transparency-consent-framework-policies/
 */

/** The 10 standard IAB TCF purposes (v2.2). */
export interface IabPurpose {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export const IAB_PURPOSES: readonly IabPurpose[] = [
  { id: 1,  name: 'Store and/or access information on a device',           description: 'Cookies, device identifiers, or other information can be stored or accessed on your device for the purposes presented.' },
  { id: 2,  name: 'Select basic ads',                                       description: 'Ads can be shown to you based on the content you are viewing, the app you are using, your approximate location, or your device type.' },
  { id: 3,  name: 'Create a personalised ads profile',                      description: 'A profile can be built about you and your interests to show you personalised ads that are relevant to you.' },
  { id: 4,  name: 'Select personalised ads',                                description: 'Personalised ads can be shown to you based on a profile about you.' },
  { id: 5,  name: 'Create a personalised content profile',                  description: 'A profile can be built about you and your interests to show you personalised content that is relevant to you.' },
  { id: 6,  name: 'Select personalised content',                            description: 'Personalised content can be shown to you based on a profile about you.' },
  { id: 7,  name: 'Measure ad performance',                                 description: 'The performance of ads you have seen or interacted with can be measured to help improve ads and the advertising experience.' },
  { id: 8,  name: 'Measure content performance',                            description: 'The performance of content you have seen or interacted with can be measured to help improve content and the content experience.' },
  { id: 9,  name: 'Apply market research to generate audience insights',    description: 'Market research can be used to learn more about the audiences who visit sites/apps and view ads.' },
  { id: 10, name: 'Develop and improve products',                           description: 'Your data can be used to improve existing systems and software, and to develop new products.' },
];

/** The 2 IAB special features (require opt-in). */
export interface IabSpecialFeature {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export const IAB_SPECIAL_FEATURES: readonly IabSpecialFeature[] = [
  { id: 1, name: 'Use precise geolocation data',          description: 'Your precise location can be used for ads or content personalisation.' },
  { id: 2, name: 'Actively scan device characteristics',  description: 'Your device can be actively scanned for identification purposes.' },
];

/** TCF policy version for v2.2. */
export const TCF_POLICY_VERSION = 4;

/** Current TC string version. */
export const TC_STRING_VERSION = 2;

/** Cookie name for the standard IAB TC string. */
export const EU_CONSENT_COOKIE = 'euconsent-v2';

/** Default IAB Global Vendor List URL. */
export const DEFAULT_GVL_URL = 'https://vendor-list.consensu.org/v2/vendor-list.json';

/** Bit count for the purpose consent bitfield (TCF v2 defines 24 bits, 10 used). */
export const PURPOSE_BITS = 24;

/** Bit count for special feature opt-in bitfield. */
export const SPECIAL_FEATURE_BITS = 12;

/** Default consent language. */
export const DEFAULT_CONSENT_LANGUAGE = 'EN';
