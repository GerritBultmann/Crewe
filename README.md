# Stickeralbum

Statische Vite + React + TypeScript App zum Sammeln, Einkleben, lokalen Speichern und Exportieren von Stickern. Die App hat kein Backend und eignet sich für lokale Nutzung sowie spätere Veröffentlichung über GitHub Pages.

## Funktionen

- Album mit Doppelseiten, linker/rechter Seite und Positionskategorien.
- Sticker anlegen, bearbeiten, ansehen und löschen.
- Sticker aus der Sammlung per Dropdown, Button oder Drag-and-Drop einkleben.
- Eingeklebte Sticker auskleben oder zwischen kompatiblen Slots tauschen.
- Zusätzliche Slots pro Kategorie hinzufügen und leere Slots entfernen.
- Mehrere Doppelseiten anlegen, wechseln und löschen.
- Lokale Speicherung in `localStorage`.
- JSON-Export und JSON-Import als Backup/Umzug.
- GitHub-Pages-Deployment per GitHub Actions.

## Projektstruktur

```text
Stickeralbum/
├── .github/workflows/deploy.yml      # GitHub Pages Deployment
├── docs/reference-analysis.md        # Detailanalyse des Vorbildprojekts
├── public/favicon.svg
├── src/
│   ├── components/album/             # Albumseiten, Slots, Navigation, Toolbar
│   ├── components/sticker/           # Stickerkarten, Sammlung, Formulare, Details
│   ├── components/ui/                # wiederverwendbare UI-Bausteine
│   ├── config/albumConfig.ts         # Kategorien, Positionen, Storage-Key
│   ├── domain/                       # Typen, Album-/Sticker-Domainlogik
│   ├── hooks/useAlbum.ts             # Reducer + Persistenz
│   ├── services/                     # localStorage, Import/Export
│   ├── store/albumReducer.ts         # zentrale Aktionen ohne DOM-Logik
│   └── styles/global.css             # Basis-UI
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Lokal starten

```bash
npm ci
npm run dev
```

Danach die angezeigte lokale Vite-URL im Browser öffnen.

## Produktionsbuild testen

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Repository auf GitHub erstellen und diese Dateien committen.
2. In den Repository-Einstellungen unter **Pages** als Source **GitHub Actions** wählen.
3. Auf `main` pushen oder den Workflow manuell starten.
4. Der Workflow baut `dist/` und veröffentlicht es auf GitHub Pages.

`vite.config.ts` setzt die `base` im GitHub-Actions-Build automatisch auf `/<repository-name>/`, damit Projektseiten unter `https://USER.github.io/REPO/` korrekt funktionieren.

## Datenmodell kurz erklärt

- `AlbumData` enthält den Albumtitel, aktive Doppelseite, alle Sticker und alle Doppelseiten.
- `Sticker` ist die einzige Quelle für Stickerinformationen.
- `AlbumSlot` speichert nur `stickerId`; dadurch entstehen keine doppelten Stickerdaten.
- `albumReducer` enthält alle fachlichen Aktionen: Sticker erstellen/ändern/löschen, Slots hinzufügen/entfernen, einkleben, auskleben, Seiten verwalten und JSON importieren.

## Abgrenzung zum Vorbildprojekt

Das Vorbild wurde gründlich analysiert. Die wichtigsten Erkenntnisse stehen in `docs/reference-analysis.md`. Für diese neue Grundlage wurden bewusst nur die Kernfunktionen übernommen und sauber neu aufgebaut: keine globalen Patchdateien, keine doppelten Renderer, keine verstreuten Storage-Keys und keine direkte DOM-Manipulation außerhalb von React.
