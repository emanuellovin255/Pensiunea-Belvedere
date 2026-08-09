import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Antet, BaraLipita, PaginaContact, Subsol } from '@/components/sectiuni'
import { JsonLd } from '@/components/JsonLd'
import { Miscare } from '@/components/Miscare'
import type { SiteData } from '@/content/types'
import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { etichete } from '@/lib/i18n/etichete'
import { construiesteLocales, limbiActive } from '@/lib/i18n/rute'
import { construiesteMeta, baseUrl } from '@/lib/seo/meta'
import { schemaBreadcrumb, schemaOrganizatie } from '@/lib/seo/jsonld'
import { siteCurent } from '@/lib/site'

/**
 * Pagina de contact, la adresa ei (T68).
 *
 * DE CE O PAGINĂ ȘI NU O ANCORĂ
 * -----------------------------
 * „Contact" din antet ducea la `/#contact`, adică la subsolul primei
 * pagini. De pe pagina unei camere însemna o săritură înapoi pe acasă
 * ca să vezi un număr de telefon, iar pentru Google nu exista nimic de
 * indexat: „contact pensiune Murighiol" n-avea pe ce ateriza.
 *
 * Acum are: adresă, telefon, WhatsApp, e-mail, orele de check-in și
 * check-out, formularul de cerere și harta — toate în HTML, din
 * `date/02-contact.md`. Subsolul rămâne cum era, cu `id="contact"`:
 * n-are rost să dispară un NAP care e oricum pe fiecare pagină.
 */

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
    titlu: t.contactTitlu,
    descriere: t.contactLede,
    cale: '/contact',
    limbiDisponibile: limbiActive(setari.module.engleza),
  })
}

export default async function Contact({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  if (!esteLimba(limba)) notFound()
  const lang = limba as Limba

  const { date: dateBaza, setari } = siteCurent(lang)
  const base = baseUrl()
  const t = etichete(lang)

  const date: SiteData = {
    ...dateBaza,
    locales: construiesteLocales(lang, '/contact', limbiActive(setari.module.engleza)),
  }

  return (
    <>
      <Miscare />
      <JsonLd data={schemaOrganizatie(date, base)} />
      <JsonLd
        data={schemaBreadcrumb(
          [
            { nume: t.acasa, cale: '/' },
            { nume: t.contactTitlu, cale: '/contact' },
          ],
          base,
          lang,
        )}
      />
      <Antet date={date} />
      <PaginaContact date={date} limba={lang} />
      <Subsol date={date} />
      {/* Fără preț: pe pagina de contact, „de la 450 lei" ar fi tariful unei
          camere lipit sub un formular de cerere. Același motiv ca la /meniu. */}
      <BaraLipita date={date} faraPret />
    </>
  )
}
