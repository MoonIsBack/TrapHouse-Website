# Design-Tokens und Farben

## Wofür ist das?

Zu verstehen, warum in keiner Komponente eine feste Farbe steht — und wie du
das Aussehen der ganzen Seite an einer Stelle änderst.

## Was ist ein Design-Token?

Ein benannter Wert, der an **einer** Stelle definiert und **überall** benutzt
wird.

```css
/* Einmal in main.css definiert: */
:root {
  --accent: #ff2f92;
}

/* Überall benutzt: */
.button { background: var(--accent); }
.badge  { color: var(--accent); }
```

Ändere die eine Zeile — und Knopf, Badge und alles andere ändern sich mit.

In der alten `style.css` stand `#ff2f92` an mehreren Stellen einzeln. Eine
Farbänderung hieß: suchen, ersetzen, eine Stelle übersehen.

## Die Tokens im Überblick

Alle stehen ganz oben in `src/assets/main.css`.

### Hintergrund

```css
--bg-top: #150d13;      /* oben, minimal heller */
--bg-bottom: #0b070a;   /* unten, fast schwarz */
```

Beide haben einen leichten Rotstich. Das ist Absicht: Auf reinem Grau (#111,
wie in der alten Fassung) wirkt Pink wie ein Fremdkörper.

### Schrift — vier Stufen

```css
--text: #f8f3f6;            /* Überschriften */
--text-secondary: #d0c4cb;  /* Fließtext */
--text-muted: #9c8e96;      /* Labels, Nebeninfos */
--text-subtle: #6d6169;     /* ganz dezent */
```

⚠ **Immer eine dieser vier nehmen, nie ein eigenes Grau erfinden.** Sonst hat
die Seite nach ein paar Wochen zwölf leicht verschiedene Graustufen und wirkt
unruhig, ohne dass man sagen kann, warum.

### Akzent

```css
--accent: #ff2f92;         /* das TrapHouse-Pink */
--accent-strong: #ff5fa8;  /* heller, für Hover */
--accent-rgb: 255, 47, 146;
--accent-gradient: linear-gradient(135deg, #ff2f92, #b026ff);
```

### Warum gibt es `--accent-rgb` zusätzlich?

Weil CSS eine Hex-Farbe nicht halbtransparent machen kann. Das geht nicht:

```css
background: rgba(var(--accent), 0.2);   /* ✗ funktioniert nicht */
```

Das geht:

```css
background: rgba(var(--accent-rgb), 0.2);   /* ✓ */
```

⚠ Änderst du `--accent`, musst du `--accent-rgb` **mitändern**. Die beiden
müssen dieselbe Farbe beschreiben, sonst haben Flächen und Ränder plötzlich
verschiedene Farbtöne.

Hex → RGB umrechnen: `#ff2f92` → `ff`=255, `2f`=47, `92`=146.

### Flächen, Rundungen, Schatten

```css
--surface: rgba(255, 255, 255, 0.045);   /* milchiges Glas */
--border-soft: rgba(255, 255, 255, 0.09);

--radius-sm: 10px;  --radius-md: 16px;
--radius-lg: 24px;  --radius-pill: 999px;

--shadow-card: 0 18px 40px rgba(0, 0, 0, 0.35);
```

Die Karten sind keine festen Farbflächen, sondern sehr helle durchsichtige
Flächen mit hellem Rand. Dadurch scheint der Hintergrund durch und die Seite
wirkt weniger flach.

Die Schatten sind **groß und weich** statt klein und hart — das lässt Elemente
schweben, statt einen Rand um sie zu zeichnen.

### Maße

```css
--content-width: 1120px;   /* wie breit der Inhalt maximal wird */
--page-padding: 24px;      /* Luft an den Seiten */
--header-height: 72px;
```

## Die zwei Schriften

| Schrift | Wofür | Schnitte |
|---|---|---|
| **Anton** | Überschriften (h1, h2, h3), Preise | nur 400 |
| **Poppins** | alles andere | 400, 600, 700 |

Überschriften laufen automatisch über Anton — das steht einmal zentral in
`main.css` und nicht in jeder Komponente:

```css
h1, h2, h3 {
  font-family: 'Anton', 'Poppins', sans-serif;
  text-transform: uppercase;
}
```

## Die wiederkehrenden Klassen

Neben den Farbwerten stehen in `main.css` ein paar Klassen, die überall benutzt
werden. Sie sind der Grund, warum die Seite einen gleichmäßigen Rhythmus hat:

| Klasse | Wofür |
|---|---|
| `.container` | Gemeinsame Inhaltsbreite (1120 px) + Abstand zum Rand |
| `.section` | Der Abstand oben und unten zwischen zwei Bereichen |
| `.product-grid` | Kartenraster **mit** Obergrenze pro Karte (Merch) |
| `.card-grid` | Kartenraster, das die Breite ausfüllt (Social-Kanäle) |
| `.reveal` | Element blendet ein, sobald es ins Bild kommt |
| `.reveal-stagger` | Kinder blenden nacheinander ein statt gleichzeitig |
| `.spotlight` | Lichtfleck folgt dem Mauszeiger über der Karte |

Eine neue Seite braucht dadurch fast kein eigenes CSS mehr:

```vue
<section class="section">
  <div class="container">
    <div class="card-grid reveal-stagger">…</div>
  </div>
</section>
```

### ⭐ Warum die beiden Raster zentral stehen

Sie waren vorher fast gleich in `HomeView`, `ShopView` und `SocialsView`
hinterlegt. Dreimal dasselbe heißt: Ändert man es an einer Stelle, franst es an
den anderen beiden aus — und genau das war passiert.

Beide benutzen dieselbe Schreibweise:

```css
grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
```

⚠ Das `min(280px, 100%)` ist wichtig. Ohne es hieße die Regel „jede Spalte ist
mindestens 280 px breit" — auch auf einem Handy, das gar keine 280 px übrig
hat. Dann wird das Raster breiter als die Seite und man kann seitlich
wegscrollen. Mit `min(…, 100%)` gibt die Spalte nach, sobald es eng wird.

**Diese Schreibweise gehört in jedes neue Raster.**

## Wie du die Seite umfärbst

Willst du statt Pink z. B. ein Giftgrün, änderst du **drei Zeilen**:

```css
--accent: #2fff92;
--accent-strong: #5fffa8;
--accent-rgb: 47, 255, 146;
--accent-gradient: linear-gradient(135deg, #2fff92, #26ffb0);
```

Und passe den Rotstich im Hintergrund an, damit er zur neuen Farbe passt.

## ⚠ Weichzeichner und Bewegung vertragen sich nicht

Eine Regel, die man einmal teuer bezahlt und danach nie wieder vergisst:

> `filter: blur()` ist in Ordnung, solange sich das Element **nicht bewegt**.
> Sobald Animation oder Scrollen dazukommen, gehört die Weichheit in den
> Farbverlauf statt in einen Filter.

Der Grund: Ein Filter zwingt den Browser, das Element erst zu zeichnen und das
Ergebnis danach weichzurechnen. Bewegt sich das Element, passiert das bei
**jedem einzelnen Bild** — und Safari macht das auf demselben Prozess, der auch
Mausklicks entgegennimmt. Die ganze Seite reagiert dann verzögert.

Statt eines weichgezeichneten Kreises also lieber ein Farbverlauf, der von
Haus aus weich ausläuft:

```css
/* teuer, sobald es sich bewegt */
background: rgba(var(--accent-rgb), 0.5);
filter: blur(110px);

/* günstig, sieht genauso aus */
background: radial-gradient(
  circle closest-side,
  rgba(var(--accent-rgb), 0.5) 0%,
  rgba(var(--accent-rgb), 0.18) 40%,
  transparent 76%
);
```

Was das konkret ausgemacht hat, steht bei `BackdropGlow.vue` in
[11-Komponenten-Uebersicht](11-Komponenten-Uebersicht.md).

Dasselbe gilt für `backdrop-filter` (die milchige Fläche im Kopfbereich). Der
ist hier unkritisch, weil sich der Kopfbereich nicht bewegt — aber er gehört
nicht in eine `transition`, denn dann wird er beim Ein- und Ausblenden doch
wieder Bild für Bild neu berechnet.

### Der Verwandte davon: `background-attachment: fixed`

```css
/* ✗ bremst Safari beim Scrollen */
body {
  background: linear-gradient(180deg, var(--bg-top), var(--bg-bottom)) fixed;
}
```

Das `fixed` am Ende heißt: Der Hintergrund bleibt beim Scrollen stehen. Sieht
gut aus, ist aber dieselbe Falle — ein festgenagelter Hintergrund lässt sich
nicht mitschieben, er muss laufend neu gezeichnet werden.

Der Verlauf liegt deshalb jetzt in `BackdropGlow.vue`. Dieses Element ist
ohnehin schon `position: fixed` und hat eine eigene Ebene; dort kostet dasselbe
Aussehen nichts. Am `body` steht nur noch die Grundfarbe.

**💡 Kurzfassung aller drei Fälle:** Wenn der Browser eine Fläche bei jedem
Bild neu ausrechnen muss, wird die ganze Seite träge — auch die Klicks. Alles,
was sich bewegt, sollte er nur **verschieben** müssen.

## 💡 Merken

**Steht in einer Komponente eine Farbe wie `#ff2f92`, ist das ein Fehler.**
Dort gehört `var(--accent)` hin.

Der Test: Kannst du die Seite umfärben, indem du nur `main.css` anfasst? Wenn
ja, ist alles richtig.

## ⚠ Vorsicht

Ausnahme sind die **Markenfarben** der Social-Kanäle in `data/socialLinks.js`.
Das YouTube-Rot ist keine Design-Entscheidung, sondern gehört zu YouTube — es
darf sich nicht mitändern, wenn du die Seite umfärbst. Deshalb steht es bei den
Daten und nicht bei den Tokens.

## Siehe auch

- [20-Bilder-und-Schriften](20-Bilder-und-Schriften.md)
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md) — dort werden die Tokens umschaltbar
