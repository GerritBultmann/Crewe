import { ATTRIBUTE_GROUPS, type RoleDefinition } from '../../domain/fmRoles';
import { roleClassForAttributeMatch } from '../../domain/roleAttributeMatch';

interface AttributeGridProps {
  values: Record<string, string>;
  role: RoleDefinition | null;
  isKeeper: boolean;
}

const dash = (value?: string) => (value && value.trim() ? value : '—');

const valueClass = (value?: string) => {
  const numeric = Number.parseFloat(String(value ?? '').replace(',', '.'));
  if (!Number.isFinite(numeric)) return 'missing';
  if (numeric <= 5) return 'poor';
  if (numeric <= 10) return 'low';
  if (numeric <= 14) return 'good';
  return 'elite';
};

const Section = ({ title, labels, values, role }: { title: string; labels: readonly string[]; values: Record<string, string>; role: RoleDefinition | null }) => (
  <section className="fm-attr-section">
    <h4>{title}</h4>
    {labels.map((label) => {
      const value = values[label];
      const roleClass = roleClassForAttributeMatch(label, role);
      return (
        <div key={label} className={`fm-attr-row ${roleClass} ${value ? '' : 'missing'}`}>
          <span className="fm-role-arrow" aria-hidden="true">➤</span>
          <span className="fm-attr-name">{label}</span>
          <strong className={`fm-attr-val ${valueClass(value)}`}>{dash(value)}</strong>
        </div>
      );
    })}
  </section>
);

export const AttributeGrid = ({ values, role, isKeeper }: AttributeGridProps) => (
  <div className="fm-attribute-board">
    <div className="fm-attribute-column">
      <Section title={isKeeper ? 'Torwart' : 'Technisch'} labels={isKeeper ? ATTRIBUTE_GROUPS.goalkeeping : ATTRIBUTE_GROUPS.fieldTechnical} values={values} role={role} />
      {!isKeeper ? <Section title="Standards" labels={ATTRIBUTE_GROUPS.setPieces} values={values} role={role} /> : null}
    </div>
    <div className="fm-attribute-column">
      <Section title="Mental" labels={ATTRIBUTE_GROUPS.mental} values={values} role={role} />
    </div>
    <div className="fm-attribute-column">
      <Section title="Physisch" labels={ATTRIBUTE_GROUPS.athletic} values={values} role={role} />
      {!isKeeper ? <Section title="Torwart" labels={ATTRIBUTE_GROUPS.goalkeeping} values={values} role={role} /> : null}
    </div>
  </div>
);
