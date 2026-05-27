import { categoryForPosition, STICKER_CATEGORIES } from '../config/albumConfig';
import {
  addEmptySlotToCategory,
  createSpread,
  nowIso,
  reindexSpreadSlots,
} from '../domain/album';
import {
  createStickerFromForm,
  isStickerCompatibleWithSlot,
  stickerIdentityKey,
  updateStickerFromForm,
} from '../domain/stickers';
import type { ParsedStickerImport } from '../services/importStickers';
import type { AlbumData, AlbumSpread, Sticker } from '../domain/types';
import type { StickerFormValues } from '../domain/stickers';

export type AlbumAction =
  | { type: 'album/import'; payload: AlbumData }
  | { type: 'album/rename'; title: string }
  | { type: 'spread/add' }
  | { type: 'spread/select'; spreadId: string }
  | { type: 'spread/update'; spreadId: string; title: string; subtitle: string }
  | { type: 'spread/delete'; spreadId: string }
  | { type: 'slot/add'; spreadId: string; categoryId: string }
  | { type: 'slot/remove'; spreadId: string; slotId: string }
  | { type: 'slot/place'; spreadId: string; slotId: string; stickerId: string }
  | { type: 'slot/move'; sourceSpreadId: string; sourceSlotId: string; targetSpreadId: string; targetSlotId: string }
  | { type: 'slot/unstick'; spreadId: string; slotId: string }
  | { type: 'sticker/create'; values: StickerFormValues; targetSlotId?: string }
  | { type: 'sticker/update'; stickerId: string; values: StickerFormValues }
  | { type: 'sticker/delete'; stickerId: string }
  | { type: 'stickers/import'; imports: ParsedStickerImport[] };

const touch = (album: AlbumData): AlbumData => ({ ...album, updatedAt: nowIso() });

const updateSpread = (
  album: AlbumData,
  spreadId: string,
  updater: (spread: AlbumSpread) => AlbumSpread,
): AlbumData => ({
  ...album,
  spreads: album.spreads.map((spread) =>
    spread.id === spreadId ? reindexSpreadSlots(updater(spread)) : spread,
  ),
});

const clearStickerFromSlots = (album: AlbumData, stickerId: string): AlbumData => ({
  ...album,
  spreads: album.spreads.map((spread) => ({
    ...spread,
    slots: spread.slots.map((slot) =>
      slot.stickerId === stickerId ? { ...slot, stickerId: null } : slot,
    ),
  })),
});

const findSticker = (album: AlbumData, stickerId: string) =>
  album.stickers.find((sticker) => sticker.id === stickerId) ?? null;

const placeSticker = (
  album: AlbumData,
  spreadId: string,
  slotId: string,
  stickerId: string,
): AlbumData => {
  const sticker = findSticker(album, stickerId);
  if (!sticker) return album;

  const targetSpread = album.spreads.find((spread) => spread.id === spreadId);
  const targetSlot = targetSpread?.slots.find((slot) => slot.id === slotId);
  if (!targetSlot || !isStickerCompatibleWithSlot(sticker, targetSlot)) return album;

  const cleanedAlbum = clearStickerFromSlots(album, stickerId);
  return updateSpread(cleanedAlbum, spreadId, (spread) => ({
    ...spread,
    slots: spread.slots.map((slot) =>
      slot.id === slotId ? { ...slot, stickerId } : slot,
    ),
  }));
};

const moveBetweenSlots = (
  album: AlbumData,
  sourceSpreadId: string,
  sourceSlotId: string,
  targetSpreadId: string,
  targetSlotId: string,
): AlbumData => {
  const sourceSpread = album.spreads.find((spread) => spread.id === sourceSpreadId);
  const targetSpread = album.spreads.find((spread) => spread.id === targetSpreadId);
  const sourceSlot = sourceSpread?.slots.find((slot) => slot.id === sourceSlotId);
  const targetSlot = targetSpread?.slots.find((slot) => slot.id === targetSlotId);
  const sourceSticker = sourceSlot?.stickerId ? findSticker(album, sourceSlot.stickerId) : null;
  const targetSticker = targetSlot?.stickerId ? findSticker(album, targetSlot.stickerId) : null;

  if (!sourceSlot || !targetSlot || !sourceSticker) return album;
  if (!isStickerCompatibleWithSlot(sourceSticker, targetSlot)) return album;
  if (targetSticker && !isStickerCompatibleWithSlot(targetSticker, sourceSlot)) return album;

  return {
    ...album,
    spreads: album.spreads.map((spread) => ({
      ...spread,
      slots: spread.slots.map((slot) => {
        if (slot.id === sourceSlotId && spread.id === sourceSpreadId) {
          return { ...slot, stickerId: targetSlot.stickerId };
        }
        if (slot.id === targetSlotId && spread.id === targetSpreadId) {
          return { ...slot, stickerId: sourceSlot.stickerId };
        }
        return slot;
      }),
    })),
  };
};

const firstCompatibleEmptySlot = (album: AlbumData, sticker: Sticker) => {
  const activeSpread = album.spreads.find((spread) => spread.id === album.activeSpreadId);
  const category = categoryForPosition(sticker.position);
  return activeSpread?.slots.find(
    (slot) => slot.categoryId === category.id && !slot.stickerId && isStickerCompatibleWithSlot(sticker, slot),
  );
};

const upsertImportedStickers = (album: AlbumData, imports: ParsedStickerImport[]): AlbumData => {
  if (!imports.length) return album;

  const timestamp = nowIso();
  const importedStickers = imports.map((item) => ({
    sticker: {
      ...createStickerFromForm(item.values),
      importedFrom: item.source,
      sourceRow: item.sourceRow,
      updatedAt: timestamp,
    } satisfies Sticker,
    values: item.values,
  }));

  const byIdentity = new Map(album.stickers.map((sticker) => [stickerIdentityKey(sticker), sticker]));
  const nextStickers = [...album.stickers];
  const importedIds: string[] = [];

  for (const { sticker } of importedStickers) {
    const identity = stickerIdentityKey(sticker);
    const existing = byIdentity.get(identity);

    if (existing) {
      const updated: Sticker = {
        ...existing,
        number: sticker.number || existing.number,
        name: sticker.name || existing.name,
        team: sticker.team || existing.team,
        position: sticker.position,
        status: sticker.status,
        imageUrl: sticker.imageUrl ?? existing.imageUrl,
        description: sticker.description || existing.description,
        importedFrom: sticker.importedFrom,
        sourceRow: sticker.sourceRow,
        updatedAt: timestamp,
      };
      const index = nextStickers.findIndex((item) => item.id === existing.id);
      if (index >= 0) nextStickers[index] = updated;
      byIdentity.set(identity, updated);
      importedIds.push(updated.id);
    } else {
      nextStickers.push(sticker);
      byIdentity.set(identity, sticker);
      importedIds.push(sticker.id);
    }
  }

  let nextAlbum: AlbumData = { ...album, stickers: nextStickers };

  for (const stickerId of importedIds) {
    const sticker = findSticker(nextAlbum, stickerId);
    if (!sticker) continue;
    const targetSlot = firstCompatibleEmptySlot(nextAlbum, sticker);
    if (!targetSlot) continue;
    nextAlbum = placeSticker(nextAlbum, nextAlbum.activeSpreadId, targetSlot.id, sticker.id);
  }

  return nextAlbum;
};

export const albumReducer = (state: AlbumData, action: AlbumAction): AlbumData => {
  switch (action.type) {
    case 'album/import':
      return touch(action.payload);

    case 'album/rename':
      return touch({ ...state, title: action.title.trim() || 'Stickeralbum' });

    case 'spread/add': {
      const nextNumber = state.spreads.length + 1;
      const spread = createSpread(`Doppelseite ${nextNumber}`, `Saison ${nextNumber}`);
      return touch({
        ...state,
        activeSpreadId: spread.id,
        spreads: [...state.spreads, spread],
      });
    }

    case 'spread/select':
      return state.spreads.some((spread) => spread.id === action.spreadId)
        ? { ...state, activeSpreadId: action.spreadId }
        : state;

    case 'spread/update':
      return touch(
        updateSpread(state, action.spreadId, (spread) => ({
          ...spread,
          title: action.title.trim() || spread.title,
          subtitle: action.subtitle.trim(),
        })),
      );

    case 'spread/delete': {
      if (state.spreads.length <= 1) return state;
      const spreads = state.spreads.filter((spread) => spread.id !== action.spreadId);
      const activeSpreadId = state.activeSpreadId === action.spreadId ? spreads[0].id : state.activeSpreadId;
      return touch({ ...state, spreads, activeSpreadId });
    }

    case 'slot/add':
      return touch(
        updateSpread(state, action.spreadId, (spread) => addEmptySlotToCategory(spread, action.categoryId)),
      );

    case 'slot/remove':
      return touch(
        updateSpread(state, action.spreadId, (spread) => {
          const slot = spread.slots.find((item) => item.id === action.slotId);
          if (!slot || slot.stickerId) return spread;
          return {
            ...spread,
            slots: spread.slots.filter((item) => item.id !== action.slotId),
          };
        }),
      );

    case 'slot/place':
      return touch(placeSticker(state, action.spreadId, action.slotId, action.stickerId));

    case 'slot/move':
      return touch(
        moveBetweenSlots(
          state,
          action.sourceSpreadId,
          action.sourceSlotId,
          action.targetSpreadId,
          action.targetSlotId,
        ),
      );

    case 'slot/unstick':
      return touch(
        updateSpread(state, action.spreadId, (spread) => ({
          ...spread,
          slots: spread.slots.map((slot) =>
            slot.id === action.slotId ? { ...slot, stickerId: null } : slot,
          ),
        })),
      );

    case 'sticker/create': {
      const sticker = createStickerFromForm(action.values);
      const stateWithSticker = touch({ ...state, stickers: [...state.stickers, sticker] });
      const targetSlotId = action.targetSlotId ?? firstCompatibleEmptySlot(stateWithSticker, sticker)?.id;
      if (!targetSlotId) return stateWithSticker;
      return touch(placeSticker(stateWithSticker, state.activeSpreadId, targetSlotId, sticker.id));
    }

    case 'sticker/update': {
      const current = findSticker(state, action.stickerId);
      if (!current) return state;
      const updatedSticker = updateStickerFromForm(current, action.values);
      const updatedState = {
        ...state,
        stickers: state.stickers.map((sticker) =>
          sticker.id === action.stickerId ? updatedSticker : sticker,
        ),
      };

      return touch({
        ...updatedState,
        spreads: updatedState.spreads.map((spread) => ({
          ...spread,
          slots: spread.slots.map((slot) => {
            if (slot.stickerId !== updatedSticker.id) return slot;
            return isStickerCompatibleWithSlot(updatedSticker, slot) ? slot : { ...slot, stickerId: null };
          }),
        })),
      });
    }

    case 'sticker/delete':
      return touch({
        ...clearStickerFromSlots(state, action.stickerId),
        stickers: state.stickers.filter((sticker) => sticker.id !== action.stickerId),
      });

    case 'stickers/import':
      return touch(upsertImportedStickers(state, action.imports));

    default:
      return state;
  }
};

export const categories = STICKER_CATEGORIES;
