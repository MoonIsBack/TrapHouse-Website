<script setup>
// Der Kopfbereich: Logo, Navigation und der Discord-Knopf.
//
// Er klebt oben am Bildschirm und wird beim Scrollen von durchsichtig zu
// milchig — solange man ganz oben im Hero steht, soll er nicht als Balken
// über dem Bild liegen.
//
// Die Navigationseinträge kommen aus data/navigation.js; der Kopfbereich
// entscheidet nicht selbst, welche Seiten es gibt.
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { NAV_LINKS } from '@/data/navigation'
import { DISCORD_INVITE } from '@/data/socialLinks'
import { useMobileNav } from '@/composables/useMobileNav'

import BaseButton from '@/components/ui/BaseButton.vue'
import NavLink from '@/components/ui/NavLink.vue'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconMenu from '@/components/icons/IconMenu.vue'
import IconClose from '@/components/icons/IconClose.vue'
import logo from '@/assets/images/traphouse-logo.webp'

const { isOpen, toggle, close } = useMobileNav()
const route = useRoute()
const router = useRouter()

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 12
}

// GLEITENDE HERVORHEBUNG IN DER NAVIGATION
// =========================================
// Statt eines statischen Punkts unter dem aktiven Eintrag (das war vorher
// die einzige Kennzeichnung) gleitet jetzt eine Fläche hinter Hover- und
// aktivem Link her. Position und Breite kommen per getBoundingClientRect —
// dieselbe Technik, mit der auch usePointerSpotlight.js & Co. arbeiten, nur
// hier ohne eigenes Composable, weil sie ausschließlich hier gebraucht wird.
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
  // passive: true sagt dem Browser zu, dass dieser Lauscher das Scrollen
  // niemals abbricht. Er muss dann nicht abwarten, was der Code tut, und
  // das Scrollen bleibt auch auf schwächeren Geräten flüssig.
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Einmal direkt aufrufen: Wer die Seite mittendrin neu lädt, startet nicht
  // zwangsläufig ganz oben.
  handleScroll()

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
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', syncHighlightToRoute)
})
</script>

<template>
  <header class="app-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-inner">
      <RouterLink :to="{ name: 'home' }" class="logo-link" aria-label="TrapHouse — zur Startseite">
        <img :src="logo" alt="TrapHouse" class="logo" width="480" height="215" />
      </RouterLink>

      <!-- DESKTOP-NAVIGATION
           NavLink entscheidet je Eintrag, ob ein RouterLink oder ein externer
           Link daraus wird. Bei internen Einträgen vergibt der Router die
           Klasse "router-link-active" selbst — deshalb muss hier nichts von
           Hand verglichen werden.

           :key ist das Label und nicht der Name: Externe Einträge haben gar
           keinen "name", und ein v-for ohne eindeutigen key führt zu
           merkwürdigen Fehlern beim Neuzeichnen. -->
      <nav
        ref="desktopNavRef"
        class="desktop-nav"
        aria-label="Hauptnavigation"
        @pointerover="onNavPointerOver"
        @pointerleave="onNavPointerLeave"
      >
        <span
          class="nav-highlight"
          :class="{ 'is-visible': highlightVisible }"
          :style="{
            '--nav-highlight-x': `${highlightX}px`,
            '--nav-highlight-width': `${highlightWidth}px`,
          }"
          aria-hidden="true"
        />

        <NavLink
          v-for="link in NAV_LINKS"
          :key="link.label"
          :link="link"
          navigate-on-pointer-down
        />
      </nav>

      <div class="header-actions">
        <BaseButton :href="DISCORD_INVITE" variant="primary" class="discord-button">
          <IconDiscord />
          Discord
        </BaseButton>

        <!-- :aria-expanded teilt Screenreadern mit, ob das Menü gerade offen
             ist. aria-controls verweist auf das Element, das der Knopf steuert. -->
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isOpen"
          aria-controls="mobile-nav"
          :aria-label="isOpen ? 'Menü schließen' : 'Menü öffnen'"
          @click="toggle"
        >
          <IconClose v-if="isOpen" />
          <IconMenu v-else />
        </button>
      </div>
    </div>

    <!-- HANDY-NAVIGATION
         <Transition> blendet das Panel weich ein und aus. v-if statt v-show,
         damit die Links im geschlossenen Zustand gar nicht erst existieren und
         beim Durchtabben nicht angesprungen werden können. -->
    <Transition name="slide">
      <nav v-if="isOpen" id="mobile-nav" class="mobile-nav" aria-label="Hauptnavigation">
        <NavLink v-for="link in NAV_LINKS" :key="link.label" :link="link" @navigate="close" />
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  border-bottom: 1px solid transparent;

  /* ⚠ backdrop-filter steht bewusst NICHT in dieser Liste. Eine Fläche
     weichzuzeichnen ist teuer; sie über eine Viertelsekunde hinweg
     stufenweise weichzuzeichnen heißt, das bei jedem Bild neu zu tun.
     Hintergrund und Rahmen blenden weiterhin weich ein, der Weichzeichner
     schaltet hart um — sehen kann man den Unterschied nicht.
     → docs/lernheft/13-Design-Tokens-und-Farben.md */
  transition:
    background var(--transition),
    border-color var(--transition);
}

/* Erst beim Scrollen bekommt der Kopfbereich einen Hintergrund. Ganz oben
   liegt er unsichtbar über dem Hero-Bild. */
.is-scrolled {
  border-bottom-color: var(--border-soft);
  background: rgba(var(--bg-bottom-rgb), 0.72);
  backdrop-filter: blur(16px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  height: var(--header-height);
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo {
  width: auto;
  height: 34px;
  transition: opacity var(--transition);
}

.logo-link:hover .logo {
  opacity: 0.82;
}

/* --- Navigation auf großen Bildschirmen --- */
.desktop-nav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;

  /* Nimmt den freien Platz ein und schiebt sich damit in die Mitte */
  margin: 0 auto;
}

/* DIE GLEITENDE HERVORHEBUNG
   AppHeader.vue schreibt Position und Breite als --nav-highlight-x/-width,
   ermittelt aus der tatsächlichen Größe des gerade relevanten Links. transform
   statt left/width als animierte Eigenschaft, damit der Browser nichts neu
   layouten muss, während sie gleitet — nur width bleibt zwangsläufig eine
   Layout-Eigenschaft, ändert sich aber seltener als die Position. */
.nav-highlight {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 0;

  height: 36px;
  width: var(--nav-highlight-width, 0px);
  transform: translate(var(--nav-highlight-x, 0px), -50%);

  border-radius: var(--radius-pill);
  background: var(--surface);

  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.35s var(--ease-spring),
    width 0.35s var(--ease-spring),
    opacity 0.2s ease;
}

.nav-highlight.is-visible {
  opacity: 1;
}

.desktop-nav a {
  position: relative;
  z-index: 1;
  padding: 8px 14px;
  border-radius: var(--radius-pill);

  color: var(--text-secondary);
  font-size: 0.93rem;
  font-weight: 600;

  transition: color var(--transition);
}

.desktop-nav a:hover {
  color: var(--text);
}

/* Der aktive Eintrag: in der Akzentfarbe. Die Klasse vergibt der Router
   selbst. Die Position wird zusätzlich von der gleitenden Fläche oben
   markiert — ein einzelner, durchgängiger Indikator statt zweier
   verschiedener (früher: Punkt + Farbe). */
.desktop-nav a.router-link-active {
  color: var(--accent-strong);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.discord-button {
  padding: 10px 20px;
  font-size: 0.88rem;
}

/* --- Der Menü-Knopf --- */
.menu-toggle {
  display: none; /* wird erst auf schmalen Bildschirmen eingeblendet */

  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);

  background: var(--surface);
  color: var(--text);
  font-size: 1.35rem;

  transition:
    background var(--transition),
    border-color var(--transition);
}

.menu-toggle:hover {
  border-color: rgba(var(--accent-rgb), 0.55);
  background: var(--surface-hover);
}

/* --- Das aufklappende Menü --- */
.mobile-nav {
  display: flex;
  flex-direction: column;

  padding: 10px var(--page-padding) 20px;

  border-bottom: 1px solid var(--border-soft);
  background: rgba(var(--bg-bottom-rgb), 0.96);
  backdrop-filter: blur(16px);
}

.mobile-nav a {
  padding: 14px 6px;
  border-bottom: 1px solid var(--border-soft);

  color: var(--text-secondary);
  font-size: 1.05rem;
  font-weight: 600;
}

.mobile-nav a:last-child {
  border-bottom: none;
}

.mobile-nav a.router-link-active {
  color: var(--accent-strong);
}

/* Weiches Auf- und Zuklappen.
   max-height statt height, weil man die tatsächliche Höhe vorher nicht kennt —
   auf "auto" lässt sich in CSS nicht zuverlässig animieren. */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity var(--transition),
    max-height 0.3s ease;
  overflow: hidden;
  max-height: 400px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

@media (max-width: 860px) {
  /* Auf schmalen Bildschirmen wandert die Navigation ins Klappmenü */
  .desktop-nav {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }
}

@media (max-width: 520px) {
  /* Ganz schmal: Der Discord-Knopf würde den Kopfbereich sprengen.
     Er steht ohnehin auch im Klappmenü und im Fußbereich. */
  .discord-button {
    display: none;
  }
}
</style>
