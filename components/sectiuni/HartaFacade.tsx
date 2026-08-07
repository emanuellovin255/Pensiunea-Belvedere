import { AntetSectiune } from './AntetSectiune'
import { Icon } from '@/components/Icon'
import type { SiteData } from '@/content/types'

/**
 * Harta locației: adresă în text + harta Google încărcată direct.
 *
 * Era un facade cu click („Încarcă harta"), ca să nu plece niciun request
 * spre Google înainte de accept. Clientul a cerut explicit harta vizibilă
 * din prima (T62), deci iframe-ul se randează odată cu pagina. E o decizie
 * de business asumată, nu o scăpare: harta e un `<iframe>` de la Google, iar
 * `loading="lazy"` + `referrerPolicy` țin costul cât se poate de mic.
 *
 * Fără stare, deci Server Component — nu mai are nevoie de `"use client"`.
 *
 * Lângă hartă: adresă, „cum ajungi", distanțe — text, care e și bun de
 * SEO (T07) și se vede de crawlere fără JavaScript.
 */
export function HartaFacade({
  contact,
  distante,
  indicatii,
  titlu = 'Pe hartă',
}: {
  contact: SiteData['contact']
  distante?: string[]
  indicatii?: string
  titlu?: string
}) {
  const adresa = [contact.street, contact.postalCode, contact.city, contact.region]
    .filter(Boolean)
    .join(', ')

  const embed =
    contact.lat && contact.lng
      ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}&z=14&output=embed`
      : contact.mapsUrl

  return (
    <section id="harta">
      <div className="wrap">
        <AntetSectiune eyebrow="Unde ne găsești" title={titlu} />
      </div>
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
            <iframe
              src={embed}
              title={`Hartă către ${contact.city || 'locație'}`}
              loading="lazy"
              style={{ width: '100%', height: '360px', border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  )
}
