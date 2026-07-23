<script setup>
// Die Zentrale: setzt den immer gleichen Rahmen (Kopfbereich, Fußbereich,
// Hintergrund-Deko) und lässt dazwischen den Router die jeweilige Seite
// einsetzen.
//
// Nach demselben Prinzip wie RankRoom: App.vue hält den Rahmen zusammen,
// die einzelnen Bausteine kümmern sich nur um ihre eigene Darstellung.
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BackdropGlow from '@/components/BackdropGlow.vue'
import PixelCorners from '@/components/PixelCorners.vue'
</script>

<template>
  <!-- Sprungmarke für Tastatur- und Screenreader-Nutzung: Wer mit Tab auf die
       Seite kommt, kann die komplette Navigation mit einem Tastendruck
       überspringen, statt sich auf jeder Unterseite neu durchzuhangeln. -->
  <a class="skip-link" href="#inhalt">Zum Inhalt springen</a>

  <BackdropGlow />

  <AppHeader />

  <main id="inhalt">
    <!-- Hier setzt der Router die Seite ein, die zur Adresse passt.
         Der :key sorgt dafür, dass Vue beim Seitenwechsel wirklich neu
         aufbaut — sonst würden Animationen beim zweiten Besuch nicht
         noch einmal laufen. -->
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.name" />
    </RouterView>
  </main>

  <AppFooter />

  <PixelCorners />
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 200;

  /* Standardmäßig aus dem Bild geschoben, aber nicht display:none — sonst
     wäre er auch per Tastatur nicht erreichbar. */
  transform: translateY(-200%);

  padding: 10px 18px;
  border-radius: var(--radius-pill);

  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;

  transition: transform var(--transition);
}

.skip-link:focus-visible {
  transform: none;
}

main {
  /* Der Kopfbereich schwebt über dem Inhalt — ohne diesen Abstand läge die
     erste Überschrift darunter. */
  padding-top: var(--header-height);

  /* Damit der Fußbereich auch auf sehr kurzen Seiten (z. B. 404) unten sitzt */
  min-height: calc(100vh - var(--header-height));
}
</style>
