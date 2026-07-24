// Die Schriften zuerst, damit der Browser sie so früh wie möglich anfordert
import './assets/fonts.css'
// Danach die globalen Farben und Grundstile
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Zusätzlich zum <title> in index.html auch zur Laufzeit setzen. Manche
// Browser stellen beim Wiederöffnen eines lange gecachten Tabs zunächst einen
// alten Titel wieder her; Vue korrigiert ihn damit sofort nach dem Laden.
document.title = 'TrapHouse | Deine Musik Community'

// Die Vue-App erstellen, den Router einhängen und das Ganze in das
// <div id="app"> aus der index.html setzen
createApp(App).use(router).mount('#app')
