import { useState, type PointerEvent } from 'react';
import type { Sticker } from '../../domain/types';
import { StickerCard } from './StickerCard';

interface StickerPreviewModalProps {
  sticker: Sticker;
  onClose: () => void;
  onProfile: (sticker: Sticker) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const PREVIEW_SCALE = 2.65;

export const StickerPreviewModal = ({ sticker, onClose, onProfile }: StickerPreviewModalProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const updateRotation = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: clamp(y * -18, -18, 18), y: clamp(x * 18, -18, 18) });
  };

  return (
    <div className="card-preview-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="card-preview-modal" role="dialog" aria-modal="true" aria-label={`${sticker.name} Vorschau`} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="card-preview-close" onClick={onClose} aria-label="Vorschau schließen">×</button>
        <div
          className="card-preview-stage"
          onPointerMove={updateRotation}
          onPointerLeave={() => setRotation({ x: 0, y: 0 })}
          onClick={() => onProfile(sticker)}
        >
          <div className="card-preview-tilt" style={{ transform: `scale(${PREVIEW_SCALE}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
            <StickerCard sticker={sticker} compact draggable={false} interactive={false} />
          </div>
        </div>
        <button type="button" className="card-preview-profile-button" onClick={() => onProfile(sticker)}>
          Zum Profil
        </button>
      </section>
    </div>
  );
};
