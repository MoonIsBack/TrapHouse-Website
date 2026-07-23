<script setup>
// Der Willkommensbereich ganz oben auf der Startseite.
//
// Aufbau: Das Foto liegt als eigenes <img> hinter dem Text, darüber zwei
// Schichten Abdunklung.
//
// WARUM EIN <img> STATT background-image WIE IN DER ALTEN SEITE?
// Ein Hintergrundbild in CSS beginnt der Browser erst zu laden, nachdem er die
// CSS-Datei gelesen und ausgerechnet hat, dass das Element überhaupt sichtbar
// ist. Ein <img> im HTML sieht er sofort beim Einlesen der Seite und kann es
// parallel zum Rest holen. Bei dem Bild, das als Erstes zu sehen ist, macht
// das den spürbaren Unterschied.
//
// fetchpriority="high" verstärkt das noch: Der Browser stellt dieses Bild vor
// alle anderen Anfragen.
import { DISCORD_INVITE } from '@/data/socialLinks'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import heroBackdrop from '@/assets/images/hero-backdrop.webp'
</script>

<template>
  <section class="hero" aria-label="Willkommen bei TrapHouse">
    <div class="hero-media" aria-hidden="true">
      <img :src="heroBackdrop" alt="" fetchpriority="high" width="1080" height="1080" />
      <span class="hero-scrim" />
      <span class="hero-tint" />
    </div>

    <div class="container hero-content">
      <span class="hero-badge reveal">Musik-Community · seit 2024</span>

      <h1 class="reveal reveal-delay-1">
        Willkommen bei
        <span class="hero-accent">TrapHouse</span>
      </h1>

      <p class="hero-text reveal reveal-delay-2">
        Der Treffpunkt für Artists und Producer im deutschsprachigen Raum. Tausch dich über Beats
        aus, finde Leute für Features und teile, woran du gerade arbeitest.
      </p>

      <div class="hero-actions reveal reveal-delay-3">
        <BaseButton :href="DISCORD_INVITE" variant="primary">
          <IconDiscord />
          Discord beitreten
        </BaseButton>

        <BaseButton :to="{ name: 'shop' }" variant="ghost">
          Zum Shop
          <IconArrowRight />
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;

  /* Nicht 100vh: Der Kopfbereich sitzt schon darüber, und ein Stück des
     nächsten Bereichs soll unten hervorlugen — das lädt zum Weiterscrollen
     ein, statt wie eine Wand zu wirken.
     min-height statt height, damit langer Text nie abgeschnitten wird. */
  min-height: min(86vh, 760px);

  display: flex;
  align-items: center;

  /* Der Kopfbereich liegt darüber, deshalb oben etwas mehr Luft */
  padding: 60px 0 80px;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-media img {
  width: 100%;
  height: 100%;

  /* Füllt die Fläche und schneidet über, statt das Bild zu verzerren */
  object-fit: cover;
  object-position: center 30%;
}

/* Erste Schicht: dunkler Verlauf von links, damit der Text links gut lesbar
   bleibt und das Bild rechts trotzdem sichtbar ist. */
.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(11, 7, 10, 0.96) 0%,
    rgba(11, 7, 10, 0.82) 42%,
    rgba(11, 7, 10, 0.42) 100%
  );
}

/* Zweite Schicht: ein Hauch Pink, damit das Foto farblich zur Seite passt,
   und unten ein weicher Übergang in den Seitenhintergrund. */
.hero-tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 60% at 15% 40%, rgba(var(--accent-rgb), 0.2), transparent 70%),
    linear-gradient(180deg, transparent 60%, var(--bg-bottom) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  margin-bottom: 22px;
  padding: 7px 16px;

  border: 1px solid rgba(var(--accent-rgb), 0.4);
  border-radius: var(--radius-pill);

  background: rgba(var(--accent-rgb), 0.14);
  backdrop-filter: blur(6px);

  color: var(--accent-strong);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

h1 {
  max-width: 15ch;
  font-size: clamp(2.9rem, 8vw, 5.6rem);
}

/* Der Markenname im pink-violetten Verlauf.
   Der Verlauf wird als Hintergrund gezeichnet und dann auf die Buchstaben
   zugeschnitten (background-clip: text) — die Schrift selbst ist durchsichtig. */
.hero-accent {
  display: block;

  background: var(--accent-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  /* Ohne etwas Luft nach unten schneidet der Zuschnitt die Unterlängen ab */
  padding-bottom: 0.08em;
}

.hero-text {
  max-width: 52ch;
  margin-top: 22px;

  color: var(--text-secondary);
  font-size: clamp(1rem, 1.6vw, 1.15rem);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

@media (max-width: 620px) {
  .hero {
    min-height: auto;
    padding: 48px 0 64px;
  }

  /* Auf dem Handy steht der Text über dem Bild statt daneben — der Verlauf
     muss deshalb von oben nach unten laufen, nicht von der Seite. */
  .hero-scrim {
    background: linear-gradient(
      180deg,
      rgba(11, 7, 10, 0.82) 0%,
      rgba(11, 7, 10, 0.9) 55%,
      rgba(11, 7, 10, 0.97) 100%
    );
  }

  .hero-actions > * {
    /* Volle Breite: auf dem Handy leichter zu treffen */
    flex: 1 1 100%;
  }
}
</style>
