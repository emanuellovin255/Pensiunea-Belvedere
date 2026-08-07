import type { Metadata } from 'next'

import { esteLimba, type Limba } from '@/lib/i18n/limbi'

/**
 * Politica de anulare / rambursare (T11). Trebuie să fie ACCESIBILĂ înainte de
 * orice pas de plată (standarde/02) — reduce ezitarea la rezervare. Condițiile
 * exacte (procent, termen) diferă de la locație la locație și se completează în
 * `date/`; aici e cadrul general și transparent.
 *
 * BILINGV (T69): vezi comentariul din `politica-cookies/page.tsx` — cele două
 * variante se modifică împreună, altfel una dintre ele minte.
 */
const META: Record<Limba, Metadata> = {
  ro: {
    title: 'Politica de anulare',
    description: 'În ce condiții poți anula o rezervare și cum se face rambursarea.',
  },
  en: {
    title: 'Cancellation policy',
    description: 'When you can cancel a booking and how the refund works.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string }>
}): Promise<Metadata> {
  const { limba } = await params
  return META[esteLimba(limba) ? limba : 'ro']
}

/** Titlul se randează o dată, în export — vezi `politica-cookies/page.tsx`. */
const TITLU: Record<Limba, { h1: string; actualizat: string }> = {
  ro: { h1: 'Politica de anulare', actualizat: 'Ultima actualizare: 5 august 2026' },
  en: { h1: 'Cancellation policy', actualizat: 'Last updated: 5 August 2026' },
}

function Ro() {
  return (
    <>
      <p>
        Vrem ca rezervarea să fie o decizie fără stres. Condițiile exacte de anulare se comunică clar
        la confirmarea rezervării, înainte de orice plată, și sunt cele care se aplică.
      </p>

      <h2>Anulare gratuită</h2>
      <p>
        De regulă, anularea este gratuită dacă ne anunți cu suficient timp înainte de data sosirii.
        Termenul exact (de exemplu, cu câteva zile înainte) îți este comunicat la confirmare și apare
        în e-mailul de rezervare.
      </p>

      <h2>Anulare târzie sau neprezentare</h2>
      <p>
        Pentru anulările făcute după termenul de gratuitate sau în caz de neprezentare, se poate
        reține o parte din sumă, conform condițiilor comunicate la rezervare. Nu reținem niciodată
        sume nedeclarate în prealabil.
      </p>

      <h2>Rambursare</h2>
      <p>
        Dacă ți se cuvine o rambursare, o facem prin aceeași metodă prin care ai plătit, în termenul
        legal. În această fază site-ul nu procesează plăți online; plata și eventuala rambursare se
        fac direct cu locația.
      </p>

      <h2>Cum anulezi</h2>
      <p>
        Ne anunți prin telefon sau e-mail, cu numele și perioada rezervării. Îți confirmăm anularea
        în scris.
      </p>
    </>
  )
}

function En() {
  return (
    <>
      <p>
        We want booking to be a decision without stress. The exact cancellation terms are stated
        clearly when the booking is confirmed, before any payment, and those are the terms that
        apply.
      </p>

      <h2>Free cancellation</h2>
      <p>
        As a rule, cancelling is free if you let us know far enough ahead of your arrival date. The
        exact deadline (a few days before, for example) is given to you at confirmation and appears
        in the booking e-mail.
      </p>

      <h2>Late cancellation or no-show</h2>
      <p>
        For cancellations made after the free-cancellation deadline, or in case of a no-show, part of
        the amount may be retained, under the terms stated at the time of booking. We never retain
        amounts that were not declared in advance.
      </p>

      <h2>Refunds</h2>
      <p>
        If a refund is due to you, we make it through the same method you paid with, within the legal
        deadline. At this stage the site does not process online payments; payment and any refund are
        handled directly with the guesthouse.
      </p>

      <h2>How to cancel</h2>
      <p>
        Let us know by phone or e-mail, with the name and the dates of the booking. We confirm the
        cancellation in writing.
      </p>
    </>
  )
}

export default async function PoliticaAnulare({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const l: Limba = limba === 'en' ? 'en' : 'ro'

  return (
    <>
      <h1>{TITLU[l].h1}</h1>
      <p className="legal-actualizat">{TITLU[l].actualizat}</p>
      {l === 'en' ? <En /> : <Ro />}
    </>
  )
}
