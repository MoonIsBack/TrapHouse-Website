import { ref, onMounted, onBeforeUnmount } from 'vue'

// Wie weit ist die Seite gescrollt? Ergebnis zwischen 0 (ganz oben) und
// 1 (ganz unten).
//
// Wird für den dünnen Fortschrittsbalken ganz oben benutzt.
//
// WARUM NICHT DIE REINE CSS-LÖSUNG?
// Moderne Browser können das ohne JavaScript über "animation-timeline:
// scroll()". Das ist eleganter, wird aber noch nicht überall unterstützt —
// und ein Balken, der in manchen Browsern gar nicht mitwächst, ist schlechter
// als einer, der überall funktioniert. Sobald die Unterstützung flächendeckend
// ist, kann dieses Composable ersatzlos wegfallen.
export function useScrollProgress() {
  const progress = ref(0)

  let frame = 0

  function measure() {
    frame = 0

    // Die Strecke, die überhaupt gescrollt werden KANN: Gesamthöhe des
    // Dokuments minus die Höhe des Fensters.
    const scrollable = document.documentElement.scrollHeight - window.innerHeight

    // Passt die Seite komplett ins Fenster, gibt es nichts zu scrollen.
    // Ohne diese Abfrage stünde hier eine Division durch 0.
    if (scrollable <= 0) {
      progress.value = 0
      return
    }

    const value = window.scrollY / scrollable

    // Begrenzen, weil manche Browser beim Überziehen am Rand ("Gummiband"
    // auf iOS und macOS) kurzzeitig negative Werte oder Werte über 1 melden.
    progress.value = Math.min(1, Math.max(0, value))
  }

  // Beim Scrollen nur einen Neuzeichnen-Termin anmelden statt sofort zu
  // rechnen — derselbe Gedanke wie in usePointerSpotlight.js.
  function onScroll() {
    if (!frame) {
      frame = requestAnimationFrame(measure)
    }
  }

  onMounted(() => {
    // passive: true verspricht dem Browser, dass dieser Lauscher das Scrollen
    // nicht abbricht. Er muss dann nicht abwarten, was der Code tut.
    window.addEventListener('scroll', onScroll, { passive: true })

    // Bei Größenänderung ändert sich die scrollbare Strecke — sonst zeigt der
    // Balken nach dem Drehen des Handys einen falschen Wert.
    window.addEventListener('resize', onScroll, { passive: true })

    measure()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(frame)
  })

  return { progress }
}
