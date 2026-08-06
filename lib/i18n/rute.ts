import type { SiteData } from '@/content/types'
import { caleaPublica, ETICHETE, LIMBA_IMPLICITA, LIMBI, type Limba } from './limbi'

/**
 * Segmentele de rută traduse. Slug-urile DIFERĂ între limbi:
 * `/camere/apartament-deluxe` vs `/en/rooms/deluxe-apartment` (T08).
 * Maparea e explicită, nu ghicită — un slug tradus greșit rupe
 * `hreflang`-ul în ambele direcții.
 *
 * Segmentele de nivel înalt (camere↔rooms) se traduc aici, o dată.
 * Slug-urile de cameră/ofertă se mapează în `en/` prin numele
 * fișierului, la nivel de client (T08); dacă nu există o mapare, se
 * păstrează slug-ul românesc, ca ruta să existe totuși.
 */
const SEGMENTE: Record<string, Partial<Record<Limba, string>>> = {
  camere: { ro: 'camere', en: 'rooms' },
  oferte: { ro: 'oferte', en: 'offers' },
  contact: { ro: 'contact', en: 'contact' },
  facilitati: { ro: 'facilitati', en: 'facilities' },
  restaurant: { ro: 'restaurant', en: 'restaurant' },
  evenimente: { ro: 'evenimente', en: 'events' },
  galerie: { ro: 'galerie', en: 'gallery' },
  zona: { ro: 'zona', en: 'area' },
}

/** Traduce primul segment al unei căi; restul (slug-ul) rămâne neatins. */
export function traduSegment(cale: string, limba: Limba): string {
  const parti = cale.replace(/^\//, '').split('/')
  if (!parti[0]) return cale
  const tradus = SEGMENTE[parti[0]]?.[limba]
  if (tradus) parti[0] = tradus
  return `/${parti.join('/')}`
}

/**
 * Construiește `SiteData.locales` pentru comutator: fiecare limbă cu
 * eticheta ei și cu URL-ul PAGINII ECHIVALENTE, nu al primei pagini
 * (T08). `limbiActive` sunt limbile în care pagina chiar există.
 */
export function construiesteLocales(
  limbaCurenta: Limba,
  caleInterna: string,
  limbiActive: Limba[],
): SiteData['locales'] {
  const active = limbiActive.length ? limbiActive : [LIMBA_IMPLICITA]
  return active.map((l) => ({
    code: l,
    label: ETICHETE[l],
    href: caleaPublica(l, traduSegment(caleInterna, l)),
    current: l === limbaCurenta,
  }))
}

/** Limbile în care există site-ul, după setări. Româna mereu; engleza opțional. */
export function limbiActive(englezaPornita: boolean): Limba[] {
  return englezaPornita ? [...LIMBI] : [LIMBA_IMPLICITA]
}
