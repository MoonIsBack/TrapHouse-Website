<script setup>
// Der dünne Balken ganz oben, der mitwächst, während man scrollt.
//
// Kleine Sache, große Wirkung: Er beantwortet die Frage "wie viel kommt noch?",
// ohne dass man an der Bildlaufleiste schätzen muss.
import { useScrollProgress } from '@/composables/useScrollProgress'

const { progress } = useScrollProgress()
</script>

<template>
  <!-- aria-hidden, weil der Balken reine Orientierungshilfe fürs Auge ist.
       Screenreader melden die Scroll-Position ohnehin auf ihre eigene Art;
       ein vorgelesener Prozentwert wäre hier nur Lärm. -->
  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress-bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  /* Über dem Kopfbereich (der liegt auf 100) */
  z-index: 200;

  height: 2px;
  pointer-events: none;
}

.scroll-progress-bar {
  width: 100%;
  height: 100%;
  background: var(--accent-gradient);

  /* WARUM scaleX UND NICHT width?
     Eine Breitenänderung zwingt den Browser, das Layout neu zu berechnen —
     und das bei jedem einzelnen Scroll-Schritt. transform: scaleX() wird
     dagegen von der Grafikkarte erledigt, ganz ohne Layout-Rechnung.
     Bei etwas, das sich sechzigmal pro Sekunde ändert, ist das der
     Unterschied zwischen flüssig und hakelig. */
  transform-origin: left center;

  /* Ohne diese Zeile würde der Balken von der Mitte aus wachsen und beim
     Scrollen sichtbar "atmen" statt gleichmäßig zu laufen. */
  will-change: transform;
}
</style>
