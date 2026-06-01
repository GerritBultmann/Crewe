export type PageSide = 'left' | 'right';

export type StickerStatus = 'owned' | 'wanted' | 'double';

export type StickerPosition =
  | 'TW'
  | 'IV'
  | 'AV'
  | 'DM'
  | 'ZM'
  | 'OM'
  | 'FL'
  | 'ST'
  | 'STAFF'
  | 'SPECIAL';

export interface StickerCategory {
  id: string;
  title: string;
  page: PageSide;
  acceptedPositions: StickerPosition[];
  defaultSlots: number;
  accent: string;
}

export interface Sticker {
  id: string;
  cardNumber: number;
  number: string;
  name: string;
  team: string;
  position: StickerPosition;
  status: StickerStatus;
  imageUrl?: string;
  description?: string;
  importedFrom?: 'json' | 'csv';
  sourceRow?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumSlot {
  id: string;
  spreadId: string;
  categoryId: string;
  page: PageSide;
  index: number;
  stickerId: string | null;
}

export interface AlbumSpread {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  slots: AlbumSlot[];
}

export interface AlbumData {
  schemaVersion: 1;
  title: string;
  activeSpreadId: string;
  stickers: Sticker[];
  spreads: AlbumSpread[];
  createdAt: string;
  updatedAt: string;
}

export interface AlbumStats {
  placed: number;
  totalSlots: number;
  unplaced: number;
  completion: number;
}
