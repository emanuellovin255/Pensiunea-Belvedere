import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, PaginaCamera, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import { esteLimba, LIMBI, type Limba } from '@/lib/i18n/limbi'
import { construiesteMeta, baseUrl } from '@/lib/seo/meta'
import { schemaBreadcrumb, schemaCamera } from '@/lib/seo/jsonld'
import { siteCurent } from '@/lib/site'

/**
 * Pagina individuală a unei camere. AICI ATERIZEAZĂ CĂUTĂRILE (T07).
 *
 * Se generează una per cameră, la build, din date/04-camere.md — nu se
 * copiază HTML de mână. `HotelRoom` + `Offer` pun prețul și
 * disponibilitatea în rezultatele Google. Prețul e în HTML, deci un
 * crawler care nu execută JS îl vede (REGULI.md 12).
 */

export function generateStaticParams() {
  const params: { limba: string; slug: string }[] = []
  for (const limba of LIMBI) {
    const { date, setari } = siteCurent(limba)
    if (limba === 'en' && !setari.module.engleza) continue
    for (const c of date.rooms.items) params.push({ limba, slug: c.slug })
  }
  return params
}

async function camera(limbaBruta: string, slug: string) {
  if (!esteLimba(limbaBruta)) return null
  const { date } = siteCurent(limbaBruta)
  const cam = date.rooms.items.find((c) => c.slug === slug)
  return cam ? { date, cam, limba: limbaBruta as Limba } : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string; slug: string }>
}): Promise<Metadata> {
  const { limba, slug } = await params
  const g = await camera(limba, slug)
  if (!g) return {}
  const { date, cam } = g

  const bucati = [cam.occupancy, cam.bed, cam.size].filter(Boolean).join(' · ')
  return construiesteMeta(date, g.limba, {
    titlu: cam.name,
    descriere:
      cam.description ?? `${cam.name} la ${date.brand.name}${bucati ? ` — ${bucati}` : ''}.`,
    cale: `/camere/${cam.slug}`,
    imagine: cam.image || date.seo.ogImage,
  })
}

export default async function Camera({
  params,
}: {
  params: Promise<{ limba: string; slug: string }>
}) {
  const { limba, slug } = await params
  const g = await camera(limba, slug)
  if (!g) notFound()
  const { date, cam } = g
  const base = baseUrl()

  return (
    <>
      <Miscare />
      <JsonLd data={schemaCamera(cam, date, base)} />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: 'Acasă', cale: '/' },
            { nume: 'Camere', cale: '/camere' },
            { nume: cam.name, cale: `/camere/${cam.slug}` },
          ],
          base,
        )}
      />
      <Antet date={date} subiect={cam.name} />
      <PaginaCamera camera={cam} date={date} />
      <Subsol date={date} />
      <BaraLipita date={date} subiect={cam.name} />
    </>
  )
}
