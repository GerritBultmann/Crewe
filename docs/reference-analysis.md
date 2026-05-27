# Analyse des angehängten Vorbildprojekts

Untersucht wurde `final(3).zip` mit der enthaltenen statischen App `final/`. Das Projekt ist funktional reich, aber historisch gewachsen: Basislogik liegt in `script.js`, viele spätere Korrekturen und Features werden als zusätzliche JS-Dateien nachgeladen und überschreiben globale Funktionen. Für die neue App wurde deshalb bewusst eine kleinere, typisierte React-Struktur gewählt.

## Datei- und Laufzeitstruktur

- `index.html` lädt eine CSS-Datei und viele einzelne Skripte direkt per `<script defer>`.
- `#app` ist der einzige Mount-Punkt. Das UI wird per Template-String gerendert.
- Hauptdateien:
  - `script.js`: Basiszustand, Albumseiten, Kategorien, Stickerkarten, Modale, Drag-and-Drop, localStorage.
  - `script-rest-core.js`: Auszeichnungen, Historie, Saisonseiten, Archiv/Reserve, zusätzliche Aktionen.
  - `album-data-manager.js`: Import/Export einer `album-data.json`, lokaler Mirror, File-System-Access-API-Fallbacks.
  - `import-manager.js`: Import-Batches, IndexedDB für große Rohimporte, Importverwaltung.
  - `crewe-profile-features.js` und `crewe-extra-features.js`: Profil-, Karriere-, CSV-, Vorschau-, Web-Export- und Historienfunktionen.
  - `crewe-performance-engine.js`: Indexierung und Reparatur von Kategorien/Positionen.
  - mehrere `*-fix.js`-Dateien: spätere Patches für Kartenstil, Profile, Reservealbum, Marktwertdiagramme, Positionsfarben und Stabilität.
- `style.css` ist sehr groß und enthält die gesamte Optik für Album, Karten, Modale, Profile, Export-/Importdialoge und weitere Erweiterungen.

## Datenmodell im Vorbild

- Zentraler Zustand `state` enthält u. a.:
  - `spreads`: Doppelseiten/Saisons.
  - `parking`: Reserve-Album bzw. Parkplatz.
  - `spread`: aktiver Seitenindex.
  - `nextId`, `nextStickerNo`: laufende IDs und Sticker-Nummern.
  - Modalzustände: Add/Edit/Profile/Delete.
  - Drag-and-Drop-Zustände.
  - Extra-Daten für Ligen, Auszeichnungen, Historie, Archiv und Import-Batches.
- Eine Doppelseite besteht aus Positionskategorien:
  - Torhüter
  - Verteidiger
  - Mittelfeld
  - Stürmer
- Stickerdaten enthalten u. a.:
  - Name, Spitzname, Foto, Position, Nationalität, Größe, Geburtsdatum.
  - Status: aktiv, verkauft, verliehen.
  - Transferdaten: Ablöse, Datum, kaufender/leihender Verein, Vertrag ausgelaufen.
  - Rückennummer, YI-Jahr, Profidebüt, Ausbildungsverein, Spiele, Pate, Notiz.
- Später ergänzt wurden u. a. Karrierehistorien, Importdaten, Marktwerte, Saisonwerte und Profilattribute.

## Funktionen im Vorbild

### Albumseiten und Navigation

- Doppelseitenansicht mit linker/rechter Seite.
- Positionsrubriken pro Seite.
- Seitenwechsel vor/zurück.
- Neue Doppelseiten/Saisons anlegen.
- Doppelseiten löschen.
- Neue Saisons klonen vorhandene Sticker aus der vorherigen Saison.
- Saisonlabels im Format `2025/26`, `2026/27` usw.
- Seite 1 startet fest in League Two; spätere Ligadaten können geändert werden.

### Stickerverwaltung

- Sticker anlegen, bearbeiten, löschen.
- Automatische ID- und Sticker-Nummernvergabe.
- Sticker normalisieren, z. B. Positionsaliase in kanonische Kürzel umwandeln.
- Doppelte/fehlende Sticker-Nummern reparieren.
- Foto per Datei/URL einfügen; viele spätere Patches versuchen, große oder fehlende Fotos abzufangen.
- Profilansicht mit großem Bild, Status, Transfer- und Metadaten.
- Karten können in mehreren Kontexten angezeigt werden: Album, Reserve, Awards, Profilvorschau.

### Einkleben, Umordnen und Reserve

- Leere Slots öffnen den Erstellen-Dialog.
- Stickerkarten sind per Drag-and-Drop verschiebbar.
- Verschieben zwischen Albumslots und Reserve/Parking.
- Entfernte Sticker können in Reserve/Archiv landen.
- Reserve-Album kann als geschlossenes Cover oder Modal angezeigt werden.
- Freie Platzhalter pro Kategorie werden automatisch gepflegt.

### Import, CSV und Datenhaltung

- CSV-/Textimport für Saisonspieler.
- Positionsmapping aus englischen/deutschen Kurzformen, z. B. `GK -> TW`, `RB/LB -> AV`, `RW/LW -> FL`, `CF/MS/HS -> ST`.
- Importierte Spieler werden automatisch in passende Positionsrubriken einsortiert.
- Re-Import repariert falsch einsortierte Karten.
- Import-Batches werden gespeichert und teilweise mit Rohdaten in IndexedDB ausgelagert.
- Importmanager zeigt Imports, Rohdaten und Badges an.

### Lokale Speicherung und Backup

- Basisdaten werden in mehreren `localStorage`-Keys gespeichert.
- Alte Speicherformate werden migriert.
- `album-data.json` kann exportiert/importiert werden.
- Chrome/Edge können über File-System-Access-API eine Datei verbinden und später direkt aktualisieren.
- Fallback: Browser-Speicher + manueller JSON-Download.

### Web-Export

- Erzeugt ein ZIP mit einer Nur-Lesen-Version.
- Der Export friert UI-Aktionen ein: Bearbeiten, Löschen, Import, Drag-and-Drop, Auskleben werden deaktiviert.
- Daten werden in `public-storage.js` bzw. eingebettetem JSON mitgeliefert.
- `album-data.json` bleibt als Sicherheitskopie enthalten.
- JSZip ist lokal eingebunden.

### Profile, Auszeichnungen und Historie

- Spielerprofile mit Tabs für Übersicht, persönliche Daten, Performance, Karriere.
- Auszeichnungen/Saison-Ehrungen mit Karten-Auswahl.
- Karriere-Statistiken aus Import- und Saisonkarten.
- Marktwertentwicklung als SVG-Diagramm.
- Ligahistorie, automatische und manuelle Einträge, Auf-/Abstieg/Platzierung.
- Saison-Locks, um historische Daten zu schützen.

### Performance und Reparatur

- Zusätzlicher Suchindex für Sticker, IDs und Spieleridentitäten.
- Reparaturroutinen für Positionskategorien.
- Lazy Loading für große Feature-Dateien.
- Lazy Images und optimierte HTML-Ausgabe.
- Mehrere Patches überschreiben globale Funktionen wie `render`, `attachListeners`, `saveState`, `stickerCardHTML`.

## Schwachstellen der Architektur

- Viele globale Variablen und globale Funktionsüberschreibungen.
- Features sind über viele Patchdateien verteilt; Reihenfolge der Skripte ist kritisch.
- Datenmodell dupliziert Stickerobjekte in mehreren Kontexten statt nur Referenzen zu speichern.
- Rendering per String-HTML erschwert Typprüfung und Refactoring.
- UI-Aktionen und Datenlogik sind stark vermischt.
- Mehrere Speicher-Keys und Migrationspfade sind schwer nachvollziehbar.
- Redundante Funktionen für Profile, Kartenrendering, Historie und Export.

## Konsequenzen für Stickeralbum

Die neue App übernimmt die sinnvollen Kernideen, aber nicht die gewachsene Patch-Architektur:

- Ein typisiertes Datenmodell mit `Sticker` als Single Source of Truth.
- Albumslots referenzieren Sticker nur per `stickerId`, statt Daten zu duplizieren.
- Ein zentraler Reducer koordiniert alle Aktionen.
- Lokale Speicherung nutzt einen versionierten Storage-Key.
- Import/Export nutzt ein validiertes JSON-Format.
- UI ist in kleine React-Komponenten getrennt: Toolbar, Navigation, Albumseite, Slot, Stickerkarte, Sammlung, Modale.
- Drag-and-Drop, Einkleben und Auskleben sind direkte Domain-Aktionen statt DOM-Patches.
- GitHub Pages ist über einen klaren GitHub-Actions-Workflow vorbereitet.
