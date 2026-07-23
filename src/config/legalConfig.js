// ⚠⚠ WICHTIG — BITTE ZUERST LESEN ⚠⚠
//
// Diese Datei enthält die Angaben für Impressum und Datenschutzerklärung.
// Sie ist eine **Vorlage**, keine Rechtsberatung. Ich bin kein Anwalt.
//
// Bevor die Seite online geht, sollte ein Fachkundiger einmal darüberschauen —
// besonders dann, wenn wirklich Merch verkauft wird. Dann kommen nämlich noch
// AGB, Widerrufsbelehrung und Angaben zu Versand und Zahlung dazu, und das
// hier reicht nicht mehr.
//
// Kostenlose Generatoren, die einen guten Ausgangspunkt liefern:
//   e-recht24.de/impressum-generator.html
//   datenschutz-generator.de  (von Dr. Schwenke)
//
// ────────────────────────────────────────────────────────────────────────
//
// SO BENUTZT DU DIESE DATEI
//
// Alles, was unten mit AUSFÜLLEN markiert ist, musst du ersetzen. Solange dort
// noch Platzhalter stehen, zeigen die Rechtsseiten einen deutlichen Warnhinweis
// an — damit die Seite nicht versehentlich mit "Max Mustermann" online geht.

// ═══════════════════════════════════════════════════════════════════════
// 1. WER BETREIBT DIE SEITE?
// ═══════════════════════════════════════════════════════════════════════
//
// ⚠ Die Anschrift muss "ladungsfähig" sein — also eine echte Adresse, unter
// der dich die Post erreicht. Ein Postfach reicht nach § 5 DDG NICHT.
//
// Für Privatpersonen heißt das in der Regel: Die eigene Wohnadresse steht
// öffentlich im Netz. Wenn dir das unangenehm ist, sind die üblichen Wege ein
// Dienstleister mit ladungsfähiger Anschrift oder eine c/o-Adresse. Beides
// kostet etwas und ist nicht in jeder Konstellation zulässig — das ist genau
// so ein Punkt, für den sich einmal fachlicher Rat lohnt.
export const operator = {
  // Vor- und Nachname, oder der Firmenname
  name: 'AUSFÜLLEN: Vor- und Nachname',

  // Nur bei einer Firma — bei einer Privatperson leer lassen ('')
  company: '',

  street: 'AUSFÜLLEN: Straße und Hausnummer',
  zip: 'AUSFÜLLEN: PLZ',
  city: 'AUSFÜLLEN: Ort',
  country: 'Deutschland',

  // ⚠ Pflichtangabe. Muss eine Adresse sein, die du wirklich liest.
  email: 'AUSFÜLLEN: deine@email.de',

  // Freiwillig. Leer lassen ('), wenn du keine angeben willst — eine
  // E-Mail-Adresse genügt für die "schnelle elektronische Kontaktaufnahme".
  phone: '',

  // Nur falls vorhanden (§ 27a UStG). Kleinunternehmer haben in der Regel
  // keine — dann leer lassen.
  vatId: '',
}

// ═══════════════════════════════════════════════════════════════════════
// 2. WER HOSTET DIE SEITE?
// ═══════════════════════════════════════════════════════════════════════
//
// Muss in die Datenschutzerklärung, weil der Hoster technisch bedingt die
// IP-Adressen deiner Besucher verarbeitet — auch wenn DU nichts trackst.
//
// ⚠ Diese Angaben gelten für GitHub Pages. Ziehst du z. B. auf Netlify oder
// Vercel um, musst du sie hier austauschen.
export const hoster = {
  name: 'GitHub, Inc.',
  address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA',
  privacyUrl: 'https://docs.github.com/site-policy/privacy-policies/github-privacy-statement',

  // Sitz außerhalb der EU? Dann braucht es in der Datenschutzerklärung einen
  // Absatz zur Datenübermittlung in Drittländer.
  outsideEu: true,
}

// ═══════════════════════════════════════════════════════════════════════
// 3. WAS TRIFFT AUF DIE SEITE ZU?
// ═══════════════════════════════════════════════════════════════════════
//
// Diese Schalter blenden Abschnitte ein oder aus. Stell sie ehrlich ein —
// sie beschreiben, was die Seite TATSÄCHLICH tut. Ein Abschnitt, der etwas
// behauptet, das nicht stimmt, ist schlimmer als gar keiner.
export const legalFacts = {
  // Setzt die Seite Cookies? Aktuell: nein.
  // ⚠ Auf true stellen, sobald du irgendetwas einbaust, das Cookies setzt —
  // dann brauchst du zusätzlich ein Einwilligungsbanner.
  usesCookies: false,

  // Lädt die Seite etwas von fremden Servern (Google Fonts, YouTube,
  // Analytics)? Aktuell: nein, alles liegt im Projekt.
  usesThirdParty: false,

  // Gibt es ein Kontaktformular oder einen Newsletter? Aktuell: nein.
  hasContactForm: false,

  // Werden über diese Seite wirklich Waren verkauft?
  // ⚠ Sobald das true wird, reicht diese Vorlage NICHT mehr aus: Dann
  // brauchst du AGB, Widerrufsbelehrung, Angaben zu Versandkosten und
  // Lieferzeiten sowie einen Hinweis auf die Verbraucherschlichtung.
  sellsGoods: false,
}

// ═══════════════════════════════════════════════════════════════════════
// 4. DIE LINKS IM FUSSBEREICH
// ═══════════════════════════════════════════════════════════════════════
//
// Bewusst getrennt von NAV_LINKS in data/navigation.js: Rechtsseiten gehören
// in den Fußbereich, nicht in die Hauptnavigation.
//
// ⚠ § 5 DDG verlangt, dass das Impressum "leicht erkennbar, unmittelbar
// erreichbar und ständig verfügbar" ist. Der Fußbereich steht auf jeder
// Seite — damit ist das erfüllt. Nimm diese Links also nicht heraus.
export const LEGAL_LINKS = [
  { name: 'impressum', label: 'Impressum' },
  { name: 'datenschutz', label: 'Datenschutz' },
]

// ═══════════════════════════════════════════════════════════════════════
// HILFSFUNKTION
// ═══════════════════════════════════════════════════════════════════════

// Prüft, ob irgendwo noch ein Platzhalter steht.
//
// Die Rechtsseiten zeigen darauf einen roten Warnkasten an. Das ist die
// Bremse, die verhindert, dass die Seite mit "AUSFÜLLEN: PLZ" im Impressum
// online geht — ein Fehler, den man selbst nicht mehr sieht, wenn man die
// Seite fünfzig Mal angeschaut hat.
export function hasPlaceholders() {
  return Object.values(operator).some(
    (value) => typeof value === 'string' && value.startsWith('AUSFÜLLEN'),
  )
}

// ⭐ SIND DIE RECHTSSEITEN ÖFFENTLICH ERREICHBAR?
//
// Beim Entwickeln: immer — sonst könntest du nicht daran arbeiten.
// In der veröffentlichten Fassung: nur, wenn keine Platzhalter mehr drinstehen.
//
// WARUM DAS WICHTIG IST
// Ein Impressum, in dem "AUSFÜLLEN: PLZ" steht, ist SCHLECHTER als gar keins.
// Ohne Impressum ist die Seite eine private Seite. Mit einem offensichtlich
// unfertigen Impressum sieht sie aus wie ein Angebot, bei dem jemand die
// Pflichtangaben vergessen hat.
//
// Solange hier also Platzhalter stehen, werden die Routen gar nicht erst
// angelegt und die Links im Fußbereich nicht angezeigt. Füllst du operator
// vollständig aus, erscheinen beide automatisch — du musst nichts umstellen.
export const showLegalPages = import.meta.env.DEV || !hasPlaceholders()
