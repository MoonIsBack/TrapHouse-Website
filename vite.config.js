import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// CONTENT SECURITY POLICY (CSP)
//
// Eine Liste dessen, was der Browser für diese Seite überhaupt laden darf.
// Alles, was nicht ausdrücklich erlaubt ist, wird blockiert — falls also
// jemals fremder Code auf die Seite gelangen sollte, könnte er nichts
// nachladen und nichts nach außen senden.
//
// Diese Seite lädt bewusst NICHTS von fremden Servern: keine Google Fonts,
// kein Font Awesome, kein Analytics. Die alte TrapHouse-Seite hat beides per
// CDN geholt — dabei erfährt der fremde Server bei jedem Seitenaufruf die
// IP-Adresse deiner Besucher, was in der EU einwilligungspflichtig ist. Die
// Schriften liegen deshalb jetzt unter src/assets/fonts/ im Projekt selbst
// und die Icons sind eigene SVG-Komponenten.
//
// Jede Zeile ist so eng wie möglich gewählt, aber genau so weit, dass
// TrapHouse vollständig funktioniert:
const CONTENT_SECURITY_POLICY = [
  // Grundregel: nur eigene Dateien von dieser Adresse
  "default-src 'self'",

  // Skripte ausschließlich aus eigenen Dateien. Vite baut alles in eine
  // JS-Datei, es gibt keine Skripte direkt im HTML — deshalb reicht 'self'
  // ohne jede Ausnahme.
  "script-src 'self'",

  // 'unsafe-inline' ist hier NÖTIG: Vue schreibt beim Ein- und Ausblenden von
  // Elementen (<Transition>) kurzzeitig style-Angaben direkt an das Element.
  // Ohne diese Erlaubnis würden die Übergänge einfach nicht laufen.
  "style-src 'self' 'unsafe-inline'",

  // data: wird gebraucht, weil Vite sehr kleine Bilder (z. B. das Favicon)
  // beim Bauen direkt in die CSS-Datei einbettet, statt sie einzeln zu laden.
  "img-src 'self' data:",

  // Die Schriften liegen im Projekt — es gibt keine externe Schriftquelle
  "font-src 'self'",

  // Keine Netzwerkverbindungen nach außen. TrapHouse hat keinen Server und
  // ruft nichts ab; 'self' deckt nur das Nachladen eigener Dateien ab.
  "connect-src 'self'",

  // Keine Flash-/Java-/Objekt-Einbettungen
  "object-src 'none'",

  // Verhindert, dass eine eingeschleuste <base>-Angabe alle relativen Pfade
  // auf einen fremden Server umbiegt
  "base-uri 'self'",

  // Es gibt kein Formular, das irgendwohin sendet
  "form-action 'none'",
].join('; ')

// Hängt die CSP als <meta>-Angabe in die fertige index.html.
//
// WARUM NUR IM PRODUKTIONSBUILD?
// Der Entwicklungsserver von Vite lädt Änderungen live nach und benutzt dafür
// eine WebSocket-Verbindung zu localhost. Die Zeile "connect-src 'self'" würde
// genau diese Verbindung blockieren — das automatische Neuladen beim
// Programmieren wäre kaputt. Deshalb greift der Hook über apply: 'build' nur
// beim Bauen; "npm run dev" bleibt völlig unberührt.
//
// WARUM ALS META-ANGABE UND NICHT ALS HTTP-HEADER?
// Ein HTTP-Header wäre die sauberere Lösung, aber GitHub Pages erlaubt keine
// eigenen Header. Die Meta-Angabe ist die einzige Möglichkeit, die dort
// überhaupt funktioniert.
//
// EINSCHRÄNKUNG, DIE MAN KENNEN MUSS:
// "frame-ancestors" (Schutz davor, dass jemand die Seite unsichtbar in seine
// eigene einbettet) wirkt AUSSCHLIESSLICH als HTTP-Header und wird in einer
// Meta-Angabe vom Browser ignoriert. Diese Absicherung ist auf GitHub Pages
// deshalb technisch nicht erreichbar. Die Zeile hier wegzulassen ist ehrlicher,
// als etwas einzubauen, das nachweislich nichts tut. Bei einem späteren Umzug
// auf einen eigenen Hoster gehört sie als echter Header nachgerüstet.
function cspPlugin() {
  return {
    name: 'traphouse-csp',
    apply: 'build',
    transformIndexHtml(html) {
      // Bewusst NACH der Zeichensatz-Angabe eingefügt: <meta charset> soll so
      // weit wie möglich am Anfang stehen, damit der Browser die Kodierung
      // sofort kennt und Umlaute nie kurz falsch darstellt.
      const charsetTag = '<meta charset="UTF-8">'

      return html.replace(
        charsetTag,
        `${charsetTag}\n    <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}">`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Unterordner, unter dem die Seite später erreichbar ist.
  //
  // Aktuell liegt sie auf GitHub Pages unter
  // moonisback.github.io/TrapHouse-Website/ — deshalb dieser Wert.
  //
  // ⚠ Wenn TrapHouse später die Hauptseite wird (also direkt unter
  // moonisback.github.io/ oder einer eigenen Domain wie traphouse.de liegt),
  // muss hier '/' stehen. Das ist die EINZIGE Zeile, die dafür zu ändern ist.
  base: '/TrapHouse-Website/',

  plugins: [vue(), cspPlugin()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
