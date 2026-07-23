<script setup>
// Die Socials-Seite: alle Kanäle als Karten.
import { SOCIAL_LINKS } from '@/data/socialLinks'
import { useScrollReveal } from '@/composables/useScrollReveal'

import SectionHeader from '@/components/ui/SectionHeader.vue'
import SocialCard from '@/components/socials/SocialCard.vue'

useScrollReveal()
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Socials"
        title="Folge uns"
        text="Auf jedem Kanal gibt es etwas anderes zu sehen. Am schnellsten erfährst du Neuigkeiten aber immer auf Discord."
      />

      <div class="card-grid">
        <SocialCard v-for="social in SOCIAL_LINKS" :key="social.id" :social="social" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
</style>
