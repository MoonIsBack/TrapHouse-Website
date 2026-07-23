# Komponenten-Übersicht

## Wofür ist das?

Ein Verzeichnis: Was macht welche Datei, und wo wird sie benutzt?

## Der Rahmen

### `App.vue` (73 Zeilen)

Der Rahmen um alles. Setzt Kopfbereich, Inhalt, Fußbereich und die beiden
Deko-Ebenen zusammen. Enthält außerdem den „Zum Inhalt springen"-Link für die
Tastaturbedienung.

### `components/AppHeader.vue` (304 Zeilen)

Der klebende Kopfbereich. Die größte Datei im Projekt, weil sie zwei
Navigationen enthält: die Leiste für breite Bildschirme und das Klappmenü fürs
Handy.

Zwei Feinheiten:

- Ganz oben ist er durchsichtig, beim Scrollen wird er milchig — sonst läge ein
  Balken über dem Hero-Bild
- Die aktive Seite bekommt einen pinken Punkt. Die Klasse dafür
  (`router-link-active`) vergibt der Router selbst

### `components/AppFooter.vue` (178 Zeilen)

Logo, Navigation, Social-Links, Jahreszahl. Liest alles aus `data/`. Die
Jahreszahl kommt aus `new Date().getFullYear()`, damit dort nie eine veraltete
Zahl steht.

### `components/BackdropGlow.vue` (98 Zeilen)

Die farbigen Schleier im Hintergrund. Liegt hinter allem (`z-index: -1`) und
lässt Klicks durch (`pointer-events: none`).

⚠ Fehlte `pointer-events: none`, läge eine unsichtbare Fläche über der Seite
und würde jeden Klick schlucken. Ein Fehler, der schwer zu finden ist, weil
man ja nichts sieht.

### `components/PixelCorners.vue` (78 Zeilen)

Die beiden Pixel-Figuren unten. Auf Bildschirmen unter 900 px ausgeblendet,
weil sie dort den Inhalt verdecken würden.

## Wiederverwendbare Bausteine (`ui/`)

### `ui/BaseButton.vue` (131 Zeilen)

Der eine Knopf für alles. Entscheidet selbst, welches HTML-Element er wird:

| Angabe | Ergebnis |
|---|---|
| `:to="{ name: 'shop' }"` | `RouterLink` — Unterseite |
| `:href="'https://…'"` | `<a target="_blank">` — externe Adresse |
| keins von beidem | `<button>` |

Zwei Ausführungen: `variant="primary"` (pinker Verlauf) und `variant="ghost"`
(nur Umrandung).

### `ui/SectionHeader.vue` (81 Zeilen)

Die Überschrift über jedem Bereich: kleines Label, große Überschrift, Text.
Sorgt dafür, dass alle Bereiche denselben Rhythmus haben.

### `ui/NavLink.vue`

Ein Navigationseintrag — entscheidet selbst, ob ein `RouterLink` (Unterseite)
oder ein `<a target="_blank">` (fremde Adresse, z. B. RankRoom) daraus wird.

Warum als eigene Komponente: Dieselbe Unterscheidung wird an **drei** Stellen
gebraucht — Leiste für breite Bildschirme, Klappmenü, Fußbereich. Ohne sie
stünde dasselbe `v-if` dreimal da, und beim nächsten externen Link würde man
eine Stelle vergessen.

### `ui/ScrollProgress.vue`

Der dünne Balken ganz oben, der beim Scrollen mitwächst.

⚠ Er arbeitet mit `transform: scaleX()` und nicht mit `width`. Eine
Breitenänderung zwingt den Browser bei **jedem** Scroll-Schritt zu einer neuen
Layout-Rechnung; `scaleX` erledigt die Grafikkarte ohne Layout. Bei etwas, das
sich sechzigmal pro Sekunde ändert, ist das der Unterschied zwischen flüssig
und hakelig.

### `ui/MarqueeBand.vue`

Das durchlaufende Textband zwischen zwei Bereichen.

⭐ **Der Trick mit dem doppelten Inhalt:** Die Wortliste steht zweimal
hintereinander im HTML, und die Animation schiebt das Band um genau seine halbe
Breite. In dem Moment, in dem die erste Liste links hinausgeschoben ist, steht
die zweite exakt dort, wo die erste anfing — der Sprung zurück auf Null ist
unsichtbar. Ohne die Verdopplung entstünde am Ende eine Lücke.

## Bereichsspezifische Bausteine

### `home/HeroSection.vue`

Der Bereich ganz oben auf der Startseite. Das Bild ist ein echtes `<img>` und
kein CSS-Hintergrund — der Browser findet es dadurch früher und kann es
parallel laden.

Darüber liegen drei Schichten: eine Abdunklung für die Lesbarkeit, ein pinker
Schein hinter der Überschrift und ein feines Raster für Struktur.

⭐ **Warum dort nicht mehr die Instagram-Grafik liegt.** Ursprünglich war
`hero-backdrop.webp` der Hintergrund — die Community-Kachel von Instagram. Die
ist aber voller Text („Jeder ist willkommen", „Was euch erwartet:"). Dieser
Text schlug durch die Abdunklung und stand direkt neben der echten Überschrift.
Zwei konkurrierende Texte übereinander liest niemand als Gestaltung, sondern
als Fehler.

Jetzt liegt dort `hero-texture.webp`: dieselbe Grafik, aber so stark
weichgezeichnet, dass nur ein Farbverlauf übrig bleibt. Markenfarben bleiben,
Text ist weg — und die Datei schrumpfte von 179 KB auf 5 KB, weil ein
weichgezeichnetes Bild kaum noch Information enthält.

**Die Lehre daraus:** Ein Hero-Hintergrund muss Atmosphäre liefern, nicht
Inhalt. Sobald er selbst etwas sagen will, kämpft er mit dem Text davor.

### `home/HighlightGrid.vue`

„Was dich erwartet" — vier Karten, die erklären, worum es bei TrapHouse geht.

Dieser Bereich hat lange gefehlt: Die Startseite sprang vom Willkommensgruß
direkt zum T-Shirt, ohne je zu sagen, was die Community eigentlich ist.

### `shop/ProductCard.vue` (207 Zeilen)

Eine Artikel-Karte. Liest `status` aus den Daten und schaltet die Knöpfe
entsprechend frei oder grau.

Das Bild sitzt in einem festen Seitenverhältnis (`aspect-ratio: 4 / 5`), damit
mehrere Karten nebeneinander gleich hoch beginnen.

### `socials/SocialCard.vue` (149 Zeilen)

Eine Kanal-Karte. Die Markenfarbe kommt aus den Daten und erscheint erst beim
Darüberfahren — im Ruhezustand bleibt alles pink.

### `discord/DiscordCta.vue` (116 Zeilen)

Der große Beitreten-Aufruf. Steht auf **zwei** Seiten (Startseite und
Discord-Seite), deshalb eine eigene Komponente. Über `:show-heading="false"`
lässt sich die Überschrift abschalten, wo schon eine darüber steht.

Hier taucht `MoonPixel.gif` auf — die Datei lag vorher ungenutzt herum.

### `icons/` (9 Dateien, je 15–26 Zeilen)

Alle Icons als eigene SVG-Komponenten. Ersetzen das Font-Awesome-CDN aus der
alten Seite.

Alle nach demselben Muster: `viewBox="0 0 24 24"`, `width="1em"` (wächst mit
der Schriftgröße), `fill="currentColor"` (nimmt die Textfarbe an),
`aria-hidden="true"` (Screenreader überspringen sie).

## Die Seiten (`views/`)

| Datei | Adresse | Zeilen |
|---|---|---|
| `HomeView.vue` | `#/` | 90 |
| `ShopView.vue` | `#/shop` | 60 |
| `DiscordView.vue` | `#/discord` | 100 |
| `SocialsView.vue` | `#/socials` | 34 |
| `NotFoundView.vue` | alles andere | 57 |

Alle Views sind kurz. Das ist Absicht: Sie stellen zusammen, sie bauen nicht.
`SocialsView.vue` mit 34 Zeilen ist das beste Beispiel — sie holt die Liste
und lässt `SocialCard` den Rest machen.

## 💡 Merken

**Kommt ein Baustein auf mehr als einer Seite vor, gehört er in `ui/` oder in
einen eigenen Ordner.** Genau deshalb ist `DiscordCta` eine eigene Datei und
nicht zweimal hingeschrieben.

## Siehe auch

- [03-Wie-TrapHouse-aufgebaut-ist](03-Wie-TrapHouse-aufgebaut-ist.md)
- [12-Composables-Uebersicht](12-Composables-Uebersicht.md)
