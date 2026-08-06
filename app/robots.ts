import type { MetadataRoute } from 'next'

import { baseUrl } from '@/lib/seo/meta'

/**
 * robots.txt.
 *
 * Permite tot, cu excepția paginilor de probă ale motorului (nu ajung
 * la un client, dar dacă ajung, nu vrem să fie indexate). Trimite spre
 * sitemap. Crawlerele AI (GPTBot, PerplexityBot, ClaudeBot) sunt permise
 * explicit — vizibilitatea acolo e exact ce urmărim (T07).
 */
export default function robots(): MetadataRoute.Robots {
  const base = baseUrl()
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/probe/', '/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
