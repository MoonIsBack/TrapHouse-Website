<script setup>
// Die Startseite.
//
// Sie stellt nur zusammen und formuliert keine eigenen Inhalte: Hero, eine
// Vorschau auf den Shop, der Discord-Aufruf und die Social-Kanäle. Jeder
// Bereich verlinkt auf die zugehörige Unterseite, wo es ausführlicher wird.
//
// Alle Daten kommen aus data/ — hier steht kein einziger Produktname und kein
// einziger Nutzername im Klartext.
import { PRODUCTS } from '@/data/products'
import { SOCIAL_LINKS } from '@/data/socialLinks'
import { useScrollReveal } from '@/composables/useScrollReveal'

import HeroSection from '@/components/home/HeroSection.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import SocialCard from '@/components/socials/SocialCard.vue'
import DiscordCta from '@/components/discord/DiscordCta.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

// Blendet alle Elemente mit der Klasse "reveal" ein, sobald sie ins Bild kommen
useScrollReveal()
</script>

<template>
  <HeroSection />

  <!-- SHOP-VORSCHAU -->
  <section class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Merch"
        title="Trag es nach draußen"
        text="Kleine Kollektion, ordentliche Qualität — gerade in Arbeit."
      />

      <div class="card-grid">
        <ProductCard v-for="product in PRODUCTS" :key="product.id" :product="product" />
      </div>

      <div class="section-action reveal">
        <BaseButton :to="{ name: 'shop' }" variant="ghost">
          Merch ansehen
          <IconArrowRight />
        </BaseButton>
      </div>
    </div>
  </section>

  <!-- DISCORD -->
  <section class="section">
    <div class="container">
      <DiscordCta />
    </div>
  </section>

  <!-- SOCIALS -->
  <section class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Socials"
        title="Bleib auf dem Laufenden"
        text="Auf jedem Kanal gibt es andere Einblicke — such dir aus, was zu dir passt."
      />

      <div class="card-grid">
        <SocialCard v-for="social in SOCIAL_LINKS" :key="social.id" :social="social" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Das gemeinsame Raster für Karten.
   auto-fit + minmax bedeutet: So viele Spalten wie hineinpassen, jede
   mindestens 280 px breit. Dadurch braucht es KEINE Media Query — das Raster
   ordnet sich von allein von drei Spalten auf eine um. */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.section-action {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
