import type { Metadata } from 'next'

import { type Limba } from '@/lib/i18n/limbi'
import { siteCurent } from '@/lib/site'

/**
 * Termeni și condiții (T11). Cadru pentru un site de PREZENTARE: rezervările se
 * fac prin sistemul locației sau prin contact direct, prețurile sunt orientative,
 * plata online nu există în această fază (apare la T13, când pagina se actualizează).
 */
export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: 'Condițiile de folosire a site-ului și de solicitare a unei rezervări.',
}

export default async function Termeni({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const { date } = siteCurent(limba as Limba)
  const { legal, brand } = date
  const firma = legal.company || brand.name

  return (
    <>
      <h1>Termeni și condiții</h1>
      <p className="legal-actualizat">Ultima actualizare: 5 august 2026</p>

      <h2>Cine suntem</h2>
      <p>
        Acest site este operat de {firma}
        {legal.registration ? ` (${legal.registration})` : ''}. Prin folosirea site-ului ești de
        acord cu termenii de mai jos.
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
