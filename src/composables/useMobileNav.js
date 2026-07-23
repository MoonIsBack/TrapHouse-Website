import { ref, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Steuert das aufklappbare Menü auf dem Handy.
//
// In der alten Seite war der ☰-Knopf reine Deko: Er hatte keinerlei Funktion,
// und die Navigation klappte auf schmalen Bildschirmen einfach untereinander.
// Hier macht er wirklich etwas.
//
// Drei Dinge, die man dabei leicht vergisst und die hier alle erledigt werden:
//   1. Beim Seitenwechsel muss das Menü zugehen — sonst tippt man auf "Shop"
//      und schaut weiter auf das Menü statt auf den Shop.
//   2. Escape muss es schließen. Das erwartet jeder, der eine Tastatur hat.
//   3. Solange es offen ist, darf die Seite dahinter nicht mitscrollen.
export function useMobileNav() {
  const isOpen = ref(false)
  const route = useRoute()

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      close()
    }
  }

  // Schließt automatisch, sobald eine andere Seite geöffnet wird
  watch(() => route.fullPath, close)

  // Die Seite hinter dem offenen Menü festhalten.
  //
  // Der Escape-Lauscher hängt am document und nicht am Menü selbst: Sonst
  // würde er nur reagieren, wenn der Tastaturfokus zufällig im Menü sitzt.
  watch(isOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''

    if (open) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  // Aufräumen, falls die Komponente verschwindet, während das Menü offen ist.
  // Ohne das bliebe die Seite gesperrt und ein Lauscher hinge für immer am
  // document — ein Fehler, den man erst Wochen später bemerkt.
  onBeforeUnmount(() => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  })

  return { isOpen, open, close, toggle }
}
