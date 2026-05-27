import { positionLabel } from '../../config/albumConfig';
import type { Sticker } from '../../domain/types';
import { Modal } from '../ui/Modal';

interface StickerDetailModalProps {
  sticker: Sticker;
  onClose: () => void;
  onEdit: (sticker: Sticker) => void;
  onDelete: (sticker: Sticker) => void;
}

export const StickerDetailModal = ({ sticker, onClose, onEdit, onDelete }: StickerDetailModalProps) => (
  <Modal
    title={sticker.name}
    onClose={onClose}
    footer={
      <>
        <button type="button" className="button button--ghost" onClick={() => onEdit(sticker)}>
          Bearbeiten
        </button>
        <button type="button" className="button button--danger" onClick={() => onDelete(sticker)}>
          Löschen
        </button>
      </>
    }
  >
    <div className="detail-layout">
      <div className="detail-layout__image">
        {sticker.imageUrl ? <img src={sticker.imageUrl} alt="" /> : <span>{sticker.name.slice(0, 1).toUpperCase()}</span>}
      </div>
      <dl className="detail-list">
        <div>
          <dt>Nummer</dt>
          <dd>{sticker.number || '—'}</dd>
        </div>
        <div>
          <dt>Position</dt>
          <dd>{positionLabel(sticker.position)}</dd>
        </div>
        <div>
          <dt>Team / Serie</dt>
          <dd>{sticker.team || '—'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{sticker.status === 'double' ? 'Doppelt' : sticker.status === 'wanted' ? 'Gesucht' : 'Im Besitz'}</dd>
        </div>
      </dl>
    </div>

    {sticker.description ? <p className="detail-note">{sticker.description}</p> : null}
  </Modal>
);
