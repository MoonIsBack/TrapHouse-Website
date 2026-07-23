<script setup>
// „Was dich erwartet" — vier Karten, die erklären, worum es bei TrapHouse geht.
//
// Dieser Bereich hat vorher komplett gefehlt. Die Startseite sprang vom
// Willkommensgruß direkt zum Merch, ohne je zu sagen, was die Community
// eigentlich ist. Wer die Seite zum ersten Mal sieht, braucht genau das.
import { HIGHLIGHTS } from '@/data/community'
import { usePointerSpotlight } from '@/composables/usePointerSpotlight'

const { onPointerMove } = usePointerSpotlight()
</script>

<template>
  <!-- reveal-stagger am Raster: die Karten erscheinen nacheinander statt alle
       gleichzeitig. Die Verzögerungen kommen per :nth-child aus main.css —
       so muss keine Karte eine eigene Klasse bekommen. -->
  <div class="highlight-grid reveal-stagger">
    <article
      v-for="(item, index) in HIGHLIGHTS"
      :key="item.id"
      class="highlight-card reveal reveal-pop spotlight"
      @pointermove="onPointerMove"
    >
      <!-- Die Nummer ist Deko, aber sie gibt dem Raster einen Takt und lässt
           die Karten wie eine Aufzählung wirken statt wie vier lose Kästen. -->
      <span class="highlight-number">{{ String(index + 1).padStart(2, '0') }}</span>

      <span class="highlight-label">{{ item.label }}</span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.text }}</p>
    </article>
  </div>
</template>

<style scoped>
.highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
}

.highlight-card {
  /* Der Lichtfleck (.spotlight) liegt in einem ::before über der Karte.
     Ohne isolation würde er sich mit dem Hintergrund der Seite mischen
     statt nur mit der Karte. */
  isolation: isolate;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  padding: 26px 24px 28px;

  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);

  background: var(--surface);

  transition:
    transform var(--transition),
    border-color var(--transition),
    background var(--transition);
}

.highlight-card:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--accent-rgb), 0.35);
  background: var(--surface-hover);
}

/* Alles außer dem Lichtfleck muss über ihm liegen, sonst legt sich der
   Fleck über die Schrift und macht sie milchig. */
.highlight-card > * {
  position: relative;
  z-index: 2;
}

.highlight-number {
  font-family: 'Anton', sans-serif;
  font-size: 1.6rem;
  line-height: 1;

  background: var(--accent-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.highlight-label {
  margin-top: 16px;

  color: var(--accent-strong);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

h3 {
  margin-top: 8px;
  font-size: 1.22rem;
  line-height: 1.15;
}

p {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

/* Auf mittleren Bildschirmen bewusst zwei Spalten erzwingen.
   auto-fit würde bei etwa 800 px drei Karten nebeneinander quetschen und die
   vierte allein in die nächste Zeile stellen — das sieht abgebrochen aus. */
@media (max-width: 900px) and (min-width: 561px) {
  .highlight-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
