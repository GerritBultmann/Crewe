import { categoryById } from '../config/albumConfig';
import { createId } from './ids';
import { nowIso } from './album';
import type { AlbumSlot, Sticker, StickerPosition, StickerStatus } from './types';

export interface StickerFormValues {
  id?: string;
  number: string;
  name: string;
  team: string;
  position: StickerPosition;
  status: StickerStatus;
  imageUrl: string;
  description: string;
}

export const createStickerFromForm = (values: StickerFormValues, cardNumber: number): Sticker => {
  const timestamp = nowIso();

  return {
    id: values.id ?? createId('sticker'),
    cardNumber,
    number: values.number.trim(),
    name: values.name.trim(),
    team: values.team.trim(),
    position: values.position,
    status: values.status,
    imageUrl: values.imageUrl.trim() || undefined,
    description: values.description.trim() || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const updateStickerFromForm = (sticker: Sticker, values: StickerFormValues): Sticker => ({
  ...sticker,
  number: values.number.trim(),
  name: values.name.trim(),
  team: values.team.trim(),
  position: values.position,
  status: values.status,
  imageUrl: values.imageUrl.trim() || undefined,
  description: values.description.trim() || undefined,
  updatedAt: nowIso(),
});

export const isStickerCompatibleWithSlot = (sticker: Sticker, slot: AlbumSlot) => {
  const category = categoryById(slot.categoryId);
  return Boolean(category?.acceptedPositions.includes(sticker.position));
};

export const stickerIdentityKey = (sticker: Pick<Sticker, 'name' | 'team'>) =>
  `${sticker.name}|${sticker.team}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
