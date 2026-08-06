import { boolean, numar, type Document } from './md'

/**
 * Ce e pornit pe site-ul unui client. Vine din `clienti/<nume>/setari.md`.
 *
 * Un modul pe „nu" nu se afișează deloc — nici secțiunea, nici linkul
 * din meniu, nici ruta, nici intrarea din sitemap. Nu e ascuns cu CSS:
 * pur și simplu nu se generează.
 */
export interface Setari {
  /** 1 = Hero Video · 2 = Poveste alternantă · 3 = Galerie editorială */
  sablon: 1 | 2 | 3
  module: {
    meniuRestaurant: boolean
    evenimente: boolean
    galerieExtinsa: boolean
    zona: boolean
    engleza: boolean
    platiOnline: boolean
  }
  /** Secțiunile de pe prima pagină, în ordinea din fișier. */
  sectiuni: string[]
  butonWhatsApp: boolean
  /**
   * Calea către meniul în PDF, servit din `public/` (de ex.
   * `/documente/meniu-2026.pdf`). Când e completată, secțiunea de meniu de
   * pe prima pagină se reduce la un link către fișier, în loc să înșire
   * toate preparatele. JSON-LD-ul rămâne complet, deci SEO-ul nu pierde.
   */
  meniuPdf?: string
  analytics: boolean
}

const SECTIUNI_CUNOSCUTE: Record<string, string> = {
  'banda de incredere': 'trust',
  facilitati: 'perks',
  camere: 'rooms',
  'feature-uri alternante': 'features',
  'clip de prezentare': 'prezentare',
  oferte: 'offers',
  recenzii: 'reviews',
  harta: 'map',
  'intrebari frecvente': 'faq',
  'sectiune de inchidere': 'closing',
  'spatii de evenimente': 'events',
  'meniu restaurant': 'menu',
}

export const IMPLICIT: Setari = {
  sablon: 2,
  module: {
    meniuRestaurant: false,
    evenimente: false,
    galerieExtinsa: false,
    zona: false,
    engleza: false,
    platiOnline: false,
  },
  sectiuni: ['trust', 'perks', 'rooms', 'features', 'offers', 'reviews', 'map', 'faq', 'closing'],
  butonWhatsApp: false,
  analytics: false,
}

export function citesteSetari(doc: Document | null): Setari {
  if (!doc) return IMPLICIT

  const bloc = (nume: string) =>
    doc.blocuri.find((b) => b.titlu.toLowerCase().includes(nume))?.campuri ?? new Map<string, string>()

  const sablonBrut = numar(bloc('șablon').get('sablon') ?? bloc('sablon').get('sablon'))
  const sablon = sablonBrut === 1 || sablonBrut === 2 || sablonBrut === 3 ? sablonBrut : IMPLICIT.sablon

  const m = bloc('module')
  const module = {
    meniuRestaurant: boolean(m.get('meniu restaurant')) ?? false,
    evenimente: boolean(m.get('spatii de evenimente')) ?? false,
    galerieExtinsa: boolean(m.get('galerie extinsa')) ?? false,
    zona: boolean(m.get('pagina "zona" (atractii si distante)')) ?? boolean(m.get('pagina „zona" (atractii si distante)')) ?? false,
    engleza: boolean(m.get('engleza')) ?? false,
    platiOnline: boolean(m.get('plati online')) ?? false,
  }

  // Ordinea secțiunilor e ordinea rândurilor din fișier, nu o listă
  // fixă în cod: cine editează se așteaptă ca mutarea unui rând să mute
  // secțiunea. Un rând șters scoate secțiunea.
  const s = bloc('secțiuni') .size ? bloc('secțiuni') : bloc('sectiuni')
  const sectiuni: string[] = []
  for (const [cheie, valoare] of s) {
    const id = SECTIUNI_CUNOSCUTE[cheie]
    if (id && (boolean(valoare) ?? true)) sectiuni.push(id)
  }
  if (module.evenimente && !sectiuni.includes('events')) sectiuni.push('events')

  const alt = bloc('altele')

  return {
    sablon,
    module,
    sectiuni: sectiuni.length ? sectiuni : IMPLICIT.sectiuni,
    butonWhatsApp: boolean(alt.get('buton whatsapp')) ?? false,
    meniuPdf: alt.get('meniu pdf')?.trim() || undefined,
    analytics: boolean(alt.get('analytics')) ?? false,
  }
}
