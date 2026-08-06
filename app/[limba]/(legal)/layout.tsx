import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Antet, Subsol } from '@/components/sectiuni'
import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { siteCurent } from '@/lib/site'

/**
 * Chrome-ul comun al paginilor legale (T11): antet + subsol, ca vizitatorul
 * să navigheze normal de pe o politică. Conținutul fiecărei pagini vine din
 * `page.tsx`. Grupul de rute `(legal)` nu adaugă segment în URL — paginile
 * rămân la `/politica-confidentialitate`, `/termeni` etc.
 *
 * Trăiește sub `[limba]` (nu la `app/(legal)/`) ca să primească `<html lang>`
 * din layout-ul rădăcină și rutele localizate din middleware.
 */
export default async function LayoutLegal({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ limba: string }>
}) {
  const { limba } = await params
  if (!esteLimba(limba)) notFound()
  const { date } = siteCurent(limba as Limba)

  return (
    <>
      <Antet date={date} />
      <main id="continut">
        <div className="wrap">
          <article className="legal">{children}</article>
        </div>
      </main>
      <Subsol date={date} />
    </>
  )
}
