import { usePointerSpotlight } from '@/composables/usePointerSpotlight'
import { usePointerTilt } from '@/composables/usePointerTilt'

// Bündelt die beiden Zeiger-Composables, die zusammen den Eindruck einer
// hochwertigen Karte ergeben: der Lichtfleck aus usePointerSpotlight.js und
// das leichte 3D-Kippen aus usePointerTilt.js. Wird auf HighlightGrid.vue,
// ProductCard.vue und SocialCard.vue gleich benutzt — vorher stand die
// Bündelung dreimal fast identisch da.
//
// WIE ES BENUTZT WIRD
//   const { onPointerMove, onPointerLeave } = useCardInteraction()
//   <article class="… spotlight" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
//
// WARUM ÜBERHAUPT GEBÜNDELT WERDEN MUSS
// Vue erlaubt nur einen @pointermove-Handler pro Element. Ohne dieses
// Composable müsste jede Karte selbst eine kleine Funktion schreiben, die
// beide Composables aufruft — genau das stand vorher dreimal im Projekt.
export function useCardInteraction() {
  const { onPointerMove: moveSpotlight } = usePointerSpotlight()
  const { onPointerMove: moveTilt, onPointerLeave } = usePointerTilt()

  function onPointerMove(event) {
    moveSpotlight(event)
    moveTilt(event)
  }

  return { onPointerMove, onPointerLeave }
}
