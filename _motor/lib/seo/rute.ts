import type { SiteData } from '@/content/types'
import type { Setari } from '@/lib/continut'
import { caleaPublica, LIMBA_IMPLICITA, type Limba } from '@/lib/i18n/limbi'

/**
 * Enumeră rutele reale ale unui site, din datele și setările lui.
 *
 * Sursa unică pentru sitemap.xml (T07) și pentru `generateStaticParams`
 * din șabloane. O rută apare aici DOAR dacă are conținut: o secțiune de
 * evenimente oprită nu produce `/evenimente`. De asta sitemap-ul
 * conține exact rutele generate, niciuna în plus (criteriu T07).
 *
 * URL-urile sunt în română, dar FĂRĂ diacritice (T07): slug-urile vin
 * din loader, care le-a curățat deja („terasă" → `terasa`).
 */
export interface Ruta {
  /** Calea internă, fără prefix de limbă. */
  cale: string
  /** Prioritate relativă pentru sitemap. */
  prioritate: number
  /** Cât de des se schimbă, orientativ. */
  frecventa: 'weekly' | 'monthly' | 'yearly'
}

export function ruteleSitului(date: SiteData, setari: Setari): Ruta[] {
  const rute: Ruta[] = [{ cale: '/', prioritate: 1, frecventa: 'weekly' }]

  if (date.rooms.items.length) {
    rute.push({ cale: '/camere', prioritate: 0.9, frecventa: 'weekly' })
    for (const c of date.rooms.items) {
      // Paginile de cameră sunt cele care prind căutările — prioritate mare.
      rute.push({ cale: `/camere/${c.slug}`, prioritate: 0.8, frecventa: 'weekly' })
    }
  }

  if (date.offers.items.length) {
    rute.push({ cale: '/oferte', prioritate: 0.7, frecventa: 'weekly' })
    for (const o of date.offers.items) {
      rute.push({ cale: `/oferte/${o.slug}`, prioritate: 0.6, frecventa: 'weekly' })
    }
  }

  if (setari.module.meniuRestaurant) rute.push({ cale: '/facilitati/restaurant', prioritate: 0.6, frecventa: 'monthly' })
  if (setari.module.evenimente) rute.push({ cale: '/evenimente', prioritate: 0.6, frecventa: 'monthly' })
  if (setari.module.galerieExtinsa) rute.push({ cale: '/galerie', prioritate: 0.5, frecventa: 'monthly' })
  if (setari.module.zona) rute.push({ cale: '/zona', prioritate: 0.6, frecventa: 'monthly' })

  rute.push({ cale: '/contact', prioritate: 0.7, frecventa: 'monthly' })

  // Paginile legale există mereu, dar contează puțin pentru căutare.
  for (const l of date.legal.links) {
    rute.push({ cale: l.href, prioritate: 0.2, frecventa: 'yearly' })
  }

  return rute
}

/**
 * Toate rutele, pentru toate limbile în care există site-ul. Româna nu
 * poartă prefix; engleza primește `/en` doar dacă e activată.
 */
export function ruteCuLimbi(
  date: SiteData,
  setari: Setari,
  limbi: Limba[],
): { url: string; prioritate: number; frecventa: Ruta['frecventa'] }[] {
  const rute = ruteleSitului(date, setari)
  const iesire: { url: string; prioritate: number; frecventa: Ruta['frecventa'] }[] = []
  const active = limbi.length ? limbi : [LIMBA_IMPLICITA]

  for (const l of active) {
    for (const r of rute) {
      iesire.push({ url: caleaPublica(l, r.cale), prioritate: r.prioritate, frecventa: r.frecventa })
    }
  }
  return iesire
}
