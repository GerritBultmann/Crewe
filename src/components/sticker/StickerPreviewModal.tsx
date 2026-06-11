import { useEffect, useRef, type PointerEvent } from 'react';
import type { Sticker } from '../../domain/types';
import { StickerCard } from './StickerCard';

interface StickerPreviewModalProps {
  sticker: Sticker;
  onClose: () => void;
  onProfile: (sticker: Sticker) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const StickerPreviewModal = ({ sticker, onClose, onProfile }: StickerPreviewModalProps) => {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRotation = useRef({ x: 0, y: 0 });

  const applyRotation = (x: number, y: number) => {
    const element = tiltRef.current;
    if (!element) return;

    element.style.setProperty('--preview-rotate-x', `${x.toFixed(2)}deg`);
    element.style.setProperty('--preview-rotate-y', `${y.toFixed(2)}deg`);
  };

  const scheduleRotation = (x: number, y: number) => {
    pendingRotation.current = { x, y };

    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      applyRotation(pendingRotation.current.x, pendingRotation.current.y);
    });
  };

  const updateRotation = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    scheduleRotation(clamp(y * -14, -14, 14), clamp(x * 14, -14, 14));
  };

  const resetRotation = () => {
    scheduleRotation(0, 0);
  };

  useEffect(() => () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return (
    <div className="card-preview-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="card-preview-modal" role="dialog" aria-modal="true" aria-label={`${sticker.name} Vorschau`} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="card-preview-close" onClick={onClose} aria-label="Vorschau schließen">×</button>
        <div
          className="card-preview-stage"
          onPointerMove={updateRotation}
          onPointerLeave={resetRotation}
          onClick={() => onProfile(sticker)}
        >
          <div ref={tiltRef} className="card-preview-tilt">
            <StickerCard sticker={sticker} compact={false} draggable={false} interactive={false} />
          </div>
        </div>
        <button type="button" className="card-preview-profile-button" onClick={() => onProfile(sticker)}>
          Zum Profil
        </button>
      </section>
    </div>
  );
};
