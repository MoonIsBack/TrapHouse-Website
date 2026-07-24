# Was noch fehlt

## Wofür ist das?

Eine ehrliche Liste dessen, was **nicht** fertig ist. Damit du nicht in drei
Monaten überrascht wirst.

## 🔴 Muss, bevor die Seite ernsthaft online geht

### 1. Impressum und Datenschutz sind gebaut, aber nicht ausgefüllt

⚠ **Das ist eine rechtliche Pflicht, keine Fleißaufgabe.**

Nach § 5 DDG braucht in Deutschland jede geschäftsmäßige Website ein
Impressum — und „geschäftsmäßig" ist schnell erreicht, spätestens wenn Merch
verkauft wird.

Beide Seiten existieren inzwischen (`#/impressum` und `#/datenschutz`), aber in
`src/config/legalConfig.js` stehen noch Platzhalter. Solange das so ist, zeigen
sie einen roten Warnkasten — und die Seite darf nicht öffentlich erreichbar
sein.

**Vorher zu entscheiden:** welche Anschrift hineinkommt. Ein Postfach reicht
nicht; für eine Privatperson heißt das in der Regel, dass die Wohnadresse
öffentlich im Netz steht.

→ Vollständige Anleitung: [22-Rechtsseiten](22-Rechtsseiten.md)

### 2. GitHub Pages muss einmal umgestellt werden

Auf GitHub unter **Settings → Pages → Source** auf „GitHub Actions" stellen.
Ohne das läuft der Deploy-Workflow zwar durch, veröffentlicht aber nichts.

## 🟡 Sollte, bevor der Shop öffnet

### 3. Es gibt keinen Warenkorb

Die Knöpfe „Merken" und „In den Warenkorb" sind aktuell absichtlich deaktiviert
(`status: 'bald'`). Stellst du auf `'verfuegbar'` um, werden sie klickbar —
**tun aber nichts**.

Ein echter Shop braucht:

- Warenkorb und Bestellvorgang
- Zahlungsdienstleister (Stripe, PayPal)
- AGB und Widerrufsbelehrung
- Versandkosten und Lieferzeiten
- Ein Backend — spätestens hier ist es mit „läuft komplett im Browser" vorbei

→ **Realistische Alternative:** Verlinke auf einen fertigen Shop-Anbieter
(Shopify, Spreadshirt, Fourthwall). Dann bleibt diese Seite so einfach, wie sie
ist, und du sparst dir den ganzen rechtlichen Rattenschwanz.

### 4. Die Vorschau-Karte beim Teilen hat kein Bild

In der `index.html` fehlt `og:image`. Teilst du den Link auf WhatsApp oder
Discord, erscheint eine Karte ohne Bild.

Zum Ergänzen brauchst du ein Bild mit **1200 × 630 px** in `public/`:

```html
<meta property="og:image" content="/og-bild.png" />
<meta property="og:url" content="https://…" />
```

⚠ Bei `og:image` muss eine **vollständige** Adresse stehen (mit `https://…`),
relative Pfade funktionieren dort nicht zuverlässig.

## 🟢 Kann, muss aber nicht

### 5. Nur ein Artikel im Shop

Das Raster ist auf mehrere ausgelegt — bei einem einzelnen Artikel sieht die
Shop-Seite noch etwas leer aus.

### 6. Keine echten Community-Zahlen

Im Hero steht „Musik-Community · seit 2024". Sobald der Server eine ordentliche
Größe hat, wären echte Zahlen („1.200 Mitglieder") überzeugender.

⚠ Nicht automatisch von Discord abfragen — dafür bräuchte es einen Aufruf nach
außen, und genau den vermeidet diese Seite. Von Hand eintragen ist hier die
bessere Lösung.

### 7. Keine Tests

Es gibt keine automatischen Tests. Bei einer Seite, die nichts berechnet, ist
das vertretbar: Es gibt kaum Logik, die falsch sein könnte.

Sollte irgendwann ein Warenkorb dazukommen, ändert sich das sofort.

### 8. Keine Sitemap, kein `robots.txt`

Für Suchmaschinen. Bei vier Unterseiten findet Google die auch so.

### 9. Kein Manifest — die Seite lässt sich nicht als App ablegen

Legt jemand die Seite auf den Homebildschirm seines Handys, bekommt sie keinen
ordentlichen Namen und kein eigenes Icon. Dafür bräuchte es eine
`site.webmanifest` in `public/` und die passende Zeile in `index.html`:

```html
<link rel="manifest" href="/site.webmanifest">
```

Eine solche Datei gab es schon einmal, sie war aber nie eingebunden und nannte
ein anderes Icon als der Browser-Tab. Deshalb wurde sie zusammen mit den alten
Logo-Entwürfen entfernt.

⚠ Wenn du sie neu anlegst: Das Icon darin sollte ein **quadratisches** Bild
sein (192 × 192 und 512 × 512 sind die üblichen Größen). Der breite
TrapHouse-Schriftzug taugt dafür nicht — auf dem Homebildschirm würde er in
einem quadratischen Rahmen entweder gequetscht oder winzig dargestellt.

### 10. Das Tab-Logo ist mit 107 KB sehr groß

`traphouse-logo-transparent-v5.png` ist 480 × 215 px groß und wird im Tab auf
etwa 16 × 16 px angezeigt. Browser laden es trotzdem vollständig.

Das ist keine Baustelle, sondern eine Abwägung: Kleiner gerechnet würde der
feine Schriftzug matschig. Wer es optimieren will, bräuchte eine eigens für
kleine Größen gezeichnete Fassung — und die sähe dann anders aus als das
aktuelle Tab-Logo.

## Was bewusst NICHT geplant ist

| Nicht geplant | Warum |
|---|---|
| Analytics / Tracking | Würde Cookie-Banner und Einwilligung nötig machen |
| Eingebettete YouTube-Videos | Setzt Cookies von Google. Falls doch: `youtube-nocookie.com` und CSP erweitern |
| Newsletter-Formular | Braucht Server, Double-Opt-In und Datenschutzerklärung |
| Nutzerkonten | Dafür ist Discord da |
| Dunkel-/Hell-Umschalter | Die Seite ist als dunkle Seite gestaltet. Eine helle Fassung wäre ein eigenes Design, kein Schalter |

## 💡 Merken

**Das Impressum ist das eine Ding, das wirklich noch fehlt.**

Alles andere in dieser Liste ist eine Entscheidung, keine Baustelle.

## Siehe auch

- [21-Inhalte-aendern](21-Inhalte-aendern.md) — Texte und Links ändern
- [30-RankRoom-spaeter-einbinden](30-RankRoom-spaeter-einbinden.md) — Rechtsseiten übernehmen
