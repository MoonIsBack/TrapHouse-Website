# Design-Tokens und Farben

## Wofür ist das?

Zu verstehen, warum in keiner Komponente eine feste Farbe steht — und wie du
das Aussehen der ganzen Seite an einer Stelle änderst.

## Was ist ein Design-Token?

Ein benannter Wert, der an **einer** Stelle definiert und **überall** benutzt
wird.

```css
/* Einmal in main.css definiert: */
:root {
  --accent: #ff2f92;
}

/* Überall benutzt: */
.button { background: var(--accent); }
.badge  { color: var(--accent); }
```

Ändere die eine Zeile — und Knopf, Badge und alles andere ändern sich mit.

In der alten `style.css` stand `#ff2f92` an mehreren Stellen einzeln. Eine
Farbänderung hieß: suchen, ersetzen, eine Stelle übersehen.

## Die Tokens im Überblick

Alle stehen ganz oben in `src/assets/main.css`.

### Hintergrund

```css
--bg-top: #150d13;      /* oben, minimal heller */
--bg-bottom: #0b070a;   /* unten, fast schwarz */
```

Beide haben einen leichten Rotstich. Das ist Absicht: Auf reinem Grau (#111,
wie in der alten Fassung) wirkt Pink wie ein Fremdkörper.

### Schrift — vier Stufen

```css
--text: #f8f3f6;            /* Überschriften */
--text-secondary: #d0c4cb;  /* Fließtext */
--text-muted: #9c8e96;      /* Labels, Nebeninfos */
--text-subtle: #6d6169;     /* ganz dezent */
```

⚠ **Immer eine dieser vier nehmen, nie ein eigenes Grau erfinden.** Sonst hat
die Seite nach ein paar Wochen zwölf leicht verschiedene Graustufen und wirkt
unruhig, ohne dass man sagen kann, warum.

### Akzent

```css
--accent: #ff2f92;         /* das TrapHouse-Pink */
--accent-strong: #ff5fa8;  /* heller, für Hover */
--accent-rgb: 255, 47, 146;
--accent-gradient: linear-gradient(135deg, #ff2f92, #b026ff);
```

### Warum gibt es `--accent-rgb` zusätzlich?

Weil CSS eine Hex-Farbe nicht halbtransparent machen kann. Das geht nicht:

```css
background: rgba(var(--accent), 0.2);   /* ✗ funktioniert nicht */
```

Das geht:

```css
background: rgba(var(--accent-rgb), 0.2);   /* ✓ */
```

⚠ Änderst du `--accent`, musst du `--accent-rgb` **mitändern**. Die beiden
müssen dieselbe Farbe beschreiben, sonst haben Flächen und Ränder plötzlich
verschiedene Farbtöne.

Hex → RGB umrechnen: `#ff2f92` → `ff`=255, `2f`=47, `92`=146.

### Flächen, Rundungen, Schatten

```css
--surface: rgba(255, 255, 255, 0.045);   /* milchiges Glas */
--border-soft: rgba(255, 255, 255, 0.09);

--radius-sm: 10px;  --radius-md: 16px;
--radius-lg: 24px;  --radius-pill: 999px;

--shadow-card: 0 18px 40px rgba(0, 0, 0, 0.35);
```

Die Karten sind keine festen Farbflächen, sondern sehr helle durchsichtige
Flächen mit hellem Rand. Dadurch scheint der Hintergrund durch und die Seite
wirkt weniger flach.

Die Schatten sind **groß und weich** statt klein und hart — das lässt Elemente
schweben, statt einen Rand um sie zu zeichnen.

### Maße

```css
--content-width: 1120px;   /* wie breit der Inhalt maximal wird */
--page-padding: 24px;      /* Luft an den Seiten */
--header-height: 72px;
```

## Die zwei Schriften

| Schrift | Wofür | Schnitte |
|---|---|---|
| **Anton** | Überschriften (h1, h2, h3), Preise | nur 400 |
| **Poppins** | alles andere | 400, 600, 700 |

Überschriften laufen automatisch über Anton — das steht einmal zentral in
`main.css` und nicht in jeder Komponente:

```css
h1, h2, h3 {
  font-family: 'Anton', 'Poppins', sans-serif;
  text-transform: uppercase;
}
```

## Wie du die Seite umfärbst

Willst du statt Pink z. B. ein Giftgrün, änderst du **drei Zeilen**:

```css
--accent: #2fff92;
--accent-strong: #5fffa8;
--accent-rgb: 47, 255, 146;
--accent-gradient: linear-gradient(135deg, #2fff92, #26ffb0);
```

Und passe den Rotstich im Hintergrund an, damit er zur neuen Farbe passt.

## 💡 Merken

**Steht in einer Komponente eine Farbe wie `#ff2f92`, ist das ein Fehler.**
Dort gehört `var(--accent)` hin.

Der Test: Kannst du die Seite umfärben, indem du nur `main.css` anfasst? Wenn
ja, ist alles richtig.

## ⚠ Vorsicht

Ausnahme sind die **Markenfarben** der Social-Kanäle in `data/socialLinks.js`.
Das YouTube-Rot ist keine Design-Entscheidung, sondern gehört zu YouTube — es
darf sich nicht mitändern, wenn du die Seite umfärbst. Deshalb steht es bei den
Daten und nicht bei den Tokens.

## Siehe auch

- [20-Bilder-und-Schriften](20-Bilder-und-Schriften.md)
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md) — dort werden die Tokens umschaltbar
