<script setup>
// Der eine Knopf für die ganze Seite.
//
// Das Problem, das er löst: Ein "Knopf" ist mal ein echter <button>, mal ein
// Link auf eine Unterseite, mal ein Link nach außen zu Discord. Alle drei
// sollen gleich aussehen, aber es müssen unterschiedliche HTML-Elemente sein —
// ein Link, der wie ein Knopf aussieht, muss trotzdem ein <a> bleiben, sonst
// kann man ihn nicht in einem neuen Tab öffnen und Screenreader kündigen ihn
// falsch an.
//
// Diese Komponente entscheidet das selbst:
//   to="..."   → RouterLink (Unterseite dieser Website)
//   href="..." → <a> (fremde Adresse, öffnet in neuem Tab)
//   keins      → <button>
import { computed } from 'vue'

import { EXTERNE_LINKS_AKTIV, haltExternenKlickAn } from '@/config/linkConfig'
import { useMagneticPointer } from '@/composables/useMagneticPointer'

// Zieht den Knopf auf Geräten mit echtem Zeiger ein kleines Stück in dessen
// Richtung. Auf Touchscreens bleibt es ohne Wirkung — main.css schaltet den
// Effekt nur innerhalb von "hover: hover" scharf, siehe dort.
const { onPointerMove, onPointerLeave } = useMagneticPointer()

const props = defineProps({
  // Ziel innerhalb der Seite, z. B. { name: 'shop' }
  to: {
    type: [String, Object],
    default: null,
  },
  // Ziel außerhalb der Seite, z. B. 'https://discord.gg/...'
  href: {
    type: String,
    default: null,
  },
  // 'primary' = Orange-Verlauf, für die wichtigste Aktion pro Bereich
  // 'ghost'   = nur Umrandung, für alles Zweitrangige
  variant: {
    type: String,
    default: 'primary',
  },
})

const tag = computed(() => {
  if (props.to) return 'RouterLink'
  if (props.href) return 'a'
  return 'button'
})

// Nur die Angaben setzen, die zum jeweiligen Element wirklich passen.
//
// target="_blank" bekommt zusätzlich rel="noopener noreferrer":
// Ohne "noopener" kann die geöffnete fremde Seite über window.opener auf das
// ursprüngliche Tab zugreifen und es z. B. auf eine gefälschte Seite umleiten.
const attributes = computed(() => {
  if (props.to) {
    return { to: props.to }
  }

  if (props.href) {
    return {
      href: props.href,

      // Ist der Schalter in config/linkConfig.js aus, wird kein neuer Tab
      // vorbereitet und der Klick unten abgefangen. Der Knopf bleibt aber
      // vollständig bedienbar — auch mit der Tastatur.
      target: EXTERNE_LINKS_AKTIV ? '_blank' : null,
      rel: EXTERNE_LINKS_AKTIV ? 'noopener noreferrer' : null,

      // Teilt Screenreadern mit, dass hier gerade nichts passiert
      'aria-disabled': EXTERNE_LINKS_AKTIV ? null : 'true',

      onClick: haltExternenKlickAn,
    }
  }

  // Ohne type="button" gilt ein <button> innerhalb eines Formulars als
  // Absende-Knopf und lädt die Seite neu
  return { type: 'button' }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attributes"
    class="base-button"
    :class="`is-${variant}`"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <slot />
  </component>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 13px 26px;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);

  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;

  cursor: pointer;
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    background var(--transition),
    border-color var(--transition);
}

.base-button:hover {
  transform: translateY(-2px);
}

.base-button:active {
  /* Kurz "eindrücken" — gibt beim Klick eine spürbare Rückmeldung */
  transform: translateY(0);
}

/* MAGNET-EFFEKT — nur mit echtem Zeiger
   ======================================
   useMagneticPointer.js schreibt --tx/--ty als Zug in Zeigerrichtung. Auf
   Touchscreens bleibt es bei der einfachen Version oben: Dort gibt es keinen
   Zeiger, der "anziehen" könnte, und pointermove feuert dort ohnehin fast nie.
   → main.css benutzt dieselbe Abfrage für den Lichtfleck (.spotlight). */
@media (hover: hover) and (pointer: fine) {
  .base-button {
    --tx: 0px;
    --ty: 0px;

    /* Kürzer und mit Überschwingen statt der langen, linearen Standarddauer —
       das macht aus dem Zug ein spürbares "Einrasten" statt eines Rutschens. */
    transition:
      transform 0.35s var(--ease-spring),
      box-shadow var(--transition),
      background var(--transition),
      border-color var(--transition);
  }

  .base-button:hover {
    transform: translate3d(var(--tx), calc(var(--ty) - 2px), 0);
  }

  .base-button:active {
    transform: translate3d(var(--tx), var(--ty), 0);
  }
}

.is-primary {
  background: var(--accent-gradient);

  /* Dunkle Schrift auf Orange statt weißer: Weiß käme auf dem hellen Orange
     nur auf ein Kontrastverhältnis von etwa 2,9 zu 1 und wäre damit zu blass.
     Der Wert steckt in --on-accent, damit er beim nächsten Farbwechsel an
     einer Stelle mitwandert. */
  color: var(--on-accent);

  box-shadow: var(--shadow-accent);
}

.is-primary:hover {
  box-shadow: 0 24px 55px rgba(var(--accent-rgb), 0.45);
}

.is-ghost {
  border-color: var(--border-strong);
  background: var(--surface);
  color: var(--text);
}

.is-ghost:hover {
  border-color: rgba(var(--accent-rgb), 0.6);
  background: var(--surface-hover);
  color: var(--text);
}

/* Icons im Knopf minimal größer als der Text, sonst wirken sie zu zierlich */
.base-button :deep(svg) {
  font-size: 1.15em;
}
</style>
