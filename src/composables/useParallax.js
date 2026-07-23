import { ref, onMounted, onBeforeUnmount } from 'vue'

// Lässt ein Element beim Scrollen langsamer mitwandern als der Rest der Seite.
//
// Dieser Tiefeneffekt heißt Parallaxe. Er kommt daher, wie Entfernung in der
// Wirklichkeit funktioniert: Fährst du Auto, rasen die Leitpfosten am
// Straßenrand vorbei, während die Berge am Horizont fast stehen bleiben. Ein
// Hintergrund, der langsamer läuft als der Vordergrund, wirkt deshalb weiter
// weg — die Seite bekommt Tiefe statt flach zu wirken.
//
// BENUTZUNG
//   const bild = useParallax(0.25)
//   <img ref="bild" … />
//
// Die Stärke ist der Anteil der Scroll-Strecke, den das Element mitgeht:
//   0    = klebt fest (kein Effekt)
//   0.25 = wandert ein Viertel so weit wie die Seite  ← guter Wert
//   1    = scrollt normal mit (auch kein Effekt)
//
// ⚠ Über etwa 0.4 wird es unangenehm: Das Bild "schwimmt" dann sichtbar
// gegenüber dem Text und wirkt nicht mehr wie Tiefe, sondern wie ein Fehler.
export function useParallax(strength = 0.25) {
  const element = ref(null)

  let frame = 0
  let enabled = true

  function apply() {
    frame = 0

    if (!element.value || !enabled) {
      return
    }

    const offset = window.scrollY * strength
    element.value.style.transform = `translate3d(0, ${offset}px, 0)`
  }

  function onScroll() {
    // Nur rechnen, solange der Bereich überhaupt sichtbar sein kann. Weiter
    // unten auf der Seite ist der Hero längst außer Sicht — dann wäre jede
    // weitere Rechnung verschenkt.
    if (window.scrollY > window.innerHeight * 1.5) {
      return
    }

    if (!frame) {
      frame = requestAnimationFrame(apply)
    }
  }

  onMounted(() => {
    // Wer "Bewegung reduzieren" eingestellt hat, bekommt keinen Effekt.
    // Parallaxe ist einer der häufigsten Auslöser für Unwohlsein beim Scrollen,
    // weil sich zwei Ebenen unterschiedlich schnell bewegen.
    enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!enabled) {
      return
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    apply()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  })

  return element
}
