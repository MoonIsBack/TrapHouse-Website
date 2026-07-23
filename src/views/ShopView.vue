<script setup>
// Die Shop-Seite.
//
// Zeigt alle Artikel aus data/products.js. Es gibt bewusst noch keinen
// Bestellvorgang: Solange nichts wirklich verkauft wird, wäre ein Warenkorb
// nur eine Attrappe — und eine Attrappe, die Daten annimmt, wirft sofort
// rechtliche Fragen auf (Widerrufsrecht, AGB, Zahlungsdienstleister).
import { PRODUCTS } from '@/data/products'
import { useScrollReveal } from '@/composables/useScrollReveal'

import SectionHeader from '@/components/ui/SectionHeader.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

useScrollReveal()
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeader
        eyebrow="Shop"
        title="TrapHouse Merch"
        text="Alles in kleiner Auflage und selbst ausgesucht. Der Verkauf startet, sobald die erste Charge da ist."
      />

      <div class="card-grid">
        <ProductCard v-for="product in PRODUCTS" :key="product.id" :product="product" />
      </div>

      <p class="shop-note reveal">
        Fragen zu Größen oder Versand? Schreib uns auf
        <RouterLink :to="{ name: 'discord' }">Discord</RouterLink> oder per DM auf Instagram.
      </p>
    </div>
  </section>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.shop-note {
  margin-top: 44px;
  padding-top: 26px;
  border-top: 1px solid var(--border-soft);

  color: var(--text-muted);
  font-size: 0.92rem;
}

.shop-note a {
  color: var(--accent-strong);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
