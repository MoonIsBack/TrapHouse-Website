<script setup>
// Der große Discord-Aufruf.
//
// Er steht sowohl auf der Startseite als auch auf der Discord-Seite. Deshalb
// ist er eine eigene Komponente und nicht zweimal hingeschrieben — sonst
// müsste man jede Änderung an zwei Stellen machen und würde eine vergessen.
//
// Hier taucht endlich MoonPixel.gif auf: Die Datei lag in der alten Seite im
// images-Ordner, wurde aber nirgends eingebunden. Als Maskottchen neben dem
// Aufruf hat sie jetzt einen Platz.
import { DISCORD_INVITE } from '@/data/socialLinks'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import moonPixel from '@/assets/images/moon-pixel.webp'

defineProps({
  // Auf der Discord-Seite steht darüber schon eine Überschrift — dort wäre
  // eine zweite doppelt gemoppelt.
  showHeading: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="discord-cta reveal">
    <div class="cta-text">
      <h2 v-if="showHeading">Werde Teil der Community</h2>

      <p>
        Auf dem Server findest du Kanäle für Feedback, Kollaborationen und alles rund ums
        Produzieren. Reinschauen kostet nichts — und du musst nichts können, um dabei zu sein.
      </p>

      <BaseButton :href="DISCORD_INVITE" variant="primary" class="cta-button">
        <IconDiscord />
        Jetzt beitreten
      </BaseButton>
    </div>

    <!-- alt="" und aria-hidden: reine Dekoration, kein Informationsgehalt -->
    <img :src="moonPixel" alt="" aria-hidden="true" class="cta-mascot" loading="lazy" />
  </div>
</template>

<style scoped>
.discord-cta {
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  padding: 44px 48px;

  border: 1px solid rgba(var(--accent-rgb), 0.28);
  border-radius: var(--radius-lg);

  /* Zwei Schichten: ein pinker Schein oben rechts, darunter die Glasfläche */
  background:
    radial-gradient(80% 120% at 88% 15%, rgba(var(--accent-rgb), 0.22), transparent 68%),
    var(--surface);

  box-shadow: var(--shadow-card);
}

.cta-text {
  max-width: 56ch;
}

h2 {
  font-size: clamp(1.8rem, 3.6vw, 2.6rem);
  margin-bottom: 14px;
}

p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.cta-button {
  margin-top: 26px;
}

.cta-mascot {
  width: 96px;
  flex-shrink: 0;

  /* Die Vorlage ist eine Pixelgrafik — Kanten scharf lassen */
  image-rendering: pixelated;

}

@media (max-width: 720px) {
  .discord-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 26px;
  }

  .cta-mascot {
    /* Auf dem Handy von der Seite nach unten und kleiner */
    align-self: center;
    width: 72px;
  }

  .cta-button {
    width: 100%;
  }
}
</style>
