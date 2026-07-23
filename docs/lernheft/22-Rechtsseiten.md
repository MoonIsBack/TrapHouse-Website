# ⭐ Impressum und Datenschutz

## Wofür ist das?

Die Rechtsseiten sind gebaut, aber **noch nicht ausgefüllt**. Dieses Kapitel
erklärt, was du eintragen musst und warum es so aufgebaut ist.

> ⚠ Ich bin kein Anwalt, und dieses Kapitel ist keine Rechtsberatung. Es
> beschreibt, wie die Dateien funktionieren. Ob der Inhalt für deinen Fall
> ausreicht, sollte jemand mit Fachkenntnis beurteilen — besonders sobald
> wirklich Merch verkauft wird.

## Die eine Datei, die du ausfüllen musst

**`src/config/legalConfig.js`** — das ist alles.

Impressum und Datenschutzerklärung lesen ihre Angaben von dort. In den beiden
Views steht kein einziger Name und keine einzige Adresse fest im Code.

```js
export const operator = {
  name: 'AUSFÜLLEN: Vor- und Nachname',
  street: 'AUSFÜLLEN: Straße und Hausnummer',
  zip: 'AUSFÜLLEN: PLZ',
  city: 'AUSFÜLLEN: Ort',
  email: 'AUSFÜLLEN: deine@email.de',
  …
}
```

### Die eingebaute Bremse

Solange irgendwo `AUSFÜLLEN` steht, zeigen beide Rechtsseiten oben einen roten
Warnkasten:

> **Diese Seite ist noch nicht ausgefüllt.**

Der verschwindet automatisch, sobald du alles ersetzt hast. Der Sinn: Nach dem
fünfzigsten Mal Draufschauen sieht man einen Platzhalter selbst nicht mehr —
ein rot umrandeter Kasten fällt trotzdem auf.

Die Prüfung dahinter ist eine Zeile in `legalConfig.js`:

```js
export function hasPlaceholders() {
  return Object.values(operator).some(
    (value) => typeof value === 'string' && value.startsWith('AUSFÜLLEN'),
  )
}
```

## ⚠ Der Punkt, über den du vorher nachdenken solltest

Ein Impressum braucht eine **ladungsfähige Anschrift** — eine echte Adresse,
unter der dich die Post erreicht. Ein Postfach reicht nach § 5 DDG nicht.

Für eine Privatperson bedeutet das: **deine Wohnadresse steht öffentlich im
Netz.** Bei einer Community mit Reichweite ist das eine Entscheidung, keine
Formalität.

Die üblichen Auswege sind ein Dienstleister mit ladungsfähiger Anschrift oder
eine c/o-Adresse. Beides kostet etwas und ist nicht in jeder Konstellation
zulässig — das ist der Punkt, an dem sich einmal fachlicher Rat wirklich lohnt.

## Die Schalter

```js
export const legalFacts = {
  usesCookies: false,
  usesThirdParty: false,
  hasContactForm: false,
  sellsGoods: false,
}
```

Sie blenden Abschnitte ein und aus. **Stell sie ehrlich ein.** Ein Abschnitt,
der behauptet „wir setzen keine Cookies", während welche gesetzt werden, ist
schlimmer als gar keiner.

| Schalter | Auf `true` stellen, wenn … | Was dann passiert |
|---|---|---|
| `usesCookies` | irgendetwas Cookies setzt | Du brauchst zusätzlich ein Einwilligungsbanner |
| `usesThirdParty` | du etwas von fremden Servern lädst | Der „keine externen Dienste"-Absatz verschwindet |
| `hasContactForm` | es ein Formular gibt | Ein Hinweis erscheint, dass der Abschnitt noch fehlt |
| `sellsGoods` | wirklich verkauft wird | Hinweis, dass AGB und Widerruf fehlen |

## Warum echte Adressen statt Popups?

RankRoom zeigt seine Rechtsseiten als Popup. Das war dort die einzige
Möglichkeit — es gab noch keinen Router.

TrapHouse hat einen, deshalb sind es hier echte Adressen:

```
#/impressum
#/datenschutz
```

Der Grund ist nicht Bequemlichkeit: § 5 DDG verlangt, dass das Impressum
„leicht erkennbar, unmittelbar erreichbar und ständig verfügbar" ist. Eine
eigene Adresse lässt sich verlinken, in einem neuen Tab öffnen und weitergeben.
Genau das erwartet man bei Impressum und Datenschutz.

Die Links stehen im Fußbereich und damit auf **jeder** Seite.
⚠ Nimm sie dort nicht heraus.

## ⭐ Was in der Datenschutzerklärung steht — und warum

Der Reflex wäre: „Wir speichern gar nichts." Das wäre **falsch**.

Diese Seite lädt zwar nichts von fremden Servern und setzt keine Cookies. Aber
der **Hoster** (GitHub) protokolliert jeden Aufruf samt IP-Adresse. Eine
IP-Adresse ist ein personenbezogenes Datum. Wir sehen diese Protokolle nie und
werten nichts aus — trotzdem findet die Verarbeitung statt und gehört
offengelegt.

Deshalb enthält die Erklärung den Abschnitt „Hosting und Server-Logfiles" samt
Hinweis auf die Datenübermittlung in die USA.

> **Eine Datenschutzerklärung, die etwas verschweigt, ist gefährlicher als eine
> mit einem unangenehmen Absatz.**

⚠ Ziehst du auf einen anderen Hoster um (Netlify, Vercel, eigener Server), musst
du den `hoster`-Block in `legalConfig.js` austauschen. Bei einem Hoster mit Sitz
in der EU kannst du zusätzlich `outsideEu: false` setzen — dann verschwindet der
Drittland-Absatz.

## Was du NICHT einbauen solltest

Viele Impressum-Generatoren fügen noch einen Absatz zur **OS-Plattform der
EU-Kommission** ein („Plattform zur Online-Streitbeilegung").

**Der gehört nicht mehr hinein.** Die Plattform wurde zum 20. Juli 2025
eingestellt und die zugrunde liegende Verordnung aufgehoben. Ein Link darauf
zeigt heute ins Leere.

Wenn dein Generator so einen Absatz ausspuckt: weglassen.

## Der Stand unten auf der Seite

```vue
<LegalPage title="Impressum" updated="Juli 2026">
```

⚠ Dieses Datum wird **von Hand** gepflegt und nicht automatisch gesetzt. Ein
Stand, der sich täglich selbst aktualisiert, ohne dass sich am Text etwas
geändert hat, ist eine Falschangabe. Änderst du den Inhalt, änderst du das
Datum mit.

## Deine Checkliste vor dem Online-Gehen

- [ ] Entschieden, welche Adresse ins Impressum kommt
- [ ] `legalConfig.js` vollständig ausgefüllt
- [ ] Beide Seiten aufgerufen — kein roter Warnkasten mehr
- [ ] E-Mail-Adresse geprüft: kommt Post dort wirklich an?
- [ ] `legalFacts` ehrlich eingestellt
- [ ] Discord-Link eingetragen (`data/socialLinks.js`)
- [ ] Bei echtem Verkauf: AGB und Widerrufsbelehrung ergänzt

## 💡 Merken

**Eine Datei ausfüllen — `src/config/legalConfig.js` — und beide Rechtsseiten
sind fertig.** Der rote Kasten sagt dir, wann du durch bist.

## Siehe auch

- [40-Was-noch-fehlt](40-Was-noch-fehlt.md) — die übrigen offenen Punkte
- [21-Inhalte-aendern](21-Inhalte-aendern.md)
