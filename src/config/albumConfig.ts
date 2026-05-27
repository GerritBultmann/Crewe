import type { StickerCategory, StickerPosition } from '../domain/types';

export const STORAGE_KEY = 'stickeralbum:album-data:v1';
export const EXPORT_SCHEMA_VERSION = 1 as const;

export const STICKER_POSITIONS: { value: StickerPosition; label: string }[] = [
  { value: 'TW', label: 'Torwart' },
  { value: 'IV', label: 'Innenverteidigung' },
  { value: 'AV', label: 'Außenverteidigung' },
  { value: 'DM', label: 'Defensives Mittelfeld' },
  { value: 'ZM', label: 'Zentrales Mittelfeld' },
  { value: 'OM', label: 'Offensives Mittelfeld' },
  { value: 'FL', label: 'Flügel' },
  { value: 'ST', label: 'Sturm' },
  { value: 'STAFF', label: 'Trainerteam' },
  { value: 'SPECIAL', label: 'Spezialkarte' },
];

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'goalkeepers',
    title: 'Torhüter',
    page: 'left',
    acceptedPositions: ['TW'],
    defaultSlots: 2,
    accent: '#9aa6b2',
  },
  {
    id: 'defense',
    title: 'Abwehr',
    page: 'left',
    acceptedPositions: ['IV', 'AV'],
    defaultSlots: 4,
    accent: '#2db8a3',
  },
  {
    id: 'midfield',
    title: 'Mittelfeld',
    page: 'right',
    acceptedPositions: ['DM', 'ZM', 'OM', 'FL'],
    defaultSlots: 5,
    accent: '#3378f6',
  },
  {
    id: 'attack',
    title: 'Angriff',
    page: 'right',
    acceptedPositions: ['ST', 'FL'],
    defaultSlots: 3,
    accent: '#f04c9c',
  },
  {
    id: 'specials',
    title: 'Specials',
    page: 'right',
    acceptedPositions: ['STAFF', 'SPECIAL'],
    defaultSlots: 2,
    accent: '#d6af54',
  },
];

export const positionLabel = (position: StickerPosition) =>
  STICKER_POSITIONS.find((item) => item.value === position)?.label ?? position;

export const categoryById = (categoryId: string) =>
  STICKER_CATEGORIES.find((category) => category.id === categoryId);

export const categoryForPosition = (position: StickerPosition) =>
  STICKER_CATEGORIES.find((category) => category.acceptedPositions.includes(position)) ??
  STICKER_CATEGORIES[STICKER_CATEGORIES.length - 1];
