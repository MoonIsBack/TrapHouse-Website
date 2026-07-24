<script setup>
// Die Discord-Seite.
//
// Erklärt, was den Server ausmacht, und endet mit dem Beitreten-Aufruf.
// Die Punkte stehen als Liste direkt hier und nicht in data/: Sie beschreiben
// diese eine Seite und werden nirgends sonst gebraucht — sie nach data/
// auszulagern würde die Suche nur verlängern, ohne etwas zu sparen.
import { useScrollReveal } from '@/composables/useScrollReveal'

import SectionHeader from '@/components/ui/SectionHeader.vue'
import DiscordCta from '@/components/discord/DiscordCta.vue'

useScrollReveal()

const FEATURES = [
  {
    title: 'Feedback zu deinen Tracks',
    text: 'Lad hoch, woran du arbeitest, und bekomm ehrliche Rückmeldung von Leuten, die selbst produzieren.',
  },
  {
    title: 'Leute für Features finden',
    text: 'Suchst du Vocals, einen Mix oder einen Beat? Im Kollab-Kanal findet sich fast immer jemand.',
  },
  {
    title: 'Beats und Sounds teilen',
    text: 'Drum Kits, Samples und Presets, die die Community untereinander weitergibt.',
  },
  {
    title: 'Kein Gatekeeping',
    text: 'Egal ob erster Beat oder zehntes Release — es wird niemand ausgelacht, der noch am Anfang steht.',
  },
]
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Community"
        title="Der TrapHouse Discord"
        text="Der Ort, an dem am meisten passiert. Kein Zwang, kein Bewerbungsverfahren — reinkommen und mitreden."
      />

      <div class="feature-grid reveal-stagger">
        <article v-for="feature in FEATURES" :key="feature.title" class="feature-card reveal">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.text }}</p>
        </article>
      </div>

      <div class="cta-wrapper">
        <!-- Die Überschrift steht schon oben auf der Seite — hier würde eine
             zweite nur wiederholen, was drei Absätze weiter oben steht. -->
        <DiscordCta :show-heading="false" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Eigenes Raster statt .card-grid aus main.css: Die Punkte sind reine
   Textkacheln und stehen enger beieinander als die großen Kanal-Karten.
   min(260px, 100%) wie dort — sonst läuft das Raster auf sehr schmalen
   Handys über den Bildschirmrand hinaus. */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 20px;
}

.feature-card {
  padding: 26px;

  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);

  background: var(--surface);

  transition:
    border-color var(--transition),
    background var(--transition),
    transform var(--transition);
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--accent-rgb), 0.38);
  background: var(--surface-hover);
}

h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

p {
  color: var(--text-secondary);
  font-size: 0.93rem;
}

.cta-wrapper {
  margin-top: 44px;
}
</style>
