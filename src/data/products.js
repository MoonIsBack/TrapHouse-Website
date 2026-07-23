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
export const PRODUCTS = [
  {
    id: 'traphouse-shirt',
    name: 'TrapHouse Shirt',
    price: 20,
    image: shirtImage,
    imageAlt: 'Schwarzes TrapHouse T-Shirt mit pinkem Logo auf der Brust',
    description:
      'Schweres Baumwollshirt mit gesticktem TrapHouse-Schriftzug. Unisex-Schnitt, Größen S bis XXL.',
    // 'bald' = wird angezeigt, ist aber noch nicht bestellbar.
    // Auf 'verfuegbar' umstellen, sobald der Shop wirklich offen ist.
    status: 'bald',
  },
]

// Preis als Text mit Euro-Zeichen, im deutschen Format (20,00 €).
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
