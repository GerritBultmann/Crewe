import { STORAGE_KEY } from '../config/albumConfig';
import { createInitialAlbum, normalizeImportedAlbum } from '../domain/album';
import type { AlbumData } from '../domain/types';

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

export const saveStoredAlbum = (album: AlbumData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(album));
};

export const clearStoredAlbum = () => {
  localStorage.removeItem(STORAGE_KEY);
};
