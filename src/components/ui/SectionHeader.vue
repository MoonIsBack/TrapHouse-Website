<script setup>
// Die Überschrift über jedem Bereich: kleines pinkes Label, große Überschrift,
// optional ein erklärender Satz darunter.
//
// Alle Bereiche benutzen sie, damit die Seite einen gleichmäßigen Rhythmus
// bekommt. Würde jeder Bereich seine Überschrift selbst bauen, wären die
// Abstände nach ein paar Wochen überall leicht unterschiedlich.
defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  // Auf true stellen, wenn die Überschrift mittig stehen soll
  centered: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <header class="section-header reveal" :class="{ 'is-centered': centered }">
    <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>

    <h2>{{ title }}</h2>

    <p v-if="text">{{ text }}</p>
  </header>
</template>

<style scoped>
.section-header {
  margin-bottom: 44px;
}

.is-centered {
  text-align: center;
}

.is-centered p {
  margin-left: auto;
  margin-right: auto;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 14px;
  padding: 6px 14px;

  border: 1px solid rgba(var(--accent-rgb), 0.35);
  border-radius: var(--radius-pill);

  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent-strong);

  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

h2 {
  font-size: clamp(2rem, 4.4vw, 3.1rem);
}

p {
  max-width: 60ch;
  margin-top: 16px;

  color: var(--text-secondary);
  font-size: 1.02rem;
}
</style>
