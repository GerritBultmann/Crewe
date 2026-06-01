import { CREWE_LOGO_URL } from '../../config/albumConfig';
import { profileFromSticker } from '../../domain/playerProfile';
import type { Sticker, StickerPosition } from '../../domain/types';

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

const positionShortLabel: Record<StickerPosition, string> = {
  TW: 'TW',
  IV: 'IV',
  AV: 'AV',
  DM: 'DM',
  ZM: 'ZM',
  OM: 'OM',
  FL: 'FL',
  ST: 'ST',
  STAFF: 'STAFF',
  SPECIAL: 'SP',
};

const positionTheme: Record<StickerPosition, string> = {
  TW: 'keeper',
  IV: 'defense',
  AV: 'defense',
  DM: 'midfield',
  ZM: 'midfield',
  OM: 'creator',
  FL: 'wing',
  ST: 'attack',
  STAFF: 'staff',
  SPECIAL: 'special',
};

const readSource = (sticker: Sticker, keys: string[]) => {
  const source = sticker.sourceRow;
  if (!source) return '';
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  const wanted = keys.map(normalize);
  const match = Object.entries(source).find(([key, value]) => wanted.includes(normalize(key)) && value.trim());
  return match?.[1]?.trim() ?? '';
};

const formatCardNumber = (sticker: Sticker) => {
  const explicit = readSource(sticker, ['kartennummer', 'card number', 'cardNumber', 'album number', 'albumNumber', 'id']);
  const fallback = sticker.number || '0';
  const raw = explicit || fallback;
  const numeric = raw.match(/\d+/)?.[0];
  return numeric ? numeric.padStart(3, '0').slice(-3) : raw.slice(0, 3).toUpperCase();
};

const formatJerseyNumber = (sticker: Sticker) => {
  const explicit = readSource(sticker, ['trikotnummer', 'shirt number', 'jersey number', 'jersey', 'nr', 'number']);
  return explicit || sticker.number || '—';
};

const nationLabel = (value: string) => {
  if (!value || value === '—') return '???';
  const clean = value.replace(/\(.+?\)/g, '').trim();
  if (clean.length <= 3) return clean.toUpperCase();
  return clean.slice(0, 3).toUpperCase();
};

const ageLabel = (age: string, birthdate: string) => {
  if (age) return age;
  const year = birthdate.match(/\b(19|20)\d{2}\b/)?.[0];
  return year ?? '???';
};

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
  const profile = profileFromSticker(sticker);
  const cardNumber = formatCardNumber(sticker);
  const jerseyNumber = formatJerseyNumber(sticker);
  const position = positionShortLabel[sticker.position];
  const theme = positionTheme[sticker.position];
  const age = ageLabel(profile.age, profile.birthdate);
  const nation = nationLabel(profile.nationality);

  return (
    <article
      className={`sticker-card sticker-card--theme-${theme} ${compact ? 'sticker-card--compact' : ''}`}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData('application/sticker-id', sticker.id);
        event.dataTransfer.effectAllowed = 'move';
        onDragStart?.(sticker.id);
      }}
    >
      <button className="sticker-card__hit" type="button" onClick={() => onOpen?.(sticker)}>
        <span className="sticker-card__corner" aria-hidden="true" />
        <span className="sticker-card__card-number">{cardNumber}</span>

        <span className="sticker-card__club-block">
          <span className="sticker-card__club-logo">
            <img src={CREWE_LOGO_URL} alt="" loading="lazy" />
          </span>
          <span className="sticker-card__shirt-number">{jerseyNumber}</span>
        </span>

        <span className="sticker-card__portrait-zone">
          <span className="sticker-card__portrait-frame">
            {sticker.imageUrl ? (
              <img src={sticker.imageUrl} alt="" loading="lazy" />
            ) : (
              <span className="sticker-card__initials">{sticker.name.slice(0, 1).toUpperCase()}</span>
            )}
          </span>
        </span>

        <span className="sticker-card__name">{sticker.name}</span>

        <span className="sticker-card__meta" aria-label="Spielerdaten">
          <span>
            <small>Alter</small>
            <strong>{age}</strong>
          </span>
          <span>
            <small>Position</small>
            <strong>{position}</strong>
          </span>
          <span>
            <small>Land</small>
            <strong>{nation}</strong>
          </span>
        </span>
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
};
