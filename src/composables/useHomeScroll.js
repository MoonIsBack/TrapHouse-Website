import { HOME_SCROLL_MODE } from '@/config/scrollConfig'
import { useChapterScroll } from '@/composables/useChapterScroll'
import { useModernScroll } from '@/composables/useModernScroll'

const SCROLL_MODES = {
  chapter: useChapterScroll,
  modern: useModernScroll,
}

// Zentrale Auswahl: HomeView muss nicht wissen, wie die beiden Varianten
// intern funktionieren. Sie startet nur den in scrollConfig.js gewählten Modus.
export function useHomeScroll() {
  const startScrollMode = SCROLL_MODES[HOME_SCROLL_MODE]

  if (!startScrollMode) {
    console.warn(`Unbekannter HOME_SCROLL_MODE: "${HOME_SCROLL_MODE}". Verwende "modern".`)
    useModernScroll()
    return
  }

  startScrollMode()
}
