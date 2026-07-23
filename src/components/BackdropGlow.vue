<script setup>
// Der farbige Schimmer im Hintergrund der ganzen Seite.
//
// Zwei große, sehr weich auslaufende Farbflecken — einer pink, einer violett.
// Sie liegen hinter allem anderen und bewegen sich langsam, damit die Seite
// nicht wie eine gleichmäßig schwarze Fläche wirkt.
//
// WARUM EINE EIGENE KOMPONENTE UND NICHT EINFACH IM body?
// Am body ließe sich nur EIN Hintergrund sauber animieren, und der müsste sich
// mit dem Grundverlauf aus main.css das Feld teilen. Als eigenes Element kann
// jeder Fleck für sich animiert werden.
//
// WICHTIG: pointer-events: none (siehe unten). Ohne das läge eine unsichtbare
// Fläche über der ganzen Seite und würde jeden Klick abfangen — ein Fehler,
// der schwer zu finden ist, weil man ja nichts sieht.
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <span class="glow glow-pink" />
    <span class="glow glow-violet" />
    <span class="grain" />
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;

  /* Klicks gehen hindurch, statt hier hängen zu bleiben */
  pointer-events: none;

  /* Die Flecken sind größer als der Bildschirm — was übersteht, wird hier
     abgeschnitten, damit keine Bildlaufleisten entstehen. */
  overflow: hidden;
}

.glow {
  position: absolute;
  border-radius: 50%;

  /* Der große Weichzeichner macht aus dem harten Kreis einen weichen Schein */
  filter: blur(110px);
  opacity: 0.5;
}

.glow-pink {
  top: -180px;
  right: -120px;
  width: 520px;
  height: 520px;
  background: rgba(var(--accent-rgb), 0.5);

  animation: drift-a 22s ease-in-out infinite alternate;
}

.glow-violet {
  bottom: -220px;
  left: -160px;
  width: 560px;
  height: 560px;
  background: rgba(176, 38, 255, 0.4);

  animation: drift-b 26s ease-in-out infinite alternate;
}

/* Eine sehr feine Körnung über allem.
   Große Farbverläufe zeigen auf manchen Bildschirmen sichtbare Streifen
   ("Banding"). Ein Hauch Rauschen bricht diese Streifen auf. */
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.35;

  background-image: radial-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 3px 3px;
}

@keyframes drift-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-70px, 60px, 0) scale(1.12);
  }
}

@keyframes drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(80px, -50px, 0) scale(1.08);
  }
}
</style>
