// Lässt einen weichen Lichtfleck dem Mauszeiger über einer Karte folgen.
//
// WIE ES BENUTZT WIRD
// Im Template dem Element die Klasse "spotlight" geben und den Zeiger-Lauscher
// anhängen:
//
//   const { onPointerMove } = usePointerSpotlight()
//   <article class="… spotlight" @pointermove="onPointerMove">
//
// Wie der Fleck aussieht, steht komplett in main.css bei ".spotlight". Dieses
// Composable liefert nur die Position — dieselbe Arbeitsteilung wie bei
// useScrollReveal.js: Logik hier, Aussehen im CSS.
//
// WARUM requestAnimationFrame
// pointermove feuert bei schneller Mausbewegung leicht 100-mal pro Sekunde.
// Jedes Mal direkt eine CSS-Variable zu setzen, zwingt den Browser zu
// entsprechend vielen Neuberechnungen — davon sieht man aber höchstens 60,
// weil öfter gar nicht neu gezeichnet wird.
//
// Deshalb wird die Position nur gemerkt und das Schreiben an den Browser
// abgegeben: Er ruft die Funktion genau dann auf, wenn er ohnehin das nächste
// Bild zeichnet. Alles, was zwischendurch hereinkommt, überschreibt nur den
// gemerkten Wert und kostet nichts.
export function usePointerSpotlight() {
  let frame = 0
  let pendingElement = null
  let pendingX = 0
  let pendingY = 0

  function write() {
    frame = 0

    if (!pendingElement) {
      return
    }

    pendingElement.style.setProperty('--mx', `${pendingX}px`)
    pendingElement.style.setProperty('--my', `${pendingY}px`)
  }

  function onPointerMove(event) {
    // currentTarget ist das Element mit dem Lauscher (die Karte).
    // NICHT target nehmen — das wäre das Kind, über dem der Zeiger gerade
    // steht, also mal das Bild, mal die Überschrift. Die Fleckposition würde
    // dann je nach Untergrund umspringen.
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    pendingElement = element
    pendingX = event.clientX - rect.left
    pendingY = event.clientY - rect.top

    if (!frame) {
      frame = requestAnimationFrame(write)
    }
  }

  return { onPointerMove }
}
