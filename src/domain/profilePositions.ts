import type { PlayerProfile } from './playerProfile';
import type { StickerPosition } from './types';

const add = (set: Set<string>, ...ids: string[]) => ids.forEach((id) => set.add(id));

const normalizeRawPosition = (value: string) =>
  value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const hasLeft = (raw: string) => /\((?:[^)]*L[^)]*)\)|\bL\b|\bLEFT\b/.test(raw);
const hasRight = (raw: string) => /\((?:[^)]*R[^)]*)\)|\bR\b|\bRIGHT\b/.test(raw);
const hasCentre = (raw: string) => /\((?:[^)]*[CZ][^)]*)\)|\bC\b|\bZ\b|CENTRE|CENTER|ZENTRAL/.test(raw);

export const playablePositionIdsFromRaw = (position: StickerPosition, rawPosition = '') => {
  const raw = normalizeRawPosition(rawPosition);
  const ids = new Set<string>();

  if (/\b(TW|GK)\b|TORWART|GOALKEEPER/.test(raw) || position === 'TW') add(ids, 'GK');

  if (/\bD\s*\/\s*WB\b|\bV\s*\/\s*(?:FV|AV)\b/.test(raw)) {
    if (hasLeft(raw)) add(ids, 'LV', 'LAV');
    if (hasRight(raw)) add(ids, 'RV', 'RAV');
  }

  if (/\bWB\b|FLUGELVERTEIDIGER|WING\s*BACK|\bLAV\b|\bRAV\b/.test(raw)) {
    if (hasLeft(raw) || /\bLAV\b/.test(raw)) add(ids, 'LAV');
    if (hasRight(raw) || /\bRAV\b/.test(raw)) add(ids, 'RAV');
  }

  if (/\bD\b|\bV\b|DEFENDER|VERTEIDIGER|\bLB\b|\bRB\b|\bCB\b|\bDC\b|\bIV\b|\bLV\b|\bRV\b/.test(raw) || ['IV', 'AV'].includes(position)) {
    if (hasLeft(raw) || /\b(LB|LV)\b/.test(raw)) add(ids, 'LV');
    if (hasRight(raw) || /\b(RB|RV)\b/.test(raw)) add(ids, 'RV');
    if (hasCentre(raw) || /\b(CB|DC|IV)\b/.test(raw) || position === 'IV') add(ids, 'IV');
    if (position === 'AV' && !hasLeft(raw) && !hasRight(raw)) add(ids, 'LV', 'RV');
  }

  if (/\bDM\b|\bCDM\b|DEFENSIV(?:ES)? MITTELFELD/.test(raw) || position === 'DM') add(ids, 'DM');

  if (/\bM\s*\/\s*AM\b|\bM\s*\/\s*OM\b/.test(raw)) {
    if (hasLeft(raw)) add(ids, 'LM', 'LA');
    if (hasRight(raw)) add(ids, 'RM', 'RA');
    if (hasCentre(raw)) add(ids, 'ZM', 'OM');
  }

  if (/\bM\b|MITTELFELD|\bCM\b|\bMC\b|\bZM\b|\bLM\b|\bRM\b/.test(raw) || position === 'ZM') {
    if (hasLeft(raw) || /\bLM\b/.test(raw)) add(ids, 'LM');
    if (hasRight(raw) || /\bRM\b/.test(raw)) add(ids, 'RM');
    if (hasCentre(raw) || /\b(CM|MC|ZM)\b/.test(raw) || position === 'ZM') add(ids, 'ZM');
  }

  if (/\bAM\b|\bOM\b|OFFENSIV(?:ES)? MITTELFELD|\bAMC\b|\bAML\b|\bAMR\b|\bLW\b|\bRW\b/.test(raw) || ['OM', 'FL'].includes(position)) {
    if (hasLeft(raw) || /\b(AML|LW)\b/.test(raw)) add(ids, 'LA');
    if (hasRight(raw) || /\b(AMR|RW)\b/.test(raw)) add(ids, 'RA');
    if (hasCentre(raw) || /\b(AMC|OM)\b/.test(raw) || position === 'OM') add(ids, 'OM');
    if (position === 'FL' && !hasLeft(raw) && !hasRight(raw)) add(ids, 'LA', 'RA');
  }

  if (/\bST\b|\bSC\b|\bMS\b|STURMER|STRIKER|FORWARD|ANGRIFF/.test(raw) || position === 'ST') add(ids, 'MS');

  if (!ids.size) {
    const fallbackByStickerPosition: Record<StickerPosition, string[]> = {
      TW: ['GK'],
      IV: ['IV'],
      AV: ['LV', 'RV'],
      DM: ['DM'],
      ZM: ['ZM'],
      OM: ['OM'],
      FL: ['LA', 'RA'],
      ST: ['MS'],
      STAFF: [],
      SPECIAL: [],
    };
    add(ids, ...(fallbackByStickerPosition[position] ?? []));
  }

  return Array.from(ids);
};

export const playablePositionIdsForProfile = (profile: PlayerProfile) =>
  playablePositionIdsFromRaw(profile.position, profile.rawPosition);
