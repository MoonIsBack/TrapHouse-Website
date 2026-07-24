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

/* ⭐ WARUM HIER EIN FARBVERLAUF STEHT UND KEIN filter: blur()
   ============================================================
   Ursprünglich war jeder Fleck ein harter Kreis mit filter: blur(110px).
   Das sah richtig aus, war aber der teuerste Fehler auf der ganzen Seite.

   Ein Filter zwingt den Browser, das Element zuerst zu zeichnen und das
   Ergebnis anschließend Pixel für Pixel weichzurechnen. Solange sich nichts
   bewegt, passiert das einmal. Diese Flecken bewegen sich aber dauerhaft —
   und die Animation enthielt zusätzlich ein scale(). Eine verschobene Ebene
   kann der Browser einfach woanders hinschieben; eine SKALIERTE muss er neu
   berechnen, sonst würde sie unscharf. Also wurde der Weichzeichner bei jedem
   einzelnen Bild neu gerechnet. Endlos. Auf jeder Seite.

   Safari erledigt das auf dem Hauptprozess — demselben, der Mausklicks
   entgegennimmt. Gemessen auf einem MacBook: Klicks kamen mit 210 bis 270 ms
   Verspätung im Code an, weil Safari sie stapelte, während es rechnete. Die
   Navigation fühlte sich dadurch sekundenlang tot an. Chrome verlagert
   Weichzeichner auf die Grafikkarte, dort fiel es nie auf.

   Ein radial-gradient ist bereits weich — er muss nirgends nachbearbeitet
   werden. Für den Browser ist das ein simpler Malvorgang, das Ergebnis wird
   einmal gerastert und danach nur noch verschoben.

   ⚠ Merksatz fürs nächste Mal: filter: blur() ist in Ordnung, solange sich
   das Element NICHT bewegt. Sobald Animation oder Scrollen dazukommen, gehört
   die Weichheit in den Farbverlauf statt in einen Filter. */
.glow {
  position: absolute;
  opacity: 0.5;
}

/* Die Elemente sind deutlich größer als die früheren Kreise: Der Weichzeichner
   hat den Schein weit über die Kreisfläche hinausgetragen, und diesen Raum
   braucht der Farbverlauf jetzt selbst. Die Position ist so gewählt, dass die
   Mitte des Scheins dort bleibt, wo sie vorher war. */
.glow-pink {
  top: -520px;
  right: -460px;
  width: 1200px;
  height: 1200px;

  background: radial-gradient(
    circle closest-side,
    rgba(var(--accent-rgb), 0.5) 0%,
    rgba(var(--accent-rgb), 0.4) 20%,
    rgba(var(--accent-rgb), 0.18) 40%,
    rgba(var(--accent-rgb), 0.05) 60%,
    transparent 76%
  );

  animation: drift-a 22s ease-in-out infinite alternate;
}

.glow-violet {
  bottom: -540px;
  left: -480px;
  width: 1200px;
  height: 1200px;

  background: radial-gradient(
    circle closest-side,
    rgba(176, 38, 255, 0.4) 0%,
    rgba(176, 38, 255, 0.32) 20%,
    rgba(176, 38, 255, 0.15) 40%,
    rgba(176, 38, 255, 0.04) 60%,
    transparent 76%
  );

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
