import type { Sticker, StickerPosition } from './types';
import { ATTRIBUTE_GROUPS, POSITION_DOTS, normalizeAttributeKey } from './fmRoles';

export interface SeasonStats {
  competition: string;
  year: string;
  apps: string;
  starts: string;
  subApps: string;
  minutes: string;
  goals: string;
  assists: string;
  cleanSheets: string;
  playerOfMatch: string;
  passPercent: string;
  rating: string;
}

export interface PlayerProfile {
  name: string;
  number: string;
  team: string;
  position: StickerPosition;
  rawPosition: string;
  idealPosition: string;
  bestRole: string;
  nationality: string;
  secondNationality: string;
  birthplace: string;
  birthdate: string;
  age: string;
  height: string;
  personality: string;
  mediaDescription: string;
  value: string;
  wage: string;
  contractEnd: string;
  contractRemaining: string;
  squadStatus: string;
  abilityStars: string;
  potentialStars: string;
  leftFoot: string;
  rightFoot: string;
  traits: string;
  stats: SeasonStats[];
  attributes: Record<string, string>;
}

const emptyStats = (): SeasonStats => ({
  competition: 'Gesamt',
  year: '',
  apps: '',
  starts: '',
  subApps: '',
  minutes: '',
  goals: '',
  assists: '',
  cleanSheets: '',
  playerOfMatch: '',
  passPercent: '',
  rating: '',
});

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

const pickLoose = (row: Record<string, string> | undefined, names: string[]) => {
  if (!row) return '';
  const wanted = names.map(normalizeKey);
  const entry = Object.entries(row).find(([key, value]) => {
    const normalized = normalizeKey(key);
    return text(value) && wanted.some((name) => normalized === name || normalized.startsWith(`${name}_`) || normalized.startsWith(name));
  });
  return text(entry?.[1]);
};

const parseAppsCell = (value: string) => {
  const match = value.match(/(\d+)\s*(?:\((\d+)\))?/);
  if (!match) return { total: value, starts: '', subApps: '' };
  const starts = Number.parseInt(match[1] ?? '0', 10) || 0;
  const subApps = Number.parseInt(match[2] ?? '0', 10) || 0;
  return { total: String(starts + subApps), starts: String(starts), subApps: subApps ? String(subApps) : '' };
};

const asStars = (value: string) => {
  if (!value) return '';
  if (value.includes('★') || value.includes('☆')) return value;
  const number = Number.parseFloat(value.replace(',', '.').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(number)) return value;
  const rounded = Math.max(0, Math.min(5, Math.round(number)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
};

const parseAge = (value: string) => value.match(/\d+/)?.[0] ?? '';

const normalizePositionId = (position: StickerPosition, rawPosition = '') => {
  const raw = rawPosition.toUpperCase();
  if (position === 'TW' || /\bTW\b|GK|TORWART|GOALKEEPER/.test(raw)) return 'GK';
  if (/V\s*\(L|LV|LB/.test(raw)) return 'LV';
  if (/V\s*\(R|RV|RB/.test(raw)) return 'RV';
  if (position === 'IV' || /V\s*\(Z|IV|CB|DC/.test(raw)) return 'IV';
  if (position === 'DM' || /DM|CDM/.test(raw)) return 'DM';
  if (position === 'ZM' || /M\s*\(Z|ZM|CM|MC/.test(raw)) return 'ZM';
  if (position === 'OM' || /OM\s*\(Z|AM|CAM/.test(raw)) return 'OM';
  if (/OM\s*\(L|M\s*\(L|LW|LM/.test(raw)) return 'LA';
  if (/OM\s*\(R|M\s*\(R|RW|RM/.test(raw)) return 'RA';
  if (position === 'FL') return 'RA';
  return 'MS';
};

export const positionIdForProfile = (profile: PlayerProfile) => normalizePositionId(profile.position, profile.rawPosition);

const attributeAliases: Record<string, string[]> = {
  Abschluss: ['Abschluss', 'attr_Abschluss'],
  Abschlag: ['Abschlag', 'Abschläge', 'Abschlaege', 'attr_Abschlag'],
  Abwurf: ['Abwurf', 'attr_Abwurf'],
  Aggressivität: ['Aggressivität', 'Aggressivitaet', 'attr_Aggressivitaet'],
  Antritt: ['Antritt', 'attr_Antritt'],
  Antizipation: ['Antizipation', 'attr_Antizipation'],
  Ausdauer: ['Ausdauer', 'attr_Ausdauer'],
  Balance: ['Balance', 'attr_Balance'],
  Ballannahme: ['Ballannahme', 'Erstkontakt', 'attr_Ballannahme'],
  Beweglichkeit: ['Beweglichkeit', 'attr_Beweglichkeit'],
  Deckung: ['Deckung', 'Markierung', 'attr_Deckung'],
  Dribbling: ['Dribbling', 'attr_Dribbling'],
  Ecken: ['Ecken', 'attr_Ecken'],
  'Eins gegen Eins': ['Eins gegen Eins', 'Eins-gegen-Eins', 'EinsgegenEins', 'attr_Eins_gegen_Eins'],
  Einsatzfreude: ['Einsatzfreude', 'attr_Einsatzfreude'],
  Elfmeter: ['Elfmeter', 'attr_Elfmeter'],
  Entscheidungen: ['Entscheidungen', 'attr_Entscheidungen'],
  Exzentrizität: ['Exzentrizität', 'Exzentrizitaet', 'attr_Exzentrizitaet'],
  'Fausten (Tendenz)': ['Fausten Tendenz', 'Fausten', 'attr_Fausten_Tendenz'],
  Flair: ['Flair', 'attr_Flair'],
  Flanken: ['Flanken', 'attr_Flanken'],
  Freistöße: ['Freistöße', 'Freistoesse', 'Freistosse', 'attr_Freistoesse'],
  Führungsqualitäten: ['Führungsqualitäten', 'Fuehrungsqualitaeten', 'attr_Fuehrungsqualitaeten'],
  Grundfitness: ['Grundfitness', 'attr_Grundfitness'],
  Halten: ['Halten', 'Fangsicherheit', 'attr_Halten'],
  'Herauslaufen (Tendenz)': ['Herauslaufen Tendenz', 'Herauslaufen', 'attr_Herauslaufen_Tendenz'],
  'Hohe Bälle': ['Hohe Bälle', 'Hohe Baelle', 'Hohe Balle', 'attr_Hohe_Baelle'],
  Kommunikation: ['Kommunikation', 'attr_Kommunikation'],
  Konzentration: ['Konzentration', 'attr_Konzentration'],
  Kopfballtechnik: ['Kopfballtechnik', 'Kopfball', 'attr_Kopfballtechnik'],
  Kraft: ['Kraft', 'Stärke', 'Staerke', 'attr_Kraft'],
  Mut: ['Mut', 'attr_Mut'],
  Nervenstärke: ['Nervenstärke', 'Nervenstaerke', 'Ruhe', 'attr_Nervenstaerke'],
  'Ohne Ball': ['Ohne Ball', 'Offensivbewegung', 'attr_Ohne_Ball'],
  Passen: ['Passen', 'attr_Passen'],
  Reflexe: ['Reflexe', 'attr_Reflexe'],
  Schnelligkeit: ['Schnelligkeit', 'attr_Schnelligkeit'],
  Sprunghöhe: ['Sprunghöhe', 'Sprungshoehe', 'Sprunghoehe', 'attr_Sprungshoehe'],
  Stellungsspiel: ['Stellungsspiel', 'attr_Stellungsspiel'],
  Strafraumkontrolle: ['Strafraumkontrolle', 'Strafraumbeherrschung', 'attr_Strafraumkontrolle'],
  Tackling: ['Tackling', 'attr_Tackling'],
  Teamwork: ['Teamwork', 'attr_Teamwork'],
  Technik: ['Technik', 'attr_Technik'],
  Übersicht: ['Übersicht', 'Uebersicht', 'attr_Uebersicht'],
  'Weite Einwürfe': ['Weite Einwürfe', 'Weite Einwuerfe', 'attr_Weite_Einwuerfe'],
  Weitschüsse: ['Weitschüsse', 'Weitschuesse', 'Weitschusse', 'attr_Weitschuesse'],
  Zielstrebigkeit: ['Zielstrebigkeit', 'attr_Zielstrebigkeit'],
};

const allAttributeLabels = Array.from(new Set([...ATTRIBUTE_GROUPS.fieldTechnical, ...ATTRIBUTE_GROUPS.setPieces, ...ATTRIBUTE_GROUPS.goalkeeping, ...ATTRIBUTE_GROUPS.mental, ...ATTRIBUTE_GROUPS.athletic]));

const readAttributes = (row: Record<string, string> | undefined) => {
  const attributes: Record<string, string> = {};
  for (const label of allAttributeLabels) {
    const value = pickLoose(row, attributeAliases[label] ?? [label]);
    if (value) attributes[label] = value.match(/-?\d+(?:[,.]\d+)?/)?.[0]?.replace(',', '.') ?? value;
  }

  if (row) {
    for (const [key, value] of Object.entries(row)) {
      if (!normalizeKey(key).startsWith('attr') || !text(value)) continue;
      const cleanLabel = key.replace(/^attr[_\s-]*/i, '').replace(/_/g, ' ').trim();
      const canonical = allAttributeLabels.find((label) => normalizeAttributeKey(label) === normalizeAttributeKey(cleanLabel)) ?? cleanLabel;
      attributes[canonical] = text(value).match(/-?\d+(?:[,.]\d+)?/)?.[0]?.replace(',', '.') ?? text(value);
    }
  }

  return attributes;
};

const statsFromRow = (row: Record<string, string> | undefined, profileYear: string): SeasonStats[] => {
  if (!row) return [];
  const appsInfo = parseAppsCell(pick(row, ['Einsätze', 'Einsaetze', 'Eins', 'Apps', 'Appearances', 'Saison Einsätze']));
  const stats = emptyStats();
  stats.competition = pick(row, ['competition', 'Wettbewerb', 'Wtbw']) || 'Gesamt (Verein)';
  stats.year = profileYear;
  stats.apps = appsInfo.total;
  stats.starts = appsInfo.starts || pick(row, ['Starts', 'Startelf']);
  stats.subApps = appsInfo.subApps || pick(row, ['Einwechslungen', 'SubApps']);
  stats.minutes = pick(row, ['Minuten', 'Min.', 'Min', 'Minutes']);
  stats.goals = pick(row, ['Saison Tore', 'Saisontore', 'Tore', 'Goals']);
  stats.assists = pick(row, ['Vorlagen', 'Vor', 'Assists']);
  stats.cleanSheets = pick(row, ['Zu-Null-Spiele', 'Zu Null', 'zNull', 'Ohne Gegentor', 'Clean Sheets']);
  stats.playerOfMatch = pick(row, ['SdS', 'Spieler des Spiels', 'Mann des Spiels', 'Player of Match']);
  stats.passPercent = pick(row, ['Pas %', 'Pass %', 'Passquote', 'Pass Percent']);
  stats.rating = pick(row, ['Wertung', 'Ø Note', 'Durchschnittsnote', 'Note', 'Rating']);
  return Object.values(stats).some(Boolean) ? [stats] : [];
};

export const profileFromSticker = (sticker: Sticker): PlayerProfile => {
  const row = sticker.sourceRow;
  const rawPosition = pick(row, ['Position', 'pos', 'Spielposition']) || sticker.position;
  const year = pick(row, ['seasonStatsYear', 'Statistik Jahr', 'Statistikjahr', 'Saisonjahr', 'seasonYear']);
  const mediaDescription = pickLoose(row, ['Medienbeschreibung', 'mediaDescription']);

  return {
    name: sticker.name,
    number: sticker.number,
    team: sticker.team || pick(row, ['Verein', 'Team', 'Mannschaft', 'club']) || 'Crewe Alexandra',
    position: sticker.position,
    rawPosition,
    idealPosition: pick(row, ['Idealpos', 'Ideale Position', 'idealPosition']),
    bestRole: pick(row, ['Beste Rolle', 'Rolle', 'bestRole']),
    nationality: pick(row, ['Nation', 'Nationalität', 'Nationalitaet', 'Hauptnationalität']) || '—',
    secondNationality: pick(row, ['2. Nation', 'Zweite Nationalität', 'Zweite Nationalitaet']),
    birthplace: pick(row, ['Geb.-Region', 'Geb Region', 'Geburtsort', 'birthplace']),
    birthdate: pick(row, ['Geburtsdatum', 'Geb.', 'Geb', 'birthdate']),
    age: parseAge(pick(row, ['Alter', 'Age', 'age'])),
    height: pick(row, ['Größe', 'Groesse', 'height']),
    personality: pick(row, ['Persönlichkeit', 'Persoenlichkeit', 'Persönl.', 'Persoenl.', 'Pers.', 'personality']),
    mediaDescription,
    value: pick(row, ['Transferwert', 'Marktwert', 'Wert', 'value']),
    wage: pick(row, ['Gehalt', 'Lohn', 'wage', 'salary']),
    contractEnd: pick(row, ['Endet', 'Endet_2', 'Vertrag bis', 'Vertragsende', 'contractEnd']),
    contractRemaining: pick(row, ['Endet_1', 'Vertragslaufzeit', 'Restvertrag', 'contractRemaining']),
    squadStatus: pick(row, ['Kaderstatus', 'Status im Kader', 'Aktueller Aufenthaltsstatus', 'currentStatus']),
    abilityStars: asStars(pick(row, ['Fähigkeit', 'Faehigkeit', 'Fähigkeit Sterne', 'CA Sterne', 'abilityStars'])),
    potentialStars: asStars(pick(row, ['Potenzial', 'Potenzial Sterne', 'PA Sterne', 'potentialStars'])),
    leftFoot: pick(row, ['Linker Fuß', 'Linker Fuss', 'Li Fuß', 'Li Fuss', 'leftFoot']),
    rightFoot: pick(row, ['Rechter Fuß', 'Rechter Fuss', 'Re Fuß', 'Re Fuss', 'rightFoot']),
    traits: pick(row, ['Spielereigenschaften', 'Eigenschaften', 'playerTraits']),
    stats: statsFromRow(row, year),
    attributes: readAttributes(row),
  };
};

export const dotForProfile = (profile: PlayerProfile) => POSITION_DOTS.find((dot) => dot.id === positionIdForProfile(profile)) ?? POSITION_DOTS[0];
