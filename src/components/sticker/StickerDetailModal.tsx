import type { Sticker } from '../../domain/types';
import { Modal } from '../ui/Modal';
import { PlayerProfilePanel } from './PlayerProfilePanel';

interface StickerDetailModalProps {
  sticker: Sticker;
  onClose: () => void;
  onEdit: (sticker: Sticker) => void;
  onDelete: (sticker: Sticker) => void;
}

export const StickerDetailModal = ({ sticker, onClose }: StickerDetailModalProps) => (
  <Modal title={sticker.name} onClose={onClose} wide variant="fm">
    <PlayerProfilePanel sticker={sticker} />
  </Modal>
);
