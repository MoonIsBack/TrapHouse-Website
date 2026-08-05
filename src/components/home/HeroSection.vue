<script setup>
// Der Willkommensbereich ganz oben auf der Startseite.
//
// ⚠ WARUM HIER KEIN FOTO MEHR LIEGT
//
// Vorher lag hier `hero-backdrop.webp` — die Instagram-Kachel der Community.
// Die war aber voller Text ("Jeder ist willkommen", "Was euch erwartet:" …),
// der durch die Abdunklung schlug und neben der echten Überschrift stand.
//
// Als Reparatur folgte `hero-texture.webp`: dieselbe Grafik, aber so stark
// weichgezeichnet, dass nur noch ein Farbverlauf übrig blieb. Der Text war
// weg — aber ein auf 5 KB weichgezeichnetes Foto, auf volle Breite gezerrt,
// sieht aus der Nähe nach genau dem, was es ist: unscharf. Auf einem großen
// Bildschirm besonders deutlich.
//
// Jetzt liegt dort gar kein Bild mehr, sondern `.hero-aura` — mehrere
// `radial-gradient`-Schichten in den Markenfarben. Ein Verlauf ist von Natur
// aus gestochen scharf, in jeder Auflösung, ohne jemals wie ein
// hochskaliertes Foto zu wirken. Nebeneffekt: keine Bilddatei mehr zu laden.
//
// Die alte hero-texture.webp liegt weiterhin im Projekt (falls doch wieder
// ein Foto gewünscht ist), wird hier aber nicht mehr eingebunden.
import { DISCORD_INVITE } from '@/data/socialLinks'
import { useParallax } from '@/composables/useParallax'

import BaseButton from '@/components/ui/BaseButton.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'

// Der Hintergrund wandert beim Scrollen langsamer mit als der Text darüber
const auraRef = useParallax(0.28)
</script>

<template>
  <section class="hero" aria-label="Willkommen bei TrapHouse">
    <div class="hero-media" aria-hidden="true">
      <span ref="auraRef" class="hero-aura" />
      <span class="hero-grain" />
      <span class="hero-scrim" />
      <span class="hero-glow" />
      <span class="hero-grid" />
    </div>

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

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* DER NEUE HINTERGRUND: NUR VERLÄUFE, KEIN FOTO
   ================================================
   Drei radiale Farbflecken in den Markenfarben über einem dunklen Verlauf —
   dieselbe Bauweise wie BackdropGlow.vue, hier aber lokal auf den Hero
   zugeschnitten (eigene Position, eigene Stärke, damit die Überschrift
   genügend Kontrastfläche bekommt).

   Etwas größer als der Bereich und nach oben versetzt: Der Parallax-Effekt
   (useParallax.js) schiebt die Fläche beim Scrollen nach unten — ohne diesen
   Vorrat käme unten eine leere Kante zum Vorschein.

   ⚠ Bewusst KEIN filter: blur() — genau das war ja das Problem der Vorlage.
   Ein radial-gradient ist bereits weich gezeichnet, ganz ohne Nachbearbeitung,
   und bleibt das in jeder Bildschirmgröße und -auflösung. Er wird einmal
   gerastert und beim Scrollen nur noch verschoben, nicht neu berechnet.
   → BackdropGlow.vue für dieselbe Überlegung ausführlicher. */
.hero-aura {
  display: block;
  position: absolute;
  inset: 0;

  height: 130%;
  top: -15%;

  background:
    radial-gradient(46% 55% at 18% 20%, rgba(var(--accent-rgb), 0.65), transparent 68%),
    radial-gradient(40% 46% at 80% 10%, rgba(var(--accent-2-rgb), 0.48), transparent 70%),
    radial-gradient(60% 55% at 55% 88%, rgba(var(--accent-rgb), 0.28), transparent 72%),
    linear-gradient(165deg, #2b1408 0%, #170c06 52%, var(--bg-bottom) 100%);

  will-change: transform;
}

/* Feine Körnung darüber, aus demselben Grund wie in BackdropGlow.vue: Große,
   glatte Farbverläufe zeigen auf manchen Bildschirmen sichtbare Streifen
   ("Banding"). Ein Hauch Rauschen bricht das auf und gibt der Fläche
   zusätzlich eine fast fotografische Textur, ganz ohne Foto. */
.hero-grain {
  position: absolute;
  inset: 0;
  opacity: 0.35;

  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 3px 3px;
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
      rgba(var(--bg-bottom-rgb), 0.92) 0%,
      rgba(var(--bg-bottom-rgb), 0.6) 42%,
      rgba(var(--bg-bottom-rgb), 0.12) 100%
    ),
    linear-gradient(180deg, rgba(var(--bg-bottom-rgb), 0.55) 0%, transparent 20%, var(--bg-bottom) 98%);
}

/* Ein zusätzlicher orangener Schein hinter der Überschrift. Er hebt den Text
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

  /* Auf dem Handy steht der Text über dem Bild statt daneben — der Verlauf
     muss deshalb von oben nach unten laufen, nicht von der Seite. */
  .hero-scrim {
    background: linear-gradient(
      180deg,
      rgba(var(--bg-bottom-rgb), 0.8) 0%,
      rgba(var(--bg-bottom-rgb), 0.86) 45%,
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
