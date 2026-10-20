# TrapHouse — Lernheft

Dieses Heft erklärt die TrapHouse-Website so, dass du sie auch in einem halben
Jahr noch selbst ändern kannst — ohne raten zu müssen, wo etwas steht.

Es ist genauso aufgebaut wie das Lernheft von RankRoom. Wenn du dort schon
etwas gelesen hast, kennst du die Rubriken:

| Rubrik | Bedeutung |
|---|---|
| **Wofür ist das?** | Wozu das Kapitel gut ist |
| **💡 Merken** | Der eine Satz, den du behalten solltest |
| **⚠ Vorsicht** | Wo man sich typischerweise in den Fuß schießt |
| **Siehe auch** | Wo es weitergeht |

## Wenn du wenig Zeit hast

Lies **03**. Wenn du danach noch fünf Minuten hast, lies **05**.
Damit kannst du schon das meiste ändern.

Willst du nur etwas online bringen: **08**.

⚠ **Impressum und Datenschutz: 22.** Beide sind gebaut, aber noch nicht
ausgefüllt (Stand 20.10.2026) — alles dafür steht in **einer** Datei
(`src/config/legalConfig.js`). Solange dort Platzhalter stehen, gibt es die
beiden Seiten nur beim Entwickeln; in der veröffentlichten Fassung fehlen sie
ganz, obwohl die Seite schon öffentlich erreichbar ist. Das ist der einzige
Punkt auf der ganzen Liste, bei dem es nicht um Optik geht.

## Alle Kapitel

### Grundlagen

| Nr. | Kapitel | Worum es geht |
|---|---|---|
| 01 | [Projektübersicht](01-Projektuebersicht.md) | Was ist das hier überhaupt? |
| 02 | [Ordnerstruktur](02-Ordnerstruktur.md) | Wo muss ich suchen? |
| 03 | ⭐ [Wie TrapHouse aufgebaut ist](03-Wie-TrapHouse-aufgebaut-ist.md) | **Die wichtigste Seite** |
| 04 | [Datenfluss](04-Datenfluss.md) | Wie Daten durch die Seite wandern |
| 05 | ⭐ [Dateien, die ich häufig ändere](05-Dateien-die-ich-haeufig-aendere.md) | Der Alltag |
| 06 | [Dateien, die ich fast nie anfasse](06-Dateien-die-ich-fast-nie-anfasse.md) | Finger weg (meistens) |
| 07 | [Projekt starten und bauen](07-Projekt-starten-und-bauen.md) | `npm run …` |
| 08 | ⭐ [Veröffentlichen Schritt für Schritt](08-Veroeffentlichen-Schritt-fuer-Schritt.md) | Die Seite online bringen, und was tun wenn 404 |

### Die Bausteine

| Nr. | Kapitel | Worum es geht |
|---|---|---|
| 10 | [Vue-Grundbegriffe](10-Vue-Grundbegriffe.md) | props, emit, ref, computed |
| 11 | [Komponenten-Übersicht](11-Komponenten-Uebersicht.md) | Jede Komponente einzeln erklärt |
| 12 | [Composables-Übersicht](12-Composables-Uebersicht.md) | Die Logik-Bausteine ohne Aussehen |
| 13 | [Design-Tokens und Farben](13-Design-Tokens-und-Farben.md) | Wie das Aussehen zusammenhängt |
| 14 | [Router und Unterseiten](14-Router-und-Unterseiten.md) | Warum die `#` in der Adresse steht |
| 15 | [Scrollverhalten](15-Scrollverhalten.md) | Der Schalter zwischen „normal" und „Kapitel" |
| 16 | [Scroll-Effekte und Mikrointeraktionen](16-Scroll-Effekte-und-Mikrointeraktionen.md) | Magnet-Knöpfe, 3D-Kippen, Vorhang-Reveal, eigener Cursor |

### Inhalte und Material

| Nr. | Kapitel | Worum es geht |
|---|---|---|
| 20 | [Bilder und Schriften](20-Bilder-und-Schriften.md) | Warum nichts mehr von Google kommt |
| 21 | ⭐ [Inhalte ändern](21-Inhalte-aendern.md) | Texte, Preise, Links austauschen |
| 22 | ⭐ [Impressum und Datenschutz](22-Rechtsseiten.md) | Was du ausfüllen musst, bevor du online gehst |

### Ausblick

| Nr. | Kapitel | Worum es geht |
|---|---|---|
| 30 | ⭐ [RankRoom später einbinden](30-RankRoom-spaeter-einbinden.md) | Der Plan zum Zusammenführen |
| 40 | [Was noch fehlt](40-Was-noch-fehlt.md) | Offene Punkte, ehrlich aufgelistet |

## 💡 Merken

**Dieses Heft beschreibt den Stand, als es geschrieben wurde.** Wenn du etwas
grundlegend umbaust, ändere auch das passende Kapitel mit. Eine Doku, der man
nicht mehr trauen kann, ist schlimmer als gar keine — dann sucht man doppelt.

Die Kapitel 01, 02, 05, 06 und 07 wurden am **20.10.2026** gegen den Code
geprüft und nachgezogen. In den Kapiteln 03, 04, 11, 12, 13, 14, 16, 20, 21, 22,
30 und 40 wurden am selben Tag gezielt die bekannten Abweichungen berichtigt:

- Produkt-Status `'ankuendigung'` statt `'bald'` — dann gibt es weder Preis noch
  Kaufknöpfe (Kapitel 04, 11, 21, 40)
- Rechtsseiten: der rote Warnkasten erscheint nur mit `npm run dev`; in der
  veröffentlichten Fassung fehlen Seiten und Fußbereich-Links (Kapitel 22, 40)
- `useCardInteraction.js` als zwölftes Composable (Kapitel 12, 16)
- RankRooms Zoom-Sperre gibt es seit dem 07.08.2026 nicht mehr (Kapitel 30)
- „feste Akzentfarbe" statt „feste Farbe": ein paar feste Farben gibt es, nur
  die Akzentfarbe steht ausschließlich in `main.css` (Kapitel 13, 30)
- Menüpunkt „Merch" statt „Shop", Hero ohne Bild, einzelne Zeilenzahlen
  (Kapitel 03, 11, 12, 14, 20)

Alles Übrige in diesen Kapiteln ist **nicht** Zeile für Zeile gegen den Code
geprüft und kann in Einzelheiten abweichen.
