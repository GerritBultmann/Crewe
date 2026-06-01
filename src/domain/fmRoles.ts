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

export const normalizeAttributeKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');

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

const role = (pos: string[], primary: string[], secondary: string[]): RoleDefinition => ({ pos, primary, secondary });

export const ROLE_DATA: Record<RoleMode, Record<string, RoleDefinition>> = {
  ip: {
    Torwart: role(['GK'], ['Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], ['Abschlag', 'Abwurf', 'Eins gegen Eins', 'Antizipation', 'Entscheidungen']),
    'Kompromissloser Torwart': role(['GK'], ['Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], ['Eins gegen Eins', 'Antizipation', 'Entscheidungen']),
    'Ballspielender Torwart': role(['GK'], ['Abschlag', 'Halten', 'Hohe Bälle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], ['Abwurf', 'Eins gegen Eins', 'Exzentrizität', 'Passen', 'Antizipation', 'Entscheidungen', 'Nervenstärke']),
    Innenverteidiger: role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstärke', 'Schnelligkeit']),
    'Spielaufbauender Innenverteidiger': role(['CB'], ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Antizipation', 'Nervenstärke', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Ballannahme', 'Technik', 'Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Übersicht', 'Schnelligkeit']),
    'Kompromissloser Innenverteidiger': role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Aggressivität', 'Konzentration', 'Mut', 'Schnelligkeit']),
    'Aufrückender Innenverteidiger': role(['CB'], ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Technik', 'Antizipation', 'Entscheidungen', 'Nervenstärke', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghöhe'], ['Ballannahme', 'Dribbling', 'Aggressivität', 'Konzentration', 'Mut', 'Übersicht', 'Ausdauer', 'Schnelligkeit']),
    Halbraumverteidiger: role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Dribbling', 'Aggressivität', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstärke', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    Außenverteidiger: role(['FB'], ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Antritt'], ['Dribbling', 'Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    Flügelverteidiger: role(['FB', 'WB'], ['Deckung', 'Flanken', 'Tackling', 'Einsatzfreude', 'Teamwork', 'Antritt', 'Ausdauer', 'Schnelligkeit'], ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Balance', 'Beweglichkeit']),
    'Vorgeschobener Flügelverteidiger': role(['WB'], ['Dribbling', 'Flanken', 'Technik', 'Einsatzfreude', 'Ohne Ball', 'Teamwork', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'], ['Ballannahme', 'Passen', 'Tackling', 'Antizipation', 'Entscheidungen', 'Flair', 'Stellungsspiel', 'Sprunghöhe']),
    'Spielmachender Flügelverteidiger': role(['FB', 'WB'], ['Ballannahme', 'Passen', 'Tackling', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Teamwork', 'Übersicht', 'Antritt'], ['Deckung', 'Dribbling', 'Flanken', 'Antizipation', 'Einsatzfreude', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Inverser Flügelverteidiger': role(['FB', 'WB'], ['Passen', 'Tackling', 'Antizipation', 'Entscheidungen', 'Nervenstärke', 'Stellungsspiel', 'Teamwork', 'Antritt'], ['Ballannahme', 'Deckung', 'Technik', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Defensiver Mittelfeldspieler': role(['DM'], ['Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork'], ['Ballannahme', 'Passen', 'Aggressivität', 'Einsatzfreude', 'Entscheidungen', 'Nervenstärke', 'Ausdauer', 'Kraft']),
    'Tiefer Spielmacher': role(['DM'], ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Teamwork', 'Übersicht'], ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Balance']),
    'Box-to-Box-Spieler': role(['DM', 'CM'], ['Passen', 'Tackling', 'Einsatzfreude', 'Ohne Ball', 'Teamwork', 'Ausdauer'], ['Abschluss', 'Ballannahme', 'Dribbling', 'Technik', 'Weitschüsse', 'Aggressivität', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Antritt', 'Balance', 'Kraft', 'Schnelligkeit']),
    'Weiter Achter': role(['CM'], ['Ballannahme', 'Passen', 'Tackling', 'Entscheidungen', 'Teamwork'], ['Dribbling', 'Flanken', 'Technik', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Übersicht', 'Ausdauer', 'Beweglichkeit']),
    'Zentraler Mittelfeldspieler': role(['CM'], ['Ballannahme', 'Passen', 'Tackling', 'Entscheidungen', 'Teamwork'], ['Technik', 'Antizipation', 'Konzentration', 'Nervenstärke', 'Ohne Ball', 'Stellungsspiel', 'Übersicht', 'Ausdauer']),
    Spielmacher: role(['CM'], ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht'], ['Dribbling', 'Tackling', 'Antizipation', 'Flair', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit']),
    Halbraumspieler: role(['CM', 'AM'], ['Ballannahme', 'Flanken', 'Passen', 'Technik', 'Nervenstärke', 'Ohne Ball', 'Antritt'], ['Dribbling', 'Weitschüsse', 'Antizipation', 'Entscheidungen', 'Flair', 'Übersicht', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Vorgeschobener Spielmacher': role(['CM', 'AM'], ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht'], ['Dribbling', 'Flanken', 'Antizipation', 'Flair', 'Antritt', 'Beweglichkeit']),
    'Offensiver Mittelfeldspieler': role(['CM', 'AM'], ['Ballannahme', 'Passen', 'Technik', 'Weitschüsse', 'Flair', 'Nervenstärke', 'Ohne Ball'], ['Abschluss', 'Dribbling', 'Flanken', 'Antizipation', 'Entscheidungen', 'Übersicht', 'Antritt', 'Beweglichkeit']),
    Freigeist: role(['AM'], ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Weitschüsse', 'Flair', 'Nervenstärke', 'Ohne Ball', 'Übersicht'], ['Abschluss', 'Flanken', 'Antizipation', 'Entscheidungen', 'Antritt', 'Beweglichkeit']),
    Halbraumflügel: role(['WM', 'W'], ['Ballannahme', 'Dribbling', 'Technik', 'Nervenstärke', 'Teamwork', 'Antritt', 'Beweglichkeit'], ['Flanken', 'Passen', 'Weitschüsse', 'Antizipation', 'Einsatzfreude', 'Flair', 'Ohne Ball', 'Übersicht', 'Ausdauer', 'Balance', 'Schnelligkeit']),
    Flügelspieler: role(['WM', 'W'], ['Dribbling', 'Flanken', 'Technik', 'Teamwork', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'], ['Ballannahme', 'Passen', 'Antizipation', 'Einsatzfreude', 'Flair', 'Ohne Ball', 'Ausdauer', 'Balance']),
    'Äußerer Mittelfeldspieler': role(['WM'], ['Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Schnelligkeit'], ['Ballannahme', 'Dribbling', 'Antizipation', 'Nervenstärke', 'Ohne Ball', 'Übersicht', 'Antritt', 'Beweglichkeit']),
    'Äußerer Spielmacher': role(['WM', 'W'], ['Ballannahme', 'Dribbling', 'Flanken', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht', 'Antritt'], ['Antizipation', 'Einsatzfreude', 'Flair', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Inverser Außenstürmer': role(['W'], ['Ballannahme', 'Dribbling', 'Technik', 'Antizipation', 'Nervenstärke', 'Ohne Ball', 'Antritt', 'Beweglichkeit'], ['Abschluss', 'Flanken', 'Passen', 'Weitschüsse', 'Einsatzfreude', 'Flair', 'Übersicht', 'Ausdauer', 'Balance', 'Schnelligkeit']),
    Außenstürmer: role(['W'], ['Ballannahme', 'Dribbling', 'Technik', 'Antizipation', 'Ohne Ball', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'], ['Abschluss', 'Flanken', 'Passen', 'Einsatzfreude', 'Flair', 'Nervenstärke', 'Ausdauer', 'Balance']),
    'Zweiter Stürmer': role(['AM'], ['Abschluss', 'Ballannahme', 'Antizipation', 'Nervenstärke', 'Ohne Ball', 'Antritt'], ['Dribbling', 'Passen', 'Technik', 'Weitschüsse', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    Zielspieler: role(['ST'], ['Abschluss', 'Kopfballtechnik', 'Aggressivität', 'Mut', 'Nervenstärke', 'Ohne Ball', 'Balance', 'Kraft', 'Sprunghöhe'], ['Ballannahme', 'Antizipation', 'Entscheidungen', 'Teamwork']),
    'Hängende Spitze': role(['ST'], ['Abschluss', 'Ballannahme', 'Technik', 'Nervenstärke', 'Ohne Ball', 'Kraft'], ['Dribbling', 'Passen', 'Antizipation', 'Entscheidungen', 'Teamwork', 'Übersicht', 'Balance']),
    Knipser: role(['ST'], ['Abschluss', 'Kopfballtechnik', 'Antizipation', 'Konzentration', 'Nervenstärke', 'Ohne Ball', 'Antritt'], ['Ballannahme', 'Technik', 'Entscheidungen', 'Balance', 'Beweglichkeit']),
    Mittelstürmer: role(['ST'], ['Abschluss', 'Ballannahme', 'Technik', 'Antizipation', 'Konzentration', 'Nervenstärke', 'Ohne Ball', 'Antritt', 'Kraft'], ['Dribbling', 'Passen', 'Entscheidungen', 'Teamwork', 'Balance', 'Beweglichkeit']),
    'Falsche Neun': role(['ST'], ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Flair', 'Nervenstärke', 'Ohne Ball', 'Teamwork', 'Übersicht', 'Antritt'], ['Abschluss', 'Antizipation', 'Entscheidungen', 'Beweglichkeit']),
    Stoßstürmer: role(['ST'], ['Abschluss', 'Antizipation', 'Antritt', 'Schnelligkeit', 'Nervenstärke'], ['Beweglichkeit', 'Dribbling', 'Technik', 'Entscheidungen', 'Ohne Ball']),
  },
  oop: {
    Torwart: role(['GK'], ['Halten', 'Reflexe', 'Eins gegen Eins', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], ['Hohe Bälle', 'Kommunikation', 'Antizipation', 'Entscheidungen', 'Strafraumkontrolle']),
    Linientorwart: role(['GK'], ['Halten', 'Reflexe', 'Eins gegen Eins', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], ['Hohe Bälle', 'Kommunikation', 'Antizipation', 'Entscheidungen', 'Strafraumkontrolle']),
    'Libero-Torwart': role(['GK'], ['Eins gegen Eins', 'Halten', 'Herauslaufen (Tendenz)', 'Hohe Bälle', 'Reflexe', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Beweglichkeit', 'Schnelligkeit'], ['Abschlag', 'Abwurf', 'Kommunikation', 'Konzentration', 'Nervenstärke']),
    Innenverteidiger: role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit', 'Sprunghöhe'], ['Mut', 'Antritt']),
    'Stoppender Innenverteidiger': role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Aggressivität', 'Antizipation', 'Mut', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Entscheidungen', 'Konzentration', 'Schnelligkeit']),
    'Absichernder Innenverteidiger': role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit', 'Sprunghöhe'], ['Mut', 'Antritt']),
    Halbraumverteidiger: role(['CB'], ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghöhe'], ['Aggressivität', 'Entscheidungen', 'Konzentration', 'Mut', 'Antritt', 'Beweglichkeit', 'Schnelligkeit']),
    'Abwartender Außenverteidiger': role(['FB'], ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Antritt'], ['Teamwork', 'Beweglichkeit', 'Schnelligkeit']),
    Außenverteidiger: role(['FB'], ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], ['Aggressivität', 'Konzentration', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    Flügelverteidiger: role(['WB'], ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], ['Aggressivität', 'Entscheidungen', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Abwartender Flügelverteidiger': role(['WB'], ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Antritt'], ['Teamwork', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Pressender Außenverteidiger': role(['FB', 'WB'], ['Deckung', 'Tackling', 'Aggressivität', 'Antizipation', 'Einsatzfreude', 'Stellungsspiel', 'Teamwork', 'Antritt'], ['Entscheidungen', 'Konzentration', 'Mut', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Defensiver Mittelfeldspieler': role(['DM'], ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], ['Aggressivität', 'Konzentration', 'Kraft', 'Schnelligkeit']),
    'Flügelsichernder Sechser': role(['DM'], ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Ausdauer', 'Beweglichkeit'], ['Aggressivität', 'Kraft']),
    Halbverteidiger: role(['DM'], ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghöhe'], ['Aggressivität', 'Ausdauer']),
    'Abschirmender Sechser': role(['DM'], ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel'], ['Einsatzfreude', 'Ausdauer', 'Kraft', 'Teamwork']),
    'Pressender Sechser': role(['DM'], ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], ['Deckung', 'Aggressivität', 'Konzentration', 'Kraft']),
    'Ballerobernder Mittelfeldspieler': role(['DM', 'CM'], ['Tackling', 'Aggressivität', 'Antizipation', 'Einsatzfreude', 'Teamwork', 'Ausdauer'], ['Deckung', 'Entscheidungen', 'Stellungsspiel', 'Kraft', 'Schnelligkeit']),
    'Zentraler Mittelfeldspieler': role(['CM'], ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit']),
    'Pressender Achter': role(['CM'], ['Tackling', 'Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Beweglichkeit'], ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit']),
    'Flügelsichernder Achter': role(['CM'], ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Teamwork'], ['Aggressivität', 'Konzentration', 'Ausdauer']),
    'Äußerer Mittelfeldspieler': role(['WM'], ['Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], ['Deckung', 'Aggressivität', 'Antizipation', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    'Äußerer Umschaltspieler': role(['WM'], ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], ['Ballannahme', 'Deckung', 'Dribbling', 'Nervenstärke', 'Antritt', 'Beweglichkeit']),
    'Mitarbeitender Außenspieler': role(['WM'], ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt', 'Ausdauer'], ['Deckung', 'Tackling', 'Ohne Ball', 'Stellungsspiel', 'Beweglichkeit', 'Schnelligkeit']),
    Flügelspieler: role(['W'], ['Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], ['Deckung', 'Aggressivität', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit']),
    Umschaltflügel: role(['W'], ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], ['Ballannahme', 'Deckung', 'Dribbling', 'Nervenstärke', 'Antritt', 'Beweglichkeit']),
    'Offensiver Mittelfeldspieler': role(['AM'], ['Antizipation', 'Einsatzfreude', 'Entscheidungen'], ['Deckung', 'Aggressivität', 'Ohne Ball', 'Teamwork', 'Ausdauer']),
    'Mitarbeitender Zehner': role(['AM'], ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], ['Deckung', 'Ohne Ball', 'Stellungsspiel']),
    'Zentraler Umschaltzehner': role(['AM'], ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Balance'], ['Ballannahme', 'Deckung', 'Nervenstärke', 'Kraft']),
    Mittelstürmer: role(['ST'], ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], ['Ballannahme', 'Deckung', 'Ausdauer']),
    'Pressender Stürmer': role(['ST'], ['Einsatzfreude', 'Teamwork', 'Ausdauer', 'Aggressivität', 'Antizipation'], ['Abschluss', 'Schnelligkeit', 'Konzentration', 'Kraft', 'Entscheidungen']),
    'Mitarbeitender Mittelstürmer': role(['ST'], ['Aggressivität', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Ohne Ball', 'Teamwork', 'Ausdauer'], ['Deckung', 'Stellungsspiel']),
  },
};

export const roleOptionsFor = (positionId: string, mode: RoleMode) => {
  const dot = POSITION_DOTS.find((item) => item.id === positionId) ?? POSITION_DOTS[0];
  return Object.entries(ROLE_DATA[mode]).filter(([, definition]) => definition.pos.includes(dot.family));
};
