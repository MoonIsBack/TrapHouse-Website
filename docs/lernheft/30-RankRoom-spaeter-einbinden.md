# ⭐ RankRoom später einbinden

## Wofür ist das?

Der Plan, TrapHouse zur Hauptseite zu machen und RankRoom als Unterseite darin
aufgehen zu lassen. **Noch ist nichts davon umgesetzt** — dieses Kapitel
beschreibt, wie es gehen würde und worauf du achten musst.

## Warum das jetzt schon dokumentiert ist

Weil es die Bauweise von TrapHouse bereits beeinflusst hat. Drei Entscheidungen
wurden **wegen** dieses Ziels so getroffen:

| Entscheidung | Grund |
|---|---|
| Gleicher Stack (Vue 3 + Vite, JavaScript) | RankRooms Dateien können praktisch unverändert umziehen |
| vue-router von Anfang an | Es gibt schon eine Struktur für Unterseiten |
| Farben konsequent über `var(--accent)` | RankRoom kann seine eigenen Farben behalten |

Hätte TrapHouse als statische HTML-Seite neu gebaut werden sollen, wäre das
Zusammenführen später ein kompletter Neuschrieb geworden.

## Die drei Möglichkeiten

### A) RankRoom wird eine Route in TrapHouse ⭐ empfohlen

```
traphouse.de/#/           Startseite
traphouse.de/#/shop       Shop
traphouse.de/#/rankroom   ← die Tierlist-App
```

**Dafür:** Ein Projekt, ein Build, ein Deploy. Gemeinsamer Kopf- und
Fußbereich. Besucher merken, dass beides zusammengehört.

**Dagegen:** Die Dateien müssen wirklich umziehen. Wer nur die Startseite
aufruft, lädt zwar RankRoom nicht mit (dank lazy loading) — aber beide
Projekte hängen ab dann an einem `package.json`.

### B) Getrennt lassen, nur verlinken

TrapHouse bekommt einen Menüpunkt, der nach
`moonisback.github.io/RankRoom/` führt.

**Dafür:** Null Aufwand, nichts kann kaputtgehen.
**Dagegen:** Zwei getrennte Seiten mit unterschiedlichem Aussehen. Der
Kopfbereich verschwindet beim Wechsel.

→ **Fang damit an.** Als Zwischenschritt ist das völlig in Ordnung, und du
merkst dabei, ob du die enge Verzahnung überhaupt willst.

### C) Monorepo mit zwei Builds

Beide Projekte in einem Ordner, aber getrennt gebaut.

**Dagegen:** Der Aufwand von A ohne dessen Vorteile. Für zwei Projekte dieser
Größe zu kompliziert.

## Der Weg für Möglichkeit A

### Schritt 1: RankRooms Dateien umziehen

Alles nach `src/rankroom/`, damit nichts kollidiert:

```
src/
├── components/          TrapHouse
│   ├── AppHeader.vue
│   └── AppFooter.vue
│
└── rankroom/            RankRoom, komplett für sich
    ├── components/
    │   ├── AppHeader.vue      ← anderer AppHeader!
    │   └── AppFooter.vue
    ├── composables/
    ├── utils/
    ├── storage/
    ├── data/
    └── config/
```

⚠ **Warum ein eigener Unterordner zwingend nötig ist:** Beide Projekte haben
eine `AppHeader.vue`, eine `AppFooter.vue` und eine `HeroSection.vue`. In einem
gemeinsamen `components/`-Ordner würden sie sich gegenseitig überschreiben.

### Schritt 2: RankRooms `App.vue` wird eine View

Aus `RankRoom/src/App.vue` wird `src/views/RankRoomView.vue`. Alle Importe
darin von `@/components/…` auf `@/rankroom/components/…` umstellen.

### Schritt 3: Die Route eintragen

In `src/router/index.js`:

```js
{
  path: '/rankroom',
  name: 'rankroom',
  component: () => import('@/views/RankRoomView.vue'),
},
```

⚠ Unbedingt mit `() => import(…)` — also nachgeladen. RankRoom ist deutlich
größer als der Rest der Seite; wer nur den Shop anschauen will, soll die
Tierlist-App nicht mit herunterladen müssen.

### Schritt 4: Die Farben trennen

Das ist der Teil, für den TrapHouse schon vorbereitet ist.

RankRooms `main.css` definiert seine Indigo-Farben an `:root` — also für die
**ganze** Seite. Kopierst du das unverändert, wäre plötzlich alles indigo.

Stattdessen die Werte in einen eigenen Block umziehen:

```css
/* in src/assets/main.css ergänzen */
.rankroom-scope {
  --accent: #a5b4fc;
  --accent-strong: #818cf8;
  --accent-rgb: 129, 140, 248;
  --accent-gradient: linear-gradient(135deg, #818cf8, #8b5cf6);
  --bg-top: #101019;
  --bg-bottom: #0a0a11;
}
```

Und in `RankRoomView.vue` das Ganze einwickeln:

```vue
<template>
  <div class="rankroom-scope">
    <!-- RankRooms Inhalt -->
  </div>
</template>
```

**Warum das funktioniert:** CSS-Variablen werden nach unten vererbt. Innerhalb
dieses `div` gilt das Indigo, außerhalb weiter das Pink. Genau deshalb steht in
TrapHouses Komponenten nirgends eine feste Farbe, sondern immer `var(--accent)`.

→ Willst du RankRoom stattdessen an TrapHouse angleichen, lässt du diesen
Block einfach weg. Dann übernimmt RankRoom das Pink — ohne eine einzige
Änderung an seinen Komponenten.

### Schritt 5: Die CSP erweitern

RankRoom braucht mehr als TrapHouse. In `vite.config.js`:

```js
// RankRoom speichert hinzugefügte Bilder als Data-URL und erzeugt beim
// Export blob:-Adressen. Ohne beides bleiben Bilder unsichtbar.
"img-src 'self' data: blob:",
```

⚠ Wird das vergessen, funktioniert RankRoom im Entwicklungsserver einwandfrei
und ist erst **nach dem Deploy** kaputt — die CSP wird ja nur beim Bauen
eingefügt. Deshalb nach dem Zusammenführen unbedingt einmal
`npm run build && npm run preview` laufen lassen.

### Schritt 6: Die `viewport`-Angabe klären

RankRooms `index.html` hat:

```html
content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
```

TrapHouse hat bewusst **nur** `width=device-width, initial-scale=1.0`.

`user-scalable=no` verhindert das Zoomen mit zwei Fingern. Für RankRoom ist das
sinnvoll, weil man dort Karten mit dem Finger zieht und sonst versehentlich die
Seite zoomt. Für eine Lese-Seite ist es ein Problem: Wer schlecht sieht, kann
nicht mehr vergrößern.

→ Beim Zusammenführen bei TrapHouses Fassung bleiben und in RankRoom stattdessen
`touch-action: none` auf die Zieh-Fläche setzen. Das unterbindet gezielt die
Geste dort, wo sie stört, ohne das Zoomen der ganzen Seite abzuschalten.

### Schritt 7: `base` prüfen

Zieht die Seite auf eine eigene Domain um:

```js
base: '/',   // statt '/TrapHouse-Website/'
```

## Worauf du sonst achten musst

| Punkt | Warum |
|---|---|
| **localStorage-Schlüssel** | RankRoom speichert Tierlisten lokal. Läuft es unter einer neuen Adresse, sind gespeicherte Listen der Nutzer weg — dieselben Daten, andere Herkunft. Vorher ankündigen oder eine Export-Erinnerung einbauen |
| **Alte Links** | `moonisback.github.io/RankRoom/` sollte weiter funktionieren. Am einfachsten: das alte Repo stehen lassen und dort eine Weiterleitung einrichten |
| **Zwei `package.json`** | Die Abhängigkeiten müssen zusammengeführt werden. Beide nutzen dieselben Versionen — sollte glattgehen |
| **Doppelte Composables** | Beide haben ein `useScrollReveal`-artiges Muster? Nein — TrapHouse hat `useScrollReveal`, RankRoom nicht. Keine Kollision |
| **Die Rechtsseiten** | RankRooms `legalConfig.js` und die Rechtsseiten gelten dann für die **ganze** Seite, nicht nur für die Tierlist-App. Impressum und Datenschutz müssten entsprechend erweitert werden |

## Reihenfolge, die ich empfehlen würde

1. **Jetzt:** Möglichkeit B — nur verlinken. Kostet zehn Minuten
2. **Wenn TrapHouse steht:** Discord-Link eintragen, Inhalte finalisieren
3. **Wenn du sicher bist, dass du es willst:** Schritte 1–7 an einem Stück, in
   einem eigenen Git-Branch
4. **Danach:** `npm run build && npm run preview` — und wirklich jede Seite
   einmal anklicken

⚠ Mach das nicht nebenbei zwischen zwei anderen Änderungen. Es sind viele
kleine Umstellungen, und wenn dabei etwas anderes gleichzeitig kaputtgeht,
findest du die Ursache nicht mehr.

## 💡 Merken

**Das Zusammenführen ist vorbereitet, aber nicht angefangen.**

Der wichtigste Baustein dafür ist unscheinbar: Weil in TrapHouse nirgends eine
feste Farbe steht, sondern immer `var(--accent)`, lassen sich beide Projekte
später mit **einem** CSS-Block entweder trennen oder angleichen.

## Siehe auch

- [13-Design-Tokens-und-Farben](13-Design-Tokens-und-Farben.md) — warum die Tokens so aufgebaut sind
- [14-Router-und-Unterseiten](14-Router-und-Unterseiten.md) — wie eine Route entsteht
- [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md) — `base` und CSP
