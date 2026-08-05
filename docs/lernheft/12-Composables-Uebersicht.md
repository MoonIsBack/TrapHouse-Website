# Composables-Übersicht

## Wofür ist das?

TrapHouse hat zehn Composables. Jedes erledigt Dinge, die man beim
Selbstbauen zuverlässig vergisst — Aufräumen, Rücksicht auf Einstellungen,
Schonung der Rechenleistung.

| Datei | Aufgabe |
|---|---|
| `useMobileNav.js` | Klappmenü auf dem Handy |
| `useScrollReveal.js` | Elemente einblenden, sobald sie ins Bild kommen |
| `useScrollProgress.js` | Fortschrittsbalken ganz oben |
| `useParallax.js` | Hintergrund wandert langsamer als der Text |
| `usePointerSpotlight.js` | Lichtfleck folgt dem Mauszeiger über Karten |
| `usePointerTilt.js` | Karte neigt sich leicht in Richtung Zeiger |
| `useMagneticPointer.js` | Knopf zieht sich ein Stück in Richtung Zeiger |
| `useHomeScroll.js` | Wählt aus, wie die Startseite scrollt |
| `useStandardScroll.js` | Normales Browser-Scrollen (absichtlich leer) |
| `useChapterScroll.js` | Ein Impuls = ein Kapitel weiter |

Die letzten drei gehören zusammen und werden über **einen Schalter** in
`src/config/scrollConfig.js` ausgewählt.
→ Eigenes Kapitel: [15-Scrollverhalten](15-Scrollverhalten.md)

`usePointerTilt.js` und `useMagneticPointer.js` folgen demselben Muster wie
`usePointerSpotlight.js` (siehe unten) und gehören zu den neueren
Mikrointeraktionen.
→ Eigenes Kapitel: [16-Scroll-Effekte-und-Mikrointeraktionen](16-Scroll-Effekte-und-Mikrointeraktionen.md)

## Was ist ein Composable nochmal?

**Wiederverwendbare Logik ohne eigenes Aussehen.** Erkennbar am Namen:
`useIrgendwas.js`.

Der Unterschied zu einer Utility-Funktion:

- **Composable** merkt sich etwas oder klinkt sich in den Lebenszyklus einer
  Komponente ein (`onMounted`, `watch`)
- **Utility** rechnet nur: rein → raus, ohne Gedächtnis

`formatPrice()` in `data/products.js` ist eine Utility. `useMobileNav()` ist
ein Composable.

## `useMobileNav.js` (63 Zeilen)

Steuert das Klappmenü auf dem Handy.

```js
const { isOpen, toggle, close } = useMobileNav()
```

Es erledigt vier Dinge — und die letzten drei sind der eigentliche Grund,
warum es das gibt:

1. **Auf/Zu merken** (`isOpen`)
2. **Beim Seitenwechsel schließen.** Ohne das tippt man auf „Shop" und schaut
   weiter auf das Menü statt auf den Shop
3. **Escape schließt.** Erwartet jeder, der eine Tastatur hat
4. **Die Seite dahinter festhalten.** Sonst scrollt der Inhalt unter dem
   offenen Menü weg

### Warum der Escape-Lauscher am `document` hängt

```js
document.addEventListener('keydown', handleKeydown)
```

Hinge er am Menü selbst, würde er nur reagieren, wenn der Tastaturfokus
zufällig dort sitzt. Am `document` reagiert er immer.

⚠ Dafür muss er auch wieder abgehängt werden — sonst bleibt er für immer
hängen. Das passiert an zwei Stellen: beim Schließen (`watch`) und beim
Verschwinden der Komponente (`onBeforeUnmount`). Die zweite ist der Fall, den
man vergisst: Wenn das Menü offen ist und sich dabei etwas grundlegend ändert,
bliebe die Seite sonst für immer gesperrt.

## `useScrollReveal.js` (68 Zeilen)

Blendet Elemente ein, sobald sie ins Bild kommen.

**Benutzung:** Element bekommt die Klasse `reveal`, die View ruft einmal
`useScrollReveal()` auf. Fertig.

```vue
<script setup>
useScrollReveal()
</script>

<template>
  <div class="reveal">…</div>
  <div class="reveal reveal-delay-1">…</div>
</template>
```

Die Klassen `reveal-delay-1/2/3` lassen Elemente nacheinander erscheinen statt
alle gleichzeitig.

### Warum `IntersectionObserver` und kein Scroll-Lauscher

Ein Lauscher auf das Scroll-Ereignis feuert hunderte Male pro Sekunde, und man
müsste für jedes Element selbst nachrechnen, wo es gerade steht. Der
`IntersectionObserver` ist im Browser eingebaut, macht diese Rechnung selbst
und meldet sich nur, wenn sich wirklich etwas ändert.

### Warum `unobserve` nach dem Einblenden

Ohne das würden Elemente beim Zurückscrollen wieder verschwinden und beim
erneuten Herunterscrollen noch einmal einfliegen. Nach dem zweiten Mal wirkt
das nur noch nervös.

**Einmal sichtbar heißt: bleibt sichtbar.**

### Rücksicht auf Bewegungsempfindlichkeit

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

Wer im Betriebssystem „Bewegung reduzieren" eingestellt hat, bekommt alles
sofort und vollständig zu sehen.

⚠ Wichtig ist dabei, dass die Elemente trotzdem **sichtbar** sind. Würde man
nur die Animation abschalten, blieben sie auf `opacity: 0` stehen — die Seite
wäre für genau diese Nutzer leer. Deshalb setzt `main.css` die Klasse `.reveal`
in diesem Fall komplett zurück.

## `useScrollProgress.js` (73 Zeilen)

Liefert einen Wert zwischen 0 (ganz oben) und 1 (ganz unten). Daraus zeichnet
`ScrollProgress.vue` den dünnen Balken am oberen Rand.

Zwei Details, die leicht schiefgehen:

**Division durch null.** Passt die Seite komplett ins Fenster, gibt es nichts
zu scrollen — dann wäre die Rechnung `scrollY / 0`.

**Werte außerhalb von 0 bis 1.** Beim Überziehen am Rand (das „Gummiband" auf
iOS und macOS) meldet der Browser kurzzeitig negative Werte oder Werte über 1.
Ohne Begrenzung würde der Balken dabei sichtbar überlaufen.

## `useParallax.js` (72 Zeilen)

Lässt ein Element beim Scrollen langsamer mitwandern als die Seite. Dadurch
wirkt es weiter entfernt — dasselbe Prinzip wie Berge am Horizont, die beim
Autofahren fast stehen bleiben, während die Leitpfosten vorbeirasen.

```js
const bild = useParallax(0.28)
<img ref="bild" … />
```

⚠ Werte über etwa `0.4` wirken nicht mehr wie Tiefe, sondern wie ein Fehler:
Das Bild „schwimmt" dann sichtbar gegenüber dem Text.

⚠ Parallaxe ist einer der häufigsten Auslöser für Unwohlsein beim Scrollen.
Deshalb wird der Effekt bei „Bewegung reduzieren" komplett abgeschaltet — nicht
nur verlangsamt.

## `usePointerSpotlight.js` (62 Zeilen)

Ein weicher Lichtfleck folgt dem Mauszeiger über einer Karte.

```js
const { onPointerMove } = usePointerSpotlight()
<article class="… spotlight" @pointermove="onPointerMove">
```

Das Composable schreibt nur die Position in zwei CSS-Variablen. Wie der Fleck
aussieht, steht komplett in `main.css` bei `.spotlight` — dieselbe
Arbeitsteilung wie bei `useScrollReveal.js`.

### ⭐ Warum `requestAnimationFrame`

`pointermove` feuert bei schneller Mausbewegung leicht hundertmal pro Sekunde.
Jedes Mal sofort eine CSS-Variable zu setzen, zwingt den Browser zu ebenso
vielen Neuberechnungen — sehen kann man davon aber höchstens 60, weil öfter gar
nicht gezeichnet wird.

Deshalb wird die Position nur **gemerkt**, und das Schreiben übernimmt der
Browser dann, wenn er ohnehin das nächste Bild zeichnet. Alles, was
zwischendurch hereinkommt, überschreibt nur den gemerkten Wert und kostet
nichts.

Dasselbe Muster steckt in `useScrollProgress.js`. Es lohnt sich, es zu kennen:
**Bei allem, was sehr oft feuert — Scrollen, Mausbewegung, Größenänderung —
nicht sofort rechnen, sondern einen Termin beim nächsten Bild anmelden.**

### Warum `currentTarget` und nicht `target`

```js
const element = event.currentTarget
```

`target` wäre das Element, über dem der Zeiger gerade wirklich steht — mal das
Bild, mal die Überschrift. Die Fleckposition würde je nach Untergrund
umspringen. `currentTarget` ist immer die Karte selbst, also das Element mit
dem Lauscher.

## `usePointerTilt.js` (71 Zeilen) und `useMagneticPointer.js` (67 Zeilen)

Zwei Geschwister von `usePointerSpotlight.js`, nach demselben Bauplan:
`requestAnimationFrame`, `currentTarget` statt `target`, Aussehen komplett im
CSS der jeweiligen Komponente. `usePointerTilt.js` liefert einen
Neigungswinkel (`--rx`/`--ry`) für die 3D-Kippen-Karten, `useMagneticPointer.js`
einen Zug in Zeigerrichtung (`--tx`/`--ty`) für die Knöpfe.

Ausführlich, inklusive der Frage, wie man beide gleichzeitig mit
`usePointerSpotlight.js` auf derselben Karte benutzt (Vue erlaubt nur einen
`@pointermove` pro Element):
[16-Scroll-Effekte-und-Mikrointeraktionen](16-Scroll-Effekte-und-Mikrointeraktionen.md)

## Die drei Scroll-Composables der Startseite

Sie hängen zusammen und werden nie einzeln aufgerufen. `HomeView.vue` ruft
ausschließlich `useHomeScroll()` auf; welche der beiden Varianten dahinter
läuft, entscheidet `src/config/scrollConfig.js`.

### `useHomeScroll.js` (22 Zeilen) — die Weiche

```js
const SCROLL_MODES = {
  chapter: useChapterScroll,
  standard: useStandardScroll,
}
```

Eine Tabelle statt einer `if`-Kette. Ein weiterer Modus bräuchte damit nur eine
neue Datei und eine neue Zeile hier — an `HomeView.vue` müsste nichts geändert
werden.

### `useStandardScroll.js` (7 Zeilen) — absichtlich leer

Eine Funktion, die **nichts** tut. Das ist kein vergessener Code:

Weil beide Varianten dieselbe Form haben (eine Funktion, die man aufruft), kann
die Weiche oben einfach die eine oder die andere nehmen. Und weil diese hier
wirklich leer ist — kein Lauscher, keine Klasse, keine Sonderregel — verhält
sich der Standardmodus exakt wie eine ganz gewöhnliche Website.

### `useChapterScroll.js` (~200 Zeilen) — der Kapitelmodus

Fängt das Mausrad ab und scrollt selbst zum nächsten Abschnitt. Die Abschnitte
erkennt es an `data-scroll-panel` im Template von `HomeView.vue`.

⚠ Dieses Composable ist das einzige im Projekt, das ein Ereignis mit
`{ passive: false }` anmeldet — also mit der Erlaubnis, das Scrollen zu
**stoppen**. Genau deshalb ist es auch das einzige, das ein Handy oder einen
Touchscreen ausdrücklich in Ruhe lässt:

```js
window.matchMedia('(hover: hover) and (pointer: fine)')
```

Die vier Fallen, die es abfängt (Touchpad-Nachlauf, lange Kapitel,
Touchscreens, „Bewegung reduzieren"), stehen ausführlich in
[15-Scrollverhalten](15-Scrollverhalten.md).

## 💡 Merken

**Ein Composable ist der richtige Ort für alles, was man beim Selbstbauen
vergessen würde.** Escape, Aufräumen, Rücksicht auf Einstellungen — einmal
richtig gelöst, gilt für immer.

## ⚠ Vorsicht

Alles, was in `onMounted` angehängt wird, muss in `onBeforeUnmount` wieder
abgehängt werden. Lauscher und Beobachter halten Verweise auf DOM-Elemente
fest; ohne Aufräumen bleiben die im Speicher liegen.

## Siehe auch

- [04-Datenfluss](04-Datenfluss.md) — Beispiel 2 und 3 zeigen Composables in Aktion
- [10-Vue-Grundbegriffe](10-Vue-Grundbegriffe.md)
- [15-Scrollverhalten](15-Scrollverhalten.md) — die drei Scroll-Composables im Zusammenhang
- [16-Scroll-Effekte-und-Mikrointeraktionen](16-Scroll-Effekte-und-Mikrointeraktionen.md) —
  Tilt, Magnet-Pointer und die scroll-gebundenen CSS-Animationen darüber
