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

      <span v-if="!isAvailable" class="product-badge">Coming Soon</span>
    </div>

    <div class="product-body">
      <h3>{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <!-- PREIS UND KAUFKNÖPFE — nur bei 'verfuegbar'
           Solange der Artikel eine Ankündigung ist, erscheint hier weder ein
           Preis noch ein Kaufknopf. Beides wird bewusst ganz weggelassen und
           nicht nur ausgegraut: Ein deaktivierter Warenkorb-Knopf sieht immer
           noch nach Shop aus, und genau das soll die Karte nicht.
           Warum das mehr als Optik ist, steht in data/products.js. -->
      <div v-if="isAvailable" class="product-footer">
        <span class="product-price">{{ formatPrice(product.price) }}</span>

        <div class="product-actions">
          <button type="button" class="icon-button" aria-label="Auf die Merkliste">
            <IconHeart />
          </button>

          <button type="button" class="icon-button" aria-label="In den Warenkorb">
            <IconCart />
          </button>
        </div>
      </div>

      <!-- Steht an derselben Stelle wie sonst der Preis, damit die Karte nicht
           unten ausfranst -->
      <p v-else class="product-soon">Kommt bald</p>
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

/* Steht anstelle des Preises, solange der Artikel nur angekündigt ist.
   margin-top: auto wie beim .product-footer, damit die Zeile auch hier unten
   an der Karte klebt und mehrere Karten gleich hoch abschließen. */
.product-soon {
  margin-top: auto;
  padding-top: 14px;

  color: var(--accent-strong);
  font-size: 0.86rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
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

.icon-button:hover {
  border-color: rgba(var(--accent-rgb), 0.6);
  background: rgba(var(--accent-rgb), 0.14);
  color: var(--accent-strong);
}
</style>
