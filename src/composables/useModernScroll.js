import { onMounted, onUnmounted } from 'vue'

// Klassisches modernes Scrollen:
// Der Browser behält die vollständige Kontrolle über Trackpad, Mausrad und
// Touch. CSS hilft nur sanft dabei, an einem Themenanfang einzurasten.
export function useModernScroll() {
  onMounted(() => {
    document.documentElement.classList.add('home-modern-scroll')
  })

  onUnmounted(() => {
    document.documentElement.classList.remove('home-modern-scroll')
  })
}
