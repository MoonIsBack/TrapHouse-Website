# Projekt starten und bauen

## Wofür ist das?

Die Befehle aus `package.json`, die du brauchst — und was sie tun.

## Voraussetzung

Node **22.18+** oder **24.12+**. In `package.json` steht unter `engines` genau
`^22.18.0 || >=24.12.0` — also Node 22 ab 22.18 oder Node 24.12 und neuer.
Node 23 ist damit nicht abgedeckt. Prüfen mit:

```bash
node -v
```

## Beim ersten Mal

```bash
npm install
```

Lädt alle Pakete nach `node_modules/`. Dauert etwa eine halbe Minute und ist
nur einmal nötig — danach nur wieder, wenn sich `package.json` ändert.

## Die Befehle

In `package.json` stehen fünf Befehle zum Aufrufen: `dev`, `build`, `preview`,
`lint` und `format` (Stand 20.10.2026) — dazu die zwei Teilschritte
`lint:oxlint` und `lint:eslint`, die `lint` nacheinander startet. Einen
Test-Befehl gibt es nicht, weil es keine automatischen Tests gibt
(→ [40-Was-noch-fehlt](40-Was-noch-fehlt.md)).

### `npm run dev` — beim Arbeiten

```bash
npm run dev
```

Startet den Entwicklungsserver auf
**http://localhost:5173/TrapHouse-Website/**

Speicherst du eine Datei, aktualisiert sich der Browser **von allein** — meist
ohne die Seite neu zu laden und ohne deine Scroll-Position zu verlieren.

⚠ Beachte den `/TrapHouse-Website/`-Teil in der Adresse. Der kommt von `base`
in `vite.config.js`. Ohne ihn zeigt Vite nur den Hinweis „The server is
configured with a public base URL …" — nur die nackte Adresse
`http://localhost:5173/` leitet Vite selbst richtig weiter.

Beenden mit `Strg + C`.

### `npm run build` — fertige Fassung

```bash
npm run build
```

Baut alles nach `dist/`. Dabei passiert:

- Vue-Dateien werden in normales JavaScript übersetzt
- Alles wird zusammengefasst und verkleinert
- Bilder bekommen eine Prüfsumme im Namen (`shirt-a3f2c1.webp`) — dadurch sehen
  Besucher nach einer Änderung sofort die neue Fassung statt der alten aus dem
  Zwischenspeicher
- Die Sicherheitsregel (CSP) wird in die `index.html` geschrieben

### `npm run preview` — die fertige Fassung testen

Erst bauen:

```bash
npm run build
```

Dann ansehen:

```bash
npm run preview
```

Zeigt den Inhalt von `dist/` so an, wie er später online liegt. Die Adresse
steht im Terminal (meist `http://localhost:4173/TrapHouse-Website/`).

⭐ **Immer einmal vor dem Veröffentlichen ausführen.** Manche Fehler treten nur
in der gebauten Fassung auf — vor allem falsche Bildpfade und alles, was die
CSP blockiert.

### `npm run lint` und `npm run format`

`npm run lint` sucht erst mit oxlint, dann mit ESLint nach Fehlern und
**behebt automatisch**, was sich beheben lässt (beide laufen mit `--fix` —
danach mit `git status` schauen, was sich geändert hat):

```bash
npm run lint
```

`npm run format` richtet Einrückung und Zeilenumbrüche in `src/` mit Prettier
einheitlich aus und schreibt die Dateien dabei um:

```bash
npm run format
```

## Veröffentlichen

Gar nichts von Hand hochladen:

```bash
git add -A
```

```bash
git commit -m "Beschreibung der Änderung"
```

```bash
git push
```

Der Workflow in `.github/workflows/deploy.yml` baut und veröffentlicht
automatisch. Dauert ein bis zwei Minuten. Den Fortschritt siehst du auf GitHub
unter dem Reiter **Actions**.

## Wenn etwas klemmt

| Problem | Lösung |
|---|---|
| Seite bleibt weiß | Konsole öffnen (F12 → Console) |
| „command not found: npm" | Node ist nicht installiert |
| Merkwürdige Paketfehler | `rm -rf node_modules && npm install` |
| Port 5173 belegt | Vite nimmt selbst 5174 — Adresse in der Ausgabe lesen |
| Änderung kommt nicht an | Browser hart neu laden: `Cmd + Shift + R` |
| Bilder fehlen erst nach dem Build | `base` in `vite.config.js` prüfen |

## 💡 Merken

**`npm run dev` zum Arbeiten, `npm run preview` zum Prüfen, `git push` zum
Veröffentlichen.**

## Siehe auch

- [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md)
- [08-Veroeffentlichen-Schritt-fuer-Schritt](08-Veroeffentlichen-Schritt-fuer-Schritt.md) — Veröffentlichen mit allen Sonderfällen
