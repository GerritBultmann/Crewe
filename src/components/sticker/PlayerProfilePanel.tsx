import { useMemo, useState } from 'react';
import { roleOptionsFor, type RoleMode } from '../../domain/fmRoles';
import { positionIdForProfile, profileFromSticker } from '../../domain/playerProfile';
import type { Sticker } from '../../domain/types';
import { AttributeGrid } from './AttributeGrid';
import { RoleSelector } from './RoleSelector';

interface PlayerProfilePanelProps {
  sticker: Sticker;
}

const dash = (value?: string) => (value && value.trim() ? value : '—');

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

  const changeMode = (nextMode: RoleMode) => {
    setMode(nextMode);
    setRoleName(roleOptionsFor(positionId, nextMode)[0]?.[0] ?? '');
  };

  const changePosition = (nextPositionId: string) => {
    setPositionId(nextPositionId);
    setRoleName(roleOptionsFor(nextPositionId, mode)[0]?.[0] ?? '');
  };

  return (
    <div className="fm-dashboard">
      <aside className="fm-profile-sidebar">
        <section className="fm-card fm-summary-card">
          <div className="fm-card-title">Spielerprofil</div>
          <div className="fm-photo-large">
            {sticker.imageUrl ? <img src={sticker.imageUrl} alt="" /> : <span>{profile.name.slice(0, 1).toUpperCase()}</span>}
          </div>
          <h3>{profile.name}</h3>
          <div className="fm-info-list">
            <div><span>Position</span><b>{dash(profile.rawPosition)}</b></div>
            <div><span>Idealpos</span><b>{dash(profile.idealPosition)}</b></div>
            <div><span>Beste Rolle</span><b>{dash(profile.bestRole)}</b></div>
            <div><span>Nationalität</span><b>{dash(profile.nationality)}</b></div>
            <div><span>Geboren / Alter</span><b>{dash(profile.birthdate)} {profile.age ? `(${profile.age})` : ''}</b></div>
            <div><span>Team</span><b>{dash(profile.team)}</b></div>
            <div><span>Wert / Gehalt</span><b>{dash(profile.value)} · {dash(profile.wage)}</b></div>
            <div><span>Vertrag</span><b>{dash(profile.contractEnd || profile.contractRemaining)}</b></div>
            <div><span>Fähigkeit / Potenzial</span><b>{dash(profile.abilityStars)} / {dash(profile.potentialStars)}</b></div>
          </div>
        </section>

        <RoleSelector
          positionId={positionId}
          mode={mode}
          roleName={roleName}
          onPositionChange={changePosition}
          onModeChange={changeMode}
          onRoleChange={setRoleName}
        />
      </aside>

      <section className="fm-profile-main">
        <AttributeGrid values={profile.attributes} role={selectedRole} isKeeper={isKeeper} />

        <div className="fm-grid-two">
          <section className="fm-card">
            <div className="fm-card-title">Info</div>
            <div className="fm-info-triplet">
              <div>Größe<b>{dash(profile.height)}</b></div>
              <div>Persönlichkeit<b>{dash(profile.personality)}</b></div>
              <div>Kaderstatus<b>{dash(profile.squadStatus)}</b></div>
            </div>
            <div className="fm-foot-mini">
              <div><span>Linker Fuß</span><b>{dash(profile.leftFoot)}</b></div>
              <div><span>Rechter Fuß</span><b>{dash(profile.rightFoot)}</b></div>
            </div>
            {profile.traits ? <p className="fm-note"><b>Eigenschaften:</b> {profile.traits}</p> : null}
            {profile.mediaDescription ? <p className="fm-note">{profile.mediaDescription}</p> : null}
          </section>

          <section className="fm-card">
            <div className="fm-card-title">Saisonstatistiken</div>
            <div className="fm-table-wrap">
              <table className="fm-table">
                <thead>
                  <tr><th>Wtbw</th><th>Eins</th><th>Min</th><th>T</th><th>V</th><th>zNull</th><th>Pas %</th><th>Ø</th></tr>
                </thead>
                <tbody>
                  {(profile.stats.length ? profile.stats : [{ competition: '—', apps: '', minutes: '', goals: '', assists: '', cleanSheets: '', passPercent: '', rating: '' }]).map((row, index) => (
                    <tr key={`${row.competition}-${index}`}>
                      <td>{dash(row.competition)}</td>
                      <td>{dash(row.apps)}</td>
                      <td>{dash(row.minutes)}</td>
                      <td>{dash(row.goals)}</td>
                      <td>{dash(row.assists)}</td>
                      <td>{dash(row.cleanSheets)}</td>
                      <td>{dash(row.passPercent)}</td>
                      <td>{dash(row.rating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};
