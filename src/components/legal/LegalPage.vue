<script setup>
// Der gemeinsame Rahmen für Impressum und Datenschutzerklärung.
//
// Beide Seiten sehen gleich aus und brauchen dieselbe Typografie: schmale
// Textspalte, ruhige Überschriften, gut lesbare Zeilenlänge. Das steht
// deshalb einmal hier statt zweimal in den Views.
//
// Der Warnkasten oben erscheint automatisch, solange in legalConfig.js noch
// Platzhalter stehen.
import { hasPlaceholders } from '@/config/legalConfig'

defineProps({
  title: {
    type: String,
    required: true,
  },
  // Datum der letzten inhaltlichen Änderung, z. B. 'Juli 2026'.
  // ⚠ Von Hand pflegen — NICHT automatisch das heutige Datum einsetzen.
  // Ein Stand, der sich täglich selbst aktualisiert, ohne dass sich am Text
  // etwas geändert hat, ist eine Falschangabe.
  updated: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="section">
    <div class="container legal-page">
      <h1>{{ title }}</h1>
      <p v-if="updated" class="legal-updated">Stand: {{ updated }}</p>

      <!-- Sichtbare Bremse gegen ein versehentlich veröffentlichtes Impressum
           mit Platzhaltern. Verschwindet von allein, sobald legalConfig.js
           ausgefüllt ist. -->
      <div v-if="hasPlaceholders()" class="legal-warning" role="alert">
        <strong>Diese Seite ist noch nicht ausgefüllt.</strong>
        <p>
          In <code>src/config/legalConfig.js</code> stehen noch Platzhalter. Solange das so ist,
          darf die Website nicht öffentlich erreichbar sein — ein fehlendes oder falsches Impressum
          kann abgemahnt werden.
        </p>
      </div>

      <div class="legal-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.legal-page {
  /* Deutlich schmaler als der Rest der Seite: Fließtext liest sich am besten
     bei etwa 65 bis 75 Zeichen pro Zeile. Über die volle Breite von 1120 px
     verliert das Auge beim Zeilenwechsel den Anschluss. */
  max-width: 760px;
}

h1 {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
}

.legal-updated {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 0.86rem;
}

.legal-warning {
  margin-top: 28px;
  padding: 20px 22px;

  border: 1px solid rgba(255, 90, 90, 0.5);
  border-radius: var(--radius-md);
  background: rgba(255, 90, 90, 0.1);
}

.legal-warning strong {
  display: block;
  margin-bottom: 6px;
  color: #ff9c9c;
}

.legal-warning p {
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.legal-warning code {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.35);
  font-size: 0.88em;
}

.legal-body {
  margin-top: 36px;
}

/* :deep(), weil der Inhalt per <slot /> aus der jeweiligen View kommt und
   scoped CSS sonst nicht daran heranreicht. Hier ist das genau richtig: Der
   Rahmen gibt die Typografie vor, die Views liefern nur den Text. */
.legal-body :deep(h2) {
  margin-top: 40px;
  margin-bottom: 12px;
  font-size: 1.4rem;
  color: var(--text);
}

.legal-body :deep(h2:first-child) {
  margin-top: 0;
}

.legal-body :deep(h3) {
  margin-top: 26px;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.legal-body :deep(p) {
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}

.legal-body :deep(ul) {
  margin: 0 0 16px;
  padding-left: 22px;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.7;
}

.legal-body :deep(li) {
  margin-bottom: 6px;
}

.legal-body :deep(a) {
  color: var(--accent-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal-body :deep(address) {
  margin-bottom: 16px;
  color: var(--text-secondary);
  font-size: 0.96rem;
  font-style: normal;
  line-height: 1.7;
}

/* Ein ruhiger Kasten für Hinweise, die kein Warnhinweis sind */
.legal-body :deep(.legal-note) {
  padding: 18px 20px;
  margin-bottom: 16px;

  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.legal-body :deep(.legal-note p:last-child) {
  margin-bottom: 0;
}
</style>
