<script setup>
// Der Kopfbereich: Logo, Navigation und der Discord-Knopf.
//
// Er klebt oben am Bildschirm und wird beim Scrollen von durchsichtig zu
// milchig — solange man ganz oben im Hero steht, soll er nicht als Balken
// über dem Bild liegen.
//
// Die Navigationseinträge kommen aus data/navigation.js; der Kopfbereich
// entscheidet nicht selbst, welche Seiten es gibt.
import { ref, onMounted, onBeforeUnmount } from 'vue'

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

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 12
}

onMounted(() => {
  // passive: true sagt dem Browser zu, dass dieser Lauscher das Scrollen
  // niemals abbricht. Er muss dann nicht abwarten, was der Code tut, und
  // das Scrollen bleibt auch auf schwächeren Geräten flüssig.
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Einmal direkt aufrufen: Wer die Seite mittendrin neu lädt, startet nicht
  // zwangsläufig ganz oben.
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
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
      <nav class="desktop-nav" aria-label="Hauptnavigation">
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
  display: flex;
  align-items: center;
  gap: 6px;

  /* Nimmt den freien Platz ein und schiebt sich damit in die Mitte */
  margin: 0 auto;
}

.desktop-nav a {
  position: relative;
  padding: 8px 14px;
  border-radius: var(--radius-pill);

  color: var(--text-secondary);
  font-size: 0.93rem;
  font-weight: 600;

  transition:
    color var(--transition),
    background var(--transition);
}

.desktop-nav a:hover {
  color: var(--text);
  background: var(--surface);
}

/* Der aktive Eintrag: in der Akzentfarbe und mit einem kleinen Punkt darunter.
   Die Klasse vergibt der Router selbst. */
.desktop-nav a.router-link-active {
  color: var(--accent-strong);
}

.desktop-nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);

  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
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
