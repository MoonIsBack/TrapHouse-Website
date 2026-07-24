// HIER SCHALTEST DU DIE LINKS ZU FREMDEN DIENSTEN AN UND AUS
// ===========================================================
//
//   true   = alles normal. Discord, Instagram, TikTok und YouTube öffnen sich
//            wie erwartet in einem neuen Tab.
//
//   false  = die Knöpfe und Karten bleiben sichtbar und lassen sich anklicken,
//            aber es passiert nichts. Niemand landet auf einem fremden Dienst.
//
// Nach einer Änderung die Seite im Browser neu laden.
export const EXTERNE_LINKS_AKTIV = true

// WOFÜR IST DER SCHALTER GUT?
//
// Solange die Seite noch entsteht, willst du sie vielleicht schon herzeigen,
// ohne dass jemand versehentlich in einem halbfertigen Discord-Server landet.
// Oder ein Kanal wird umbenannt und der alte Link geht ins Leere — dann ist ein
// toter Link schlimmer als gar keiner.
//
// ⚠ WAS DER SCHALTER NICHT BETRIFFT
//
// 1. Die Navigation innerhalb der Seite (Home, Merch, Discord, Socials).
//    Die bleibt immer benutzbar — sonst wäre die Seite unbedienbar.
//
// 2. RankRoom. Das ist dein eigenes Projekt und kein fremder Dienst; es soll
//    immer erreichbar bleiben. Ausgenommen wird es nicht hier, sondern direkt
//    am Eintrag in data/navigation.js — dort steht "immerErreichbar: true".
//    So sieht man die Ausnahme dort, wo der Link definiert ist, und muss nicht
//    in dieser Datei nach einer versteckten Liste suchen.
//
// 3. Den Link zur Datenschutzerklärung des Hosters auf der Datenschutzseite.
//    Auf den muss verwiesen werden; ihn abzuschalten wäre keine Einstellung,
//    sondern ein Mangel.

// Darf dieser Link gerade benutzt werden?
//
// "immerErreichbar" hebt den Schalter für einzelne Ziele auf.
export function linkIstAktiv(immerErreichbar = false) {
  return EXTERNE_LINKS_AKTIV || immerErreichbar
}

// Wird an jeden Link zu einem fremden Dienst gehängt. Ist der Schalter aus,
// sagt diese Funktion dem Browser: "diesen Klick bitte ignorieren".
//
// WARUM SO UND NICHT DEN LINK GANZ WEGLASSEN?
// Ein <a> ohne href ist für Tastatur und Screenreader kein Link mehr — er
// verschwindet aus der Tab-Reihenfolge und wird nicht mehr angekündigt. Die
// Seite würde sich also je nach Schalterstellung unterschiedlich bedienen
// lassen. So bleibt alles an seinem Platz, nur das Ziel wird nicht geöffnet.
export function haltExternenKlickAn(event, immerErreichbar = false) {
  if (linkIstAktiv(immerErreichbar)) {
    return
  }

  event.preventDefault()
}
