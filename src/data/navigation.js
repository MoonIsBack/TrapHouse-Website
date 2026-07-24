// Die Einträge der Hauptnavigation — an EINER Stelle.
//
// Kopfbereich und Fußbereich lesen beide aus dieser Liste. Wenn du hier einen
// Eintrag hinzufügst, taucht er automatisch an beiden Stellen auf; du musst
// nichts doppelt pflegen und kannst nicht vergessen, eine Stelle mitzuändern.

// Wohin der RankRoom-Menüpunkt zeigt.
//
// Zwei verschiedene Ziele, je nachdem was gerade läuft:
//
//   npm run dev    → der Wert aus .env.development (dein lokaler Server)
//   npm run build  → die Adresse hinter dem ?? (die echte Seite)
//
// Warum der Umweg: Stünde hier fest "localhost:5174", würde der Menüpunkt bei
// jedem Besucher auf dessen EIGENEN Rechner zeigen und ins Leere laufen.
// Stünde hier fest die Live-Adresse, müsstest du beim Entwickeln jedes Mal
// die veröffentlichte Fassung aufrufen statt deiner lokalen Änderungen.
//
// ⚠ Die Live-Adresse ist derzeit nicht erreichbar, weil das RankRoom-Repo auf
// privat steht — GitHub Pages ist bei privaten Repos im kostenlosen Plan
// abgeschaltet. Lokal funktioniert der Link trotzdem.
export const RANKROOM_URL =
  import.meta.env.VITE_RANKROOM_URL ?? 'https://moonisback.github.io/RankRoom/'

// Zwei Arten von Einträgen:
//
//   { name: 'shop' }              → eine Unterseite dieser Website
//   { href: '…', external: true } → eine fremde Adresse, öffnet im neuen Tab
//
// "name" muss mit dem Namen der Route in router/index.js übereinstimmen —
// darüber weiß die Navigation, welcher Eintrag gerade aktiv ist.
export const NAV_LINKS = [
  { name: 'home', label: 'Home' },
  // Der Router-Name bleibt 'shop' (und die Adresse #/shop), nur die Beschriftung
  // heißt "Merch": Solange nichts bestellbar ist, wäre "Shop" ein Versprechen,
  // das die Seite nicht einlöst.
  { name: 'shop', label: 'Merch' },
  { name: 'discord', label: 'Discord' },
  { name: 'socials', label: 'Socials' },
  // "immerErreichbar" nimmt diesen Eintrag vom Schalter in config/linkConfig.js
  // aus: RankRoom ist dein eigenes Projekt und kein fremder Dienst. Steht der
  // Schalter auf false, sind Discord und die Social-Kanäle tot — RankRoom bleibt
  // erreichbar. Später soll es ohnehin Teil dieser Seite werden.
  { href: RANKROOM_URL, label: 'RankRoom', external: true, immerErreichbar: true },
]
