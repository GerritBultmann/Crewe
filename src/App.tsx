import { useState } from 'react';
import { AlbumSpreadView } from './components/album/AlbumSpreadView';
import { AlbumToolbar } from './components/album/AlbumToolbar';
import { SpreadNavigator } from './components/album/SpreadNavigator';
import { StickerCollection } from './components/sticker/StickerCollection';
import { StickerDetailModal } from './components/sticker/StickerDetailModal';
import { StickerFormModal } from './components/sticker/StickerFormModal';
import { StickerPreviewModal } from './components/sticker/StickerPreviewModal';
import { useAlbum } from './hooks/useAlbum';
import { downloadAlbumJson, readImportFile } from './services/exportAlbum';
import type { Sticker } from './domain/types';
import type { StickerFormValues } from './domain/stickers';

export const App = () => {
  const { album, dispatch } = useAlbum();
  const [formSticker, setFormSticker] = useState<Sticker | null | undefined>(undefined);
  const [previewSticker, setPreviewSticker] = useState<Sticker | null>(null);
  const [detailSticker, setDetailSticker] = useState<Sticker | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const closeForm = () => setFormSticker(undefined);

  const submitSticker = (values: StickerFormValues) => {
    if (formSticker) {
      dispatch({ type: 'sticker/update', stickerId: formSticker.id, values });
    } else {
      dispatch({ type: 'sticker/create', values });
    }
    closeForm();
  };

  const deleteSticker = (sticker: Sticker) => {
    const confirmed = window.confirm(`Sticker "${sticker.name}" wirklich loeschen?`);
    if (!confirmed) return;
    dispatch({ type: 'sticker/delete', stickerId: sticker.id });
    setPreviewSticker(null);
    setDetailSticker(null);
    closeForm();
  };

  const openProfile = (sticker: Sticker) => {
    setPreviewSticker(null);
    setDetailSticker(sticker);
  };

  const importAlbum = async (file: File) => {
    try {
      const result = await readImportFile(file);

      if (result.type === 'album') {
        dispatch({ type: 'album/import', payload: result.album });
        setNotice('Album-Import erfolgreich. Die Daten wurden lokal gespeichert.');
        return;
      }

      dispatch({ type: 'stickers/import', imports: result.imports });
      setNotice(`${result.imports.length} Sticker aus ${file.name} importiert.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Import fehlgeschlagen.');
    }
  };

  return (
    <main className="app-shell">
      <AlbumToolbar
        album={album}
        onRename={(title) => dispatch({ type: 'album/rename', title })}
        onExport={() => downloadAlbumJson(album)}
        onImport={importAlbum}
      />

      {notice ? (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>×</button>
        </div>
      ) : null}

      <SpreadNavigator album={album} dispatch={dispatch} />

      <div className="workspace-layout">
        <AlbumSpreadView
          album={album}
          dispatch={dispatch}
          onOpenSticker={setPreviewSticker}
          onEditSticker={(sticker) => setFormSticker(sticker)}
          onDeleteSticker={deleteSticker}
        />

        <StickerCollection
          album={album}
          dispatch={dispatch}
          onAdd={() => setFormSticker(null)}
          onOpen={setPreviewSticker}
          onEdit={(sticker) => setFormSticker(sticker)}
          onDelete={deleteSticker}
        />
      </div>

      {formSticker !== undefined ? (
        <StickerFormModal sticker={formSticker} onClose={closeForm} onSubmit={submitSticker} />
      ) : null}

      {previewSticker ? (
        <StickerPreviewModal
          sticker={previewSticker}
          onClose={() => setPreviewSticker(null)}
          onProfile={openProfile}
        />
      ) : null}

      {detailSticker ? (
        <StickerDetailModal
          sticker={detailSticker}
          stickers={album.stickers}
          onClose={() => setDetailSticker(null)}
          onEdit={(sticker) => {
            setDetailSticker(null);
            setFormSticker(sticker);
          }}
          onDelete={deleteSticker}
        />
      ) : null}
    </main>
  );
};
