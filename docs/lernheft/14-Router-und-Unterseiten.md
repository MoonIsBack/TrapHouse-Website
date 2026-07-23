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
| alles andere | `NotFoundView.vue` |

In `App.vue` steht die Stelle, an der die jeweilige Ansicht eingesetzt wird:

```vue
<RouterView v-slot="{ Component, route }">
  <component :is="Component" :key="route.name" />
</RouterView>
```

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

In `src/router/index.js`, **vor** der `not-found`-Route:

```js
{
  path: '/about',
  name: 'about',
  component: () => import('@/views/AboutView.vue'),
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

## Was ist „lazy loading"?

```js
component: () => import('@/views/ShopView.vue')   // wird nachgeladen
component: HomeView                                // ist sofort da
```

Die Pfeil-Schreibweise sorgt dafür, dass der Code dieser Seite erst geladen
wird, wenn jemand sie aufruft. Wer nur die Startseite anschaut, lädt den
Shop-Code gar nicht erst herunter.

`HomeView` ist bewusst **nicht** so eingebunden: Sie ist die erste, die jeder
sieht — sie soll ohne Umweg da sein.

## `scrollBehavior`

```js
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return { top: 0 }
}
```

Drei Fälle:

1. **Zurück-Knopf** → alte Position wiederherstellen
2. **Anker in der Adresse** → dorthin scrollen
3. **Sonst** → nach oben

Ohne Fall 3 landet man auf der neuen Seite an derselben Scroll-Position wie
vorher — es fühlt sich an, als wäre nichts passiert.

## 💡 Merken

**Eine neue Seite braucht immer drei Dinge:** View, Route, Navigationseintrag.
Fehlt eins, klemmt es.

## Siehe auch

- [02-Ordnerstruktur](02-Ordnerstruktur.md) — View oder Component?
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md)
