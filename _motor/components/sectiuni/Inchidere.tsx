import type { SiteData } from '@/content/types'

/**
 * Ultima secțiune: un singur CTA, pe fundal de brand.
 *
 * Server Component. Nu se randează fără titlu — o secțiune de închidere
 * fără mesaj n-are ce închide.
 */
export function Inchidere({ date }: { date: SiteData }) {
  const { closing } = date
  if (!closing.title) return null

  return (
    <section className="on-brand inchidere">
      <div className="wrap sec-head center">
        {closing.eyebrow && <p className="eyebrow">{closing.eyebrow}</p>}
        <h2>{closing.title}</h2>
        {closing.text && <p className="lede">{closing.text}</p>}
        {closing.cta.label && (
          <p className="stack" style={{ justifyContent: 'center', marginTop: 'var(--sp-6)' }}>
            <a className="btn btn-accent" href={closing.cta.href}>
              {closing.cta.label}
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
