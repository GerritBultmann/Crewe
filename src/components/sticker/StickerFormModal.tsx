import { useMemo, useState, type ClipboardEvent } from 'react';
import { STICKER_POSITIONS } from '../../config/albumConfig';
import type { Sticker, StickerPosition, StickerStatus } from '../../domain/types';
import type { StickerFormValues } from '../../domain/stickers';
import { Modal } from '../ui/Modal';

interface StickerFormModalProps {
  sticker?: Sticker | null;
  onClose: () => void;
  onSubmit: (values: StickerFormValues) => void;
}

const EMPTY_VALUES: StickerFormValues = {
  number: '',
  name: '',
  team: '',
  position: 'TW',
  status: 'owned',
  imageUrl: '',
  description: '',
};

const imageFileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });

export const StickerFormModal = ({ sticker, onClose, onSubmit }: StickerFormModalProps) => {
  const initialValues = useMemo<StickerFormValues>(() => {
    if (!sticker) return EMPTY_VALUES;

    return {
      id: sticker.id,
      number: sticker.number,
      name: sticker.name,
      team: sticker.team,
      position: sticker.position,
      status: sticker.status,
      imageUrl: sticker.imageUrl ?? '',
      description: sticker.description ?? '',
    };
  }, [sticker]);

  const [values, setValues] = useState<StickerFormValues>(initialValues);
  const [pasteMessage, setPasteMessage] = useState('');
  const isEdit = Boolean(sticker);
  const canSubmit = values.name.trim().length > 0;

  const setValue = <Key extends keyof StickerFormValues>(key: Key, value: StickerFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handlePasteImage = async (event: ClipboardEvent<HTMLDivElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith('image/'));
    const file = imageItem?.getAsFile();

    if (!file) {
      setPasteMessage('Kein Bild in der Zwischenablage gefunden.');
      return;
    }

    event.preventDefault();
    try {
      const dataUrl = await imageFileToDataUrl(file);
      setValue('imageUrl', dataUrl);
      setPasteMessage('Bild eingefügt. Speichern, damit es auf der Karte erscheint.');
    } catch (error) {
      setPasteMessage(error instanceof Error ? error.message : 'Bild konnte nicht eingefügt werden.');
    }
  };

  return (
    <Modal
      title={isEdit ? 'Sticker bearbeiten' : 'Neuen Sticker anlegen'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Abbrechen
          </button>
          <button
            type="button"
            className="button button--primary"
            disabled={!canSubmit}
            onClick={() => onSubmit(values)}
          >
            {isEdit ? 'Speichern' : 'Anlegen'}
          </button>
        </>
      }
    >
      <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Name *</span>
          <input
            value={values.name}
            onChange={(event) => setValue('name', event.target.value)}
            placeholder="z. B. Max Mustermann"
            autoFocus
          />
        </label>

        <label>
          <span>Sticker-Nr.</span>
          <input
            value={values.number}
            onChange={(event) => setValue('number', event.target.value)}
            placeholder="001"
          />
        </label>

        <label>
          <span>Team / Serie</span>
          <input
            value={values.team}
            onChange={(event) => setValue('team', event.target.value)}
            placeholder="Verein, Jahrgang oder Set"
          />
        </label>

        <label>
          <span>Position / Typ</span>
          <select
            value={values.position}
            onChange={(event) => setValue('position', event.target.value as StickerPosition)}
          >
            {STICKER_POSITIONS.map((position) => (
              <option value={position.value} key={position.value}>
                {position.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>
          <select
            value={values.status}
            onChange={(event) => setValue('status', event.target.value as StickerStatus)}
          >
            <option value="owned">Im Besitz</option>
            <option value="wanted">Gesucht</option>
            <option value="double">Doppelt</option>
          </select>
        </label>

        <label className="form-grid__wide">
          <span>Bild-URL oder eingefügtes Bild</span>
          <input
            value={values.imageUrl}
            onChange={(event) => setValue('imageUrl', event.target.value)}
            placeholder="https://… oder Bild unten einfügen"
          />
        </label>

        <div className="form-grid__wide image-paste-box" tabIndex={0} role="button" onPaste={handlePasteImage}>
          <div>
            <strong>Bild per Copy & Paste einfügen</strong>
            <span>Hier klicken und dann Strg+V / Cmd+V drücken. Das Bild wird lokal als Data-URL gespeichert.</span>
            {pasteMessage ? <em>{pasteMessage}</em> : null}
          </div>
          {values.imageUrl ? <img src={values.imageUrl} alt="Vorschau" /> : <span className="image-paste-box__placeholder">Kein Bild</span>}
        </div>

        <label className="form-grid__wide">
          <span>Notiz</span>
          <textarea
            value={values.description}
            onChange={(event) => setValue('description', event.target.value)}
            rows={4}
            placeholder="Besonderheiten, Tauschinfo oder Profilnotiz"
          />
        </label>
      </form>
    </Modal>
  );
};
