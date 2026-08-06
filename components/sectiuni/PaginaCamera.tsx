import { AmenitatiChips } from './AmenitatiChips'
import { Galerie } from './Galerie'
import { VideoVertical } from './VideoVertical'
import { pret } from '@/lib/format'
import { Icon } from '@/components/Icon'
import type { Room, SiteData } from '@/content/types'

/**
 * Pagina individuală a unei camere, generată per cameră (T07).
 *
 * Server Component pentru conținut; galeria e singura bucată client.
 * Aici aterizează căutările „apartament cu terasă zona X", de asta
 * conținutul — nume, preț, facilități — e livrat în HTML, nu din JS
 * (REGULI.md 12): un crawler care nu execută JavaScript trebuie să
 * vadă prețul.
 *
 * Prima poză e candidatul la LCP al paginii, deci primește `priority`
 * prin galerie; nu inventăm un preț dacă nu există (REGULI.md 3).
 */
export function PaginaCamera({ camera, date }: { camera: Room; date: SiteData }) {
  const { meta, booking } = date
  const imagini = camera.images?.length ? camera.images : camera.image ? [camera.image] : []

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

        {imagini.length > 0 && <Galerie imagini={imagini} titluri={imagini.map(() => camera.name)} />}

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
          <a className="btn btn-primary" href="/#rezervare">
            {booking.labels.submit}
          </a>
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
