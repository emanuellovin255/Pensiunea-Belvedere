import Image from 'next/image'
import Link from 'next/link'

import { AmenitatiChips } from './AmenitatiChips'
import { pret } from '@/lib/format'
import { Icon } from '@/components/Icon'
import type { Room, SiteData } from '@/content/types'

/**
 * Cardul unei camere. Duce la `/camere/<slug>` — pagina care prinde
 * căutările (T07).
 *
 * Server Component. `prioritizeaza` e adevărat doar pentru primele
 * carduri de deasupra pliului; restul primesc `loading="lazy"`
 * (REGULI.md 13). Prețul e „de la", format din numărul curat (T05);
 * fără preț confirmat se afișează `booking.labels.submit`, nu un preț
 * inventat (REGULI.md 3).
 */
export function CardCamera({
  camera,
  meta,
  labels,
  prioritizeaza = false,
}: {
  camera: Room
  meta: SiteData['meta']
  labels: SiteData['booking']['labels']
  prioritizeaza?: boolean
}) {
  const url = `/camere/${camera.slug}`

  return (
    <article className="card camera">
      <Link href={url} className="card-media" aria-label={camera.tag ? `${camera.name} — ${camera.tag}` : camera.name}>
        {camera.image && (
          <Image
            src={camera.image}
            alt={camera.name}
            width={640}
            height={480}
            sizes="(max-width: 820px) 100vw, 33vw"
            priority={prioritizeaza}
            loading={prioritizeaza ? undefined : 'lazy'}
          />
        )}
        {camera.tag && (
          <span className="ribbon" data-scarce={camera.scarce ? 'true' : undefined}>
            {camera.tag}
          </span>
        )}
      </Link>

      <div className="card-body">
        <h3>
          <Link href={url}>{camera.name}</Link>
        </h3>

        <div className="meta">
          {camera.occupancy && (
            <span>
              <Icon name="users" marime="sm" /> {camera.occupancy}
            </span>
          )}
          {camera.bed && (
            <span>
              <Icon name="bed" marime="sm" /> {camera.bed}
            </span>
          )}
          {camera.size && (
            <span>
              <Icon name="ruler" marime="sm" /> {camera.size}
            </span>
          )}
        </div>

        <AmenitatiChips amenitati={camera.amenities} maxim={4} />

        <div className="card-foot">
          <div className="price">
            {camera.priceFrom !== undefined ? (
              <>
                <small>{labels.from}</small>
                <b className="tabular">
                  {pret(camera.priceFrom, meta.currencySymbol)} <em>/ {labels.perNight}</em>
                </b>
              </>
            ) : (
              <span className="price-ask">{labels.submit}</span>
            )}
          </div>
          <Link className="btn btn-ghost btn-sm" href={url} aria-label={camera.name}>
            <Icon name="arrow" marime="sm" className="ic-nudge" />
          </Link>
        </div>
      </div>
    </article>
  )
}
