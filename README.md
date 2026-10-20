# TrapHouse-Website

Die Website der TrapHouse-Community — einer Anlaufstelle für Artists und
Producer. Sie stellt die Community vor: Startseite, Merch, Discord und die
Social-Kanäle. Sie verarbeitet nichts: Niemand meldet sich an, niemand gibt
Daten ein, und die Seite lädt **nichts von fremden Servern** — Schriften und
Icons liegen im Projekt, es gibt kein Tracking und keine Cookies.

## Was die Seite hat

| Adresse | Seite |
|---|---|
| `#/` | Startseite: Hero, Laufband, „Was dich erwartet", Merch-Vorschau, Discord-Aufruf, Social-Kanäle |
| `#/shop` | Merch-Seite — die Adresse heißt weiter `shop`, im Menü steht „Merch". Der Artikel ist eine Ankündigung, ohne Preis und ohne Kaufknopf |
| `#/discord` | Discord-Seite mit Beitreten-Aufruf |
| `#/socials` | die Kanäle auf YouTube, TikTok und Instagram |
| `#/impressum`, `#/datenschutz` | Rechtsseiten — gibt es nur, wenn `src/config/legalConfig.js` ausgefüllt ist (beim Entwickeln immer), siehe [Offene Punkte](#offene-punkte) |
| alles andere | 404-Seite |

Dazu ein Menüpunkt „RankRoom", der nach außen zur Tierlist-App RankRoom führt.

Außerdem:

- Klappmenü fürs Handy — schließt bei Escape und beim Seitenwechsel
- Einblenden beim Scrollen, Fortschrittsbalken, Magnet-Knöpfe und leicht
  kippende Karten. „Bewegung reduzieren" im Betriebssystem schaltet die Bewegung
  ab; Effekte mit dem Mauszeiger laufen nur mit echtem Zeiger (Maus oder
  Touchpad), nicht auf Touchscreens
- Schalter in `src/config/`: Scrollverhalten der Startseite, Links zu fremden
  Diensten an/aus, eigener Mauszeiger an/aus (aktuell aus)
- Alle Inhalte gesammelt in `src/data/`

## Stand

| Punkt | Wert |
|---|---|
| Stand dieser README | 20.10.2026 |
| Letzte große Änderung | 06.08.2026 — Scroll- und Interaktions-Politur (Vorhang-Reveal, Magnet-Knöpfe, 3D-Kippen, eigener Cursor), danach Aufräumen: `HeroBackdrop.vue`, `useNavHighlight.js` und `useCardInteraction.js` ausgelagert; eigener Cursor wieder ausgeschaltet |
| Letzter Commit vor dieser README | 13.10.2026 — verwundbare Abhängigkeiten aktualisiert, `.env` aus Git ausgeschlossen |
| Neuaufbau | 23.07.2026 als Vue-App; die erste Fassung vom 29.08.2025 bestand aus einer `index.html` und einer `style.css` (ohne JavaScript) |
| Version | `0.0.0` in `package.json`; es gibt keine Versionsnummern und kein CHANGELOG — den Verlauf zeigt `git log` |

Weitere Doku: siehe [Doku-Wegweiser](#doku-wegweiser).

## Voraussetzungen

| Was | Hinweis |
|---|---|
| Node.js | `^22.18.0 \|\| >=24.12.0` (Feld `engines` in `package.json`): Node 22 ab 22.18 oder Node 24.12 und neuer. Node 23 ist nicht vorgesehen. Eine `.nvmrc` (Datei, mit der Werkzeuge wie nvm die Node-Version automatisch wählen) gibt es nicht |
| npm | kommt mit Node |
| Git | zum Holen des Codes und zum Veröffentlichen |
| Browser | ein aktueller Browser; der Code enthält eigene Anpassungen für Safari (siehe Lernheft 11 und 14) |
| GitHub-Konto | nur zum Veröffentlichen: Schreibrechte am Repo `MoonIsBack/TrapHouse-Website` |

Node-Version prüfen:

```bash
node --version
```

## Installation

1. Code holen (ist das Repo privat, brauchst du Zugriff darauf):

   ```bash
   git clone https://github.com/MoonIsBack/TrapHouse-Website.git
   ```

2. In den Projektordner wechseln:

   ```bash
   cd TrapHouse-Website
   ```

3. Pakete installieren (beim ersten Mal und wenn sich `package.json` geändert hat):

   ```bash
   npm install
   ```

## Entwicklung

Alle Befehle stehen in `package.json` unter `scripts`.

Entwicklungsserver starten: `http://localhost:5173/TrapHouse-Website/`. Der Teil
`/TrapHouse-Website/` kommt von `base` in `vite.config.js`. Rufst du nur
`http://localhost:5173/` auf, leitet Vite selbst dorthin weiter; andere Adressen
ohne diesen Teil zeigen nur den Hinweis „The server is configured with a public
base URL …". Beenden mit `Strg + C`:

```bash
npm run dev
```

Fertige Fassung nach `dist/` bauen:

```bash
npm run build
```

Den Build so ansehen, wie er online liegt (vorher `npm run build`; meist
`http://localhost:4173/TrapHouse-Website/`). Nur hier ist die CSP aktiv — die
Sicherheitsregel, was der Browser laden darf. Immer einmal vor dem
Veröffentlichen:

```bash
npm run preview
```

Code prüfen: erst oxlint, dann ESLint (zwei „Linter" — Programme, die typische
Fehler suchen). ⚠ Beide laufen mit `--fix` und **ändern Dateien**, wenn sie etwas
automatisch beheben können:

```bash
npm run lint
```

Den Code in `src/` mit Prettier einheitlich formatieren (schreibt die Dateien um):

```bash
npm run format
```

Ein Test-Skript gibt es nicht (siehe [Tests und Prüfkette](#tests-und-prüfkette)).

## Aufbau

```text
TrapHouse-Website/
├── index.html            Einstiegspunkt: Titel, Beschreibung, Vorschau-Angaben (og:), Tab-Logo
├── vite.config.js        base-Pfad, @-Kürzel für src/, CSP-Plugin
├── package.json          Abhängigkeiten, Befehle, Node-Version
├── .env.development      Werte nur für npm run dev (siehe Konfiguration)
├── .github/workflows/    deploy.yml — Build und Veröffentlichung
├── public/               nur das Tab-Logo
├── docs/lernheft/        das Lernheft
└── src/
    ├── main.js           startet Vue und den Router, setzt den Seitentitel
    ├── App.vue           der Rahmen: Kopf, Inhalt (RouterView), Fuß, Deko-Ebenen
    ├── router/index.js   Adresse → Seite (Hash-Routing mit # in der Adresse)
    ├── views/            je eine Datei pro Seite
    ├── components/       AppHeader, AppFooter, AppCursor, BackdropGlow, PixelCorners
    │   ├── ui/           überall verwendet: BaseButton, NavLink, SectionHeader, MarqueeBand, ScrollProgress
    │   ├── icons/        SVG-Icons als eigene Komponenten
    │   └── home/ shop/ socials/ discord/ legal/   Bausteine je Bereich
    ├── composables/      Logik ohne eigenes Aussehen (useXxx.js)
    ├── config/           Schalter: legalConfig, linkConfig, scrollConfig, cursorConfig
    ├── data/             Inhalte: navigation, socialLinks, products, community
    └── assets/           main.css (Design-Tokens), fonts.css + fonts/, images/
```

Die Faustregel: **`data/` ist für Inhalte, `assets/` für Material, `config/`
für Entscheidungen.** Eine neue Unterseite braucht immer drei Dinge: View,
Route und Navigationseintrag.

Die wichtigsten Dateien:

| Datei | Aufgabe |
|---|---|
| `src/router/index.js` | ordnet Adressen den Views zu; die Rechtsrouten nur, wenn `showLegalPages` wahr ist |
| `src/assets/main.css` | alle Design-Tokens (Farben, Abstände, Rundungen, Bewegungskurven) und gemeinsame Klassen wie `.container`, `.section`, `.reveal` |
| `src/data/socialLinks.js` | Social-Kanäle und der Discord-Einladungslink `DISCORD_INVITE` |
| `src/data/products.js` | die Merch-Artikel und ihr `status` |
| `src/data/navigation.js` | Menüpunkte für Kopf und Fuß, dazu `RANKROOM_URL` |
| `src/config/legalConfig.js` | Angaben für Impressum und Datenschutz, `showLegalPages` |
| `src/components/AppHeader.vue` | Kopfbereich mit Desktop-Leiste und Klappmenü |
| `src/composables/useHomeScroll.js` | wählt das Scrollverhalten der Startseite aus |

Die Akzentfarbe (Orange, `--accent`) steht nur in `main.css`; die Komponenten
benutzen `var(--accent)` und die übrigen Tokens. So lässt sich die Seite an
einer Stelle umfärben, und RankRoom könnte später mit einem eigenen CSS-Block
seine Farben behalten. Feste Farben gibt es nur an wenigen Stellen: den dunklen
Grundverlauf in `home/HeroBackdrop.vue`, die rote Warnfarbe in
`legal/LegalPage.vue` und die Markenfarben der Kanäle in `data/socialLinks.js`.
Dazu kommen einige durchsichtige Weiß- und Schwarztöne für feine Linien und
Schatten (zum Beispiel in `ProductCard.vue` und `AppFooter.vue`).

**Datenfluss:** `main.js` startet Vue mit dem Router. `App.vue` setzt den immer
gleichen Rahmen (Kopf, Fuß, Hintergrund), dazwischen setzt der Router die View
ein, die zur Adresse passt. Die Views holen ihre Inhalte aus `src/data/` (zum
Beispiel `PRODUCTS`) und geben sie als Props (Eingabewerte) an Komponenten wie
`ProductCard.vue` weiter, die nur anzeigen. Zustand wie „Klappmenü offen"
steckt in Composables (`useMobileNav.js`); die Bewegungs-Composables setzen
nur Klassen, CSS-Variablen oder eine Verschiebung (`transform` in
`useParallax.js`) — wie es aussieht, steht im CSS. Gespeichert
oder an einen Server geschickt wird nichts.

## Konfiguration

| Stelle | Wofür | Stand 20.10.2026 |
|---|---|---|
| `vite.config.js` → `base: '/TrapHouse-Website/'` | Unterordner auf GitHub Pages | Wird die Seite die Hauptseite (`moonisback.github.io/` oder eigene Domain), muss hier `'/'` stehen — die einzige Zeile für den Umzug |
| `vite.config.js` → `CONTENT_SECURITY_POLICY` | was der Browser laden darf | siehe [Sicherheit und Datenschutz](#sicherheit-und-datenschutz) |
| `src/config/scrollConfig.js` → `HOME_SCROLL_MODE` | Scrollverhalten der Startseite: `'standard'` (normal) oder `'chapter'` (ein Impuls = ein Kapitel) | `'standard'` |
| `src/config/linkConfig.js` → `EXTERNE_LINKS_AKTIV` | Links zu Discord, YouTube, TikTok, Instagram an oder aus (RankRoom bleibt immer erreichbar) | `true` |
| `src/config/cursorConfig.js` → `EIGENER_CURSOR_AKTIV` | eigener Mauszeiger statt des normalen | `false` |
| `src/config/legalConfig.js` | `operator` (Betreiberangaben), `hoster` (GitHub), `legalFacts`, `LEGAL_LINKS`, `showLegalPages` | in `operator` stehen noch Platzhalter `AUSFÜLLEN` |
| `src/data/products.js` → `status` | `'ankuendigung'` = nur Bild, Name, Text; `'verfuegbar'` = Preis und Kaufknöpfe | `'ankuendigung'` |
| `src/data/socialLinks.js` | Kanäle und `DISCORD_INVITE` — muss ein Dauerlink sein | — |
| `src/data/navigation.js` | `NAV_LINKS` und `RANKROOM_URL` | — |
| `src/data/community.js` | Wörter im Laufband, die Karten „Was dich erwartet" | — |
| Seitentitel | steht in `index.html` **und** in `src/main.js` | beide gemeinsam ändern |

Die Schalter `legalFacts` in `legalConfig.js` blenden Abschnitte der
Rechtsseiten ein und aus — sie müssen beschreiben, was die Seite wirklich tut
(alle stehen am 20.10.2026 auf `false`):

| Schalter | Auf `true`, wenn … |
|---|---|
| `usesCookies` | irgendetwas Cookies setzt — dann braucht es zusätzlich ein Einwilligungsbanner |
| `usesThirdParty` | etwas von fremden Servern geladen wird |
| `hasContactForm` | es ein Formular gibt |
| `sellsGoods` | wirklich verkauft wird — dann fehlen noch AGB und Widerrufsbelehrung |

Umgebungsvariablen:

| Variable | Wo | Zweck |
|---|---|---|
| `VITE_RANKROOM_URL` | gelesen in `src/data/navigation.js`; für `npm run dev` kommt der Wert aus `.env.development` (laut Kommentar in `navigation.js`: dein lokaler RankRoom-Server) | Ziel des Menüpunkts „RankRoom". Fehlt sie — so im Build —, gilt `https://moonisback.github.io/RankRoom/` |

`.env.development` liegt laut Kommentar in `.gitignore` bewusst im Repo und
enthält keine Geheimnisse. Echte Geheimnisse gehören in `.env.local`;
`.gitignore` schließt `*.local`, `.env`, `.env.production`, `*.pem` und
`*.key` aus.

## Tests und Prüfkette

- Es gibt keine automatischen Tests — kein Test-Skript in `package.json`, kein
  Test-Schritt im Workflow. Laut Lernheft (Kapitel 40) vertretbar, solange die
  Seite nichts berechnet.
- Prüfen heißt hier: `npm run build` (findet Fehler), danach `npm run preview`
  und jede Seite einmal anklicken — falsche Bildpfade und CSP-Blockaden zeigen
  sich nur im Build, ein `base`-Wert, der nicht zur Live-Adresse passt, erst
  online.
- `npm run lint` und `npm run format` gesammelt vor dem Commit.

## Veröffentlichen

Die Seite liegt auf GitHub Pages (kostenloser Hoster für statische Seiten). Der
Workflow `.github/workflows/deploy.yml` („Deploy TrapHouse to GitHub Pages")
startet bei jedem Push auf `main` — oder von Hand unter Actions →
„Run workflow" (`workflow_dispatch`). Er läuft so:

1. Code auschecken, Node 22 einrichten
2. `npm ci` — Pakete exakt nach `package-lock.json` installieren
3. `npm run build`
4. `dist/` hochladen und auf GitHub Pages veröffentlichen

Der übliche Ablauf im Terminal — erst prüfen:

```bash
npm run build
```

```bash
npm run preview
```

Dann (nach `Strg + C`) festhalten und hochladen:

```bash
git status
```

```bash
git add -A
```

```bash
git commit -m "Was geändert wurde"
```

```bash
git push
```

Gut zu wissen:

- Den Fortschritt siehst du auf GitHub im Repo unter **Actions**. Nach dem
  grünen Haken noch bis zu einer Minute warten und hart neu laden
  (`Cmd + Shift + R`).
- Auf GitHub muss einmalig **Settings → Pages → Source** auf „GitHub Actions"
  stehen. Lokal lässt sich das nicht prüfen; laut GitHub-API ist es so
  eingestellt (Abfrage am 21.10.2026).
- Live-Adresse: `https://moonisback.github.io/TrapHouse-Website/` (steht als
  Kommentar bei `base` in `vite.config.js` und im Lernheft, Kapitel 06 und 08).
  Ein Abruf am 20.10.2026 ergab HTTP 200 — die Seite wird also ausgeliefert.
- Schritt für Schritt mit allen Sonderfällen (404 nach „privat → öffentlich",
  Umzug auf eigene Domain): Lernheft, Kapitel 08.

## Fehlersuche

| Symptom | Ursache und Lösung |
|---|---|
| `npm run dev` zeigt nur „The server is configured with a public base URL …" | Die Adresse braucht den Teil `/TrapHouse-Website/` |
| „There isn't a GitHub Pages site here" | Pages ist nicht eingerichtet (passiert z. B. nach „privat → öffentlich") — Lernheft 08, Sonderfall B |
| Weiße Seite online, ohne Fehlermeldung | Source steht auf „Deploy from a branch" statt „GitHub Actions" |
| Seite ohne Bilder und Styles, weiß nach Domain-Umzug | `base` in `vite.config.js` passt nicht zur Adresse |
| Konsole meldet etwas mit „Content Security Policy" | Etwas lädt von außen — in der CSP in `vite.config.js` erlauben oder weglassen |
| Alte Fassung wird angezeigt | Browser-Zwischenspeicher: `Cmd + Shift + R` |
| `#/impressum` oder `#/datenschutz` zeigt online die 404-Seite | `operator` in `legalConfig.js` enthält noch Platzhalter; solange blendet `showLegalPages` beide Seiten bewusst aus. Lösung: Platzhalter ersetzen (siehe [Offene Punkte](#offene-punkte)) |
| Falsche Seite bei einer Adresse | `src/router/index.js` |
| Klappmenü klemmt | `src/composables/useMobileNav.js` |
| Port 5173 belegt | Vite nimmt den nächsten freien Port — Adresse in der Ausgabe lesen |

Logdateien gibt es nicht (kein Server). Fehler zur Laufzeit zeigt die
Browser-Konsole (F12 → „Console"), Build-Fehler das Terminal oder der Lauf
unter Actions.

## Sicherheit und Datenschutz

- **Nichts von fremden Servern:** Schriften (Anton, Poppins) liegen in
  `src/assets/fonts/`, Icons sind eigene SVG-Komponenten in
  `src/components/icons/` — statt Google Fonts und Font Awesome vom CDN wie in
  der alten Fassung. Kein Tracking, keine Cookies, kein Formular, keine
  Speicherung im Browser. Zur Laufzeit gibt es nur Vue und vue-router.
- **CSP** (Content Security Policy — Liste dessen, was der Browser für die Seite
  laden darf): wird als `<meta>`-Angabe **nur beim Build** in die `index.html`
  geschrieben (`cspPlugin` mit `apply: 'build'`), weil sie im Dev-Server das
  automatische Neuladen blockieren würde. Regeln: `default-src 'self'`,
  `script-src 'self'`, `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`.
- `frame-ancestors` wirkt nur als HTTP-Header, den GitHub Pages nicht erlaubt —
  deshalb bewusst weggelassen.
- **Externe Links** öffnen in einem neuen Tab mit `rel="noopener noreferrer"`:
  Die fremde Seite bekommt keinen Zugriff auf das Ursprungs-Tab und erfährt
  nicht, woher der Besucher kam. Eine seitenweite
  `<meta name="referrer">`-Angabe wie in RankRoom gibt es hier nicht.
- **Link-Schalter:** Mit `EXTERNE_LINKS_AKTIV = false` bleiben die Links
  sichtbar und per Tastatur erreichbar, der Klick wird aber abgefangen
  (`aria-disabled` für Screenreader).
- **Datenschutzerklärung** (`src/views/PrivacyView.vue`): beschreibt das
  Hosting bei GitHub (Server-Logs mit IP-Adressen, Übermittlung in die USA);
  Abschnitte richten sich nach `legalFacts`. Sie ist live erst erreichbar, wenn
  `legalConfig.js` ausgefüllt ist (siehe [Offene Punkte](#offene-punkte)).
- Kein `v-html`, kein `innerHTML`, kein `eval` im Code (per Suche am 20.10.2026
  geprüft).

## Doku-Wegweiser

| Dokument | Inhalt |
|---|---|
| [`docs/lernheft/00-START-Inhaltsverzeichnis.md`](docs/lernheft/00-START-Inhaltsverzeichnis.md) | Lernheft mit allen Kapiteln, gleiche Machart wie bei RankRoom |
| [03 — Wie TrapHouse aufgebaut ist](docs/lernheft/03-Wie-TrapHouse-aufgebaut-ist.md) | die wichtigste Seite, wenn du wenig Zeit hast |
| [05 — Dateien, die ich häufig ändere](docs/lernheft/05-Dateien-die-ich-haeufig-aendere.md) und [21 — Inhalte ändern](docs/lernheft/21-Inhalte-aendern.md) | Texte, Preise, Links austauschen |
| [08 — Veröffentlichen Schritt für Schritt](docs/lernheft/08-Veroeffentlichen-Schritt-fuer-Schritt.md) | Deploy und Sonderfälle |
| [22 — Impressum und Datenschutz](docs/lernheft/22-Rechtsseiten.md) | was vor dem Online-Gehen auszufüllen ist |
| [30 — RankRoom später einbinden](docs/lernheft/30-RankRoom-spaeter-einbinden.md) | Plan zum Zusammenführen |
| [40 — Was noch fehlt](docs/lernheft/40-Was-noch-fehlt.md) | offene Punkte, ausführlich |

## Offene Punkte

Stand 20.10.2026, gegen den Code geprüft:

- **Impressum und Datenschutz ausfüllen — das eine Muss.** In
  `src/config/legalConfig.js` tragen im Block `operator` noch fünf Felder den
  Platzhalter `AUSFÜLLEN` (`name`, `street`, `zip`, `city`, `email`).
  Die Folge heute:
  - Mit `npm run dev` sind beide Seiten erreichbar und zeigen oben einen roten
    Warnkasten.
  - In der gebauten, veröffentlichten Fassung gibt es beide Seiten **nicht**:
    `#/impressum` und `#/datenschutz` landen auf der 404-Seite, und im
    Fußbereich fehlen die Links. Die veröffentlichte Fassung hat damit derzeit
    weder Impressum noch Datenschutzerklärung (am 20.10.2026 auch auf der
    Live-Seite ausprobiert: beide Adressen zeigen die 404-Seite, im Fußbereich
    gibt es keine Rechtslinks).
  - Die Seite selbst ist trotzdem öffentlich erreichbar (HTTP 200 am
    20.10.2026). Der Warnkasten im Code (`src/components/legal/LegalPage.vue`)
    sagt dazu selbst: Solange Platzhalter drinstehen, darf die Website nicht
    öffentlich erreichbar sein. Keine Rechtsberatung.
  - Sind alle Platzhalter ersetzt, erscheinen beide Seiten samt Links
    automatisch — umstellen musst du nichts.
  - Vorher entscheiden, welche ladungsfähige Anschrift hineinkommt (ein
    Postfach reicht nicht) — Anleitung und Checkliste in Lernheft 22.
  - Danach `legalFacts` ehrlich prüfen und das Datum „Stand: Juli 2026" in
    `src/views/ImprintView.vue` und `src/views/PrivacyView.vue` von Hand
    anpassen, sobald sich der Inhalt ändert.
- Discord-Dauerlink ist eingetragen (`src/data/socialLinks.js`) — erledigt.
- GitHub Pages steht auf „GitHub Actions" (laut GitHub-API am 21.10.2026) —
  erledigt.
- **Kein echter Shop:** Der eine Artikel steht auf `'ankuendigung'`. Bei
  `'verfuegbar'` erscheinen Preis und Knöpfe, die aber noch nichts tun — ein
  echter Verkauf bräuchte Warenkorb, Zahlungsdienst, AGB, Widerruf und ein
  Backend oder einen externen Shop (Lernheft 40).
- In `index.html` fehlt `og:image` — beim Teilen erscheint die Vorschau-Karte
  ohne Bild.
- **Fehler im „Zum Inhalt springen"-Link:** In `src/App.vue` zeigt er auf
  `href="#inhalt"`. Mit Hash-Routing (`#/…` in der Adresse) liest der Router das
  als Adresse `/inhalt` — der Link führt auf die 404-Seite statt zum Inhalt (am
  20.10.2026 auf der Live-Seite bestätigt). Eine Korrektur wäre eine
  Codeänderung.
- Der Menüpunkt „RankRoom" zeigt auf `https://moonisback.github.io/RankRoom/`.
  Ein Abruf am 20.10.2026 ergab HTTP 200. Der Kommentar in
  `src/data/navigation.js` („nicht erreichbar, solange das RankRoom-Repo auf
  privat steht") ist damit überholt — ihn zu streichen wäre eine
  Codeänderung.
- **Lernheft:** Die Kapitel 01, 02, 05, 06 und 07 sind am 20.10.2026
  vollständig gegen den Code geprüft. In den übrigen Kapiteln wurden an diesem
  Tag nur die bekannten Abweichungen berichtigt (Liste im Merken-Kasten von
  Kapitel 00); der Rest ist nicht Zeile für Zeile geprüft.
- Kann-Punkte aus Lernheft 40: nur ein Artikel, keine echten Community-Zahlen,
  keine Tests, keine Sitemap und kein `robots.txt`, kein Web-Manifest,
  großes Tab-Logo.
