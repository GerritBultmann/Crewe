import type { Dispatch } from 'react';
import { categoryForPosition } from '../../config/albumConfig';
import { getUnplacedStickers } from '../../domain/album';
import type { AlbumData, Sticker } from '../../domain/types';
import type { AlbumAction } from '../../store/albumReducer';
import { StickerCard } from './StickerCard';

interface StickerCollectionProps {
  album: AlbumData;
  dispatch: Dispatch<AlbumAction>;
  onAdd: () => void;
  onOpen: (sticker: Sticker) => void;
  onEdit: (sticker: Sticker) => void;
  onDelete: (sticker: Sticker) => void;
}

export const StickerCollection = ({
  album,
  dispatch,
  onAdd,
  onOpen,
  onEdit,
  onDelete,
}: StickerCollectionProps) => {
  const unplaced = getUnplacedStickers(album);
  const activeSpread = album.spreads.find((spread) => spread.id === album.activeSpreadId) ?? album.spreads[0];

  const placeInFirstSlot = (sticker: Sticker) => {
    const category = categoryForPosition(sticker.position);
    const slot = activeSpread?.slots.find((item) => item.categoryId === category.id && !item.stickerId);

    if (!activeSpread || !slot) return;

    dispatch({ type: 'slot/place', spreadId: activeSpread.id, slotId: slot.id, stickerId: sticker.id });
  };

  return (
    <aside className="collection-panel">
      <header className="collection-panel__header">
        <div>
          <p>Sammlung</p>
          <h2>Noch nicht eingeklebt</h2>
        </div>
        <button type="button" className="button button--primary" onClick={onAdd}>
          Sticker +
        </button>
      </header>

      {unplaced.length ? (
        <div className="collection-list">
          {unplaced.map((sticker) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              onOpen={onOpen}
              onEdit={onEdit}
              onStick={placeInFirstSlot}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>Alle Sticker sind eingeklebt.</strong>
          <span>Lege weitere Sticker an oder füge neue Plätze im Album hinzu.</span>
        </div>
      )}
    </aside>
  );
};
