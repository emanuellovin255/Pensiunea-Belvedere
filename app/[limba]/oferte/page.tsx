import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, Oferte, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { construiesteMeta, baseUrl } from '@/lib/seo/meta'
import { schemaBreadcrumb } from '@/lib/seo/jsonld'
import { siteCurent } from '@/lib/site'

/** Lista de oferte și excursii. Fiecare card duce la pagina lui (T61). */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string }>
}): Promise<Metadata> {
  const { limba } = await params
  if (!esteLimba(limba)) return {}
  const { date } = siteCurent(limba)
  return construiesteMeta(date, limba, {
    titlu: date.offers.section.title,
    descriere: date.offers.section.lede || `Pachete și oferte la ${date.brand.name}.`,
    cale: '/oferte',
  })
}

export default async function ListaOferte({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  if (!esteLimba(limba)) notFound()
  const lang = limba as Limba
  const { date } = siteCurent(lang)
  const base = baseUrl()

  return (
    <>
      <Miscare />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: 'Acasă', cale: '/' },
            { nume: date.offers.section.title, cale: '/oferte' },
          ],
          base,
        )}
      />
      <Antet date={date} />
      <main id="continut">
        <Oferte date={date} />
      </main>
      <Subsol date={date} />
      {/* Vezi comentariul din oferte/[slug]: prețul camerelor n-are ce căuta
          sub o listă de excursii fără preț. */}
      <BaraLipita date={date} faraPret />
    </>
  )
}
