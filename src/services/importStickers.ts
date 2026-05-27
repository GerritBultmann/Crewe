import { CREWE_DEFAULT_TEAM } from '../config/albumConfig';
import type { StickerPosition, StickerStatus } from '../domain/types';
import type { StickerFormValues } from '../domain/stickers';

export interface ParsedStickerImport {
  values: StickerFormValues;
  source: 'json' | 'csv';
  sourceRow?: Record<string, string>;
}

const positionAliases: Record<string, StickerPosition> = {
  gk: 'TW',
  goalkeeper: 'TW',
  keeper: 'TW',
  torwart: 'TW',
  tw: 'TW',
  rv: 'AV',
  lv: 'AV',
  rb: 'AV',
  lb: 'AV',
  av: 'AV',
  fullback: 'AV',
  'full back': 'AV',
  rwb: 'AV',
  lwb: 'AV',
  iv: 'IV',
  cb: 'IV',
  dc: 'IV',
  defender: 'IV',
  verteidiger: 'IV',
  dm: 'DM',
  cdm: 'DM',
  zm: 'ZM',
  cm: 'ZM',
  mc: 'ZM',
  om: 'OM',
  am: 'OM',
  cam: 'OM',
  rm: 'FL',
  lm: 'FL',
  rw: 'FL',
  lw: 'FL',
  mr: 'FL',
  ml: 'FL',
  fl: 'FL',
  wing: 'FL',
  winger: 'FL',
  st: 'ST',
  striker: 'ST',
  forward: 'ST',
  attacker: 'ST',
  staff: 'STAFF',
  coach: 'STAFF',
  trainer: 'STAFF',
  special: 'SPECIAL',
};

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const normalizeValue = (value: unknown) => String(value ?? '').trim();

const field = (row: Record<string, unknown>, names: string[]) => {
  const normalizedEntries = Object.entries(row).map(([key, value]) => [normalizeKey(key), value] as const);
  const wanted = names.map(normalizeKey);
  const match = normalizedEntries.find(([key]) => wanted.includes(key));
  return normalizeValue(match?.[1]);
};

export const parseCsv = (text: string): Record<string, string>[] => {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const count = (character: string) => firstLine.split(character).length - 1;
  const delimiter = count(';') >= count(',') && count(';') >= count('\t') ? ';' : count('\t') > count(',') ? '\t' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (character === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === delimiter) {
      row.push(cell);
      cell = '';
    } else if (character === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (character !== '\r') {
      cell += character;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  if (rows.length < 2) return [];

  const used: Record<string, number> = {};
  const headers = rows[0].map((header) => {
    const base = header.trim() || 'Spalte';
    used[base] = (used[base] ?? 0) + 1;
    return used[base] === 1 ? base : `${base}_${used[base]}`;
  });

  return rows
    .slice(1)
    .filter((cells) => cells.some((value) => value.trim()))
    .map((cells) =>
      Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() ?? ''])),
    );
};

export const normalizeImportedPosition = (rawPosition: string): StickerPosition => {
  const raw = rawPosition.trim();
  if (!raw) return 'SPECIAL';

  const direct = positionAliases[raw.toLowerCase()];
  if (direct) return direct;

  const compact = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

  if (/\bTW\b/i.test(raw) || /torwart|goalkeeper|keeper/i.test(raw)) return 'TW';
  if (/ST|striker|sturm|forward/i.test(raw)) return 'ST';
  if (/OM|CAM|AM\s*\(|M\/OM/i.test(raw) || compact.includes('om')) return 'OM';
  if (/DM|CDM/i.test(raw) || compact.includes('dm')) return 'DM';
  if (/M\s*\(Z\)|CM|ZM/i.test(raw) || compact.includes('mz')) return 'ZM';
  if (/M\s*\([RL]|OM\s*\([RL]|RW|LW|RM|LM|wing|fluegel|flügel/i.test(raw)) return 'FL';
  if (/V\s*\(Z\)|IV|CB|DC/i.test(raw) || compact.includes('vz')) return 'IV';
  if (/V\s*\([RL]|FV|AV|RB|LB|RWB|LWB/i.test(raw)) return 'AV';

  return 'SPECIAL';
};

const normalizeStatus = (value: string): StickerStatus => {
  const normalized = value.trim().toLowerCase();
  if (['wanted', 'gesucht', 'fehlt', 'missing'].includes(normalized)) return 'wanted';
  if (['double', 'doppelt', 'duplicate', 'duplikat'].includes(normalized)) return 'double';
  return 'owned';
};

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const collectJsonRows = (candidate: unknown): Record<string, unknown>[] => {
  if (Array.isArray(candidate)) return candidate.flatMap(collectJsonRows);

  const object = asObject(candidate);
  if (!object) return [];

  for (const key of ['players', 'player', 'spieler', 'stickers', 'kader', 'roster', 'squad', 'team']) {
    if (Array.isArray(object[key])) return collectJsonRows(object[key]);
  }

  if (field(object, ['name', 'spieler', 'player', 'voller name']) || field(object, ['position', 'pos'])) {
    return [object];
  }

  return Object.values(object).flatMap(collectJsonRows);
};

const rowToSticker = (row: Record<string, unknown>, source: 'json' | 'csv'): ParsedStickerImport | null => {
  const name = field(row, ['name', 'spieler', 'player', 'voller name', 'full name', 'person']);
  if (!name) return null;

  const rawPosition = field(row, ['position', 'pos', 'idealpos', 'idealposition', 'rolle', 'role']);
  const number = field(row, ['number', 'nr', 'nummer', 'trikotnummer', 'jersey', 'jersey number', 'shirt number']);
  const team = field(row, ['team', 'club', 'verein', 'mannschaft']) || CREWE_DEFAULT_TEAM;
  const nationality = field(row, ['nation', 'nationality', 'land']);
  const birthdate = field(row, ['geb', 'geburtsdatum', 'birthdate', 'date of birth']);
  const status = normalizeStatus(field(row, ['status', 'sammlung', 'collection status']));
  const imageUrl = field(row, ['image', 'imageurl', 'image url', 'photo', 'foto', 'bild']);
  const value = field(row, ['transferwert', 'wert', 'value']);
  const wage = field(row, ['gehalt', 'wage']);
  const contractEnd = field(row, ['endet', 'vertrag bis', 'contract end']);
  const apps = field(row, ['einsaetze', 'einsätze', 'apps', 'appearances']);
  const goals = field(row, ['tore', 'goals']);
  const assists = field(row, ['vorlagen', 'assists']);
  const rating = field(row, ['wertung', 'rating', 'note']);

  const descriptionParts = [
    rawPosition ? `CSV-Position: ${rawPosition}` : '',
    nationality ? `Nation: ${nationality}` : '',
    birthdate ? `Geboren: ${birthdate}` : '',
    value ? `Wert: ${value}` : '',
    wage ? `Gehalt: ${wage}` : '',
    contractEnd ? `Vertrag bis: ${contractEnd}` : '',
    apps || goals || assists || rating
      ? `Saison: ${apps || '0'} Einsätze, ${goals || '0'} Tore, ${assists || '0'} Vorlagen${rating ? `, Wertung ${rating}` : ''}`
      : '',
  ].filter(Boolean);

  return {
    source,
    sourceRow: Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeValue(value)])),
    values: {
      number,
      name,
      team,
      position: normalizeImportedPosition(rawPosition),
      status,
      imageUrl,
      description: descriptionParts.join('\n'),
    },
  };
};

export const parseStickerImportText = (text: string, fileName = ''): ParsedStickerImport[] => {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const isJson = /\.json$/i.test(fileName) || trimmed.startsWith('{') || trimmed.startsWith('[');

  if (isJson) {
    const data = JSON.parse(trimmed) as unknown;
    return collectJsonRows(data)
      .map((row) => rowToSticker(row, 'json'))
      .filter((item): item is ParsedStickerImport => Boolean(item));
  }

  return parseCsv(trimmed)
    .map((row) => rowToSticker(row, 'csv'))
    .filter((item): item is ParsedStickerImport => Boolean(item));
};

export const readStickerImportFile = async (file: File) => {
  const text = await file.text();
  return parseStickerImportText(text, file.name);
};
