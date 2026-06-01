import { CREWE_LOGO_URL } from '../../config/albumConfig';
import { buildStickerCardViewModel } from '../../domain/stickerCard';
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
}: StickerCardProps) => {
  const card = buildStickerCardViewModel(sticker);

  return (
    <article
      className={`sticker-card sticker-card--${card.theme} ${compact ? 'sticker-card--compact' : ''}`}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData('application/sticker-id', sticker.id);
        event.dataTransfer.effectAllowed = 'move';
        onDragStart?.(sticker.id);
      }}
    >
      <button className="sticker-card__hit" type="button" onClick={() => onOpen?.(sticker)} aria-label={`${card.fullName} öffnen`}>
        <span className="sticker-card__pattern" aria-hidden="true" />
        <span className="sticker-card__shine" aria-hidden="true" />

        <span className="sticker-card__top-left">
          <span>{card.edition}</span>
          <strong>{card.cardNumber}/1000</strong>
        </span>

        <span className="sticker-card__top-right">
          <span className="sticker-card__club-mark">
            <img src={CREWE_LOGO_URL} alt="" loading="lazy" />
          </span>
          <strong>{card.jerseyNumber}</strong>
        </span>

        <span className="sticker-card__player-area">
          {sticker.imageUrl ? (
            <img src={sticker.imageUrl} alt="" loading="lazy" />
          ) : (
            <span className="sticker-card__placeholder">{card.fullName.slice(0, 1).toUpperCase()}</span>
          )}
        </span>

        <span className="sticker-card__glow-panel" aria-hidden="true" />

        <span className="sticker-card__name">
          <strong>{card.givenName}</strong>
          {card.familyName ? <strong>{card.familyName}</strong> : null}
        </span>

        <span className="sticker-card__meta" aria-label="Spielerdaten">
          <span>
            <small>Age</small>
            <strong>{card.age}</strong>
          </span>
          <span>
            <small>Position</small>
            <strong>{card.position}</strong>
          </span>
          <span>
            <small>Country</small>
            <strong>{card.country}</strong>
          </span>
        </span>
      </button>

      <div className="sticker-card__actions">
        {onStick ? <button type="button" onClick={() => onStick(sticker)}>Einkleben</button> : null}
        {onUnstick ? <button type="button" onClick={onUnstick}>Auskleben</button> : null}
        {onEdit ? <button type="button" onClick={() => onEdit(sticker)}>Bearbeiten</button> : null}
        {onDelete ? <button className="danger-link" type="button" onClick={() => onDelete(sticker)}>Löschen</button> : null}
      </div>
    </article>
  );
};
