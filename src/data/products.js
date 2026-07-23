import shirtImage from '@/assets/images/shirt.webp'

// Die Artikel des Shops.
//
// Noch eine feste Liste im Code — das reicht völlig, solange es eine Handvoll
// Artikel sind und es keinen echten Bestellvorgang gibt. Erst wenn Bezahlung
// und Lagerbestand dazukommen, lohnt sich ein Shop-System dahinter.
//
// Das Bild wird oben importiert statt als Pfad hingeschrieben. Warum: Vite
// erkennt den Import, packt das Bild mit in den Build und hängt eine Prüfsumme
// an den Dateinamen. Dadurch sehen Besucher nach einer Änderung sofort das
// neue Bild statt einer alten Fassung aus dem Browser-Zwischenspeicher.

// ⭐ DER STATUS ENTSCHEIDET ALLES
//
//   'ankuendigung' → Nur Bild, Name und Beschreibung. KEIN Preis, KEINE
//                    Kaufknöpfe. Der Artikel ist eine Ankündigung, kein Angebot.
//
//   'verfuegbar'   → Preis und Kaufknöpfe erscheinen.
//
// ⚠ WARUM DAS MEHR ALS EINE DESIGN-ENTSCHEIDUNG IST
//
// Ohne Preis und ohne Bestellmöglichkeit ist der Artikel rechtlich eine
// Ankündigung — vergleichbar mit einem Foto aus dem Studio. Es gibt kein
// Angebot, keinen Vertrag, keine Zahlung.
//
// Sobald ein Preis dasteht, sieht das anders aus: Dann greift die
// Preisangabenverordnung, und der Gesamtpreis muss inklusive Umsatzsteuer
// angegeben werden, dazu Angaben zu Versandkosten. Und die Seite wirkt nach
// außen geschäftsmäßig, was die Impressumspflicht auslöst.
//
// Deshalb steht der Status hier auf 'ankuendigung'. Bevor du ihn umstellst,
// lies docs/lernheft/40-Was-noch-fehlt.md — dann brauchst du auch AGB,
// Widerrufsbelehrung und ein ausgefülltes Impressum.
export const PRODUCTS = [
  {
    id: 'traphouse-shirt',
    name: 'TrapHouse Shirt',

    // Wird bei 'ankuendigung' NICHT angezeigt. Steht hier schon drin, damit
    // beim Umstellen auf 'verfuegbar' nichts nachgetragen werden muss.
    price: 20,

    image: shirtImage,
    imageAlt: 'Schwarzes TrapHouse T-Shirt mit pinkem Logo auf der Brust',
    description:
      'Schweres Baumwollshirt mit gesticktem TrapHouse-Schriftzug. Unisex-Schnitt, Größen S bis XXL.',

    status: 'ankuendigung',
  },
]

// Preis als Text mit Euro-Zeichen, im deutschen Format (20,00 €).
//
// Wird erst benutzt, wenn ein Artikel auf 'verfuegbar' steht.
//
// Intl.NumberFormat ist im Browser eingebaut und kümmert sich um Komma statt
// Punkt und um die Position des Währungszeichens — das von Hand
// zusammenzubauen geht erfahrungsgemäß irgendwann schief.
export function formatPrice(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
