import type { Dispatch } from 'react';
import type { AlbumData } from '../../domain/types';
import type { AlbumAction } from '../../store/albumReducer';

interface SpreadNavigatorProps {
  album: AlbumData;
  dispatch: Dispatch<AlbumAction>;
}

export const SpreadNavigator = ({ album, dispatch }: SpreadNavigatorProps) => {
  const activeSpread = album.spreads.find((spread) => spread.id === album.activeSpreadId) ?? album.spreads[0];

  return (
    <nav className="spread-nav" aria-label="Albumseiten">
      <div className="spread-nav__tabs">
        {album.spreads.map((spread, index) => (
          <button
            type="button"
            className={spread.id === activeSpread.id ? 'is-active' : ''}
            key={spread.id}
            onClick={() => dispatch({ type: 'spread/select', spreadId: spread.id })}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button type="button" className="button button--ghost" onClick={() => dispatch({ type: 'spread/add' })}>
        Doppelseite +
      </button>
      {album.spreads.length > 1 ? (
        <button
          type="button"
          className="button button--danger"
          onClick={() => dispatch({ type: 'spread/delete', spreadId: activeSpread.id })}
        >
          Aktuelle Seite löschen
        </button>
      ) : null}
    </nav>
  );
};
