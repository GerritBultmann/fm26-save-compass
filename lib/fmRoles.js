export const FM_ROLE_DATA = {
  ip: {
    'Torwart': { pos: ['GK'], primary: ['Halten', 'Hohe Baelle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Abschlag', 'Abwurf', 'Eins gegen Eins', 'Antizipation', 'Entscheidungen'] },
    'Kompromissloser Torwart': { pos: ['GK'], primary: ['Halten', 'Hohe Baelle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Eins gegen Eins', 'Antizipation', 'Entscheidungen'] },
    'Ballspielender Torwart': { pos: ['GK'], primary: ['Abschlag', 'Halten', 'Hohe Baelle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Abwurf', 'Eins gegen Eins', 'Exzentrizitaet', 'Passen', 'Antizipation', 'Entscheidungen', 'Nervenstaerke'] },
    'Spielaufbauender Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Antizipation', 'Nervenstaerke', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Ballannahme', 'Technik', 'Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Uebersicht', 'Schnelligkeit'] },
    'Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstaerke', 'Schnelligkeit'] },
    'Halbraumverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Dribbling', 'Aggressivitaet', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstaerke', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Kompromissloser Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Aggressivitaet', 'Konzentration', 'Mut', 'Schnelligkeit'] },
    'Aufrueckender Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Passen', 'Tackling', 'Technik', 'Antizipation', 'Entscheidungen', 'Nervenstaerke', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghoehe'], secondary: ['Ballannahme', 'Dribbling', 'Aggressivitaet', 'Konzentration', 'Mut', 'Uebersicht', 'Ausdauer', 'Schnelligkeit'] },
    'Aussenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Dribbling', 'Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Fluegelverteidiger': { pos: ['FB', 'WB'], primary: ['Deckung', 'Flanken', 'Tackling', 'Einsatzfreude', 'Teamwork', 'Antritt', 'Ausdauer', 'Schnelligkeit'], secondary: ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Balance', 'Beweglichkeit'] },
    'Vorgeschobener Fluegelverteidiger': { pos: ['WB'], primary: ['Dribbling', 'Flanken', 'Technik', 'Einsatzfreude', 'Ohne Ball', 'Teamwork', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'], secondary: ['Ballannahme', 'Passen', 'Tackling', 'Antizipation', 'Entscheidungen', 'Flair', 'Stellungsspiel', 'Sprunghoehe'] },
    'Spielmachender Fluegelverteidiger': { pos: ['FB', 'WB'], primary: ['Ballannahme', 'Passen', 'Tackling', 'Technik', 'Entscheidungen', 'Nervenstaerke', 'Teamwork', 'Uebersicht', 'Antritt'], secondary: ['Deckung', 'Dribbling', 'Flanken', 'Antizipation', 'Einsatzfreude', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Inverser Fluegelverteidiger': { pos: ['FB', 'WB'], primary: ['Passen', 'Tackling', 'Antizipation', 'Entscheidungen', 'Nervenstaerke', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Ballannahme', 'Deckung', 'Technik', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Box-to-Box-Spieler': { pos: ['DM'], primary: ['Passen', 'Tackling', 'Einsatzfreude', 'Ohne Ball', 'Teamwork', 'Ausdauer'], secondary: ['Abschluss', 'Ballannahme', 'Dribbling', 'Technik', 'Weitschuesse', 'Aggressivitaet', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Antritt', 'Balance', 'Kraft', 'Schnelligkeit'] },
    'Tiefer Spielmacher': { pos: ['DM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstaerke', 'Teamwork', 'Uebersicht'], secondary: ['Deckung', 'Tackling', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Ausdauer', 'Balance'] },
    'Defensiver Mittelfeldspieler': { pos: ['DM'], primary: ['Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork'], secondary: ['Ballannahme', 'Passen', 'Aggressivitaet', 'Einsatzfreude', 'Entscheidungen', 'Nervenstaerke', 'Ausdauer', 'Kraft'] },
    'Weiter Achter': { pos: ['CM'], primary: ['Ballannahme', 'Passen', 'Tackling', 'Entscheidungen', 'Teamwork'], secondary: ['Dribbling', 'Flanken', 'Technik', 'Antizipation', 'Konzentration', 'Ohne Ball', 'Stellungsspiel', 'Uebersicht', 'Ausdauer', 'Beweglichkeit'] },
    'Zentraler Mittelfeldspieler': { pos: ['CM'], primary: ['Ballannahme', 'Passen', 'Tackling', 'Entscheidungen', 'Teamwork'], secondary: ['Technik', 'Antizipation', 'Konzentration', 'Nervenstaerke', 'Ohne Ball', 'Stellungsspiel', 'Uebersicht', 'Ausdauer'] },
    'Spielmacher': { pos: ['CM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstaerke', 'Ohne Ball', 'Teamwork', 'Uebersicht'], secondary: ['Dribbling', 'Tackling', 'Antizipation', 'Flair', 'Stellungsspiel', 'Ausdauer', 'Beweglichkeit'] },
    'Halbraumspieler': { pos: ['CM', 'AM'], primary: ['Ballannahme', 'Flanken', 'Passen', 'Technik', 'Nervenstaerke', 'Ohne Ball', 'Antritt'], secondary: ['Dribbling', 'Weitschuesse', 'Antizipation', 'Entscheidungen', 'Flair', 'Uebersicht', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Vorgeschobener Spielmacher': { pos: ['CM', 'AM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstaerke', 'Ohne Ball', 'Teamwork', 'Uebersicht'], secondary: ['Dribbling', 'Flanken', 'Antizipation', 'Flair', 'Antritt', 'Beweglichkeit'] },
    'Offensiver Mittelfeldspieler': { pos: ['CM', 'AM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Weitschuesse', 'Flair', 'Nervenstaerke', 'Ohne Ball'], secondary: ['Abschluss', 'Dribbling', 'Flanken', 'Antizipation', 'Entscheidungen', 'Uebersicht', 'Antritt', 'Beweglichkeit'] },
    'Halbraumfluegel': { pos: ['WM', 'W'], primary: ['Ballannahme', 'Dribbling', 'Technik', 'Nervenstaerke', 'Teamwork', 'Antritt', 'Beweglichkeit'], secondary: ['Flanken', 'Passen', 'Weitschuesse', 'Antizipation', 'Einsatzfreude', 'Flair', 'Ohne Ball', 'Uebersicht', 'Ausdauer', 'Balance', 'Schnelligkeit'] },
    'Fluegelspieler': { pos: ['WM', 'W'], primary: ['Dribbling', 'Flanken', 'Technik', 'Teamwork', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'], secondary: ['Ballannahme', 'Passen', 'Antizipation', 'Einsatzfreude', 'Flair', 'Ohne Ball', 'Ausdauer', 'Balance'] },
    'Inverser Aussenstuermer': { pos: ['W'], primary: ['Ballannahme', 'Dribbling', 'Technik', 'Antizipation', 'Nervenstaerke', 'Ohne Ball', 'Antritt', 'Beweglichkeit'], secondary: ['Abschluss', 'Flanken', 'Passen', 'Weitschuesse', 'Einsatzfreude', 'Flair', 'Uebersicht', 'Ausdauer', 'Balance', 'Schnelligkeit'] },
    'Zweiter Stuermer': { pos: ['AM'], primary: ['Abschluss', 'Ballannahme', 'Antizipation', 'Nervenstaerke', 'Ohne Ball', 'Antritt'], secondary: ['Dribbling', 'Passen', 'Technik', 'Weitschuesse', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Freigeist': { pos: ['AM'], primary: ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Weitschuesse', 'Flair', 'Nervenstaerke', 'Ohne Ball', 'Uebersicht'], secondary: ['Abschluss', 'Flanken', 'Antizipation', 'Entscheidungen', 'Antritt', 'Beweglichkeit'] },
    'Zielspieler': { pos: ['ST'], primary: ['Abschluss', 'Kopfballtechnik', 'Aggressivitaet', 'Mut', 'Nervenstaerke', 'Ohne Ball', 'Balance', 'Kraft', 'Sprunghoehe'], secondary: ['Ballannahme', 'Antizipation', 'Entscheidungen', 'Teamwork'] },
    'Haengende Spitze': { pos: ['ST'], primary: ['Abschluss', 'Ballannahme', 'Technik', 'Nervenstaerke', 'Ohne Ball', 'Kraft'], secondary: ['Dribbling', 'Passen', 'Antizipation', 'Entscheidungen', 'Teamwork', 'Uebersicht', 'Balance'] },
    'Knipser': { pos: ['ST'], primary: ['Abschluss', 'Kopfballtechnik', 'Antizipation', 'Konzentration', 'Nervenstaerke', 'Ohne Ball', 'Antritt'], secondary: ['Ballannahme', 'Technik', 'Entscheidungen', 'Balance', 'Beweglichkeit'] },
    'Mittelstuermer': { pos: ['ST'], primary: ['Abschluss', 'Ballannahme', 'Technik', 'Antizipation', 'Konzentration', 'Nervenstaerke', 'Ohne Ball', 'Antritt', 'Kraft'], secondary: ['Dribbling', 'Passen', 'Entscheidungen', 'Teamwork', 'Balance', 'Beweglichkeit'] },
    'Falsche Neun': { pos: ['ST'], primary: ['Ballannahme', 'Dribbling', 'Passen', 'Technik', 'Flair', 'Nervenstaerke', 'Ohne Ball', 'Teamwork', 'Uebersicht', 'Antritt'], secondary: ['Abschluss', 'Antizipation', 'Entscheidungen', 'Beweglichkeit'] },
    'Stossstuermer': { pos: ['ST'], primary: ['Abschluss', 'Antizipation', 'Antritt', 'Schnelligkeit', 'Nervenstaerke'], secondary: ['Beweglichkeit', 'Dribbling', 'Technik', 'Entscheidungen', 'Ohne Ball'] }
  },
  oop: {
    'Torwart': { pos: ['GK'], primary: ['Halten', 'Reflexe', 'Eins gegen Eins', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Hohe Baelle', 'Kommunikation', 'Antizipation', 'Entscheidungen', 'Strafraumkontrolle'] },
    'Linientorwart': { pos: ['GK'], primary: ['Halten', 'Reflexe', 'Eins gegen Eins', 'Konzentration', 'Stellungsspiel', 'Beweglichkeit'], secondary: ['Hohe Baelle', 'Kommunikation', 'Antizipation', 'Entscheidungen', 'Strafraumkontrolle'] },
    'Libero-Torwart': { pos: ['GK'], primary: ['Eins gegen Eins', 'Halten', 'Herauslaufen Tendenz', 'Hohe Baelle', 'Kommunikation', 'Reflexe', 'Strafraumkontrolle', 'Antizipation', 'Entscheidungen', 'Beweglichkeit'], secondary: ['Abschlag', 'Abwurf', 'Exzentrizitaet', 'Passen', 'Konzentration', 'Stellungsspiel', 'Nervenstaerke'] },
    'Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstaerke', 'Schnelligkeit'] },
    'Stoppender Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Aggressivitaet', 'Antizipation', 'Mut', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Entscheidungen', 'Konzentration', 'Schnelligkeit'] },
    'Absichernder Innenverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit', 'Sprunghoehe'], secondary: ['Mut', 'Antritt'] },
    'Aussenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Aggressivitaet', 'Konzentration', 'Einsatzfreude', 'Entscheidungen', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Pressender Aussenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Entscheidungen', 'Konzentration', 'Mut', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Fluegelverteidiger': { pos: ['WB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Teamwork', 'Antritt'], secondary: ['Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Pressender Fluegelverteidiger': { pos: ['WB'], primary: ['Deckung', 'Tackling', 'Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Stellungsspiel', 'Teamwork', 'Antritt', 'Ausdauer'], secondary: ['Entscheidungen', 'Konzentration', 'Mut', 'Beweglichkeit', 'Schnelligkeit'] },
    'Defensiver Mittelfeldspieler': { pos: ['DM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], secondary: ['Aggressivitaet', 'Konzentration', 'Kraft', 'Schnelligkeit'] },
    'Pressender Sechser': { pos: ['DM'], primary: ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Stellungsspiel', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Aggressivitaet', 'Konzentration', 'Kraft'] },
    'Zentraler Mittelfeldspieler': { pos: ['CM'], primary: ['Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit'] },
    'Pressender Achter': { pos: ['CM'], primary: ['Tackling', 'Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Beweglichkeit'], secondary: ['Deckung', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit'] },
    'Fluegelspieler': { pos: ['W'], primary: ['Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], secondary: ['Deckung', 'Aggressivitaet', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Mitarbeitender Fluegelspieler': { pos: ['W'], primary: ['Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt', 'Ausdauer'], secondary: ['Deckung', 'Tackling', 'Ohne Ball', 'Beweglichkeit', 'Schnelligkeit'] },
    'Offensiver Mittelfeldspieler': { pos: ['AM'], primary: ['Antizipation', 'Einsatzfreude', 'Entscheidungen'], secondary: ['Deckung', 'Aggressivitaet', 'Ohne Ball', 'Teamwork', 'Ausdauer'] },
    'Mitarbeitender Zehner': { pos: ['AM'], primary: ['Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Ohne Ball', 'Stellungsspiel'] },
    'Mittelstuermer': { pos: ['ST'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Ausdauer'] },
    'Pressender Stuermer': { pos: ['ST'], primary: ['Einsatzfreude', 'Teamwork', 'Ausdauer', 'Aggressivitaet', 'Antizipation'], secondary: ['Abschluss', 'Schnelligkeit', 'Konzentration', 'Kraft', 'Entscheidungen'] }
  }
};

const FM_ROLE_EXTENSIONS = {
  ip: {
    'Hinterlaufender Halbraumverteidiger': { pos: ['CB'], primary: ['Deckung', 'Flanken', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Ausdauer', 'Kraft', 'Schnelligkeit', 'Sprunghoehe'], secondary: ['Dribbling', 'Technik', 'Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstaerke', 'Ohne Ball', 'Stellungsspiel', 'Antritt', 'Beweglichkeit'] },
    'Inverser Aussenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft'], secondary: ['Dribbling', 'Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Nervenstaerke', 'Einsatzfreude', 'Sprunghoehe', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Box-to-Box-Spielmacher': { pos: ['DM'], primary: ['Ballannahme', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Nervenstaerke', 'Ohne Ball', 'Teamwork', 'Uebersicht', 'Ausdauer'], secondary: ['Deckung', 'Dribbling', 'Tackling', 'Weitschuesse', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Antritt', 'Balance', 'Beweglichkeit', 'Schnelligkeit'] },
    'Abkippender Sechser': { pos: ['DM'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghoehe'], secondary: ['Ballannahme', 'Passen', 'Aggressivitaet', 'Entscheidungen', 'Mut', 'Nervenstaerke', 'Ohne Ball', 'Ausdauer'] },
    'Aeusserer Spielmacher': { pos: ['WM', 'W'], primary: ['Ballannahme', 'Dribbling', 'Flanken', 'Passen', 'Technik', 'Entscheidungen', 'Nervenstaerke', 'Ohne Ball', 'Teamwork', 'Uebersicht', 'Antritt'], secondary: ['Antizipation', 'Einsatzfreude', 'Flair', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Aeusserer Mittelfeldspieler': { pos: ['WM'], primary: ['Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Ausdauer', 'Schnelligkeit'], secondary: ['Ballannahme', 'Dribbling', 'Antizipation', 'Nervenstaerke', 'Ohne Ball', 'Uebersicht', 'Antritt', 'Beweglichkeit'] },
    'Aussenstuermer': { pos: ['W'], primary: ['Ballannahme', 'Dribbling', 'Technik', 'Antizipation', 'Ohne Ball', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'], secondary: ['Abschluss', 'Flanken', 'Passen', 'Einsatzfreude', 'Flair', 'Nervenstaerke', 'Ausdauer', 'Balance'] },
    'Halbraumstuermer': { pos: ['ST'], primary: ['Abschluss', 'Ballannahme', 'Dribbling', 'Flanken', 'Passen', 'Technik', 'Einsatzfreude', 'Nervenstaerke', 'Ohne Ball', 'Antritt', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'], secondary: ['Antizipation', 'Entscheidungen', 'Teamwork', 'Balance'] }
  },
  oop: {
    'Halbraumverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Aggressivitaet', 'Entscheidungen', 'Konzentration', 'Mut', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'] },
    'Stoppender Halbraumverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Aggressivitaet', 'Antizipation', 'Mut', 'Stellungsspiel', 'Kraft', 'Sprunghoehe'], secondary: ['Entscheidungen', 'Konzentration', 'Antritt', 'Beweglichkeit', 'Schnelligkeit'] },
    'Absichernder Halbraumverteidiger': { pos: ['CB'], primary: ['Deckung', 'Kopfballtechnik', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Kraft', 'Schnelligkeit', 'Sprunghoehe'], secondary: ['Mut', 'Antritt', 'Beweglichkeit'] },
    'Abwartender Aussenverteidiger': { pos: ['FB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Antritt'], secondary: ['Teamwork', 'Beweglichkeit', 'Schnelligkeit'] },
    'Abwartender Fluegelverteidiger': { pos: ['WB'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Antritt'], secondary: ['Teamwork', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Fluegelsichernder Sechser': { pos: ['DM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Ausdauer', 'Beweglichkeit'], secondary: ['Aggressivitaet', 'Kraft'] },
    'Halbverteidiger': { pos: ['DM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Konzentration', 'Stellungsspiel', 'Teamwork', 'Kraft', 'Sprunghoehe'], secondary: ['Aggressivitaet', 'Ausdauer'] },
    'Abschirmender Sechser': { pos: ['DM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Konzentration', 'Stellungsspiel'], secondary: ['Einsatzfreude', 'Ausdauer', 'Kraft', 'Teamwork'] },
    'Fluegelsichernder Achter': { pos: ['CM'], primary: ['Deckung', 'Tackling', 'Antizipation', 'Entscheidungen', 'Stellungsspiel', 'Teamwork'], secondary: ['Aggressivitaet', 'Konzentration', 'Ausdauer'] },
    'Abschirmender Achter': { pos: ['CM'], primary: ['Deckung', 'Tackling', 'Konzentration', 'Stellungsspiel'], secondary: ['Antizipation', 'Teamwork', 'Ausdauer'] },
    'Aeusserer Mittelfeldspieler': { pos: ['WM'], primary: ['Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt'], secondary: ['Deckung', 'Aggressivitaet', 'Antizipation', 'Ohne Ball', 'Ausdauer', 'Beweglichkeit', 'Schnelligkeit'] },
    'Aeusserer Umschaltspieler': { pos: ['WM'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Dribbling', 'Nervenstaerke', 'Antritt', 'Beweglichkeit'] },
    'Mitarbeitender Aussenspieler': { pos: ['WM'], primary: ['Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Teamwork', 'Antritt', 'Ausdauer'], secondary: ['Deckung', 'Tackling', 'Ohne Ball', 'Stellungsspiel', 'Beweglichkeit', 'Schnelligkeit'] },
    'Umschaltfluegel': { pos: ['W'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Dribbling', 'Nervenstaerke', 'Antritt', 'Beweglichkeit'] },
    'Inverser Umschaltfluegel': { pos: ['W'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Balance'], secondary: ['Ballannahme', 'Deckung', 'Dribbling', 'Nervenstaerke', 'Antritt', 'Kraft'] },
    'Ausweichender Umschaltzehner': { pos: ['AM'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Nervenstaerke', 'Antritt'] },
    'Zentraler Umschaltzehner': { pos: ['AM'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Balance'], secondary: ['Ballannahme', 'Deckung', 'Nervenstaerke', 'Kraft'] },
    'Zentraler Umschaltstuermer': { pos: ['ST'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Nervenstaerke', 'Antritt'] },
    'Mitarbeitender Mittelstuermer': { pos: ['ST'], primary: ['Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Ohne Ball', 'Teamwork', 'Ausdauer'], secondary: ['Deckung', 'Stellungsspiel'] },
    'Ausweichender Umschaltstuermer': { pos: ['ST'], primary: ['Antizipation', 'Entscheidungen', 'Konzentration', 'Ohne Ball', 'Teamwork', 'Schnelligkeit'], secondary: ['Ballannahme', 'Deckung', 'Nervenstaerke', 'Antritt'] }
  }
};

export const FM_POSITION_DOTS = [
  { id: 'GK', label: 'Torwart', x: 8, y: 50, family: 'GK', linked: ['IV'] },
  { id: 'LV', label: 'Verteidiger (Links)', x: 25, y: 22, family: 'FB', linked: ['LAV'] },
  { id: 'IV', label: 'Innenverteidiger (Zentral)', x: 25, y: 50, family: 'CB', linked: ['GK', 'DM'] },
  { id: 'RV', label: 'Verteidiger (Rechts)', x: 25, y: 78, family: 'FB', linked: ['RAV'] },
  { id: 'LAV', label: 'Fluegelverteidiger (Links)', x: 42, y: 22, family: 'WB', linked: ['LV', 'LM'] },
  { id: 'DM', label: 'Defensives Mittelfeld', x: 42, y: 50, family: 'DM', linked: ['IV', 'ZM'] },
  { id: 'RAV', label: 'Fluegelverteidiger (Rechts)', x: 42, y: 78, family: 'WB', linked: ['RV', 'RM'] },
  { id: 'LM', label: 'Mittelfeld (Links)', x: 59, y: 22, family: 'WM', linked: ['LAV', 'LA'] },
  { id: 'ZM', label: 'Mittelfeldspieler (Zentral)', x: 59, y: 50, family: 'CM', linked: ['DM', 'OM'] },
  { id: 'RM', label: 'Mittelfeld (Rechts)', x: 59, y: 78, family: 'WM', linked: ['RAV', 'RA'] },
  { id: 'LA', label: 'Fluegelspieler (Links)', x: 76, y: 22, family: 'W', linked: ['LM', 'MS'] },
  { id: 'OM', label: 'Offensives Mittelfeld (Zentral)', x: 76, y: 50, family: 'AM', linked: ['ZM', 'MS'] },
  { id: 'RA', label: 'Fluegelspieler (Rechts)', x: 76, y: 78, family: 'W', linked: ['RM', 'MS'] },
  { id: 'MS', label: 'Stuermer (Zentral)', x: 93, y: 50, family: 'ST', linked: ['LA', 'OM', 'RA'] }
];

export const FM_ATTRIBUTE_SECTIONS = {
  field: [
    ['Technische Attribute', ['Abschluss', 'Ballannahme', 'Deckung', 'Dribbling', 'Flanken', 'Kopfballtechnik', 'Passen', 'Tackling', 'Technik', 'Weitschuesse']],
    ['Standards', ['Ecken', 'Elfmeter', 'Freistoesse', 'Weite Einwuerfe']]
  ],
  keeper: [
    ['Torhueterattribute', ['Abschlag', 'Abwurf', 'Ballannahme', 'Eins gegen Eins', 'Exzentrizitaet', 'Fausten Tendenz', 'Halten', 'Herauslaufen Tendenz', 'Hohe Baelle', 'Kommunikation', 'Passen', 'Reflexe', 'Strafraumkontrolle']]
  ],
  mental: [
    ['Mentale Attribute', ['Aggressivitaet', 'Antizipation', 'Einsatzfreude', 'Entscheidungen', 'Flair', 'Fuehrungsqualitaeten', 'Konzentration', 'Mut', 'Nervenstaerke', 'Ohne Ball', 'Stellungsspiel', 'Teamwork', 'Uebersicht', 'Zielstrebigkeit']]
  ],
  athletic: [
    ['Athletische Attribute', ['Antritt', 'Ausdauer', 'Balance', 'Beweglichkeit', 'Grundfitness', 'Kraft', 'Schnelligkeit', 'Sprunghoehe']]
  ]
};

export function fmKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

export function fmPositionToDot(position) {
  const pos = String(position || '').trim().toUpperCase();
  const direct = {
    GK: 'GK',
    TW: 'GK',
    RV: 'RV',
    RB: 'RV',
    LV: 'LV',
    LB: 'LV',
    IV: 'IV',
    CB: 'IV',
    RAV: 'RAV',
    RWB: 'RAV',
    LAV: 'LAV',
    LWB: 'LAV',
    DM: 'DM',
    ZM: 'ZM',
    CM: 'ZM',
    OM: 'OM',
    AM: 'OM',
    RM: 'RM',
    LM: 'LM',
    RA: 'RA',
    RW: 'RA',
    RF: 'RA',
    LA: 'LA',
    LW: 'LA',
    LF: 'LA',
    MS: 'MS',
    ST: 'MS',
    CF: 'MS'
  };
  if (direct[pos]) return direct[pos];
  if (pos === 'TW') return 'GK';
  if (pos === 'AV') return 'RV';
  if (pos === 'FV') return 'RAV';
  if (pos === 'IV') return 'IV';
  if (pos === 'DM') return 'DM';
  if (pos === 'ZM') return 'ZM';
  if (pos === 'OM') return 'OM';
  if (pos === 'FL') return 'RA';
  if (pos === 'ST') return 'MS';
  return 'ZM';
}

export function fmRawPosition(sticker) {
  if (!sticker) return '';
  const fields = [
    sticker.rawPosition,
    sticker.csvPosition,
    sticker.positionRaw,
    sticker.fmPosition,
    sticker.allPositionsRaw,
    sticker.importPosition,
    sticker.positions,
    sticker.idealPosition,
    sticker.position
  ];
  return String(fields.find((value) => value !== undefined && value !== null && String(value).trim()) || '').trim();
}

function splitFmPositionList(raw) {
  const parts = [];
  let cell = '';
  let depth = 0;
  String(raw || '').replace(/;/g, ',').split('').forEach((char) => {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      if (cell.trim()) parts.push(cell.trim());
      cell = '';
      return;
    }
    cell += char;
  });
  if (cell.trim()) parts.push(cell.trim());
  return parts;
}

const FM_DIRECT_POSITION_DOTS = {
  TW: 'GK',
  GK: 'GK',
  TORWART: 'GK',
  GOALKEEPER: 'GK',
  RV: 'RV',
  RB: 'RV',
  LV: 'LV',
  LB: 'LV',
  IV: 'IV',
  CB: 'IV',
  DC: 'IV',
  RAV: 'RAV',
  RWB: 'RAV',
  LAV: 'LAV',
  LWB: 'LAV',
  DM: 'DM',
  ZM: 'ZM',
  CM: 'ZM',
  MC: 'ZM',
  OM: 'OM',
  AM: 'OM',
  AMC: 'OM',
  RM: 'RM',
  MR: 'RM',
  LM: 'LM',
  ML: 'LM',
  RA: 'RA',
  RW: 'RA',
  RF: 'RA',
  LA: 'LA',
  LW: 'LA',
  LF: 'LA',
  MS: 'MS',
  ST: 'MS',
  S: 'MS',
  HS: 'MS',
  CF: 'MS',
  SC: 'MS'
};

function addFmSidePosition(out, role, sides) {
  const normalizedRole = String(role || '').trim().toUpperCase();
  const normalizedSides = String(sides || '').toUpperCase().replace(/[^RLZC]/g, '').replace(/C/g, 'Z');
  const direct = FM_DIRECT_POSITION_DOTS[normalizedRole];
  if (direct && !['V', 'D', 'FV', 'WB', 'M', 'OM', 'AM'].includes(normalizedRole)) {
    out.add(direct);
    return;
  }
  if (!normalizedSides) {
    if (normalizedRole === 'V' || normalizedRole === 'D') out.add('IV');
    if (normalizedRole === 'FV' || normalizedRole === 'WB') {
      out.add('LAV');
      out.add('RAV');
    }
    if (normalizedRole === 'M') out.add('ZM');
    if (normalizedRole === 'OM' || normalizedRole === 'AM') out.add('OM');
    return;
  }
  for (const side of normalizedSides) {
    if (normalizedRole === 'V' || normalizedRole === 'D') out.add(side === 'R' ? 'RV' : (side === 'L' ? 'LV' : 'IV'));
    if (normalizedRole === 'FV' || normalizedRole === 'WB') {
      if (side === 'R') out.add('RAV');
      if (side === 'L') out.add('LAV');
    }
    if (normalizedRole === 'M') out.add(side === 'R' ? 'RM' : (side === 'L' ? 'LM' : 'ZM'));
    if (normalizedRole === 'OM' || normalizedRole === 'AM') out.add(side === 'R' ? 'RA' : (side === 'L' ? 'LA' : 'OM'));
  }
}

export function fmPositionDotIds(rawOrSticker) {
  const raw = typeof rawOrSticker === 'object' && rawOrSticker !== null ? fmRawPosition(rawOrSticker) : String(rawOrSticker || '').trim();
  const out = new Set();
  splitFmPositionList(raw).forEach((part) => {
    const text = String(part || '').trim().toUpperCase().replace(/\s+/g, ' ');
    if (!text) return;
    if (FM_DIRECT_POSITION_DOTS[text]) {
      out.add(FM_DIRECT_POSITION_DOTS[text]);
      return;
    }
    const match = text.match(/^([A-Z]+(?:\/[A-Z]+)*)\s*(?:\(([RLZC]+)\))?$/i);
    if (match) {
      match[1].split('/').forEach((role) => addFmSidePosition(out, role, match[2] || ''));
      return;
    }
    [...text.matchAll(/([A-Z]+(?:\/[A-Z]+)*)\s*(?:\(([RLZC]+)\))?/gi)]
      .forEach((item) => item[1].split('/').forEach((role) => addFmSidePosition(out, role, item[2] || '')));
  });
  if (!out.size && raw) out.add(fmPositionToDot(raw));
  return [...out].filter((id) => FM_POSITION_DOTS.some((dot) => dot.id === id));
}

export function fmPrimaryDotForSticker(sticker) {
  const capable = fmPositionDotIds(sticker);
  const direct = fmPositionToDot(sticker?.idealPosition || sticker?.position);
  if (capable.includes(direct)) return direct;
  return capable[0] || direct || 'ZM';
}

export function fmRolesForDot(posId, mode = 'ip') {
  const dot = FM_POSITION_DOTS.find((item) => item.id === posId) || FM_POSITION_DOTS[0];
  return Object.entries({ ...(FM_ROLE_DATA[mode] || {}), ...(FM_ROLE_EXTENSIONS[mode] || {}) })
    .filter(([, role]) => (role.pos || []).includes(dot.family))
    .map(([name, role]) => ({ name, ...role }));
}

export function fmSelectedRole(posId, mode = 'ip', roleName = '') {
  const rows = fmRolesForDot(posId, mode);
  if (!rows.length) return null;
  const wanted = fmKey(roleName);
  return rows.find((role) => fmKey(role.name) === wanted) || rows[0];
}

export function fmAttrClass(label, role) {
  if (!role) return '';
  const key = fmKey(label);
  const primary = (role.primary || []).map(fmKey);
  const secondary = (role.secondary || []).map(fmKey);
  if (primary.includes(key)) return ' role-primary';
  if (secondary.includes(key)) return ' role-secondary';
  return '';
}
