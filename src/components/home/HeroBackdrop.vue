<script setup>
// Die Hintergrund-Deko des Hero-Bereichs — ausgelagert aus HeroSection.vue,
// die sich dadurch wieder auf ihren eigentlichen Inhalt (Badge, Überschrift,
// Text, Buttons) konzentrieren kann. Reine Deko, deshalb aria-hidden auf dem
// Wurzelelement: Für Screenreader gibt es hier nichts vorzulesen.
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
import { useParallax } from '@/composables/useParallax'

// Der Hintergrund wandert beim Scrollen langsamer mit als der Text darüber
const auraRef = useParallax(0.28)
</script>

<template>
  <div class="hero-media" aria-hidden="true">
    <span ref="auraRef" class="hero-aura" />
    <span class="hero-grain" />
    <span class="hero-scrim" />
    <span class="hero-glow" />
    <span class="hero-grid" />
  </div>
</template>

<style scoped>
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

@media (max-width: 620px) {
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
}
</style>
