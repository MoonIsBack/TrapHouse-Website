# Ordnerstruktur

## Wofür ist das?

Damit du weißt, wo du suchen musst.

## Die Ordner

```
TrapHouse-Website/
├── index.html            Einstiegspunkt (fast leer, Vue füllt ihn)
├── package.json          Abhängigkeiten + Befehle (npm run ...)
├── vite.config.js        Build-Einstellungen + Sicherheitsregel (CSP)
│
├── public/               Dateien, die 1:1 mitkopiert werden
│   └── traphouse-logo-transparent-v5.png  Das Browser-Tab-Logo ⭐
│
├── docs/lernheft/        ← dieses Lernheft
│
└── src/                  Der eigentliche Code
    ├── main.js           Startet Vue
    ├── App.vue           Der Rahmen: Kopf, Inhalt, Fuß
    │
    ├── assets/           Farben, Grundstile, Schriften, Bilder
    │   ├── main.css           Design-Tokens ⭐
    │   ├── fonts.css          Die @font-face-Angaben
    │   ├── fonts/             Die 4 Schriftdateien
    │   └── images/            Alle Bilder
    │
    ├── config/           Schalter, die DU umlegst
    │   ├── legalConfig.js     Impressumsangaben ⭐
    │   └── scrollConfig.js    'standard' oder 'chapter'
    │
    ├── router/           Welche Adresse zeigt welche Seite
    ├── views/            Je eine Datei pro Unterseite
    ├── components/       Bausteine, die man sehen kann
    │   ├── icons/             SVG-Icons
    │   ├── ui/                Knopf, Überschrift — überall verwendet
    │   ├── home/              Nur für die Startseite
    │   ├── shop/              Nur für den Shop
    │   ├── socials/           Nur für die Socials
    │   ├── legal/             Rahmen für Impressum + Datenschutz
    │   └── discord/           Nur für Discord
    │
    ├── composables/      Wiederverwendbare Logik ohne Aussehen
    └── data/             Die Inhalte: Links, Produkte, Navigation ⭐
```

### ⚠ Zum `public/`-Ordner

**Alles, was dort liegt, wird mitveröffentlicht — auch das, was niemand
benutzt.** Deshalb liegt dort genau eine Datei: das Browser-Tab-Logo, das
`index.html` einbindet.

Bei der Suche nach dem richtigen Tab-Bild waren zeitweise sechs Fassungen
darin (ein T-Monogramm, eine zweizeilige Variante, ein `.ico` …). Die sind
aufgeräumt; wer sie braucht, holt sie aus der Git-Historie zurück:

```sh
git log --diff-filter=D --name-only -- public/
```

⚠ Das Tab-Logo bitte **nicht** stillschweigend gegen einen dieser alten
Entwürfe tauschen — die Entscheidung für den vollständigen transparenten
Schriftzug ist bewusst gefallen.

⚠ Safari merkt sich Tab-Logos sehr hartnäckig. Änderst du es, brauchst du einen
**neuen Dateinamen oder eine neue Zahl hinter `?v=`**, sonst zeigt Safari
tagelang das alte Bild.

### Warum `public/` und nicht `assets/`?

Bilder in `src/assets/` werden **importiert**, und Vite hängt ihnen beim Bauen
eine Prüfsumme an den Namen (`shirt-a3f2c1.webp`). Für ein Tab-Logo geht das
nicht: `index.html` verweist darauf, bevor überhaupt JavaScript läuft — der
Name muss also vorher feststehen. Genau dafür ist `public/` da.

## Was gehört wohin?

| Ordner | Faustregel |
|---|---|
| `views/` | Eine **ganze Seite**. Es gibt genau so viele wie Adressen. |
| `components/` | Ein **Teil** einer Seite |
| `components/ui/` | Bausteine, die auf **mehreren** Seiten vorkommen |
| `composables/` | Logik, die **kein** Aussehen hat — z. B. das Klappmenü |
| `config/` | **Schalter und Angaben**, die du bewusst setzt |
| `data/` | **Inhalte**: Texte, Links, Preise |
| `assets/` | **Material**: Farben, Schriften, Bilder |
| `router/` | Nur die Zuordnung Adresse → Ansicht |

## Der Unterschied: `views/` oder `components/`?

Das ist die Frage, bei der man am Anfang am meisten zögert. Die Regel:

> **Steht es in `router/index.js`? Dann ist es eine View.**
> **Alles andere ist eine Component.**

`ShopView.vue` ist eine View — es gibt die Adresse `#/shop`.
`ProductCard.vue` ist eine Component — sie kommt auf der Startseite **und** im
Shop vor und hat keine eigene Adresse.

## Warum sind die Components in Unterordner sortiert?

Bei sechs Dateien wäre das egal. Aber die Ordner beantworten sofort eine Frage,
die man beim Aufräumen immer wieder hat:

> „Wenn ich das hier ändere — was geht dabei kaputt?"

- Etwas in `components/shop/` ändern → betrifft den Shop
- Etwas in `components/ui/` ändern → betrifft **die ganze Seite**

Der Ordnername ist also eine eingebaute Warnung.

## ⚠ Vorsicht

**`dist/`** taucht auf, sobald du `npm run build` ausführst. Der Ordner ist
**generiert** — da niemals von Hand etwas ändern, beim nächsten Build ist es
weg. Er liegt auch nicht in Git (steht in `.gitignore`).

**`node_modules/`** sind die fremden Pakete. Wird von npm verwaltet, nie von
Hand anfassen. Wenn dort etwas kaputt ist: löschen und `npm install`.

## Was darf ich ändern?

Alles in `src/`. Das ist dein Code.

## 💡 Merken

**`data/` ist für Inhalte, `assets/` ist für Material, `config/` ist für
Entscheidungen.**

Ein Produktname gehört nach `data/`. Das Foto dazu nach `assets/images/`. Die
Frage „wie soll die Startseite scrollen?" nach `config/`.

## Siehe auch

- [05-Dateien-die-ich-haeufig-aendere](05-Dateien-die-ich-haeufig-aendere.md)
- [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md)
