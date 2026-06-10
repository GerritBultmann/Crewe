import { POSITION_DOTS, roleOptionsFor, type RoleMode } from '../../domain/fmRoles';

interface RoleSelectorProps {
  positionId: string;
  playablePositionIds: string[];
  mode: RoleMode;
  roleName: string;
  abilityStars?: string;
  onPositionChange: (positionId: string) => void;
  onModeChange: (mode: RoleMode) => void;
  onRoleChange: (roleName: string) => void;
}

const shortPositionLabel: Record<string, string> = {
  GK: 'GK',
  LV: 'D/WB (L)',
  IV: 'D (C)',
  RV: 'D/WB (R)',
  LAV: 'WB/M (L)',
  DM: 'DM',
  RAV: 'WB/M (R)',
  LM: 'M/AM (L)',
  ZM: 'M (C)',
  RM: 'M/AM (R)',
  LA: 'M/AM (L)',
  OM: 'AM (C)',
  RA: 'M/AM (R)',
  MS: 'ST (C)',
};

const fallbackStars = '★★★☆☆';

export const RoleSelector = ({ positionId, playablePositionIds, mode, roleName, abilityStars, onPositionChange, onModeChange, onRoleChange }: RoleSelectorProps) => {
  const activeDot = POSITION_DOTS.find((dot) => dot.id === positionId) ?? POSITION_DOTS[0];
  const playable = new Set(playablePositionIds);
  const roles = roleOptionsFor(positionId, mode);
  const stars = abilityStars || fallbackStars;

  return (
    <section className="fm-role-panel">
      <div className="fm-left-topline">
        <div>
          <span className="fm-panel-kicker">Positions</span>
          <strong>{shortPositionLabel[positionId] ?? activeDot.label}</strong>
        </div>
        <button type="button" className="fm-compare-button">▣ Compare</button>
      </div>

      <div className="fm-role-pitch">
        <div className="fm-role-box" />
        <div className="fm-role-box right" />
        <div className="fm-role-goalarea" />
        <div className="fm-role-goalarea right" />
        {POSITION_DOTS.map((dot) => {
          const isPlayable = playable.has(dot.id);
          const isSelected = dot.id === positionId;
          return (
            <button
              key={dot.id}
              type="button"
              className={`fm-pos-dot ${isPlayable ? 'is-playable' : ''} ${isSelected ? 'is-selected' : ''}`}
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              title={dot.label}
              onClick={() => onPositionChange(dot.id)}
            />
          );
        })}
      </div>

      <div className="fm-role-selected-label">Selected: {activeDot.label}</div>

      <div className="fm-role-switch">
        <button type="button" className={mode === 'ip' ? 'active' : ''} onClick={() => onModeChange('ip')}>With Ball</button>
        <button type="button" className={mode === 'oop' ? 'active' : ''} onClick={() => onModeChange('oop')}>Without Ball</button>
      </div>

      <div className="fm-role-table-head">
        <span>Sel</span>
        <span>C. Ability</span>
        <span>Role</span>
      </div>
      <div className="fm-role-list">
        {roles.length ? roles.map(([name]) => (
          <button key={name} type="button" className={`fm-role-choice ${name === roleName ? 'active' : ''}`} onClick={() => onRoleChange(name)}>
            <span className="fm-radio-dot" />
            <span className="fm-stars">{stars}</span>
            <span>{name}</span>
          </button>
        )) : <div className="fm-role-empty">Keine Rollen für diese Position hinterlegt.</div>}
      </div>
    </section>
  );
};
