import Image from 'next/image'

import { BtnRezervare } from './BtnRezervare'
import type { Offer, SiteData } from '@/content/types'

/**
 * Pagina individuală a unei oferte sau a unui traseu de excursie (T61).
 *
 * Aceleași alegeri ca la `PaginaCamera`: Server Component, conținut în
 * HTML (REGULI.md 12), imaginea de sus e candidatul la LCP deci primește
 * `priority`, iar prețul se afișează doar dacă există (REGULI.md 3).
 *
 * Reia structura din `PaginaCamera` fără să forțeze o abstracție peste
 * două cazuri (T61): o cameră are facilități, o ofertă are un program
 * descriptiv — destul de diferite ca să rămână separate.
 *
 * Fără preț, butonul spune `labels.quote` („Cere ofertă"): un traseu de
 * excursie se cotează în funcție de vreme și de numărul de persoane,
 * deci nu se „verifică disponibilitatea" pentru el.
 */
export function PaginaOferta({ oferta, date }: { oferta: Offer; date: SiteData }) {

  return (
    <main id="continut">
      <article className="wrap" style={{ paddingBlock: 'var(--section-pad)' }}>
        <header className="sec-head">
          {oferta.badge && <p className="eyebrow">{oferta.badge}</p>}
          <h1>{oferta.title}</h1>
        </header>

        {oferta.image && (
          <div className="oferta-media" style={{ marginTop: 'var(--sp-6)' }}>
            <Image
              src={oferta.image}
              alt={oferta.title}
              width={1200}
              height={800}
              sizes="(max-width: 900px) 100vw, 900px"
              priority
              fetchPriority="high"
            />
          </div>
        )}

        {oferta.text && (
          <p className="lede" style={{ marginTop: 'var(--sp-8)', whiteSpace: 'pre-line' }}>
            {oferta.text}
          </p>
        )}

        <div
          className="card-foot"
          style={{ marginTop: 'var(--sp-8)', maxWidth: '420px', border: 'none', paddingTop: 0 }}
        >
          {oferta.price && (
            <div className="price">
              <b className="tabular">
                {oferta.price}
                {oferta.priceUnit && <em> {oferta.priceUnit}</em>}
              </b>
              {oferta.priceWas && <span className="was tabular">{oferta.priceWas}</span>}
            </div>
          )}
          <BtnRezervare
            date={date}
            subiect={oferta.title}
            eticheta={oferta.price ? undefined : date.booking.labels.quote}
          />
        </div>
      </article>
    </main>
  )
}
