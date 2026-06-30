/**
 * IAB TCF v2.2 TC string encoder.
 *
 * Encodes consent state into the standard IAB base64 TC string (core string).
 * See: https://github.com/InteractiveAdvertisingBureau/ConsentString-FP
 */

import {
  TC_STRING_VERSION,
  TCF_POLICY_VERSION,
  PURPOSE_BITS,
  SPECIAL_FEATURE_BITS,
  DEFAULT_CONSENT_LANGUAGE,
} from './tcf-constants';

/** Input data to encode a TC string. */
export interface TcStringInput {
  readonly cmpId: number;
  readonly cmpVersion: number;
  readonly consentScreen: number;
  readonly consentLanguage?: string;
  readonly vendorListVersion: number;
  readonly isServiceSpecific: boolean;
  readonly useNonStandardStacks: boolean;
  readonly specialFeatureOptIns: readonly number[];
  readonly purposeConsents: readonly number[];       // purpose IDs that are consented
  readonly purposeLegitimateInterest: readonly number[]; // purpose IDs with LI
  readonly purposeOneTreatment: boolean;
  readonly publisherCC: string;
  readonly vendorConsents?: readonly number[];       // vendor IDs that are consented
  readonly vendorLegitimateInterest?: readonly number[];
  readonly created?: number;  // epoch ms
  readonly lastUpdated?: number; // epoch ms
}

/**
 * Result of decoding a TC string.
 */
export interface DecodedTcString {
  readonly version: number;
  readonly created: number;
  readonly lastUpdated: number;
  readonly cmpId: number;
  readonly cmpVersion: number;
  readonly consentScreen: number;
  readonly consentLanguage: string;
  readonly vendorListVersion: number;
  readonly tcfPolicyVersion: number;
  readonly isServiceSpecific: boolean;
  readonly useNonStandardStacks: boolean;
  readonly specialFeatureOptIns: readonly number[];
  readonly purposeConsents: readonly number[];
  readonly purposeLegitimateInterest: readonly number[];
  readonly purposeOneTreatment: boolean;
  readonly publisherCC: string;
  readonly maxVendorId: number;
  readonly isRangeEncoding: boolean;
  readonly vendorConsents: readonly number[];
  readonly vendorLegitimateInterest: readonly number[];
}

// ── Bit-level writer ───────────────────────────────────────────────

class BitWriter {
  private bits: number[] = [];

  add(value: number, bitCount: number): void {
    for (let i = bitCount - 1; i >= 0; i--) {
      this.bits.push((value >> i) & 1);
    }
  }

  toBytes(): Uint8Array {
    const bytes: number[] = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8 && i + j < this.bits.length; j++) {
        byte = (byte << 1) | (this.bits[i + j] ?? 0);
      }
      // Pad last byte with zeros
      const remaining = this.bits.length - i;
      if (remaining < 8) {
        byte = byte << (8 - remaining);
      }
      bytes.push(byte);
    }
    return Uint8Array.from(bytes);
  }
}

// ── Bit-level reader ───────────────────────────────────────────────

class BitReader {
  private bits: number[];
  private pos = 0;

  constructor(data: Uint8Array) {
    this.bits = [];
    for (const byte of data) {
      for (let i = 7; i >= 0; i--) {
        this.bits.push((byte >> i) & 1);
      }
    }
  }

  read(bitCount: number): number {
    let value = 0;
    for (let i = 0; i < bitCount; i++) {
      value = (value << 1) | (this.bits[this.pos++] ?? 0);
    }
    return value;
  }

  readBool(): boolean {
    return this.read(1) === 1;
  }

  readBitfield(bitCount: number): number[] {
    const ids: number[] = [];
    for (let i = 0; i < bitCount; i++) {
      if (this.read(1) === 1) {
        ids.push(i + 1); // 1-indexed
      }
    }
    return ids;
  }
}

// ── Language encoding ──────────────────────────────────────────────

/**
 * Encode a 2-letter ISO 639-1 language code (e.g. 'EN') to a 12-bit value.
 * A=0, B=1, ..., Z=25. First letter in bits 0-5, second in bits 6-11.
 */
function encodeLanguage(code: string): number {
  const upper = code.toUpperCase();
  const first = upper.charCodeAt(0) - 65; // A=0
  const second = upper.charCodeAt(1) - 65;
  return (first << 6) | second;
}

/**
 * Decode a 12-bit value to a 2-letter ISO 639-1 language code.
 */
function decodeLanguage(value: number): string {
  const first = (value >> 6) & 0x3F;
  const second = value & 0x3F;
  return String.fromCharCode(65 + first, 65 + second);
}

// ── Base64 encoding (RFC 4648) ─────────────────────────────────────

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64Encode(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (a << 16) | (b << 8) | c;

    result += BASE64_CHARS[(triple >> 18) & 0x3F];
    result += BASE64_CHARS[(triple >> 12) & 0x3F];
    result += i + 1 < bytes.length ? BASE64_CHARS[(triple >> 6) & 0x3F] : '=';
    result += i + 2 < bytes.length ? BASE64_CHARS[triple & 0x3F] : '=';
  }
  return result;
}

function base64Decode(str: string): Uint8Array {
  // Remove padding
  const clean = str.replace(/=+$/, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const a = BASE64_CHARS.indexOf(clean[i]);
    const b = BASE64_CHARS.indexOf(clean[i + 1] ?? 'A');
    const c = BASE64_CHARS.indexOf(clean[i + 2] ?? 'A');
    const d = BASE64_CHARS.indexOf(clean[i + 3] ?? 'A');
    const triple = (a << 18) | (b << 12) | (c << 6) | d;
    bytes.push((triple >> 16) & 0xFF);
    if (i + 2 < clean.length) bytes.push((triple >> 8) & 0xFF);
    if (i + 3 < clean.length) bytes.push(triple & 0xFF);
  }
  return Uint8Array.from(bytes);
}

// ── Public API ─────────────────────────────────────────────────────

/**
 * Encode consent state into an IAB TCF v2.2 TC string (base64).
 */
export function encodeTcString(input: TcStringInput): string {
  const now = Date.now();
  const writer = new BitWriter();

  // Core string fields in order
  writer.add(TC_STRING_VERSION, 6);                        // version
  writer.add(Math.floor((input.created ?? now) / 100), 36);         // created (deciseconds)
  writer.add(Math.floor((input.lastUpdated ?? now) / 100), 36);     // lastUpdated (deciseconds)
  writer.add(input.cmpId, 12);                              // cmpId
  writer.add(input.cmpVersion, 12);                         // cmpVersion
  writer.add(input.consentScreen, 6);                       // consentScreen
  writer.add(encodeLanguage(input.consentLanguage ?? DEFAULT_CONSENT_LANGUAGE), 12); // consentLanguage
  writer.add(input.vendorListVersion, 12);                  // vendorListVersion
  writer.add(TCF_POLICY_VERSION, 6);                        // tcfPolicyVersion
  writer.add(input.isServiceSpecific ? 1 : 0, 1);          // isServiceSpecific
  writer.add(input.useNonStandardStacks ? 1 : 0, 1);       // useNonStandardStacks

  // Special feature opt-ins (bitfield, 12 bits)
  let sfBits = 0;
  for (const sfId of input.specialFeatureOptIns) {
    if (sfId >= 1 && sfId <= SPECIAL_FEATURE_BITS) {
      sfBits |= (1 << (sfId - 1));
    }
  }
  writer.add(sfBits, SPECIAL_FEATURE_BITS);

  // Purpose consents (bitfield, 24 bits)
  let pcBits = 0;
  for (const pId of input.purposeConsents) {
    if (pId >= 1 && pId <= PURPOSE_BITS) {
      pcBits |= (1 << (pId - 1));
    }
  }
  writer.add(pcBits, PURPOSE_BITS);

  // Purpose legitimate interest (bitfield, 24 bits)
  let liBits = 0;
  for (const pId of input.purposeLegitimateInterest) {
    if (pId >= 1 && pId <= PURPOSE_BITS) {
      liBits |= (1 << (pId - 1));
    }
  }
  writer.add(liBits, PURPOSE_BITS);

  // Purpose one treatment
  writer.add(input.purposeOneTreatment ? 1 : 0, 1);

  // Publisher country code (2-letter ISO, same encoding as language)
  writer.add(encodeLanguage(input.publisherCC || 'XX'), 12);

  // Vendor consent section
  const vendorIds = input.vendorConsents ?? [];
  const maxVendorId = vendorIds.length > 0 ? Math.max(...vendorIds) : 0;
  writer.add(maxVendorId, 16);                             // maxVendorId

  if (maxVendorId === 0) {
    // No vendors — isRangeEncoding=true, bitfield empty
    writer.add(1, 1); // isRangeEncoding
    // Default consent = false (0)
    // No range entries
  } else {
    // Use bitfield encoding for simplicity
    writer.add(0, 1); // isRangeEncoding = false (bitfield)
    for (let vId = 1; vId <= maxVendorId; vId++) {
      writer.add(vendorIds.includes(vId) ? 1 : 0, 1);
    }
  }

  // Vendor legitimate interest section
  const liVendorIds = input.vendorLegitimateInterest ?? [];
  const maxLiVendorId = liVendorIds.length > 0 ? Math.max(...liVendorIds) : 0;
  writer.add(maxLiVendorId, 16);

  if (maxLiVendorId === 0) {
    writer.add(1, 1); // isRangeEncoding
  } else {
    writer.add(0, 1);
    for (let vId = 1; vId <= maxLiVendorId; vId++) {
      writer.add(liVendorIds.includes(vId) ? 1 : 0, 1);
    }
  }

  const bytes = writer.toBytes();
  return base64Encode(bytes);
}

/**
 * Decode a base64 IAB TCF v2.2 TC string.
 * Returns null if the string is invalid.
 */
export function decodeTcString(tcString: string): DecodedTcString | null {
  try {
    const bytes = base64Decode(tcString);
    const reader = new BitReader(bytes);

    const version = reader.read(6);
    if (version !== 2) return null;

    const created = reader.read(36) * 100;
    const lastUpdated = reader.read(36) * 100;
    const cmpId = reader.read(12);
    const cmpVersion = reader.read(12);
    const consentScreen = reader.read(6);
    const consentLanguage = decodeLanguage(reader.read(12));
    const vendorListVersion = reader.read(12);
    const tcfPolicyVersion = reader.read(6);
    const isServiceSpecific = reader.readBool();
    const useNonStandardStacks = reader.readBool();

    const sfBits = reader.read(SPECIAL_FEATURE_BITS);
    const specialFeatureOptIns: number[] = [];
    for (let i = 0; i < SPECIAL_FEATURE_BITS; i++) {
      if ((sfBits >> i) & 1) specialFeatureOptIns.push(i + 1);
    }

    const pcBits = reader.read(PURPOSE_BITS);
    const purposeConsents: number[] = [];
    for (let i = 0; i < PURPOSE_BITS; i++) {
      if ((pcBits >> i) & 1) purposeConsents.push(i + 1);
    }

    const liBits = reader.read(PURPOSE_BITS);
    const purposeLegitimateInterest: number[] = [];
    for (let i = 0; i < PURPOSE_BITS; i++) {
      if ((liBits >> i) & 1) purposeLegitimateInterest.push(i + 1);
    }

    const purposeOneTreatment = reader.readBool();
    const publisherCC = decodeLanguage(reader.read(12));

    // Vendor consents
    const maxVendorId = reader.read(16);
    const isRangeEncoding = reader.readBool();
    const vendorConsents: number[] = [];
    if (isRangeEncoding) {
      const numEntries = reader.read(12);
      for (let i = 0; i < numEntries; i++) {
        const isARange = reader.readBool();
        const startOrOnlyId = reader.read(16);
        if (isARange) {
          const endId = reader.read(16);
          for (let v = startOrOnlyId; v <= endId; v++) {
            vendorConsents.push(v);
          }
        } else {
          vendorConsents.push(startOrOnlyId);
        }
      }
    } else {
      for (let vId = 1; vId <= maxVendorId; vId++) {
        if (reader.readBool()) vendorConsents.push(vId);
      }
    }

    // Vendor legitimate interest
    const maxLiVendorId = reader.read(16);
    const isLiRangeEncoding = reader.readBool();
    const vendorLegitimateInterest: number[] = [];
    if (isLiRangeEncoding) {
      const numEntries = reader.read(12);
      for (let i = 0; i < numEntries; i++) {
        const isARange = reader.readBool();
        const startOrOnlyId = reader.read(16);
        if (isARange) {
          const endId = reader.read(16);
          for (let v = startOrOnlyId; v <= endId; v++) {
            vendorLegitimateInterest.push(v);
          }
        } else {
          vendorLegitimateInterest.push(startOrOnlyId);
        }
      }
    } else {
      for (let vId = 1; vId <= maxLiVendorId; vId++) {
        if (reader.readBool()) vendorLegitimateInterest.push(vId);
      }
    }

    return {
      version, created, lastUpdated, cmpId, cmpVersion,
      consentScreen, consentLanguage, vendorListVersion,
      tcfPolicyVersion, isServiceSpecific, useNonStandardStacks,
      specialFeatureOptIns, purposeConsents, purposeLegitimateInterest,
      purposeOneTreatment, publisherCC,
      maxVendorId, isRangeEncoding, vendorConsents, vendorLegitimateInterest,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a TC string with only purpose consents (no vendors).
 * Useful when GVL is not loaded.
 */
export function encodeTcStringPurposesOnly(
  cmpId: number,
  cmpVersion: number,
  consentedPurposeIds: readonly number[],
  specialFeatureOptIns?: readonly number[],
): string {
  return encodeTcString({
    cmpId,
    cmpVersion,
    consentScreen: 0,
    vendorListVersion: 0,
    isServiceSpecific: false,
    useNonStandardStacks: false,
    specialFeatureOptIns: specialFeatureOptIns ?? [],
    purposeConsents: consentedPurposeIds,
    purposeLegitimateInterest: [],
    purposeOneTreatment: false,
    publisherCC: 'XX',
  });
}
