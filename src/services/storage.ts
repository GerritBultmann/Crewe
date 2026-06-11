import { STORAGE_KEY } from '../config/albumConfig';
import { createInitialAlbum, normalizeImportedAlbum } from '../domain/album';
import type { AlbumData } from '../domain/types';

export const hasStoredAlbum = () => Boolean(localStorage.getItem(STORAGE_KEY));

export const loadStoredAlbum = (): AlbumData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAlbum();
    return normalizeImportedAlbum(JSON.parse(raw)) ?? createInitialAlbum();
  } catch (error) {
    console.warn('Albumdaten konnten nicht gelesen werden.', error);
    return createInitialAlbum();
  }
};

export const loadSharedAlbum = async (): Promise<AlbumData | null> => {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const response = await fetch(`${baseUrl}album-data.json`, { cache: 'no-store' });

    if (!response.ok) return null;

    const album = normalizeImportedAlbum(await response.json());
    return album;
  } catch (error) {
    console.warn('Geteilte Albumdaten konnten nicht geladen werden.', error);
    return null;
  }
};

export const saveStoredAlbum = (album: AlbumData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(album));
};

export const clearStoredAlbum = () => {
  localStorage.removeItem(STORAGE_KEY);
};
