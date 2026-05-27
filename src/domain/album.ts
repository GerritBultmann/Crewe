import { STICKER_CATEGORIES } from '../config/albumConfig';
import { createId } from './ids';
import type { AlbumData, AlbumSlot, AlbumSpread, AlbumStats, PageSide, Sticker, StickerPosition, StickerStatus } from './types';

const KNOWN_POSITIONS = new Set<StickerPosition>(['TW', 'IV', 'AV', 'DM', 'ZM', 'OM', 'FL', 'ST', 'STAFF', 'SPECIAL']);
const KNOWN_STATUSES = new Set<StickerStatus>(['owned', 'wanted', 'double']);

export const nowIso = () => new Date().toISOString();

export const sortSlots = (slots: AlbumSlot[]) =>
  [...slots].sort((left, right) => {
    if (left.page !== right.page) return left.page === 'left' ? -1 : 1;
    if (left.categoryId !== right.categoryId) return left.categoryId.localeCompare(right.categoryId);
    return left.index - right.index;
  });

export const createSpread = (title = 'Doppelseite 1', subtitle = 'Meine erste Saison'): AlbumSpread => {
  const spreadId = createId('spread');
  const slots = STICKER_CATEGORIES.flatMap((category) =>
    Array.from({ length: category.defaultSlots }, (_, index): AlbumSlot => ({
      id: createId('slot'),
      spreadId,
      categoryId: category.id,
      page: category.page,
      index,
      stickerId: null,
    })),
  );

  return {
    id: spreadId,
    title,
    subtitle,
    createdAt: nowIso(),
    slots,
  };
};

export const createInitialAlbum = (): AlbumData => {
  const spread = createSpread();
  const createdAt = nowIso();

  return {
    schemaVersion: 1,
    title: 'Stickeralbum',
    activeSpreadId: spread.id,
    stickers: [],
    spreads: [spread],
    createdAt,
    updatedAt: createdAt,
  };
};

export const addEmptySlotToCategory = (spread: AlbumSpread, categoryId: string): AlbumSpread => {
  const referenceCategory = STICKER_CATEGORIES.find((category) => category.id === categoryId);
  const categorySlots = spread.slots.filter((slot) => slot.categoryId === categoryId);
  const nextIndex = categorySlots.length
    ? Math.max(...categorySlots.map((slot) => slot.index)) + 1
    : 0;

  return {
    ...spread,
    slots: [
      ...spread.slots,
      {
        id: createId('slot'),
        spreadId: spread.id,
        categoryId,
        page: referenceCategory?.page ?? 'left',
        index: nextIndex,
        stickerId: null,
      },
    ],
  };
};

export const reindexSpreadSlots = (spread: AlbumSpread): AlbumSpread => {
  const slots = STICKER_CATEGORIES.flatMap((category) =>
    spread.slots
      .filter((slot) => slot.categoryId === category.id)
      .sort((left, right) => left.index - right.index)
      .map((slot, index) => ({ ...slot, index, page: category.page })),
  );

  return { ...spread, slots };
};

export const findSticker = (album: AlbumData, stickerId: string) =>
  album.stickers.find((sticker) => sticker.id === stickerId) ?? null;

export const getPlacedStickerIds = (album: AlbumData) =>
  new Set(
    album.spreads.flatMap((spread) =>
      spread.slots.map((slot) => slot.stickerId).filter((stickerId): stickerId is string => Boolean(stickerId)),
    ),
  );

export const getUnplacedStickers = (album: AlbumData) => {
  const placedIds = getPlacedStickerIds(album);
  return album.stickers.filter((sticker) => !placedIds.has(sticker.id));
};

export const getAlbumStats = (album: AlbumData): AlbumStats => {
  const totalSlots = album.spreads.reduce((sum, spread) => sum + spread.slots.length, 0);
  const placed = album.spreads.reduce(
    (sum, spread) => sum + spread.slots.filter((slot) => Boolean(slot.stickerId)).length,
    0,
  );
  const unplaced = getUnplacedStickers(album).length;

  return {
    placed,
    totalSlots,
    unplaced,
    completion: totalSlots === 0 ? 0 : Math.round((placed / totalSlots) * 100),
  };
};

const normalizePosition = (position: unknown): StickerPosition => {
  const value = String(position || 'SPECIAL').toUpperCase() as StickerPosition;
  return KNOWN_POSITIONS.has(value) ? value : 'SPECIAL';
};

const normalizeStatus = (status: unknown): StickerStatus => {
  const value = String(status || 'owned') as StickerStatus;
  return KNOWN_STATUSES.has(value) ? value : 'owned';
};

const normalizeSourceRow = (sourceRow: unknown): Record<string, string> | undefined => {
  if (!sourceRow || typeof sourceRow !== 'object' || Array.isArray(sourceRow)) return undefined;
  return Object.fromEntries(
    Object.entries(sourceRow as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')]),
  );
};

export const normalizeImportedAlbum = (candidate: unknown): AlbumData | null => {
  if (!candidate || typeof candidate !== 'object') return null;
  const value = candidate as Partial<AlbumData>;

  if (value.schemaVersion !== 1 || !Array.isArray(value.spreads) || !Array.isArray(value.stickers)) {
    return null;
  }

  const spreads = value.spreads.map((spread, spreadIndex) => {
    const spreadId = String(spread.id || createId('spread'));

    return {
      id: spreadId,
      title: String(spread.title || `Doppelseite ${spreadIndex + 1}`),
      subtitle: String(spread.subtitle || ''),
      createdAt: String(spread.createdAt || nowIso()),
      slots: Array.isArray(spread.slots)
        ? spread.slots.map((slot, index) => ({
            id: String(slot.id || createId('slot')),
            spreadId,
            categoryId: String(slot.categoryId || STICKER_CATEGORIES[0].id),
            page: (slot.page === 'right' ? 'right' : 'left') as PageSide,
            index: Number.isFinite(slot.index) ? Number(slot.index) : index,
            stickerId: slot.stickerId ? String(slot.stickerId) : null,
          }))
        : [],
    };
  });

  const stickers = value.stickers.map((sticker): Sticker => {
    const timestamp = nowIso();
    const importedFrom = sticker.importedFrom === 'csv' || sticker.importedFrom === 'json' ? sticker.importedFrom : undefined;

    return {
      id: String(sticker.id || createId('sticker')),
      number: String(sticker.number || ''),
      name: String(sticker.name || 'Unbenannter Sticker'),
      team: String(sticker.team || ''),
      position: normalizePosition(sticker.position),
      status: normalizeStatus(sticker.status),
      imageUrl: sticker.imageUrl ? String(sticker.imageUrl) : undefined,
      description: sticker.description ? String(sticker.description) : undefined,
      importedFrom,
      sourceRow: normalizeSourceRow(sticker.sourceRow),
      createdAt: String(sticker.createdAt || timestamp),
      updatedAt: String(sticker.updatedAt || timestamp),
    };
  });

  const stickerIds = new Set(stickers.map((sticker) => sticker.id));
  const repairedSpreads = spreads.map((spread) =>
    reindexSpreadSlots({
      ...spread,
      slots: spread.slots.map((slot) => ({
        ...slot,
        stickerId: slot.stickerId && stickerIds.has(slot.stickerId) ? slot.stickerId : null,
      })),
    }),
  );

  const fallbackSpread = repairedSpreads[0] ?? createSpread();
  const activeSpreadId = repairedSpreads.some((spread) => spread.id === value.activeSpreadId)
    ? String(value.activeSpreadId)
    : fallbackSpread.id;

  return {
    schemaVersion: 1,
    title: String(value.title || 'Stickeralbum'),
    activeSpreadId,
    stickers,
    spreads: repairedSpreads.length ? repairedSpreads : [fallbackSpread],
    createdAt: String(value.createdAt || nowIso()),
    updatedAt: nowIso(),
  };
};
