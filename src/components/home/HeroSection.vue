<script setup>
// Der Willkommensbereich ganz oben auf der Startseite.
//
// Die Hintergrund-Deko (Farbverläufe, Abdunklung, Raster) steckt in
// HeroBackdrop.vue — ausgelagert, damit diese Datei sich auf den eigentlichen
// Inhalt konzentrieren kann. Warum dort kein Foto mehr liegt, steht dort.
import { DISCORD_INVITE } from '@/data/socialLinks'

import BaseButton from '@/components/ui/BaseButton.vue'
import HeroBackdrop from '@/components/home/HeroBackdrop.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
</script>

<template>
  <section class="hero" aria-label="Willkommen bei TrapHouse">
    <HeroBackdrop />

    <div class="container hero-content">
      <span class="hero-badge reveal">Musik-Community · seit 2024</span>

      <h1>
        <!-- Der äußere Span trägt jetzt "reveal" (nicht die innere Zeile!) und
             schneidet zu (overflow: hidden) — das bildet den "Vorhang", hinter
             dem die Zeile hervorfährt. Warum "reveal" hier außen sitzt, steht
             unten bei .hero-line-mask. -->
        <span class="hero-line-mask reveal">
          <span class="hero-line">Willkommen bei</span>
        </span>
        <span class="hero-line-mask reveal">
          <span class="hero-line hero-accent">TrapHouse</span>
        </span>
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

.hero-content {
  position: relative;
  z-index: 1;
}

/* HERO ZIEHT SICH BEIM WEGSCROLLEN ZURÜCK
   ========================================
   Zusätzlich zur Parallaxe auf dem Hintergrundbild (useParallax.js) bekommt
   der TEXT-Inhalt hier eine eigene, rein CSS-gesteuerte Bewegung: Er wird
   leicht kleiner und blasser, während man die ersten 70 Bildschirmhöhen
   herunterscrollt — dann hat längst der nächste Bereich übernommen.

   animation-timeline: scroll(root block) bindet die Animation direkt an die
   Scrollposition der ganzen Seite statt an eine Uhr. Das läuft komplett auf
   der Grafikkarte und kostet keinen einzigen JavaScript-Schritt pro Bild —
   anders als ein scroll-Lauscher, der bei jedem Pixel neu rechnen müsste.

   @supports fängt Browser ohne diese noch junge CSS-Funktion vollständig auf:
   Dort bleibt der Hero-Inhalt einfach stehen, wie er es heute schon tut. Kein
   Fallback nötig, keine Funktionseinbuße — nur ein Bonus obendrauf.
   → docs/lernheft/16-Scroll-Effekte-und-Mikrointeraktionen.md */
@supports (animation-timeline: scroll(root block)) {
  @media (prefers-reduced-motion: no-preference) {
    .hero-content {
      animation: hero-recede linear both;
      animation-timeline: scroll(root block);
      animation-range: 0px 70vh;
    }
  }
}

@keyframes hero-recede {
  to {
    opacity: 0;
    transform: translateY(-36px) scale(0.94);
  }
}

/* Der Vorhang: schneidet alles zu, was außerhalb der Zeilenhöhe liegt.
   Dadurch verschwindet die Zeile beim Reveal nicht durch Verblassen, sondern
   fährt sichtbar von unten herein.

   ⚠ HIER STAND EINMAL: die Klasse "reveal" auf der INNEREN .hero-line, nicht
   auf dieser Maske. Das hat die Überschrift dauerhaft unsichtbar gemacht —
   ein echter Fehler, kein Stilbruch. Grund: useScrollReveal.js benutzt einen
   IntersectionObserver, und der berücksichtigt genau dieselbe Beschneidung
   (overflow: hidden), die den Vorhang-Effekt überhaupt erst ermöglicht. Die
   Zeile stand ja ABSICHTLICH um 115 % verschoben außerhalb dieser Maske,
   damit sie verborgen ist — für den Beobachter sah das dadurch aber nicht
   nach "kommt gleich ins Bild", sondern nach "hat quasi keine sichtbare
   Fläche" aus. isIntersecting blieb dauerhaft false, die Klasse is-visible
   kam nie an, die Überschrift blieb für immer hinter dem Vorhang.

   Die Lösung: reveal beobachtet jetzt diese ÄUSSERE Maske. Die bewegt und
   verbirgt sich selbst nie (siehe die beiden Regeln direkt darunter, die
   main.css' Standard-Opacity/Transform für sie neutralisieren) — sie ist aus
   Sicht des Beobachters ein ganz gewöhnliches, unverschobenes Element. Erst
   wenn SIE als sichtbar gilt, fährt über den Nachfahren-Selektor unten die
   eigentliche Zeile hinter ihr hervor. */
.hero-line-mask {
  display: block;
  overflow: hidden;
}

/* Neutralisiert main.css' .reveal-Grundzustand (opacity: 0, ein Hochrutschen
   um 18px) auf der Maske: Sie selbst soll nie unsichtbar sein oder sich
   bewegen — nur beobachtet werden. Die eigentliche Bewegung passiert bei
   .hero-line weiter unten. */
.hero-line-mask.reveal {
  opacity: 1;
  transform: none;
  transition: none;
}

/* Die Zeile selbst startet außerhalb der Maske (unten) und fährt herein,
   sobald useScrollReveal.js "is-visible" an die Maske gehängt hat — daher
   der Nachfahren-Selektor statt einer eigenen reveal-Klasse auf der Zeile. */
.hero-line {
  display: block;
  transform: translateY(115%);
  transition: transform 0.9s var(--ease-out-hero);
}

.hero-line-mask.is-visible .hero-line {
  transform: translateY(0);
}

/* Staffelung wie beim Rest der Seite (main.css: .reveal-delay-1/2), aber
   direkt hier: main.css' Variante würde die (jetzt reglose) Maske verzögern,
   nicht die Zeile, die sich tatsächlich bewegt. */
.hero-line-mask:nth-of-type(1) .hero-line {
  transition-delay: 0.05s;
}

.hero-line-mask:nth-of-type(2) .hero-line {
  transition-delay: 0.2s;
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

/* .hero-line (display: block, die Vorhang-Bewegung) steht bereits weiter
   oben bei .hero-line-mask — beides gehört inhaltlich zusammen. */

/* Der Markenname im Orange-Verlauf.
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
