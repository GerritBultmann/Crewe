import { ATTRIBUTE_GROUPS, roleClassForAttribute, type RoleDefinition } from '../../domain/fmRoles';

interface AttributeGridProps {
  values: Record<string, string>;
  role: RoleDefinition | null;
  isKeeper: boolean;
}

const displayLabel: Record<string, string> = {
  Abschluss: 'Finishing',
  Abschlag: 'Kicking',
  Abwurf: 'Throwing',
  Aggressivität: 'Aggression',
  Antritt: 'Acceleration',
  Antizipation: 'Anticipation',
  Ausdauer: 'Stamina',
  Balance: 'Balance',
  Ballannahme: 'First Touch',
  Beweglichkeit: 'Agility',
  Deckung: 'Marking',
  Dribbling: 'Dribbling',
  Ecken: 'Corners',
  'Eins gegen Eins': 'One on Ones',
  Einsatzfreude: 'Work Rate',
  Elfmeter: 'Penalties',
  Entscheidungen: 'Decisions',
  Exzentrizität: 'Eccentricity',
  'Fausten (Tendenz)': 'Punching',
  Flair: 'Flair',
  Flanken: 'Crossing',
  Freistöße: 'Free Kicks',
  Führungsqualitäten: 'Leadership',
  Grundfitness: 'Natural Fitness',
  Halten: 'Handling',
  'Herauslaufen (Tendenz)': 'Rushing Out',
  'Hohe Bälle': 'Aerial Reach',
  Kommunikation: 'Communication',
  Konzentration: 'Concentration',
  Kopfballtechnik: 'Heading',
  Kraft: 'Strength',
  Mut: 'Bravery',
  Nervenstärke: 'Composure',
  'Ohne Ball': 'Off The Ball',
  Passen: 'Passing',
  Reflexe: 'Reflexes',
  Schnelligkeit: 'Pace',
  Sprunghöhe: 'Jumping Reach',
  Stellungsspiel: 'Positioning',
  Strafraumkontrolle: 'Command of Area',
  Tackling: 'Tackling',
  Teamwork: 'Teamwork',
  Technik: 'Technique',
  Übersicht: 'Vision',
  'Weite Einwürfe': 'Long Throws',
  Weitschüsse: 'Long Shots',
  Zielstrebigkeit: 'Determination',
};

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
      const roleClass = roleClassForAttribute(label, role);
      return (
        <div key={label} className={`fm-attr-row ${roleClass} ${value ? '' : 'missing'}`}>
          <span className="fm-role-arrow" aria-hidden="true">➤</span>
          <span className="fm-attr-name">{displayLabel[label] ?? label}</span>
          <strong className={`fm-attr-val ${valueClass(value)}`}>{dash(value)}</strong>
        </div>
      );
    })}
  </section>
);

export const AttributeGrid = ({ values, role, isKeeper }: AttributeGridProps) => (
  <div className="fm-attribute-board">
    <div className="fm-attribute-column">
      <Section title={isKeeper ? 'Goalkeeping' : 'Technical'} labels={isKeeper ? ATTRIBUTE_GROUPS.goalkeeping : ATTRIBUTE_GROUPS.fieldTechnical} values={values} role={role} />
      {!isKeeper ? <Section title="Set Pieces" labels={ATTRIBUTE_GROUPS.setPieces} values={values} role={role} /> : null}
    </div>
    <div className="fm-attribute-column">
      <Section title="Mental" labels={ATTRIBUTE_GROUPS.mental} values={values} role={role} />
    </div>
    <div className="fm-attribute-column">
      <Section title="Physical" labels={ATTRIBUTE_GROUPS.athletic} values={values} role={role} />
      {!isKeeper ? <Section title="Goalkeeping" labels={ATTRIBUTE_GROUPS.goalkeeping} values={values} role={role} /> : null}
    </div>
  </div>
);
