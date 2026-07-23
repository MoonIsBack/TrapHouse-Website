<script setup>
// Die beiden Pixel-Figuren, die unten in den Ecken schweben.
//
// Sie stammen aus der alten Seite und bleiben als verspieltes Markenzeichen
// erhalten. Zwei Dinge wurden dabei repariert:
//
// 1. SEITEN VERTAUSCHT: In der alten style.css bekam ".corner-pixel.left" ein
//    "right: 10px" und umgekehrt — die linke Figur stand also rechts. Hier
//    heißt die Klasse, was sie tut.
//
// 2. AUF DEM HANDY IM WEG: Die Figuren lagen fest über dem Inhalt und
//    verdeckten auf schmalen Bildschirmen Text und Knöpfe. Unter 900 px
//    Breite werden sie deshalb ausgeblendet.
import pixelLeft from '@/assets/images/pixel-left.png'
import pixelRight from '@/assets/images/pixel-right.png'
</script>

<template>
  <!-- aria-hidden, weil die Figuren reine Dekoration sind: Ein Screenreader
       soll sie nicht vorlesen. Aus demselben Grund ist alt="" leer. -->
  <div class="pixel-corners" aria-hidden="true">
    <img :src="pixelLeft" alt="" class="pixel pixel-left" />
    <img :src="pixelRight" alt="" class="pixel pixel-right" />
  </div>
</template>

<style scoped>
.pixel-corners {
  pointer-events: none;
}

.pixel {
  position: fixed;
  bottom: 12px;
  z-index: 5;

  width: 62px;

  /* Die Vorlagen sind Pixelgrafiken. Ohne diese Zeile rechnet der Browser die
     Kanten weich und macht aus scharfen Pixeln einen Matsch. */
  image-rendering: pixelated;

  /* Etwas zurückgenommen, damit die Figuren Deko bleiben und nicht mit dem
     Inhalt um Aufmerksamkeit konkurrieren */
  opacity: 0.85;

  animation: float 3.4s ease-in-out infinite;
}

.pixel-left {
  left: 12px;
}

.pixel-right {
  right: 12px;

  /* Zeitversetzt, damit die beiden nicht im Gleichschritt wippen —
     das sieht sonst mechanisch aus. */
  animation-delay: -1.7s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Auf schmalen Bildschirmen ist schlicht kein Platz dafür */
@media (max-width: 900px) {
  .pixel {
    display: none;
  }
}
</style>
