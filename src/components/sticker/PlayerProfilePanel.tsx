import { useMemo, useState } from 'react';
import { roleOptionsFor, type RoleMode } from '../../domain/fmRoles';
import { positionIdForProfile, profileFromSticker } from '../../domain/playerProfile';
import type { Sticker } from '../../domain/types';
import { AttributeGrid } from './AttributeGrid';
import { RoleSelector } from './RoleSelector';
import { StickerCard } from './StickerCard';

interface PlayerProfilePanelProps {
  sticker: Sticker;
}

const dash = (value?: string) => (value && value.trim() ? value : '—');

const reputationFromProfile = (profile: ReturnType<typeof profileFromSticker>) => {
  const raw = profile.squadStatus || profile.mediaDescription;
  if (/international|national/i.test(raw)) return 'National';
  if (/regional|local/i.test(raw)) return 'Regional';
  return 'National';
};

const splitTraits = (traits: string) =>
  traits
    .split(/\n|;|,/)
    .map((trait) => trait.trim())
    .filter(Boolean);

export const PlayerProfilePanel = ({ sticker }: PlayerProfilePanelProps) => {
  const profile = useMemo(() => profileFromSticker(sticker), [sticker]);
  const initialPositionId = positionIdForProfile(profile);
  const [positionId, setPositionId] = useState(initialPositionId);
  const [mode, setMode] = useState<RoleMode>('ip');
  const initialRoleName = roleOptionsFor(initialPositionId, 'ip').find(([name]) => name === profile.bestRole)?.[0]
    ?? roleOptionsFor(initialPositionId, 'ip')[0]?.[0]
    ?? '';
  const [roleName, setRoleName] = useState(initialRoleName);
  const roleOptions = roleOptionsFor(positionId, mode);
  const selectedRole = roleOptions.find(([name]) => name === roleName)?.[1] ?? roleOptions[0]?.[1] ?? null;
  const isKeeper = selectedRole?.pos.includes('GK') || positionId === 'GK';
  const traits = splitTraits(profile.traits || '');

  const changeMode = (nextMode: RoleMode) => {
    setMode(nextMode);
    setRoleName(roleOptionsFor(positionId, nextMode)[0]?.[0] ?? '');
  };

  const changePosition = (nextPositionId: string) => {
    setPositionId(nextPositionId);
    setRoleName(roleOptionsFor(nextPositionId, mode)[0]?.[0] ?? '');
  };

  return (
    <div className="fm-profile-shell">
      <header className="fm-player-hero">
        <div className="fm-player-card-thumb">
          <StickerCard sticker={sticker} compact draggable={false} interactive={false} />
        </div>
        <div className="fm-player-identity">
          <h1>{profile.name}</h1>
          <strong>{sticker.number || '—'}</strong>
          <div className="fm-player-tags">
            <span>{dash(profile.rawPosition)}</span>
            <span>{dash(profile.nationality)}</span>
            <span>{sticker.status === 'owned' ? 'Im Verein' : sticker.status === 'wanted' ? 'Gesucht' : 'Doppelt'}</span>
          </div>
        </div>
        <div className="fm-player-finance">
          <span>Wert / Gehalt</span>
          <b>{dash(profile.value)} · {dash(profile.wage)}</b>
          <small>{profile.contractEnd ? `bis ${profile.contractEnd}` : dash(profile.contractRemaining)}</small>
        </div>
        <div className="fm-player-stars">
          <span>Fähigkeit</span>
          <b>{dash(profile.abilityStars)}</b>
          <span>Potenzial</span>
          <b>{dash(profile.potentialStars)}</b>
        </div>
        <div className="fm-player-club">
          <span>Verein</span>
          <b>{dash(profile.team)}</b>
          <small>{dash(profile.squadStatus)}</small>
        </div>
      </header>

      <div className="fm-screen-profile">
        <RoleSelector
          positionId={positionId}
          mode={mode}
          roleName={roleName}
          abilityStars={profile.abilityStars}
          onPositionChange={changePosition}
          onModeChange={changeMode}
          onRoleChange={setRoleName}
        />

        <AttributeGrid values={profile.attributes} role={selectedRole} isKeeper={isKeeper} />

        <aside className="fm-info-panel">
          <div className="fm-info-header">
            <span>Info</span>
            <button type="button" className="fm-analysis-button">◉ Attributanalyse</button>
          </div>

          <div className="fm-info-block">
            <div className="fm-info-row"><span>Größe</span><b>{dash(profile.height)}</b></div>
            <div className="fm-info-row"><span>Reputation</span><b>{reputationFromProfile(profile)}</b></div>
            <div className="fm-info-row"><span>Persönlichkeit</span><b>{dash(profile.personality)}</b></div>
            <div className="fm-info-row"><span>Nationalität</span><b>{dash(profile.nationality)}</b></div>
            <div className="fm-info-row"><span>Alter</span><b>{dash(profile.age)}</b></div>
            <div className="fm-info-row"><span>Wert</span><b>{dash(profile.value)}</b></div>
            <div className="fm-info-row"><span>Gehalt</span><b>{dash(profile.wage)}</b></div>
          </div>

          <div className="fm-foot-panel">
            <div><span>Linker Fuß</span><b>{dash(profile.leftFoot)}</b><i /></div>
            <div><span>Rechter Fuß</span><b>{dash(profile.rightFoot)}</b><i className="strong" /></div>
          </div>

          <div className="fm-traits-panel">
            <button type="button" className="fm-traits-button">✦ {traits.length || 0} Eigenschaften</button>
            {traits.length ? <ul>{traits.map((trait) => <li key={trait}>{trait}</li>)}</ul> : <p>{profile.mediaDescription || 'Keine Spielereigenschaften importiert.'}</p>}
          </div>

          <div className="fm-stats-panel">
            <span>Saisonstatistiken</span>
            <table>
              <thead><tr><th>Ein.</th><th>T</th><th>V</th><th>Pas%</th><th>Ø</th></tr></thead>
              <tbody>
                {(profile.stats.length ? profile.stats : [{ apps: '', goals: '', assists: '', passPercent: '', rating: '' }]).map((row, index) => (
                  <tr key={index}><td>{dash(row.apps)}</td><td>{dash(row.goals)}</td><td>{dash(row.assists)}</td><td>{dash(row.passPercent)}</td><td>{dash(row.rating)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </div>
  );
};
