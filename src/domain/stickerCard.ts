import { profileFromSticker } from './playerProfile';
import type { Sticker, StickerPosition } from './types';

export interface StickerCardViewModel {
  cardNumber: string;
  edition: string;
  jerseyNumber: string;
  position: string;
  theme: string;
  age: string;
  country: string;
  givenName: string;
  familyName: string;
  fullName: string;
}

const positionShortLabel: Record<StickerPosition, string> = {
  TW: 'TW',
  IV: 'IV',
  AV: 'AV',
  DM: 'DM',
  ZM: 'ZM',
  OM: 'OM',
  FL: 'FL',
  ST: 'ST',
  STAFF: 'STAFF',
  SPECIAL: 'SP',
};

const positionTheme: Record<StickerPosition, string> = {
  TW: 'gold',
  IV: 'emerald',
  AV: 'emerald',
  DM: 'azure',
  ZM: 'azure',
  OM: 'royal',
  FL: 'violet',
  ST: 'crimson',
  STAFF: 'slate',
  SPECIAL: 'legend',
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

export const readStickerSource = (sticker: Sticker, keys: string[]) => {
  const source = sticker.sourceRow;
  if (!source) return '';
  const wanted = keys.map(normalizeKey);
  const match = Object.entries(source).find(([key, value]) => wanted.includes(normalizeKey(key)) && value.trim());
  return match?.[1]?.trim() ?? '';
};

const compactNumber = (value: string, fallback: string) => {
  const raw = value || fallback;
  const numeric = raw.match(/\d+/)?.[0];
  return numeric ? numeric.padStart(3, '0').slice(-3) : raw.slice(0, 3).toUpperCase();
};

const displayJerseyNumber = (sticker: Sticker) =>
  readStickerSource(sticker, ['trikotnummer', 'shirt number', 'jersey number', 'jersey', 'nr', 'number']) ||
  sticker.number ||
  '—';

const displayCardNumber = (sticker: Sticker) =>
  compactNumber(
    readStickerSource(sticker, ['kartennummer', 'card number', 'cardNumber', 'album number', 'albumNumber', 'id']),
    sticker.number || '0',
  );

const displayEdition = (sticker: Sticker) =>
  readStickerSource(sticker, ['saison', 'season', 'edition', 'jahrgang', 'year']) || '2021-22';

const displayCountry = (value: string) => {
  if (!value || value === '—') return '???';
  const clean = value.replace(/\(.+?\)/g, '').trim();
  const known: Record<string, string> = {
    deutschland: '🇩🇪',
    germany: '🇩🇪',
    deutsch: '🇩🇪',
    england: '🏴',
    'england ': '🏴',
    wales: '🏴',
    scotland: '🏴',
    france: '🇫🇷',
    frankreich: '🇫🇷',
    spain: '🇪🇸',
    spanien: '🇪🇸',
    italy: '🇮🇹',
    italien: '🇮🇹',
    netherlands: '🇳🇱',
    niederlande: '🇳🇱',
  };
  const key = clean.toLowerCase();
  return known[key] ?? (clean.length <= 3 ? clean.toUpperCase() : clean.slice(0, 3).toUpperCase());
};

const displayAge = (age: string, birthdate: string) => {
  if (age) return age;
  const year = birthdate.match(/\b(19|20)\d{2}\b/)?.[0];
  return year ?? '???';
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { givenName: name, familyName: '' };
  return {
    givenName: parts.slice(0, -1).join(' '),
    familyName: parts.at(-1) ?? '',
  };
};

export const buildStickerCardViewModel = (sticker: Sticker): StickerCardViewModel => {
  const profile = profileFromSticker(sticker);
  const name = splitName(sticker.name);

  return {
    cardNumber: displayCardNumber(sticker),
    edition: displayEdition(sticker),
    jerseyNumber: displayJerseyNumber(sticker),
    position: positionShortLabel[sticker.position],
    theme: positionTheme[sticker.position],
    age: displayAge(profile.age, profile.birthdate),
    country: displayCountry(profile.nationality),
    givenName: name.givenName,
    familyName: name.familyName,
    fullName: sticker.name,
  };
};
