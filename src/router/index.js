import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import ShopView from '@/views/ShopView.vue'
import DiscordView from '@/views/DiscordView.vue'
import SocialsView from '@/views/SocialsView.vue'
import ImprintView from '@/views/ImprintView.vue'
import PrivacyView from '@/views/PrivacyView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { showLegalPages } from '@/config/legalConfig'

// WARUM HASH-ROUTING (die # in der Adresse)?
//
// Es gibt zwei Arten, wie eine Vue-Seite mit Unterseiten umgehen kann:
//
//   createWebHistory      → traphouse.de/shop        (schöner)
//   createWebHashHistory  → traphouse.de/#/shop      (funktioniert überall)
//
// Die erste Variante braucht einen Server, der bei JEDER Adresse dieselbe
// index.html ausliefert. GitHub Pages tut das nicht: Ruft jemand direkt
// /shop auf oder lädt die Seite dort neu, sucht GitHub nach einer Datei
// namens "shop" — findet keine — und zeigt seinen eigenen 404-Fehler.
//
// Man kann das mit einer nachgebauten 404.html umgehen, die per Skript
// zurückleitet. Das ist aber ein Trick, der bei jedem Umzug wieder kaputtgehen
// kann und die Adresse kurz aufblitzen lässt.
//
// Die #-Variante braucht überhaupt keine Server-Einstellung: Alles nach dem #
// bekommt der Server gar nicht erst zu sehen, das wertet nur der Browser aus.
// RankRoom verlinkt seine Rechtsseiten aus demselben Grund schon mit "#/...".
//
// → Falls TrapHouse später auf einen eigenen Hoster mit passender Umleitung
//   umzieht, ist der Wechsel eine einzige Zeile: createWebHistory statt
//   createWebHashHistory. Alles andere bleibt, wie es ist.
const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // Diese eine Ansicht wird direkt oben importiert statt nachgeladen:
      // Sie ist die erste, die jeder sieht — sie soll ohne Umweg da sein.
    },
    {
      path: '/shop',
      name: 'shop',
      // Die Unterseiten sind bewusst direkt geladen: Sie sind sehr klein und
      // reagieren dadurch schon beim ersten Navigationsklick ohne Ladepause.
      component: ShopView,
    },
    {
      path: '/discord',
      name: 'discord',
      component: DiscordView,
    },
    {
      path: '/socials',
      name: 'socials',
      component: SocialsView,
    },

    // RECHTSSEITEN
    //
    // Bewusst als echte Routen und nicht als Popup wie in RankRoom. Dort gab
    // es noch keinen Router, deshalb waren Popups die einzige Möglichkeit.
    //
    // Echte Adressen sind hier die bessere Wahl: Eine eigene Adresse lässt
    // sich verlinken, in einem neuen Tab öffnen und weitergeben — genau das
    // erwartet man bei Impressum und Datenschutz.
    //
    // ⚠ Die beiden Routen gibt es nur, wenn legalConfig.js ausgefüllt ist
    // (beim Entwickeln immer). Der Grund steht dort bei "showLegalPages".
    // Das Verteilen mit ... fügt bei false ein leeres Array ein, also nichts.
    ...(showLegalPages
      ? [
          {
            path: '/impressum',
            name: 'impressum',
            component: ImprintView,
          },
          {
            path: '/datenschutz',
            name: 'datenschutz',
            component: PrivacyView,
          },
        ]
      : []),

    // Alles, was auf keine der obigen Adressen passt. Muss ganz unten stehen,
    // sonst würde es alle anderen Routen abfangen.
    {
      path: '/:pfad(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],

  // Beim Wechsel auf eine andere Seite nach oben springen — sonst landet man
  // auf der neuen Seite an derselben Scroll-Position wie vorher, was sich
  // anfühlt, als wäre nichts passiert.
  // Ausnahme: der Zurück-Knopf des Browsers stellt die alte Position wieder her.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    // Verweist die Adresse auf einen Anker (#/#kontakt), dorthin scrollen
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // Beim Seitenwechsel sofort oben beginnen. Ohne "instant" übernimmt die
    // globale Smooth-Scroll-Regel und lässt die neue Seite scheinbar langsam
    // laden, während der Browser in Wahrheit nur noch nach oben scrollt.
    return { top: 0, behavior: 'instant' }
  },
})

export default router
