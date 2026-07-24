<script setup>
import { useRouter } from 'vue-router'

// Ein Navigationseintrag — egal ob interne Unterseite oder fremde Adresse.
//
// Nach demselben Prinzip wie BaseButton.vue: Die Komponente entscheidet
// selbst, welches HTML-Element daraus wird.
//
//   { name: 'shop' }              → RouterLink, bleibt auf dieser Seite
//   { href: '…', external: true } → <a target="_blank">, neuer Tab
//
// WARUM ALS EIGENE KOMPONENTE?
// Weil dieselbe Unterscheidung an DREI Stellen gebraucht wird: in der Leiste
// für breite Bildschirme, im Klappmenü fürs Handy und im Fußbereich. Ohne
// diese Komponente stünde in allen dreien dasselbe v-if — und beim nächsten
// externen Link würdest du garantiert eine Stelle vergessen.
const props = defineProps({
  // Ein Eintrag aus NAV_LINKS in data/navigation.js
  link: {
    type: Object,
    required: true,
  },
  // Safari kann einen normalen click im festen Desktop-Header verzögern,
  // solange das Touchpad noch Scroll-Momentum meldet. Nur dort darf die
  // interne Route deshalb bereits beim pointerdown gestartet werden.
  navigateOnPointerDown: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])
const router = useRouter()

function handlePointerDown(event) {
  if (!props.navigateOnPointerDown || props.link.external) return
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  // Verhindert Safaris verzögerten Standardklick nicht vollständig, startet
  // die Route aber sofort. Der spätere RouterLink-Klick ist dann ein harmloser
  // Aufruf derselben bereits aktiven Route.
  router.push({ name: props.link.name })
  emit('navigate')
}
</script>

<template>
  <!-- Fremde Adresse -->
  <a
    v-if="link.external"
    :href="link.href"
    target="_blank"
    rel="noopener noreferrer"
    class="nav-link is-external"
    @click="$emit('navigate')"
  >
    {{ link.label }}

    <!-- Das kleine Kästchen mit dem Pfeil signalisiert "öffnet woanders".
         aria-hidden, weil die Information für Screenreader schon im
         zusätzlichen Text darunter steht. -->
    <svg
      viewBox="0 0 24 24"
      width="0.75em"
      height="0.75em"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="external-icon"
    >
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>

    <span class="sr-only">(öffnet in neuem Tab)</span>
  </a>

  <!-- Unterseite dieser Website -->
  <RouterLink
    v-else
    :to="{ name: link.name }"
    class="nav-link"
    @pointerdown="handlePointerDown"
    @click="$emit('navigate')"
  >
    {{ link.label }}
  </RouterLink>
</template>

<style scoped>
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.external-icon {
  /* Etwas nach oben, damit der Pfeil optisch auf Höhe der Großbuchstaben
     sitzt statt auf der Grundlinie zu kleben */
  margin-top: -2px;
  opacity: 0.6;
  transition: opacity var(--transition);
}

.nav-link:hover .external-icon {
  opacity: 1;
}

/* Nur für Screenreader: optisch unsichtbar, aber vorlesbar.
   display:none wäre falsch — das würde den Text auch für Screenreader
   verstecken, und genau die sollen ihn ja hören. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
