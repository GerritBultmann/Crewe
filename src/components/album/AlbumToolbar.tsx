import type { ChangeEvent } from 'react';
import { CREWE_LOGO_URL } from '../../config/albumConfig';
import { getAlbumStats } from '../../domain/album';
import type { AlbumData } from '../../domain/types';

interface AlbumToolbarProps {
  album: AlbumData;
  onRename: (title: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const AlbumToolbar = ({ album, onRename, onExport, onImport }: AlbumToolbarProps) => {
  const stats = getAlbumStats(album);

  const importFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImport(file);
    event.currentTarget.value = '';
  };

  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">
          <img src={CREWE_LOGO_URL} alt="" />
        </div>
        <div>
          <label className="eyebrow" htmlFor="album-title">Lokales Stickeralbum</label>
          <input
            id="album-title"
            className="title-input"
            value={album.title}
            onChange={(event) => onRename(event.target.value)}
            aria-label="Albumtitel"
          />
        </div>
      </div>

      <div className="stats-row" aria-label="Albumfortschritt">
        <span>{stats.placed}/{stats.totalSlots} Plätze</span>
        <strong>{stats.completion}%</strong>
        <span>{stats.unplaced} offen</span>
      </div>

      <div className="toolbar-actions">
        <button type="button" className="button button--primary" onClick={onExport}>
          JSON exportieren
        </button>
        <label className="button button--ghost file-button">
          JSON / CSV importieren
          <input type="file" accept="application/json,.json,text/csv,.csv" onChange={importFile} />
        </label>
      </div>
    </header>
  );
};
