# ⭐ Dateien, die ich häufig ändere

## Wofür ist das?

Die Abkürzung für den Alltag. 90 % aller Änderungen betreffen genau diese
sechs Dateien.

## Die Top 6

### 1. `src/data/socialLinks.js` — Links und Kanäle

Hier steht der **Discord-Einladungslink** und jeder Social-Kanal.

```js
export const DISCORD_INVITE = '#'   // ← hier deinen echten Link eintragen
```

⚠ Solange hier `'#'` steht, führen **alle** Discord-Knöpfe ins Leere.
Das ist die wichtigste offene Stelle im ganzen Projekt.

Einen Kanal ergänzen: Eintrag in `SOCIAL_LINKS` hinzufügen, dann in
`AppFooter.vue` und `SocialCard.vue` das passende Icon in `SOCIAL_ICONS`
eintragen.

### 2. `src/data/products.js` — Shop-Artikel

Name, Preis, Beschreibung, Bild und der Status.

```js
status: 'bald'        // Knöpfe sind grau, Badge "Demnächst"
status: 'verfuegbar'  // Knöpfe sind aktiv
```

⚠ `'verfuegbar'` schaltet die Knöpfe nur **optisch** frei — es gibt noch
keinen Warenkorb dahinter. Siehe [40-Was-noch-fehlt](40-Was-noch-fehlt.md).

### 3. `src/assets/main.css` — Farben und Abstände

Alles zwischen `:root {` und der schließenden Klammer.

```css
--accent: #ff2f92;        /* Ändere das, und die ganze Seite ändert sich */
--content-width: 1120px;  /* Wie breit der Inhalt maximal wird */
```

### 4. `src/views/*.vue` — die Texte der Seiten

Überschriften und Einleitungen stehen direkt im `<SectionHeader …>`:

```vue
<SectionHeader
  eyebrow="Shop"
  title="TrapHouse Merch"
  text="Alles in kleiner Auflage …"
/>
```

### 5. `src/components/home/HeroSection.vue` — der erste Eindruck

Die große Überschrift, der Untertitel und die beiden Knöpfe ganz oben.

### 6. `src/data/navigation.js` — die Menüpunkte

⚠ Ein Eintrag hier reicht **nicht**. Zu jedem Menüpunkt gehören immer drei
Dinge:

1. Eine Route in `router/index.js`
2. Eine View in `views/`
3. Der Eintrag hier

Fehlt eins davon, bricht die Navigation.

## Häufige Aufgaben auf einen Blick

| Ich will … | Datei |
|---|---|
| Discord-Link eintragen | `data/socialLinks.js` |
| Instagram-Namen ändern | `data/socialLinks.js` |
| Preis ändern | `data/products.js` |
| Artikel hinzufügen | `data/products.js` |
| Shop wirklich öffnen | `data/products.js` (`status`) |
| Pink gegen eine andere Farbe tauschen | `assets/main.css` |
| Überschrift einer Seite | die passende `views/*.vue` |
| Hero-Text | `components/home/HeroSection.vue` |
| Punkte auf der Discord-Seite | `views/DiscordView.vue` (`FEATURES`) |
| Text ganz unten | `components/AppFooter.vue` |
| Neue Unterseite | 3 Dateien — siehe [14](14-Router-und-Unterseiten.md) |

## 💡 Merken

**Wenn du dich fragst „wo ändere ich diesen Text?" — schau zuerst in `data/`.**

Steht er dort nicht, steht er in der View, die zu der Seite gehört.

## Siehe auch

- [21-Inhalte-aendern](21-Inhalte-aendern.md) — mit vollständigen Beispielen
- [13-Design-Tokens-und-Farben](13-Design-Tokens-und-Farben.md)
