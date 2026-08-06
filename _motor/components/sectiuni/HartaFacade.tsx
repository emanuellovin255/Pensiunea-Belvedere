'use client'

import { useState } from 'react'

import { Icon } from '@/components/Icon'
import type { SiteData } from '@/content/types'

/**
 * Facade de hartă: imagine statică, harta reală DOAR la click.
 *
 * `"use client"` doar pentru comutarea la click. Economia e tipică
 * 300–500 KB (standarde/02) și, mai important, harta reală face un
 * request către Google — care înainte de accept ar încălca GDPR-ul
 * (T11). Facade rezolvă amândouă: nimic nu pleacă spre Google până
 * când omul nu cere explicit harta.
 *
 * Lângă hartă: adresă, „cum ajungi", distanțe — text, care e și bun de
 * SEO (T07). Textul ăsta se randează server-side, deci un crawler îl
 * vede chiar dacă nu apasă pe hartă.
 *
 * `imagineStatica` e un fișier local (o captură a hărții cu marker),
 * nu un request live. Fără el, se afișează doar cardul de text.
 */
export function HartaFacade({
  contact,
  imagineStatica,
  distante,
  indicatii,
}: {
  contact: SiteData['contact']
  imagineStatica?: string
  distante?: string[]
  indicatii?: string
}) {
  const [incarcata, setIncarcata] = useState(false)

  const adresa = [contact.street, contact.postalCode, contact.city, contact.region]
    .filter(Boolean)
    .join(', ')

  const embed =
    contact.lat && contact.lng
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}&z=14&output=embed`
      : contact.mapsUrl

  return (
    <section id="harta">
      <div className="wrap grid g2" style={{ alignItems: 'start' }}>
        <div>
          {adresa && (
            <p className="lede" style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <Icon name="pin" /> {adresa}
            </p>
          )}
          {indicatii && <p style={{ marginTop: 'var(--sp-4)' }}>{indicatii}</p>}
          {distante && distante.length > 0 && (
            <ul className="chips" style={{ marginTop: 'var(--sp-4)' }}>
              {distante.map((d, i) => (
                <li className="chip" key={i}>
                  {d}
                </li>
              ))}
            </ul>
          )}
          {contact.mapsUrl && (
            <p style={{ marginTop: 'var(--sp-5)' }}>
              <a className="btn btn-ghost" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" marime="sm" /> Deschide în Google Maps
              </a>
            </p>
          )}
        </div>

        {embed && (
          <div className="map-facade">
            {incarcata ? (
              <iframe
                src={embed}
                title={`Hartă către ${contact.city || 'locație'}`}
                loading="lazy"
                style={{ width: '100%', height: '360px', border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <>
                {imagineStatica ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagineStatica} alt={`Hartă către ${contact.city || 'locație'}`} width={720} height={360} />
                ) : (
                  <div style={{ aspectRatio: '2 / 1', background: 'var(--surface-alt)' }} />
                )}
                <button type="button" onClick={() => setIncarcata(true)}>
                  <span>
                    <Icon name="pin" marime="sm" /> Încarcă harta
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
