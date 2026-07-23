# Vue-Grundbegriffe

## Wofür ist das?

Die Handvoll Wörter, die im Code ständig auftauchen. Wenn du das RankRoom-Heft
schon gelesen hast, kennst du das meiste — TrapHouse benutzt weniger davon,
weil es nichts speichert.

## Der Aufbau einer `.vue`-Datei

Drei Abschnitte, immer in dieser Reihenfolge:

```vue
<script setup>
  // Die Logik: Was braucht diese Komponente, was rechnet sie aus?
</script>

<template>
  <!-- Das HTML: Was sieht man? -->
</template>

<style scoped>
  /* Das Aussehen: nur für diese Komponente */
</style>
```

## `scoped` — der wichtigste Schalter

```vue
<style scoped>
  h3 { font-size: 1.4rem; }
</style>
```

`scoped` bedeutet: Diese Regel gilt **nur in dieser Datei**. Ein `h3` in einer
anderen Komponente bleibt unberührt.

Ohne `scoped` würde die Regel für **jedes** `h3` der ganzen Seite gelten. Genau
das war das Problem der alten `style.css`: eine Datei, in der jede Änderung
irgendwo anders etwas kaputtmachen konnte.

⚠ Ausnahme ist `assets/main.css`. Die ist **absichtlich** global — dort stehen
ja die gemeinsamen Farben.

## `props` — Daten von oben bekommen

```js
defineProps({
  product: {
    type: Object,
    required: true,
  },
})
```

Die Komponente sagt damit: „Ich brauche ein `product`, und zwar ein Objekt."

Benutzt wird sie so:

```vue
<ProductCard :product="einArtikel" />
```

Der **Doppelpunkt** vor `product` ist entscheidend:

- `product="einArtikel"` → der Text „einArtikel"
- `:product="einArtikel"` → der **Wert** der Variablen

⚠ Props sind zum Lesen da. Sie in der empfangenden Komponente zu ändern, geht
schief — siehe [04-Datenfluss](04-Datenfluss.md).

## `ref` — ein Wert, der sich ändern darf

```js
const isOpen = ref(false)

isOpen.value = true    // im JavaScript: mit .value
```

```vue
<div v-if="isOpen">    <!-- im Template: ohne .value -->
```

Ändert sich ein `ref`, zeichnet Vue alles neu, was davon abhängt. Man muss den
Bildschirm nie selbst aktualisieren.

⚠ Das `.value` im JavaScript zu vergessen ist der häufigste Anfängerfehler.
Ohne `.value` überschreibst du nicht den Wert, sondern den ganzen Behälter —
und die Verbindung zu Vue ist weg.

## `computed` — ein abgeleiteter Wert

```js
const isAvailable = computed(() => props.product.status === 'verfuegbar')
```

Ein Wert, der aus anderen Werten errechnet wird. Ändert sich `status`, ändert
sich `isAvailable` von selbst.

## `watch` — auf eine Änderung reagieren

```js
watch(() => route.fullPath, close)
```

„Immer wenn sich die Adresse ändert, rufe `close` auf."

Der Unterschied zu `computed`: `computed` **berechnet** einen Wert, `watch`
**tut** etwas.

## Die Anweisungen im Template

| Schreibweise | Bedeutung |
|---|---|
| `{{ name }}` | Wert als Text einsetzen |
| `:src="bild"` | Wert an ein Attribut binden |
| `@click="tuWas"` | Auf einen Klick reagieren |
| `v-if="bedingung"` | Nur zeigen, wenn wahr — sonst gar nicht im HTML |
| `v-for="x in liste"` | Für jeden Eintrag einmal |
| `:key="x.id"` | Muss zu jedem `v-for`. Vue erkennt daran, was sich geändert hat |

## `<slot />` — Platz für fremden Inhalt

In `BaseButton.vue`:

```vue
<component :is="tag" class="base-button">
  <slot />
</component>
```

Benutzt:

```vue
<BaseButton>Zum Shop</BaseButton>
```

Alles zwischen den Tags landet an der Stelle von `<slot />`. So kann derselbe
Knopf mal Text, mal Text mit Icon enthalten.

## `:deep()` — in ein Kind hineingreifen

```css
.base-button :deep(svg) {
  font-size: 1.15em;
}
```

Normalerweise kommt `scoped` CSS nicht an das HTML einer Kind-Komponente heran.
`:deep()` hebt das gezielt auf. Hier nötig, weil das `<svg>` aus einer
Icon-Komponente stammt.

⚠ Sparsam benutzen. Jedes `:deep()` ist ein Griff in fremde Zuständigkeit — zu
viele davon, und `scoped` bringt nichts mehr.

## 💡 Merken

**`ref` = ändert sich. `computed` = wird ausgerechnet. `props` = kommt von oben
und wird nur gelesen.**

## Siehe auch

- [12-Composables-Uebersicht](12-Composables-Uebersicht.md)
- Das RankRoom-Lernheft, Kapitel 10 — dort mehr zu Zustand und Speichern
