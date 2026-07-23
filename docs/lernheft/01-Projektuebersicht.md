# Projektübersicht

## Wofür ist das?

TrapHouse ist die Website der gleichnamigen **Musik-Community für Artists und
Producer**: Startseite, Shop, Discord-Aufruf und die Social-Kanäle.

Es ist eine reine Vorstellungs-Website — sie zeigt etwas, sie verarbeitet
nichts. Niemand meldet sich an, niemand gibt Daten ein.

## Die Kurzfassung

| Frage | Antwort |
|---|---|
| Womit gebaut? | Vue 3 + Vite |
| Programmiersprache | JavaScript (kein TypeScript) |
| Unterseiten | Ja, über vue-router (`#/shop`, `#/discord`, `#/socials`) |
| Wo läuft es? | GitHub Pages: `moonisback.github.io/TrapHouse-Website/` |
| Backend? | **Nein** |
| Datenbank? | **Nein** |
| Nutzerkonten? | **Nein** |
| Externe Dienste? | **Keine** — kein Google, kein CDN, kein Tracking |
| Fremde Bibliotheken zur Laufzeit | **Nur Vue und vue-router** |

## Was es vorher war

Die alte Fassung bestand aus **einer** `index.html` und **einer** `style.css`
— zusammen 365 Zeilen, ohne JavaScript. Sie funktionierte, hatte aber ein paar
Probleme, die sich mit einer einzelnen Datei nicht lösen ließen:

| Problem in der alten Fassung | Wie es jetzt gelöst ist |
|---|---|
| ☰-Knopf ohne jede Funktion | `useMobileNav.js` — echtes Klappmenü |
| Schriften und Icons vom fremden CDN | Beides liegt jetzt im Projekt |
| 4,4 MB Bilder | 424 KB als WebP |
| Pixel-Figuren auf der falschen Seite | Klassen heißen jetzt, was sie tun |
| `font-weight: 600` war nie geladen | Der Schnitt wird jetzt mitgeliefert |
| Alle Inhalte im HTML verstreut | Gesammelt in `src/data/` |
| Kein Weg, eine Unterseite anzulegen | Router mit echten Adressen |

## ⭐ Besonders wichtig

**Diese Seite lädt nichts von fremden Servern.**

Das ist kein Zufall. Die alte Fassung holte Schriften von `fonts.googleapis.com`
und Icons von `cdnjs.cloudflare.com`. Bei jedem einzelnen Seitenaufruf erfuhren
diese Server die IP-Adresse deiner Besucher — in der EU ist das ohne vorherige
Einwilligung nicht erlaubt.

Weil jetzt alles im Projekt liegt, brauchst du:

- kein Cookie-Banner
- keine Einwilligung
- keinen Eintrag über Drittanbieter in der Datenschutzerklärung

→ Wenn du später etwas einbaust, das diese Eigenschaft aufgibt (Google
Analytics, ein eingebettetes YouTube-Video, ein Newsletter-Formular), wird
plötzlich all das nötig. Siehe [40-Was-noch-fehlt](40-Was-noch-fehlt.md).

## Größenordnung

Rund **2.750 Zeilen** in `src/`, verteilt auf 34 Dateien.

Die größten Dateien:

- `AppHeader.vue` (304 Zeilen)
- `main.css` (247)
- `ProductCard.vue` (207)
- `HeroSection.vue` (195)

Zum Vergleich: RankRoom hat rund 6.800 Zeilen. TrapHouse ist deutlich kleiner,
weil es nichts berechnet und nichts speichert — es zeigt nur an.

## 💡 Merken

**Ein Satz, der alles zusammenfasst:**
TrapHouse ist eine Vorstellungs-Website ohne Server, ohne Datenspeicherung und
ohne eine einzige Verbindung nach außen.

## Siehe auch

- [02-Ordnerstruktur](02-Ordnerstruktur.md) — wo was liegt
- [03-Wie-TrapHouse-aufgebaut-ist](03-Wie-TrapHouse-aufgebaut-ist.md) — das Wichtigste
