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
  // 'primary' = pinker Verlauf, für die wichtigste Aktion pro Bereich
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
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  // Ohne type="button" gilt ein <button> innerhalb eines Formulars als
  // Absende-Knopf und lädt die Seite neu
  return { type: 'button' }
})
</script>

<template>
  <component :is="tag" v-bind="attributes" class="base-button" :class="`is-${variant}`">
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

.is-primary {
  background: var(--accent-gradient);
  color: #fff;
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
  color: #fff;
}

/* Icons im Knopf minimal größer als der Text, sonst wirken sie zu zierlich */
.base-button :deep(svg) {
  font-size: 1.15em;
}
</style>
