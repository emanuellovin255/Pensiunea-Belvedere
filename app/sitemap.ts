import type { MetadataRoute } from 'next'

import { ruteCuLimbi } from '@/lib/seo/rute'
import { baseUrl } from '@/lib/seo/meta'
import { siteCurent } from '@/lib/site'
import { LIMBA_IMPLICITA, type Limba } from '@/lib/i18n/limbi'

/**
 * sitemap.xml, generat din rutele REALE (T07).
 *
 * Conține exact paginile care se generează, niciuna în plus: `ruteCuLimbi`
 * le enumeră din datele și setările site-ului, deci o secțiune oprită nu
 * apare aici. `/en` apare doar dacă engleza e activată — un sitemap care
 * listează o pagină inexistentă e o eroare de crawl.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl()
  const { date, setari } = siteCurent()

  const limbi: Limba[] = setari.module.engleza ? ['ro', 'en'] : [LIMBA_IMPLICITA]
  const lastmod = date.meta.generatedAt

  return ruteCuLimbi(limbi, (l) => {
    const s = siteCurent(l)
    return { date: s.date, setari: s.setari, areMeniu: s.meniu.length > 0 }
  }).map((r) => ({
    url: base + r.url,
    lastModified: lastmod,
    changeFrequency: r.frecventa,
    priority: r.prioritate,
  }))
}
