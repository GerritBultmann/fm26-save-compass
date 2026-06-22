# FM26 Spielstand-Kompass

Lokales Analyse-Tool für Football Manager 26 CSV-Exporte.

## Start

```bash
npm run dev
```

## CSV-Import

Die App erkennt übliche FM-Spalten automatisch, unter anderem:

- `Player`, `Name`, `Spieler`
- `UID`, `Unique ID`, `Player ID`
- `Age`, `Alter`
- `Position`, `Pos`, `Best Position`
- `Nationality`, `Nation`, `Nat`
- `Club`, `Verein`
- `Transfer Value`, `Market Value`, `Value`, `Marktwert`
- `Wage`, `Salary`, `Gehalt`
- englische und deutsche Attributnamen sowie viele FM-Abkuerzungen

Der deutsche FM26-Export `player_export_20260518_192821.csv` wird direkt
unterstützt. Die App verarbeitet Semikolon-CSV mit Spalten wie `Aufgestellt`,
`Info`, `Spieler`, `Position`, `Minuten`, `SdS`, `Idealpos`, `Geb.`,
`Transferwert`, `Größe`, `Nr.`, `Alter`, `Tore`, `Wertung`, `Fähigkeit`,
`Potenzial`, `Persönlichkeit`, `Verein`, `Einsätze`, `Vorlagen`, `Pas %`,
`Gehalt`, `Endet`, Fußstärken, Vertragsdaten, Saisonwerte und alle
angezeigten technischen, mentalen, physischen sowie Torwartattribute.

Für stabile Marktwertentwicklung über mehrere Saisons ist eine eindeutige
Spieler-ID (`UID`) ideal. Ohne UID nutzt die App Name, Geburtsdatum und Nation
als Fallback.

Die Daten werden lokal im Browser gespeichert. Über den Export-Button kann die
Bibliothek als JSON gesichert werden.

## Oeffentliche Ansicht mit Admin-Upload

Die App laedt zuerst `public/data/library.json`. Besucher koennen die dort
veroeffentlichten Daten ansehen, Profile oeffnen und Taktiken bauen. CSV-Import,
Reset und Export sind nur im Adminmodus nutzbar.

Fuer echte Veroeffentlichung nach GitHub muss der Server folgende Secrets haben:

```bash
ADMIN_PASSWORD=dein-passwort
GITHUB_TOKEN=github-token-mit-repo-content-write
GITHUB_OWNER=dein-github-name
GITHUB_REPO=dein-repo
GITHUB_BRANCH=main
GITHUB_DATA_PATH=public/data/library.json
```

Der Admin-Import schreibt nach erfolgreichem CSV-Import diese JSON-Datei ins
Repo. Der Token liegt nur serverseitig und wird nicht an Besucher ausgeliefert.
