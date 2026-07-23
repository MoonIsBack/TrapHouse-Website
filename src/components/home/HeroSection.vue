<script setup>
// Der Willkommensbereich ganz oben auf der Startseite.
//
// ⚠ WARUM HIER NICHT MEHR DIE INSTAGRAM-GRAFIK LIEGT
//
// Vorher lag hier `hero-backdrop.webp` — die Instagram-Kachel der Community.
// Die ist aber voller Text ("Jeder ist willkommen", "Was euch erwartet:" …).
// Dieser Text schlug durch die Abdunklung und stand direkt neben der echten
// Überschrift. Zwei konkurrierende Texte übereinander liest niemand als
// Gestaltung, sondern als Fehler.
//
// Jetzt liegt dort `hero-texture.webp`: dieselbe Grafik, aber so stark
// weichgezeichnet, dass nur noch ein Farbverlauf übrig ist. Die Markenfarben
// bleiben, der Text ist weg. Nebeneffekt: 179 KB → 5 KB, weil ein
// weichgezeichnetes Bild fast nichts an Information enthält.
//
// Erzeugt wurde sie einmalig mit einem Weichzeichner; die Vorlage liegt
// weiterhin in der Git-Historie, falls sie nochmal gebraucht wird.
import { DISCORD_INVITE } from '@/data/socialLinks'
import { useParallax } from '@/composables/useParallax'

import BaseButton from '@/components/ui/BaseButton.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
import heroTexture from '@/assets/images/hero-texture.webp'

// Der Hintergrund wandert beim Scrollen langsamer mit als der Text darüber
const textureRef = useParallax(0.28)
</script>

<template>
  <section class="hero" aria-label="Willkommen bei TrapHouse">
    <div class="hero-media" aria-hidden="true">
      <img ref="textureRef" :src="heroTexture" alt="" fetchpriority="high" class="hero-texture" />
      <span class="hero-scrim" />
      <span class="hero-glow" />
      <span class="hero-grid" />
    </div>

    <div class="container hero-content">
      <span class="hero-badge reveal">Musik-Community · seit 2024</span>

      <h1>
        <span class="hero-line reveal reveal-delay-1">Willkommen bei</span>
        <span class="hero-line hero-accent reveal reveal-delay-2">TrapHouse</span>
      </h1>

      <p class="hero-text reveal reveal-delay-3">
        Der Treffpunkt für Artists und Producer im deutschsprachigen Raum. Tausch dich über Beats
        aus, finde Leute für Features und teile, woran du gerade arbeitest.
      </p>

      <div class="hero-actions reveal reveal-delay-4">
        <BaseButton :href="DISCORD_INVITE" variant="primary">
          <IconDiscord />
          Discord beitreten
        </BaseButton>

        <BaseButton :to="{ name: 'shop' }" variant="ghost">
          Merch ansehen
          <IconArrowRight />
        </BaseButton>
      </div>
    </div>

    <!-- Der Hinweis zum Weiterscrollen. Ohne ihn wirkt ein bildschirmfüllender
         Hero schnell wie die ganze Seite — man übersieht, dass darunter noch
         etwas kommt. -->
    <div class="hero-scroll" aria-hidden="true">
      <span class="hero-scroll-line" />
      <span class="hero-scroll-text">Scrollen</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;

  /* svh statt vh: Auf dem Handy ändert sich die Fensterhöhe, sobald die
     Adressleiste beim Scrollen ein- und ausfährt. Mit vh springt die Seite
     dabei sichtbar. "svh" (small viewport height) rechnet immer mit der
     kleinsten Höhe und bleibt deshalb ruhig.
     Die erste Zeile ist die Rückfalllösung für ältere Browser. */
  min-height: 88vh;
  min-height: min(88svh, 820px);

  padding: 100px 0 120px;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-texture {
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* Etwas größer als der Bereich und nach oben versetzt: Der Parallax-Effekt
     schiebt das Bild beim Scrollen nach unten — ohne diesen Vorrat käme unten
     eine leere Kante zum Vorschein. */
  height: 130%;
  top: -15%;
  position: absolute;

  /* Das Bild ist bereits weichgezeichnet; Sättigung und Kontrast holen die
     Markenfarben zurück, die beim Weichzeichnen flau geworden sind. */
  filter: saturate(1.6) contrast(1.1);
  opacity: 1;

  will-change: transform;
}

/* Abdunklung — die Gratwanderung dieses Bereichs.
   Links muss es dunkel genug sein, dass weiße Schrift sicher lesbar bleibt.
   Rechts muss genug Farbe durchkommen, dass der Hero nicht wie eine leere
   schwarze Fläche wirkt. Der erste Entwurf war hier zu vorsichtig: Mit 0.95
   bis 0.45 blieb rechts fast nichts übrig.
   Unten läuft alles in den Seitenhintergrund aus, damit zwischen Hero und
   Seite keine sichtbare Kante entsteht. */
.hero-scrim {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      100deg,
      rgba(11, 7, 10, 0.92) 0%,
      rgba(11, 7, 10, 0.6) 42%,
      rgba(11, 7, 10, 0.12) 100%
    ),
    linear-gradient(180deg, rgba(11, 7, 10, 0.55) 0%, transparent 20%, var(--bg-bottom) 98%);
}

/* Ein zusätzlicher pinker Schein hinter der Überschrift. Er hebt den Text
   optisch von der Textur ab und bindet den Bereich farblich an den Rest der
   Seite an. */
.hero-glow {
  position: absolute;
  inset: 0;

  background: radial-gradient(55% 60% at 22% 48%, rgba(var(--accent-rgb), 0.28), transparent 70%);
}

/* Ein feines Raster über dem Ganzen. Es gibt der Fläche Struktur und lässt den
   Hero technischer wirken — sichtbar nur als Andeutung. */
.hero-grid {
  position: absolute;
  inset: 0;
  opacity: 0.4;

  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;

  /* Zu den Rändern hin ausblenden, damit das Raster nicht wie ein Gitternetz
     über der ganzen Seite liegt */
  mask-image: radial-gradient(70% 60% at 30% 45%, #000, transparent);
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

/* Jede Zeile ist ein eigenes Element mit eigener Verzögerung — dadurch baut
   sich die Überschrift Zeile für Zeile auf statt als ganzer Block zu
   erscheinen. */
.hero-line {
  display: block;
}

/* Der Markenname im pink-violetten Verlauf.
   Der Verlauf wird als Hintergrund gezeichnet und dann auf die Buchstaben
   zugeschnitten (background-clip: text) — die Schrift selbst ist durchsichtig. */
.hero-accent {
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

/* --- Hinweis zum Weiterscrollen --- */
.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hero-scroll-line {
  position: relative;
  overflow: hidden;

  width: 1px;
  height: 42px;
  background: rgba(255, 255, 255, 0.14);
}

/* Ein heller Punkt läuft die Linie hinunter — eine Bewegung, die nach unten
   zeigt, ohne einen Pfeil zu brauchen. */
.hero-scroll-line::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 14px;

  background: var(--accent);
  animation: scroll-dot 2.1s ease-in-out infinite;
}

.hero-scroll-text {
  color: var(--text-subtle);
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

@keyframes scroll-dot {
  0% {
    top: -14px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    top: 42px;
    opacity: 0;
  }
}

@media (max-width: 620px) {
  .hero {
    min-height: auto;
    padding: 70px 0 90px;
  }

  /* Auf dem Handy steht der Text über dem Bild statt daneben — der Verlauf
     muss deshalb von oben nach unten laufen, nicht von der Seite. */
  .hero-scrim {
    background: linear-gradient(
      180deg,
      rgba(11, 7, 10, 0.8) 0%,
      rgba(11, 7, 10, 0.86) 45%,
      var(--bg-bottom) 100%
    );
  }

  .hero-actions > * {
    /* Volle Breite: auf dem Handy leichter zu treffen */
    flex: 1 1 100%;
  }

  /* Kein Platz — und auf dem Handy weiß ohnehin jeder, dass man scrollen kann */
  .hero-scroll {
    display: none;
  }
}
</style>
