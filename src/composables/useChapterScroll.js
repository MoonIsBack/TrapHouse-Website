import { onMounted, onUnmounted } from 'vue'

// Fährt auf der Startseite mit einer klaren Scroll-Geste zum nächsten Thema.
// Nur Desktop-Mausräder und Trackpads werden übernommen; Touch-Geräte behalten
// ihr gewohntes natives Scrollverhalten.
export function useChapterScroll() {
  let animationFrame = 0
  let isAnimating = false
  let scrollUpdateFrame = 0
  let waitingForNewGesture = false
  let lastWheelStrength = 0
  let lastWheelTime = 0
  let previousScrollBehavior = ''

  // Nicht an eine feste Fenstergröße koppeln: Entscheidend ist, ob Maus oder
  // Touchpad benutzt werden. Ein schmales Desktop-Fenster funktioniert damit
  // genauso wie ein großer Monitor; Touchscreens scrollen weiterhin nativ.
  const desktopQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  function headerOffset() {
    const styles = getComputedStyle(document.documentElement)
    const headerHeight = Number.parseFloat(styles.getPropertyValue('--header-height')) || 0
    return headerHeight + 16
  }

  function panels() {
    return [...document.querySelectorAll('[data-scroll-panel]')]
  }

  function easeOutQuint(value) {
    return 1 - (1 - value) ** 5
  }

  function updateActivePanel() {
    const viewportCenter = window.innerHeight / 2
    let closestPanel
    let closestDistance = Number.POSITIVE_INFINITY

    for (const panel of panels()) {
      const rectangle = panel.getBoundingClientRect()
      const panelCenter = rectangle.top + rectangle.height / 2
      const distance = Math.abs(panelCenter - viewportCenter)

      if (distance < closestDistance) {
        closestPanel = panel
        closestDistance = distance
      }
    }

    for (const panel of panels()) {
      panel.classList.toggle('is-scroll-active', panel === closestPanel)
    }
  }

  function onScroll() {
    if (scrollUpdateFrame) return

    scrollUpdateFrame = requestAnimationFrame(() => {
      updateActivePanel()
      scrollUpdateFrame = 0
    })
  }

  function animateTo(target) {
    const startTop = window.scrollY
    const distance = target.top - startTop
    const duration = Math.min(420, Math.max(280, Math.abs(distance) * 0.22))
    const startTime = performance.now()

    isAnimating = true
    previousScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration)
      window.scrollTo(0, startTop + distance * easeOutQuint(progress))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
        return
      }

      window.scrollTo(0, target.top)
      document.documentElement.style.scrollBehavior = previousScrollBehavior
      isAnimating = false
    }

    animationFrame = requestAnimationFrame(step)
  }

  function scrollDecision(direction) {
    const currentTop = window.scrollY
    const positions = panels().map((panel) => {
      const rectangle = panel.getBoundingClientRect()
      const documentTop = rectangle.top + window.scrollY

      return {
        panel,
        top: Math.max(0, documentTop - headerOffset()),
        bottom: documentTop + rectangle.height,
      }
    })
    const positionTolerance = 24
    let currentIndex = 0

    // Der zuletzt begonnene Abschnitt ist das aktuelle Kapitel. Das gilt auch
    // in der Lücke zum nächsten Kapitel, etwa während eines Laufbands.
    for (let index = 0; index < positions.length; index += 1) {
      if (positions[index].top <= currentTop + positionTolerance) currentIndex = index
    }

    const current = positions[currentIndex]

    if (direction > 0) {
      // Ist ein responsiver Abschnitt höher als das Fenster, darin erst normal
      // bis zum unteren Rand scrollen. Danach beginnt der Kapitelwechsel.
      const lastInnerPosition = Math.max(current.top, current.bottom - window.innerHeight)
      // Der Hero beginnt konstruktionsbedingt direkt unter dem Header und darf
      // dessen Höhe als Überstand besitzen. Bei Inhaltskapiteln ist die Toleranz
      // klein, damit ihr unterer Inhalt wirklich vollständig erreichbar bleibt.
      const overflowTolerance = currentIndex === 0 ? headerOffset() : positionTolerance
      if (currentTop < lastInnerPosition - overflowTolerance) return { native: true }

      return positions[currentIndex + 1]
    }

    // Beim Hochscrollen entsprechend erst den Anfang des aktuellen, längeren
    // Abschnitts erreichen und erst dann ins vorige Kapitel wechseln.
    if (currentTop > current.top + positionTolerance) return { native: true }

    return positions[currentIndex - 1]
  }

  function onWheel(event) {
    if (!desktopQuery.matches || reducedMotionQuery.matches || event.ctrlKey) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

    const now = performance.now()
    const strength = Math.abs(event.deltaY)

    // Während der kurzen Bewegung nur den Nachlauf beobachten. Eine neue Geste
    // wird danach an einer Pause oder erneut steigender Intensität erkannt.
    if (isAnimating) {
      event.preventDefault()
      lastWheelStrength = strength
      lastWheelTime = now
      return
    }

    // Bereits der erste messbare Touchpad-Impuls entspricht einem Kapitel.
    if (event.deltaY === 0) return

    if (waitingForNewGesture) {
      const hadPause = now - lastWheelTime > 90
      const acceleratesAgain = strength >= 2 && strength > lastWheelStrength * 1.35

      if (!hadPause && !acceleratesAgain) {
        event.preventDefault()
        lastWheelStrength = strength
        lastWheelTime = now
        return
      }

      waitingForNewGesture = false
    }

    const direction = Math.sign(event.deltaY)
    const decision = scrollDecision(direction)

    // Innerhalb eines langen responsiven Kapitels sowie vor dem ersten und
    // hinter dem letzten Kapitel bleibt das Scrollen vollständig nativ.
    if (!decision || decision.native) {
      lastWheelStrength = strength
      lastWheelTime = now
      return
    }

    event.preventDefault()
    waitingForNewGesture = true
    lastWheelStrength = strength
    lastWheelTime = now
    animateTo(decision)
  }

  onMounted(() => {
    updateActivePanel()
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(animationFrame)
    cancelAnimationFrame(scrollUpdateFrame)
    document.documentElement.style.scrollBehavior = previousScrollBehavior
  })
}
