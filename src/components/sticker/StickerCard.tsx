import { positionLabel } from '../../config/albumConfig';
import type { Sticker } from '../../domain/types';

interface StickerCardProps {
  sticker: Sticker;
  compact?: boolean;
  draggable?: boolean;
  onOpen?: (sticker: Sticker) => void;
  onEdit?: (sticker: Sticker) => void;
  onStick?: (sticker: Sticker) => void;
  onUnstick?: () => void;
  onDelete?: (sticker: Sticker) => void;
  onDragStart?: (stickerId: string) => void;
}

export const StickerCard = ({
  sticker,
  compact = false,
  draggable = true,
  onOpen,
  onEdit,
  onStick,
  onUnstick,
  onDelete,
  onDragStart,
}: StickerCardProps) => (
  <article
    className={`sticker-card ${compact ? 'sticker-card--compact' : ''}`}
    draggable={draggable}
    onDragStart={(event) => {
      event.dataTransfer.setData('application/sticker-id', sticker.id);
      event.dataTransfer.effectAllowed = 'move';
      onDragStart?.(sticker.id);
    }}
  >
    <button className="sticker-card__hit" type="button" onClick={() => onOpen?.(sticker)}>
      <div className="sticker-card__topline">
        <span className="sticker-card__number">#{sticker.number || '—'}</span>
        <span className={`status-pill status-pill--${sticker.status}`}>
          {sticker.status === 'double' ? 'Doppelt' : sticker.status === 'wanted' ? 'Gesucht' : 'Besitz'}
        </span>
      </div>
      <div className="sticker-card__image">
        {sticker.imageUrl ? <img src={sticker.imageUrl} alt="" /> : <span>{sticker.name.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div className="sticker-card__content">
        <strong>{sticker.name}</strong>
        <span>{positionLabel(sticker.position)}</span>
        {sticker.team ? <small>{sticker.team}</small> : null}
      </div>
    </button>

    <div className="sticker-card__actions">
      {onStick ? (
        <button type="button" onClick={() => onStick(sticker)}>
          Einkleben
        </button>
      ) : null}
      {onUnstick ? (
        <button type="button" onClick={onUnstick}>
          Auskleben
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" onClick={() => onEdit(sticker)}>
          Bearbeiten
        </button>
      ) : null}
      {onDelete ? (
        <button className="danger-link" type="button" onClick={() => onDelete(sticker)}>
          Löschen
        </button>
      ) : null}
    </div>
  </article>
);
