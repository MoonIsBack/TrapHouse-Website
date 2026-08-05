# Scroll-Effekte und Mikrointeraktionen

## Wofür ist das?

Die Grundlagen (Einblenden, Parallaxe, Lichtfleck-Karten) stehen bereits in
[12-Composables-Uebersicht](12-Composables-Uebersicht.md). Dieses Kapitel
beschreibt die Schicht, die danach dazugekommen ist: Bewegung, die direkt an
die Scrollposition gekoppelt ist statt an eine Uhr, dazu ein paar
Mikrointeraktionen (Magnet-Knöpfe, 3D-Kippen, ein eigener Cursor), die aus
Klicks und Hover-Zuständen etwas Spürbareres machen.

## Die neuen Bausteine im Überblick

| Datei | Aufgabe |
|---|---|
| `usePointerTilt.js` | Neigungswinkel für die 3D-Kippen-Karten |
| `useMagneticPointer.js` | Zug in Zeigerrichtung für Magnet-Knöpfe |
| `AppCursor.vue` | Eigener Punkt + Ring, folgt dem Zeiger |
| `.reveal-cinematic` (main.css) | Scroll-gebundenes Einblenden für Browser mit `animation-timeline: view()` |
| `--ease-spring`, `--ease-out-hero` (main.css) | Zwei zentrale Bewegungskurven für alles Neue hier |

## ⭐ Das Prinzip hinter allem Neuen: scroll-gebunden statt zeitgesteuert

Eine `transition` läuft, sobald sie ausgelöst wird, unabhängig vom Scrollen
weiter — genau 0,6 Sekunden, ob man dabei stillsteht oder weiterscrollt. Die
neue Technik hier (`animation-timeline: scroll(...)` bzw. `view(...)`) bindet
eine Animation stattdessen **direkt an die Scrollposition**: Bei 20 % Scroll
ist die Animation 20 % durchgelaufen, ganz ohne eigene Dauer. Läuft der
Browser rückwärts (man scrollt zurück), läuft auch die Animation rückwärts.

Das kostet keinen einzigen JavaScript-Schritt pro Bild — der Browser
berechnet das auf derselben Ebene wie das Scrollen selbst, also auf der
Grafikkarte. Deshalb steht diese Technik hinter vier verschiedenen Effekten:
dem Hero-Rückzug, dem Kino-Einblenden der Karten und der scroll-reaktiven
Hintergrundverschiebung.

### Warum immer in einem `@supports`-Block

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    /* … */
  }
}
```

Diese CSS-Funktion ist noch nicht in jedem Browser gleich weit verbreitet.
`@supports` fängt das vollständig auf: Ein Browser ohne Unterstützung
ignoriert den ganzen Block, als stünde er nicht da — die betroffenen Elemente
zeigen dann exakt das Verhalten von vorher (die bestehende
`.reveal`/`IntersectionObserver`-Variante, unverändert in `useScrollReveal.js`).
Kein Fallback nötig, keine Funktionseinbuße, nur ein Bonus obendrauf.

⚠ Genau deshalb wird dieselbe Technik **nicht** für `ScrollProgress.vue`
verwendet — der Balken ist dauerhaft sichtbares UI-Chrome, kein optionaler
Bonus. Ein Browser, in dem er nicht mitwächst, wäre kaputte UI statt nur
schlichterer Deko. Dort bleibt es bei `useScrollProgress.js` (JavaScript).

### `.reveal-cinematic` — die Karten

Neben `.reveal` (siehe 12-Composables-Uebersicht) gibt es jetzt
`.reveal-cinematic` als zweite, optionale Klasse — benutzt auf
`HighlightGrid.vue`, `ProductCard.vue` und `SocialCard.vue`, immer zusammen
mit `.reveal`:

```html
<article class="… reveal reveal-pop reveal-cinematic spotlight">
```

In unterstützenden Browsern schaltet `.reveal-cinematic` die Transition von
`.reveal` ab und ersetzt sie durch eine `view()`-gebundene Animation: Die
Karte kommt kontinuierlich herein, synchron zur Scrollgeschwindigkeit, statt
als einmal "abgespielte" Animation.

⚠ **Das verstößt bewusst nicht** gegen die "einmal sichtbar bleibt
sichtbar"-Regel von `useScrollReveal.js`. Diese Regel verhindert, dass eine
ZEITGESTEUERTE Animation bei jedem Vorbeiscrollen erneut "abspielt" — das
wirkt nach dem zweiten Mal aufdringlich. Eine `view()`-Animation spielt aber
nichts ab: Sie ist ein direkter, stetiger Ausdruck der Scrollposition, genau
wie die Parallaxe in `useParallax.js`. Deshalb bleibt die Bewegungsspanne
bewusst klein (kein auffälliges Rein-Raus-Flackern beim Hin- und
Herscrollen).

### Der Hero-Rückzug

`HeroSection.vue`, `.hero-content`: bindet sich an `scroll(root block)` statt
an `view()` — der Unterschied ist, WELCHE Scrollstrecke gemeint ist. `view()`
misst, wie weit ein Element selbst durchs Sichtfenster gewandert ist;
`scroll(root block)` misst die Scrollposition der ganzen Seite. Für den Hero
ist Letzteres richtig: Er soll sich abhängig davon verändern, wie weit man
insgesamt heruntergescrollt hat (die ersten 70vh), nicht davon, wie weit ER
SELBST durchs Bild gewandert ist.

### Die scroll-reaktive Hintergrundverschiebung

`BackdropGlow.vue`: Die beiden Farbflecken laufen bereits dauerhaft mit einer
zeitgesteuerten `@keyframes`-Drift (`drift-a`/`drift-b`). Die neue,
scroll-gebundene Verschiebung kommt NICHT als zweite Animation auf demselben
Element hinzu — zwei Animationen, die beide `transform` verändern, würden
sich nicht addieren, sondern die zweite ersetzt die erste vollständig.
Stattdessen trägt eine zusätzliche Hülle (`.glow-shift-a`/`.glow-shift-b`) die
neue Bewegung; der Fleck darin behält seine eigene Drift. Verschachtelte
`transform`-Angaben komponieren sich von selbst — ganz normales CSS, kein
Sonderfall.

## Magnet-Knöpfe und 3D-Kippen — dasselbe Muster wie `usePointerSpotlight.js`

`useMagneticPointer.js` (Knöpfe) und `usePointerTilt.js` (Karten) folgen
exakt der Arbeitsteilung, die `usePointerSpotlight.js` schon vormacht:
Composable liefert nur eine Position/einen Winkel als CSS-Variable
(`--tx`/`--ty` bzw. `--rx`/`--ry`), das Aussehen steht komplett im CSS der
jeweiligen Komponente. Und dasselbe `requestAnimationFrame`-Muster: Position
merken, erst beim nächsten Bild schreiben.

**Wo beide Composables auf demselben Element gebraucht werden** (die drei
Karten-Komponenten kombinieren Spotlight + Tilt), zeigt sich ein kleiner
Kniff: Vue erlaubt nur einen `@pointermove`-Handler pro Element. Die
Komponenten bündeln deshalb beide `onPointerMove`-Funktionen in einer
gemeinsamen lokalen Funktion:

```js
const { onPointerMove: moveSpotlight } = usePointerSpotlight()
const { onPointerMove: moveTilt, onPointerLeave: onTiltLeave } = usePointerTilt()

function onPointerMove(event) {
  moveSpotlight(event)
  moveTilt(event)
}
```

### Warum die Kipp-/Magnet-CSS in zwei Blöcken steht

In `BaseButton.vue` und den drei Karten-Komponenten steht die einfache
Hover-Bewegung (nur `translateY`) außerhalb jeder Medienabfrage — das ist die
Grundversion, die auf jedem Gerät funktioniert, auch auf Touchscreens. Eine
zweite, spätere Regel innerhalb von `@media (hover: hover) and (pointer:
fine)` überschreibt `transform` dann um die Kipp-/Magnet-Komponente erweitert.
Auf Touchscreens greift diese zweite Regel nie — dort bleibt es bei der
einfachen Version. Dieselbe Abfrage benutzt auch `.spotlight` in main.css.

## Gleitende Navigation

`AppHeader.vue` hat jetzt eine Fläche, die per `transform` zum gerade
relevanten Link gleitet (Hover oder aktive Seite), statt nur eines
statischen Punkts unter dem aktiven Eintrag. Position und Breite kommen aus
`getBoundingClientRect()` — dieselbe Technik wie in den Zeiger-Composables,
hier aber direkt in der Komponente, weil sie ausschließlich dort gebraucht
wird (kein eigenes Composable).

## Eigener Cursor

`AppCursor.vue`, einmal in `App.vue` eingehängt. Ein Punkt klebt exakt am
Zeiger, ein Ring zieht mit einer kleinen Verzögerung hinterher (linear
interpoliert in Richtung Zeiger, jedes Bild ein Stück näher) und vergrößert
sich über Links, Knöpfen und den Lichtfleck-Karten.

**Schalter:** `src/config/cursorConfig.js`, `EIGENER_CURSOR_AKTIV` —
`true`/`false`, nach demselben Muster wie `scrollConfig.js` und
`linkConfig.js`. Steht der Schalter auf `false`, hängt `AppCursor.vue` gar
nichts erst an (keine Lauscher, kein RAF-Loop) — der ganz normale native
Zeiger bleibt bestehen. Aktuell steht er auf `false`.

⚠ **Der native Zeiger verschwindet nie ungeprüft.** `main.css` versteckt ihn
nur unter der Klasse `has-custom-cursor` am `<html>` — und diese Klasse setzt
ausschließlich `AppCursor.vue`, erst nachdem geprüft wurde, dass der Schalter
oben an ist, ein echter Zeiger vorhanden ist (`hover: hover` und `pointer:
fine`) UND "Bewegung reduzieren" NICHT eingestellt ist. Bleibt die Prüfung aus
irgendeinem Grund aus (JavaScript deaktiviert, Fehler beim Laden), bleibt
einfach der normale Zeiger sichtbar — es gibt keinen Zustand, in dem gar
keiner zu sehen ist.

## ⭐ Ein echter Fehler, den es hier einmal gab: die verschwundene Hero-Überschrift

Beim ersten Bau des Vorhang-Reveals (siehe oben) saß die Klasse `reveal` auf
der INNEREN Zeile (`.hero-line`) — der Text, der optisch um 115 % seiner
eigenen Höhe verschoben und von der äußeren Maske (`overflow: hidden`)
verborgen war. Ergebnis: Die Überschrift blieb dauerhaft unsichtbar, auf jedem
Bildschirm, für jeden Besucher.

**Warum:** `useScrollReveal.js` benutzt einen `IntersectionObserver`, und der
berücksichtigt Beschneidung durch `overflow: hidden` bei der Berechnung, wie
viel vom Element tatsächlich sichtbar ist. Die Zeile war ja ABSICHTLICH fast
vollständig durch die Maske verborgen — für den Beobachter sah das nicht nach
"kommt gleich ins Bild", sondern nach "hat quasi keine sichtbare Fläche" aus.
`isIntersecting` blieb dauerhaft `false`, `is-visible` kam nie an.

**Die Lösung:** `reveal` sitzt jetzt auf der ÄUSSEREN Maske (`.hero-line-mask`)
— die bewegt und verbirgt sich selbst nie, ist für den Beobachter also ein
ganz gewöhnliches, unverschobenes Element. Die eigentliche Zeile fährt über
einen Nachfahren-Selektor herein, sobald die Maske als `is-visible` gilt:

```css
.hero-line-mask.is-visible .hero-line {
  transform: translateY(0);
}
```

**💡 Die Regel daraus:** Ein Element, das per `overflow: hidden` +
`transform` absichtlich (teilweise) verborgen wird, ist der falsche
Beobachtungspunkt für einen `IntersectionObserver`. Beobachtet werden muss
die unbewegte, unbeschnittene Hülle — nicht das Kind, das den Effekt zeigt.

## 💡 Merken

**Scroll-gebundene Animation ist kein Ersatz für `.reveal`, sondern eine
optionale zweite Stufe darüber.** Jeder neue Effekt hier fällt in Browsern
ohne Unterstützung auf exakt das zurück, was vorher schon funktioniert hat.

## ⚠ Vorsicht

Alles Neue hier respektiert dieselben zwei Leitplanken wie der Rest der
Seite:

1. **`prefers-reduced-motion: reduce`** schaltet jede neue Bewegung ab
   (Kino-Einblenden, Hero-Rückzug, Hintergrundverschiebung stehen alle in
   `@media (prefers-reduced-motion: no-preference)`; der Cursor prüft es in
   JavaScript, bevor er überhaupt aktiviert).
2. **`(hover: hover) and (pointer: fine)`** schaltet alles ab, was einen
   echten Zeiger braucht (Magnet-Knöpfe, 3D-Kippen, Cursor) — Touchscreens
   bleiben unberührt.

## Siehe auch

- [12-Composables-Uebersicht](12-Composables-Uebersicht.md) — die Grundlagen,
  auf denen alles hier aufbaut
- [13-Design-Tokens-und-Farben](13-Design-Tokens-und-Farben.md) — `--ease-spring`
  und `--ease-out-hero` stehen bei den übrigen Tokens in `main.css`
- [15-Scrollverhalten](15-Scrollverhalten.md) — der Schalter zwischen
  `'standard'` und `'chapter'`, von diesem Kapitel unangetastet
