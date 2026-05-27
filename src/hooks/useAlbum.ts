import { useEffect, useReducer, useRef } from 'react';
import { loadStoredAlbum, saveStoredAlbum } from '../services/storage';
import { albumReducer } from '../store/albumReducer';

export const useAlbum = () => {
  const [album, dispatch] = useReducer(albumReducer, undefined, loadStoredAlbum);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    saveStoredAlbum(album);
  }, [album]);

  return { album, dispatch };
};
