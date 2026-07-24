<script setup>
// Der Fußbereich: Logo, Kurzbeschreibung, Navigation und Social-Links.
//
// Wie der Kopfbereich liest er die Einträge aus data/ — er weiß selbst nicht,
// welche Seiten oder Kanäle es gibt. Kommt ein Kanal dazu, taucht er hier
// automatisch mit auf.
import { NAV_LINKS } from '@/data/navigation'
import { SOCIAL_LINKS } from '@/data/socialLinks'
import { LEGAL_LINKS, showLegalPages } from '@/config/legalConfig'

import NavLink from '@/components/ui/NavLink.vue'
import IconYouTube from '@/components/icons/IconYouTube.vue'
import IconTikTok from '@/components/icons/IconTikTok.vue'
import IconInstagram from '@/components/icons/IconInstagram.vue'
import logo from '@/assets/images/traphouse-logo.webp'

// Ordnet jeder Kanal-ID aus socialLinks.js die passende Icon-Komponente zu.
//
// Warum diese Tabelle statt v-if für jeden Kanal: So bleibt das Template kurz,
// und ein neuer Kanal braucht nur einen Eintrag hier statt eines weiteren
// v-else-if mittendrin.
const SOCIAL_ICONS = {
  youtube: IconYouTube,
  tiktok: IconTikTok,
  instagram: IconInstagram,
}

// Automatisch das laufende Jahr, damit hier nie eine veraltete Zahl steht
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img :src="logo" alt="TrapHouse" class="footer-logo" width="480" height="215" />
        <p>Die Musik-Community für Artists &amp; Producer.</p>
      </div>

      <nav class="footer-nav" aria-label="Fußzeilen-Navigation">
        <h3>Seiten</h3>
        <NavLink v-for="link in NAV_LINKS" :key="link.label" :link="link" />
      </nav>

      <div class="footer-socials">
        <h3>Folge uns</h3>
        <a
          v-for="social in SOCIAL_LINKS"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          <component :is="SOCIAL_ICONS[social.id]" />
          {{ social.label }}
        </a>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© {{ currentYear }} TrapHouse</p>

      <!-- RECHTSSEITEN
           Stehen bewusst hier unten und nicht in der Hauptnavigation. Wichtig
           ist nur, dass sie auf JEDER Seite erreichbar sind — der Fußbereich
           erfüllt das. Bitte nicht entfernen: § 5 DDG verlangt, dass das
           Impressum ständig verfügbar ist. -->
      <nav v-if="showLegalPages" class="footer-legal" aria-label="Rechtliches">
        <RouterLink v-for="link in LEGAL_LINKS" :key="link.name" :to="{ name: link.name }">
          {{ link.label }}
        </RouterLink>
      </nav>

      <p class="footer-note">
        Diese Seite lädt nichts von fremden Servern und setzt keine Cookies.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 40px;
  padding: 56px 0 40px;
  border-top: 1px solid var(--border-soft);

  /* Nach unten hin leicht abdunkeln, damit der Fußbereich sich absetzt */
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.35));
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 40px;
}

.footer-logo {
  width: auto;
  height: 38px;
  margin-bottom: 14px;
}

.footer-brand p {
  max-width: 34ch;
  color: var(--text-muted);
  font-size: 0.92rem;
}

h3 {
  margin-bottom: 16px;

  color: var(--text);
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.footer-nav,
.footer-socials {
  display: flex;
  flex-direction: column;
  gap: 11px;
  align-items: flex-start;
}

.footer-nav a,
.social-link {
  color: var(--text-muted);
  font-size: 0.92rem;

  /* 400 und nicht 500: Von Poppins liegen nur die Schnitte 400, 600 und 700
     im Projekt. Bei 500 sucht der Browser den nächstgelegenen — und das ist
     ohnehin die 400. Die Angabe hier sagt also, was wirklich passiert. */
  font-weight: 400;

  transition: color var(--transition);
}

.footer-nav a:hover,
.social-link:hover {
  color: var(--accent-strong);
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.social-link :deep(svg) {
  font-size: 1.15em;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;

  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--border-soft);

  color: var(--text-subtle);
  font-size: 0.82rem;
}

.footer-bottom p {
  margin: 0;
}

.footer-legal {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;

  /* Nimmt den freien Platz und sitzt dadurch zwischen Copyright und Hinweis */
  margin: 0 auto;
}

.footer-legal a {
  color: var(--text-muted);
  font-weight: 600;
  transition: color var(--transition);
}

.footer-legal a:hover,
.footer-legal a.router-link-active {
  color: var(--accent-strong);
}

@media (max-width: 720px) {
  /* Untereinander statt nebeneinander — der Hinweis rechts ist sonst zu lang
     und drückt die Rechtslinks in eine unglückliche Zeile */
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .footer-legal {
    margin: 0;
  }
}

.footer-note {
  color: var(--text-subtle);
}

@media (max-width: 780px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }

  /* Der Marken-Block nimmt oben die volle Breite ein */
  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
