import { normalizeImportedAlbum } from '../domain/album';
import type { AlbumData } from '../domain/types';
import { parseStickerImportText } from './importStickers';

export type AlbumImportResult =
  | { type: 'album'; album: AlbumData }
  | { type: 'stickers'; imports: ReturnType<typeof parseStickerImportText> };

export const safeFileName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'stickeralbum';

export const downloadAlbumJson = (album: AlbumData) => {
  const payload = JSON.stringify(album, null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `${safeFileName(album.title)}-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const readAlbumJsonFile = async (file: File): Promise<AlbumData> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as unknown;
  const album = normalizeImportedAlbum(parsed);

  if (!album) {
    throw new Error('Die Datei ist kein gueltiger Stickeralbum-Export.');
  }

  return album;
};

export const readImportFile = async (file: File): Promise<AlbumImportResult> => {
  const text = await file.text();

  if (/\.json$/i.test(file.name) || text.trim().startsWith('{')) {
    try {
      const album = normalizeImportedAlbum(JSON.parse(text) as unknown);
      if (album) return { type: 'album', album };
    } catch {
      // Fallback below: JSON can also be a roster/player import.
    }
  }

  const imports = parseStickerImportText(text, file.name);
  if (!imports.length) {
    throw new Error('Die Datei enthaelt keine importierbaren Sticker. Erwartet wird ein Album-JSON oder eine CSV/JSON-Spielerliste.');
  }

  return { type: 'stickers', imports };
};
