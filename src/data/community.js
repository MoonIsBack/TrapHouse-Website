// Inhalte der Startseite, die nirgends sonst herkommen.
//
// Wie bei den übrigen Dateien in data/: Der Text steht hier, nicht im
// Template. So kannst du Formulierungen ändern, ohne in HTML zu suchen.

// Die Wörter im durchlaufenden Band zwischen den Bereichen.
//
// Kurz halten — lange Wörter blockieren das Band optisch. Und lieber ein paar
// mehr Einträge als zu wenige: Bei drei Wörtern sieht man die Wiederholung.
export const MARQUEE_WORDS = [
  'TrapHouse',
  'Beats',
  'Features',
  'Mixing',
  'Community',
  'Artists',
  'Producer',
  'Sounddesign',
]

// „Was dich erwartet" auf der Startseite.
//
// Bewusst vier Einträge: Das Raster stellt sie auf breiten Bildschirmen in
// eine Reihe, auf mittleren in zwei mal zwei — beides geht auf. Bei drei oder
// fünf bliebe unten eine angebrochene Zeile stehen.
export const HIGHLIGHTS = [
  {
    id: 'artists',
    label: 'Für Artists',
    title: 'Rückmeldung, die weiterbringt',
    text: 'Lad hoch, woran du arbeitest, und bekomm ehrliches Feedback von Leuten, die selbst schreiben und aufnehmen.',
  },
  {
    id: 'producer',
    label: 'Für Producer',
    title: 'Beats, Sounds, Technik',
    text: 'Austausch über Mixing, Sounddesign und Arrangement. Dazu Kits und Presets, die die Community untereinander weitergibt.',
  },
  {
    id: 'kollab',
    label: 'Zusammen',
    title: 'Leute für Kollabs finden',
    text: 'Du suchst Vocals, einen Mix oder einen Beat? Im Kollab-Kanal findet sich fast immer jemand, der dazu Lust hat.',
  },
  {
    id: 'offen',
    label: 'Ohne Hürden',
    title: 'Reinkommen und mitreden',
    text: 'Kein Bewerbungsverfahren, keine Kosten, kein Gatekeeping. Egal ob erster Beat oder zehntes Release.',
  },
]
