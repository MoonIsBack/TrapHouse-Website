# Dateien, die ich fast nie anfasse

## Wofür ist das?

Damit du weißt, was du beim Aufräumen **stehen lassen** sollst — und was
passiert, wenn du es doch änderst.

## Die Einstellungsdateien

| Datei | Wofür | Wann doch anfassen? |
|---|---|---|
| `package.json` | Abhängigkeiten + Befehle | Neues Paket hinzufügen |
| `package-lock.json` | Exakte Versionen | **Nie von Hand.** npm pflegt sie |
| `vite.config.js` | Build + Sicherheitsregel | Beim Umzug auf eine eigene Domain |
| `eslint.config.js` | Regeln für den Linter | Wenn eine Regel dauernd nervt |
| `.prettierrc.json` | Wie Code formatiert wird | Geschmacksfrage |
| `.oxlintrc.json` | Schneller Vor-Linter | Selten |
| `jsconfig.json` | Damit VS Code `@/` versteht | Nie |
| `.editorconfig` | Einrückung im Editor | Nie |
| `.gitignore` | Was **nicht** in Git landet | Neuer generierter Ordner |

## Die zwei, bei denen es wirklich darauf ankommt

### `vite.config.js` → `base`

```js
base: '/TrapHouse-Website/',
```

Das ist der Unterordner, unter dem die Seite liegt. Solange sie auf
`moonisback.github.io/TrapHouse-Website/` läuft, muss das genau so bleiben.

⚠ **Wenn TrapHouse deine Hauptseite wird** (eigene Domain oder
`moonisback.github.io/`), muss hier `'/'` stehen. Vergisst du das, laden
plötzlich keine Bilder und keine Schriften mehr — die Seite bleibt weiß.

Das ist die **einzige** Zeile, die beim Umzug zu ändern ist.

### `vite.config.js` → `CONTENT_SECURITY_POLICY`

Die Liste dessen, was der Browser laden darf. Sie ist absichtlich sehr eng.

⚠ **Wenn du irgendwann etwas von außen einbindest** — ein YouTube-Video, eine
Karte, ein Schriftart-CDN — musst du es hier erlauben, sonst blockiert der
Browser es wortlos. Der Fehler steht dann nur in der Entwicklerkonsole
(F12 → Console) und ist sonst nicht zu sehen.

Typisches Beispiel für ein eingebettetes YouTube-Video:

```js
"frame-src 'self' https://www.youtube-nocookie.com",
```

## `src/main.js`

Zwölf Zeilen, die Vue starten. Die ändert man genau einmal: wenn ein Paket
dazukommt, das sich „global" einhängen muss.

## `.github/workflows/deploy.yml`

Baut die Seite bei jedem Push auf `main` und lädt sie zu GitHub Pages hoch.
Läuft von allein.

⚠ Damit das überhaupt greift, muss auf GitHub unter
**Settings → Pages → Source** „GitHub Actions" eingestellt sein. Das ist eine
einmalige Einstellung auf der Website, nicht im Code.

## 💡 Merken

**Zwei Zeilen in `vite.config.js` entscheiden, ob die Seite online
funktioniert:** `base` und die CSP.

Alles andere in diesem Kapitel darfst du getrost ignorieren.

## ⚠ Vorsicht

`dist/` und `node_modules/` sind **generiert**. Änderungen dort sind beim
nächsten `npm run build` bzw. `npm install` spurlos weg.

## Siehe auch

- [07-Projekt-starten-und-bauen](07-Projekt-starten-und-bauen.md)
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md) — dort wird `base` wichtig
