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
      return { year: parts[0] ?? '', team: parts[1] ?? '', info: parts[2] ?? '', apps: parts[3] ?? '', goals: parts[4] ?? '', assists: parts[5] ?? '', rating: parts[6] ?? '', value: parts[7] ?? '' };
    });
};

const statRowToCareer = (stats: SeasonStats, profile: PlayerProfile): CareerHistoryRow => ({
  year: stats.year || '',
  team: profile.team,
  info: profile.squadStatus || 'Saison',
  nation: profile.nationality,
  league: stats.competition || 'Gesamt',
  apps: stats.apps,
  goals: stats.goals,
  assists: stats.assists,
  playerOfMatch: stats.playerOfMatch,
  rating: stats.rating,
  details: { Starts: stats.starts, Einwechslungen: stats.subApps, Minuten: stats.minutes, 'Pass %': stats.passPercent, 'Zu Null': stats.cleanSheets, Marktwert: profile.value },
  attributes: profile.attributes,
  stats,
});

const careerFromRaw = (candidate: unknown, fallbackProfile: PlayerProfile): CareerHistoryRow => {
  const raw = objectEntriesToStrings(candidate);
  const object = candidate as Record<string, unknown> | undefined;
  const attrs = nestedRecord(object?.attrs ?? object?.attributes);
  const rawStats = objectEntriesToStrings(object?.stats ?? object?.seasonStats);

  return {
    year: pick(raw, ['year', 'jahr', 'season', 'saison']) || raw.year || '',
    team: pick(raw, ['team', 'mannschaft', 'club', 'verein']) || fallbackProfile.team,
    info: pick(raw, ['info', 'status', 'type', 'typ', 'leagueOrNation']) || fallbackProfile.squadStatus || 'Saison',
    nation: pick(raw, ['nation', 'nationality', 'land']) || fallbackProfile.nationality,
    league: pick(raw, ['league', 'liga', 'competition', 'wettbewerb']) || pick(raw, ['leagueOrNation']) || '',
    apps: pick(raw, ['apps', 'appearances', 'einsätze', 'einsaetze', 'eins']) || rawStats.apps || '',
    goals: pick(raw, ['goals', 'tore']) || rawStats.goals || '',
    assists: pick(raw, ['assists', 'vorlagen', 'vor']) || rawStats.assists || '',
    playerOfMatch: pick(raw, ['playerOfMatch', 'sds', 'spieler des spiels']) || rawStats.playerOfMatch || '',
    rating: pick(raw, ['rating', 'wertung', 'durchschnittsnote', 'note', 'avgRat']) || rawStats.rating || '',
    details: raw,
    attributes: attrs,
    stats: rawStats as Partial<SeasonStats>,
  };
};

export const careerRowsForProfile = (sticker: Sticker, profile = profileFromSticker(sticker)): CareerHistoryRow[] => {
  const row = sticker.sourceRow;
  const jsonRows = parseRowsFromJsonField(row, ['careerHistory', 'career_history', 'Karriere', 'Laufbahn', 'history']);
  const delimitedRows = parseDelimitedCareerRows(pick(row, ['careerText', 'Karriere Text', 'Laufbahn Text']));
  const importedRows = [...jsonRows, ...delimitedRows].map((item) => careerFromRaw(item, profile));
  if (importedRows.length) return importedRows;
  if (profile.stats.length) return profile.stats.map((stats) => statRowToCareer(stats, profile));

  return [{
    year: pick(row, ['Saison', 'season', 'Jahr', 'year']),
    team: profile.team,
    info: profile.squadStatus || (sticker.status === 'owned' ? 'Im Verein' : sticker.status),
    nation: profile.nationality,
    league: pick(row, ['Wettbewerb', 'competition', 'Liga', 'league']),
    apps: pick(row, ['Einsätze', 'Einsaetze', 'Apps', 'Appearances']),
    goals: pick(row, ['Tore', 'Goals']),
    assists: pick(row, ['Vorlagen', 'Assists']),
    playerOfMatch: pick(row, ['SdS', 'Spieler des Spiels', 'Player of Match']),
    rating: pick(row, ['Wertung', 'Rating', 'Ø Note']),
    details: objectEntriesToStrings(row),
    attributes: profile.attributes,
    stats: profile.stats[0] ?? {},
  }];
};

export const relatedProfileCards = (sticker: Sticker, stickers: Sticker[]) => {
  const key = profilePersonKey(sticker);
  return stickers
    .filter((candidate) => profilePersonKey(candidate) === key)
    .sort((left, right) => (left.cardNumber ?? 0) - (right.cardNumber ?? 0))
    .map((candidate): RelatedProfileCard => {
      const profile = profileFromSticker(candidate);
      return { sticker: candidate, profile, cardNumber: formatCardNumber(candidate.cardNumber), title: candidate.importedFrom === 'csv' ? 'CSV-Karte' : candidate.importedFrom === 'json' ? 'JSON-Karte' : 'Albumkarte', season: pick(candidate.sourceRow, ['Saison', 'season', 'Jahr', 'year', 'seasonYear']) || 'Aktuelle Saison', value: profile.value, stats: profile.stats[0] ?? {} };
    });
};

export const parseMoney = (value: string): number | null => {
  if (!value) return null;
  const firstPart = value.toLowerCase().replace(/€/g, '').replace(/eur/g, '').split(/\s*(?:-|–|—|bis|to)\s*/)[0].trim();
  const match = firstPart.match(/(-?\d+(?:[,.]\d+)?)\s*(mio\.?|million(?:en)?|m\b|tsd\.?|k\b)?/i);
  if (!match) return null;
  const amount = Number.parseFloat(match[1].replace(',', '.'));
  if (!Number.isFinite(amount)) return null;
  const unit = (match[2] ?? '').toLowerCase();
  if (/mio|million|^m\b/.test(unit)) return amount * 1_000_000;
  if (/tsd|^k\b/.test(unit)) return amount * 1_000;
  return amount;
};

export const formatMoney = (value: number | null, fallback = '—') => {
  if (value === null || !Number.isFinite(value)) return fallback || '—';
  if (Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1).replace('.', ',')} Mio. €`;
  }
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000).toLocaleString('de-DE')} Tsd. €`;
  return `${Math.round(value).toLocaleString('de-DE')} €`;
};

const moneyDiff = (current: string, previous: string) => {
  const now = parseMoney(current);
  const before = parseMoney(previous);
  if (now === null || before === null) return '—';
  const diff = now - before;
  if (diff === 0) return '±0 €';
  return `${diff > 0 ? '+' : '−'}${formatMoney(Math.abs(diff), '')}`;
};

const valueKeys = ['Marktwert', 'Wert', 'Transferwert', 'Marktwert €', 'Value', 'marketValue', 'market_value', 'transferValue', 'transfer_value'];
const yearKeys = ['Saison', 'season', 'Jahr', 'year', 'seasonYear'];

const valueFromCareerRow = (row: CareerHistoryRow, fallbackValue = '') =>
  pick(row.details, valueKeys) || fallbackValue;

const yearFromCareerRow = (row: CareerHistoryRow, fallback = 'Aktuell') =>
  row.year || pick(row.details, yearKeys) || fallback;

export const valueCurveForCards = (cards: RelatedProfileCard[]): ValuePoint[] =>
  cards.map((card, index) => ({ label: card.season, value: parseMoney(card.value), formatted: formatMoney(parseMoney(card.value), card.value || '—'), delta: index === 0 ? '—' : moneyDiff(card.value, cards[index - 1].value) }));

export const valueCurveForCareerRows = (rows: CareerHistoryRow[], fallbackValue = ''): ValuePoint[] =>
  rows.map((row, index) => {
    const rawValue = valueFromCareerRow(row, fallbackValue);
    const previousRawValue = index > 0 ? valueFromCareerRow(rows[index - 1], fallbackValue) : '';
    const value = parseMoney(rawValue);
    return {
      label: yearFromCareerRow(row, `Jahr ${index + 1}`),
      value,
      formatted: formatMoney(value, rawValue || '—'),
      delta: index === 0 ? '—' : moneyDiff(rawValue, previousRawValue),
    };
  });

export const buildProfileDashboardModel = (sticker: Sticker, stickers: Sticker[], selectedStickerId?: string, selectedCareerIndex = 0): ProfileDashboardModel => {
  const related = relatedProfileCards(sticker, stickers.length ? stickers : [sticker]);
  const selected = related.find((item) => item.sticker.id === selectedStickerId)?.sticker ?? related[0]?.sticker ?? sticker;
  const selectedProfile = profileFromSticker(selected);
  const careerRows = careerRowsForProfile(selected, selectedProfile);
  const careerCurve = valueCurveForCareerRows(careerRows, selectedProfile.value);
  const cardCurve = valueCurveForCards(related);
  const valueCurve = careerCurve.some((point) => point.value !== null) ? careerCurve : cardCurve;
  return { sticker, profile: profileFromSticker(sticker), selectedSticker: selected, selectedProfile, relatedCards: related, careerRows, selectedCareerRow: careerRows[selectedCareerIndex] ?? careerRows[0] ?? null, valueCurve, developmentAttributes: Object.entries(selectedProfile.attributes).slice(0, 16) };
};

export const statusLabelForSticker = (sticker: Sticker) => {
  if (sticker.status === 'owned') return 'Im Verein';
  if (sticker.status === 'wanted') return 'Gesucht';
  return 'Doppelt';
};
