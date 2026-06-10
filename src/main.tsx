import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';
import './styles/crewe-logo.css';
import './styles/player-profile.css';
import './styles/sticker-card.css';
import './styles/card-preview.css';
import './styles/profile-hero.css';
import './styles/attribute-highlights.css';
import './styles/profile-dashboard.css';
import './styles/placed-card.css';
import './styles/image-paste.css';
import './styles/profile-positions.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root-Element wurde nicht gefunden.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
