<script setup>
// Eine einzelne Artikel-Karte im Shop.
//
// Sie zeigt nur an und entscheidet nichts: Ob ein Artikel bestellbar ist,
// steht als "status" in data/products.js. Diese Komponente liest den Wert und
// stellt ihn dar — mehr nicht. (Dasselbe Prinzip wie in RankRoom: Daten
// fließen nach unten, die Komponente hält keinen eigenen Zustand.)
import { computed } from 'vue'

import { formatPrice } from '@/data/products'
import IconHeart from '@/components/icons/IconHeart.vue'
import IconCart from '@/components/icons/IconCart.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const isAvailable = computed(() => props.product.status === 'verfuegbar')
</script>

<template>
  <article class="product-card reveal">
    <div class="product-image">
      <img :src="product.image" :alt="product.imageAlt" loading="lazy" width="900" height="1350" />

      <span v-if="!isAvailable" class="product-badge">Demnächst</span>
    </div>

    <div class="product-body">
      <h3>{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <div class="product-footer">
        <span class="product-price">{{ formatPrice(product.price) }}</span>

        <div class="product-actions">
          <!-- :disabled statt die Knöpfe zu verstecken: So sieht man, dass es
               den Shop geben wird, und der Platz springt später nicht um.
               Ein deaktivierter Knopf wird von Screenreadern zudem als
               "nicht verfügbar" angekündigt. -->
          <button
            type="button"
            class="icon-button"
            :disabled="!isAvailable"
            aria-label="Auf die Merkliste"
          >
            <IconHeart />
          </button>

          <button
            type="button"
            class="icon-button"
            :disabled="!isAvailable"
            aria-label="In den Warenkorb"
          >
            <IconCart />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);

  background: var(--surface);
  box-shadow: var(--shadow-card);

  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: rgba(var(--accent-rgb), 0.42);
  box-shadow: var(--shadow-lifted);
}

.product-image {
  position: relative;
  overflow: hidden;

  /* Feste Bildform, damit mehrere Karten nebeneinander gleich hoch beginnen,
     auch wenn die Fotos unterschiedliche Maße haben */
  aspect-ratio: 4 / 5;
  background: rgba(0, 0, 0, 0.25);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.04);
}

.product-badge {
  position: absolute;
  top: 14px;
  left: 14px;

  padding: 6px 13px;
  border-radius: var(--radius-pill);

  background: var(--accent-gradient);
  color: #fff;

  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.product-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;

  padding: 22px;
}

h3 {
  font-size: 1.35rem;
}

.product-description {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  /* Schiebt sich nach unten, damit der Preis bei allen Karten auf einer
     Linie sitzt — auch wenn die Beschreibungen unterschiedlich lang sind */
  margin-top: auto;
  padding-top: 14px;
}

.product-price {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  color: var(--text);
}

.product-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);

  background: var(--surface);
  color: var(--text-secondary);
  font-size: 1.15rem;

  transition:
    color var(--transition),
    border-color var(--transition),
    background var(--transition);
}

.icon-button:hover:not(:disabled) {
  border-color: rgba(var(--accent-rgb), 0.6);
  background: rgba(var(--accent-rgb), 0.14);
  color: var(--accent-strong);
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
