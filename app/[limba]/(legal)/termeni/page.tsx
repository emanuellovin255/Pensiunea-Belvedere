import type { Metadata } from 'next'

import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { siteCurent } from '@/lib/site'

/**
 * Termeni și condiții (T11). Cadru pentru un site de PREZENTARE: rezervările se
 * fac prin sistemul locației sau prin contact direct, prețurile sunt orientative,
 * plata online nu există în această fază (apare la T13, când pagina se actualizează).
 *
 * BILINGV (T69): vezi comentariul din `politica-cookies/page.tsx`. Datele firmei
 * (`firma`, `legal.registration`) NU se traduc — sunt dintr-un registru public.
 */
const META: Record<Limba, Metadata> = {
  ro: {
    title: 'Termeni și condiții',
    description: 'Condițiile de folosire a site-ului și de solicitare a unei rezervări.',
  },
  en: {
    title: 'Terms and conditions',
    description: 'The terms for using this site and for requesting a booking.',
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

interface Firma {
  firma: string
  inregistrare?: string
}

/** Titlul se randează o dată, în export — vezi `politica-cookies/page.tsx`. */
const TITLU: Record<Limba, { h1: string; actualizat: string }> = {
  ro: { h1: 'Termeni și condiții', actualizat: 'Ultima actualizare: 5 august 2026' },
  en: { h1: 'Terms and conditions', actualizat: 'Last updated: 5 August 2026' },
}

function Ro({ firma, inregistrare }: Firma) {
  return (
    <>
      <h2>Cine suntem</h2>
      <p>
        Acest site este operat de {firma}
        {inregistrare ? ` (${inregistrare})` : ''}. Prin folosirea site-ului ești de acord cu
        termenii de mai jos.
      </p>

      <h2>Ce oferă site-ul</h2>
      <p>
        Site-ul prezintă locația de cazare și îți permite să trimiți o cerere de rezervare prin
        formular sau să folosești sistemul de rezervări al locației. Fotografiile și descrierile sunt
        orientative; disponibilitatea și prețul final se confirmă la rezervare.
      </p>

      <h2>Cereri și rezervări</h2>
      <p>
        Trimiterea formularului este o cerere, nu o rezervare confirmată. Rezervarea devine fermă
        doar după confirmarea locației, în condițiile comunicate atunci. În această fază, plata nu se
        face pe site: se achită conform înțelegerii directe cu locația.
      </p>

      <h2>Prețuri</h2>
      <p>
        Prețurile afișate sunt informative și pot varia în funcție de perioadă, durată și
        disponibilitate. Prețul care contează este cel confirmat de locație la rezervare; nicio sumă
        introdusă în pagină nu obligă locația.
      </p>

      <h2>Proprietate intelectuală</h2>
      <p>
        Textele, imaginile și elementele de design ale site-ului aparțin {firma} sau sunt folosite cu
        acordul titularilor. Nu pot fi reproduse fără permisiune.
      </p>

      <h2>Răspundere</h2>
      <p>
        Depunem eforturi rezonabile ca informațiile să fie corecte și actuale, dar nu garantăm
        absența oricărei erori. Site-ul poate fi indisponibil temporar din motive tehnice.
      </p>

      <h2>Lege aplicabilă și soluționarea litigiilor</h2>
      <p>
        Acestor termeni li se aplică legea română. Eventualele neînțelegeri se rezolvă pe cale
        amiabilă; în caz contrar, sunt competente instanțele din România. Poți apela și la{' '}
        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
          ANPC
        </a>{' '}
        sau la platforma europeană de{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          soluționare online a litigiilor (SOL)
        </a>
        .
      </p>
    </>
  )
}

function En({ firma, inregistrare }: Firma) {
  return (
    <>
      <h2>Who we are</h2>
      <p>
        This site is operated by {firma}
        {inregistrare ? ` (${inregistrare})` : ''}. By using the site you agree to the terms below.
      </p>

      <h2>What the site offers</h2>
      <p>
        The site presents the guesthouse and lets you send a booking request through the form, or use
        the guesthouse&apos;s own booking system. Photographs and descriptions are indicative;
        availability and the final price are confirmed when you book.
      </p>

      <h2>Requests and bookings</h2>
      <p>
        Submitting the form is a request, not a confirmed booking. A booking becomes firm only after
        the guesthouse confirms it, under the terms stated at that point. At this stage payment is
        not made on the site: it is settled directly with the guesthouse, as agreed.
      </p>

      <h2>Prices</h2>
      <p>
        Displayed prices are indicative and can vary with the season, the length of stay and
        availability. The price that counts is the one confirmed by the guesthouse when you book; no
        amount shown on a page binds the guesthouse.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The texts, images and design elements of the site belong to {firma} or are used with the
        rights holders&apos; permission. They may not be reproduced without permission.
      </p>

      <h2>Liability</h2>
      <p>
        We make reasonable efforts to keep the information correct and up to date, but we do not
        guarantee the absence of every error. The site may be temporarily unavailable for technical
        reasons.
      </p>

      <h2>Applicable law and dispute resolution</h2>
      <p>
        These terms are governed by Romanian law. Any disagreement is settled amicably where
        possible; failing that, the Romanian courts have jurisdiction. You may also turn to{' '}
        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
          ANPC
        </a>
        , the Romanian consumer protection authority, or to the European{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          online dispute resolution (ODR) platform
        </a>
        .
      </p>
    </>
  )
}

export default async function Termeni({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const { date } = siteCurent(esteLimba(limba) ? limba : 'ro')
  const { legal, brand } = date
  const props: Firma = { firma: legal.company || brand.name, inregistrare: legal.registration }
  const l: Limba = limba === 'en' ? 'en' : 'ro'

  return (
    <>
      <h1>{TITLU[l].h1}</h1>
      <p className="legal-actualizat">{TITLU[l].actualizat}</p>
      {l === 'en' ? <En {...props} /> : <Ro {...props} />}
    </>
  )
}
