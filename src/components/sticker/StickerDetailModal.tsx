import type { Sticker } from '../../domain/types';
import { Modal } from '../ui/Modal';
import { PlayerProfilePanel } from './PlayerProfilePanel';

interface StickerDetailModalProps {
  sticker: Sticker;
  stickers: Sticker[];
  onClose: () => void;
  onEdit: (sticker: Sticker) => void;
  onDelete: (sticker: Sticker) => void;
}

export const StickerDetailModal = ({ sticker, stickers, onClose, onEdit, onDelete }: StickerDetailModalProps) => (
  <Modal title={sticker.name} onClose={onClose} wide variant="fm">
    <PlayerProfilePanel sticker={sticker} stickers={stickers} onEdit={onEdit} onDelete={onDelete} />
  </Modal>
);
