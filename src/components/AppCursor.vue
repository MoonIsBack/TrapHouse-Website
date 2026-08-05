<script setup>
// Ein eigener Cursor: ein kleiner Punkt exakt an der Zeigerposition, dazu ein
// Ring, der mit leichter Verzögerung hinterherzieht und sich über
// interaktiven Elementen vergrößert. Das Signature-Move vieler aufwendig
// gestalteter Seiten — hier bewusst zusätzlich zum normalen Zeiger, nicht als
// Ersatz, der etwas kaputt machen könnte, falls JavaScript aus irgendeinem
// Grund nicht wie erwartet läuft.
//
// ⚠ WARUM DER NATIVE CURSOR NICHT EINFACH PER CSS VERSTECKT WIRD
// Stünde "cursor: none" fest im Stylesheet, gäbe es einen kurzen Moment ohne
// jeden Zeiger, sobald diese Komponente aus irgendeinem Grund verzögert
// mountet. Stattdessen setzt erst JavaScript hier unten die Klasse
// "has-custom-cursor" ans <html> — und zwar erst, NACHDEM geprüft wurde, dass
// ein echter Zeiger vorhanden ist und "Bewegung reduzieren" nicht eingestellt
// ist (main.css versteckt den nativen Zeiger nur unter dieser Klasse, siehe
// dort). So bleibt der native Zeiger auf Touchscreens, bei reduzierter
// Bewegung und im unwahrscheinlichen Fehlerfall immer sichtbar.
//
// WARUM EIN EINZIGER requestAnimationFrame-LOOP FÜR BEIDES
// Der Punkt braucht keine Verzögerung (er soll exakt am Zeiger kleben), der
// Ring schon (das "Hinterherziehen" ist der eigentliche Effekt). Beide in
// derselben Schleife zu aktualisieren ist praktisch kostenlos gegenüber einer
// Schleife nur für den Ring — und der Ring muss ohnehin laufend neu berechnet
// werden, auch wenn sich der Zeiger gerade nicht bewegt (er nähert sich ja
// noch an). Dasselbe "merken, erst beim nächsten Bild schreiben"-Prinzip wie
// in usePointerSpotlight.js, nur über eine fortlaufende Schleife statt
// einmalig pro Ereignis.
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { EIGENER_CURSOR_AKTIV } from '@/config/cursorConfig'

// Je kleiner, desto enger folgt der Ring dem Zeiger; 0.18 fühlt sich nach
// "verzögert, aber nicht träge" an.
const RING_EASE = 0.18
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], .spotlight'

const isActive = ref(false)
const hasPosition = ref(false)
const isHoveringInteractive = ref(false)

const dotElement = ref(null)
const ringElement = ref(null)

let rawX = 0
let rawY = 0
let ringX = 0
let ringY = 0
let frame = 0

const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

function tick() {
  ringX += (rawX - ringX) * RING_EASE
  ringY += (rawY - ringY) * RING_EASE

  if (dotElement.value) {
    dotElement.value.style.transform = `translate3d(${rawX}px, ${rawY}px, 0)`
  }

  if (ringElement.value) {
    ringElement.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
  }

  frame = requestAnimationFrame(tick)
}

function onPointerMove(event) {
  rawX = event.clientX
  rawY = event.clientY

  if (!hasPosition.value) {
    // Erste bekannte Position: Ring direkt dorthin setzen statt von der
    // Fensterecke (0, 0) heranzuziehen — sonst schösse er beim allerersten
    // Bild sichtbar quer über den Bildschirm.
    ringX = rawX
    ringY = rawY
    hasPosition.value = true

    // Den nativen Zeiger erst JETZT verstecken, nicht schon beim Aktivieren
    // (siehe activate()) — sonst gäbe es zwischen Laden der Seite und der
    // ersten Mausbewegung einen Moment ganz ohne sichtbaren Zeiger: der
    // native ist schon weg, der eigene aber noch nirgends gezeichnet, weil
    // seine Position schlicht noch nicht bekannt ist.
    document.documentElement.classList.add('has-custom-cursor')
  }
}

function onPointerOver(event) {
  if (event.target.closest?.(INTERACTIVE_SELECTOR)) {
    isHoveringInteractive.value = true
  }
}

function onPointerOut(event) {
  const leavingInteractive = event.target.closest?.(INTERACTIVE_SELECTOR)
  if (!leavingInteractive) return

  // relatedTarget ist das Element, zu dem der Zeiger wechselt. Liegt es noch
  // innerhalb desselben interaktiven Elements (z. B. vom Text zum Icon in
  // einem Knopf), soll die Vergrößerung nicht kurz aussetzen und wieder
  // einsetzen — das würde flackern.
  const stillInside = event.relatedTarget?.closest?.(INTERACTIVE_SELECTOR)
  if (!stillInside) {
    isHoveringInteractive.value = false
  }
}

// Verlässt der Zeiger das Browserfenster ganz (z. B. Richtung Adressleiste),
// bleibt sonst ein Geisterpunkt am letzten bekannten Ort stehen — und ohne
// den nativen Zeiger zurückzuholen, wäre dort für den Moment gar keiner zu
// sehen (z. B. während man in der Adressleiste tippt).
function onDocumentLeave() {
  hasPosition.value = false
  document.documentElement.classList.remove('has-custom-cursor')
}

function activate() {
  if (isActive.value) return
  isActive.value = true

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerover', onPointerOver, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
  document.addEventListener('mouseleave', onDocumentLeave)

  frame = requestAnimationFrame(tick)
}

function deactivate() {
  if (!isActive.value) return
  isActive.value = false
  hasPosition.value = false
  isHoveringInteractive.value = false

  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerover', onPointerOver)
  document.removeEventListener('pointerout', onPointerOut)
  document.removeEventListener('mouseleave', onDocumentLeave)

  cancelAnimationFrame(frame)
}

function syncEligibility() {
  // Erst der Schalter in cursorConfig.js, dann dieselbe Kombination aus
  // echtem Zeiger UND ohne "Bewegung reduzieren", die auch .spotlight und
  // den Magnet-Knöpfen zugrunde liegt. Steht der Schalter auf false, wird
  // hier gar nichts angehängt — die Komponente tut dann buchstäblich nichts.
  if (EIGENER_CURSOR_AKTIV && pointerQuery.matches && !motionQuery.matches) {
    activate()
  } else {
    deactivate()
  }
}

onMounted(() => {
  syncEligibility()

  // Wechselt jemand während des Besuchs die Eingabeart (Tablet mit
  // angestecktem Trackpad) oder die Bewegungseinstellung, zieht das sofort
  // nach — kein Neuladen der Seite nötig. Der Schalter selbst ist keine
  // Laufzeit-Einstellung und braucht deshalb keinen eigenen Lauscher.
  pointerQuery.addEventListener('change', syncEligibility)
  motionQuery.addEventListener('change', syncEligibility)
})

onBeforeUnmount(() => {
  deactivate()
  pointerQuery.removeEventListener('change', syncEligibility)
  motionQuery.removeEventListener('change', syncEligibility)
})
</script>

<template>
  <!-- v-show statt v-if: Die Elemente bleiben dauerhaft im DOM, damit die
       Refs beim Aktivieren nie kurzzeitig leer sind. aria-hidden, weil das
       Ganze reine Deko ist — der eigentliche, native Zeiger bedient
       Screenreader und Zeigegeräte wie gewohnt. -->
  <div v-show="isActive" class="app-cursor" :class="{ 'is-visible': hasPosition }" aria-hidden="true">
    <span ref="dotElement" class="cursor-dot" />
    <span ref="ringElement" class="cursor-ring" :class="{ 'is-hover': isHoveringInteractive }" />
  </div>
</template>

<style scoped>
.app-cursor {
  position: fixed;
  inset: 0;
  z-index: 300;

  overflow: visible;
  pointer-events: none;

  opacity: 0;
  transition: opacity 0.2s ease;
}

.app-cursor.is-visible {
  opacity: 1;
}

.cursor-dot,
.cursor-ring {
  position: absolute;
  top: 0;
  left: 0;

  border-radius: 50%;

  /* JavaScript schreibt "transform" bei jedem Bild direkt (siehe tick() oben)
     — das überschreibt jede hier deklarierte transform-Angabe vollständig,
     eine Zentrierung darüber wäre also toter Code. Zentriert wird stattdessen
     über einen negativen Rand in der halben Kantenlänge: Er verschiebt den
     Kasten schon VOR der JS-Verschiebung so, dass am Ende genau seine Mitte
     auf der geschriebenen Koordinate liegt, nicht seine linke obere Ecke. */
}

.cursor-dot {
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;

  background: var(--accent-strong);
}

.cursor-ring {
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;

  border: 1.5px solid rgba(var(--accent-rgb), 0.5);

  /* Ein ruhiges Ease-out statt der Feder-Kurve (--ease-spring): Die federt
     mit einem kleinen Überschwinger — passend für einen Knopf, der einmal
     "einrastet", aber hier lief der Ring bei jedem Antippen eines Links
     spürbar "boing" auf. Für ein Element, das ständig zwischen Zuständen
     wechselt, wirkt ein Kurve ohne Überschwinger ruhiger und hochwertiger. */
  transition:
    width 0.3s var(--ease-out-smooth),
    height 0.3s var(--ease-out-smooth),
    margin 0.3s var(--ease-out-smooth),
    background 0.3s ease,
    border-color 0.3s ease;
}

.cursor-ring.is-hover {
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;

  border-color: transparent;
  background: rgba(var(--accent-rgb), 0.16);
}
</style>
