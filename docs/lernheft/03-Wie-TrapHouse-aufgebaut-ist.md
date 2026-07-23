# ⭐ Wie TrapHouse aufgebaut ist

## Wofür ist das?

Das ist die wichtigste Seite im ganzen Heft. Wenn du **nur eine** liest, dann
diese.

## Die Grundidee in drei Sätzen

1. **`App.vue` ist der Rahmen.** Kopfbereich, Fußbereich, Hintergrund — das,
   was auf jeder Seite gleich ist.
2. **Der Router entscheidet, was dazwischen steht.** Je nach Adresse eine
   andere View.
3. **Die Inhalte stehen in `data/`.** Nicht im HTML verstreut.

## Bild im Kopf

```
                    data/  (Navigation, Socials, Produkte)
                      │
                      │ lesen daraus
                      ▼
        ┌─────────────────────────────┐
        │  App.vue                    │
        │  ┌───────────────────────┐  │
        │  │  AppHeader            │  │ ← liest NAV_LINKS
        │  ├───────────────────────┤  │
        │  │                       │  │
        │  │  <RouterView>         │  │ ← hier setzt der Router
        │  │    HomeView    oder   │  │   die passende View ein
        │  │    ShopView    oder   │  │
        │  │    DiscordView oder   │  │
        │  │    SocialsView        │  │
        │  │                       │  │
        │  ├───────────────────────┤  │
        │  │  AppFooter            │  │ ← liest NAV_LINKS + SOCIAL_LINKS
        │  └───────────────────────┘  │
        └─────────────────────────────┘
```

## Die eine Regel, die überall gilt

**Daten fließen nach unten. Komponenten entscheiden nichts selbst.**

- `HomeView.vue` holt sich `PRODUCTS` aus `data/products.js`
- Sie gibt jedes Produkt einzeln an eine `ProductCard` weiter (`:product="…"`)
- `ProductCard` **zeigt es nur an** — sie ändert nichts und weiß nicht, woher
  es kommt

Das ist dieselbe Regel wie in RankRoom.

### Beispiel: Der Discord-Link

Du willst den Einladungslink ändern. Was passiert:

1. Du trägst ihn **einmal** in `data/socialLinks.js` bei `DISCORD_INVITE` ein
2. `AppHeader.vue` liest ihn → der Knopf oben rechts stimmt
3. `HeroSection.vue` liest ihn → der Knopf im Hero stimmt
4. `DiscordCta.vue` liest ihn → der große Aufruf stimmt

**Eine Änderung, vier Stellen richtig.**

In der alten Seite stand an jeder dieser Stellen ein eigenes `href="#"`. Man
hätte drei davon ändern und die vierte vergessen — und es hätte niemand
gemerkt, bis sich jemand beschwert.

## Warum ist das so gebaut?

Weil du dann bei einem Fehler **weißt, wo du suchen musst**:

| Problem | Suchen in |
|---|---|
| Falsche Farbe, falscher Abstand | `assets/main.css` |
| Text stimmt nicht | `data/` — oder in der View |
| Link geht ins Leere | `data/socialLinks.js` |
| Falsche Seite bei einer Adresse | `router/index.js` |
| Menü klappt nicht | `composables/useMobileNav.js` |
| Kopfbereich sieht falsch aus | `components/AppHeader.vue` |
| Nur der Shop sieht falsch aus | `components/shop/` |
| **Alles** sieht falsch aus | `assets/main.css` |

Diese Tabelle ist der eigentliche Nutzen der ganzen Ordnerstruktur.

## Was ist eine „View" und was eine „Component"?

- **View** = eine ganze Seite, hat eine eigene Adresse
- **Component** = ein Teil davon, hat keine

`ShopView.vue` ist kurz (60 Zeilen), weil sie fast nichts selbst macht: Sie
holt die Produkte und lässt `ProductCard` sie zeichnen. Genau so soll es sein.

## 💡 Merken

**Views stellen zusammen. Components zeigen an. `data/` weiß Bescheid.**

Wenn du in einer Component anfängst, Text hinzuschreiben, der eigentlich ein
Inhalt ist — halt kurz inne. Der gehört wahrscheinlich nach `data/`.

## ⚠ Vorsicht

Die Versuchung ist groß, „schnell mal" einen Link direkt ins Template zu
schreiben, statt ihn in `data/` zu ergänzen. Beim ersten Mal spart das
30 Sekunden. Beim vierten Mal hast du vier Stellen, die auseinanderlaufen —
und du findest nie alle wieder.

## Siehe auch

- [04-Datenfluss](04-Datenfluss.md) — dasselbe, aber ausführlicher
- [11-Komponenten-Uebersicht](11-Komponenten-Uebersicht.md) — jede Datei einzeln
