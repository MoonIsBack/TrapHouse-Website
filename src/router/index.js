import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
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
      // Die übrigen Ansichten werden erst geladen, wenn sie gebraucht werden
      // ("lazy loading"). Wer nur die Startseite anschaut, lädt den Shop-Code
      // gar nicht erst herunter.
      component: () => import('@/views/ShopView.vue'),
    },
    {
      path: '/discord',
      name: 'discord',
      component: () => import('@/views/DiscordView.vue'),
    },
    {
      path: '/socials',
      name: 'socials',
      component: () => import('@/views/SocialsView.vue'),
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
            component: () => import('@/views/ImprintView.vue'),
          },
          {
            path: '/datenschutz',
            name: 'datenschutz',
            component: () => import('@/views/PrivacyView.vue'),
          },
        ]
      : []),

    // Alles, was auf keine der obigen Adressen passt. Muss ganz unten stehen,
    // sonst würde es alle anderen Routen abfangen.
    {
      path: '/:pfad(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
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

    return { top: 0 }
  },
})

export default router
