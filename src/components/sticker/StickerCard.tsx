import { CREWE_LOGO_URL } from '../../config/albumConfig';
import { buildStickerCardViewModel } from '../../domain/stickerCard';
import type { Sticker } from '../../domain/types';

interface StickerCardProps {
  sticker: Sticker;
  compact?: boolean;
  draggable?: boolean;
  interactive?: boolean;
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
  interactive = true,
  onOpen,
  onEdit,
  onStick,
  onUnstick,
  onDelete,
  onDragStart,
}: StickerCardProps) => {
  const card = buildStickerCardViewModel(sticker);
  const Wrapper = interactive ? 'button' : 'div';

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
      <Wrapper
        className="sticker-card__hit"
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => onOpen?.(sticker) : undefined}
        aria-label={interactive ? `${card.fullName} öffnen` : undefined}
      >
        <span className="sticker-card__pattern" aria-hidden="true" />
        <span className="sticker-card__shine" aria-hidden="true" />

        <span className="sticker-card__top-left">
          <strong>{card.cardNumber}</strong>
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
            <small>Nation</small>
            <strong>{card.country}</strong>
          </span>
          <span>
            <small>Position</small>
            <strong>{card.position}</strong>
          </span>
          <span>
            <small>Alter</small>
            <strong>{card.age}</strong>
          </span>
        </span>
      </Wrapper>

      <div className="sticker-card__actions">
        {onStick ? <button type="button" onClick={() => onStick(sticker)}>Einkleben</button> : null}
        {onUnstick ? <button type="button" onClick={onUnstick}>Auskleben</button> : null}
        {onEdit ? <button type="button" onClick={() => onEdit(sticker)}>Bearbeiten</button> : null}
        {onDelete ? <button className="danger-link" type="button" onClick={() => onDelete(sticker)}>Löschen</button> : null}
      </div>
    </article>
  );
};
