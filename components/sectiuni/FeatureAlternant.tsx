import Image from 'next/image'

import { BtnRezervare } from './BtnRezervare'
import { Icon } from '@/components/Icon'
import type { Cta, Feature, SiteData } from '@/content/types'
import { esteExtern } from '@/lib/whatsapp'

/**
 * Feature alternant: imagine + text, cu latura care alternează.
 *
 * Ăsta e MOTORUL Șablonului 2 (T06). `reverse` vine deja calculat din
 * loader (T05): al doilea, al patrulea feature au imaginea pe partea
 * cealaltă, fără ca cine editează să fi scris ceva. `data-reverse`
 * comută ordinea prin CSS, deci pe mobil se aplatizează la o coloană.
 *
 * Server Component. Se randează un feature doar dacă are titlu. Poza
 * primește `loading="lazy"` — feature-urile sunt mereu sub pliu.
 */
function butonClasa(v: Cta['variant']): string {
  if (v === 'primary') return 'btn btn-primary'
  if (v === 'accent') return 'btn btn-accent'
  if (v === 'light') return 'btn btn-light'
  return 'btn btn-ghost'
}

export function FeatureAlternant({ feature, date }: { feature: Feature; date: SiteData }) {
  return (
    <section className="feature" id={feature.id}>
      <div className="wrap">
        <div className="split" data-reverse={feature.reverse ? 'true' : undefined}>
          {feature.image && (
            <div className="split-media">
              <Image
                src={feature.image}
                alt={feature.title}
                width={720}
                height={560}
                sizes="(max-width: 820px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          )}
          <div className="split-body">
            {feature.eyebrow && <p className="eyebrow">{feature.eyebrow}</p>}
            <h2>{feature.title}</h2>
            {feature.text && <p className="lede">{feature.text}</p>}
            {feature.bullets.length > 0 && (
              <ul>
                {feature.bullets.map((b, i) => (
                  <li key={i}>
                    <Icon name="check" marime="sm" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {feature.ctas.length > 0 && (
              <div className="stack">
                {feature.ctas.map((c) =>
                  // Butonul de rezervare deschide calendarul (T64); restul
                  // sunt linkuri obișnuite către alte pagini.
                  esteExtern(c.href) ? (
                    <BtnRezervare key={c.href} date={date} clasa={butonClasa(c.variant)} eticheta={c.label} />
                  ) : (
                    <a key={c.href} className={butonClasa(c.variant)} href={c.href}>
                      {c.label}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Toate feature-urile la rând, sărind cele fără titlu. */
export function Features({ features, date }: { features: Feature[]; date: SiteData }) {
  if (!features.length) return null
  return (
    <>
      {features.map((f) => (
        <FeatureAlternant key={f.id} feature={f} date={date} />
      ))}
    </>
  )
}
