import { AmenitatiChips } from './AmenitatiChips'
import { BtnRezervare } from './BtnRezervare'
import { VideoVertical } from './VideoVertical'
import { pret } from '@/lib/format'
import { Icon } from '@/components/Icon'
import type { Room, SiteData } from '@/content/types'

/**
 * Pagina individuală a unei camere, generată per cameră (T07).
 *
 * Server Component pentru conținut; clipul e singura bucată client.
 * Aici aterizează căutările „apartament cu terasă zona X", de asta
 * conținutul — nume, preț, facilități — e livrat în HTML, nu din JS
 * (REGULI.md 12): un crawler care nu execută JavaScript trebuie să
 * vadă prețul.
 *
 * Pagina n-are galerie foto: clientul a cerut ca aici camera să se vadă
 * doar în clip. Fotografia rămâne pe cardul din listă și în JSON-LD.
 * Nu inventăm un preț dacă nu există (REGULI.md 3).
 */
export function PaginaCamera({ camera, date }: { camera: Room; date: SiteData }) {
  const { meta, booking } = date

  return (
    <main id="continut">
      <article className="wrap" style={{ paddingBlock: 'var(--section-pad)' }}>
        <header className="sec-head">
          <h1>{camera.name}</h1>
          <div className="meta" style={{ marginTop: 'var(--sp-4)' }}>
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
        </header>

        {camera.description && (
          <p className="lede" style={{ marginTop: 'var(--sp-8)' }}>
            {camera.description}
          </p>
        )}

        {camera.amenities.length > 0 && (
          <div style={{ marginTop: 'var(--sp-6)' }}>
            <h2 style={{ marginBottom: 'var(--sp-4)' }}>Ce include</h2>
            <AmenitatiChips amenitati={camera.amenities} />
          </div>
        )}

        <div
          className="card-foot"
          style={{ marginTop: 'var(--sp-8)', maxWidth: '420px', border: 'none', paddingTop: 0 }}
        >
          <div className="price">
            {camera.priceFrom !== undefined ? (
              <>
                <small>{booking.labels.from}</small>
                <b className="tabular">
                  {pret(camera.priceFrom, meta.currencySymbol)} <em>/ {booking.labels.perNight}</em>
                </b>
              </>
            ) : (
              <span className="price-ask">{booking.labels.submit}</span>
            )}
          </div>
          <BtnRezervare date={date} subiect={camera.name} />
        </div>

        {/* Clipul camerei — ULTIMUL bloc din pagină, sub preț și buton.
            Poziția e cerință explicită de la client (T60), nu preferință. */}
        {camera.video && camera.videoPoster && (
          <div style={{ marginTop: 'var(--sp-10)' }}>
            <VideoVertical
              src={camera.video}
              poster={camera.videoPoster}
              eticheta={camera.name}
            />
          </div>
        )}
      </article>
    </main>
  )
}
