import type { Dispatch } from 'react';
import { useMemo, useState } from 'react';
import { getUnplacedStickers } from '../../domain/album';
import type { AlbumAction } from '../../store/albumReducer';
import type { AlbumData, Sticker } from '../../domain/types';
import { AlbumPage } from './AlbumPage';

interface AlbumSpreadViewProps {
  album: AlbumData;
  dispatch: Dispatch<AlbumAction>;
  onOpenSticker: (sticker: Sticker) => void;
  onEditSticker: (sticker: Sticker) => void;
  onDeleteSticker: (sticker: Sticker) => void;
}

export const AlbumSpreadView = ({
  album,
  dispatch,
  onOpenSticker,
  onEditSticker,
  onDeleteSticker,
}: AlbumSpreadViewProps) => {
  const [sourceSlotId, setSourceSlotId] = useState<string | null>(null);
  const spread = album.spreads.find((item) => item.id === album.activeSpreadId) ?? album.spreads[0];
  const stickersById = useMemo(() => new Map(album.stickers.map((sticker) => [sticker.id, sticker])), [album.stickers]);
  const unplacedStickers = useMemo(() => getUnplacedStickers(album), [album]);

  if (!spread) return null;

  const onMove = (sourceSlot: string, targetSlot: string) => {
    dispatch({
      type: 'slot/move',
      sourceSpreadId: spread.id,
      sourceSlotId: sourceSlot,
      targetSpreadId: spread.id,
      targetSlotId: targetSlot,
    });
    setSourceSlotId(null);
  };

  return (
    <div
      className="album-spread"
      onDragStart={(event) => {
        const sourceSlot = event.dataTransfer.getData('application/source-slot-id');
        if (sourceSlot) setSourceSlotId(sourceSlot);
      }}
      onDragEnd={() => setSourceSlotId(null)}
    >
      <AlbumPage
        side="left"
        spread={spread}
        stickersById={stickersById}
        unplacedStickers={unplacedStickers}
        sourceSlotId={sourceSlotId}
        onAddSlot={(categoryId) => dispatch({ type: 'slot/add', spreadId: spread.id, categoryId })}
        onPlace={(slotId, stickerId) => dispatch({ type: 'slot/place', spreadId: spread.id, slotId, stickerId })}
        onMove={onMove}
        onUnstick={(slotId) => dispatch({ type: 'slot/unstick', spreadId: spread.id, slotId })}
        onRemoveSlot={(slotId) => dispatch({ type: 'slot/remove', spreadId: spread.id, slotId })}
        onOpenSticker={onOpenSticker}
        onEditSticker={onEditSticker}
        onDeleteSticker={onDeleteSticker}
      />
      <AlbumPage
        side="right"
        spread={spread}
        stickersById={stickersById}
        unplacedStickers={unplacedStickers}
        sourceSlotId={sourceSlotId}
        onAddSlot={(categoryId) => dispatch({ type: 'slot/add', spreadId: spread.id, categoryId })}
        onPlace={(slotId, stickerId) => dispatch({ type: 'slot/place', spreadId: spread.id, slotId, stickerId })}
        onMove={onMove}
        onUnstick={(slotId) => dispatch({ type: 'slot/unstick', spreadId: spread.id, slotId })}
        onRemoveSlot={(slotId) => dispatch({ type: 'slot/remove', spreadId: spread.id, slotId })}
        onOpenSticker={onOpenSticker}
        onEditSticker={onEditSticker}
        onDeleteSticker={onDeleteSticker}
      />
    </div>
  );
};
