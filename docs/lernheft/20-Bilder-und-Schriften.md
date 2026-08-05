# Bilder und Schriften

## Wofür ist das?

Warum nichts mehr von Google kommt — und wie du ein neues Bild einbaust.

## ⭐ Warum nichts mehr von außen geladen wird

Die alte Seite hatte zwei Zeilen im `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&…" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/…" />
```

Sie sahen harmlos aus, hatten aber Folgen:

**1. Datenschutz.** Bei jedem Seitenaufruf erfuhren Google und Cloudflare die
IP-Adresse deiner Besucher. In der EU ist das ohne vorherige Einwilligung nicht
zulässig — ein Landgericht hat 2022 ausdrücklich wegen eingebundener Google
Fonts Schadensersatz zugesprochen. Sauber gelöst hätte es ein Cookie-Banner
gebraucht.

**2. Geschwindigkeit.** Der Browser musste erst eine Verbindung zu einem
fremden Server aufbauen, bevor überhaupt Text erscheinen konnte.

**3. Verlässlichkeit.** Ist der fremde Server langsam oder weg, ist deine Seite
kaputt — ohne dass du etwas falsch gemacht hast.

Jetzt liegt alles im Projekt. **Die Seite baut keine einzige Verbindung nach
außen auf.**

## Die Schriften

In `src/assets/fonts/` liegen vier Dateien, zusammen **36 KB**:

| Datei | Schrift | Größe |
|---|---|---|
| `anton-400.woff2` | Anton | 12 KB |
| `poppins-400.woff2` | Poppins normal | 8 KB |
| `poppins-600.woff2` | Poppins halbfett | 8 KB |
| `poppins-700.woff2` | Poppins fett | 8 KB |

Eingebunden werden sie in `src/assets/fonts.css`.

### Warum nur diese vier?

Die alte Seite lud **fünf Schriftfamilien** (Bebas Neue, Poppins, Bungee,
Orbitron, Anton), benutzt hat sie davon drei. Zwei wurden bei jedem Aufruf
umsonst geholt.

Jetzt sind es zwei Familien: Anton für Überschriften, Poppins für alles andere.

### Nebenbei repariert

Die alte Seite lud Poppins in 300, 400 und 700 — benutzte im CSS aber
`font-weight: 600`. Diesen Schnitt gab es also gar nicht, der Browser hat ihn
notdürftig auf 700 hochgerechnet. Jetzt wird 600 mitgeliefert.

### Was ist ein „latin-Ausschnitt"?

Die Dateien enthalten nur das lateinische Alphabet inklusive Umlauten und ß —
kein Kyrillisch, kein Griechisch, kein Vietnamesisch. Für eine deutschsprachige
Seite reicht das und spart etwa zwei Drittel der Dateigröße.

### Eine Schrift austauschen

1. `.woff2`-Datei nach `src/assets/fonts/` legen
2. In `fonts.css` einen `@font-face`-Block ergänzen
3. In `main.css` bei `body` bzw. `h1, h2, h3` den Namen eintragen

⚠ Achte auf die Lizenz. Anton und Poppins stehen unter der SIL Open Font
License — Selbst-Hosten ist ausdrücklich erlaubt. Bei gekauften Schriften ist
das oft nicht der Fall.

## Die Bilder

In `src/assets/images/`, zusammen **302 KB** (vorher 4,4 MB):

| Datei | Größe | Wofür |
|---|---|---|
| `shirt.webp` | 149 KB | Das Shirt im Shop (mit Kante) |
| `moon-pixel.webp` | 87 KB | Maskottchen beim Discord-Aufruf (animiert) |
| `traphouse-logo.webp` | 36 KB | Logo in Kopf und Fuß |
| `hero-texture.webp` | 8 KB | ⚠ liegt noch im Projekt, wird aber seit 06.08.2026 nicht mehr eingebunden — siehe unten |
| `pixel-left.png` | 3 KB | Figur unten links |
| `pixel-right.png` | 3 KB | Figur unten rechts |

### Das Maskottchen `moon-pixel.webp`

Eine **animierte** WebP-Datei: 360 × 660 px, sechs Einzelbilder, transparenter
Hintergrund. Fünfmal 100 ms, das letzte Bild 200 ms.

Die schwarze Umrandung der Figur ist **in die Bilddatei eingebrannt** — sie ist
kein CSS-Schatten. Erzeugt wurde sie, indem die Transparenzmaske jedes Bildes
um 4 Pixel verbreitert und in `#080508` eingefärbt wurde; darüber liegt die
ursprüngliche Figur unverändert.

⚠ **Nicht durch einen `drop-shadow` im CSS ersetzen.** Ein Schatten folgt der
Kante weich und rundet die Pixeltreppen ab — genau das, was bei einer
Pixelgrafik falsch aussieht. Muss die Kontur dicker oder dünner werden, gehört
die Bilddatei neu erzeugt.

### Die Kante am Shirt

`shirt.webp` ist freigestellt, also mit durchsichtigem Hintergrund. Beim
Freistellen bleibt fast immer ein Rest der alten Umgebung an der Kante hängen —
hier ein heller, ausgefranster Saum, der auf dunklem Grund wie ein
aufgemalter Umriss aussah.

Behoben wurde das direkt in der Bilddatei, nach demselben Prinzip wie beim
Maskottchen:

1. Aus der Transparenz eine harte Maske machen (ab 50 % gilt als „Shirt")
2. Diese Maske um **einen Pixel** schrumpfen
3. Der Ring zwischen beiden wird fast schwarz — das ist die Kante
4. Alles außerhalb der Maske wird vollständig durchsichtig

Schritt 4 räumt den ausgefransten Saum weg, Schritt 3 gibt der Silhouette einen
sauberen Abschluss. Die Kante liegt **nur nach innen**, die Umrisse bleiben
also exakt so groß wie vorher.

Nebeneffekt: Die Datei wurde von 163 KB auf 149 KB kleiner. Ein sauber
durchsichtiger Bereich lässt sich viel besser zusammenpacken als einer voller
halbdurchsichtiger Zwischenwerte.

⚠ Auch hier gilt: **nicht** über CSS lösen. Ein `filter: drop-shadow()` als
Umriss würde die Kante bei jeder Darstellung neu berechnen, und die Karte
vergrößert das Bild beim Darüberfahren.

### ⭐ Farbkorrekturen gehören ins Bild, nicht ins CSS

`hero-texture.webp` sah lange blass aus und wurde im CSS nachgeschärft:

```css
filter: saturate(1.6) contrast(1.1);   /* ✗ nicht mehr */
```

Das funktioniert, hat aber einen Haken: Das Bild füllt die volle Fensterbreite
und wird beim Scrollen verschoben. Der Browser muss die Farbkorrektur also über
eine sehr große Fläche rechnen, statt das Bild einfach nur hinzumalen.

Die Korrektur steckt jetzt **fest in der Datei**. Sie kostet damit gar nichts
mehr. Die Datei wurde dadurch von 5 KB auf 8 KB größer — kräftigere Farben
lassen sich schlechter zusammenpacken — aber 3 KB einmalig sind ein guter Tausch
gegen eine Rechnung bei jeder Darstellung.

Eingebacken wurde sie mit **derselben** Filter-Angabe im `canvas` des Browsers.
Ein `canvas` kennt `filter` genauso wie CSS, deshalb ist das Ergebnis exakt
dasselbe — nachgemessen lag die mittlere Abweichung bei 0,33 von 255.

**💡 Die Regel:** Was sich am Bild nie ändert, gehört ins Bild. `filter` im CSS
ist für Zustände da, die wechseln (etwa beim Darüberfahren), nicht für eine
Korrektur, die immer gilt.

⚠ **Update 06.08.2026:** `hero-texture.webp` selbst wird im Hero nicht mehr
angezeigt. Auf großen Bildschirmen wirkte ein auf 8 KB weichgezeichnetes,
großflächig gezerrtes Foto unscharf statt hochwertig. An seiner Stelle malt
jetzt `.hero-aura` in `HeroSection.vue` mehrere `radial-gradient`-Schichten in
den Markenfarben — ein Verlauf ist in jeder Auflösung von Natur aus scharf,
kann also gar nicht "verwaschen" aussehen. Die Lektion oben (Korrekturen ins
Bild statt ins CSS) gilt weiter, nur eben für andere Bilder auf der Seite. Die
Datei bleibt im Projekt liegen, falls doch wieder ein Foto gewünscht ist.

### Warum WebP?

Dasselbe Bild, deutlich kleiner: Aus 2,2 MB PNG wurden 167 KB WebP — bei
gleicher sichtbarer Qualität. WebP wird von jedem Browser unterstützt, der seit
2020 aktuell ist.

### Warum sind die Pixel-Figuren noch PNG?

Sie sind schon nur 3 KB groß. WebP würde daran nichts verbessern und kann bei
Pixelgrafik die scharfen Kanten aufweichen. **Nicht optimieren, was nicht
langsam ist.**

Damit sie scharf bleiben, steht im CSS zusätzlich:

```css
image-rendering: pixelated;
```

Ohne das rechnet der Browser die Kanten weich und macht aus scharfen Pixeln
einen Matsch.

### Die Originale sind nicht verloren

Die unkomprimierten Vorlagen liegen weiterhin in der Git-Historie. Zurückholen:

```sh
git checkout 9ec724e -- images/
```

## Ein neues Bild einbauen

**1.** Datei nach `src/assets/images/` legen

**2.** In der Komponente importieren:

```vue
<script setup>
import meinBild from '@/assets/images/mein-bild.webp'
</script>

<template>
  <img :src="meinBild" alt="Beschreibung" />
</template>
```

### ⚠ Warum importieren und nicht einfach den Pfad hinschreiben?

Weil das hier **nicht** funktioniert:

```vue
<img src="/src/assets/images/mein-bild.webp" />   <!-- ✗ -->
```

Nach dem Bauen gibt es keinen Ordner `/src/` mehr. Der Import dagegen sagt Vite
Bescheid: Es packt das Bild mit in den Build, hängt eine Prüfsumme an den Namen
(`shirt-a3f2c1.webp`) und setzt den richtigen Pfad ein. Die Prüfsumme sorgt
nebenbei dafür, dass Besucher nach einer Änderung sofort das neue Bild sehen
statt der alten Fassung aus dem Zwischenspeicher.

### Immer `alt` setzen

```vue
<img :src="bild" alt="Schwarzes TrapHouse T-Shirt mit weißem Logo" />  <!-- Inhalt -->
<img :src="deko" alt="" aria-hidden="true" />                          <!-- Deko -->
```

Bei Deko gehört ein **leeres** `alt=""` hin — nicht weglassen. Fehlt das
Attribut ganz, liest ein Screenreader den Dateinamen vor.

### `loading="lazy"`

Bilder weiter unten auf der Seite bekommen `loading="lazy"` — sie werden erst
geladen, wenn man in ihre Nähe scrollt.

⚠ **Nicht** beim Hero-Bild. Das ist als Erstes sichtbar und soll so früh wie
möglich kommen; es hat stattdessen `fetchpriority="high"`.

## 💡 Merken

**Bilder immer importieren, nie den Pfad hinschreiben.**
**Schriften und Icons gehören ins Projekt, nicht auf ein CDN.**

## Siehe auch

- [13-Design-Tokens-und-Farben](13-Design-Tokens-und-Farben.md)
- [21-Inhalte-aendern](21-Inhalte-aendern.md)
