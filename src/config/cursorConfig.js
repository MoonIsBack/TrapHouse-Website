// HIER SCHALTEST DU DEN EIGENEN CURSOR AN UND AUS
// =================================================
//
//   true   = Punkt + nachziehender Ring statt des normalen Zeigers, wächst
//            über Links, Knöpfen und Karten.
//
//   false  = ganz normaler, nativer Mauszeiger. AppCursor.vue tut dann
//            buchstäblich nichts — kein Lauscher wird angehängt.
//
// Nach einer Änderung die Seite im Browser neu laden.
//
// ⚠ Betrifft ausschließlich Geräte mit echtem Zeiger. Auf Touchscreens und
// bei "Bewegung reduzieren" bleibt es so oder so beim nativen Zeiger — dieser
// Schalter kommt dort gar nicht erst zum Tragen.
export const EIGENER_CURSOR_AKTIV = false
