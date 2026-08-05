import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Die gleitende Hervorhebung hinter dem Hover- bzw. aktiven Link in der
// Desktop-Navigation. Ausgelagert aus AppHeader.vue, damit die Komponente
// sich auf Vorlage und Verdrahtung beschränken kann — genau wie
// useMobileNav.js, das dieselbe Rolle für das Klappmenü übernimmt.
//
// WIE ES BENUTZT WIRD
//   const {
//     desktopNavRef, highlightVisible, highlightX, highlightWidth,
//     onNavPointerOver, onNavPointerLeave,
//   } = useNavHighlight()
//
//   <nav ref="desktopNavRef" @pointerover="onNavPointerOver" @pointerleave="onNavPointerLeave">
//     <span class="nav-highlight" :class="{ 'is-visible': highlightVisible }"
//           :style="{ '--nav-highlight-x': `${highlightX}px`, '--nav-highlight-width': `${highlightWidth}px` }" />
//     …Links…
//   </nav>
//
// Wie die Fläche aussieht, steht komplett im CSS von AppHeader.vue — dieselbe
// Arbeitsteilung wie bei usePointerSpotlight.js: Logik hier, Aussehen dort.
export function useNavHighlight() {
  const route = useRoute()
  const router = useRouter()

  const desktopNavRef = ref(null)
  const highlightVisible = ref(false)
  const highlightX = ref(0)
  const highlightWidth = ref(0)

  function positionHighlightOn(linkElement) {
    const containerElement = desktopNavRef.value
    if (!linkElement || !containerElement) return

    const containerRect = containerElement.getBoundingClientRect()
    const linkRect = linkElement.getBoundingClientRect()

    highlightX.value = linkRect.left - containerRect.left
    highlightWidth.value = linkRect.width
    highlightVisible.value = true
  }

  function activeLinkElement() {
    return desktopNavRef.value?.querySelector('.router-link-active') ?? null
  }

  // Beim Überfahren eines beliebigen Links dorthin gleiten. Ein einzelner
  // Lauscher am <nav> statt einem pro Link — dieselbe Delegations-Idee wie bei
  // haltExternenKlickAn im Fußbereich.
  function onNavPointerOver(event) {
    const link = event.target.closest('.nav-link')
    if (link) positionHighlightOn(link)
  }

  // Beim Verlassen zurück zum aktiven Eintrag — oder ganz verstecken, wenn
  // gerade keiner der Links die aktuelle Seite ist (z. B. auf einer Rechtsseite).
  function onNavPointerLeave() {
    const active = activeLinkElement()

    if (active) {
      positionHighlightOn(active)
    } else {
      highlightVisible.value = false
    }
  }

  // Nach jedem Seitenwechsel und einmal beim Laden auf den neuen aktiven Link
  // ausrichten. nextTick, weil der Router die Klasse "router-link-active" erst
  // setzt, nachdem Vue die Navigation neu gezeichnet hat.
  function syncHighlightToRoute() {
    nextTick(() => {
      const active = activeLinkElement()

      if (active) {
        positionHighlightOn(active)
      } else {
        highlightVisible.value = false
      }
    })
  }

  watch(() => route.fullPath, syncHighlightToRoute)

  onMounted(() => {
    // ⚠ NICHT einfach syncHighlightToRoute() direkt aufrufen: main.js hängt die
    // App ein, OHNE vorher auf router.isReady() zu warten (bewusst so — sonst
    // stünde die Seite beim ersten Laden kurz leer da, bis der Router fertig
    // ist). Dadurch läuft dieser onMounted-Block VOR der ersten Auflösung der
    // Route, und noch kein Link trägt die Klasse "router-link-active". Ein
    // nextTick() allein reicht hier nicht — das wartet nur auf Vues nächstes
    // Neuzeichnen, nicht auf die (separate, asynchrone) Routenauflösung.
    // router.isReady() wird genau dafür von vue-router angeboten.
    router.isReady().then(syncHighlightToRoute)

    // Ändert sich die Fensterbreite (oder die Schriftgröße im Betriebssystem),
    // verschieben sich auch die Linkbreiten — die Hervorhebung muss mitziehen.
    window.addEventListener('resize', syncHighlightToRoute)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncHighlightToRoute)
  })

  return {
    desktopNavRef,
    highlightVisible,
    highlightX,
    highlightWidth,
    onNavPointerOver,
    onNavPointerLeave,
  }
}
