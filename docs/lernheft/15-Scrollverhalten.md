# Scrollverhalten der Startseite

## Wofür ist das?

Die Startseite kann sich auf zwei Arten scrollen lassen. Du entscheidest mit
**einem Wort in einer Datei**, welche davon läuft.

## Der Schalter

`src/config/scrollConfig.js`:

```js
export const HOME_SCROLL_MODE = 'standard'
```

Zwei erlaubte Werte:

| Wert | Was passiert |
|---|---|
| `'standard'` | Ganz normales Browser-Scrollen. Nichts wird abgefangen. |
| `'chapter'` | Ein Impuls am Mausrad oder Touchpad springt zum nächsten Kapitel |

Nach der Änderung die Seite im Browser neu laden. Mehr ist nicht zu tun — weder
im Template noch im CSS.

> **Aktuell steht `'standard'`.** Das ist eine bewusste Entscheidung, kein
> Zwischenstand.

## Wie der Schalter funktioniert

Drei Dateien, klare Aufgabenteilung:

```
scrollConfig.js          Du wählst hier: 'standard' oder 'chapter'
        │
        ▼
useHomeScroll.js         Sucht die passende Variante heraus
        │
        ├──▶ useStandardScroll.js    macht absichtlich NICHTS
        └──▶ useChapterScroll.js     die komplette Kapitel-Logik
```

`HomeView.vue` ruft nur `useHomeScroll()` auf. Sie weiß nicht, welcher Modus
gerade läuft — und muss es auch nicht wissen.

### ⭐ Warum es eine leere Datei gibt

`useStandardScroll.js` enthält eine Funktion, die nichts tut. Das sieht nach
überflüssigem Code aus, ist aber der Kern des Ganzen:

```js
export function useStandardScroll() {
  // absichtlich leer
}
```

Beide Varianten haben damit **dieselbe Form**: eine Funktion, die man aufruft.
`useHomeScroll.js` kann deshalb einfach die eine oder die andere nehmen:

```js
const SCROLL_MODES = {
  chapter: useChapterScroll,
  standard: useStandardScroll,
}
```

Die Alternative wäre ein `if` gewesen — und ein `if` müsste man bei jedem
weiteren Modus wieder anfassen. Ein neuer Modus braucht so nur eine neue Datei
und eine Zeile in dieser Tabelle.

⚠ „Leer" heißt hier wirklich leer: Kein Lauscher, keine Klasse, keine
Sonderregel. Genau deshalb verhält sich der Standardmodus exakt so wie eine
ganz normale Website.

## Der Kapitelmodus im Detail

Nur relevant, wenn du auf `'chapter'` umstellst.

`useChapterScroll.js` fängt das `wheel`-Ereignis ab und scrollt selbst zum
nächsten Abschnitt. Welche Abschnitte das sind, steht im Template von
`HomeView.vue`:

```vue
<section class="section scroll-panel" data-scroll-panel>
```

`data-scroll-panel` ist die Markierung: „Das hier ist ein Kapitel."

Vier Dinge, die dabei bedacht sind — und die man beim Selbstbauen alle
übersieht:

**1. Touchpads hören nicht sofort auf.** Ein Wisch auf dem Mac-Touchpad feuert
noch eine halbe Sekunde lang nach. Ohne Gegenmaßnahme springt die Seite dabei
drei Kapitel weiter. Deshalb wartet der Code nach jedem Sprung auf eine echte
neue Geste — erkennbar an einer Pause oder daran, dass die Bewegung wieder
stärker wird.

**2. Lange Kapitel müssen innen scrollbar bleiben.** Passt ein Abschnitt auf
einem kleinen Fenster nicht komplett auf den Bildschirm, wird zuerst ganz
normal bis zu seinem Ende gescrollt. Erst dann beginnt der Wechsel. Ohne das
wären die unteren Zeilen eines Kapitels nicht erreichbar.

**3. Touchscreens bleiben unberührt.**

```js
window.matchMedia('(hover: hover) and (pointer: fine)')
```

Das fragt nicht die Fenstergröße ab, sondern das **Eingabegerät**. Ein schmales
Desktop-Fenster verhält sich damit wie ein großer Monitor, ein Handy behält
sein natives Scrollen.

**4. „Bewegung reduzieren" schaltet alles ab.** Wer das im Betriebssystem
eingestellt hat, scrollt normal — künstlich gesteuertes Scrollen ist einer der
unangenehmsten Effekte für bewegungsempfindliche Menschen.

### Was das CSS dazu beiträgt

In `HomeView.vue` hängen die Kapitel-Regeln alle an der Klasse
`.scroll-mode-chapter`:

```css
.scroll-mode-chapter .scroll-panel { … }
```

⚠ **Dieser Vorsatz ist Pflicht.** Fehlt er, wirkt die Regel auch im
Standardmodus. Genau das war einmal der Fall: Eine Raster-Regel für den
Kapitelmodus stand ohne Vorsatz da und beeinflusste die Merch-Karten überall —
sie fiel nur deshalb nicht auf, weil eine spätere Regel sie zufällig wieder
überschrieb.

## 💡 Merken

**Ein Wort in `scrollConfig.js` entscheidet — sonst nichts.**

Willst du das alte, freie Scrollen: `'standard'`. Willst du das Kapitelgefühl:
`'chapter'`. Kein weiterer Handgriff nötig.

## ⚠ Vorsicht

Schreibst du dort etwas anderes als `'standard'` oder `'chapter'`, fällt die
Seite auf den Standardmodus zurück und schreibt eine Warnung in die
Entwicklerkonsole (F12 → Console). Kaputt geht nichts — aber der Hinweis steht
nur dort und ist auf der Seite selbst nicht zu sehen.

## Siehe auch

- [12-Composables-Uebersicht](12-Composables-Uebersicht.md) — die drei Scroll-Composables
- [11-Komponenten-Uebersicht](11-Komponenten-Uebersicht.md) — wo `HomeView` sie aufruft
