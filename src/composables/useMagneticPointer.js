// Lässt einen Knopf sich ein kleines Stück in Richtung Zeiger ziehen — der
// "Magnet"-Effekt, den man von hochwertigen SaaS-Landingpages kennt. Macht
// aus einem Klickziel etwas, das auf Nähe reagiert, statt nur starr dazustehen.
//
// WIE ES BENUTZT WIRD
// Im Template dem Element die Klasse "magnetic" geben und beide Lauscher
// anhängen:
//
//   const { onPointerMove, onPointerLeave } = useMagneticPointer()
//   <button class="… magnetic" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
//
// Wie sich der Zug auswirkt, steht in BaseButton.vue bei ".magnetic". Dieses
// Composable liefert nur die Verschiebung — dieselbe Arbeitsteilung wie bei
// usePointerSpotlight.js und usePointerTilt.js.
//
// WARUM requestAnimationFrame
// Dasselbe Argument wie bei den beiden anderen Zeiger-Composables: Position
// nur merken, geschrieben wird erst beim nächsten Bild, das der Browser
// ohnehin zeichnet.
//
// ⚠ MAX_PULL_PX stand hier einmal auf 10 (bei einem Faktor von 0.3 auf den
// Abstand von der Mitte). Das zog große Knöpfe schon bei einer Mausbewegung
// am Rand spürbar aus der Form — der Effekt sollte eine Ahnung von Magnetismus
// geben, keinen sichtbaren Ruck. 5px bei einem kleineren Faktor bleibt als
// Feingefühl wahrnehmbar, ohne aufdringlich zu wirken.
const MAX_PULL_PX = 5
const PULL_FACTOR = 0.18

export function useMagneticPointer() {
  let frame = 0
  let pendingElement = null
  let pendingX = 0
  let pendingY = 0

  function write() {
    frame = 0

    if (!pendingElement) {
      return
    }

    pendingElement.style.setProperty('--tx', `${pendingX}px`)
    pendingElement.style.setProperty('--ty', `${pendingY}px`)
  }

  function onPointerMove(event) {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    // Abstand von der Kartenmitte, nicht von der Ecke — der Knopf soll sich
    // zur Zeigerposition hin ziehen, nicht zu seinem linken oberen Rand.
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    pendingElement = element
    // Geclampt auf MAX_PULL_PX: Ohne Grenze würde ein großer Knopf bei einer
    // Zeigerbewegung am Rand unnatürlich weit hinterherspringen.
    pendingX = Math.max(-MAX_PULL_PX, Math.min(MAX_PULL_PX, offsetX * PULL_FACTOR))
    pendingY = Math.max(-MAX_PULL_PX, Math.min(MAX_PULL_PX, offsetY * PULL_FACTOR))

    if (!frame) {
      frame = requestAnimationFrame(write)
    }
  }

  function onPointerLeave(event) {
    // Direkt zurücksetzen statt über RAF — die Feder-Kurve in CSS übernimmt
    // die eigentliche Bewegung zurück zur Ruheposition.
    event.currentTarget.style.setProperty('--tx', '0px')
    event.currentTarget.style.setProperty('--ty', '0px')
  }

  return { onPointerMove, onPointerLeave }
}
