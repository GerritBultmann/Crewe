export type RoleMode = 'ip' | 'oop';

export interface RoleDefinition {
  pos: string[];
  primary: string[];
  secondary: string[];
}

export interface PositionDot {
  id: string;
  label: string;
  x: number;
  y: number;
  family: string;
  linked: string[];
}

export const POSITION_DOTS: PositionDot[] = [
  { id: 'GK', label: 'Torwart', x: 8, y: 50, family: 'GK', linked: ['IV'] },
  { id: 'LV', label: 'Verteidiger links', x: 25, y: 22, family: 'FB', linked: ['LAV'] },
  { id: 'IV', label: 'Innenverteidiger', x: 25, y: 50, family: 'CB', linked: ['GK', 'DM'] },
  { id: 'RV', label: 'Verteidiger rechts', x: 25, y: 78, family: 'FB', linked: ['RAV'] },
  { id: 'LAV', label: 'Flügelverteidiger links', x: 42, y: 22, family: 'WB', linked: ['LV', 'LM'] },
  { id: 'DM', label: 'Defensives Mittelfeld', x: 42, y: 50, family: 'DM', linked: ['IV', 'ZM'] },
  { id: 'RAV', label: 'Flügelverteidiger rechts', x: 42, y: 78, family: 'WB', linked: ['RV', 'RM'] },
  { id: 'LM', label: 'Mittelfeld links', x: 59, y: 22, family: 'WM', linked: ['LAV', 'LA'] },
  { id: 'ZM', label: 'Zentrales Mittelfeld', x: 59, y: 50, family: 'CM', linked: ['DM', 'OM'] },
  { id: 'RM', label: 'Mittelfeld rechts', x: 59, y: 78, family: 'WM', linked: ['RAV', 'RA'] },
  { id: 'LA', label: 'Flügel links', x: 76, y: 22, family: 'W', linked: ['LM', 'MS'] },
  { id: 'OM', label: 'Offensives Mittelfeld', x: 76, y: 50, family: 'AM', linked: ['ZM', 'MS'] },
  { id: 'RA', label: 'Flügel rechts', x: 76, y: 78, family: 'W', linked: ['RM', 'MS'] },
  { id: 'MS', label: 'Stürmer', x: 93, y: 50, family: 'ST', linked: ['LA', 'OM', 'RA'] },
];

export const ATTRIBUTE_GROUPS = {
  fieldTechnical: ['Abschluss', 'Ballannahme', 'Deckung', 'Dribbling', 'Flanken', 'Kopfballtechnik', 'Passen', 'Tackling', 'Technik', 'Weitschüsse'],
  setPieces: ['Ecken', 'Elfmeter', 'Freistöße', 'Weite Einwürfe'],
  goalkeeping: ['Abschlag', 'Abwurf', 'Ballannahme', 'Eins gegen Eins', 'Exzentrizität', 'Fausten (Tendenz)', 'Halten', 'Herauslaufen (Tendenz)', 'Hohe Bälle', 'Kommunikation', 'Passen', 'Reflexe', 'Strafraumkontrolle'],
  mental: ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Flair', 'Führungsqualitäten', 'Konzentration', 'Mut', 'Nervenstärke', 'Ohne Ball', 'Stellungsspiel', 'Teamwork', 'Übersicht', 'Zielstrebigkeit'],
  athletic: ['Antritt', 'Ausdauer', 'Balance', 'Beweglichkeit', 'Grundfitness', 'Kraft', 'Schnelligkeit', 'Sprunghöhe'],
} as const;

export const ROLE_DATA: Record<RoleMode, Record<string, RoleDefinition>> = {
  ip: {
    Torwart: { pos: ['GK'], primary: ['Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Abschlag', 'Abwurf', 'Eins gegen Eins', 'Antizipation', 'Entscheidungen'] },
    'Kompromissloser Torwart': { pos: ['GK'], primary: ['Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Eins gegen Eins', 'Antizipation', 'Entscheidungen'] },
    'Ballspielender Torwart': { pos: ['GK'], primary: ['Abschlag', 'Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Abwurf', 'Eins gegen Eins', 'Exzentrizität', 'Passen', 'Antizipation', 'Entscheidungen', 'Nervenstärke'] },
    Innenverteidiger: { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], secondary: ['Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstärke', 'Schnelligkeit'] },
    'Spielaufbauender Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Antizipation', 'Nervenstärke', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], secondary: ['Ballannahme', 'Technik', 'Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Übersicht', 'Schnelligkeit'] },
    'Aufrückender Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Technik', 'Antizipation', 'Entscheidungen', 'Nervenstärke', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghöhe'], secondary: ['Ballannahme', 'Dribbling', 'Aggressivität', 'Konzentration', 'Mut', 'Übersicht', 'Ausdauer', 'Schnelligkeit'] },
    Außenverteidiger: { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Dribbling', 'Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    Flügelverteidiger: { pos: ['FB', 'WB'], primary: ['Deckung', 'Flanken', 'Tackling', 'Einsatzfreude', 'Teamwork', 'Antritt', 'Ausdauer', 'Schnelligkeit'], secondary: ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Balance', 'Beweglichkeit'] },
    'Spielmachender Flügelverteidiger': { pos: ['FB', 'WB'], primary: ['Ballannahme', 'Passen', 'Tackling', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Teamwork', 'Übersicht', 'Antritt'], secondary: ['Deckung', 'Dribbling', 'Flanken', 'Antizipation', 'Einsatzfreude', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Inverser Außenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft'], secondary: ['Dribbling', 'Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstärke', 'Einsatzfreude', 'Sprunghöhe', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Defensiver Mittelfeldspieler': { pos: ['DM'], primary: ['Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork'], secondary: ['Ballannahme', 'Passen', 'Aggressivität', 'Einsatzfreude', 'Entscheidungen', 'Nervenstärke', 'Ausdauer', 'Kraft'] },
    'Tiefer Spielmacher': { pos: ['DM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Teamwork', 'Übersicht'], secondary: ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Balance'] },
    'Box-to-Box-Spieler': { pos: ['DM', 'CM'], primary: ['Passen', 'Tackling', 'Einsatzfreude', 'Ohne Ball', 'Teamwork', 'Ausdauer'], secondary: ['Abschluss', 'Ballannahme', 'Dribbling', 'Technik', 'Weitschüsse', 'Aggressivität', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Antritt', 'Balance', 'Kraft', 'Schnelligkeit'] },
    'Zentraler Mittelfeldspieler': { pos: ['CM'], primary: ['Ballannahme', 'Passen', 'Tackling', 'Entscheidungen', 'Teamwork'], secondary: ['Technik', 'Antizipation', 'Konzentration', 'Nervenstärke', 'Ohne Ball', 'Stellungsspiel', 'Übersicht', 'Ausdauer'] },
    Spielmacher: { pos: ['CM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht'], secondary: ['Dribbling', 'Tackling', 'Antizipation', 'Flair', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit'] },
    'Vorgeschobener Spielmacher': { pos: ['CM', 'AM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht'], secondary: ['Dribbling', 'Flanken', 'Antizipation', 'Flair', 'Antritt', 'Beweglichkeit'] },
    'Offensiver Mittelfeldspieler': { pos: ['CM', 'AM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Weitschüsse', 'Flair', 'Nervenstärke', 'Ohne Ball'], secondary: ['Abschluss', 'Dribbling', 'Flanken', 'Antizipation', 'Entscheidungen', 'Übersicht', 'Antritt', 'Beweglichkeit'] },
    Freigeist: { pos: ['AM'], primary: ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Weitschüsse', 'Flair', 'Nervenstärke', 'Ohne Ball', 'Übersicht'], secondary: ['Abschluss', 'Flanken', 'Antizipation', 'Entscheidungen', 'Antritt', 'Beweglichkeit'] },
    Flügelspieler: { pos: ['WM', 'W'], primary: ['Dribbling', 'Flanken', 'Technik', 'Teamwork', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'], secondary: ['Ballannahme', 'Passen', 'Antizipation', 'Einsatzfreude', 'Flair', 'Ohne Ball', 'Ausdauer', 'Balance'] },
    'Äußerer Mittelfeldspieler': { pos: ['WM'], primary: ['Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Schnelligkeit'], secondary: ['Ballannahme', 'Dribbling', 'Antizipation', 'Nervenstärke', 'Ohne Ball', 'Übersicht', 'Antritt', 'Beweglichkeit'] },
    'Inverser Außenstürmer': { pos: ['W'], primary: ['Ballannahme', 'Dribbling', 'Technik', 'Antizipation', 'Nervenstärke', 'Ohne Ball', 'Antritt', 'Beweglichkeit'], secondary: ['Abschluss', 'Flanken', 'Passen', 'Weitschüsse', 'Einsatzfreude', 'Flair', 'Übersicht', 'Ausdauer', 'Balance', 'Schnelligkeit'] },
    Zielspieler: { pos: ['ST'], primary: ['Abschluss', 'Kopfballtechnik', 'Aggressivität', 'Mut', 'Nervenstärke', 'Ohne Ball', 'Balance', 'Kraft', 'Sprunghöhe'], secondary: ['Ballannahme', 'Antizipation', 'Entscheidungen', 'Teamwork'] },
    'Pressender Stürmer': { pos: ['ST'], primary: ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Ohne Ball', 'Teamwork', 'Ausdauer'], secondary: ['Abschluss', 'Ballannahme', 'Konzentration', 'Schnelligkeit', 'Antritt'] },
    Mittelstürmer: { pos: ['ST'], primary: ['Abschluss', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Nervenstärke'], secondary: ['Ballannahme', 'Kopfballtechnik', 'Passen', 'Teamwork', 'Antritt', 'Schnelligkeit'] },
  },
  oop: {
    Torwart: { pos: ['GK'], primary: ['Halten', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Abschlag', 'Abwurf', 'Eins gegen Eins', 'Antizipation', 'Entscheidungen'] },
    'Mitspielender Torwart': { pos: ['GK'], primary: ['Abschlag', 'Passen', 'Reflexe', 'Antizipation', 'Entscheidungen', 'Nervenstärke', 'Stellungsspiel'], secondary: ['Abwurf', 'Eins gegen Eins', 'Exzentrizität', 'Herauslaufen (Tendenz)', 'Technik', 'Beweglichkeit'] },
    'Kompromissloser Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Konzentration', 'Mut', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], secondary: ['Aggressivität', 'Entscheidungen', 'Schnelligkeit'] },
    Innenverteidiger: { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit', 'Sprunghöhe'], secondary: ['Mut', 'Antritt'] },
    Außenverteidiger: { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Aggressivität', 'Konzentration', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    Flügelverteidiger: { pos: ['WB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Aggressivität', 'Entscheidungen', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Pressender Außenverteidiger': { pos: ['FB', 'WB'], primary: ['Deckung', 'Tackling', 'Aggressivität', 'Antizipation', 'Einsatzfreude', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Entscheidungen', 'Konzentration', 'Mut', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Defensiver Mittelfeldspieler': { pos: ['DM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], secondary: ['Aggressivität', 'Konzentration', 'Kraft', 'Schnelligkeit'] },
    'Pressender Sechser': { pos: ['DM'], primary: ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Aggressivität', 'Konzentration', 'Kraft'] },
    'Zentraler Mittelfeldspieler': { pos: ['CM'], primary: ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit'] },
    'Pressender Achter': { pos: ['CM'], primary: ['Tackling', 'Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Beweglichkeit'], secondary: ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit'] },
    'Äußerer Mittelfeldspieler': { pos: ['WM'], primary: ['Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], secondary: ['Deckung', 'Aggressivität', 'Antizipation', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    Flügelspieler: { pos: ['W'], primary: ['Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], secondary: ['Deckung', 'Aggressivität', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Offensiver Mittelfeldspieler': { pos: ['AM'], primary: ['Antizipation', 'Einsatzfreude', 'Entscheidungen'], secondary: ['Deckung', 'Aggressivität', 'Ohne Ball', 'Teamwork', 'Ausdauer'] },
    'Mitarbeitender Zehner': { pos: ['AM'], primary: ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Ohne Ball', 'Stellungsspiel'] },
    Mittelstürmer: { pos: ['ST'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Ausdauer'] },
    'Pressender Stürmer': { pos: ['ST'], primary: ['Einsatzfreude', 'Teamwork', 'Ausdauer', 'Aggressivität', 'Antizipation'], secondary: ['Abschluss', 'Schnelligkeit', 'Konzentration', 'Kraft', 'Entscheidungen'] },
  },
};

export const normalizeAttributeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');

export const attributeAlias = (label: string) =>
  ({
    Ruhe: 'Nervenstärke',
    Erstkontakt: 'Ballannahme',
    Abschläge: 'Abschlag',
    'Eins-gegen-Eins': 'Eins gegen Eins',
    Fangsicherheit: 'Halten',
    Strafraumbeherrschung: 'Strafraumkontrolle',
    Kopfball: 'Kopfballtechnik',
    Stärke: 'Kraft',
    Offensivbewegung: 'Ohne Ball',
    Weitschuesse: 'Weitschüsse',
    Freistoesse: 'Freistöße',
    Sprunghoehe: 'Sprunghöhe',
    Uebersicht: 'Übersicht',
  })[label] ?? label;

export const roleClassForAttribute = (label: string, role: RoleDefinition | null) => {
  if (!role) return '';
  const key = normalizeAttributeKey(label);
  const primary = role.primary.map(attributeAlias).map(normalizeAttributeKey);
  const secondary = role.secondary.map(attributeAlias).map(normalizeAttributeKey);
  if (primary.includes(key)) return 'role-primary';
  if (secondary.includes(key)) return 'role-secondary';
  return '';
};

export const roleOptionsFor = (positionId: string, mode: RoleMode) => {
  const dot = POSITION_DOTS.find((item) => item.id === positionId) ?? POSITION_DOTS[0];
  return Object.entries(ROLE_DATA[mode]).filter(([, role]) => role.pos.includes(dot.family));
};
