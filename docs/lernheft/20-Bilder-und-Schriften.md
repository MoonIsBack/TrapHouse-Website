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
| `shirt.webp` | 167 KB | Das Shirt im Shop |
| `moon-pixel.webp` | 87 KB | Maskottchen beim Discord-Aufruf (animiert) |
| `traphouse-logo.webp` | 36 KB | Logo in Kopf und Fuß |
| `hero-texture.webp` | 5 KB | Hintergrund im Hero |
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
<img :src="bild" alt="Schwarzes TrapHouse T-Shirt mit pinkem Logo" />  <!-- Inhalt -->
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
