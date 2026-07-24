# ⭐ Inhalte ändern

## Wofür ist das?

Vollständige Beispiele zum Abschreiben. Kein Vorwissen nötig.

## Den Discord-Link eintragen

**Die wichtigste offene Stelle im Projekt.** Solange hier `'#'` steht, führen
alle Discord-Knöpfe ins Leere.

`src/data/socialLinks.js`, ganz unten:

```js
export const DISCORD_INVITE = 'https://discord.gg/deinCode'
```

Speichern — fertig. Damit stimmen auf einen Schlag:

- der Knopf oben rechts im Kopfbereich
- der Knopf im Hero
- der große Aufruf auf der Startseite
- derselbe Aufruf auf der Discord-Seite

⚠ Nimm einen **dauerhaften** Einladungslink. Discord-Einladungen laufen
standardmäßig nach 7 Tagen ab. Beim Erstellen unter „Einladung bearbeiten" auf
„Nie" stellen.

## Einen Artikel hinzufügen

**1.** Bild nach `src/assets/images/` legen, z. B. `hoodie.webp`

**2.** In `src/data/products.js` oben importieren:

```js
import shirtImage from '@/assets/images/shirt.webp'
import hoodieImage from '@/assets/images/hoodie.webp'   // ← neu
```

**3.** Einen Eintrag ergänzen:

```js
export const PRODUCTS = [
  {
    id: 'traphouse-shirt',
    // … der bestehende Eintrag …
  },
  {
    id: 'traphouse-hoodie',
    name: 'TrapHouse Hoodie',
    price: 45,
    image: hoodieImage,
    imageAlt: 'Schwarzer TrapHouse Hoodie mit weißem Logo auf der Brust',
    description: 'Schwerer Hoodie mit Kängurutasche. Unisex, S bis XXL.',
    status: 'bald',
  },
]
```

Fertig — der Artikel erscheint automatisch auf der Startseite **und** im Shop.

⚠ `id` muss eindeutig sein. Vue benutzt sie als `:key`, um Karten
auseinanderzuhalten. Zwei gleiche `id`s führen zu merkwürdigen Fehlern beim
Neuzeichnen.

## Einen Preis ändern

```js
price: 25,     // ← nur die Zahl, ohne "€" und ohne Anführungszeichen
```

Das Euro-Zeichen und das Komma kommen aus `formatPrice()`. Aus `25` wird
automatisch `25,00 €`.

## Den Shop wirklich öffnen

```js
status: 'verfuegbar',
```

Damit verschwindet das „Demnächst"-Schild und die Knöpfe werden aktiv.

⚠ **Sie tun dann aber noch nichts.** Es gibt keinen Warenkorb dahinter. Siehe
[40-Was-noch-fehlt](40-Was-noch-fehlt.md), bevor du das umstellst.

## Einen Social-Kanal ändern

`src/data/socialLinks.js`:

```js
{
  id: 'instagram',
  label: 'Instagram',
  handle: '@traphouse.offiziell',            // ← wird angezeigt
  url: 'https://www.instagram.com/…',        // ← wohin es geht
  brand: '#e1306c',                          // ← Farbe beim Darüberfahren
  description: 'Fotos, Stories und …',
},
```

### Einen ganz neuen Kanal ergänzen

**1.** Icon anlegen: `src/components/icons/IconSpotify.vue` — schau dir
`IconYouTube.vue` als Vorlage an

**2.** Eintrag in `SOCIAL_LINKS` ergänzen

**3.** Das Icon an **zwei** Stellen bekannt machen — in `AppFooter.vue` und in
`socials/SocialCard.vue`:

```js
const SOCIAL_ICONS = {
  youtube: IconYouTube,
  tiktok: IconTikTok,
  instagram: IconInstagram,
  spotify: IconSpotify,   // ← neu, Schlüssel = die id
}
```

⚠ Vergisst du Schritt 3, bleibt die Stelle einfach leer — ohne Fehlermeldung.

## Die Überschrift einer Seite ändern

In der passenden Datei unter `src/views/`:

```vue
<SectionHeader
  eyebrow="Shop"
  title="TrapHouse Merch"
  text="Alles in kleiner Auflage und selbst ausgesucht."
/>
```

| Angabe | Was es ist |
|---|---|
| `eyebrow` | Das kleine farbige Label darüber |
| `title` | Die große Überschrift |
| `text` | Der Absatz darunter |

## Den Hero-Text ändern

`src/components/home/HeroSection.vue`:

```vue
<h1 class="reveal reveal-delay-1">
  Willkommen bei
  <span class="hero-accent">TrapHouse</span>
</h1>
```

Der Teil in `<span class="hero-accent">` bekommt den Orange-Verlauf.

## Die Punkte auf der Discord-Seite ändern

`src/views/DiscordView.vue`, die Liste `FEATURES`:

```js
const FEATURES = [
  {
    title: 'Feedback zu deinen Tracks',
    text: 'Lad hoch, woran du arbeitest, …',
  },
  // weitere Einträge …
]
```

Das Raster ordnet sich automatisch um — egal ob drei, vier oder sechs Punkte.

## Umlaute und Sonderzeichen

Im Template gehört `&amp;` statt `&`:

```vue
<p>Artists &amp; Producer</p>
```

Umlaute (ä, ö, ü, ß) kannst du direkt schreiben — die Datei ist UTF-8.

## 💡 Merken

**Erst in `data/` schauen. Steht es dort nicht, steht es in der View.**

## ⚠ Vorsicht

Nach jeder Änderung kurz im Browser prüfen. `npm run dev` läuft ja mit und
aktualisiert von allein — und ein vergessenes Komma in einer Liste macht die
ganze Seite weiß.

Passiert das: F12 → Console. Dort steht die Zeilennummer.

## Siehe auch

- [05-Dateien-die-ich-haeufig-aendere](05-Dateien-die-ich-haeufig-aendere.md)
- [14-Router-und-Unterseiten](14-Router-und-Unterseiten.md) — eine ganz neue Seite anlegen
