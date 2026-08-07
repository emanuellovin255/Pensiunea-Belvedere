'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Calendar } from './Calendar'
import { Icon } from '@/components/Icon'
import type { SiteData } from '@/content/types'
import { dataLizibila, nopti, urlWhatsApp } from '@/lib/whatsapp'

const MAX_OASPETI = 12

/**
 * Dialogul de disponibilitate (T64): calendar de perioadă + număr de
 * oaspeți, apoi WhatsApp cu totul precompletat.
 *
 * DE CE UN DIALOG, nu o pagină: pensiunea n-are motor de rezervări, deci
 * n-avem ce afișa după „caută" — nu știm ce e liber. Singurul lucru pe
 * care îl putem face bine e să adunăm exact ce trebuie gazda să știe și
 * să deschidem conversația. Un dialog nu scoate omul din pagină, deci
 * dacă se răzgândește rămâne unde era.
 *
 * Fără JavaScript dialogul nu există, iar butonul care l-ar fi deschis
 * rămâne un `<a>` către WhatsApp (`BtnRezervare`): mai sărac, dar întreg
 * (REGULI.md 12).
 *
 * SE RANDEAZĂ ÎN `document.body`, PRIN PORTAL. Nu e o preferință: butonul
 * care deschide dialogul stă și în antet, iar antetul are `backdrop-filter`.
 * Orice element cu `backdrop-filter` devine bloc conținător pentru
 * descendenții `position: fixed` — așa că un overlay „pe tot ecranul"
 * randat acolo se întindea pe cei 74px ai antetului, iar calendarul ieșea
 * tăiat deasupra ecranului. Portalul îl scoate din antet.
 */
export function ModalRezervare({
  date,
  subiect,
  onInchide,
}: {
  date: SiteData
  subiect?: string
  onInchide: () => void
}) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [persoane, setPersoane] = useState(2)
  const panou = useRef<HTMLDivElement>(null)

  /* Escape închide, iar fundalul nu se mai poate derula cât timp dialogul
     e deschis — altfel, pe telefon, degetul mișcă pagina de dedesubt. */
  useEffect(() => {
    function laTasta(e: KeyboardEvent) {
      if (e.key === 'Escape') onInchide()
    }
    document.addEventListener('keydown', laTasta)
    const dinainte = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panou.current?.focus()
    return () => {
      document.removeEventListener('keydown', laTasta)
      document.body.style.overflow = dinainte
    }
  }, [onInchide])

  const n = checkIn && checkOut ? nopti(checkIn, checkOut) : undefined
  const gata = Boolean(checkIn && checkOut)
  const href = urlWhatsApp(date.contact, { subiect, checkIn, checkOut, persoane })

  function trimite() {
    if (!gata) return
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
    else if (date.contact.phoneHref) window.location.href = date.contact.phoneHref
    onInchide()
  }

  const dialog = (
    <div className="mdl" role="presentation" onClick={onInchide}>
      <div
        className="mdl-panou"
        role="dialog"
        aria-modal="true"
        aria-label={date.booking.labels.submit}
        tabIndex={-1}
        ref={panou}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mdl-cap">
          <div>
            <h2>{date.booking.labels.submit}</h2>
            {subiect && <p className="mdl-subiect">{subiect}</p>}
          </div>
          <button type="button" className="mdl-inchide" onClick={onInchide} aria-label="Închide">
            <Icon name="close" marime="sm" />
          </button>
        </header>

        <div className="mdl-rezumat">
          <div className="mdl-camp">
            <small>{date.booking.labels.checkIn}</small>
            <b>{checkIn ? dataLizibila(checkIn) : '—'}</b>
          </div>
          <div className="mdl-camp">
            <small>{date.booking.labels.checkOut}</small>
            <b>{checkOut ? dataLizibila(checkOut) : '—'}</b>
          </div>
          <div className="mdl-camp">
            <small>{date.booking.labels.guests}</small>
            <div className="mdl-pas">
              <button
                type="button"
                onClick={() => setPersoane((p) => Math.max(1, p - 1))}
                disabled={persoane <= 1}
                aria-label="Un oaspete mai puțin"
              >
                −
              </button>
              <b className="tabular" aria-live="polite">
                {persoane}
              </b>
              <button
                type="button"
                onClick={() => setPersoane((p) => Math.min(MAX_OASPETI, p + 1))}
                disabled={persoane >= MAX_OASPETI}
                aria-label="Încă un oaspete"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <Calendar
          checkIn={checkIn}
          checkOut={checkOut}
          onSchimba={(i, o) => {
            setCheckIn(i)
            setCheckOut(o)
          }}
        />

        <footer className="mdl-jos">
          <p className="mdl-nopti">
            {n ? `${n} ${n === 1 ? 'noapte' : 'nopți'}` : 'Alege sosirea și plecarea'}
          </p>
          <button type="button" className="btn btn-wa" onClick={trimite} disabled={!gata}>
            <Icon name="phone" marime="sm" />
            {date.booking.labels.submit}
          </button>
        </footer>

        <p className="mdl-nota">
          Butonul deschide WhatsApp cu perioada și numărul de oaspeți deja scrise. Poți modifica
          mesajul înainte să-l trimiți.
        </p>
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
