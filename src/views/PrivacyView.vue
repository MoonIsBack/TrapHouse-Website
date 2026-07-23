<script setup>
// Die Datenschutzerklärung.
//
// Sie fällt kurz aus, weil diese Seite fast nichts verarbeitet: keine Cookies,
// kein Tracking, keine externen Dienste, kein Formular.
//
// ⚠ ABER: "Wir speichern keine Daten" wäre trotzdem FALSCH.
//
// Der Hoster (GitHub) protokolliert technisch bedingt jeden Aufruf samt
// IP-Adresse — auch wenn wir selbst nichts davon sehen und nichts damit tun.
// Eine IP-Adresse ist ein personenbezogenes Datum. Das gehört offengelegt,
// sonst ist die Erklärung unvollständig.
//
// Genau diese Ehrlichkeit ist der Punkt: Eine Datenschutzerklärung, die etwas
// verschweigt, ist gefährlicher als eine, die einen unangenehmen Absatz enthält.
import { operator, hoster, legalFacts } from '@/config/legalConfig'
import LegalPage from '@/components/legal/LegalPage.vue'
</script>

<template>
  <LegalPage title="Datenschutz" updated="Juli 2026">
    <h2>Das Wichtigste in Kürze</h2>

    <div class="legal-note">
      <p>
        Diese Website setzt <strong>keine Cookies</strong>, bindet
        <strong>keine externen Dienste</strong> ein und verwendet <strong>kein Tracking</strong>.
        Schriften und Symbole liegen auf demselben Server wie die Seite selbst — es werden also
        keine Daten an Google, Cloudflare oder ähnliche Anbieter übermittelt.
      </p>
      <p>
        Was sich technisch nicht vermeiden lässt: Der Hoster protokolliert jeden Seitenaufruf. Was
        das bedeutet, steht weiter unten unter „Hosting und Server-Logfiles".
      </p>
    </div>

    <h2>Verantwortlicher</h2>

    <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>

    <address>
      <span v-if="operator.company">{{ operator.company }}<br /></span>
      {{ operator.name }}<br />
      {{ operator.street }}<br />
      {{ operator.zip }} {{ operator.city }}<br />
      {{ operator.country }}<br />
      E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>
    </address>

    <h2>Hosting und Server-Logfiles</h2>

    <p>
      Diese Website wird bei <strong>{{ hoster.name }}</strong> gehostet ({{ hoster.address }}).
      Beim Aufruf der Seite werden vom Hoster automatisch Daten verarbeitet, die Ihr Browser
      übermittelt. Dazu gehören in der Regel:
    </p>

    <ul>
      <li>Ihre IP-Adresse</li>
      <li>Datum und Uhrzeit des Zugriffs</li>
      <li>die aufgerufene Datei</li>
      <li>die zuvor besuchte Seite (Referrer)</li>
      <li>Browser und Betriebssystem</li>
    </ul>

    <p>
      Diese Verarbeitung ist technisch erforderlich, damit die Website überhaupt ausgeliefert werden
      kann. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einer
      stabilen und sicheren Bereitstellung der Seite.
    </p>

    <p>
      Wir selbst haben auf diese Protokolldaten <strong>keinen Zugriff</strong> und werten sie nicht
      aus. Einzelheiten zur Verarbeitung durch den Hoster finden Sie in dessen Datenschutzerklärung:
      <a :href="hoster.privacyUrl" target="_blank" rel="noopener noreferrer">
        Datenschutzerklärung {{ hoster.name }}
      </a>
    </p>

    <template v-if="hoster.outsideEu">
      <h3>Datenübermittlung in Drittländer</h3>

      <p>
        Der Hoster hat seinen Sitz in den USA. Dabei können personenbezogene Daten (insbesondere
        Ihre IP-Adresse) in ein Land außerhalb der Europäischen Union übermittelt werden, in dem
        kein mit der DSGVO vergleichbares Datenschutzniveau besteht.
      </p>

      <p>
        Grundlage der Übermittlung ist der Angemessenheitsbeschluss der Europäischen Kommission zum
        EU-US Data Privacy Framework sowie ergänzend Standardvertragsklauseln nach Art. 46 Abs. 2
        lit. c DSGVO.
      </p>
    </template>

    <h2>Cookies</h2>

    <p v-if="!legalFacts.usesCookies">
      Diese Website verwendet keine Cookies. Es werden auch keine vergleichbaren Techniken wie Local
      Storage oder Session Storage eingesetzt, um Sie wiederzuerkennen.
    </p>

    <h2>Externe Dienste und Schriftarten</h2>

    <p v-if="!legalFacts.usesThirdParty">
      Alle Schriftarten und Symbole werden von unserem eigenen Server geladen. Es findet
      <strong
        >keine Verbindung zu Google Fonts, Content Delivery Networks oder ähnlichen Diensten</strong
      >
      statt. Ihre IP-Adresse wird dadurch nicht an Dritte übermittelt.
    </p>

    <h2>Verlinkung sozialer Netzwerke</h2>

    <p>
      Auf dieser Website finden Sie Links zu unseren Profilen bei YouTube, TikTok, Instagram und
      Discord. Es handelt sich dabei um <strong>einfache Links</strong>, nicht um eingebettete
      Inhalte oder Social-Plugins. Es werden keine Daten an diese Anbieter übertragen, solange Sie
      den jeweiligen Link nicht anklicken.
    </p>

    <p>
      Klicken Sie einen dieser Links an, verlassen Sie diese Website. Ab diesem Zeitpunkt gilt die
      Datenschutzerklärung des jeweiligen Anbieters, auf dessen Verarbeitung wir keinen Einfluss
      haben.
    </p>

    <template v-if="legalFacts.hasContactForm">
      <h2>Kontaktformular</h2>

      <div class="legal-note">
        <p>
          <strong>Dieser Abschnitt muss noch geschrieben werden.</strong> Sobald es ein
          Kontaktformular oder einen Newsletter gibt, müssen hier Zweck, Rechtsgrundlage und
          Speicherdauer der eingegebenen Daten beschrieben werden.
        </p>
      </div>
    </template>

    <h2>Ihre Rechte</h2>

    <p>Sie haben jederzeit das Recht:</p>

    <ul>
      <li>Auskunft über die zu Ihnen gespeicherten Daten zu verlangen (Art. 15 DSGVO)</li>
      <li>deren Berichtigung zu verlangen (Art. 16 DSGVO)</li>
      <li>deren Löschung zu verlangen (Art. 17 DSGVO)</li>
      <li>die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
      <li>der Verarbeitung zu widersprechen (Art. 21 DSGVO)</li>
      <li>Ihre Daten in einem übertragbaren Format zu erhalten (Art. 20 DSGVO)</li>
    </ul>

    <p>
      Wenden Sie sich dafür an die oben genannte E-Mail-Adresse. Unabhängig davon steht Ihnen ein
      Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO). Zuständig ist die
      Behörde Ihres Bundeslandes oder die des Verantwortlichen.
    </p>

    <h2>Änderungen dieser Erklärung</h2>

    <p>
      Wir passen diese Datenschutzerklärung an, sobald sich die Website ändert — etwa wenn neue
      Funktionen hinzukommen. Es gilt jeweils die hier abrufbare Fassung.
    </p>
  </LegalPage>
</template>
