import { useMemo, useState } from 'react';
import { roleOptionsFor, type RoleMode } from '../../domain/fmRoles';
import { buildProfileDashboardModel, formatMoney, statusLabelForSticker, type CareerHistoryRow, type ValuePoint } from '../../domain/profileData';
import { positionIdForProfile, profileFromSticker, type PlayerProfile } from '../../domain/playerProfile';
import { playablePositionIdsForProfile } from '../../domain/profilePositions';
import type { Sticker } from '../../domain/types';
import { AttributeGrid } from './AttributeGrid';
import { RoleSelector } from './RoleSelector';
import { StickerCard } from './StickerCard';

interface PlayerProfilePanelProps {
  sticker: Sticker;
  stickers: Sticker[];
  onEdit: (sticker: Sticker) => void;
  onDelete: (sticker: Sticker) => void;
}

const dash = (value?: string) => (value && value.trim() ? value : '—');

const ratingClass = (rating?: string) => {
  const number = Number.parseFloat(String(rating ?? '').replace(',', '.'));
  if (!Number.isFinite(number)) return '';
  if (number >= 7.2) return 'good';
  if (number >= 6.8) return 'ok';
  return 'low';
};

const splitTraits = (traits: string) =>
  traits
    .split(/\n|;|,/)
    .map((trait) => trait.trim())
    .filter(Boolean);

const statRows = (profile: PlayerProfile) =>
  profile.stats.length
    ? profile.stats
    : [{ competition: 'Gesamt', year: '', apps: '', starts: '', subApps: '', minutes: '', goals: '', assists: '', cleanSheets: '', playerOfMatch: '', passPercent: '', rating: '' }];

const roleNameFor = (profile: PlayerProfile, positionId: string, mode: RoleMode) =>
  roleOptionsFor(positionId, mode).find(([name]) => name === profile.bestRole)?.[0]
  ?? roleOptionsFor(positionId, mode)[0]?.[0]
  ?? '';

const shortYearLabel = (label: string) => label.match(/\d{4}(?:[/-]\d{2})?/)?.[0] ?? label;

type ChartPoint = ValuePoint & { value: number; pointIndex: number };

const validChartPoints = (points: ValuePoint[]): ChartPoint[] =>
  points
    .map((point, pointIndex) => ({ ...point, pointIndex }))
    .filter((point): point is ChartPoint => point.value !== null && Number.isFinite(point.value));

const MarketValueChart = ({ points }: { points: ValuePoint[] }) => {
  const chartPoints = validChartPoints(points);

  if (!chartPoints.length) {
    return (
      <section className="fm-market-chart-card">
        <h3>Marktwertverlauf</h3>
        <p>Noch keine Marktwerte vorhanden.</p>
      </section>
    );
  }

  const width = 760;
  const height = 320;
  const padding = { top: 26, right: 28, bottom: 58, left: 92 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const baseY = height - padding.bottom;
  const maxValue = Math.max(...chartPoints.map((point) => point.value));
  const yMax = Math.max(1, maxValue * 1.15);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => yMax * ratio);
  const xFor = (index: number) => padding.left + (chartPoints.length === 1 ? innerWidth / 2 : (index / (chartPoints.length - 1)) * innerWidth);
  const yFor = (value: number) => baseY - (value / yMax) * innerHeight;
  const coords = chartPoints.map((point, index) => ({ ...point, x: xFor(index), y: yFor(point.value) }));
  const linePath = coords.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = coords.length
    ? `M ${coords[0].x} ${baseY} L ${coords.map((point) => `${point.x} ${point.y}`).join(' L ')} L ${coords[coords.length - 1].x} ${baseY} Z`
    : '';

  return (
    <section className="fm-market-chart-card">
      <h3>Marktwertverlauf</h3>
      <div className="fm-market-chart-wrap">
        <svg className="fm-market-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Marktwertverlauf nach Jahr">
          <line className="fm-market-axis" x1={padding.left} y1={padding.top} x2={padding.left} y2={baseY} />
          <line className="fm-market-axis" x1={padding.left} y1={baseY} x2={width - padding.right} y2={baseY} />

          {yTicks.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line className="fm-market-grid-line" x1={padding.left} y1={y} x2={width - padding.right} y2={y} />
                <text className="fm-market-y-label" x={padding.left - 12} y={y} textAnchor="end" dominantBaseline="middle">
                  {formatMoney(tick, '0 €')}
                </text>
              </g>
            );
          })}

          {areaPath ? <path className="fm-market-area" d={areaPath} /> : null}
          {coords.length > 1 ? <path className="fm-market-line" d={linePath} /> : null}

          {coords.map((point) => (
            <g key={`${point.label}-${point.pointIndex}`}>
              <line className="fm-market-x-guide" x1={point.x} y1={padding.top} x2={point.x} y2={baseY} />
              <circle className="fm-market-dot" cx={point.x} cy={point.y} r="6">
                <title>{`${point.label}: ${point.formatted}`}</title>
              </circle>
              <text className="fm-market-value-label" x={point.x} y={point.y - 14} textAnchor="middle">
                {point.formatted}
              </text>
              <text className="fm-market-x-label" x={point.x} y={height - 22} textAnchor="middle">
                {shortYearLabel(point.label)}
              </text>
            </g>
          ))}

          <text className="fm-market-axis-label fm-market-axis-label--y" x="20" y={padding.top + innerHeight / 2} transform={`rotate(-90 20 ${padding.top + innerHeight / 2})`} textAnchor="middle">
            Wert in Euro
          </text>
          <text className="fm-market-axis-label" x={padding.left + innerWidth / 2} y={height - 4} textAnchor="middle">
            Jahr
          </text>
        </svg>
      </div>
    </section>
  );
};

export const PlayerProfilePanel = ({ sticker, stickers, onEdit, onDelete }: PlayerProfilePanelProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'career'>('overview');
  const [selectedStickerId, setSelectedStickerId] = useState<string | undefined>(undefined);
  const [selectedCareerIndex, setSelectedCareerIndex] = useState(0);
  const model = useMemo(
    () => buildProfileDashboardModel(sticker, stickers, selectedStickerId, selectedCareerIndex),
    [sticker, stickers, selectedStickerId, selectedCareerIndex],
  );
  const profile = model.selectedProfile;
  const selectedSticker = model.selectedSticker;
  const initialPositionId = positionIdForProfile(profile);
  const [positionId, setPositionId] = useState(initialPositionId);
  const [mode, setMode] = useState<RoleMode>('ip');
  const [roleName, setRoleName] = useState(() => roleNameFor(profile, initialPositionId, 'ip'));
  const playablePositionIds = playablePositionIdsForProfile(profile);
  const roleOptions = roleOptionsFor(positionId, mode);
  const selectedRole = roleOptions.find(([name]) => name === roleName)?.[1] ?? roleOptions[0]?.[1] ?? null;
  const isKeeper = selectedRole?.pos.includes('GK') || positionId === 'GK';
  const traits = splitTraits(profile.traits || '');
  const selectedCareer = model.selectedCareerRow;

  const changeMode = (nextMode: RoleMode) => {
    setMode(nextMode);
    setRoleName(roleNameFor(profile, positionId, nextMode));
  };

  const changePosition = (nextPositionId: string) => {
    setPositionId(nextPositionId);
    setRoleName(roleNameFor(profile, nextPositionId, mode));
  };

  const selectCard = (id: string) => {
    setSelectedStickerId(id);
    setSelectedCareerIndex(0);
    const next = stickers.find((item) => item.id === id);
    if (next) {
      const nextProfile = profileFromSticker(next);
      const nextPosition = positionIdForProfile(nextProfile);
      setPositionId(nextPosition);
      setRoleName(roleNameFor(nextProfile, nextPosition, mode));
    }
  };

  return (
    <div className="fm-profile-shell">
      <header className="fm-player-hero">
        <div className="fm-player-card-thumb"><StickerCard sticker={selectedSticker} compact draggable={false} interactive={false} /></div>
        <div className="fm-player-identity">
          <h1>{profile.name}</h1>
          <strong>{selectedSticker.number || '—'}</strong>
          <div className="fm-player-tags">
            <span>{dash(profile.rawPosition)}</span>
            <span>{dash(profile.nationality)}</span>
            <span>{statusLabelForSticker(selectedSticker)}</span>
          </div>
        </div>
        <div className="fm-player-finance"><span>Wert / Gehalt</span><b>{dash(profile.value)} · {dash(profile.wage)}</b><small>{profile.contractEnd ? `bis ${profile.contractEnd}` : dash(profile.contractRemaining)}</small></div>
        <div className="fm-player-stars"><span>Fähigkeit</span><b>{dash(profile.abilityStars)}</b><span>Potenzial</span><b>{dash(profile.potentialStars)}</b></div>
        <div className="fm-player-club"><span>Verein</span><b>{dash(profile.team)}</b><small>{dash(profile.squadStatus)}</small></div>
      </header>

      <nav className="fm-profile-tabs" aria-label="Profilbereiche">
        <button type="button" className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Übersicht</button>
        <button type="button" className={activeTab === 'career' ? 'active' : ''} onClick={() => setActiveTab('career')}>Karriere</button>
      </nav>

      {activeTab === 'overview' ? (
        <section className="fm-dashboard fm-dashboard-roles">
          <RoleSelector positionId={positionId} playablePositionIds={playablePositionIds} mode={mode} roleName={roleName} abilityStars={profile.abilityStars} onPositionChange={changePosition} onModeChange={changeMode} onRoleChange={setRoleName} />
          <AttributeGrid values={profile.attributes} role={selectedRole} isKeeper={isKeeper} />

          <aside className="fm-info-panel fm-info-cardlike">
            <div className="fm-info-header"><span>Info</span><button type="button" className="fm-analysis-button">Attributanalyse</button></div>
            <div className="fm-info-block">
              <div className="fm-info-row"><span>Alter</span><b>{dash(profile.age)}</b></div>
              <div className="fm-info-row"><span>Nationalität</span><b>{dash(profile.nationality)}</b></div>
              <div className="fm-info-row"><span>2. Nation</span><b>{dash(profile.secondNationality)}</b></div>
              <div className="fm-info-row"><span>Geburtsort</span><b>{dash(profile.birthplace)}</b></div>
              <div className="fm-info-row fm-info-row--wide"><span>Medienbeschreibung</span><b>{dash(profile.mediaDescription)}</b></div>
              <div className="fm-info-row"><span>Größe</span><b>{dash(profile.height)}</b></div>
              <div className="fm-info-row"><span>Persönlichkeit</span><b>{dash(profile.personality)}</b></div>
              <div className="fm-info-row"><span>Linker Fuß</span><b>{dash(profile.leftFoot)}</b></div>
              <div className="fm-info-row"><span>Rechter Fuß</span><b>{dash(profile.rightFoot)}</b></div>
            </div>
          </aside>

          <div className="fm-bottom-cards">
            <section className="fm-mini-card"><h3>Eigenschaften</h3>{traits.length ? <ul>{traits.map((trait) => <li key={trait}>{trait}</li>)}</ul> : <p>Keine Eigenschaften importiert.</p>}</section>
            <section className="fm-mini-card"><h3>Saisonstatistiken</h3><table><thead><tr><th>Wtbw</th><th>Ein.</th><th>T</th><th>V</th><th>Ø</th></tr></thead><tbody>{statRows(profile).map((row, index) => <tr key={index}><td>{dash(row.competition)}</td><td>{dash(row.apps)}</td><td>{isKeeper ? dash(row.cleanSheets) : dash(row.goals)}</td><td>{dash(row.assists)}</td><td className={ratingClass(row.rating)}>{dash(row.rating)}</td></tr>)}</tbody></table></section>
            <section className="fm-mini-card"><h3>Vertragsstatus</h3><p><b>{dash(profile.contractEnd)}</b></p><p>{dash(profile.contractRemaining)}</p></section>
            <section className="fm-mini-card"><h3>Aktionen</h3><div className="fm-action-row"><button type="button" onClick={() => onEdit(selectedSticker)}>Bearbeiten</button><button type="button" className="danger" onClick={() => onDelete(selectedSticker)}>Löschen</button></div></section>
          </div>
        </section>
      ) : (
        <section className="fm-career-view">
          <div className="fm-career-main">
            <div className="fm-card-gallery">
              <h3>Karten dieses Spielers</h3>
              <div>{model.relatedCards.map((card) => <button type="button" key={card.sticker.id} className={card.sticker.id === selectedSticker.id ? 'active' : ''} onClick={() => selectCard(card.sticker.id)}><span>{card.cardNumber} · {card.title}</span><small>{card.season}</small></button>)}</div>
            </div>
            <div className="fm-career-table-card">
              <table className="fm-career-main-table"><thead><tr><th>Ausw.</th><th>Jahr</th><th>Mannschaft</th><th>Info</th><th>Nation</th><th>Liga</th><th>Eins.</th><th>Tore</th><th>Vor.</th><th>SdS</th><th>Ø Note</th></tr></thead><tbody>{model.careerRows.map((row, index) => <tr key={`${row.year}-${index}`} className={selectedCareerIndex === index ? 'is-selected' : ''} onClick={() => setSelectedCareerIndex(index)}><td><span className="fm-radio-fake" /></td><td>{dash(row.year)}</td><td>{dash(row.team)}</td><td>{dash(row.info)}</td><td>{dash(row.nation)}</td><td>{dash(row.league)}</td><td>{dash(row.apps)}</td><td>{dash(row.goals)}</td><td>{dash(row.assists)}</td><td>{dash(row.playerOfMatch)}</td><td className={ratingClass(row.rating)}>{dash(row.rating)}</td></tr>)}</tbody></table>
            </div>
            <div className="fm-development-grid fm-development-grid--market">
              <MarketValueChart points={model.valueCurve} />
            </div>
            <div className="fm-season-detail-grid fm-season-detail-grid--single">
              <section><h3>Weitere Daten</h3><div className="fm-detail-list">{Object.entries(selectedCareer?.details ?? {}).slice(0, 10).map(([key, value]) => value ? <div key={key}><span>{key}</span><b>{value}</b></div> : null)}</div></section>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
