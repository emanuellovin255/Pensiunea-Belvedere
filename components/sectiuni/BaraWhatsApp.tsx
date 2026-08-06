import { Icon } from '@/components/Icon'
import type { SiteData } from '@/content/types'

/**
 * Blocul de rezervare, în varianta „întreabă pe WhatsApp".
 *
 * Înlocuiește `BaraDisponibilitate` (calendar cu sosire/plecare/persoane)
 * la locațiile care NU au motor de rezervări. Motivul e simplu: un
 * calendar care nu știe ce e liber îi cere omului să completeze trei
 * câmpuri și apoi tot îl trimite la un formular. WhatsApp taie pasul —
 * un tap, conversația e deschisă, cu mesajul deja scris.
 *
 * Server Component: e un `<a>`, nu are stare. Funcționează identic fără
 * JavaScript și e vizibil în HTML pentru crawlere.
 *
 * `#rezervare` rămâne aici: butonul din antet, cel din hero și bara
 * lipită de pe mobil trimit toate spre ancora asta.
 *
 * Fără număr de WhatsApp în `date/02-contact.md`, secțiunea cade elegant
 * pe telefon; fără niciunul, nu se randează deloc (REGULI.md 3).
 */
export function BaraWhatsApp({ date }: { date: SiteData }) {
  const { contact, booking, brand } = date

  if (!contact.whatsapp && !contact.phone) return null

  // Mesajul e precompletat, dar rămâne editabil în WhatsApp. Îi scutește
  // pe amândoi de primul schimb de replici („bună, aveți liber?").
  const mesaj = encodeURIComponent(
    `Bună ziua! Aș vrea să știu dacă aveți camere libere la ${brand.name}. Perioada: `,
  )
  const urlWa = contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${mesaj}` : null

  return (
    <section id="rezervare" aria-label={booking.labels.submit}>
      <div className="wrap">
        <div className="wa-block">
          <div className="wa-block-text">
            <h2>{booking.labels.submit}</h2>
            <p className="lede">
              Scrie-ne perioada pe WhatsApp și îți răspundem cu ce e liber și cu prețul exact.
              Răspundem în aceeași zi.
            </p>
          </div>

          <div className="stack wa-block-actions">
            {urlWa && (
              <a className="btn btn-wa" href={urlWa} target="_blank" rel="noopener noreferrer">
                <Icon name="phone" marime="sm" />
                Întreabă pe WhatsApp
              </a>
            )}
            {contact.phoneHref && (
              <a className="btn btn-ghost" href={contact.phoneHref}>
                <Icon name="phone" marime="sm" />
                {contact.phone}
              </a>
            )}
          </div>

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
        </div>
      </div>
    </section>
  )
}
