import { useEffect, useReducer, useRef } from 'react';
import { hasStoredAlbum, loadSharedAlbum, loadStoredAlbum, saveStoredAlbum } from '../services/storage';
import { albumReducer } from '../store/albumReducer';

export const useAlbum = () => {
  const [album, dispatch] = useReducer(albumReducer, undefined, loadStoredAlbum);
  const didMount = useRef(false);

  useEffect(() => {
    let isActive = true;

    if (hasStoredAlbum()) return () => {
      isActive = false;
    };

    loadSharedAlbum().then((sharedAlbum) => {
      if (!isActive || !sharedAlbum) return;
      dispatch({ type: 'album/import', payload: sharedAlbum });
      saveStoredAlbum(sharedAlbum);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    saveStoredAlbum(album);
  }, [album]);

  return { album, dispatch };
};
