import { POSITION_DOTS, roleOptionsFor, type RoleMode } from '../../domain/fmRoles';

interface RoleSelectorProps {
  positionId: string;
  mode: RoleMode;
  roleName: string;
  onPositionChange: (positionId: string) => void;
  onModeChange: (mode: RoleMode) => void;
  onRoleChange: (roleName: string) => void;
}

export const RoleSelector = ({ positionId, mode, roleName, onPositionChange, onModeChange, onRoleChange }: RoleSelectorProps) => {
  const activeDot = POSITION_DOTS.find((dot) => dot.id === positionId) ?? POSITION_DOTS[0];
  const linked = new Set(activeDot.linked);
  const roles = roleOptionsFor(positionId, mode);

  return (
    <section className="fm-card fm-role-card">
      <div className="fm-role-pitch-title">
        <div>
          <div className="fm-card-title">Spielpositionen</div>
          <small>{activeDot.label}</small>
        </div>
      </div>
      <div className="fm-role-pitch">
        <div className="fm-role-box" />
        <div className="fm-role-box right" />
        <div className="fm-role-goalarea" />
        <div className="fm-role-goalarea right" />
        {POSITION_DOTS.map((dot) => (
          <button
            key={dot.id}
            type="button"
            className={`fm-pos-dot ${dot.id === positionId ? 'is-active' : ''} ${linked.has(dot.id) ? 'is-linked' : ''}`}
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            title={dot.label}
            onClick={() => onPositionChange(dot.id)}
          />
        ))}
      </div>
      <div className="fm-role-selected-label">{activeDot.label}</div>
      <div className="fm-role-switch">
        <button type="button" className={mode === 'ip' ? 'active' : ''} onClick={() => onModeChange('ip')}>Mit Ball</button>
        <button type="button" className={mode === 'oop' ? 'active' : ''} onClick={() => onModeChange('oop')}>Ohne Ball</button>
      </div>
      <div className="fm-role-table-head"><span>Ausw.</span><span>Rolle</span></div>
      <div className="fm-role-list">
        {roles.length ? roles.map(([name]) => (
          <button key={name} type="button" className={`fm-role-choice ${name === roleName ? 'active' : ''}`} onClick={() => onRoleChange(name)}>
            <span className="fm-radio-dot" />
            <span>{name}</span>
          </button>
        )) : <div className="fm-role-empty">Keine Rollen für diese Position hinterlegt.</div>}
      </div>
      <p className="fm-role-hint">Primäre Attribute werden grün, sekundäre Attribute hellblau markiert.</p>
    </section>
  );
};
