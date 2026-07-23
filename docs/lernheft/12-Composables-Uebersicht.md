# Composables-Übersicht

## Wofür ist das?

TrapHouse hat nur zwei Composables. Beide lohnen sich aber, weil sie Dinge
erledigen, die man beim Selbstbauen zuverlässig vergisst.

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

## 💡 Merken

**Ein Composable ist der richtige Ort für alles, was man beim Selbstbauen
vergessen würde.** Escape, Aufräumen, Rücksicht auf Einstellungen — einmal
richtig gelöst, gilt für immer.

## ⚠ Vorsicht

Alles, was in `onMounted` angehängt wird, muss in `onBeforeUnmount` wieder
abgehängt werden. Lauscher und Beobachter halten Verweise auf DOM-Elemente
fest; ohne Aufräumen bleiben die im Speicher liegen.

## Siehe auch

- [04-Datenfluss](04-Datenfluss.md) — Beispiel 2 und 3 zeigen beide Composables in Aktion
- [10-Vue-Grundbegriffe](10-Vue-Grundbegriffe.md)
