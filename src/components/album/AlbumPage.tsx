import type { CSSProperties } from 'react';
import { STICKER_CATEGORIES, categoryById } from '../../config/albumConfig';
import type { AlbumSlot, AlbumSpread, PageSide, Sticker } from '../../domain/types';
import { StickerSlot } from './StickerSlot';

interface AlbumPageProps {
  side: PageSide;
  spread: AlbumSpread;
  stickersById: Map<string, Sticker>;
  unplacedStickers: Sticker[];
  sourceSlotId: string | null;
  onAddSlot: (categoryId: string) => void;
  onPlace: (slotId: string, stickerId: string) => void;
  onMove: (sourceSlotId: string, targetSlotId: string) => void;
  onUnstick: (slotId: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onOpenSticker: (sticker: Sticker) => void;
  onEditSticker: (sticker: Sticker) => void;
  onDeleteSticker: (sticker: Sticker) => void;
}

export const AlbumPage = ({
  side,
  spread,
  stickersById,
  unplacedStickers,
  sourceSlotId,
  onAddSlot,
  onPlace,
  onMove,
  onUnstick,
  onRemoveSlot,
  onOpenSticker,
  onEditSticker,
  onDeleteSticker,
}: AlbumPageProps) => {
  const categories = STICKER_CATEGORIES.filter((category) => category.page === side);

  const slotsForCategory = (categoryId: string): AlbumSlot[] =>
    spread.slots
      .filter((slot) => slot.categoryId === categoryId)
      .sort((left, right) => left.index - right.index);

  return (
    <section className={`album-page album-page--${side}`}>
      <header className="album-page__header">
        <div>
          <p>{side === 'left' ? 'Linke Seite' : 'Rechte Seite'}</p>
          <h2>{side === 'left' ? spread.title : spread.subtitle}</h2>
        </div>
        <span>{spread.slots.filter((slot) => slot.page === side && slot.stickerId).length} eingeklebt</span>
      </header>

      {categories.map((category) => {
        const slots = slotsForCategory(category.id);
        const compatibleStickers = unplacedStickers.filter((sticker) =>
          category.acceptedPositions.includes(sticker.position),
        );

        return (
          <section className="album-category" key={category.id}>
            <div className="album-category__header" style={{ '--category-accent': category.accent } as CSSProperties}>
              <div>
                <h3>{category.title}</h3>
                <span>
                  {slots.filter((slot) => slot.stickerId).length}/{slots.length} Plätze belegt
                </span>
              </div>
              <button type="button" onClick={() => onAddSlot(category.id)}>
                Platz +
              </button>
            </div>

            <div className="slot-grid">
              {slots.map((slot) => {
                const sticker = slot.stickerId ? stickersById.get(slot.stickerId) ?? null : null;
                const slotCategory = categoryById(slot.categoryId);
                const slotCompatibleStickers = unplacedStickers.filter((candidate) =>
                  slotCategory?.acceptedPositions.includes(candidate.position),
                );

                return (
                  <StickerSlot
                    key={slot.id}
                    slot={slot}
                    sticker={sticker}
                    compatibleStickers={slotCompatibleStickers}
                    onPlace={onPlace}
                    onMove={(targetSlotId) => {
                      if (sourceSlotId) onMove(sourceSlotId, targetSlotId);
                    }}
                    onUnstick={onUnstick}
                    onRemoveSlot={onRemoveSlot}
                    onOpenSticker={onOpenSticker}
                    onEditSticker={onEditSticker}
                    onDeleteSticker={onDeleteSticker}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
};
