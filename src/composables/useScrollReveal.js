import { onMounted, onBeforeUnmount } from 'vue'

// Lässt Elemente sanft einblenden, sobald sie beim Scrollen ins Bild kommen.
//
// WIE ES BENUTZT WIRD
// Elementen im Template die Klasse "reveal" geben und in der Komponente einmal
// useScrollReveal() aufrufen. Mehr ist nicht nötig — die Klasse "is-visible"
// hängt dieses Composable an, das Aussehen steht in main.css.
//
// WARUM IntersectionObserver UND NICHT EIN SCROLL-LAUSCHER
// Ein Lauscher auf das Scroll-Ereignis feuert bei jeder kleinsten Bewegung
// hunderte Male pro Sekunde, und man müsste für jedes Element selbst
// nachrechnen, wo es gerade steht. Der IntersectionObserver ist im Browser
// eingebaut, macht genau diese Rechnung selbst und meldet sich nur dann,
// wenn sich wirklich etwas ändert.
//
// WARUM unobserve NACH DEM EINBLENDEN
// Ohne das würden Elemente beim Zurückscrollen wieder verschwinden und beim
// erneuten Herunterscrollen noch einmal einfliegen. Das wirkt nach dem
// zweiten Mal nur noch nervös. Einmal sichtbar heißt: bleibt sichtbar.
export function useScrollReveal() {
  let observer = null

  onMounted(() => {
    const elements = document.querySelectorAll('.reveal')

    // Wer im Betriebssystem "Bewegung reduzieren" eingestellt hat, soll den
    // Inhalt sofort und vollständig sehen. main.css setzt .reveal dafür schon
    // zurück; hier wird zusätzlich gar kein Beobachter erst gestartet.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        // Erst auslösen, wenn ein gutes Stück des Elements zu sehen ist —
        // sonst blendet es schon ein, während es noch am Rand klebt.
        threshold: 0.15,

        // Der negative Wert unten zieht die Auslöselinie ein Stück nach oben:
        // Das Element blendet ein, kurz BEVOR es ganz im Bild ist. Dadurch
        // wirkt es beim Scrollen bereits fertig statt hinterherzuhinken.
        rootMargin: '0px 0px -60px 0px',
      },
    )

    elements.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => {
    // Der Beobachter hält Verweise auf DOM-Elemente fest. Ohne disconnect
    // blieben die im Speicher liegen, obwohl die Seite längst gewechselt hat.
    observer?.disconnect()
  })
}
