import { formatCardNumber } from './cardNumbers';
import { profileFromSticker, type PlayerProfile, type SeasonStats } from './playerProfile';
import type { Sticker } from './types';

export interface CareerHistoryRow {
  year: string;
  team: string;
  info: string;
  nation: string;
  league: string;
  apps: string;
  goals: string;
  assists: string;
  playerOfMatch: string;
  rating: string;
  details: Record<string, string>;
  attributes: Record<string, string>;
  stats: Partial<SeasonStats>;
}

export interface RelatedProfileCard {
  sticker: Sticker;
  profile: PlayerProfile;
  cardNumber: string;
  title: string;
  season: string;
  value: string;
  stats: Partial<SeasonStats>;
}

export interface ValuePoint {
  label: string;
  value: number | null;
  formatted: string;
  delta: string;
}

export interface ProfileDashboardModel {
  sticker: Sticker;
  profile: PlayerProfile;
  selectedSticker: Sticker;
  selectedProfile: PlayerProfile;
  relatedCards: RelatedProfileCard[];
  careerRows: CareerHistoryRow[];
  selectedCareerRow: CareerHistoryRow | null;
  valueCurve: ValuePoint[];
  developmentAttributes: [string, string][];
}

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const text = (value: unknown) => String(value ?? '').trim();

const pick = (row: Record<string, string> | undefined, names: string[]) => {
  if (!row) return '';
  const wanted = names.map(normalizeKey);
  const entry = Object.entries(row).find(([key, value]) => wanted.includes(normalizeKey(key)) && text(value));
  return text(entry?.[1]);
};

export const profilePersonKey = (sticker: Pick<Sticker, 'name' | 'team'>) =>
  `${sticker.name}|${sticker.team}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const objectEntriesToStrings = (candidate: unknown): Record<string, string> => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return {};
  return Object.fromEntries(
    Object.entries(candidate as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined && typeof value !== 'object')
      .map(([key, value]) => [key, text(value)]),
  );
};

const nestedRecord = (candidate: unknown): Record<string, string> => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return {};
  return Object.fromEntries(Object.entries(candidate as Record<string, unknown>).map(([key, value]) => [key, text(value)]));
};

const parseJsonValue = (value: string): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseRowsFromJsonField = (row: Record<string, string> | undefined, names: string[]) => {
  const raw = pick(row, names);
  const parsed = parseJsonValue(raw);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') return Object.values(parsed as Record<string, unknown>);
  return [];
};

const parseDelimitedCareerRows = (value: string) => {
  if (!value) return [];
  return value
    .split(/\n|\|/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/;|,/).map((part) => part.trim());
      return {
        year: parts[0] ?? '',
        team: parts[1] ?? '',
        info: parts[2] ?? '',
        apps: parts[3] ?? '',
        goals: parts[4] ?? '',
        assists: parts[5] ?? '',
        rating: parts[6] ?? '',
      };
    });
};
