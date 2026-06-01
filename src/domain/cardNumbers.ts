import type { Sticker } from './types';

export const normalizeCardNumber = (value: unknown): number | null => {
  const parsed = Number.parseInt(String(value ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const formatCardNumber = (value: number | null | undefined) =>
  value ? String(value).padStart(3, '0') : '???';

export const nextCardNumber = (stickers: Pick<Sticker, 'cardNumber'>[]) => {
  const highest = stickers.reduce((max, sticker) => Math.max(max, sticker.cardNumber ?? 0), 0);
  return highest + 1;
};

export const assignMissingCardNumbers = <T extends Pick<Sticker, 'cardNumber'>>(stickers: T[]): T[] => {
  const used = new Set<number>();
  let next = 1;

  return stickers.map((sticker) => {
    const current = normalizeCardNumber(sticker.cardNumber);
    if (current && !used.has(current)) {
      used.add(current);
      next = Math.max(next, current + 1);
      return { ...sticker, cardNumber: current };
    }

    while (used.has(next)) next += 1;
    const cardNumber = next;
    used.add(cardNumber);
    next += 1;
    return { ...sticker, cardNumber };
  });
};
