# Datenfluss

## Wofür ist das?

Zu verstehen, wie ein Text aus einer Datei auf den Bildschirm kommt. Wenn du
das einmal nachvollzogen hast, findest du jede Änderung von selbst.

## Beispiel 1: Ein Produkt erscheint im Shop

Du öffnest `#/shop`. Was passiert der Reihe nach:

```
1. router/index.js       Adresse "/shop" → lade ShopView.vue
                                  ↓
2. ShopView.vue          importiert PRODUCTS aus data/products.js
                                  ↓
3. data/products.js      importiert das Bild und gibt die Liste zurück
                                  ↓
4. ShopView.vue          v-for über PRODUCTS
                         → für jedes Produkt eine <ProductCard :product="…" />
                                  ↓
5. ProductCard.vue       bekommt das Produkt als "prop"
                         zeigt Name, Bild, Beschreibung, Preis
                                  ↓
6. formatPrice(20)       macht aus der Zahl 20 den Text "20,00 €"
```

**Sechs Schritte, aber jeder einzelne ist winzig.** Genau das ist der Trick.

### Wo würdest du was ändern?

| Du willst … | Datei |
|---|---|
| einen zweiten Artikel | `data/products.js` |
| den Preis ändern | `data/products.js` |
| „€" statt „EUR" | `data/products.js`, `formatPrice` |
| die Karte runder machen | `components/shop/ProductCard.vue` |
| die Überschrift der Seite | `views/ShopView.vue` |

## Beispiel 2: Das Klappmenü auf dem Handy

Hier fließen keine Daten, sondern **Zustand**. Du tippst auf ☰:

```
1. AppHeader.vue      @click="toggle"
                             ↓
2. useMobileNav.js    isOpen wird von false auf true gesetzt
                             ↓
3. Vue merkt: isOpen hat sich geändert
                             ↓
4. AppHeader.vue      v-if="isOpen" ist jetzt wahr → das Menü erscheint
                      Der Knopf zeigt jetzt ✕ statt ☰
                             ↓
5. useMobileNav.js    watch(isOpen) reagiert ebenfalls:
                      - body.style.overflow = 'hidden'  (Seite festhalten)
                      - Escape-Lauscher anhängen
```

Und beim Tippen auf „Shop":

```
6. RouterLink         wechselt die Adresse auf #/shop
                             ↓
7. useMobileNav.js    watch(route.fullPath) merkt den Wechsel → close()
                             ↓
8. isOpen = false     Menü verschwindet, Seite wieder scrollbar
```

Schritt 7 ist der, den man beim Selbstbauen vergisst. Deshalb steht er in
einem Composable und nicht in der Komponente: **Einmal richtig gelöst, gilt
für immer.**

## Beispiel 3: Ein Element blendet beim Scrollen ein

```
1. main.css            .reveal  → durchsichtig, 18px nach unten versetzt
                             ↓
2. HomeView.vue        ruft useScrollReveal() auf
                             ↓
3. useScrollReveal.js  sucht beim Laden alle .reveal-Elemente
                       und übergibt sie an einen IntersectionObserver
                             ↓
4. Du scrollst         Element kommt zu 15 % ins Bild
                             ↓
5. Der Observer meldet sich → Klasse "is-visible" wird angehängt
                             ↓
6. main.css            .is-visible → sichtbar, kein Versatz
                       Der Übergang dauert 0,6 s
                             ↓
7. useScrollReveal.js  unobserve() — dieses Element wird nicht mehr beobachtet
```

Beachte die Arbeitsteilung: **Das Composable hängt nur eine Klasse an. Wie das
dann aussieht, steht ausschließlich in CSS.** Das Composable kennt keine einzige
Farbe und keine einzige Zeitangabe für die Optik.

## 💡 Merken

**Vue reagiert von selbst.**

Du sagst nie „aktualisiere jetzt den Bildschirm". Du änderst einen Wert
(`isOpen = true`), und Vue zeichnet alles neu, was davon abhängt. Das ist der
größte Unterschied zu der Art, wie man es ohne Vue machen würde.

## ⚠ Vorsicht

Ein `prop` gehört der Komponente, die ihn **schickt** — nicht der, die ihn
bekommt. In `ProductCard.vue` `product.price = 25` zu schreiben, wäre falsch:
Vue warnt in der Konsole, und beim nächsten Neuzeichnen ist die Änderung
sowieso wieder weg.

Richtig: den Wert dort ändern, wo er herkommt (`data/products.js`).

## Siehe auch

- [10-Vue-Grundbegriffe](10-Vue-Grundbegriffe.md) — was „prop" und „ref" heißt
- [12-Composables-Uebersicht](12-Composables-Uebersicht.md)
