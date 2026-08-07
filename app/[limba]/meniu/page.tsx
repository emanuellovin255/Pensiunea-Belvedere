import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, MeniuRestaurant, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import type { SiteData } from '@/content/types'
import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { etichete } from '@/lib/i18n/etichete'
import { construiesteLocales, limbiActive } from '@/lib/i18n/rute'
import { construiesteMeta, baseUrl } from '@/lib/seo/meta'
import { schemaBreadcrumb, schemaMeniu } from '@/lib/seo/jsonld'
import { siteCurent } from '@/lib/site'

/**
 * Meniul complet al restaurantului, la adresa lui.
 *
 * DE CE O PAGINĂ ȘI NU O SECȚIUNE (T65)
 * -------------------------------------
 * Meniul are 100 de preparate. Pe prima pagină, între recenzii și hartă,
 * ar însemna ~10 000 px de derulare pe telefon — motivul pentru care
 * fusese redus la un link către PDF. Dar un PDF nu se indexează util:
 * „storceag Murighiol" sau „restaurant pescăresc Deltă meniu prețuri"
 * n-aveau pe ce ateriza, deși răspunsul exista în fișier.
 *
 * Aici îl are: HTML real, cu preparate, gramaje, ingrediente, alergeni,
 * valori nutriționale și prețuri, plus `Menu` în JSON-LD. Prima pagină
 * păstrează specialitățile și trimite încoace.
 *
 * PDF-ul rămâne, ca link secundar jos de tot: cine vrea meniul salvat pe
 * telefon îl vrea întreg, într-un fișier.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string }>
}): Promise<Metadata> {
  const { limba } = await params
  if (!esteLimba(limba)) return {}
  const { date, setari, meniu, meniuSectiune } = siteCurent(limba)
  if (!meniu.length) return {}
  const t = etichete(limba)

  return construiesteMeta(date, limba, {
    titlu: meniuSectiune.title ?? t.meniuTitlu,
    descriere: meniuSectiune.lede,
    cale: '/meniu',
    limbiDisponibile: limbiActive(setari.module.engleza),
  })
}

export default async function PaginaMeniu({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  if (!esteLimba(limba)) notFound()
  const lang = limba as Limba

  const { date: dateBaza, setari, meniu, meniuSectiune } = siteCurent(lang)

  // Modulul oprit sau meniul necompletat → ruta nu există (REGULI.md 3).
  // Același criteriu ca în `lib/seo/rute.ts`, ca sitemap-ul și paginile
  // reale să nu se contrazică.
  if (!setari.module.meniuRestaurant || !meniu.length) notFound()

  const base = baseUrl()
  const t = etichete(lang)
  const date: SiteData = {
    ...dateBaza,
    locales: construiesteLocales(lang, '/meniu', limbiActive(setari.module.engleza)),
  }

  return (
    <>
      <Miscare />
      <JsonLd data={schemaMeniu(meniu, date.brand.name)} />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: t.acasa, cale: '/' },
            { nume: meniuSectiune.title ?? t.meniuTitlu, cale: '/meniu' },
          ],
          base,
          lang,
        )}
      />
      <Antet date={date} />
      <main id="continut">
        <MeniuRestaurant
          categorii={meniu}
          limba={lang}
          sectiune={meniuSectiune}
          navCategorii
          pdf={setari.meniuPdf}
        />
      </main>
      <Subsol date={date} />
      {/* Fără preț: „de la 300 lei" e prețul unei camere și n-are ce căuta
          sub o listă de preparate. Același motiv ca la /oferte. */}
      <BaraLipita date={date} faraPret />
    </>
  )
}
