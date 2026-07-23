// Die Einträge der Hauptnavigation — an EINER Stelle.
//
// Kopfbereich und Fußbereich lesen beide aus dieser Liste. Wenn du hier einen
// Eintrag hinzufügst, taucht er automatisch an beiden Stellen auf; du musst
// nichts doppelt pflegen und kannst nicht vergessen, eine Stelle mitzuändern.
//
// "name" muss mit dem Namen der Route in router/index.js übereinstimmen —
// darüber weiß die Navigation, welcher Eintrag gerade aktiv ist.
export const NAV_LINKS = [
  { name: 'home', label: 'Home' },
  { name: 'shop', label: 'Shop' },
  { name: 'discord', label: 'Discord' },
  { name: 'socials', label: 'Socials' },
]
