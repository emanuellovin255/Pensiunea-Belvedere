import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, PaginaOferta, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import { esteLimba, LIMBI, type Limba } from '@/lib/i18n/limbi'
import { construiesteMeta, baseUrl } from '@/lib/seo/meta'
import { schemaBreadcrumb, schemaOferta } from '@/lib/seo/jsonld'
import { siteCurent } from '@/lib/site'

/**
 * Pagina individuală a unei oferte sau a unui traseu de excursie (T61),
 * construită după modelul `camere/[slug]/page.tsx`. La Belvedere, cele 7
 * trasee sunt principalul diferențiator — fiecare merită o pagină proprie
 * indexabilă („excursie Pădurea Letea din Murighiol" e o căutare reală).
 */

export function generateStaticParams() {
  const params: { limba: string; slug: string }[] = []
  for (const limba of LIMBI) {
    const { date, setari } = siteCurent(limba)
    if (limba === 'en' && !setari.module.engleza) continue
    for (const o of date.offers.items) params.push({ limba, slug: o.slug })
  }
  return params
}

async function oferta(limbaBruta: string, slug: string) {
  if (!esteLimba(limbaBruta)) return null
  const { date } = siteCurent(limbaBruta)
  const of = date.offers.items.find((o) => o.slug === slug)
  return of ? { date, of, limba: limbaBruta as Limba } : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string; slug: string }>
}): Promise<Metadata> {
  const { limba, slug } = await params
  const g = await oferta(limba, slug)
  if (!g) return {}
  const { date, of } = g

  return construiesteMeta(date, g.limba, {
    titlu: of.title,
    descriere: of.text || `${of.title} la ${date.brand.name}.`,
    cale: `/oferte/${of.slug}`,
    imagine: of.image || date.seo.ogImage,
  })
}

export default async function Oferta({
  params,
}: {
  params: Promise<{ limba: string; slug: string }>
}) {
  const { limba, slug } = await params
  const g = await oferta(limba, slug)
  if (!g) notFound()
  const { date, of } = g
  const base = baseUrl()

  return (
    <>
      <Miscare />
      <JsonLd data={schemaOferta(of, date, base)} />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: 'Acasă', cale: '/' },
            { nume: date.offers.section.title, cale: '/oferte' },
            { nume: of.title, cale: `/oferte/${of.slug}` },
          ],
          base,
        )}
      />
      <Antet date={date} subiect={of.title} />
      <PaginaOferta oferta={of} date={date} />
      <Subsol date={date} />
      <BaraLipita date={date} subiect={of.title} />
    </>
  )
}
