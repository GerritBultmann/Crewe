import type { CSSProperties, DragEvent } from 'react';
import { categoryById } from '../../config/albumConfig';
import { isStickerCompatibleWithSlot } from '../../domain/stickers';
import type { AlbumSlot, Sticker } from '../../domain/types';
import { StickerCard } from '../sticker/StickerCard';

interface StickerSlotProps {
  slot: AlbumSlot;
  sticker: Sticker | null;
  compatibleStickers: Sticker[];
  onPlace: (slotId: string, stickerId: string) => void;
  onMove: (targetSlotId: string) => void;
  onUnstick: (slotId: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onOpenSticker: (sticker: Sticker) => void;
  onEditSticker: (sticker: Sticker) => void;
  onDeleteSticker: (sticker: Sticker) => void;
}

export const StickerSlot = ({
  slot,
  sticker,
  compatibleStickers,
  onPlace,
  onMove,
  onUnstick,
  onRemoveSlot,
  onOpenSticker,
  onEditSticker,
  onDeleteSticker,
}: StickerSlotProps) => {
  const category = categoryById(slot.categoryId);

  const acceptDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('slot--drag-over');
    const stickerId = event.dataTransfer.getData('application/sticker-id');
    const sourceSlotId = event.dataTransfer.getData('application/source-slot-id');

    if (sourceSlotId) {
      onMove(slot.id);
      return;
    }

    if (stickerId) onPlace(slot.id, stickerId);
  };

  const canDropSticker = (event: DragEvent<HTMLDivElement>) => {
    const stickerId = event.dataTransfer.getData('application/sticker-id');
    const sourceSlotId = event.dataTransfer.getData('application/source-slot-id');
    if (sourceSlotId) return true;
    if (!stickerId) return true;
    const draggedSticker = compatibleStickers.find((item) => item.id === stickerId);
    return draggedSticker ? isStickerCompatibleWithSlot(draggedSticker, slot) : true;
  };

  return (
    <div
      className={`slot ${sticker ? 'slot--filled' : 'slot--empty'}`}
      onDragOver={(event) => {
        if (!canDropSticker(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('slot--drag-over');
      }}
      onDragLeave={(event) => event.currentTarget.classList.remove('slot--drag-over')}
      onDrop={acceptDrop}
      style={{ '--slot-accent': category?.accent } as CSSProperties}
    >
      {sticker ? (
        <div
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('application/source-slot-id', slot.id);
            event.dataTransfer.setData('application/sticker-id', sticker.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
        >
          <StickerCard
            sticker={sticker}
            compact
            draggable={false}
            onOpen={onOpenSticker}
            onEdit={onEditSticker}
            onUnstick={() => onUnstick(slot.id)}
            onDelete={onDeleteSticker}
          />
        </div>
      ) : (
        <div className="slot__empty-content">
          <span>Freier Platz</span>
          <strong>{category?.title ?? 'Kategorie'}</strong>
          <select
            value=""
            aria-label="Sticker fuer diesen Platz auswaehlen"
            onChange={(event) => {
              if (event.target.value) onPlace(slot.id, event.target.value);
            }}
          >
            <option value="">Sticker einkleben…</option>
            {compatibleStickers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.number ? `#${item.number} ` : ''}{item.name}
              </option>
            ))}
          </select>
          <button type="button" className="text-button" onClick={() => onRemoveSlot(slot.id)}>
            Platz entfernen
          </button>
        </div>
      )}
    </div>
  );
};
