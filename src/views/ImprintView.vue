<script setup>
// Das Impressum nach § 5 DDG (Digitale-Dienste-Gesetz, seit Mai 2024 —
// vorher stand dieselbe Pflicht in § 5 TMG).
//
// Alle Angaben kommen aus config/legalConfig.js. Hier steht bewusst kein
// einziger Name und keine einzige Adresse fest im Code: Du sollst deine Daten
// an genau einer Stelle pflegen und nicht suchen müssen.
import { operator, legalFacts } from '@/config/legalConfig'
import LegalPage from '@/components/legal/LegalPage.vue'
</script>

<template>
  <LegalPage title="Impressum" updated="Juli 2026">
    <h2>Angaben gemäß § 5 DDG</h2>

    <address>
      <span v-if="operator.company">{{ operator.company }}<br /></span>
      {{ operator.name }}<br />
      {{ operator.street }}<br />
      {{ operator.zip }} {{ operator.city }}<br />
      {{ operator.country }}
    </address>

    <h2>Kontakt</h2>

    <p>
      E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>
      <span v-if="operator.phone"><br />Telefon: {{ operator.phone }}</span>
    </p>

    <template v-if="operator.vatId">
      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Gemäß § 27a Umsatzsteuergesetz: {{ operator.vatId }}</p>
    </template>

    <h2>Verantwortlich für den Inhalt</h2>

    <p>
      Nach § 18 Abs. 2 MStV verantwortlich:<br />
      {{ operator.name }}, {{ operator.street }}, {{ operator.zip }} {{ operator.city }}
    </p>

    <h2>Streitbeilegung</h2>

    <p>
      Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <!-- Hinweis für dich, nicht für Besucher — steht im Code, nicht auf der Seite:

         Viele Impressum-Generatoren fügen hier noch einen Link auf die
         "Plattform der EU-Kommission zur Online-Streitbeilegung" (OS-Plattform)
         ein. Dieser Absatz gehört NICHT mehr hinein: Die Plattform wurde zum
         20. Juli 2025 eingestellt und die zugrunde liegende Verordnung
         aufgehoben. Ein Link darauf zeigt heute ins Leere.

         Wenn du also einen Generator benutzt und dort ein OS-Plattform-Absatz
         auftaucht: weglassen. -->

    <h2>Haftung für Inhalte</h2>

    <p>
      Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
      Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte
      fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
      Tätigkeit hinweisen.
    </p>

    <p>
      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
      allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab
      dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
      entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
    </p>

    <h2>Haftung für Links</h2>

    <p>
      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
      Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für
      die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
      verantwortlich.
    </p>

    <p>
      Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
      überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt nicht erkennbar. Eine permanente
      inhaltliche Kontrolle ohne konkrete Anhaltspunkte einer Rechtsverletzung ist nicht zumutbar.
      Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
    </p>

    <h2>Urheberrecht</h2>

    <p>
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
      deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
      Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
      jeweiligen Autors bzw. Erstellers.
    </p>

    <p>
      Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
      gestattet.
    </p>

    <template v-if="legalFacts.sellsGoods">
      <h2>Hinweis zum Verkauf</h2>

      <div class="legal-note">
        <p>
          <strong>Dieser Abschnitt ist noch unvollständig.</strong> Sobald über diese Seite
          tatsächlich Waren verkauft werden, sind zusätzlich AGB, eine Widerrufsbelehrung sowie
          Angaben zu Versandkosten und Lieferzeiten erforderlich. Diese Vorlage deckt das nicht ab.
        </p>
      </div>
    </template>
  </LegalPage>
</template>
