import type { RoleDefinition } from './fmRoles';

const canonical = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');

const aliases: Record<string, string> = {
  ruhe: 'nervenstarke',
  nervenstaerke: 'nervenstarke',
  nervenstarke: 'nervenstarke',
  erstkontakt: 'ballannahme',
  abschlage: 'abschlag',
  abschlaege: 'abschlag',
  einsgegeneins: 'einsgegeneins',
  einsgegenseins: 'einsgegeneins',
  fangsicherheit: 'halten',
  strafraumbeherrschung: 'strafraumkontrolle',
  kopfball: 'kopfballtechnik',
  starke: 'kraft',
  staerke: 'kraft',
  offensivbewegung: 'ohneball',
  weitschuesse: 'weitschusse',
  weitschusse: 'weitschusse',
  freistoesse: 'freistosse',
  freistosse: 'freistosse',
  sprunghoehe: 'sprunghohe',
  sprungshoehe: 'sprunghohe',
  sprunghohe: 'sprunghohe',
  uebersicht: 'ubersicht',
  ubersicht: 'ubersicht',
  hohebaelle: 'hoheballe',
  hoheballe: 'hoheballe',
};

const key = (value: string) => aliases[canonical(value)] ?? canonical(value);

export const roleClassForAttributeMatch = (label: string, role: RoleDefinition | null) => {
  if (!role) return '';
  const target = key(label);
  const primary = new Set((role.primary ?? []).map(key));
  const secondary = new Set((role.secondary ?? []).map(key));
  if (primary.has(target)) return 'role-primary';
  if (secondary.has(target)) return 'role-secondary';
  return '';
};
