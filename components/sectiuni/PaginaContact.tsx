import { Formular } from '@/components/Formular'
import { Icon } from '@/components/Icon'
import { HartaFacade } from './HartaFacade'
import { etichete } from '@/lib/i18n/etichete'
import type { Limba } from '@/lib/i18n/limbi'
import type { SiteData } from '@/content/types'

/**
 * Pagina de contact (T68).
 *
 * Contactul era o ancoră către subsol: linkul din antet ducea la
 * `/#contact`, adică la footerul primei pagini. Funcționa, dar n-avea
 * ce indexa Google — „pensiune Murighiol contact" sau „telefon Belvedere
 * Murighiol" n-aveau pe ce ateriza — și de pe o pagină de cameră săreai
 * înapoi pe prima pagină ca să vezi un număr de telefon.
 *
 * Aici sunt, în ordine: datele de contact în text (aceleași câmpuri care
 * alimentează JSON-LD-ul și subsolul, deci NAP-ul rămâne identic peste
 * tot — standarde/02), formularul de cerere și harta.
 *
 * Server Component; doar formularul e client, fiindcă are stare. Fără
 * JavaScript rămâne un `<form method="post">` real, iar telefonul,
 * WhatsApp-ul și adresa sunt linkuri obișnuite.
 *
 * Ce nu există în `date/` nu se randează (REGULI.md 3): fără oră de
 * check-in nu apare un rând „Check-in:" gol.
 */
export function PaginaContact({ date, limba = 'ro' }: { date: SiteData; limba?: Limba }) {
  const t = etichete(limba)
  const { contact } = date

  // Fără țară: în `date/02-telefon-email-si-adresa.md` e scrisă ca „RO", cod de care are
  // nevoie JSON-LD-ul, nu omul care caută adresa.
  const adresa = [contact.street, contact.postalCode, contact.city, contact.region]
    .filter(Boolean)
    .join(', ')

  const wa = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : undefined
  // WhatsApp are rândul lui mai sus; loader-ul îl pune și în `social`, ca
  // să apară în subsol. Aici l-ar dubla.
  const retele = contact.social.filter((s) => s.url !== wa)
  const areProgram = Boolean(contact.checkIn || contact.checkOut || contact.hours)

  return (
    <main id="continut">
      <article className="wrap" style={{ paddingBlock: 'var(--section-pad)' }}>
        <header className="sec-head">
          <p className="eyebrow">{date.brand.name}</p>
          <h1>{t.contactTitlu}</h1>
          <p className="lede" style={{ marginTop: 'var(--sp-4)' }}>
            {t.contactLede}
          </p>
        </header>

        <div className="grid g2" style={{ alignItems: 'start' }}>
          <section aria-labelledby="contact-date">
            <h2 id="contact-date">{t.contactDate}</h2>

            <ul className="contact-lista">
              {contact.phone && (
                <li>
                  <Icon name="phone" marime="sm" />
                  <span>
                    <b>{t.contactTelefon}</b>
                    <a href={contact.phoneHref}>{contact.phone}</a>
                  </span>
                </li>
              )}
              {wa && (
                <li>
                  {/* Setul de iconuri n-are marcă WhatsApp; „phone" e cel mai
                      apropiat lucru corect, iar eticheta spune despre ce e vorba. */}
                  <Icon name="phone" marime="sm" />
                  <span>
                    <b>WhatsApp</b>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      {t.contactWhatsapp}
                    </a>
                  </span>
                </li>
              )}
              {contact.email && (
                <li>
                  <Icon name="mail" marime="sm" />
                  <span>
                    <b>{t.contactEmail}</b>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </span>
                </li>
              )}
              {adresa && (
                <li>
                  <Icon name="pin" marime="sm" />
                  <span>
                    <b>{t.contactAdresa}</b>
                    {contact.mapsUrl ? (
                      <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                        {adresa}
                      </a>
                    ) : (
                      adresa
                    )}
                  </span>
                </li>
              )}
              {areProgram && (
                <li>
                  <Icon name="clock" marime="sm" />
                  <span>
                    <b>{t.contactProgram}</b>
                    {contact.checkIn && (
                      <span>
                        {t.contactCheckIn}: {contact.checkIn}
                      </span>
                    )}
                    {contact.checkOut && (
                      <span>
                        {t.contactCheckOut}: {contact.checkOut}
                      </span>
                    )}
                    {contact.hours && <span>{contact.hours}</span>}
                  </span>
                </li>
              )}
            </ul>

            {retele.length > 0 && (
              <div style={{ marginTop: 'var(--sp-6)' }}>
                <h3>{t.contactSocial}</h3>
                <p className="stack" style={{ marginTop: 'var(--sp-3)' }}>
                  {retele.map((s) => (
                    <a
                      className="btn btn-ghost btn-sm"
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name={s.icon} marime="sm" /> {s.label}
                    </a>
                  ))}
                </p>
              </div>
            )}
          </section>

          <section aria-labelledby="contact-formular">
            <h2 id="contact-formular">{t.contactFormular}</h2>
            <p style={{ marginTop: 'var(--sp-3)' }}>{t.contactFormularLede}</p>
            <div style={{ marginTop: 'var(--sp-5)' }}>
              <Formular limba={limba} />
            </div>
          </section>
        </div>
      </article>

      <HartaFacade contact={contact} />
    </main>
  )
}
