import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, Oferte, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import type { SiteData } from '@/content/types'
import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { etichete } from '@/lib/i18n/etichete'
import { construiesteLocales, limbiActive } from '@/lib/i18n/rute'
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
  const { date, setari } = siteCurent(limba)
  const t = etichete(limba)
  return construiesteMeta(date, limba, {
    titlu: date.offers.section.title,
    descriere: date.offers.section.lede || `${t.descriereOferte} ${date.brand.name}.`,
    cale: '/oferte',
    limbiDisponibile: limbiActive(setari.module.engleza),
  })
}

export default async function ListaOferte({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  if (!esteLimba(limba)) notFound()
  const lang = limba as Limba
  const { date: dateBaza, setari } = siteCurent(lang)
  const base = baseUrl()
  const t = etichete(lang)

  const date: SiteData = {
    ...dateBaza,
    locales: construiesteLocales(lang, '/oferte', limbiActive(setari.module.engleza)),
  }

  return (
    <>
      <Miscare />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: t.acasa, cale: '/' },
            { nume: date.offers.section.title, cale: '/oferte' },
          ],
          base,
          lang,
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
