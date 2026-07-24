# Router und Unterseiten

## Wofür ist das?

Zu verstehen, warum in der Adresse eine `#` steht — und wie du eine neue
Unterseite anlegst.

## Was macht der Router?

Er ordnet **Adressen** den **Ansichten** zu:

| Adresse | Ansicht |
|---|---|
| `#/` | `HomeView.vue` |
| `#/shop` | `ShopView.vue` |
| `#/discord` | `DiscordView.vue` |
| `#/socials` | `SocialsView.vue` |
| `#/impressum` | `ImprintView.vue` |
| `#/datenschutz` | `PrivacyView.vue` |
| alles andere | `NotFoundView.vue` |

⚠ Die beiden Rechtsseiten gibt es nur, solange `showLegalPages` in
`config/legalConfig.js` wahr ist. Siehe [22-Rechtsseiten](22-Rechtsseiten.md).

In `App.vue` steht die Stelle, an der die jeweilige Ansicht eingesetzt wird:

```vue
<RouterView v-slot="{ Component, route }">
  <div :key="route.name" class="page-anim">
    <component :is="Component" />
  </div>
</RouterView>
```

Der `:key` sorgt dafür, dass Vue beim Seitenwechsel wirklich neu aufbaut statt
die alte Ansicht weiterzuverwenden — dadurch läuft die Einblend-Animation
(`.page-anim` in `main.css`) jedes Mal neu an.

## ⭐ Warum die `#` in der Adresse?

Es gibt zwei Möglichkeiten:

```
createWebHistory      → traphouse.de/shop        (schöner)
createWebHashHistory  → traphouse.de/#/shop      (funktioniert überall)
```

Die erste braucht einen Server, der bei **jeder** Adresse dieselbe `index.html`
ausliefert.

**GitHub Pages tut das nicht.** Ruft jemand direkt `/shop` auf oder lädt die
Seite dort neu, sucht GitHub nach einer Datei namens „shop", findet keine und
zeigt seinen eigenen 404-Fehler. Die Vue-App startet gar nicht erst.

Man kann das mit einer nachgebauten `404.html` umgehen, die per Skript
zurückleitet. Das ist aber ein Trick: Er blitzt beim Laden kurz auf und geht
bei jedem Umzug wieder kaputt.

Alles nach der `#` bekommt der Server **gar nicht erst zu sehen** — das wertet
nur der Browser aus. Deshalb braucht die `#`-Variante keinerlei
Server-Einstellung.

> RankRoom verlinkt seine Rechtsseiten aus demselben Grund schon mit `#/…`.

### Wenn du das später ändern willst

Zieht TrapHouse auf einen eigenen Hoster mit passender Umleitung um, ist der
Wechsel **eine Zeile** in `router/index.js`:

```js
history: createWebHistory(),   // statt createWebHashHistory()
```

## Eine neue Unterseite anlegen

Drei Schritte. Beispiel: eine Seite „Über uns".

### 1. Die Ansicht erstellen

`src/views/AboutView.vue`:

```vue
<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader.vue'

useScrollReveal()
</script>

<template>
  <section class="section">
    <div class="container">
      <SectionHeader eyebrow="Über uns" title="Wer wir sind" text="…" />
    </div>
  </section>
</template>
```

⚠ Das Gerüst `<section class="section"><div class="container">` ist wichtig:
`section` gibt den Abstand nach oben und unten, `container` die gemeinsame
Breite. Ohne beides klebt der Inhalt am Rand.

### 2. Die Route eintragen

In `src/router/index.js`, **vor** der `not-found`-Route. Die View wird oben in
der Datei importiert und hier eingetragen:

```js
import AboutView from '@/views/AboutView.vue'   // ganz oben bei den anderen

{
  path: '/about',
  name: 'about',
  component: AboutView,
},
```

⚠ Die `not-found`-Route muss **immer die letzte** bleiben. Sie passt auf alles
— steht sie weiter oben, fängt sie alle darunter stehenden Routen ab.

### 3. In die Navigation aufnehmen

In `src/data/navigation.js`:

```js
export const NAV_LINKS = [
  { name: 'home', label: 'Home' },
  { name: 'shop', label: 'Shop' },
  { name: 'about', label: 'Über uns' },   // ← neu
  …
]
```

Der `name` muss **exakt** dem `name` der Route entsprechen. Kopf- und
Fußbereich lesen dieselbe Liste — beide haben den Eintrag damit automatisch.

## Was ist „lazy loading" — und warum benutzt TrapHouse es nicht?

Es gibt zwei Arten, eine View einzubinden:

```js
component: () => import('@/views/ShopView.vue')   // wird erst bei Bedarf geladen
component: ShopView                                // ist sofort da
```

Die Pfeil-Schreibweise heißt „lazy loading": Der Code einer Seite wird erst
heruntergeladen, wenn jemand sie aufruft.

**Hier sind bewusst alle Views direkt importiert.** Der Grund: Die Unterseiten
sind winzig (ein paar Kilobyte Text), aber das Nachladen kostet trotzdem eine
Netzwerkanfrage. Man merkte das als kurzes Stocken beim **ersten** Klick auf
einen Menüpunkt — und ausgerechnet der erste Klick ist der, bei dem jemand
entscheidet, ob sich die Seite schnell anfühlt.

⚠ Das ist eine Abwägung, keine Regel: Käme irgendwann eine große Unterseite
dazu (etwa eine mit Diagrammen oder einer Bibliothek), gehört **die** wieder
nachgeladen. Die Faustregel: Kleine Textseiten direkt, alles Schwere lazy.

## `scrollBehavior` — und der Safari-Sonderfall

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return jumpToTopImmediately()
}
```

Drei Fälle:

1. **Zurück-Knopf** → alte Position wiederherstellen
2. **Anker in der Adresse** → dorthin scrollen
3. **Sonst** → nach oben

Ohne Fall 3 landet man auf der neuen Seite an derselben Scroll-Position wie
vorher — es fühlt sich an, als wäre nichts passiert.

### ⭐ Warum Fall 3 eine eigene Funktion braucht

In `main.css` steht eine Regel, die für die ganze Seite gilt:

```css
html { scroll-behavior: smooth; }
```

Die ist für Ankersprünge gedacht. Beim **Seitenwechsel** ist sie aber im Weg:
Safari scrollt dann die komplette Seitenhöhe sanft nach oben, was sich wie eine
Ladeverzögerung anfühlt. Andere Browser kennen dafür `behavior: 'instant'` —
Safari setzt das nicht zuverlässig um.

`jumpToTopImmediately()` löst das ohne Sonderbehandlung pro Browser: Es hängt
für **zwei Bilder** die Klasse `is-route-jump` an das `<html>`-Element, und die
schaltet das sanfte Scrollen kurz ab.

```css
html.is-route-jump { scroll-behavior: auto; }
```

Danach verschwindet die Klasse wieder, und Ankersprünge sind weiterhin sanft.

⚠ Wenn du das Kapitel-Scrollen oder eine andere Scroll-Spielerei einbaust:
Diese Klasse ist bewusst **kurzlebig**. Bleibt sie hängen, ist das sanfte
Scrollen auf der ganzen Seite dauerhaft aus.

## Sofortreaktion der Menüpunkte in Safari

Noch ein Safari-Detail, das in `components/ui/NavLink.vue` sitzt:

Solange das Mac-Touchpad nach dem Scrollen noch „nachläuft", verzögert Safari
den normalen Klick auf einen Link im festen Kopfbereich. Man klickt auf
„Merch", und für einen Moment passiert nichts.

Deshalb kann ein `NavLink` die Route schon beim **Aufsetzen** der Maustaste
starten:

```vue
<NavLink :link="link" navigate-on-pointer-down />
```

⚠ Diese Angabe steht **ausschließlich** an der Desktop-Leiste in
`AppHeader.vue`. Nicht ans Klappmenü und nicht in den Fußbereich hängen:

- Das Klappmenü hat das Problem gar nicht (es wird vorher geöffnet)
- Auf einem Touchscreen würde schon das Aufsetzen des Fingers navigieren —
  deshalb prüft `NavLink` zusätzlich, ob wirklich eine Maus im Spiel ist
- Externe Links (RankRoom) sind ausgenommen, sonst ginge der neue Tab kaputt
- Cmd-, Ctrl-, Shift- und Alt-Klick sind ausgenommen, damit „in neuem Tab
  öffnen" weiter funktioniert

## 💡 Merken

**Eine neue Seite braucht immer drei Dinge:** View, Route, Navigationseintrag.
Fehlt eins, klemmt es.

## Siehe auch

- [02-Ordnerstruktur](02-Ordnerstruktur.md) — View oder Component?
- [15-Scrollverhalten](15-Scrollverhalten.md) — das Scrollen *innerhalb* der Startseite
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md)
