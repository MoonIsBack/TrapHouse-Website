// Alle Social-Media-Kanäle an EINER Stelle.
//
// Kopfbereich, Fußbereich und die Socials-Seite lesen alle aus dieser Liste.
// Ändert sich ein Nutzername, änderst du ihn genau hier — und nicht an drei
// Stellen, von denen du eine garantiert vergisst.
//
// "brand" ist die offizielle Farbe des jeweiligen Dienstes. Sie wird nur beim
// Darüberfahren benutzt, damit die Seite im Ruhezustand einheitlich pink
// bleibt und nicht wie ein Farbkasten aussieht.
export const SOCIAL_LINKS = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@TraphouseOffiziell',
    url: 'https://www.youtube.com/@TraphouseOffiziell',
    brand: '#ff0000',
    description: 'Musikvideos, Beats und alles, was länger als ein Reel ist.',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@traphouse.offiziell',
    url: 'https://www.tiktok.com/@traphouse.offiziell',
    brand: '#25f4ee',
    description: 'Kurze Clips, Snippets und was gerade im Studio passiert.',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@traphouse.offiziell',
    url: 'https://www.instagram.com/traphouse.offiziell/',
    brand: '#e1306c',
    description: 'Fotos, Stories und Ankündigungen zu neuen Releases.',
  },
]

// Der Einladungslink zum Discord-Server.
//
// ⚠ Hier steht bewusst noch '#': Sobald du den echten Link hast (discord.gg/…),
// trägst du ihn hier ein — er wird dann automatisch überall benutzt, wo ein
// Discord-Knopf auftaucht.
export const DISCORD_INVITE = '#'
