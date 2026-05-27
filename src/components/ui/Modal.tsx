import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export const Modal = ({ title, children, onClose, footer }: ModalProps) => (
  <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section
      className="modal"
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
