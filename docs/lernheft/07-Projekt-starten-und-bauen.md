# Projekt starten und bauen

## Wofür ist das?

Die vier Befehle, die du brauchst.

## Voraussetzung

Node **22.18+** oder **24.12+**. Prüfen mit:

```sh
node -v
```

## Beim ersten Mal

```sh
npm install
```

Lädt alle Pakete nach `node_modules/`. Dauert etwa eine halbe Minute und ist
nur einmal nötig — danach nur wieder, wenn sich `package.json` ändert.

## Die vier Befehle

### `npm run dev` — beim Arbeiten

```sh
npm run dev
```

Startet den Entwicklungsserver auf
**http://localhost:5173/TrapHouse-Website/**

Speicherst du eine Datei, aktualisiert sich der Browser **von allein** — meist
ohne die Seite neu zu laden und ohne deine Scroll-Position zu verlieren.

⚠ Beachte den `/TrapHouse-Website/`-Teil in der Adresse. Der kommt von `base`
in `vite.config.js`. Ohne ihn siehst du eine leere Seite.

Beenden mit `Strg + C`.

### `npm run build` — fertige Fassung

```sh
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

```sh
npm run build
npm run preview
```

Zeigt den Inhalt von `dist/` so an, wie er später online liegt.

⭐ **Immer einmal vor dem Veröffentlichen ausführen.** Manche Fehler treten nur
in der gebauten Fassung auf — vor allem falsche Bildpfade und alles, was die
CSP blockiert.

### `npm run lint` und `npm run format`

```sh
npm run lint     # sucht Fehler und behebt, was sich automatisch beheben lässt
npm run format   # richtet Einrückung und Zeilenumbrüche einheitlich aus
```

## Veröffentlichen

Gar nichts von Hand hochladen:

```sh
git add .
git commit -m "Beschreibung der Änderung"
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
