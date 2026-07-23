<script setup>
// Das durchlaufende Textband zwischen zwei Bereichen.
//
// Es trennt Abschnitte voneinander und bringt Bewegung auf eine Seite, die
// sonst aus lauter ruhigen Kästen besteht — und passt zur Musik-Ästhetik,
// bei der Laufschriften seit jeher zum Bild gehören.
defineProps({
  // Die Wörter, die durchlaufen sollen
  words: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <!-- aria-hidden: Der Inhalt steht gleich doppelt im HTML (siehe unten) und
       hat keinen Informationswert, den es nicht anderswo schon gäbe. Ein
       Screenreader würde sonst dieselbe Wortkette zweimal vorlesen. -->
  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <!-- DER TRICK MIT DEM DOPPELTEN INHALT
           Die Wortliste steht ZWEIMAL hintereinander im HTML. Die Animation
           schiebt das Band genau um seine halbe Breite nach links — also
           exakt um eine komplette Wortliste.

           In dem Moment, in dem die erste Liste links hinausgeschoben ist,
           steht die zweite genau da, wo die erste angefangen hat. Der Sprung
           zurück auf Null ist deshalb unsichtbar, und es sieht aus, als liefe
           das Band endlos.

           Ohne die Verdopplung entstünde am Ende eine Lücke, bevor es von
           vorn beginnt. -->
      <div v-for="durchgang in 2" :key="durchgang" class="marquee-group">
        <span v-for="word in words" :key="word" class="marquee-word">
          {{ word }}
          <span class="marquee-dot">◆</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  position: relative;
  overflow: hidden;

  padding: 18px 0;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);

  background: rgba(var(--accent-rgb), 0.06);

  /* Blendet den Text an beiden Rändern weich aus, statt ihn hart
     abzuschneiden. Ohne das wirkt es, als würden Wörter an einer Kante
     zerschnitten. */
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;

  animation: marquee-scroll 34s linear infinite;
}

/* Beim Darüberfahren anhalten — praktisch, wenn jemand mitlesen will */
.marquee:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-group {
  display: flex;
  flex-shrink: 0;
}

.marquee-word {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  padding-right: 22px;

  font-family: 'Anton', sans-serif;
  font-size: clamp(1.1rem, 2.4vw, 1.6rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;

  color: var(--text-muted);
}

.marquee-dot {
  color: var(--accent);
  font-size: 0.55em;
}

@keyframes marquee-scroll {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    /* Exakt die halbe Bandbreite = eine komplette Wortliste */
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
