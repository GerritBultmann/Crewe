import { ATTRIBUTE_GROUPS, roleClassForAttribute, type RoleDefinition } from '../../domain/fmRoles';

interface AttributeGridProps {
  values: Record<string, string>;
  role: RoleDefinition | null;
  isKeeper: boolean;
}

const dash = (value?: string) => (value && value.trim() ? value : '—');

const valueClass = (value?: string) => {
  const numeric = Number.parseFloat(String(value ?? '').replace(',', '.'));
  if (!Number.isFinite(numeric)) return 'missing';
  if (numeric <= 5) return 'vlow';
  if (numeric <= 10) return 'mid';
  if (numeric <= 15) return 'yellow';
  return 'green';
};

const Section = ({ title, labels, values, role }: { title: string; labels: readonly string[]; values: Record<string, string>; role: RoleDefinition | null }) => (
  <section className="fm-attr-section">
    <h4>{title}</h4>
    {labels.map((label) => {
      const value = values[label];
      return (
        <div key={label} className={`fm-attr-row ${roleClassForAttribute(label, role)} ${value ? '' : 'missing'}`}>
          <span>{label}</span>
          <strong className={`fm-attr-val ${valueClass(value)}`}>{dash(value)}</strong>
        </div>
      );
    })}
  </section>
);

export const AttributeGrid = ({ values, role, isKeeper }: AttributeGridProps) => (
  <div className="fm-attribute-board">
    <div className="fm-card fm-attr-card">
      <div className="fm-card-title">{isKeeper ? 'Torhüter' : 'Technisch'}</div>
      <Section title={isKeeper ? 'Torhüterattribute' : 'Technische Attribute'} labels={isKeeper ? ATTRIBUTE_GROUPS.goalkeeping : ATTRIBUTE_GROUPS.fieldTechnical} values={values} role={role} />
      {!isKeeper ? <Section title="Standards" labels={ATTRIBUTE_GROUPS.setPieces} values={values} role={role} /> : null}
    </div>
    <div className="fm-card fm-attr-card">
      <div className="fm-card-title">Mental</div>
      <Section title="Mentale Attribute" labels={ATTRIBUTE_GROUPS.mental} values={values} role={role} />
    </div>
    <div className="fm-card fm-attr-card">
      <div className="fm-card-title">Athletik</div>
      <Section title="Athletische Attribute" labels={ATTRIBUTE_GROUPS.athletic} values={values} role={role} />
    </div>
  </div>
);
