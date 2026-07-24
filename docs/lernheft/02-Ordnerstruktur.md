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
│   ├── traphouse-favicon-v3.png  TrapHouse-Logo als PNG
│   ├── traphouse-favicon-v4.ico  TrapHouse-Logo für Browser-Tabs
│   └── site.webmanifest          Name und Icon für installierte Web-Apps
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
    ├── router/           Welche Adresse zeigt welche Seite
    ├── views/            Je eine Datei pro Unterseite
    ├── components/       Bausteine, die man sehen kann
    │   ├── icons/             SVG-Icons
    │   ├── ui/                Knopf, Überschrift — überall verwendet
    │   ├── home/              Nur für die Startseite
    │   ├── shop/              Nur für den Shop
    │   ├── socials/           Nur für die Socials
    │   └── discord/           Nur für Discord
    │
    ├── composables/      Wiederverwendbare Logik ohne Aussehen
    └── data/             Die Inhalte: Links, Produkte, Navigation ⭐
```

## Was gehört wohin?

| Ordner | Faustregel |
|---|---|
| `views/` | Eine **ganze Seite**. Es gibt genau so viele wie Adressen. |
| `components/` | Ein **Teil** einer Seite |
| `components/ui/` | Bausteine, die auf **mehreren** Seiten vorkommen |
| `composables/` | Logik, die **kein** Aussehen hat — z. B. das Klappmenü |
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

**`data/` ist für Inhalte, `assets/` ist für Material.**

Ein Produktname gehört nach `data/`. Das Foto dazu nach `assets/images/`.

## Siehe auch

- [05-Dateien-die-ich-haeufig-aendere](05-Dateien-die-ich-haeufig-aendere.md)
- [06-Dateien-die-ich-fast-nie-anfasse](06-Dateien-die-ich-fast-nie-anfasse.md)
