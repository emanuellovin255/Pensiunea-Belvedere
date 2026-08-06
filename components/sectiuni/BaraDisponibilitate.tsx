'use client'

import { type FormEvent, useState } from 'react'

import { Icon } from '@/components/Icon'
import { IframeRezervare } from '@/components/IframeRezervare'
import type { SiteData } from '@/content/types'
import { rezolvaRezervare } from '@/lib/rezervari'

/**
 * Bara de disponibilitate: check-in, check-out, persoane, submit.
 *
 * `"use client"` fiindcă e interactivă. Dar — atenție — NU conține
 * motorul de rezervări (T06). Doar colectează datele și le predă
 * adaptorului din T12 prin `onCauta`. Șablonul nu știe cu ce sistem
 * vorbește: deep-link, iframe sau formular, decizia e a adaptorului.
 *
 * Fără JavaScript rămâne un `<form>` real care face GET către
 * `#rezervare`: câmpurile ajung în URL, iar adaptorul server-side le
 * poate citi. Nu e la fel de fluid, dar funcționează — pagina rămâne
 * întreagă (REGULI.md 12).
 *
 * Toate etichetele vin din `booking.labels` (T05), deci se traduc la
 * T08 fără să atingem componenta.
 */
export function BaraDisponibilitate({
  date,
  onCauta,
}: {
  date: SiteData
  onCauta?: (cerere: { checkIn: string; checkOut: string; persoane: string }) => void
}) {
  const { booking } = date
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [persoane, setPersoane] = useState(booking.guestOptions[0] ?? '')
  const [srcIframe, setSrcIframe] = useState<string | null>(null)

  const optiuni = booking.guestOptions.length ? booking.guestOptions : ['2 persoane']

  /**
   * Cu JavaScript, submit-ul consultă adaptorul (T12) și execută rezultatul:
   * deep-link → navighează în motorul lor cu datele completate; iframe → îl
   * dezvăluie leneș sub bară; formular → coboară la formularul de contact.
   * Fără JavaScript, `onSubmit` nu rulează: `<form>`-ul face GET către
   * `#rezervare`, unde rămân telefonul și formularul (REGULI.md 12).
   */
  function laSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const cerere = { checkIn, checkOut, persoane }
    if (onCauta) {
      onCauta(cerere)
      return
    }
    const r = rezolvaRezervare(booking, cerere)
    if (r.tip === 'link') {
      window.location.href = r.url
    } else if (r.tip === 'iframe') {
      setSrcIframe(r.src)
    } else {
      const formular = document.getElementById('formular')
      if (formular) formular.scrollIntoView({ behavior: 'smooth' })
      else window.location.hash = 'rezervare'
    }
  }

  return (
    <section id="rezervare" aria-label={booking.labels.submit}>
      <div className="wrap">
        <form className="booking" method="get" action="#rezervare" onSubmit={laSubmit}>
          <label className="bk-field">
            {booking.labels.checkIn}
            <input
              type="date"
              name="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>
          <label className="bk-field">
            {booking.labels.checkOut}
            <input
              type="date"
              name="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
          <label className="bk-field">
            {booking.labels.guests}
            <select name="persoane" value={persoane} onChange={(e) => setPersoane(e.target.value)}>
              {optiuni.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            <Icon name="search" marime="sm" />
            {booking.labels.submit}
          </button>

          {booking.assurances.length > 0 && (
            <div className="bk-note">
              {booking.assurances.map((a, i) => (
                <span key={i}>
                  <Icon name="check" marime="sm" />
                  {a}
                </span>
              ))}
            </div>
          )}
        </form>

        {/* Iframe-ul motorului, dezvăluit leneș doar după submit (mod „iframe"). */}
        {srcIframe && <IframeRezervare src={srcIframe} auto titlu={booking.labels.submit} />}
      </div>
    </section>
  )
}
