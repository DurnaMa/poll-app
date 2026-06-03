# PollApp
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Eine Angular-Webanwendung zum Erstellen und Verwalten von Umfragen. Benutzer können neue Umfragen anlegen, an laufenden Abstimmungen teilnehmen und Ergebnisse in Echtzeit einsehen.

## Features

- **Bald endende Umfragen** werden prominent oben angezeigt, chronologisch nach Enddatum sortiert
- **Homescreen** mit Übersicht aller Umfragen (laufend / abgeschlossen) per Tab-Wechsel
- **Neue Umfrage erstellen** via Dialog/Formular mit Pflicht- und optionalen Feldern
- **Detailansicht** pro Umfrage mit Fragestellung, Antwortoptionen und aktuellem Auswertungsstand
- **Abstimmung** mit Live-Auswertung – Ergebnisse aktualisieren sich dynamisch nach jeder abgegebenen Stimme (Desktop: Auswertung rechts neben der Abstimmung)

## Tech Stack

- [Angular](https://angular.dev) (generiert mit Angular CLI v21.2.11)
- TypeScript

## Getting Started

### Development server

```bash
npm install
ng serve
```

App läuft dann unter `http://localhost:4200/`. Änderungen an Source-Dateien werden automatisch neu geladen.

### Build

```bash
ng build
```

Build-Artefakte landen im `dist/`-Verzeichnis (Production-Build mit Optimierungen).


## Code Scaffolding

```bash
ng generate component component-name
ng generate --help  # alle verfügbaren Schematics
```

## Weitere Ressourcen

- [Angular CLI Dokumentation](https://angular.dev/tools/cli)
## Lizenz

[MIT](./LICENSE)
 
