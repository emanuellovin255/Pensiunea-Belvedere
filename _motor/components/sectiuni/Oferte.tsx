import Image from 'next/image'
import Link from 'next/link'

import { AntetSectiune } from './AntetSectiune'
import { Icon } from '@/components/Icon'
import type { Offer, SiteData } from '@/content/types'

/**
 * Ofertele: pachete cu preț și, opțional, preț tăiat.
 *
 * Server Component. Prețul unei oferte e formatat (`Offer.price` e
 * `string`), fiindcă pachetele se cotează întreg, nu pe noapte. Prețul
 * tăiat se afișează doar dacă există unul real — nu inventăm o reducere
 * (REGULI.md 3).
 *
 * Pe mobil, secțiunea devine caruselul 3D din depth.css (clasa
 * `.oferte` / `.oferta`). Nu se randează fără oferte.
 */
export function Oferte({ date }: { date: SiteData }) {
  const { offers } = date
  if (!offers.items.length) return null

  return (
    <section className="oferte" id="oferte">
      <div className="wrap">
        <AntetSectiune eyebrow={offers.section.eyebrow} title={offers.section.title} lede={offers.section.lede} />
        <div className="grid g3">
          {offers.items.map((o) => (
            <CardOferta key={o.slug} oferta={o} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CardOferta({ oferta }: { oferta: Offer }) {
  const url = oferta.href ?? `/oferte/${oferta.slug}`
  return (
    <article className="card oferta">
      {oferta.image && (
        <Link href={url} className="card-media" aria-label={oferta.badge ? `${oferta.title} — ${oferta.badge}` : oferta.title}>
          <Image
            src={oferta.image}
            alt={oferta.title}
            width={640}
            height={480}
            sizes="(max-width: 820px) 100vw, 33vw"
            loading="lazy"
          />
          {oferta.badge && <span className="ribbon">{oferta.badge}</span>}
        </Link>
      )}
      <div className="card-body">
        <h3>
          <Link href={url}>{oferta.title}</Link>
        </h3>
        {oferta.text && <p className="lede">{oferta.text}</p>}
        {oferta.price && (
          <div className="card-foot">
            <div className="price">
              <b className="tabular">
                {oferta.price}
                {oferta.priceUnit && <em> {oferta.priceUnit}</em>}
              </b>
              {oferta.priceWas && <span className="was tabular">{oferta.priceWas}</span>}
            </div>
            <Link className="btn btn-ghost btn-sm" href={url} aria-label={oferta.title}>
              <Icon name="arrow" marime="sm" className="ic-nudge" />
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
