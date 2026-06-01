import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';
import './styles/crewe-logo.css';
import './styles/player-profile.css';
import './styles/sticker-card.css';
import './styles/card-preview.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root-Element wurde nicht gefunden.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
