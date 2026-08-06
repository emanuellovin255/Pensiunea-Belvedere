import type { Metadata } from 'next'

/**
 * Politica de anulare / rambursare (T11). Trebuie să fie ACCESIBILĂ înainte de
 * orice pas de plată (standarde/02) — reduce ezitarea la rezervare. Condițiile
 * exacte (procent, termen) diferă de la locație la locație și se completează în
 * `date/`; aici e cadrul general și transparent.
 */
export const metadata: Metadata = {
  title: 'Politica de anulare',
  description: 'În ce condiții poți anula o rezervare și cum se face rambursarea.',
}

export default function PoliticaAnulare() {
  return (
    <>
      <h1>Politica de anulare</h1>
      <p className="legal-actualizat">Ultima actualizare: 5 august 2026</p>

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
