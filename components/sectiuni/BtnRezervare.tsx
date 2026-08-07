'use client'

import { useState } from 'react'

import { ModalRezervare } from './ModalRezervare'
import type { SiteData } from '@/content/types'
import { esteExtern, linkRezervare } from '@/lib/whatsapp'

/**
 * Butonul „Verifică disponibilitatea", peste tot în site.
 *
 * Cu JavaScript deschide calendarul (T64): perioada și numărul de oaspeți
 * se aleg în pagină, iar WhatsApp primește totul scris.
 *
 * Fără JavaScript rămâne exact ce se vede în HTML — un `<a>` către
 * WhatsApp, cu mesajul scurt și camera, dacă butonul stă lângă una
 * (REGULI.md 12). De asta e `<a href>` cu `preventDefault`, nu `<button>`:
 * un `<button>` fără JavaScript nu duce nicăieri.
 *
 * `subiect` — numele camerei sau al ofertei. Intră și în mesaj, și în
 * capul dialogului, ca omul să vadă pentru ce cere.
 */
export function BtnRezervare({
  date,
  subiect,
  clasa = 'btn btn-primary',
  eticheta,
}: {
  date: SiteData
  subiect?: string
  clasa?: string
  eticheta?: string
}) {
  const [deschis, setDeschis] = useState(false)
  const href = linkRezervare(date, subiect)
  const extern = esteExtern(href)

  return (
    <>
      <a
        className={clasa}
        href={href}
        {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={(e) => {
          // Click cu modificator / rotița = „deschide în tab nou". Îl lăsăm
          // browserului: e linkul real, nu o cursă spre dialog.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          setDeschis(true)
        }}
      >
        {eticheta ?? date.booking.labels.submit}
      </a>

      {deschis && <ModalRezervare date={date} subiect={subiect} onInchide={() => setDeschis(false)} />}
    </>
  )
}
