<script setup>
// Wird angezeigt, wenn jemand eine Adresse aufruft, die es nicht gibt.
//
// Ohne diese Seite bliebe der Inhaltsbereich bei einem Tippfehler in der
// Adresse einfach leer — und wer davorsitzt, hält die Seite für kaputt.
import BaseButton from '@/components/ui/BaseButton.vue'
import IconArrowRight from '@/components/icons/IconArrowRight.vue'
</script>

<template>
  <section class="section not-found">
    <div class="container">
      <p class="code">404</p>
      <h1>Hier ist nichts</h1>
      <p class="text">
        Diese Seite gibt es nicht (mehr). Vielleicht hat sich ein Tippfehler in die Adresse
        geschlichen.
      </p>

      <BaseButton :to="{ name: 'home' }" variant="primary">
        Zurück zur Startseite
        <IconArrowRight />
      </BaseButton>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.code {
  font-family: 'Anton', sans-serif;
  font-size: clamp(4rem, 16vw, 9rem);
  line-height: 1;

  background: var(--accent-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

h1 {
  margin-top: 8px;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
}

.text {
  max-width: 46ch;
  margin: 16px auto 32px;
  color: var(--text-secondary);
}
</style>
