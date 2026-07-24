<script setup>
// Die Startseite.
//
// Sie stellt nur zusammen und formuliert keine eigenen Inhalte. Die Reihenfolge
// folgt den Fragen, die jemand beim ersten Besuch stellt:
//
//   1. Hero          Wo bin ich hier?
//   2. Laufband      (Trennung, Rhythmus)
//   3. Highlights    Was habe ich davon?      ← fehlte vorher komplett
//   4. Merch         Was gibt es zu sehen?
//   5. Discord       Wie mache ich mit?
//   6. Socials       Wo finde ich euch sonst?
//
// Punkt 3 war vorher nicht da: Die Seite sprang vom Willkommensgruß direkt zum
// T-Shirt, ohne je zu sagen, was die Community eigentlich ist.
import { PRODUCTS } from '@/data/products'
import { SOCIAL_LINKS } from '@/data/socialLinks'
import { MARQUEE_WORDS } from '@/data/community'
import { HOME_SCROLL_MODE } from '@/config/scrollConfig'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useHomeScroll } from '@/composables/useHomeScroll'

import HeroSection from '@/components/home/HeroSection.vue'
import HighlightGrid from '@/components/home/HighlightGrid.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MarqueeBand from '@/components/ui/MarqueeBand.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import SocialCard from '@/components/socials/SocialCard.vue'
import DiscordCta from '@/components/discord/DiscordCta.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

// Blendet alle Elemente mit der Klasse "reveal" ein, sobald sie ins Bild kommen
useScrollReveal()
useHomeScroll()
</script>

<template>
  <div class="home-scroll" :class="`scroll-mode-${HOME_SCROLL_MODE}`">
    <HeroSection class="scroll-panel" data-scroll-panel />

    <MarqueeBand :words="MARQUEE_WORDS" />

    <!-- WAS DICH ERWARTET -->
    <section class="section scroll-panel" data-scroll-panel>
      <div class="container">
        <SectionHeader
          eyebrow="Community"
          title="Was dich erwartet"
          text="TrapHouse ist kein Label und keine Agentur, sondern ein Ort zum Austauschen — für alle, die Musik machen."
        />

        <HighlightGrid />
      </div>
    </section>

    <!-- MERCH -->
    <section class="section scroll-panel" data-scroll-panel>
      <div class="container">
        <SectionHeader
          eyebrow="Merch"
          title="Trag es nach draußen"
          text="Kleine Kollektion, ordentliche Qualität — gerade in Arbeit."
        />

        <div class="product-grid reveal-stagger">
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
    <section class="section scroll-panel" data-scroll-panel>
      <div class="container">
        <DiscordCta />
      </div>
    </section>

    <MarqueeBand :words="MARQUEE_WORDS" />

    <!-- SOCIALS -->
    <section class="section scroll-panel" data-scroll-panel>
      <div class="container">
        <SectionHeader
          eyebrow="Socials"
          title="Bleib auf dem Laufenden"
          text="Auf jedem Kanal gibt es andere Einblicke — such dir aus, was zu dir passt."
        />

        <div class="card-grid reveal-stagger">
          <SocialCard v-for="social in SOCIAL_LINKS" :key="social.id" :social="social" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* MODERNES BEREICHS-SCROLLEN
   Jeder Themenblock rastet am unteren Rand des festen Headers ein. Die
   Browser-Engine übernimmt dabei Touchpad, Mausrad und Touch-Gesten nativ,
   statt das Scrollen mit JavaScript künstlich zu blockieren. */
.scroll-panel {
  min-height: calc(100svh - var(--header-height));
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* Im Kapitelmodus übernimmt useChapterScroll die Bewegung. Hier wird
   nur der Inhalt innerhalb seines Bildschirmbereichs sauber zentriert. */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .scroll-mode-chapter .section.scroll-panel {
    display: grid;
    align-items: center;
  }

  /* Das Kapitel liegt zunächst etwas tiefer und weiter hinten. Sobald seine
     Mitte den Viewport übernimmt, öffnet es sich ruhig auf volle Größe. */
  .scroll-mode-chapter .scroll-panel > .container {
    opacity: 0.28;
    filter: blur(5px);
    transform: translateY(38px) scale(0.955);
    transform-origin: center center;
    transition:
      opacity 0.26s ease,
      filter 0.26s ease,
      transform 0.36s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, filter, transform;
  }

  .scroll-mode-chapter .scroll-panel.is-scroll-active > .container {
    opacity: 1;
    filter: none;
    transform: none;
  }

  /* Die Merch-Karte bleibt innerhalb der festen Kapitelhöhe kompakt. */
  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 300px));
  }
}

/* Wenn genug Platz vorhanden ist, sind wirklich alle Kapitel exakt gleich
   hoch. Auf kleineren MacBook-Fenstern dürfen sie für ihren Inhalt wachsen. */
@media (min-width: 769px) and (min-height: 760px) and (pointer: fine) {
  .scroll-mode-chapter .scroll-panel {
    height: calc(100svh - var(--header-height));
    min-height: 0;
  }
}

@media (max-width: 600px) {
  .product-grid,
  .card-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Auf Touch-Geräten sanfter: Der Browser hilft beim Einrasten, erzwingt es
   aber nicht, wenn jemand bewusst nur ein kleines Stück scrollen möchte. */
@media (prefers-reduced-motion: no-preference) {
  :global(html.home-modern-scroll) {
    scroll-snap-type: y proximity;
  }

  .scroll-mode-modern .scroll-panel {
    scroll-snap-stop: normal;
  }
}

/* PRODUKTRASTER — mit Obergrenze pro Karte
   Vorher stand hier minmax(280px, 1fr). Bei nur EINEM Artikel bekam der die
   volle Breite von 1120 px — und weil die Karte ein festes Seitenverhältnis
   von 4:5 hat, wurde daraus ein 1400 px hohes Riesen-T-Shirt.
   Mit einer Obergrenze von 340 px bleibt die Karte immer in vernünftiger
   Größe, und justify-content zentriert sie, statt sie links kleben zu lassen. */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 340px));
  justify-content: center;
  gap: 24px;
}

/* Bei den Social-Kanälen ist das kein Thema: Es sind immer drei, die füllen
   die Breite von selbst sauber aus. */
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
