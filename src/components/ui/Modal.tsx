import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
  variant?: 'default' | 'fm';
}

export const Modal = ({ title, children, onClose, footer, wide = false, variant = 'default' }: ModalProps) => (
  <div className={`modal-backdrop modal-backdrop--${variant}`} role="presentation" onMouseDown={onClose}>
    <section
      className={`modal modal--${variant}${wide ? ' modal--wide' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <header className="modal__header">
        <h2>{title}</h2>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Modal schliessen">
          ×
        </button>
      </header>
      <div className="modal__body">{children}</div>
      {footer ? <footer className="modal__footer">{footer}</footer> : null}
    </section>
  </div>
);
