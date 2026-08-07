import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '@/components/Icon'
import { ComutatorLimba } from '@/components/ComutatorLimba'
import { BtnRezervare } from './BtnRezervare'
import type { SiteData } from '@/content/types'

/**
 * Antetul: logo, navigație, comutator de limbă, buton principal.
 *
 * Server Component. Se micșorează la scroll prin `.is-scrolled`, pusă
 * de `lib/reveal.ts` cu un IntersectionObserver pe sentinelă — nu cu un
 * listener de scroll (REGULI.md 11). Fără JavaScript, antetul rămâne
 * întreg și lipit, doar că nu se mai micșorează.
 *
 * `data-antet` și `data-antet-sentinela` sunt contractul cu reveal.ts.
 *
 * Zero text în română scris aici (REGULI.md, T06): eticheta butonului
 * vine din `booking.labels.submit`, linkurile din `nav`.
 *
 * `subiect` — numele camerei sau al ofertei, pe paginile lor: butonul
 * deschide WhatsApp cu mesajul deja scris despre exact acel produs.
 */
export function Antet({ date, subiect }: { date: SiteData; subiect?: string }) {
  const { brand, nav, locales } = date

  return (
    <>
      <a className="skip" href="#continut">
        Sări la conținut
      </a>

      <header className="site-header" data-antet>
        <div className="wrap nav">
          <Link className="logo" href="/" aria-label={`${brand.shortName || brand.name} — acasă`}>
            {brand.logo ? (
              /* Logo-ul are numele scris în el („BELVEDERE MURIGHIOL"), deci
                 nu mai punem `.logo-name` alături — ar fi numele de două ori.
                 `alt` îl duce mai departe la cititoarele de ecran și la Google. */
              <Image className="logo-img" src={brand.logo} alt={brand.name} width={72} height={56} priority />
            ) : (
              <>
                <span className="logo-mark" aria-hidden="true">
                  {brand.monogram}
                </span>
                <span className="logo-name">{brand.shortName || brand.name}</span>
              </>
            )}
          </Link>

          {nav.length > 0 && (
            <nav aria-label="Navigație principală">
              <ul className="nav-links">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="nav-cta">
            {locales.length > 1 && <ComutatorLimba locales={locales} />}
            <BtnRezervare date={date} subiect={subiect} />
            <button className="burger" type="button" aria-label="Meniu" aria-expanded="false">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Elementul de 1px pe care îl urmărește observerul din reveal.ts.
          Când iese din ecran, antetul primește `.is-scrolled`. */}
      <span data-antet-sentinela aria-hidden="true" />
    </>
  )
}
