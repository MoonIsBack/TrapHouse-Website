# ⭐ Veröffentlichen — Schritt für Schritt

## Wofür ist das?

Die Anleitung zum Hochladen. Kapitel [07](07-Projekt-starten-und-bauen.md)
erklärt die Befehle allgemein — hier steht die genaue Reihenfolge und was zu
tun ist, wenn es klemmt.

## 💡 Das Wichtigste vorweg

**Es gibt keinen „Hochladen"-Knopf. Der Push *ist* der Upload.**

Du lädst nie Dateien irgendwohin. Du schiebst deine Änderungen zu GitHub, und
dort läuft automatisch ein Programm (der „Workflow"), das die Seite baut und
veröffentlicht. Deshalb heißt es auch nicht Upload, sondern **Deploy**.

```
git push  →  GitHub Actions baut  →  GitHub Pages liefert aus
  3 Sek.        etwa 30 Sek.            10–60 Sek.
```

Zusammen unter zwei Minuten.

---

# Der Normalfall

Das brauchst du in 90 % der Fälle. Fünf Schritte.

## Schritt 1 — Vorher lokal prüfen ⭐

```sh
npm run build
npm run preview
```

Dann die Adresse aus der Ausgabe öffnen (meist
`http://localhost:4173/TrapHouse-Website/`) und **jede Seite einmal anklicken**.

⚠ **Diesen Schritt bitte nicht überspringen.** `npm run dev` und der fertige
Build sind nicht dasselbe. Manche Fehler treten ausschließlich im Build auf:

- falsche Bildpfade (wenn ein Bild nicht importiert, sondern hingeschrieben wurde)
- alles, was die Sicherheitsregel (CSP) blockiert
- ein falscher `base`-Wert

Fällt so ein Fehler erst online auf, ist die Seite für alle kaputt, bis du es
merkst. Hier fällt er auf, während noch niemand etwas davon sieht.

Beenden mit `Strg + C`.

## Schritt 2 — Schauen, was sich geändert hat

```sh
git status
```

Zeigt dir alle geänderten Dateien. Kurz überfliegen: Ist da etwas dabei, das du
gar nicht ändern wolltest?

## Schritt 3 — Änderungen vormerken

```sh
git add -A
```

Das `-A` nimmt alles mit: geänderte, neue und gelöschte Dateien.

## Schritt 4 — Commit

```sh
git commit -m "Discord-Link eingetragen"
```

Der Text in Anführungszeichen beschreibt, **was** du geändert hast. Schreib ihn
so, dass du in drei Monaten noch weißt, worum es ging. „Update" oder „test"
helfen dir dann nicht.

## Schritt 5 — Push

```sh
git push
```

**Ab hier läuft alles von allein.**

---

## Wo du den Fortschritt siehst

Auf GitHub im Repo → Reiter **Actions**. Ganz oben steht dein Commit:

| Symbol | Bedeutung |
|---|---|
| 🟡 gelber Punkt | läuft gerade (etwa 30 Sekunden) |
| ✅ grüner Haken | fertig und veröffentlicht |
| ❌ rotes Kreuz | fehlgeschlagen → anklicken und Log lesen |

Bei ❌: Lauf anklicken, dann den roten Schritt aufklappen. Die Fehlermeldung
steht meist in den letzten Zeilen.

## Danach prüfen

Seite aufrufen: https://moonisback.github.io/TrapHouse-Website/

⚠ Zwei Dinge, die hier oft für unnötige Panik sorgen:

1. **Nach dem grünen Haken dauert es nochmal 10 bis 60 Sekunden**, bis GitHubs
   Server die neue Fassung ausliefern. Einmal warten und neu laden.
2. **Dein Browser zeigt dir womöglich die alte Fassung** aus dem
   Zwischenspeicher. Hart neu laden: `Cmd + Shift + R` (Mac) bzw.
   `Strg + F5` (Windows).

Erst wenn es danach immer noch falsch aussieht, ist wirklich etwas kaputt.

---

# Sonderfälle

## A) Neu veröffentlichen, ohne etwas geändert zu haben

Kommt vor, wenn Pages neu eingerichtet wurde oder ein Deploy schiefging.

**Auf GitHub:**
> Actions → **„Deploy TrapHouse to GitHub Pages"** → rechts **„Run workflow"** → grüner Knopf

Das geht, weil im Workflow `workflow_dispatch:` steht. Fehlt das in einem
Projekt (z. B. aktuell bei RankRoom), nimm stattdessen:

> Actions → letzten Lauf öffnen → oben rechts **„Re-run all jobs"**

## B) ⭐ Nach „privat → öffentlich" kommt 404

**Das ist der Fall, der uns Zeit gekostet hat.** Merk ihn dir:

> **Ein Repo auf privat zu stellen LÖSCHT die Pages-Einrichtung.
> Zurück auf öffentlich stellt sie NICHT wieder her.**

Der Grund: Pages auf privaten Repos ist eine Bezahlfunktion. GitHub legt die
Einrichtung deshalb nicht schlafen, sondern entfernt sie.

**Die Reparatur, zwei Schritte:**

**1. Pages neu einrichten**
> Repo → **Settings** → links **Pages** → bei *Build and deployment* →
> **Source** auf **„GitHub Actions"** stellen

⚠ Unbedingt „GitHub Actions" und **nicht** „Deploy from a branch". Im Repo liegt
nur der Quellcode; die fertige Seite entsteht erst beim Bauen. Mit „Deploy from
a branch" würde GitHub die rohe `index.html` ausliefern, die auf `/src/main.js`
verweist — Ergebnis: weiße Seite.

**2. Einen Deploy auslösen**
Pages weiß jetzt *wie* gebaut wird, hat es aber noch nie getan. Also Sonderfall
A ausführen.

Danach eine Minute warten und prüfen.

## C) Umzug auf eine eigene Domain

Wenn die Seite später unter `traphouse.de` statt unter
`moonisback.github.io/TrapHouse-Website/` liegt:

In `vite.config.js`:

```js
base: '/',   // statt '/TrapHouse-Website/'
```

Das ist die **einzige** Zeile im Code, die dafür zu ändern ist. Dazu kommen die
Domain-Einstellungen bei GitHub unter Settings → Pages → Custom domain.

⚠ Vergisst du die Zeile, lädt keine einzige Datei und die Seite bleibt weiß.

---

# Wenn etwas nicht klappt

| Symptom | Ursache | Lösung |
|---|---|---|
| „There isn't a GitHub Pages site here" | Pages ist nicht eingerichtet | Sonderfall B |
| Weiße Seite, keine Fehlermeldung | Source steht auf „Deploy from a branch" | Sonderfall B, Schritt 1 |
| Weiße Seite nach Domain-Umzug | falscher `base`-Wert | Sonderfall C |
| Alte Fassung wird angezeigt | Browser-Cache | `Cmd + Shift + R` |
| Seite lädt, aber ohne Bilder und Styles | `base` passt nicht zur Adresse | `vite.config.js` prüfen |
| Actions ist rot | Build-Fehler | Lauf öffnen, roten Schritt aufklappen |
| „Everything up-to-date" beim Push | kein Commit gemacht | Schritt 3 und 4 nachholen |
| Actions läuft gar nicht an | Commit ist nicht auf `main` | `git branch --show-current` prüfen |

## Fehler in der Konsole verstehen

Weiße Seite ohne erkennbaren Grund? **F12 → Reiter Console.** Dort steht die
eigentliche Meldung.

Taucht dort etwas mit „Content Security Policy" auf, hast du etwas eingebaut,
das von außen lädt — dann muss es in `vite.config.js` in der CSP erlaubt werden.
Siehe [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md).

---

# Die Kurzfassung zum Abschreiben

```sh
npm run build && npm run preview   # 1. prüfen, dann Strg+C
git status                         # 2. anschauen
git add -A                         # 3. vormerken
git commit -m "Was geändert wurde" # 4. festhalten
git push                           # 5. hochladen
```

Dann: Actions → grüner Haken abwarten → eine Minute → Seite hart neu laden.

## 💡 Merken

**Drei Sätze, die dir die meisten Probleme ersparen:**

1. Immer erst `npm run preview`, dann pushen.
2. Nach dem grünen Haken eine Minute warten und hart neu laden, bevor du an
   einen Fehler glaubst.
3. Privat schalten löscht die Pages-Einrichtung — öffentlich schalten bringt sie
   nicht zurück.

## Siehe auch

- [07-Projekt-starten-und-bauen](07-Projekt-starten-und-bauen.md) — die Befehle allgemein
- [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md) — `base` und CSP
