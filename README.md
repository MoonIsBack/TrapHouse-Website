# TrapHouse

Die Website der TrapHouse-Community — einer Anlaufstelle für Artists und
Producer. Startseite, Shop, Discord und die Social-Kanäle.

Die Seite lädt **nichts von fremden Servern**: Schriften und Icons liegen im
Projekt, es gibt kein Tracking und keine Cookies.

## Was die Seite hat

- Startseite mit Hero, Shop-Vorschau, Discord-Aufruf und Social-Kanälen
- Drei Unterseiten (`#/shop`, `#/discord`, `#/socials`) plus 404-Seite
- Klappmenü fürs Handy — schließt bei Escape und beim Seitenwechsel
- Einblenden beim Scrollen, abgeschaltet für alle, die „Bewegung reduzieren"
  eingestellt haben
- Alle Inhalte gesammelt in `src/data/`

## Entwicklung

```sh
npm install
npm run dev      # Entwicklungsserver auf localhost:5173/TrapHouse-Website/
npm run build    # Produktionsbuild nach dist/
npm run preview  # den Build so ansehen, wie er online liegt
npm run lint     # oxlint + ESLint
npm run format   # Prettier
```

Erfordert Node 22.18+ oder 24.12+.

## Aufbau

```
src/
  assets/        main.css (Design-Tokens), Schriften, Bilder
  components/    Vue-Komponenten
    ui/          Knopf und Überschrift — überall verwendet
    icons/       SVG-Icons statt Font Awesome
    home/ shop/ socials/ discord/
  composables/   Wiederverwendbare Logik ohne eigenes Aussehen
  data/          Die Inhalte: Navigation, Social-Links, Produkte
  router/        Welche Adresse zeigt welche Seite
  views/         Je eine Datei pro Unterseite
```

Der wichtigste Einstiegspunkt ist `src/assets/main.css`: Dort stehen alle
Farben, Abstände und Rundungen als Variablen. Keine Komponente schreibt eine
Farbe fest hin — alle benutzen `var(--accent)`. Dadurch lässt sich die ganze
Seite an einer Stelle umfärben, und RankRoom kann später mit einem einzigen
CSS-Block eigene Farben behalten.

## Dokumentation

In [`docs/lernheft/`](docs/lernheft/00-START-Inhaltsverzeichnis.md) liegt ein
ausführliches Lernheft in derselben Machart wie das von RankRoom.

Wenn du wenig Zeit hast:

- [03 — Wie TrapHouse aufgebaut ist](docs/lernheft/03-Wie-TrapHouse-aufgebaut-ist.md)
- [21 — Inhalte ändern](docs/lernheft/21-Inhalte-aendern.md)
- [40 — Was noch fehlt](docs/lernheft/40-Was-noch-fehlt.md)

## ⚠ Offene Punkte

Zwei Dinge fehlen, bevor die Seite ernsthaft online gehen kann:

1. **Der Discord-Einladungslink.** Steht in `src/data/socialLinks.js` noch auf
   `'#'` — alle Discord-Knöpfe führen ins Leere.
2. **Impressum und Datenschutzerklärung.** In Deutschland Pflicht, sobald die
   Seite geschäftsmäßig ist.

Die vollständige Liste steht in
[40 — Was noch fehlt](docs/lernheft/40-Was-noch-fehlt.md).

## Veröffentlichen

Ein Push auf `main` genügt — `.github/workflows/deploy.yml` baut die Seite und
lädt sie zu GitHub Pages hoch.

⚠ Zieht die Seite auf eine eigene Domain um, muss `base` in `vite.config.js`
auf `'/'` gestellt werden. Das ist die einzige Zeile, die dafür zu ändern ist.
