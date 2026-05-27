import type { Sticker } from '../../domain/types';
import { Modal } from '../ui/Modal';
import { PlayerProfilePanel } from './PlayerProfilePanel';

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
    wide
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
    <PlayerProfilePanel sticker={sticker} />
  </Modal>
);
