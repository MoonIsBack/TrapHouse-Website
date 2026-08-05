// Lässt eine Karte sich leicht der Zeigerposition entgegenneigen — eine
// dezente 3D-Perspektive, die zusammen mit dem Lichtfleck (usePointerSpotlight)
// den "hochwertigen SaaS-Karten"-Eindruck ergibt.
//
// WIE ES BENUTZT WIRD
// Im Template dem Element die Klasse "tilt" geben und beide Lauscher
// anhängen (meist zusammen mit usePointerSpotlight im selben Handler):
//
//   const { onPointerMove, onPointerLeave } = usePointerTilt()
//   <article class="… tilt" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
//
// Wie sich die Neigung auswirkt, steht in main.css bei ".tilt". Dieses
// Composable liefert nur den Winkel — dieselbe Arbeitsteilung wie bei
// usePointerSpotlight.js: Logik hier, Aussehen im CSS.
//
// WARUM requestAnimationFrame
// Dasselbe Argument wie bei usePointerSpotlight.js: pointermove feuert bis zu
// hundertmal pro Sekunde, sichtbar wird davon höchstens jedes 60stel. Die
// Position wird deshalb nur gemerkt, geschrieben wird erst beim nächsten Bild.
//
// ⚠ Stand hier einmal auf 7: Zusammen mit der kurzen Übergangsdauer in den
// Komponenten (siehe z. B. HighlightGrid.vue) kippte die Karte beim ersten
// Betreten mit der Maus spürbar hart in ihre Neigung — vor allem, wenn der
// Zeiger nah an einer Ecke ankam. 4 Grad bleibt als Tiefenwirkung sichtbar,
// wirkt aber nicht mehr wie ein Ruck.
const MAX_TILT_DEGREES = 4

export function usePointerTilt() {
  let frame = 0
  let pendingElement = null
  let pendingRotateX = 0
  let pendingRotateY = 0

  function write() {
    frame = 0

    if (!pendingElement) {
      return
    }

    pendingElement.style.setProperty('--rx', `${pendingRotateX}deg`)
    pendingElement.style.setProperty('--ry', `${pendingRotateY}deg`)
  }

  function onPointerMove(event) {
    // currentTarget statt target — siehe usePointerSpotlight.js. Sonst würde
    // die Karte je nach Kindelement, über dem der Zeiger gerade steht,
    // unterschiedlich berechnet.
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    // 0 bis 1 über die Kartenfläche, dann auf -0.5 bis 0.5 verschoben —
    // die Kartenmitte ist also der Nullpunkt, an dem gar nicht gekippt wird.
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5

    pendingElement = element
    // Nach oben zeigt der Zeiger, nach vorne kippt die Karte — deshalb das
    // Vorzeichen bei X gedreht: Zeiger oben (negatives relativeY) soll die
    // Karte nach hinten oben neigen, nicht nach unten.
    pendingRotateX = relativeY * MAX_TILT_DEGREES * -1
    pendingRotateY = relativeX * MAX_TILT_DEGREES

    if (!frame) {
      frame = requestAnimationFrame(write)
    }
  }

  function onPointerLeave(event) {
    // Direkt zurücksetzen statt über RAF: Beim Verlassen soll die Karte ohne
    // Verzögerung in ihre CSS-Transition zurückfinden.
    event.currentTarget.style.setProperty('--rx', '0deg')
    event.currentTarget.style.setProperty('--ry', '0deg')
  }

  return { onPointerMove, onPointerLeave }
}
