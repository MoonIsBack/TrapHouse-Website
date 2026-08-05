<script setup>
// Eine Kanal-Karte (YouTube, TikTok, Instagram).
//
// Die Markenfarbe des Kanals wird über eine CSS-Variable hereingereicht und
// erst beim Darüberfahren sichtbar. Im Ruhezustand bleiben alle Karten orange —
// sonst sähe der Bereich aus wie ein Farbkasten und nichts stäche mehr hervor.
//
// Die Variable wird per :style gesetzt, weil die Farbe aus den Daten kommt und
// zur Bauzeit noch nicht feststeht. Das ist genau der Fall, für den die CSP in
// vite.config.js 'unsafe-inline' bei style-src erlaubt.
import { EXTERNE_LINKS_AKTIV, haltExternenKlickAn } from '@/config/linkConfig'
import { useCardInteraction } from '@/composables/useCardInteraction'
import IconYouTube from '@/components/icons/IconYouTube.vue'
import IconTikTok from '@/components/icons/IconTikTok.vue'
import IconInstagram from '@/components/icons/IconInstagram.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

const { onPointerMove, onPointerLeave } = useCardInteraction()

defineProps({
  social: {
    type: Object,
    required: true,
  },
})

const SOCIAL_ICONS = {
  youtube: IconYouTube,
  tiktok: IconTikTok,
  instagram: IconInstagram,
}
</script>

<template>
  <a
    :href="social.url"
    :target="EXTERNE_LINKS_AKTIV ? '_blank' : null"
    :rel="EXTERNE_LINKS_AKTIV ? 'noopener noreferrer' : null"
    :aria-disabled="EXTERNE_LINKS_AKTIV ? null : 'true'"
    class="social-card reveal reveal-pop reveal-cinematic spotlight"
    :style="{ '--brand': social.brand }"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @click="haltExternenKlickAn"
  >
    <span class="social-icon">
      <component :is="SOCIAL_ICONS[social.id]" />
    </span>

    <h3>{{ social.label }}</h3>
    <p class="social-handle">{{ social.handle }}</p>
    <p class="social-description">{{ social.description }}</p>

    <span class="social-cta">
      Ansehen
      <IconArrowRight />
    </span>
  </a>
</template>

<style scoped>
.social-card {
  display: flex;
  flex-direction: column;

  /* Hält den Lichtfleck (.spotlight) innerhalb der Karte */
  isolation: isolate;
  overflow: hidden;

  padding: 26px;

  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);

  background: var(--surface);
  box-shadow: var(--shadow-card);

  transition:
    transform var(--transition),
    border-color var(--transition),
    background var(--transition);
}

.social-card:hover {
  transform: translateY(-6px);

  /* Hier kommt die Markenfarbe zum Vorschein */
  border-color: var(--brand);
  background: var(--surface-hover);
}

/* 3D-KIPPEN — nur mit echtem Zeiger. Siehe HighlightGrid.vue für die
   ausführliche Begründung. */
@media (hover: hover) and (pointer: fine) {
  .social-card {
    --rx: 0deg;
    --ry: 0deg;

    /* --ease-out-smooth statt --ease-spring: siehe main.css. Etwas länger
       (0.5s statt 0.4s) für ein ruhigeres Eintreten, wenn der Zeiger aus dem
       Leeren auf die Karte kommt. */
    transition:
      transform 0.5s var(--ease-out-smooth),
      border-color var(--transition),
      background var(--transition);
  }

  .social-card:hover {
    transform: perspective(900px) translateY(-6px) rotateX(var(--rx)) rotateY(var(--ry));
  }
}

/* Inhalt über den Lichtfleck legen, sonst wirkt die Schrift milchig */
.social-card > * {
  position: relative;
  z-index: 2;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;
  margin-bottom: 18px;

  border-radius: var(--radius-md);
  background: rgba(var(--accent-rgb), 0.14);

  color: var(--accent-strong);
  font-size: 1.5rem;

  transition:
    background var(--transition),
    color var(--transition);
}

.social-card:hover .social-icon {
  /* color-mix mischt die Markenfarbe mit Transparenz — so muss für jeden
     Kanal nur EIN Farbwert in socialLinks.js stehen und nicht zusätzlich
     eine halbtransparente Variante davon. */
  background: color-mix(in srgb, var(--brand) 18%, transparent);
  color: var(--brand);
}

h3 {
  font-size: 1.4rem;
}

.social-handle {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 0.86rem;
  font-weight: 600;
}

.social-description {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.social-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: auto;
  padding-top: 22px;

  color: var(--text);
  font-size: 0.88rem;
  font-weight: 700;
}

.social-cta :deep(svg) {
  transition: transform var(--transition);
}

.social-card:hover .social-cta {
  color: var(--brand);
}

.social-card:hover .social-cta :deep(svg) {
  transform: translateX(4px);
}
</style>
