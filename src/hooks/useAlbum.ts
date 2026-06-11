import { useEffect, useReducer, useRef } from 'react';
import { clearStoredAlbum, hasStoredAlbum, loadSharedAlbum, loadStoredAlbum, saveStoredAlbum } from '../services/storage';
import { albumReducer } from '../store/albumReducer';

const shouldForceServerAlbum = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('server') === '1' || params.get('shared') === '1';
};

export const useAlbum = () => {
  const [album, dispatch] = useReducer(albumReducer, undefined, loadStoredAlbum);
  const didMount = useRef(false);

  useEffect(() => {
    let isActive = true;
    const forceServerAlbum = shouldForceServerAlbum();

    if (forceServerAlbum) {
      clearStoredAlbum();
    } else if (hasStoredAlbum()) {
      return () => {
        isActive = false;
      };
    }

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
